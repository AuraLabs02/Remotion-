// Exports the SFX cue sheet (src/audio/cues.ts) to scripts/cues.json so the
// Python mixer can place every sound on its frame.
import {buildSync} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const out = path.resolve('node_modules/.cache/cues.cjs');
fs.mkdirSync(path.dirname(out), {recursive: true});
buildSync({entryPoints: ['src/audio/cues.ts'], bundle: true, platform: 'node', format: 'cjs', outfile: out, logLevel: 'error'});
const require = createRequire(import.meta.url);
const {CUES} = require(out);
fs.writeFileSync('scripts/cues.json', JSON.stringify({fps: 30, cues: CUES}, null, 1));
console.log(`exported ${CUES.length} cues → scripts/cues.json`);
