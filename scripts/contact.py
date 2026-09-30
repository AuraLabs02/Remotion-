"""Tile review stills into one contact sheet.

usage: python3 scripts/contact.py <dir> <out.jpg> [cols] [--clean] [--tile WIDTH]
  --clean      no frame-number labels
  --tile W     resize each still to W px wide first
"""
import glob
import os
import sys

from PIL import Image, ImageDraw

args = [a for a in sys.argv[1:]]
clean = '--clean' in args
tile = None
if '--tile' in args:
    i = args.index('--tile')
    tile = int(args[i + 1])
    del args[i:i + 2]
args = [a for a in args if a != '--clean']
d, out = args[0], args[1]
cols = int(args[2]) if len(args) > 2 else 3
files = sorted(glob.glob(os.path.join(d, 'f*.jpg')))
ims = [Image.open(f).convert('RGB') for f in files]
if tile:
    ims = [im.resize((tile, round(im.height * tile / im.width)), Image.LANCZOS) for im in ims]
w, h = ims[0].size
gap = 6 if clean else 0
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w + (cols - 1) * gap, rows * h + (rows - 1) * gap), (10, 10, 14))
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * (w + gap), (i // cols) * (h + gap)
    sheet.paste(im, (x, y))
    if not clean:
        dr.rectangle([x, y, x + 70, y + 22], fill=(0, 0, 0))
        dr.text((x + 6, y + 5), os.path.basename(f)[1:5], fill=(255, 255, 0))
sheet.save(out, quality=86)
print(out, sheet.size)
