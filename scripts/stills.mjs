// Render review stills for a list of frames with one bundle.
// usage: node scripts/stills.mjs <outDir> <scale> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, scaleArg, ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({serveUrl, id: 'MembershipReel', browserExecutable});
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.jpg`);
  await renderStill({composition, serveUrl, output, frame: Number(f), scale: Number(scaleArg), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  console.log('rendered', output);
}
