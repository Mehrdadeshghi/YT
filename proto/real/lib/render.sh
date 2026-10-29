#!/usr/bin/env bash
# proto/real/lib/render.sh N  → proto/real/N/renders/real_N.mp4
#   build (plates + HyperFrames project) → silent HyperFrames render → film post (grain, halation, vignette) → sound mix (−14 LUFS)
set -e
N=$1; HERE="$(cd "$(dirname "$0")/.." && pwd)"; D="$HERE/$N"; REPO="$(cd "$HERE/../.." && pwd)"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=/home/meshg/.local/chromelibs/root/usr/lib/x86_64-linux-gnu
export TMPDIR=${TMPDIR_REAL:-/home/meshg/sandbox/wr_tmp/real}; mkdir -p "$TMPDIR" "$D/renders"
unset GEMINI_API_KEY GOOGLE_API_KEY OPENROUTER_API_KEY
"$REPO/.venv/bin/python" "$HERE/lib/build.py" "$N" > "$D/renders/build.log"
t0=$(date +%s)
cd "$D"
/home/meshg/sandbox/hf-pilot/node_modules/.bin/hyperframes render . --output "$D/renders/silent.mp4" --fps 30 --quality delivery --workers ${WORKERS:-4} --quiet
echo "render $(( $(date +%s) - t0 )) s"
# film post: lib/post.sh (halation in RGB, grain, vignette)
bash "$HERE/lib/post.sh" "$D/renders/silent.mp4" "$D/renders/post.mp4"
"$REPO/.venv/bin/python" "$HERE/lib/mix.py" "$N" "$D/renders/post.mp4" "$D/renders/real_$N.mp4"
