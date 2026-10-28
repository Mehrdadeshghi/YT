# Zack-style probe 1 (AI stills) — sources and licences

- Images: generated with Stable Diffusion XL base 1.0 (Stability AI) text encoders + VAE and the ByteDance SDXL-Lightning
  4-step UNet — both under the CreativeML Open RAIL++-M licence (commercial use of outputs allowed; the licence's use
  restrictions apply). Workflow `.github/workflows/zack-images.yml`, prompts/seeds `shots.json`. Label on screen if used: ILLUSTRATION (AI).
- Depth maps (2.5D parallax): Depth-Anything-V2-Small, Apache-2.0.
- Voice (preview only): Kokoro-82M (Apache-2.0), voice am_michael, speed 1.25. Word timings: faster-whisper small.en (MIT).
- Sound effects: Kenney (kenney.nl), CC0; whooshes/rumble synthesized with ffmpeg.
- Facts: `scripts/zack/molasses.facts.md` (English Wikipedia, "Great Molasses Flood").

Rebuild: images → `gh workflow run zack-images.yml` (8 runners) → `gh run download` into `assets/gen/`;
voice → `.venv/bin/python proto/zack_ai/voice.py scripts/zack/molasses.txt proto/zack_ai/assets/vo.wav`;
video → `bash proto/zack_ai/render.sh` (build.py: tint + depth layers + HyperFrames project; mix.py: VO + SFX, −14 LUFS).
