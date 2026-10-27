---
name: new-short
description: Produce a new Wiki Roulette Short (9:16) or 16:9 special end to end in this repo — topic check, verified script, free media, visuals, local preview, CI render, checks, upload text, delivery. Use for any "mach ein Short/Video über …", batches, cut-downs of a long video, or Circles/matchday episodes.
---

# New Short — end-to-end checklist

Answer Mehrdad in German. Video language English, dubs DE/ES/FR. Read `CLAUDE.md` first if not done this session.

## 1. Topic
- Check `docs/topics.md` — never repeat. Prefer topics that pull US viewers. Adult vs kids track: decide which, never mix.
- If the format is new or he was unhappy last time, propose 2–3 directions in one short message; otherwise start.
- Next free episode number: `ls episodes | sort -n | tail`.

## 2. Facts
- Push `catalog.txt` with `article: <Title>` rows (and media searches, see step 3) → workflow "Photo catalog" →
  download `articles.md` from release `catalog-N`. Every number in the VO must appear in a source. Note the source URL.

## 3. Media
- Same catalog run: `Article | Commons category`, `image: …`, `video: …`, `audio: …` rows → `catalog.md` (file, size, licence, author).
- Pick free-licence files only. Write them into the episode `photos` list: `{"id","file"}`, `{"id","video","from","len"}`
  (clips at 30 fps; first preview long clips at `"fps": 1, "len": 60–120` to choose seconds), `{"id":"music","audio",…}`.
- `photos.txt` = episode numbers → push → "Photo preview" → release `photos-N` → unzip locally, add `photos-N` to `media.txt`.
- Look at a contact sheet of the photos before placing anything (focus points, what is really in the picture, honest labels).

## 4. Script (`episodes/<ep>.json`, usually via a small generator in `scripts/mk<name>.py`)
- `vo_open` = hook (≤ 2 s idea, contradiction / impossible number). Scenes: 1–3 sentences each, `cap` with *starred* key words,
  `de`/`es`/`fr` on every segment (otherwise no dub). Last scene: `{"at": "0.15", "text": "<binary question> Comment …, and subscribe!", "cta": true}`.
- Target 25–40 s for Shorts (≈ 90–115 words with the narrator). Phonetic spellings for names + `spell` map. Years as words if critical.

## HyperFrames Shorts (default for normal Shorts since #201)
Owner verdict on pilot #201: "drastically better". Use it for every normal Short; steps 5–7 below (cine.html) only for Circles,
deep-sea/long-form cut-downs, AI presenter and the WHY? series. Pipeline: `scripts/hf_build.py` (timing, captions, cues, render,
finish + dubs) + `scripts/hf_kit.py` (templates/elements, read its docstring) → `hf/<ep>/` (gitignored) → workflow `hf-render.yml`.
- **Episode = data** in `scripts/mk<ep>.py` (copy `mk206.py`–`mk210.py`; `mk201.py` = pilot as data): usual script/vo/photos plus
  `E['hf_open']` (opener) and `scenes[i]['hf']` = `{"tpl": …, …, "els": [{"el": …}, …]}`, episode-wide
  `E['hf'] = {"theme": {cu, vg, capcu, capvg, chipcu, chipvg, p0}, "caps": {"cu"/"vg"/"rd": [word prefixes]}, "derive": [...]}`.
- **Templates:** `split` (hook A|B with divider + `wipes`; `imgA`/`imgB` geometry when two different photos), `photo` (full-bleed photo or
  footage; `zoom`, `settle`, `punch`, `drift`, `enter` whip/vwhip/zoom/iris/none, optional `paint` overlay), `card` (colour flood + framed
  media card), `plain` (dark ground for graphics).
- **Elements:** `title` (kicker + big line; `items` roll like a slot machine), `counter` (counts on its word), `ruler`, `bars`,
  `timeline` (year counter + bar), `chip` (label/tag, can sit `in: card`), `stamp`, `sub`, `glass` (verdict card with ✓/✗ + quote),
  `stack` (labelled layers), `ab` (end card: question, "A or B", two tiles — `src` photo or graphic `glyph` tile — and the comment ask),
  `loop` (cross-fade back into frame 1).
