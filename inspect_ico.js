import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buf = fs.readFileSync(path.join(__dirname, 'public', 'Dose_wise.ico'));

console.log('Buffer length:', buf.length);
console.log('Magic bytes (hex):', buf.subarray(0, 16).toString('hex'));

// Check for PNG magic numbers inside buf (89 50 4e 47 0d 0a 1a 0a)
let pngOffsets = [];
for (let i = 0; i < buf.length - 8; i++) {
    if (buf[i] === 0x89 && buf[i+1] === 0x50 && buf[i+2] === 0x4e && buf[i+3] === 0x47 &&
        buf[i+4] === 0x0d && buf[i+5] === 0x0a && buf[i+6] === 0x1a && buf[i+7] === 0x0a) {
        pngOffsets.push(i);
    }
}
console.log('PNG offsets found:', pngOffsets);
