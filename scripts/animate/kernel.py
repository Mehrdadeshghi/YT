# Runs on Kaggle (free T4 GPU). Animates drawn frames with Wan 2.2 TI2V-5B (Apache-2.0) via diffusers.
# P = {"clips": [{"name": "wall", "image_url": "...", "prompts": ["part 1 action", "part 2 action"], "frames": 121}], "negative": "...", "steps": 30}
# Each clip is chained from 61-frame parts (a T4 runs out of memory above that); part k uses prompts[k] (last one repeats).
import json, os, subprocess, sys, time, urllib.request
t0 = time.time()
P = None  # PARAMS (the workflow replaces this line with the run's parameters)
print('params', json.dumps(P)[:2000], flush=True)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'diffusers>=0.35', 'transformers', 'accelerate', 'ftfy', 'imageio', 'imageio-ffmpeg', 'sentencepiece'], check=True)
os.environ['HF_HOME'] = '/tmp/hf'
import gc, torch, numpy as np
from PIL import Image
from diffusers import AutoencoderKLWan, WanImageToVideoPipeline
from diffusers.utils import export_to_video
from transformers import UMT5EncoderModel
print('torch', torch.__version__, torch.cuda.get_device_name(0), flush=True)
mid = P.get('model', 'Wan-AI/Wan2.2-TI2V-5B-Diffusers')
dt = torch.float16 if torch.cuda.get_device_capability(0)[0] < 8 else torch.bfloat16
te = UMT5EncoderModel.from_pretrained(mid, subfolder='text_encoder', torch_dtype=torch.bfloat16)
vae = AutoencoderKLWan.from_pretrained(mid, subfolder='vae', torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(mid, vae=vae, text_encoder=te, torch_dtype=dt)
neg = P.get('negative', 'blurry, distorted face, deformed hands, extra limbs, character leaves the frame, empty scene, changing hairstyle, flicker, photo, 3d render, text, watermark')
# every prompt is encoded once on the CPU (the 11 GB text encoder doesn't fit next to the transformer), then the encoder leaves
EMB = {}
with torch.no_grad():
    for c in P['clips']:
        for p in c['prompts']:
            if p not in EMB: EMB[p] = pipe.encode_prompt(prompt=p, negative_prompt=neg, do_classifier_free_guidance=True, device=torch.device('cpu'), dtype=torch.bfloat16)
pipe.text_encoder = None; del te; gc.collect()
pipe.transformer.to('cuda', dt); pipe.vae.to('cuda')
if hasattr(pipe.vae, 'enable_tiling'): pipe.vae.enable_tiling()
print('loaded', round(time.time() - t0), 's', flush=True)
W, H, seg = P.get('width', 480), P.get('height', 832), P.get('seg_frames', 61)
for ci, c in enumerate(P['clips']):
    start = Image.open(urllib.request.urlopen(c['image_url'])).convert('RGB').resize((W, H))
    total, out, k = c.get('frames', 121), [], 0
    while len(out) < total:
        need = total - len(out) + (1 if out else 0)
        n = seg if need > seg else max(5, ((need - 1) // 4) * 4 + 1)
        pe, ne = EMB[c['prompts'][min(k, len(c['prompts']) - 1)]]
        fr = pipe(image=start, prompt_embeds=pe.to('cuda', dt), negative_prompt_embeds=ne.to('cuda', dt), height=H, width=W, num_frames=n,
                  guidance_scale=P.get('guidance', 5.0), num_inference_steps=P.get('steps', 30), generator=torch.Generator('cpu').manual_seed(P.get('seed', 7) + 100 * ci + k)).frames[0]
        fr = [np.asarray(f) if isinstance(f, Image.Image) else f for f in fr]
        out += list(fr if not out else fr[1:])
        last = fr[-1]; start = Image.fromarray((np.clip(last, 0, 1) * 255).astype('uint8') if last.dtype != np.uint8 else last)
        k += 1; print(c['name'], 'part', k, len(out), 'frames', round(time.time() - t0), 's', flush=True); torch.cuda.empty_cache()
    export_to_video(out[:total], f"/kaggle/working/{c['name']}.mp4", fps=P.get('fps', 24))
print('done', round(time.time() - t0), 's', flush=True)
