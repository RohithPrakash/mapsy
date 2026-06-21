import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kmlPath = path.resolve(__dirname, '../2026-06-14_09_37_47.051_2026-06-14 at cubbon.kml');
const kmlText = fs.readFileSync(kmlPath, 'utf8');

const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome-stable' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
let pageError = null;
page.on('pageerror', err => { pageError = err.message; console.error('PAGE ERROR:', err.message); });
page.on('console', msg => { console.log('CONSOLE:', msg.type(), msg.text()); });

await page.goto('http://localhost:8765/index.html', { waitUntil: 'load' });
await page.evaluate(text => { loadTrack(text); }, kmlText);

// Open preview panel
await page.click('#btn-share-preview');
const panelVisible = await page.evaluate(() => !document.getElementById('preview-panel').classList.contains('hidden'));
assert.strictEqual(panelVisible, true);

// Select Dark Matter, 3s, webm
await page.selectOption('#preview-basemap', 'dark');
await page.selectOption('#preview-duration', '3');
await page.selectOption('#preview-format', 'webm');

// Generate preview
await page.click('#btn-preview-generate');
await page.waitForTimeout(2000);
const modalVisible = await page.evaluate(() => document.getElementById('preview-modal').classList.contains('visible'));
assert.strictEqual(modalVisible, true);

// Canvas should not be blank
const canvasNonBlank = await page.evaluate(() => {
  const ctx = previewCanvas.getContext('2d');
  const data = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== 0 || data[i+1] !== 0 || data[i+2] !== 0) return true;
  }
  return false;
});
assert.strictEqual(canvasNonBlank, true);

// Download webm
await page.click('#btn-preview-download');
await page.waitForFunction(() => !!lastPreviewBlob, { timeout: 120000 });
const ext = await page.evaluate(() => lastPreviewExt);
assert.strictEqual(ext, 'webm');

console.log('Preview smoke test passed', { pageError, ext });
await browser.close();
