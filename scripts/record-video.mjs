/**
 * Records the Вектор demo video by navigating to the /video route,
 * capturing frames via CDP Page.screencast, then encoding to MP4 with ffmpeg.
 *
 * Usage:  node scripts/record-video.mjs
 * Output: vektor-demo.mp4  (in workspace root)
 */

import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const CHROMIUM = '/nix/store/0n9rl5l9syy808xi9bk4f6dhnfrvhkww-playwright-browsers-chromium/chromium-1080/chrome-linux/chrome';
const VIDEO_URL = 'http://localhost:22022/video';
const FRAMES_DIR = '/tmp/vektor-frames';
const OUTPUT = '/home/runner/workspace/vektor-demo.mp4';
const WIDTH = 1280;
const HEIGHT = 720;
// Total video duration: 4500+7000+6000+5500+5000+6000+5000 = 39000ms + 2s buffer
const TOTAL_MS = 39000 + 2000;

// CDP screencast captures ~10fps by default; we request max quality at 1280px
const SCREENCAST_FPS = 25;

async function main() {
  // Clean up frames directory
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

  const frames = [];
  let frameIndex = 0;

  // Attach CDP session for screencast
  const client = await page.createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
    maxWidth: WIDTH,
    maxHeight: HEIGHT,
    everyNthFrame: 1,
  });

  client.on('Page.screencastFrame', async (event) => {
    const frameFile = join(FRAMES_DIR, `frame${String(frameIndex).padStart(6, '0')}.jpg`);
    writeFileSync(frameFile, Buffer.from(event.data, 'base64'));
    frames.push(frameFile);
    frameIndex++;
    // Acknowledge the frame so Chrome keeps sending
    await client.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });

  console.log(`Navigating to ${VIDEO_URL}...`);
  await page.goto(VIDEO_URL, { waitUntil: 'networkidle0', timeout: 30000 });

  console.log(`Recording for ${TOTAL_MS / 1000}s...`);
  await new Promise((resolve) => setTimeout(resolve, TOTAL_MS));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`Captured ${frames.length} frames. Encoding to MP4...`);

  if (frames.length === 0) {
    console.error('No frames captured!');
    process.exit(1);
  }

  // Encode with ffmpeg
  // Use actual frame timestamps from screencast (variable fps) → convert via concat
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-framerate', String(SCREENCAST_FPS),
      '-i', join(FRAMES_DIR, 'frame%06d.jpg'),
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      OUTPUT,
    ], { stdio: 'inherit' });

    ffmpeg.on('close', (code) => {
      if (code === 0) resolve(null);
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  // Clean up frames
  rmSync(FRAMES_DIR, { recursive: true });

  console.log(`\n✓ Video saved to: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
