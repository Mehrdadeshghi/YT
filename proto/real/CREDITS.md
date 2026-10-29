# real-1 prototypes — sources and licences

Rebuild: images `gh workflow run zack-images.yml -f shots=proto/real/shots.json -f shards=12` → `gh run download` into
`proto/real/<n>/assets/gen/`; real media from Wikimedia Commons into `proto/real/media/` (list below);
voice `.venv/bin/python proto/zack_ai/voice.py proto/real/<n>/script.txt proto/real/<n>/assets/vo.wav am_michael 1.25`;
video `bash proto/real/lib/render.sh <n>` (build.py → HyperFrames 0.8.149 → film post → mix.py).

- AI plates: SDXL base 1.0 + ByteDance SDXL-Lightning 8-step UNet (CreativeML Open RAIL++-M, commercial use allowed under its
  use restrictions); depth Depth-Anything-V2-Small (Apache-2.0). Always labelled on screen (SIMULATION / RECREATION / ILLUSTRATION · AI).
- Voice (preview only): Kokoro-82M am_michael ×1.25 (Apache-2.0); word timings faster-whisper small.en (MIT).
- Sound: Kenney CC0 impacts (assets/sfx); all other sounds and the drone bed synthesized with ffmpeg.
- Maps: Natural Earth 1:50m (public domain).
- Fonts: Inter (OFL), mono + serif from fonts/ (OFL).

## Real media (Wikimedia Commons)
| file | Commons title | licence | author |
|---|---|---|---|
| plane/hole_in.jpg | Alaska Airlines Flight 1282 NTSB 01.jpg | Public domain | NTSB |
| plane/hole_in2.jpg | Alaska Airlines Flight 1282 NTSB 05.jpg | Public domain | NTSB |
| plane/hole_out.jpg | Alaska Airlines Flight 1282 NTSB 03.jpg | Public domain | NTSB |
| plane/plug_yard.jpg | Alaska 1282 door plug NTSB 02.jpg | Public domain | NTSB |
| mine/rigs.jpg | 12.10.2010 Rescatistas.jpg | CC BY 2.0 | Gobierno de Chile |
| mine/drill.jpg | Chile Mine Rescue (5076034926).jpg | CC BY 2.0 | Secretaría de Comunicaciones, Chile (Hugo Infante) |
| mine/capsule_day.jpg | Chilean Mine Rescue (5073633442).jpg | CC BY 2.0 | Secretaría de Comunicaciones, Chile |
| mine/capsule_night.jpg | First test descent (5077054884).jpg | CC BY 2.0 | Secretaría de Comunicaciones, Chile |
| mine/flag.jpg | Final rescue (5079621071).jpg (Piñera hugs Luis Urzúa) | CC BY 2.0 | Secretaría de Comunicaciones, Chile |
| mine/fenix.jpg | Fénix-2 en exhibición en Santiago.jpg (capsule on display, after the rescue) | Public domain | Diode |
| mine/note.svg | Estamos bien los 33.svg (tracing of the note) | Public domain | José Ojeda |
| light/slowmo_v.webm | Lightning strikes in slow motion (240fps) in Muurame, Finland.webm | CC BY 3.0 | MrNousia |
| light/slowmo_h.webm | LightningStrike240FPS.webm | CC BY-SA 4.0 | GalaxyDoge72 |
| light/slowmo_b.webm | Lightning in Slow Motion (Free to Use HD Stock Video Footage).webm | CC BY 3.0 | Jeffrey Beach |
| light/bolt_photo.jpg | 004 2018 05 14 Extremes Wetter.jpg | CC BY-SA 4.0 | Friedrich Haag |
| light/iss_milky.jpg | ISS-44 Milky Way and lightning strike from space.jpg | Public domain | NASA |
