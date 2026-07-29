import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, 'public', 'Dose_wise.ico');
const outPublic = path.join(__dirname, 'public');
const outAssets = path.join(__dirname, 'src', 'assets');

fs.createReadStream(srcPath)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function() {
        function crop(x, y, width, height) {
            const cropped = new PNG({ width, height });
            for (let cy = 0; cy < height; cy++) {
                for (let cx = 0; cx < width; cx++) {
                    const srcX = Math.min(Math.max(0, Math.round(x + cx)), 1535);
                    const srcY = Math.min(Math.max(0, Math.round(y + cy)), 1023);
                    const srcIdx = (1536 * srcY + srcX) << 2;
                    const dstIdx = (width * cy + cx) << 2;
                    cropped.data[dstIdx] = this.data[srcIdx];
                    cropped.data[dstIdx + 1] = this.data[srcIdx + 1];
                    cropped.data[dstIdx + 2] = this.data[srcIdx + 2];
                    cropped.data[dstIdx + 3] = this.data[srcIdx + 3];
                }
            }
            return cropped;
        }

        function removeWhiteBackground(png) {
            const transparentPng = new PNG({ width: png.width, height: png.height });
            for (let i = 0; i < png.data.length; i += 4) {
                const r = png.data[i];
                const g = png.data[i + 1];
                const b = png.data[i + 2];
                if (r > 235 && g > 235 && b > 235) {
                    transparentPng.data[i] = 0;
                    transparentPng.data[i + 1] = 0;
                    transparentPng.data[i + 2] = 0;
                    transparentPng.data[i + 3] = 0;
                } else {
                    transparentPng.data[i] = r;
                    transparentPng.data[i + 1] = g;
                    transparentPng.data[i + 2] = b;
                    transparentPng.data[i + 3] = png.data[i + 3];
                }
            }
            return transparentPng;
        }

        function autoCropWithMargin(png, margin = 4) {
            let minX = png.width, minY = png.height, maxX = 0, maxY = 0;
            for (let y = 0; y < png.height; y++) {
                for (let x = 0; x < png.width; x++) {
                    const idx = (png.width * y + x) << 2;
                    if (png.data[idx + 3] > 0) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (minX > maxX || minY > maxY) return png;

            minX = Math.max(0, minX - margin);
            minY = Math.max(0, minY - margin);
            maxX = Math.min(png.width - 1, maxX + margin);
            maxY = Math.min(png.height - 1, maxY + margin);

            const w = maxX - minX + 1;
            const h = maxY - minY + 1;
            const cropped = new PNG({ width: w, height: h });
            for (let cy = 0; cy < h; cy++) {
                for (let cx = 0; cx < w; cx++) {
                    const srcIdx = (png.width * (minY + cy) + (minX + cx)) << 2;
                    const dstIdx = (w * cy + cx) << 2;
                    cropped.data[dstIdx] = png.data[srcIdx];
                    cropped.data[dstIdx + 1] = png.data[srcIdx + 1];
                    cropped.data[dstIdx + 2] = png.data[srcIdx + 2];
                    cropped.data[dstIdx + 3] = png.data[srcIdx + 3];
                }
            }
            return cropped;
        }

        function createDarkThemeVersion(png) {
            const darkPng = new PNG({ width: png.width, height: png.height });
            for (let i = 0; i < png.data.length; i += 4) {
                const r = png.data[i];
                const g = png.data[i + 1];
                const b = png.data[i + 2];
                const a = png.data[i + 3];

                if (a > 0) {
                    // Exact check: if pixel is not part of cyan/teal (r > g or g - r < 40), then it's dark text!
                    // Teal pill icon & cyan AI text have G > 120 and G > R + 40.
                    const isCyanTeal = (g > 90 && (g - r) > 30);
                    if (!isCyanTeal) {
                        darkPng.data[i] = 255;
                        darkPng.data[i + 1] = 255;
                        darkPng.data[i + 2] = 255;
                        darkPng.data[i + 3] = a;
                    } else {
                        darkPng.data[i] = r;
                        darkPng.data[i + 1] = g;
                        darkPng.data[i + 2] = b;
                        darkPng.data[i + 3] = a;
                    }
                } else {
                    darkPng.data[i] = 0;
                    darkPng.data[i + 1] = 0;
                    darkPng.data[i + 2] = 0;
                    darkPng.data[i + 3] = 0;
                }
            }
            return darkPng;
        }

        function savePng(png, filepath) {
            const buffer = PNG.sync.write(png);
            fs.writeFileSync(filepath, buffer);
        }

        function resizeNearest(srcPng, targetW, targetH) {
            const resized = new PNG({ width: targetW, height: targetH });
            for (let y = 0; y < targetH; y++) {
                for (let x = 0; x < targetW; x++) {
                    const srcX = Math.floor((x / targetW) * srcPng.width);
                    const srcY = Math.floor((y / targetH) * srcPng.height);
                    const srcIdx = (srcPng.width * srcY + srcX) << 2;
                    const dstIdx = (targetW * y + x) << 2;
                    resized.data[dstIdx] = srcPng.data[srcIdx];
                    resized.data[dstIdx + 1] = srcPng.data[srcIdx + 1];
                    resized.data[dstIdx + 2] = srcPng.data[srcIdx + 2];
                    resized.data[dstIdx + 3] = srcPng.data[srcIdx + 3];
                }
            }
            return resized;
        }

        // 1. HORIZONTAL LOGO LIGHT: Start X=868 Y=796:
        const rawHorizontal = crop.call(this, 868, 796, 450, 84);
        const transHorizontalLight = autoCropWithMargin(removeWhiteBackground(rawHorizontal), 6);
        savePng(transHorizontalLight, path.join(outAssets, 'logo-light.png'));
        savePng(transHorizontalLight, path.join(outPublic, 'logo-light.png'));
        savePng(transHorizontalLight, path.join(outAssets, 'logo-horizontal.png'));
        savePng(transHorizontalLight, path.join(outPublic, 'logo-horizontal.png'));

        // 2. HORIZONTAL LOGO DARK (Pure solid white text):
        const transHorizontalDark = createDarkThemeVersion(transHorizontalLight);
        savePng(transHorizontalDark, path.join(outAssets, 'logo-dark.png'));
        savePng(transHorizontalDark, path.join(outPublic, 'logo-dark.png'));

        // 3. TRANSPARENT FAVICON:
        const rawPillMark = crop.call(this, 268, 170, 314, 290);
        const purePillIcon = autoCropWithMargin(removeWhiteBackground(rawPillMark), 6);
        
        savePng(resizeNearest(purePillIcon, 512, 512), path.join(outPublic, 'android-chrome-512x512.png'));
        savePng(resizeNearest(purePillIcon, 192, 192), path.join(outPublic, 'android-chrome-192x192.png'));
        savePng(resizeNearest(purePillIcon, 192, 192), path.join(outPublic, 'android-chrome-192.png'));
        savePng(resizeNearest(purePillIcon, 180, 180), path.join(outPublic, 'apple-touch-icon.png'));
        savePng(resizeNearest(purePillIcon, 32, 32), path.join(outPublic, 'favicon-32x32.png'));
        savePng(resizeNearest(purePillIcon, 16, 16), path.join(outPublic, 'favicon-16x16.png'));

        console.log('Crisp pure white dark mode logo generated!');
    });
