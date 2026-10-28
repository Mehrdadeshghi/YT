#!/usr/bin/env bash
# proto/zack_3d/fetch_assets.sh — downloads every 3D asset / library of the Zack-style 3D probe from pinned URLs
# into proto/zack_3d/assets (gitignored). All models CC0 (see CREDITS.md). Idempotent.
set -e
cd "$(dirname "$0")"
A=assets; mkdir -p $A/glb $A/hdr $A/lib $A/fonts
# Quaternius (CC0 1.0), mirrored per model in trebeljahr/quaternius-showcase, pinned commit
Q=https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/722c39e964360beff2728a8ee4d103e2d11d457c/public/glb
get() { [ -s "$2" ] || { curl -sSLf --retry 3 -o "$2.part" "$1" && mv "$2.part" "$2"; echo "got $2"; }; }
for m in modular_men/Suit modular_men/Worker modular_men/Casual modular_men/Farmer \
         modular_women/Formal modular_women/Casual modular_women/Medieval modular_women/Worker \
         animals_pack/Horse animals_pack/Husky \
         buildings_pack_3/3Story_Balcony_Mat buildings_pack_3/4Story_Mat buildings_pack_3/2Story_Sign_Mat \
         buildings_pack_3/3Story_Slim_Mat buildings_pack_3/4Story_Center_Mat buildings_pack_3/2Story_Wide_Mat \
         medieval_village_pack/Cart medieval_village_pack/Barrel medieval_village_pack/Crate \
         street_pack/Streetlight_Single; do
  get "$Q/$m.glb" "$A/glb/$(echo $m | tr / _).glb"
done
# Quaternius "Animated Men / Women Characters" (Feb 2019, CC0 1.0) — rigged FBX with Idle/Walk/Run/Death… clips,
# mirrored in beep2bleep/FreeAssetsByKenneyNLandQuaternius, pinned commit
B=https://raw.githubusercontent.com/beep2bleep/FreeAssetsByKenneyNLandQuaternius/dea756baf3b3a4889d8c245e456a4791f961578a/FreeModels%20by%20Quaternius%5BPatreon%5D/Characters%20and%20Animals
mkdir -p $A/fbx
for m in Smooth_Male_Suit Smooth_Male_LongSleeve Smooth_Male_Shirt; do
  get "$B/Animated%20Men%20Characters%20-%20Feb%202019/FBX/$m.fbx" "$A/fbx/$m.fbx"; done
for m in Smooth_Female_Dress Smooth_Female_Casual; do
  get "$B/Animated%20Women%20Characters%20-%20Feb%202019/FBX/$m.fbx" "$A/fbx/$m.fbx"; done
# Poly Haven HDRI (CC0), 1k
get https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr $A/hdr/sky_1k.hdr
# Poly Haven texture (CC0): cobblestone_floor_08, 1k diffuse + normal
mkdir -p $A/tex
for m in diff nor_gl; do get https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/cobblestone_floor_08/cobblestone_floor_08_${m}_1k.jpg $A/tex/cobble_$m.jpg; done
# three.js r160 (MIT) — module build + the addons we import
T=https://cdn.jsdelivr.net/npm/three@0.160.0
mkdir -p $A/lib/three/build $A/lib/three/examples/jsm/{loaders,utils,postprocessing,shaders,libs}
get $T/build/three.module.js $A/lib/three/build/three.module.js
mkdir -p $A/lib/three/examples/jsm/curves
for f in loaders/GLTFLoader.js loaders/RGBELoader.js loaders/FBXLoader.js libs/fflate.module.js curves/NURBSCurve.js curves/NURBSUtils.js \
         utils/SkeletonUtils.js utils/BufferGeometryUtils.js; do
  get $T/examples/jsm/$f $A/lib/three/examples/jsm/$f
done
# fonts from the repo (Inter 800, OFL)
cp -n ../../fonts/Inter-800.woff2 $A/fonts/ 2>/dev/null || true
echo assets ready
