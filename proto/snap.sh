#!/usr/bin/env bash
# proto/snap.sh <D|E|F> <t1,t2,...>  → frames at those times + one contact sheet (proto/<X>/snapshots/sheet.jpg)
set -e
cd "$(dirname "$0")/$1"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=/home/meshg/.local/chromelibs/root/usr/lib/x86_64-linux-gnu
export TMPDIR=${TMPDIR_PROTO:-/home/meshg/sandbox/wr_tmp/proto_a62e}; mkdir -p "$TMPDIR"
unset GEMINI_API_KEY GOOGLE_API_KEY OPENROUTER_API_KEY
rm -rf snapshots
/home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes snapshot --at "$2" --no-end --describe false --timeout 20000 >/dev/null 2>&1 || \
  /home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes snapshot --at "$2" --no-end --describe false --timeout 20000
../../.venv/bin/python - "$2" <<'EOF'
import sys, glob, os
from PIL import Image, ImageDraw
fs = sorted(glob.glob('snapshots/frame-*.png'))
ims = [Image.open(f).convert('RGB').resize((270, 480)) for f in fs]
ts = sys.argv[1].split(',')
cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
c = Image.new('RGB', (cols * 274, rows * 504), (40, 40, 40)); d = ImageDraw.Draw(c)
for i, im in enumerate(ims):
    x, y = (i % cols) * 274, (i // cols) * 504; c.paste(im, (x, y + 22)); d.text((x + 4, y + 4), (ts[i] if i < len(ts) else '') + '  ' + os.path.basename(fs[i]), fill='white')
c.save('snapshots/sheet.jpg', quality=88); print('snapshots/sheet.jpg', len(ims))
EOF
