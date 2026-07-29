import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const FRAMES_DIR = '/tmp/vektor-frames';
const OUTPUT_MP4 = '/tmp/vektor-demo.mp4';
const FPS = 25;
const DURATION_S = 50; // total duration (video is ~48s)
const TOTAL_FRAMES = FPS * DURATION_S;
const INTERVAL_MS = 1000 / FPS;
const WIDTH = 1280;
const HEIGHT = 720;

// Clean up frames dir
if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR, { recursive: true });

console.log('Launching browser...');
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

console.log('Navigating to /video ...');
await page.goto('http://localhost:4173/video', { waitUntil: 'networkidle' });

// Wait a moment for animations to initialize
await page.waitForTimeout(800);

console.log(`Capturing ${TOTAL_FRAMES} frames at ${FPS}fps...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const framePath = path.join(FRAMES_DIR, `frame-${String(i).padStart(5, '0')}.jpg`);
  await page.screenshot({ path: framePath, type: 'jpeg', quality: 92 });

  if (i % (FPS * 5) === 0) {
    console.log(`  ${i}/${TOTAL_FRAMES} frames (${Math.round(i / FPS)}s elapsed)`);
  }

  // Wait for next frame tick
  if (i < TOTAL_FRAMES - 1) {
    await page.waitForTimeout(INTERVAL_MS);
  }
}

await browser.close();

console.log('Encoding MP4 with ffmpeg...');
execSync(
  `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame-%05d.jpg" ` +
  `-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p ` +
  `-vf "scale=${WIDTH}:${HEIGHT}" "${OUTPUT_MP4}"`,
  { stdio: 'inherit' }
);

// Clean up frames
fs.rmSync(FRAMES_DIR, { recursive: true });

const sizeMb = (fs.statSync(OUTPUT_MP4).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Done! ${OUTPUT_MP4} (${sizeMb} MB)`);
