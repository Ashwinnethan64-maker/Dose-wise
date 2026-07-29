using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

class CropAssets {
    static void Main() {
        string srcPath = @"Z:\Dose wise 2.0\Dose-wise\public\Dose_wise.ico";
        string outDir = @"Z:\Dose wise 2.0\Dose-wise\public";
        string srcAssetsDir = @"Z:\Dose wise 2.0\Dose-wise\src\assets";
        
        Directory.CreateDirectory(srcAssetsDir);

        using (Bitmap src = new Bitmap(srcPath)) {
            // 1. Full Horizontal Logo (bottom right badge or main left logo without tagline)
            // Main left area: Logo mark + text "Dosewise AI" + tagline.
            // Let's crop exact bounding boxes.
            
            // Full Horizontal Logo (Badge / Banner box bottom right: X ~ 860, Y ~ 788, W ~ 580, H ~ 168)
            // Or top left main logo + text: X ~ 110, Y ~ 170, W ~ 650, H ~ 400
            // Let's crop clean components.
            
            // Main Horizontal Logo (Mark + Text) from bottom right card:
            // Card bounding box: X=860, Y=788, W=578, H=168 (in 1536x1024 coordinate space)
            // Inside card: Icon + Text "Dosewise AI"
            // Logo Mark (Pill icon with foliage & pixels): X=110, Y=170, W=480, H=450
            // Main Logo with text "Dosewise AI" (without tagline):
            
            // Crop Logo Mark (square icon): X=260, Y=170, W=320, H=320
            // Let's crop App Icon (Square rounded tile top right): X=860, Y=130, W=292, H=292
            
            CropAndSave(src, 860, 788, 578, 168, Path.Combine(outDir, "logo-horizontal-card.png"));
            
            // Horizontal logo (Icon + Text "Dosewise AI"):
            // Left main logo area:
            // Mark + text + tagline: X=115, Y=170, W=650, H=450
            // Pure Horizontal Logo (Mark + Text "Dosewise AI"):
            // Let's extract:
            // Mark (pill + circle + leaf + pixels): X=268, Y=170, W=314, H=290
            // Let's crop the horizontal logo from the bottom right card without extra whitespace:
            CropAndSave(src, 878, 804, 435, 134, Path.Combine(srcAssetsDir, "logo-horizontal.png"));
            CropAndSave(src, 878, 804, 435, 134, Path.Combine(outDir, "logo-horizontal.png"));

            // Square App Icon (from top right App Icon display, clean square badge):
            // Center of rounded tile: X=860, Y=130, W=292, H=292
            CropAndSave(src, 860, 130, 292, 292, Path.Combine(srcAssetsDir, "app-icon.png"));
            CropAndSave(src, 860, 130, 292, 292, Path.Combine(outDir, "app-icon.png"));

            // Favicons from Favicon section or app icon:
            // High-res square icon for favicons (512x512, 192x192, 32x32, 16x16, apple-touch-icon):
            Bitmap appIcon = Crop(src, 860, 130, 292, 292);

            SaveResized(appIcon, 512, 512, Path.Combine(outDir, "android-chrome-512x512.png"));
            SaveResized(appIcon, 192, 192, Path.Combine(outDir, "android-chrome-192x192.png"));
            SaveResized(appIcon, 180, 180, Path.Combine(outDir, "apple-touch-icon.png"));
            SaveResized(appIcon, 32, 32, Path.Combine(outDir, "favicon-32x32.png"));
            SaveResized(appIcon, 16, 16, Path.Combine(outDir, "favicon-16x16.png"));
            
            // Icon file favicon.ico
            using (Bitmap ico32 = Resize(appIcon, 32, 32)) {
                ico32.Save(Path.Combine(outDir, "favicon.ico"), ImageFormat.Icon);
            }

            Console.WriteLine("Assets cropped and generated successfully!");
        }
    }

    static Bitmap Crop(Bitmap src, int x, int y, int w, int h) {
        Bitmap target = new Bitmap(w, h);
        using (Graphics g = Graphics.FromImage(target)) {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawImage(src, new Rectangle(0, 0, w, h), new Rectangle(x, y, w, h), GraphicsUnit.Pixel);
        }
        return target;
    }

    static void CropAndSave(Bitmap src, int x, int y, int w, int h, string outputPath) {
        using (Bitmap bmp = Crop(src, x, y, w, h)) {
            bmp.Save(outputPath, ImageFormat.Png);
        }
    }

    static Bitmap Resize(Bitmap src, int width, int height) {
        Bitmap target = new Bitmap(width, height);
        using (Graphics g = Graphics.FromImage(target)) {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawImage(src, 0, 0, width, height);
        }
        return target;
    }

    static void SaveResized(Bitmap src, int width, int height, string outputPath) {
        using (Bitmap resized = Resize(src, width, height)) {
            resized.Save(outputPath, ImageFormat.Png);
        }
    }
}
