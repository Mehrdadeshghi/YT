# Runs on Kaggle (free GPU). Animates one drawn frame with Wan 2.2 TI2V-5B (Apache-2.0) via diffusers.
# Parameters come from params.json next to this script (written by .github/workflows/animate.yml).
import json, os, subprocess, sys, time, urllib.request
t0 = time.time()
P = None  # PARAMS (the workflow replaces this line with the run's parameters)
print('params', P, flush=True)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'diffusers>=0.35', 'transformers', 'accelerate', 'ftfy', 'imageio', 'imageio-ffmpeg', 'sentencepiece'], check=True)
os.environ['HF_HOME'] = '/tmp/hf'
import torch, numpy as np
from PIL import Image
print('torch', torch.__version__, torch.cuda.get_device_name(0), torch.cuda.get_device_properties(0).total_memory // 2**20, 'MB', flush=True)
img = Image.open(urllib.request.urlopen(P['image_url'])).convert('RGB')
from diffusers import AutoencoderKLWan, WanImageToVideoPipeline
from diffusers.utils import export_to_video
from transformers import UMT5EncoderModel
mid = P.get('model', 'Wan-AI/Wan2.2-TI2V-5B-Diffusers')
dt = torch.float16 if torch.cuda.get_device_capability(0)[0] < 8 else torch.bfloat16
# a T4 has 15 GB: the 11 GB text encoder runs once on the CPU (bf16), then leaves; transformer + VAE live on the GPU
te = UMT5EncoderModel.from_pretrained(mid, subfolder='text_encoder', torch_dtype=torch.bfloat16)
vae = AutoencoderKLWan.from_pretrained(mid, subfolder='vae', torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(mid, vae=vae, text_encoder=te, torch_dtype=dt)
neg = P.get('negative', 'blurry, distorted face, extra limbs, deformed hands, flicker, photo, 3d render, text, watermark')
with torch.no_grad(): pe, ne = pipe.encode_prompt(prompt=P['prompt'], negative_prompt=neg, do_classifier_free_guidance=True, device=torch.device('cpu'), dtype=torch.bfloat16)
pipe.text_encoder = None; del te; import gc; gc.collect()
pipe.transformer.to('cuda', dt); pipe.vae.to('cuda'); pipe.vae.enable_tiling() if hasattr(pipe.vae, 'enable_tiling') else None
pe, ne = pe.to('cuda', dt), ne.to('cuda', dt)
print('loaded', round(time.time() - t0), 's', flush=True)
W, H = P.get('width', 480), P.get('height', 832)
img = img.resize((W, H))
# a T4 runs out of memory above ~61 frames: long clips are chained, each part starting on the previous part's last frame
total, seg = P.get('frames', 121), P.get('seg_frames', 61)
prompts = P.get('prompts') or [P['prompt']]
out, start, k = [], img, 0
while len(out) < total:
    n = seg if total - len(out) + (1 if out else 0) > seg else max(5, ((total - len(out) + (1 if out else 0) - 1) // 4) * 4 + 1)
    pe_k, ne_k = pe, ne
    if len(prompts) > 1 and k < len(prompts): pass   # shortcut: one prompt embedding for all parts; per-part prompts would need the text encoder again
    fr = pipe(image=start, prompt_embeds=pe_k, negative_prompt_embeds=ne_k, height=H, width=W, num_frames=n, guidance_scale=P.get('guidance', 5.0),
              num_inference_steps=P.get('steps', 30), generator=torch.Generator('cpu').manual_seed(P.get('seed', 7) + k)).frames[0]
    out += list(fr if not out else fr[1:]); start = Image.fromarray((np.clip(fr[-1], 0, 1) * 255).astype('uint8')) if not isinstance(fr[-1], Image.Image) else fr[-1]
    k += 1; print('part', k, len(out), 'frames', round(time.time() - t0), 's', flush=True); torch.cuda.empty_cache()
out = out[:total]
export_to_video(out, '/kaggle/working/out.mp4', fps=P.get('fps', 24))
print('done', round(time.time() - t0), 's', flush=True)
