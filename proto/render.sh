#!/usr/bin/env bash
# proto/render.sh D E F  → proto/<X>/renders/<X>.mp4 (HyperFrames, 30 fps) → silent copy (no audio track) proto/<X>/renders/<X>_silent.mp4
set -e
cd "$(dirname "$0")"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=/home/meshg/.local/chromelibs/root/usr/lib/x86_64-linux-gnu
export TMPDIR=${TMPDIR_PROTO:-/home/meshg/sandbox/wr_tmp/proto_a62e}; mkdir -p "$TMPDIR"
unset GEMINI_API_KEY GOOGLE_API_KEY OPENROUTER_API_KEY
for X in "$@"; do
  ../.venv/bin/python $X/build.py
  mkdir -p $X/renders
  t0=$(date +%s)
  /home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes render $X --output "$PWD/$X/renders/$X.mp4" --fps 30 --quality delivery --workers ${WORKERS:-4} --quiet
  ffmpeg -v error -y -i $X/renders/$X.mp4 -map 0:v:0 -c copy -an -movflags +faststart $X/renders/${X}_silent.mp4
  echo "$X rendered in $(( $(date +%s) - t0 )) s"
done
