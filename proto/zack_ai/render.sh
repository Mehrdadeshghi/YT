#!/usr/bin/env bash
# proto/zack_ai/render.sh → renders/zack_ai_molasses.mp4 (build → HyperFrames silent render → mix VO + SFX, -14 LUFS)
set -e
cd "$(dirname "$0")"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=/home/meshg/.local/chromelibs/root/usr/lib/x86_64-linux-gnu
export TMPDIR=${TMPDIR_ZACK:-/home/meshg/sandbox/wr_tmp/zack_ai}; mkdir -p "$TMPDIR" renders
unset GEMINI_API_KEY GOOGLE_API_KEY OPENROUTER_API_KEY
../../.venv/bin/python build.py | head -1
t0=$(date +%s)
/home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes render . --output "$(pwd)/renders/silent.mp4" --fps 30 --quality delivery --workers ${WORKERS:-4} --quiet
echo "render $(( $(date +%s) - t0 )) s"
../../.venv/bin/python mix.py renders/silent.mp4 renders/zack_ai_molasses.mp4
