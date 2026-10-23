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

## 5. Visuals (`cine/<ep>.js`)
- Reuse libraries (`pro.js`, `football.js`, `facts.js`, …). Word-synced reveals with `sw()`. No global-name clashes.
- 9:16 safe zones: top 120–300 header, media/graphics ~300–1450, captions ~1640–1720, subscribe pill/comment card ~1400–1600.

## 6. Preview locally
- `python3 voice.py <ep> --voice am_michael --speed 1.3` then `node pv.mjs "cine.html?ep=<ep>" /tmp/x.png 0:0.6 1:0.8 2:0.8 …`
- Read the PNGs. Fix overlaps, empty frames, wrong crops, unreadable text. Repeat until clean.

## 7. Render in CI
- Commit + push, then one dispatch per episode (`render.yml`, `inputs[episodes]`, `inputs[fps]=30`). Poll with `gh run view`.
- Download `shorts-N` assets. Check: duration, Whisper transcript (names, numbers, years!), frames at 4–6 times, dub tracks not silent
  (`silencedetect`). Fix and re-render if anything is wrong — say so in the delivery.

## 8. Upload text (`uploads/<ep>.md`)
- Title EN (+ DE/ES/FR titles), description with the hook fact, comment question, source, "Voice: AI narrator",
  credits for every used media file (author, licence, Commons page), hashtags + `#shorts`, pinned comment, audio-track list,
  settings (playlist, made for kids, altered/synthetic content, category, best upload time).

## WHY? series (everyday why-questions; template #186 pigeon nests)
- Copy `scripts/mk186.py` + `cine/186.js`. Flags as the house Short (`look: cine`, `facts`, `tight`, `voice: narrator`, `wordCaps`),
  `"scripts": ["tech.js", "why.js"]`, `"series": "WHY? #n"`, `"why": {"q": ["<question line 1>", "<line 2>?"], "next": "YOUR NEXT WHY? COMMENT IT"}`.
- Structure (24–34 s): frame 1 = `whyBadge` + `whyQ` (the question) over `whyPair(..., {cols: true})` — two REAL photos "this vs this";
  VO "<X> does this. <Y> does this. Why?". Then 2–3 scenes, each `whyReason(t, tIn, n, 'TITLE.')` ("REASON n" chip + gold line) over one
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
