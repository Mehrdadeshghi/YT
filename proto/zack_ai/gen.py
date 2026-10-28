#!/usr/bin/env python3
"""Zack-style AI stills on CPU: SDXL base 1.0 + SDXL-Lightning 4-step UNet (both CreativeML OpenRAIL++-M, commercial use OK
under the licence's use restrictions) + Depth-Anything-V2-Small (Apache-2.0) depth maps for 2.5D parallax.

    python gen.py shots.json OUT_DIR SHARD NSHARDS [only=s01,s07]

Memory trick for a 16 GB runner in fp32: encode ALL prompts first, free both text encoders, then load the UNet.
Writes OUT_DIR/<id>_<seed>.png, <id>_<seed>_depth.png and timing.json (seconds per image).
"""
import gc, json, os, sys, time
import torch

cfg = json.load(open(sys.argv[1])); out = sys.argv[2]; shard, nsh = int(sys.argv[3]), int(sys.argv[4])
only = set(sys.argv[5].split(',')) if len(sys.argv) > 5 and sys.argv[5] else None
os.makedirs(out, exist_ok=True)
torch.set_num_threads(os.cpu_count())
BASE, LIGHT = 'stabilityai/stable-diffusion-xl-base-1.0', 'ByteDance/SDXL-Lightning'

jobs = []
for s in cfg['shots']:
    if only and s['id'] not in only: continue
    for seed in s.get('seeds', cfg['seeds']):
        jobs.append((s['id'], seed, s['p']))
jobs = [j for i, j in enumerate(jobs) if i % nsh == shard]
print('jobs', [(a, b) for a, b, _ in jobs], flush=True)


def expand(p):
    for k, v in cfg['chars'].items(): p = p.replace('{' + k + '}', v)
    return cfg.get('prefix', '') + p + ', ' + cfg['style']


from diffusers import StableDiffusionXLPipeline, UNet2DConditionModel, EulerDiscreteScheduler, AutoencoderKL
from huggingface_hub import hf_hub_download, snapshot_download
from safetensors import safe_open
from accelerate import init_empty_weights
BASE = snapshot_download(BASE, allow_patterns=['model_index.json', 'scheduler/*', 'tokenizer/*', 'tokenizer_2/*', 'unet/config.json',
    'text_encoder/config.json', 'text_encoder/model.fp16.safetensors', 'text_encoder_2/config.json', 'text_encoder_2/model.fp16.safetensors',
    'vae/config.json', 'vae/diffusion_pytorch_model.fp16.safetensors'])

T = {}
t0 = time.time()
with init_empty_weights():   # meta UNet (no memory) so the pipeline can be built for prompt encoding
    unet = UNet2DConditionModel.from_config(UNet2DConditionModel.load_config(BASE, subfolder='unet'))
vae = AutoencoderKL.from_pretrained(BASE, subfolder='vae', torch_dtype=torch.float32, variant='fp16', use_safetensors=True).eval()
pipe = StableDiffusionXLPipeline.from_pretrained(BASE, unet=unet, vae=vae, torch_dtype=torch.float32, variant='fp16', use_safetensors=True)
emb = {}
with torch.no_grad():
    for sid, seed, p in jobs:
        if sid in emb: continue
        pe, npe, ppe, nppe = pipe.encode_prompt(expand(p), device='cpu', num_images_per_prompt=1, do_classifier_free_guidance=False)
        emb[sid] = (pe, ppe)
tok_enc = pipe.tokenizer, pipe.tokenizer_2
del pipe; gc.collect()
T['encode_s'] = round(time.time() - t0, 1)

t0 = time.time()
with safe_open(hf_hub_download(LIGHT, 'sdxl_lightning_4step_unet.safetensors'), 'pt') as f:   # one tensor at a time -> ~10 GB peak
    sd = {k: f.get_tensor(k).float() for k in f.keys()}
unet.load_state_dict(sd, assign=True); del sd; gc.collect()
unet.eval()
pipe = StableDiffusionXLPipeline.from_pretrained(BASE, unet=unet, vae=vae, text_encoder=None, text_encoder_2=None,
                                                 tokenizer=tok_enc[0], tokenizer_2=tok_enc[1], torch_dtype=torch.float32)
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing')
T['load_unet_s'] = round(time.time() - t0, 1)

per = {}
for sid, seed, p in jobs:
    t0 = time.time()
    pe, ppe = emb[sid]
    with torch.no_grad():
        lat = pipe(prompt_embeds=pe, pooled_prompt_embeds=ppe, num_inference_steps=4, guidance_scale=0, output_type='latent',
                   width=cfg['width'], height=cfg['height'], generator=torch.Generator('cpu').manual_seed(seed)).images
    torch.save(lat, f'{out}/{sid}_{seed}.lat')
    per[f'{sid}_{seed}'] = round(time.time() - t0, 1); print(sid, seed, per[f'{sid}_{seed}'], 's', flush=True)
del pipe, unet; gc.collect()
# decode after the UNet is gone (fp32 VAE at 768x1344 needs several GB)
t0 = time.time()
# (vae loaded at the top, kept)
from diffusers.image_processor import VaeImageProcessor
proc = VaeImageProcessor(vae_scale_factor=8)
for sid, seed, _ in jobs:
    lat = torch.load(f'{out}/{sid}_{seed}.lat'); os.remove(f'{out}/{sid}_{seed}.lat')
    with torch.no_grad():
        im = vae.decode(lat / vae.config.scaling_factor).sample
    proc.postprocess(im, output_type='pil')[0].save(f'{out}/{sid}_{seed}.png')
n = max(1, len(jobs)); T['decode_s_per_image'] = round((time.time() - t0) / n, 1)
T['unet_s_per_image'] = per
del vae; gc.collect()

# depth maps (Depth-Anything-V2-Small, Apache-2.0)
t0 = time.time()
from transformers import pipeline
from PIL import Image
dep = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf', device='cpu')
for sid, seed, _ in jobs:
    d = dep(Image.open(f'{out}/{sid}_{seed}.png'))['depth']
    d.resize((cfg['width'], cfg['height'])).save(f'{out}/{sid}_{seed}_depth.png')
T['depth_s'] = round(time.time() - t0, 1)
json.dump(T, open(f'{out}/timing_{shard}.json', 'w'), indent=1)
print(json.dumps(T))
