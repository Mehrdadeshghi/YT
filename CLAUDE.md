# CLAUDE.md — Wiki Roulette YouTube channel (Mehrdad)

Read this first in every session. It is the handover of everything learned while building the channel (Oct 2026).
Covered topics: `docs/topics.md` (never repeat one). Step-by-step production: `.claude/skills/new-short/SKILL.md`.

## The person and the goal
- **Mehrdad** (Wiesbaden). Talk to him in **German**, short and concrete. The videos themselves are **English**,
  with extra audio tracks **DE / ES / FR** (YouTube multi-language audio).
- Goal: **monetization** (YouTube Partner Program) as fast as possible. Channel is small: every video must push
  comments, likes, subscribers (spoken opinion question + comment card + subscribe nudge, pinned comment in the upload text).
- Wants **more views from the USA** (topics, units in miles, upload time 21–23 h German time).
- He judges by look and feel. When he says "nicht attraktiv", ask what (topic / look / voice) and offer a new direction;
  don't just polish. Keep improving continuously; look up research when unsure.
- **Two strictly separate tracks:** adult (facts, football, How It Works, deep sea, Circles) and kids ("Story Time":
  calm, slower narration, participation pauses, repetition, explicit moral, music far under the voice, `"kids": true`).

## Hard rules
- **Secrets:** the Google key lives only in GitHub → Settings → Secrets → Actions as `GOOGLE_TTS_KEY`. Never print,
  commit or ask for it in chat. (The "Chirp voices" workflow has failed every run so far → key missing/invalid; ask him to re-enter it.)
- **Never use Rezvaneh's GitHub repositories** (e.g. `rezvanehmsv00/*`) for his projects.
- **Facts:** verify every number against the English Wikipedia article (or the primary source) before writing voice-over.
  `catalog.txt` → workflow "Photo catalog" also dumps article texts (`articles.md`). Never invent or round beyond the source.
- **Media:** free licences only (Wikimedia Commons, NOAA, Natural Earth, Musopen, Kenney CC0). Label honestly on screen:
  REAL PHOTO / REAL FOOTAGE / ILLUSTRATION / GRAPHIC. No club crests, logos, trademarked characters.
- **Repo hygiene:** commit and push everything you change; deliverables (mp4/m4a/md copies) go outside the repo.
  Commit messages end with the attribution lines the harness gives you.

## How it is built (engine)
- `cine.html` renders a video as a pure function of time (canvas 1080×1920; `?wide=1` → 1920×1080).
  `window.seek(t)`; `render.mjs` grabs frames with Playwright; `score_cine.mjs` builds music+SFX+voice; `finish.sh` muxes
  and normalises (−14 LUFS); `dub.py` makes the DE/ES/FR tracks; `scripts/build.sh` runs everything per episode.
- Episode = `episodes/<ep>.json` (script, scenes, photos list, flags) + `cine/<ep>.js` (visuals) + `uploads/<ep>.md`.
  Visuals: `VIS.open` (opener) and `VIS[i]` per scene: `VIS[i] = S(() => (K, Sc) => { …cues…; return (t) => { …draw… } })`.
  `sw('word', fallback, k)` = time the k-th occurrence of a word is spoken (Whisper word timestamps), `K(t, 'sfx', gain)` = sound cue.
- Shared libraries via `"scripts"`: `common.js` (always), `facts.js` (`"facts": true`: shot/framed/ring/callout),
  `football.js` (board, redCard, pscene), `tech.js` (S helper), `pro.js` (calm premium look: ptext, rich, pill, bigText,
  card, art(), host()), `figures.js` (cartoon figures), `lottie.js` (animated emoji). **All scripts share one global
  scope** → never redeclare names that exist elsewhere (`RED`, `NAVY`, `S`, `bd`… caused crashes).
