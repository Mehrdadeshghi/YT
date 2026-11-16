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
mid = P.get('model', 'Wan-AI/Wan2.2-TI2V-5B-Diffusers')
dt = torch.float16 if torch.cuda.get_device_capability(0)[0] < 8 else torch.bfloat16
vae = AutoencoderKLWan.from_pretrained(mid, subfolder='vae', torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(mid, vae=vae, torch_dtype=dt)
pipe.enable_model_cpu_offload()
print('loaded', round(time.time() - t0), 's', flush=True)
W, H = P.get('width', 480), P.get('height', 832)
img = img.resize((W, H))
out = pipe(image=img, prompt=P['prompt'], negative_prompt=P.get('negative', 'blurry, distorted face, extra limbs, deformed hands, flicker, photo, 3d render, text, watermark'),
           height=H, width=W, num_frames=P.get('frames', 81), guidance_scale=P.get('guidance', 5.0), num_inference_steps=P.get('steps', 30),
           generator=torch.Generator('cpu').manual_seed(P.get('seed', 7))).frames[0]
export_to_video(out, '/kaggle/working/out.mp4', fps=P.get('fps', 24))
print('done', round(time.time() - t0), 's', flush=True)