- **Times** are word specs from the Whisper timings of that scene: `"copper"`, `"green#2"`, `"less-0.08"`, `"cta-0.2"`, `"end-0.45"`;
  numbers = seconds. Key words must appear in `cap` (spoken numbers by their cap digits: `"1949"`, `"30foot"`).
- **Labels:** every photo/footage/graphic carries `label: [place, KIND]` (Real photo / Real footage / Illustration / Graphic / Simulation).
- **Layout (REEL v2 safe band y 168–1330):** kicker 206, big title 262 (≤ 2 lines), chips/subs 500–720, media labels 1030, captions end
  y≈1320 (`hf.capBottom` 600), end card tiles 470–1030 + ask pill 1060 (x 40–830, nothing under the right rail).
- **Preview:** `python3 voice.py <ep> --voice am_michael --speed 1.3`, then `python3 scripts/hf_build.py <ep>` and
  `hyperframes snapshot hf/<ep> --at 0.1,1.3,… --no-end --describe false` (CLI 0.8.149; env HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
  HYPERFRAMES_SKIP_SKILLS=1; NO GEMINI_API_KEY in the env, `--describe` would spend Gemini quota). LOOK at the contact sheets
  (overlaps, focus of tall crops, early counters, text under captions). Kokoro 1.3 runs ~10 % shorter than Gemini at 195 wpm.
- **Render:** `gh workflow run hf-render.yml -R Mehrdadeshghi/YT --ref main -f episode=<ep>` (release `hf-N`; one Gemini request);
  `-f test_voice=am_michael` tests the pipeline without Gemini quota. Check `.venv/bin/python scripts/check_final.py <ep> hf-N`.
- CI runs Python 3.11 (no same-quote nesting or backslashes inside f-string braces): check kit edits with
  `uv run --no-project --python 3.11 python -m py_compile scripts/hf_kit.py`.
- Kit changes must keep #201 identical: build it and compare snapshot frames + `out/ep201/cues.json` before/after.

## 5. Visuals (`cine/<ep>.js`) — cine engine (Circles, deep-sea cut-downs, presenter, WHY?)
- Reuse libraries (`pro.js`, `football.js`, `facts.js`, …). Word-synced reveals with `sw()`. No global-name clashes.
- 9:16 safe zones: top 120–300 header, media/graphics ~300–1450, captions ~1640–1720, subscribe pill/comment card ~1400–1600.

## 6. Preview locally
- `python3 voice.py <ep> --voice am_michael --speed 1.3` then `node pv.mjs "cine.html?ep=<ep>" /tmp/x.png 0:0.6 1:0.8 2:0.8 …`
- Read the PNGs. Fix overlaps, empty frames, wrong crops, unreadable text. Repeat until clean.

## 7. Render in CI
- Commit + push, then one dispatch per episode (`render.yml`, `inputs[episodes]`, `inputs[fps]=30`). Wait with ONE quiet
  `gh run watch <id> --exit-status >/dev/null` (run it in the background) — never poll in a loop: several agents polling hit
  GitHub's API rate limit.
- Check with `.venv/bin/python scripts/check_final.py <ep>`: downloads into wr_deliver/<ep>/, prints duration, Whisper
  transcript + word diff against the script, dub tracks (volume, silences) and writes ONE frame strip `strip.png` — look at that
  image only. Fix and re-render if anything is wrong (every render is a new narrator take → check again) — say so in the delivery.
- Voice `"voice": "gemini"` (Google Gemini TTS, AI Studio free tier, much more human than `narrator`): the whole English script is
  ONE request per render. FREE TIER = 10 requests/DAY, 3/minute for the whole project (resets 09:00 Berlin) → at most ~5 episodes + a few re-renders per day; never waste renders. Flags `gemini_voice` (default Charon), `gemini_style`,
  `gemini_wpm` (default 185). Dubs stay on dub.py's voices. Samples: workflow "Gemini voices" → release gemini-N.

