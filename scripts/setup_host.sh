#!/bin/bash
# Installs SadTalker (AI presenter, see host.py) in its own Python 3.10 env: $1 = target dir (default /opt/st)
set -e; D="${1:-/opt/st}"; mkdir -p "$D"; cd "$D"
pip install -q uv
[ -d SadTalker ] || git clone -q --depth 1 https://github.com/OpenTalker/SadTalker.git
[ -x py/bin/python ] || uv venv -q -p 3.10 py
VIRTUAL_ENV=py uv pip install -q torch==2.0.1 torchvision==0.15.2 "numpy==1.23.5" face_alignment==1.3.5 imageio==2.19.3 imageio-ffmpeg librosa==0.9.2 \
  "numba<0.58" resampy==0.3.1 pydub==0.25.1 scipy==1.10.1 kornia==0.6.8 tqdm yacs==0.1.8 pyyaml joblib==1.1.0 scikit-image==0.19.3 basicsr==1.4.2 \
  facexlib==0.3.0 gfpgan av safetensors soundfile "setuptools<70"
cd SadTalker; mkdir -p checkpoints gfpgan/weights
R=https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc
for f in mapping_00109-model.pth.tar mapping_00229-model.pth.tar SadTalker_V0.0.2_256.safetensors; do [ -f checkpoints/$f ] || curl -sSLf -o checkpoints/$f $R/$f; done
W=gfpgan/weights
[ -f $W/alignment_WFLW_4HG.pth ] || curl -sSLf -o $W/alignment_WFLW_4HG.pth https://github.com/xinntao/facexlib/releases/download/v0.1.0/alignment_WFLW_4HG.pth
[ -f $W/detection_Resnet50_Final.pth ] || curl -sSLf -o $W/detection_Resnet50_Final.pth https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth
[ -f $W/GFPGANv1.4.pth ] || curl -sSLf -o $W/GFPGANv1.4.pth https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth
[ -f $W/parsing_parsenet.pth ] || curl -sSLf -o $W/parsing_parsenet.pth https://github.com/xinntao/facexlib/releases/download/v0.2.2/parsing_parsenet.pth
echo "SadTalker ready in $D"
