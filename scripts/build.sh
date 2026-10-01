#!/bin/bash
# scripts/build.sh 020 022 …  → photos, voice, render (60 fps), score + master, dist/<mp4 + upload text with photo credits>
set -e
cd "$(dirname "$0")/.."
python3 fetch_photos.py "$@" || echo "photo fetch had problems — drawn fallbacks will be used"
mkdir -p dist
for e in "$@"; do
  echo "::group::episode $e"
  python3 voice.py "$e"
  node render.mjs --page "cine.html?ep=$e" --name "ep$e" --fps 60 --sub 1 --crf 16
  ./finish.sh "$e"
  cp "out/ep$e/wiki_roulette_$e.mp4" dist/
  python3 - "$e" <<'PY'
import json, os, sys
e = sys.argv[1]
text = open(f"uploads/{e}.md").read() if os.path.exists(f"uploads/{e}.md") else f"# Wiki Roulette #{e}\n"
cr = json.load(open(f"assets/photos/{e}.credits.json")) if os.path.exists(f"assets/photos/{e}.credits.json") else {}
if cr:
    text += "\n\n**Photo credits (add to the description):**\n" + "\n".join(
        f"- {c['author']}, {c['license']}, via Wikimedia Commons ({c['page']})" for c in cr.values())
open(f"dist/wiki_roulette_{e}.md", "w").write(text + "\n")
PY
  echo "::endgroup::"
done
ls -la dist