## REEL v2 structure (experiment E8, from github.com/Jakeschincariol/instagram-agent-skill, MIT; tools in `scripts/reel/`)
Test format vs. the house/WHY? Shorts. Episodes carry `"format": "reel2"` so the analysis can split them.
- **Hook (0-2 s):** pick 3 formulas from `scripts/reel/hooks.json` (26), write spoken line + SEPARATE on-screen line (≤ 6 words,
  up at frame 1 with motion). Score: `python3 -I scripts/reel/hookscore.py hooks.txt` → use the winner, must be ≥ 70 (STRONG).
  Note the formula id in the episode (`"hook_formula": "5 Time Collapse"`). No greeting, no setup, number first.
- **Stake (2-7 s):** one line why the viewer should care. **Body:** one idea per beat, ≤ 4 s per beat, the frame changes every beat.
  **Payoff:** deliver what the hook promised before the last 5 s. **ONE ask** (comment question, binary). **Loop:** last spoken line
  echoes a word from the hook so the replay lands (`"loop": true` cross-fades into frame 1).
- Time it: `python3 -I scripts/reel/beats.py script.txt --wpm 190 --target 30` (one beat per line); fix every flag. 20-35 s.
- Flags: `"oneAsk": true` (no subscribe pills, only the comment card), `"loop": true`, `"capY": 1250`, `"cardY": 1150`,
  voice `gemini`. **Safe zone** (YouTube/IG overlays): all text and key visuals between y 230 and 1440, right 230 px clear below y 900;
  media ~300-1100, captions ~1250, comment card ~1150-1350.
- Same fact rules as always (every number sourced). Upload md: the fitting existing playlist (How It Works, Deep Sea, History Mysteries …), note "format: reel2" in the md settings.

## 8. Upload text (`uploads/<ep>.md`)
- Title EN (+ DE/ES/FR titles), description with the hook fact, comment question, source, "Voice: AI narrator",
  credits for every used media file (author, licence, Commons page), hashtags + `#shorts`, pinned comment, audio-track list,
  settings (playlist, made for kids, altered/synthetic content, category, best upload time).

## WHY? series (everyday why-questions; template #186 pigeon nests)
- Copy `scripts/mk186.py` + `cine/186.js`. Flags as the house Short (`look: cine`, `facts`, `tight`, `voice: narrator`, `wordCaps`),
  `"scripts": ["tech.js", "why.js"]`, `"series": "WHY? #n"`, `"why": {"q": ["<question line 1>", "<line 2>?"], "next": "YOUR NEXT WHY? COMMENT IT"}`.
- Structure (24–34 s): frame 1 = `whyBadge` + `whyQ` (the question) over `whyPair(..., {cols: true})` — two REAL photos "this vs this";
  VO "<X> does this. <Y> does this. Why?". Start badge + question at negative tIn (≈ -0.4) so frame 1 is complete. Then 2–3 scenes, each `whyReason(t, tIn, n, 'TITLE.')` ("REASON n" chip + gold line) over one
  photo (`shot`, box 40/690/1000/760) or two stacked photos (`whyPair`). Strongest / most surprising reason last.
  Last scene ends with the comment card (`cta {q,a,b}`, binary) + `whyNext(t, sw('next'))`; the spoken CTA ends "…and tell us your next why."
- Every reason must be a sourced fact. Don't invent causality ("scientists think" only if the source says so).
- `uploads/<ep>.md`: title starts with "Why", Playlist "Why?", pinned comment asks for the next why-question (viewer topics → next episodes).
- why.js: `whyBadge(t,tIn,x,y,s)`, `whyQ(t,tIn,lines,y,{size})`, `whyReason(t,tIn,n,title,{y,size})`, `whyPair(t,A,B,y0,y1,{cols,gap})`
  with `A = {id, label, at, a, b, clip, credit}` (returns the two P() mappers; draws REAL PHOTO / REAL FOOTAGE marks), `whyNext(t,tIn,str,y)`.
  Draw `tag()` after `whyPair` (its blurred backdrop covers the header).

## 9. Deliver + record
- Send mp4 + md + 3 m4a. Files > 30 MB: give the release link instead.
- Add the topic to `docs/topics.md`, commit, push. Report in German: what it is, anything he must know or decide, one next step.