- Useful episode flags: `tight` (scene ends 0.2 s after its sentence), `style: "pro"` (calm captions, no punches),
  `transition` (`whip`/`fade`), `wordCaps`, `capY/capX/capSize`, `subY/subEndY` (subscribe pill), `noCommentCard`,
  `recap: false` (no photo montage during the CTA — needed when media come from another episode), `photos_from: "139"`
  (reuse another episode's photos, clips and music), `lazyClips` (long videos), `hook`, `cta {q,a,b}`, `spell`
  (caption spelling for pronunciation hacks), `wide`, `kids`, `host` (AI presenter).
- Voices (`"voice"`): `narrator` (Chatterbox, house default for adult), `chirp` (Google Chirp 3 HD — needs the secret),
  Kokoro (`af_heart` 1.30 old standard; `am_michael` local previews), `clone`/`native` (his cloned voice, rejected as monotone).
  Pronunciation: write it phonetically in the VO ("Buy-urn", "Shvarts-en-beck", "Go-deen") and map back with `spell`.
  **Write years as words when it matters** ("twenty sixteen") — the narrator swallowed "2016" → heard as "2006".
- Music: first `{"id":"music","audio":"File:…","from":…,"len":…,"gain":…}` in `photos`. Shorter tracks loop with a crossfade.
  Quiet classical recordings need `gain` 4–6.
- AI presenter (`"host": true`): `host.py` + Ditto (CPU) in CI, ~1 h per episode. He asked for drastically more realism;
  for the deep-sea long video he explicitly wanted **no human figure**.

## CI (GitHub Actions in Mehrdadeshghi/YT) — the normal way to produce
1. Find media: write `catalog.txt` (`Article | Commons category`, `image: words`, `video: words`, `audio: words`,
   `article: Title`) → push → workflow **Photo catalog** → release `catalog-N` (`catalog.md`, `articles.md`).
2. Fetch media: list episode numbers in `photos.txt` → push → **Photo preview** → release `photos-N` (zip). Add
   `photos-N` to `media.txt` so renders restore it (avoids Wikimedia rate limits).
3. Render: `gh api -X POST repos/Mehrdadeshghi/YT/actions/workflows/render.yml/dispatches -f ref=main -f 'inputs[episodes]=145' -f 'inputs[fps]=30'`
   (one dispatch per episode = parallel). Result: release `shorts-N` with mp4, `_de/_es/_fr.m4a`, md. Failures publish `debug-N`.
   Download: `curl -sSLf -O https://github.com/Mehrdadeshghi/YT/releases/download/shorts-N/<file>`.
   Typical time: Short ~20–30 min, 5-min 16:9 ~2 h, AI presenter ~1 h.
4. Other workflows: `fetch-asset.yml` (download a URL into the repo), `chirp.yml`, `host-test.yml`, `trends.yml`.

## Local preview (fast iteration before CI)
- `python3 voice.py <ep> --voice am_michael --speed 1.3` (Kokoro preview voice + Whisper timings → `episodes/<ep>.voice.json`)
- `node pv.mjs "cine.html?ep=<ep>[&wide=1]" out.png 0:0.5 1:0.8 …` → frames at scene:fraction (0 = opener), side by side. **Always look at
  them** (overlaps of captions, subscribe pill, comment card, labels; photo focus in tall frames).
- Check the final video: Whisper-transcribe the mp4 (`models/whisper`, faster-whisper small.en; decode audio with ffmpeg first),
  grab frames with ffmpeg, check silence/loudness of the dub tracks.
- Setup on a new machine: `npm i && npx playwright install chromium`; `pip install kokoro-onnx soundfile numpy pillow faster-whisper scipy shapely`;
  Kokoro models from github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0) into `models/`; Whisper from this repo's release `model-whisper`.

## Formats — what worked, what didn't
- ✅ **Pro look** (`style: pro`, dark calm cards, accent captions). ✅ **Deep-sea long-form #139** (depth meter, darker with depth,
  real NOAA footage) and its 9:16 cut-downs #145–#151 (`cine/139.js` has a tall layout; `scripts/mkdeepshorts.py`).
- ✅ **Circles** (#144): "How many circles does it take to draw X?" — Fourier epicycles of a map outline (`scripts/fourier.py`,
  Natural Earth data from raw.githubusercontent.com/nvkelso/natural-earth-vector), miles, Dvořák "New World" Largo.
  Next: US states (Texas, Florida, California, Michigan…) — ask the comments.
- ✅ **Matchday preview** (#143) on Champions League days: split club-colour cards, win-probability bar, "predict all 3" grid.
  It promised a "who was right" follow-up. Get fixtures, results and win probabilities from the web (UEFA, Sportradar-based sites) on the day.
- ❌ History-recap football Shorts (#140–#142): "gar nicht attraktiv" (topic, look and voice).
- ❌ Germany-centred topics (wants US views). ❌ His cloned voice (monotone). ❌ Kokoro/Chatterbox for teaching ("too AI") → wanted Chirp.
- Hooks: frame-1 contradiction or impossible number, ≤ 2 s; strongest fact first; one open question to the end; binary comment question.

## Open items
- FR-only audio tracks for #109–#118 fitted to the already uploaded videos: waiting for him to upload the 10 original MP4s
  (`recon.py`, then `DUB_LANGS=fr python3 dub.py NNN`).
- Chirp voices: fix `GOOGLE_TTS_KEY` (he must re-enter it in GitHub Secrets), then move adult/teaching episodes to Chirp.
- Circles #2+ (US states), more 9:16 cut-downs from future long videos.
