#!/usr/bin/env bash
# proto/zack_3d/render.sh — full build of the Zack-style 3D probe:
#   fetch assets → preview voice (Kokoro am_michael + Whisper timings) → HyperFrames render (WebGL) → VO+SFX mix → mp4
set -e
cd "$(dirname "$0")"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=/home/meshg/.local/chromelibs/root/usr/lib/x86_64-linux-gnu
export TMPDIR=${TMPDIR_ZACK:-/home/meshg/sandbox/wr_tmp/zack3d}; mkdir -p "$TMPDIR"
unset GEMINI_API_KEY GOOGLE_API_KEY OPENROUTER_API_KEY
bash fetch_assets.sh
(cd ../.. && .venv/bin/python proto/zack_3d/build_vo.py)
mkdir -p renders
t0=$(date +%s)
/home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes render . --output "$PWD/renders/silent.mp4" --fps 30 --quality delivery --workers ${WORKERS:-3} --quiet
t1=$(date +%s); echo "render: $((t1 - t0)) s"
../../.venv/bin/python mix.py renders/silent.mp4 renders/zack_3d_molasses.mp4
