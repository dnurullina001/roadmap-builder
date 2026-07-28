/**
 * Records the Вектор demo video by navigating to the /video route,
 * capturing frames via CDP Page.screencast, then encoding to MP4 with ffmpeg.
 * Ambient music is synthesised by ffmpeg and mixed in.
 *
 * Usage:  node scripts/record-video.mjs
 * Output: vektor-demo.mp4  (in workspace root)
 */

import puppeteer from 'puppeteer-core';
import { spawn, execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const CHROMIUM = '/nix/store/0n9rl5l9syy808xi9bk4f6dhnfrvhkww-playwright-browsers-chromium/chromium-1080/chrome-linux/chrome';
const VIDEO_URL = 'http://localhost:22022/video';
const FRAMES_DIR = '/tmp/vektor-frames';
const SILENT_MP4 = '/tmp/vektor-silent.mp4';
const OUTPUT = '/home/runner/workspace/vektor-demo.mp4';
const WIDTH = 1280;
const HEIGHT = 720;
// Total: 5000+10000+9000+5500+5000+6000 = 40500ms + 2s buffer
const TOTAL_MS = 40500 + 2000;
const SCREENCAST_FPS = 25;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function main() {
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true });
  mkdirSync(FRAMES_DIR, { recursive: true });

  console.log('Launching Chromium...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  let frameIndex = 0;
  const client = await page.createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: WIDTH,
    maxHeight: HEIGHT,
    everyNthFrame: 1,
  });

  client.on('Page.screencastFrame', async (event) => {
    const frameFile = join(FRAMES_DIR, `frame${String(frameIndex).padStart(6, '0')}.jpg`);
    writeFileSync(frameFile, Buffer.from(event.data, 'base64'));
    frameIndex++;
    await client.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });

  console.log(`Navigating to ${VIDEO_URL}...`);
  await page.goto(VIDEO_URL, { waitUntil: 'networkidle0', timeout: 30000 });

  console.log(`Recording for ${TOTAL_MS / 1000}s...`);
  await new Promise((resolve) => setTimeout(resolve, TOTAL_MS));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`Captured ${frameIndex} frames. Encoding silent video...`);

  // Step 1: encode frames to silent MP4
  await run('ffmpeg', [
    '-y',
    '-framerate', String(SCREENCAST_FPS),
    '-i', join(FRAMES_DIR, 'frame%06d.jpg'),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    SILENT_MP4,
  ]);

  // Step 2: synthesise ambient corporate music.
  // Use multiple sine sources mixed together: A2(110) + E3(165) + A3(220) + C#4(275) + E4(330)
  // with fade-in/out applied via afade filter.
  const totalSec = TOTAL_MS / 1000;
  console.log('Synthesising ambient background music...');
  // Build individual sine inputs and mix them via spawn (no shell → brackets safe)
  const freqs = [110, 165, 220, 275, 330];
  const vols  = [0.26, 0.22, 0.20, 0.16, 0.12];
  const sineInputs = freqs.flatMap((f) => ['-f', 'lavfi', '-i', `sine=frequency=${f}:duration=${totalSec}`]);
  const mixInputs = freqs.map((_, i) => `[${i}:a]volume=${vols[i]}[a${i}]`).join(';');
  const mergedLabels = freqs.map((_, i) => `[a${i}]`).join('');
  const fadeOut = (totalSec - 4).toFixed(1);
  const filterComplex = `${mixInputs};${mergedLabels}amix=inputs=${freqs.length}[mix];[mix]afade=t=in:st=0:d=3,afade=t=out:st=${fadeOut}:d=4[out]`;
  await run('ffmpeg', [
    '-y', ...sineInputs,
    '-filter_complex', filterComplex,
    '-map', '[out]',
    '-t', String(totalSec),
    '-c:a', 'aac', '-b:a', '128k',
    '/tmp/vektor-music.aac',
  ]);

  // Step 3: mix silent video + audio → final MP4
  console.log('Mixing video and audio...');
  await run('ffmpeg', [
    '-y',
    '-i', SILENT_MP4,
    '-i', '/tmp/vektor-music.aac',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    '-movflags', '+faststart',
    OUTPUT,
  ]);

  // Cleanup
  rmSync(FRAMES_DIR, { recursive: true });

  console.log(`\n✓ Video with music saved to: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
