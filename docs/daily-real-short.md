# Daily real-footage Short (cloud routine)

Runs once a day in Anthropic's cloud without the owner's PC. Goal: one new English Short (DE/ES/FR dubs) in the house style the owner chose on 9.11.2026:
**free real footage + animated overlays** (scripts/realfilm). It never uploads to YouTube: it pushes a render request; GitHub renders and opens a
"Review #<ep>" issue; the owner answers **ok** on the issue (phone works) and approve.yml schedules the upload for the next 19:30 slot.

## Hard rules (from CLAUDE.md)
- Facts only from the English Wikipedia article or the primary source; every number verbatim. Write years/numbers so a narrator reads them right.
- Footage only with a free licence: public domain (US government: NHTSA, NASA, NOAA, USGS, NPS, military), CC0, CC BY, CC BY-SA, from Wikimedia Commons. Credit file + licence in uploads/<ep>.md. No brand logos in the foreground, no people's faces as the subject, nothing gory.
- Never repeat a topic in docs/topics.md. Prefer topics US viewers know from daily life (cars, safety, home, everyday tech, nature they see). What worked: #222 V2V, #223 store gates, #224 lane keeping, #225 airbag (real NHTSA crash film).
- How it works only: no instructions to defeat, evade or misuse anything.
- Never print or ask for secrets. Do not touch upload.yml, uploads/youtube.json or repo variables.

## Steps
1. Read CLAUDE.md, docs/topics.md, this file, episodes/225.json, scripts/mk225.py and uploads/225.md (the reference episode).
2. Owner feedback: `curl -s "https://api.github.com/repos/Mehrdadeshghi/YT/issues?labels=review&state=all&per_page=10"` and the comments of those issues. Apply any feedback to today's video. If 3 or more review issues are still open without an answer, stop: write nothing.
3. Episode number = highest number in episodes/*.json + 1 (ignore 9xx).
4. Topic: find one where Commons has real, free video that shows the mechanism or the event (Commons API: `action=query&list=search&srnamespace=6&srsearch=<words> filetype:video`, and categories). Check licences (`prop=imageinfo&iiprop=extmetadata`). No footage → pick another topic.
5. Look at the footage before choosing: download the source to a temp dir (not into the repo), make contact sheets with ffmpeg (`pip install imageio-ffmpeg` gives a binary if ffmpeg is missing), view them, note good spans (seconds), the subject's x position (for "cx", source pixels), burnt-in captions to crop ("crop_bottom").
6. Write scripts/mk<ep>.py → episodes/<ep>.json like mk225.py: ~120–140 words, hook with an open question or impossible number in the first sentence, one mechanism, a twist, the binary CTA "Comment <a> or <b>, and subscribe." as the last segment with "cta": true; `de`/`es`/`fr` on every segment (metric units in the dubs); "voice": "gemini", "gemini_wpm": 175; "hf": {"style": "doku", "custom": "hf_real"}; music: a CC BY track already used in episodes/*.json, as the first "photos" entry.
   "real": sources, spans (from/to seconds in the source, "slow": 2 for twice-slower interpolated slow motion), events (scene index, caption word prefix, nth), shots (from/to as event times like "hits+0.8", span, at = seconds inside that span, cx, zoom, optional clock), stamps (big number/word + short sub), labels (x, y in the 1080×1920 frame, footage window is y 285–1635), cues (sound names: tick click pop thump whoosh swish scratch riser crack splash sonar bubble beep flat pen coin hit zap land).
   Shots should change every 3–8 s; show the mechanism while it is spoken; big stamps for the key numbers.
7. uploads/<ep>.md like uploads/225.md (title ≤ 70 chars with one emoji, description with sources, footage credit, pinned comment, DE/ES/FR titles). Append one line to docs/topics.md: `#<ep> <topic> (key facts)`.
8. `python3 scripts/real_check.py <ep>` must print ok. Fix until it does.
9. Commit everything with a clear message ending in "Co-Authored-By: Claude <noreply@anthropic.com>", push to main. Then create `requests/<ep>.txt` (content: the title) in a **separate** commit and push it: that push starts the render (render-request.yml). One request per run.
10. Final message: episode, topic, footage used (file + licence), and what you are unsure about.
