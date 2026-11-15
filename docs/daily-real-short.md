# Daily real-footage Short (cloud routine)

Runs once a day in Anthropic's cloud without the owner's PC. Goal: one new English Short (DE/ES/FR dubs) in the house style the owner chose on 9.11.2026:
**free real footage + animated overlays** (scripts/realfilm). It never uploads to YouTube: it pushes a render request; GitHub renders and opens a
"Review #<ep>" issue; the owner answers **ok** on the issue (phone works) and approve.yml schedules the upload for the next 19:30 slot.

## Hard rules (from CLAUDE.md)
- Facts only from the English Wikipedia article or the primary source; every number verbatim. Write years/numbers so a narrator reads them right.
- Footage only with a free licence: public domain (US government: NHTSA, NASA, NOAA, USGS, NPS, military), CC0, CC BY, CC BY-SA, from Wikimedia Commons. Credit file + licence in uploads/<ep>.md. No brand logos in the foreground, no people's faces as the subject, nothing gory.
- Never repeat a topic in docs/topics.md. Prefer topics US viewers know from daily life (cars, safety, home, everyday tech, nature they see). What worked: #222 V2V, #223 store gates, #224 lane keeping, #225 airbag (real NHTSA crash film).
- Footage must be clean: no burnt-in captions, labels, arrows or logos inside the area you crop (they get cut in half and clash with ours). Reject such clips or crop them out with "cx"/"crop_bottom".
- How it works only: no instructions to defeat, evade or misuse anything.
- Never print or ask for secrets. Do not touch upload.yml, uploads/youtube.json or repo variables.

## Steps
1. Read CLAUDE.md, docs/topics.md, this file, episodes/225.json, scripts/mk225.py and uploads/225.md (the reference episode).
2. Owner feedback: `curl -s "https://api.github.com/repos/Mehrdadeshghi/YT/issues?labels=review&state=all&per_page=10"` and the comments of those issues. Apply any feedback to today's video. If 3 or more review issues are still open without an answer, stop: write nothing.
3. Episode number = highest number in episodes/*.json + 1 (ignore 9xx).
   **This cloud session cannot reach Wikipedia or Commons (proxy 403). Use the GitHub research helper instead:** write `research/<ep>.json`
   (`{"commons_search": [...], "wiki": [...], "commons_files": [...]}`), commit + push it, then wait for GitHub Actions to commit `research/<ep>/`:
   `for i in $(seq 40); do git pull -q; [ -f research/<ep>/DONE-OR-FILE ] && break; sleep 30; done` (check for the file you expect: `search.md`, `wiki_<Title>.txt`, `files.md`).
   To ask again (more searches, other files), edit `research/<ep>.json` (change its content) and push again. Each round takes 2–6 minutes.
4. Topic: ask for 6–10 Commons searches at once plus the Wikipedia articles; read `research/<ep>/search.md` (file | licence | seconds | size). Pick a topic whose real, free video shows the mechanism or the event. No footage → another topic.
5. Look at the footage before choosing: put the chosen files into `commons_files`, push, then view `research/<ep>/sheet_<i>_<second>.jpg` with the Read tool (1 frame per second, source second in yellow). Note good spans (seconds), the subject's x position in source pixels (for "cx"; sheets are 320 px wide per frame, scale by the width in files.md), burnt-in captions to crop ("crop_bottom"). Facts come from `research/<ep>/wiki_*.txt`.
6. Write scripts/mk<ep>.py → episodes/<ep>.json like mk225.py: ~120–140 words, hook with an open question or impossible number in the first sentence, one mechanism, a twist, the binary CTA "Comment <a> or <b>, and subscribe." as the last segment with "cta": true; `de`/`es`/`fr` on every segment (metric units in the dubs); "voice": "gemini", "gemini_wpm": 175; "hf": {"style": "doku", "custom": "hf_real"}; music: a CC BY track already used in episodes/*.json, as the first "photos" entry.
   "real": sources, spans (from/to seconds in the source, "slow": 2 for twice-slower interpolated slow motion), events (scene index, caption word prefix, nth), shots (from/to as event times like "hits+0.8", span, at = seconds inside that span, cx, zoom, optional clock), stamps (big number/word + short sub), labels (x, y in the 1080×1920 frame, footage window is y 285–1635), cues (sound names: tick click pop thump whoosh swish scratch riser crack splash sonar bubble beep flat pen coin hit zap land).
   Keep stamps short (big ≤ 12 characters, sub ≤ 40). Stamps above y 700 are hidden while the hook title shows (until "title_until"). Shots should change every 3–8 s; show the mechanism while it is spoken; big stamps for the key numbers.
7. uploads/<ep>.md like uploads/225.md (title ≤ 70 chars with one emoji, description with sources, footage credit, pinned comment, DE/ES/FR titles). Append one line to docs/topics.md: `#<ep> <topic> (key facts)`.
8. `python3 scripts/real_check.py <ep>` must print ok (its Commons licence check is skipped here and redone in CI). Fix until it does. Delete nothing in research/.
9. Commit everything with a clear message ending in "Co-Authored-By: Claude <noreply@anthropic.com>", push to main. Then create `requests/<ep>.txt` (content: the title) in a **separate** commit and push it: that push starts the render (render-request.yml). One request per run.
10. Final message: episode, topic, footage used (file + licence), and what you are unsure about.
