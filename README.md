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
