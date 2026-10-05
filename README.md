# Wiki Roulette · YouTube Shorts pipeline

English Shorts about random Wikipedia articles: voice-over, word-by-word captions, animated graphics, real freely-licensed photos from Wikimedia Commons, seamless loop.

## How it runs (no manual steps)
1. Claude writes an episode (`episodes/<ep>.json` script + `cine/<ep>.js` visuals + `uploads/<ep>.md` upload text) and lists it in `queue.txt`.
2. The push triggers **Actions → Render Shorts**. The runner fetches the photos (`fetch_photos.py`, free licenses only), synthesizes the voice (Kokoro), renders 1080×1920 @ 60 fps, mixes the score to −14 LUFS.
3. Finished videos and upload texts (with photo credits) appear under **Releases**. Download on your phone and post.

You can also start a render by hand: Actions → Render Shorts → Run workflow → e.g. `020 022`.

## Files
- `cine.html` + `cine/common.js`: the series look (pure function of time, `window.seek(t)`).
- `cine/<ep>.js`: the story visuals for one episode. `photo(t, id, …)` shows a real photo if it was fetched, otherwise the drawn version stays.
- `episodes/<ep>.json`: hook, voice-over segments, captions, `photos: [{id, article, match?}]`.
- `render.mjs`, `score_cine.mjs`, `finish.sh`, `voice.py`, `fetch_photos.py`, `scripts/build.sh`.


## House standard (since #065, Oct 2026)
- **Voice:** Kokoro `af_heart`, speed **1.30** (≈200–250 words/min while talking). Don't lower it.
- **No dead air:** Shorts are `"tight"` by default — each scene ends ~0.2 s after its sentence; animations are time-compressed to fit; real video clips keep real-time playback.
- **Ending:** during the spoken call to action, quick cuts through the episode's real photos/clips (no static end frame).
- **Facts on screen:** real photos (`"file"`) and real footage (`"video"`, Commons/NOAA, free licences only), labelled REAL PHOTO / REAL FOOTAGE / MUSEUM MODEL / ILLUSTRATION.
- **Engagement:** hook ≤ 2 s, strongest fact first, spoken opinion question + subscribe, comment card, "full video below" card when `related` is set.

## Motion stickers + real sound effects
- `"lottie": ["mindblown", "shark", …]` in an episode loads animated Noto emoji (Google, CC BY 4.0) from `assets/lottie/`
  (names in `cine/lottie.js`). Draw one with `lot(t, tIn, name, x, y, size, { f0, once, pop, rot, out })`.
  With lottie on, the subscribe bell and the comment card also get animated emoji (`cta.emoji`, default `think`).
  Credit line in the description: "Animated emoji: Noto Emoji Animation by Google, CC BY 4.0".
- Sound cues (`pop, click, tick, coin, scratch, thump, hit, crack, land, zap` + new `stamp, paper, ding, wrong, glitch, boom`)
  play real recorded samples from `assets/sfx/` (Kenney, CC0), layered with the synth where it adds weight. `"sfx": "synth"` turns it off.
- `.github/workflows/assets.yml` re-downloads the full packs into a release `assets-N` if more sounds/emoji are needed.

## Livelier intonation (voice "native")
Voice conversion flattens the melody of the source voice (Kokoro ~10 → ~6 semitones). The pipeline now starts from
`am_echo` (most melodic Kokoro male voice) and widens the pitch contour after conversion (`expand_pitch`, PSOLA via Praat):
`"voice_src": "am_echo"`, `"voice_expr": 1.85`. Result for #078: median per-line pitch range 10.7 st, the same as the
reference narrator video Mehrdad picked (old version: 5.9 st). Speaker similarity to his recording stays ~0.85.
