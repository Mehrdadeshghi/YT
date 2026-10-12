#!/bin/bash
# Installs Ditto (antgroup/ditto-talkinghead, Apache-2.0; PyTorch model, patched for CPU) in its own Python 3.10 env: $1 = dir (default /opt/ditto)
set -e; D="${1:-/opt/ditto}"; HERE="$(cd "$(dirname "$0")/.." && pwd)"
[ -d "$D/.git" ] || git clone -q --depth 1 https://github.com/antgroup/ditto-talkinghead "$D"
python3 "$HERE/scripts/ditto_cpu.py" "$D"
pip install -q uv; cd "$D"; [ -x py/bin/python ] || uv venv -q -p 3.10 py
VIRTUAL_ENV=py uv pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cpu
VIRTUAL_ENV=py uv pip install -q librosa tqdm filetype imageio opencv-python-headless scikit-image cython imageio-ffmpeg colored onnxruntime mediapipe huggingface_hub einops
py/bin/python -c "from huggingface_hub import snapshot_download as s; s('digital-avatar/ditto-talkinghead', local_dir='checkpoints', allow_patterns=['ditto_cfg/v0.4_hubert_cfg_pytorch.pkl', 'ditto_pytorch/*', 'ditto_pytorch/*/*'])"
echo "Ditto ready in $D"
