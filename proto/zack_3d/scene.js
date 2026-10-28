// Zack-style probe 2 — Great Molasses Flood (Boston, 15 Jan 1919) as real 3D animation (three.js r160 in HyperFrames).
// Everything is a pure function of the timeline time t (AnimationMixer.setTime, seeded hashes, no clocks).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';

const W = 1080, H = 1920, DUR = 36.7;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;
const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ------------------------------------------------------------------ renderer / scene
const cv = document.getElementById('gl');
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
R.setPixelRatio(1); R.setSize(W, H, false);
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.localClippingEnabled = true;
const scene = new THREE.Scene();
const FOG_DAY = new THREE.Color('#c8d3dc');
scene.fog = new THREE.Fog(FOG_DAY.clone(), 45, 210);
const cam = new THREE.PerspectiveCamera(38, W / H, 0.1, 600);

const hemi = new THREE.HemisphereLight(0xdfe8f2, 0x5a4636, 0.55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe0bc, 2.6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4;
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 220 });
scene.add(sun, sun.target);
const SUN_DIR = V(-0.55, 0.62, 0.56).normalize();

// ------------------------------------------------------------------ materials
const M = {
  cobble: new THREE.MeshStandardMaterial({ color: 0xb9ab9b, roughness: 0.92 }),
  walk: new THREE.MeshStandardMaterial({ color: 0x9d968c, roughness: 0.95 }),
  dirt: new THREE.MeshStandardMaterial({ color: 0x8a7a66, roughness: 1 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x6d7378, roughness: 0.5, metalness: 0.55, side: THREE.DoubleSide }),
  steelIn: new THREE.MeshStandardMaterial({ color: 0x3a2312, roughness: 0.35, metalness: 0.2 }),
  rivet: new THREE.MeshStandardMaterial({ color: 0x8b9095, roughness: 0.35, metalness: 0.8 }),
  goo: new THREE.MeshPhysicalMaterial({ color: 0x341405, roughness: 0.2, metalness: 0.0, clearcoat: 0.55, clearcoatRoughness: 0.12,
    sheen: 0.3, sheenColor: 0x8a3a0a, sheenRoughness: 0.4, emissive: 0x1a0700, envMapIntensity: 0.55, side: THREE.DoubleSide }),
  gooCut: new THREE.MeshPhysicalMaterial({ color: 0x6a300a, roughness: 0.3, transparent: true, opacity: 0.74, depthWrite: false, side: THREE.DoubleSide,
    emissive: 0x2a0e02 }),
  water: new THREE.MeshPhysicalMaterial({ color: 0x2b4f5e, roughness: 0.07, metalness: 0.1, clearcoat: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x7a5636, roughness: 0.85 }),
  black: new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.6, metalness: 0.3 }),
  white: new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }),
  frost: new THREE.MeshStandardMaterial({ color: 0xf2f7ff, roughness: 0.4, emissive: 0x9fb4c8, emissiveIntensity: 0.25 }),
  breath: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }),
  wisp: new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
};

// ------------------------------------------------------------------ world: street (along z), tank at the -z end, harbor at the +z end
const TANK = V(0, 0, -76), TANK_R = 13.5, TANK_H = 15.2;   // 90 ft wide, 50 ft tall (Wikipedia)
const world = new THREE.Group(); scene.add(world);
function box(w, h, d, mat, x, y, z, cast = true) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; world.add(m); return m; }
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), M.dirt); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; world.add(ground);
const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 112), M.cobble); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -2); road.receiveShadow = true; world.add(road);
box(3, 0.16, 112, M.walk, 7.5, 0.08, -2, false); box(3, 0.16, 112, M.walk, -7.5, 0.08, -2, false);
// rails for the streetcar
for (const x of [-4.2, -2.8]) box(0.09, 0.05, 112, M.black, x, 0.025, -2, false);
// wharf + harbor water beyond z = 58
box(40, 1.4, 1.2, M.wood, 0, -0.7, 58.6, false);
const water = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), M.water); water.rotation.x = -Math.PI / 2; water.position.set(0, -1.1, 158); world.add(water);
const groundCut = new THREE.Mesh(new THREE.PlaneGeometry(600, 300), M.dirt); // keep the dirt ground from covering the water
ground.geometry = new THREE.PlaneGeometry(600, 360); ground.position.z = -120;

// ------------------------------------------------------------------ the tank: 24 riveted panels that can fly
const tank = new THREE.Group(); tank.position.copy(TANK); world.add(tank);
const NP = 24, DTH = Math.PI * 2 / NP;
const panels = [];
const rivetGeo = new THREE.SphereGeometry(0.075, 8, 5);
for (let i = 0; i < NP; i++) {
  const th = i * DTH;                      // panel centre angle; th = 0 faces +z (the street)
  const g = new THREE.CylinderGeometry(TANK_R, TANK_R, TANK_H, 8, 1, true, -DTH / 2, DTH);
  g.translate(0, TANK_H / 2, -TANK_R);
  const pivot = new THREE.Group(); pivot.position.set(Math.sin(th) * TANK_R, 0, Math.cos(th) * TANK_R); pivot.rotation.y = th;
  const mesh = new THREE.Mesh(g, M.steel); mesh.castShadow = mesh.receiveShadow = true; pivot.add(mesh);
  // rivets: 6 horizontal seams + the vertical seam at the panel's left edge
  const pts = [];
  for (const y of [0.35, 3.1, 6.1, 9.1, 12.1, 14.85]) for (let k = 0; k < 8; k++) { const a = -DTH / 2 + (k + .5) * DTH / 8; pts.push([Math.sin(a) * (TANK_R + .02), y, Math.cos(a) * (TANK_R + .02) - TANK_R]); }
  for (let y = 0.6; y < TANK_H; y += 0.55) { const a = -DTH / 2 + 0.012; pts.push([Math.sin(a) * (TANK_R + .02), y, Math.cos(a) * (TANK_R + .02) - TANK_R]); }
  const im = new THREE.InstancedMesh(rivetGeo, M.rivet, pts.length); const mm = new THREE.Matrix4();
  pts.forEach((p, k) => { mm.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(k, mm); }); pivot.add(im);
  tank.add(pivot); panels.push({ pivot, th, home: pivot.position.clone() });
}
const roof = new THREE.Mesh(new THREE.ConeGeometry(TANK_R + 0.15, 2.4, 48, 1, true), M.steel); roof.position.y = TANK_H + 1.2; roof.castShadow = true; tank.add(roof);
const tankFill = new THREE.Mesh(new THREE.CylinderGeometry(TANK_R - .05, TANK_R - .05, TANK_H - .2, 48), M.goo); tankFill.position.y = TANK_H / 2; tankFill.visible = false; tank.add(tankFill);
// flying rivets + jets (S3)
const NFR = 34;
const flyR = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 6), M.rivet, NFR); flyR.castShadow = true; world.add(flyR);
const jets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 10, 8), M.goo, NFR); world.add(jets);

// ------------------------------------------------------------------ molasses flood: a CPU heightfield, radial from the tank
const FX0 = -34, FX1 = 34, FZ0 = -100, FZ1 = 60;
const fgeo = new THREE.PlaneGeometry(FX1 - FX0, FZ1 - FZ0, 170, 420); fgeo.rotateX(-Math.PI / 2); fgeo.translate((FX0 + FX1) / 2, 0, (FZ0 + FZ1) / 2);
const flood = new THREE.Mesh(fgeo, M.goo); flood.receiveShadow = true; flood.castShadow = false; flood.frustumCulled = false; world.add(flood);
const FP = { R: 0, Hh: 8, dep: 1, Ld: 9, t: 0, wob: 1, cap: null };
function floodH(x, z) {
  const dx = x - TANK.x, dz = z - TANK.z, d = Math.hypot(dx, dz);
  const Reff = FP.R + 1.2 * Math.sin(0.33 * x + 0.9) * FP.wob + 0.7 * Math.sin(0.71 * x - 0.4 * z) * FP.wob;
  const u = Reff - d;
  if (u < 0) return -2.2;
  const rise = Math.pow(Math.sin(Math.min(u / 3.2, 1) * Math.PI / 2), 0.55);
  const crest = FP.Hh * rise * Math.exp(-Math.max(0, u - 2.6) / FP.Ld);
  const rip = (0.16 * Math.sin(0.9 * x + 1.4 * z - 3.1 * FP.t) + 0.1 * Math.sin(1.9 * x - 0.8 * z + 2.3 * FP.t) + 0.06 * Math.sin(3.7 * x + 2.9 * z - 5 * FP.t))
    * (0.35 + FP.Hh / 10) * FP.wob;
  return Math.max(FP.dep * rise, crest) + rip * rise;
}
function updateFlood() {
  const p = fgeo.attributes.position.array;
  for (let i = 0; i < p.length; i += 3) p[i + 1] = floodH(p[i], p[i + 2]);
  fgeo.attributes.position.needsUpdate = true; fgeo.computeVertexNormals();
}
// cutaway face (S11/S12): translucent slice through the flood at z = CUT_Z
const CUT_Z = 14;
const cutFace = new THREE.Mesh(new THREE.PlaneGeometry(12, 1), M.gooCut); cutFace.visible = false; world.add(cutFace);
const clipPlane = new THREE.Plane(V(0, 0, -1), CUT_Z);   // keeps z < CUT_Z
const gooClip = M.goo.clone(); gooClip.clippingPlanes = [clipPlane];

// spray droplets + debris riding the crest
const NSP = 420;
const spray = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 7), M.goo, NSP); spray.frustumCulled = false; world.add(spray);
const frostIM = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.035, 0), M.frost, 900); frostIM.frustumCulled = false; world.add(frostIM);

// ------------------------------------------------------------------ scale bar drawn into the scene ("50 FT")
function label(text, px = 120) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d');
  g.font = `800 ${px}px "Z Inter", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(text, 256, 84); g.fillStyle = '#fff'; g.fillText(text, 256, 84);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, fog: false, transparent: true })); s.renderOrder = 10;
  s.userData.draw = () => { g.clearRect(0, 0, 512, 160); g.font = `800 ${px}px "Z Inter", sans-serif`; g.strokeText(text, 256, 84); g.fillText(text, 256, 84); tex.needsUpdate = true; };
  return s;
}
function scaleBar(text) {
  const grp = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, fog: false, transparent: true });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat), capA = bar.clone(), capB = bar.clone();
  [bar, capA, capB].forEach((m) => { m.renderOrder = 9; grp.add(m); });
  const lab = label(text); grp.add(lab); world.add(grp);
  grp.userData.set = (base, h, k, w, side = 1) => {   // base Vector3, height h, progress k (0..1 grow), w = line width
    grp.visible = k > 0; grp.position.copy(base);
    const hh = h * k; bar.scale.set(w, Math.max(1e-3, hh), w); bar.position.set(0, hh / 2, 0);
    capA.scale.set(w * 9, w, w); capA.position.set(0, 0, 0); capB.scale.set(w * 9, w, w); capB.position.set(0, hh, 0);
    lab.position.set(side * (2.3 + h * 0.02), hh / 2, 0); lab.scale.set(4.0, 1.25, 1); lab.material.opacity = clamp(k * 3 - 1.5);
  };
  grp.userData.redraw = lab.userData.draw; grp.visible = false; return grp;
}
const bar50 = scaleBar('50 FT'), bar25 = scaleBar('25 FT');

// ------------------------------------------------------------------ vehicles (procedural, 1919-ish)
function wheel(r, wdt, mat) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, wdt, 20), mat); m.rotation.z = Math.PI / 2; m.castShadow = true; return m; }
const truck = new THREE.Group(); world.add(truck);
{
  const red = new THREE.MeshStandardMaterial({ color: 0x7d2a1c, roughness: 0.55, metalness: 0.2 });
  const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; truck.add(m); return m; };
  add(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 5.6), M.black), 0, 0.75, 0);
  add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 1.5), red), 0, 1.3, 2.2);                 // hood
  add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.6, 1.3), red), 0, 1.65, 0.9);                 // cab
  add(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 1.5), M.black), 0, 2.5, 0.8);             // roof
  add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.6, 3.2), M.wood), 0, 1.15, -1.4);             // flatbed
  for (const [x, z] of [[-1, 2], [1, 2], [-1, -1.8], [1, -1.8]]) add(wheel(0.5, 0.25, M.black), x, 0.5, z);
  for (let k = 0; k < 4; k++) add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 14), M.wood), -0.55 + (k % 2) * 1.1, 1.9, -0.7 - Math.floor(k / 2) * 1.3).rotation.x = Math.PI / 2;
}
const tram = new THREE.Group(); world.add(tram);
{
  const green = new THREE.MeshStandardMaterial({ color: 0x2f5a3a, roughness: 0.5, metalness: 0.15 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.6 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x223038, roughness: 0.1, metalness: 0.6 });
  const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; tram.add(m); return m; };
  add(new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 10), green), 0, 1.15, 0);
  add(new THREE.Mesh(new THREE.BoxGeometry(2.42, 1.0, 10.02), cream), 0, 2.2, 0);
  for (let k = 0; k < 7; k++) for (const s of [-1, 1]) add(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 1.05), glass), s * 1.215, 2.25, -4.1 + k * 1.37);
  add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 10.3), green), 0, 2.85, 0);
  const pole = add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5, 6), M.black), 0, 4.1, -2); pole.rotation.x = -1.1;
  for (const z of [-3.2, 3.2]) for (const x of [-0.7, 0.7]) add(wheel(0.42, 0.18, M.black), x, 0.42, z);
}

// ------------------------------------------------------------------ loaders
const ASSET = 'assets/';
const gltf = new GLTFLoader(), fbx = new FBXLoader();
const loadG = (f) => gltf.loadAsync(ASSET + 'glb/' + f + '.glb');
const loadF = (f) => fbx.loadAsync(ASSET + 'fbx/' + f + '.fbx');

// people palettes (1919: wool suits, long dresses, bowler hats)
const SKIN = [0xe2b393, 0xc68d6a, 0x8d5a3b, 0xf0c7a8, 0xb07a55];
const SUIT = [0x2e3138, 0x4a3b2f, 0x2c3a4f, 0x5a4a3a, 0x3d3f35];
const DRESS = [0x6a2430, 0x2f4a5a, 0x5a5230, 0x4b2d4f, 0x7a4a2a];
const HAIR = [0x2a1a10, 0x4a2e1a, 0x1a1512, 0x6b4a2a];
const actors = [];
function retint(obj, pal) {
  obj.traverse((m) => {
    if (!m.isMesh) return; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const nm = mats.map((x) => {
      const n = (x.name || '').toLowerCase();
      let col = x.color ? x.color.getHex() : 0x888888, rough = 0.75;
      if (n.includes('skin')) { col = pal.skin; rough = 0.6; }
      else if (n.includes('hair')) col = pal.hair;
      else if (n.includes('eye')) col = 0x0a0a0a;
      else if (n.includes('shirt') || n.includes('pants') || n.includes('dress') || n.includes('top')) col = pal.cloth;
      else if (n.includes('shoe')) col = 0x1d1612;
      else if (n.includes('detail')) col = 0xece6da;
      else if (n.includes('tie')) col = pal.tie;
      return new THREE.MeshStandardMaterial({ color: col, roughness: rough, metalness: 0, map: null });
    });
    m.material = Array.isArray(m.material) ? nm : nm[0];
  });
}
function bowler(color) {
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat); crown.scale.y = 1.05; crown.position.y = 0.02;
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.015, 24), mat);
  [crown, brim].forEach((m) => { m.castShadow = true; g.add(m); }); return g;
}
function makeHuman(src, pal, hat) {
  const o = skClone(src.obj); const s = 1.78 / 482; o.scale.setScalar(s);
  retint(o, pal);
  const mixer = new THREE.AnimationMixer(o), acts = {};
  for (const c of src.clips) { const a = mixer.clipAction(c); a.play(); a.enabled = false; acts[c.name.split('|').pop().replace(/^(Man|Female)_/, '')] = a; }
  let head = null; o.traverse((b) => { if (b.isBone && /head/i.test(b.name) && !head) head = b; });
  const holder = new THREE.Group(); holder.add(o); world.add(holder);
  let hatM = null; if (hat && head) { hatM = bowler(hat); world.add(hatM); }
  const a = { holder, obj: o, mixer, acts, kind: 'human', head, hat: hatM }; actors.push(a); return a;
}
function makeAnimal(src, scale) {
  const o = skClone(src.scene); o.scale.setScalar(scale);
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; } });
  const mixer = new THREE.AnimationMixer(o), acts = {};
  for (const c of src.animations) { const a = mixer.clipAction(c); a.play(); a.enabled = false; acts[c.name.split('|').pop()] = a; }
  const holder = new THREE.Group(); holder.add(o); world.add(holder);
  const a = { holder, obj: o, mixer, acts, kind: 'animal' }; actors.push(a); return a;
}
// pose(actor, clip, clipTime, x, y, z, yaw)
function pose(a, clip, ct, x, y, z, yaw, rate = 1) {
  a.holder.visible = true; a.holder.position.set(x, y, z); a.holder.rotation.set(0, yaw, 0);
  for (const k in a.acts) a.acts[k].enabled = k === clip;
  a.mixer.setTime(Math.max(0, ct * rate));
  if (a.hat) { a.holder.updateMatrixWorld(true); a.head.getWorldPosition(a.hat.position); a.hat.position.y += HAT_UP; a.hat.rotation.set(0, yaw, 0); a.hat.visible = true; }
}
const HAT_UP = 0.2;
const yawTo = (dx, dz) => Math.atan2(dx, dz);

let P = {}, props = {};
async function load() {
  const [hdr, cd, cn] = await Promise.all([
    new RGBELoader().loadAsync(ASSET + 'hdr/sky_1k.hdr'),
    new THREE.TextureLoader().loadAsync(ASSET + 'tex/cobble_diff.jpg'),
    new THREE.TextureLoader().loadAsync(ASSET + 'tex/cobble_nor_gl.jpg')]);
  hdr.mapping = THREE.EquirectangularReflectionMapping; scene.environment = hdr; scene.background = hdr; scene.backgroundIntensity = 0.85;
  scene.environmentIntensity = 0.7;
  for (const t of [cd, cn]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 46); t.anisotropy = 8; }
  cd.colorSpace = THREE.SRGBColorSpace; M.cobble.map = cd; M.cobble.normalMap = cn; M.cobble.normalScale.set(1.2, 1.2); M.cobble.color.set(0xd8cbbb); M.cobble.needsUpdate = true;

  const names = ['Smooth_Male_Suit', 'Smooth_Male_LongSleeve', 'Smooth_Male_Shirt', 'Smooth_Female_Dress', 'Smooth_Female_Casual'];
  const fb = await Promise.all(names.map(loadF));
  fb.forEach((o, i) => { P[names[i]] = { obj: o, clips: o.animations }; });
  const gl = {};
  const gnames = ['animals_pack_Horse', 'animals_pack_Husky', 'medieval_village_pack_Cart', 'medieval_village_pack_Barrel', 'medieval_village_pack_Crate',
    'street_pack_Streetlight_Single', 'buildings_pack_3_3Story_Balcony_Mat', 'buildings_pack_3_4Story_Mat', 'buildings_pack_3_2Story_Sign_Mat',
    'buildings_pack_3_3Story_Slim_Mat', 'buildings_pack_3_4Story_Center_Mat', 'buildings_pack_3_2Story_Wide_Mat'];
  (await Promise.all(gnames.map(loadG))).forEach((g, i) => { gl[gnames[i]] = g; });

  // buildings along both sides of the street (front faces the street)
  const bnames = gnames.filter((n) => n.startsWith('buildings'));
  for (const side of [-1, 1]) {
    let z = -54, k = side > 0 ? 0 : 3;
    while (z < 46) {
      const src = gl[bnames[k % bnames.length]].scene; const b = src.clone(true); const sc = 2.9;
      b.scale.setScalar(sc); const bb = new THREE.Box3().setFromObject(b); const sz = bb.getSize(V(0, 0, 0));
      // model front is +z: turn it to face the street
      b.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      const wdt = sz.x, dep = sz.z;
      b.position.set(side * (9 + dep / 2), 0, z + wdt / 2);
      const BR = [[0x8a3b26, 0x6e2c1c], [0x9a4a30, 0x7a3522], [0x7a3a2a, 0x5e2a1e], [0xa0583a, 0x7e4028], [0x6f3324, 0x552619]][k % 5];
      b.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true;
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        const nm = mats.map((x) => { const c = x.clone(); if (x.name === 'Main') c.color.set(BR[0]); else if (x.name === 'Bricks') c.color.set(BR[1]); else if (x.name === 'Dark') c.color.set(0x2a1d16); else if (x.name === 'White') c.color.set(0xd9cdb8); else if (x.name === 'Light') c.color.set(0x6b6a4a); c.roughness = 0.85; return c; });
        m.material = Array.isArray(m.material) ? nm : nm[0]; } });
      world.add(b); z += wdt + 0.2; k++;
    }
  }
  // lamps
  for (const side of [-1, 1]) for (let z = -48; z < 46; z += 16) {
    const l = gl.street_pack_Streetlight_Single.scene.clone(true); l.scale.setScalar(4.6); l.position.set(side * 6.4, 0.16, z + (side > 0 ? 8 : 0)); l.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    l.traverse((m) => { if (m.isMesh) m.castShadow = true; }); world.add(l);
  }
  // props: barrels + crates for debris, a horse cart, a dog
  props.barrels = Array.from({ length: 8 }, (_, i) => { const b = (i % 2 ? gl.medieval_village_pack_Barrel : gl.medieval_village_pack_Crate).scene.clone(true); b.scale.setScalar(1.6); b.traverse((m) => { if (m.isMesh) m.castShadow = true; }); world.add(b); return b; });
  props.cart = gl.medieval_village_pack_Cart.scene.clone(true); props.cart.scale.setScalar(2.4); props.cart.traverse((m) => { if (m.isMesh) m.castShadow = true; }); world.add(props.cart);

  // cast
  const S = P.Smooth_Male_Suit, L = P.Smooth_Male_LongSleeve, Sh = P.Smooth_Male_Shirt, Dr = P.Smooth_Female_Dress, Ca = P.Smooth_Female_Casual;
  const pal = (i, cloth) => ({ skin: SKIN[i % 5], hair: HAIR[i % 4], cloth, tie: [0x7a1f1f, 0x1f3a7a, 0x2a2a2a][i % 3] });
  props.men = [0, 1, 2, 3, 4, 5].map((i) => makeHuman(i % 2 ? L : S, pal(i, SUIT[i % 5]), [0x1c1c1c, 0x3a2a1c, 0x22252a][i % 3]));
  props.women = [0, 1, 2, 3].map((i) => makeHuman(i % 2 ? Ca : Dr, pal(i + 2, DRESS[i % 5]), null));
  props.sailors = [0, 1, 2].map((i) => makeHuman(Sh, { skin: SKIN[(i + 1) % 5], hair: HAIR[i % 4], cloth: 0x1f2a44, tie: 0xffffff }, 0xf2f2f2));
  props.kid = makeHuman(Ca, pal(3, 0x5a3a28), null); props.kid.obj.scale.multiplyScalar(0.72);
  props.horse = makeAnimal(gl.animals_pack_Horse, 0.46);
  props.horse2 = makeAnimal(gl.animals_pack_Horse, 0.46);
  props.dog = makeAnimal(gl.animals_pack_Husky, 0.2);
}

// ------------------------------------------------------------------ shots (hard cuts every ~1.5–3 s, camera always moving)
// each shot: [t0, fn(lt, u)] — fn sets camera + world state for that shot
const C = { p: V(0, 0, 0), l: V(0, 0, 0), fov: 38, shake: 0, roll: 0 };
function camLerp(p0, p1, l0, l1, u, fov = 38) { C.p.lerpVectors(V(...p0), V(...p1), u); C.l.lerpVectors(V(...l0), V(...l1), u); C.fov = fov; }
const ease = (u) => lerp(u, u * u * (3 - 2 * u), 0.35);   // mostly linear: shots cut mid-motion
let G = {};  // per-frame globals (grade etc.)

function hideAll() {
  for (const a of actors) { a.holder.visible = false; if (a.hat) a.hat.visible = false; }
  props.barrels.forEach((b) => (b.visible = false)); props.cart.visible = false;
  truck.visible = false; tram.visible = false; flyR.visible = false; jets.visible = false; spray.visible = false; frostIM.visible = false;
  bar50.visible = bar25.visible = false; cutFace.visible = false; flood.material = M.goo; tankFill.visible = false;
  FP.R = 0; FP.Hh = 8; FP.dep = 1; FP.Ld = 9; FP.wob = 1;
  panels.forEach((p) => { p.pivot.position.copy(p.home); p.pivot.rotation.set(0, p.th, 0); p.pivot.visible = true; });
  roof.position.set(0, TANK_H + 1.2, 0); roof.rotation.set(0, 0, 0); roof.visible = true;
  truck.position.set(3.2, 0, 47); truck.rotation.set(0, 0, 0);
  tram.position.set(-3.5, 0, 16); tram.rotation.set(0, 0, 0);
  G = { sat: 1.08, con: 1.04, bright: 1, hue: 0, cold: 0, summer: 0, flash: 0 };
  M.goo.roughness = 0.2;
}
// tank burst state as a function of time since the burst (tb)
function burst(tb) {
  panels.forEach((p, i) => {
    const front = Math.cos(p.th);                       // 1 = street side
    const delay = (1 - front) * 0.25 + hash(i) * 0.12, k = Math.max(0, tb - delay);
    const v = 9 + 9 * Math.max(0, front) + hash(i + 7) * 4;
    const out = v * k, up = (4 + 6 * hash(i + 3)) * k - 4.9 * k * k;
    const dir = V(Math.sin(p.th), 0, Math.cos(p.th));
    p.pivot.position.copy(p.home).addScaledVector(dir, out); p.pivot.position.y = Math.max(0, up);
    p.pivot.rotation.set(Math.min(1.45, k * (1.6 + hash(i + 9))), p.th + (hash(i + 2) - 0.5) * k * 0.8, (hash(i + 5) - .5) * k * 0.6, 'YXZ');
  });
  roof.position.y = Math.max(1, TANK_H + 1.2 - 4.9 * tb * tb); roof.rotation.x = Math.min(0.35, tb * 0.4); roof.rotation.z = Math.min(0.2, tb * 0.2);
}
function walkers(lt, list, spec) {   // spec: [x, z0, dir(+1/-1), speed, phase]
  list.forEach((a, i) => { const s = spec[i]; if (!s) return; const [x, z0, dir, sp, ph] = s;
    pose(a, sp > 3 ? 'Run' : 'Walk', lt + ph, x, 0.16 * (Math.abs(x) > 6 ? 1 : 0), z0 + dir * sp * lt, dir > 0 ? 0 : Math.PI); });
}
function frontZ(x) { return TANK.z + Math.sqrt(Math.max(0, FP.R * FP.R - x * x)); }
function sprayAt(t, k, xs = [-6, 6], fwd = 4) {
  if (k <= 0) return; spray.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = V(1, 1, 1);
  for (let i = 0; i < NSP; i++) {
    const x = lerp(xs[0], xs[1], hash(i * 3.1)), ph = hash(i * 7.3), life = 0.9;
    const a = ((t * 1.0 + ph) % 1) * life;
    const z = frontZ(x) - 0.6 + (fwd + 3 * hash(i)) * a, y = FP.Hh * (0.75 + 0.3 * hash(i + 1)) + (3 + 3 * hash(i * 2.7)) * a - 9.8 * a * a;
    const sc = (i % 2 ? 0 : k) * (0.4 + hash(i * 5.1) * 0.9) * (1 - a / life * 0.6);
    m.compose(V(x + (hash(i * 9) - .5) * a * 3, Math.max(-1, y), z), q, s.set(sc, sc * (1.8 + a * 3), sc)); spray.setMatrixAt(i, m);
  }
  spray.instanceMatrix.needsUpdate = true;
}
function debris(t, n, back = 2) {
  props.barrels.slice(0, n).forEach((b, i) => {
    const x = -5 + i * 10 / Math.max(1, n - 1) + Math.sin(i * 3) * 0.8, z = frontZ(x) - back - hash(i) * 3;
    b.visible = true; b.position.set(x, floodH(x, z) - 0.2, z); b.rotation.set(t * (1 + hash(i)) * 2, i, t * 1.3 + i);
  });
}
function frost(k, cx, cz, rad) {
  if (k <= 0) return; frostIM.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < 900; i++) {
    const a = hash(i * 1.7) * 6.283, r = Math.sqrt(hash(i * 2.3)) * rad, x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
    const on = clamp(k * 1.6 - hash(i * 4.1) * 0.8); const sc = on * (0.6 + hash(i) * 1.4);
    q.setFromEuler(new THREE.Euler(hash(i) * 3, hash(i * 2) * 3, 0));
    m.compose(V(x, floodH(x, z) + 0.01, z), q, V(sc * .55, sc * 0.2, sc * .55)); frostIM.setMatrixAt(i, m);
  }
  frostIM.instanceMatrix.needsUpdate = true;
}

const SH = [];
const shot = (t0, fn) => SH.push({ t0, fn });
// S1 0.0 — cold open: lunchtime street, horse cart toward camera, tank looming at the end
shot(0.0, (lt, u) => {
  camLerp([3.6, 1.5, 36], [2.6, 1.9, 30.5], [0.5, 4.5, -40], [0, 5.2, -45], ease(u), 42);
  pose(props.horse, 'Walk', lt, 2.6, 0, 22 + 1.4 * lt, 0);
  props.cart.visible = true; props.cart.position.set(2.6, 0, 22 + 1.4 * lt - 3.6); props.cart.rotation.y = Math.PI;
  walkers(lt, props.men, [[7.4, 14, 1, 1.3, 0.1], [-7.2, 26, -1, 1.25, 0.5], [7.8, 4, -1, 1.2, 0.3], [-7.6, 8, 1, 1.35, 0.7], [-1.5, 10, 1, 1.3, 0.2]]);
  walkers(lt, props.women, [[7.0, 18, 1, 1.2, 0.4], [-7.3, 20, -1, 1.15, 0.9], [8.0, -2, 1, 1.2, 0.2]]);
  pose(props.dog, 'Walk', lt, 6.6, 0.16, 20 + 1.6 * lt, 0);
});
// S2 2.3 — "the ground starts shaking": medium shot, people stop and turn
shot(2.3, (lt, u) => {
  camLerp([9.0, 1.6, 21.5], [8.6, 1.55, 20.4], [6.4, 1.5, 14], [6.2, 1.55, 13.6], ease(u), 34);
  C.shake = sstep(0.4, 0.8, lt) * 0.05;
  const stop = sstep(0.2, 0.9, lt);
  pose(props.men[0], stop > 0.5 ? 'Idle' : 'Walk', lt, 7.2, 0.16, 15.2 + 0.6 * (1 - stop) * lt, lerp(0, Math.PI * 0.85, stop));
  pose(props.women[0], stop > 0.5 ? 'Idle' : 'Walk', lt + 0.3, 6.1, 0.16, 15.9 + 0.5 * (1 - stop) * lt, lerp(0, Math.PI * 0.9, stop));
  pose(props.kid, 'Idle', lt, 6.6, 0.16, 16.4, lerp(0.3, Math.PI, stop));
  pose(props.horse, stop > 0.6 ? 'Idle_HitReact_Left' : 'Walk', lt, 2.6, 0, 26, 0.2);
  props.cart.visible = true; props.cart.position.set(2.0, 0, 22.4); props.cart.rotation.y = Math.PI + 0.2;
});
// S3 3.75 — "Rivets fire out like a machine gun": along the seam, rivets shoot toward camera
const T_RIV = 3.85;
shot(3.75, (lt, u, t) => {
  camLerp([-2.6, 3.4, -55.2], [1.6, 4.6, -55.8], [0.6, 4.0, -62.5], [0.4, 6.0, -62.5], ease(u), 40);
  C.shake = 0.03;
  flyR.visible = jets.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  const ex = Math.sin(DTH / 2) * TANK_R, ez = TANK.z + Math.cos(DTH / 2) * TANK_R;
  for (let i = 0; i < NFR; i++) {
    const tf = T_RIV + i * 0.048, a = t - tf, y = 0.9 + i * 0.4;
    if (a < 0) { m.compose(V(ex, y, ez + 0.05), q, V(1, 1, 1)); flyR.setMatrixAt(i, m); m.compose(V(ex, y, ez), q, V(0, 0, 0)); jets.setMatrixAt(i, m); continue; }
    const vz = 22 + hash(i) * 8, vx = (hash(i + 1) - .5) * 6, vy = (hash(i + 2) - .3) * 5;
    m.compose(V(ex + vx * a, y + vy * a - 4.9 * a * a, ez + vz * a), q, V(1, 1, 1)); flyR.setMatrixAt(i, m);
    const jl = Math.min(a * 5, 1.4);   // molasses jet out of the hole, a stretched droplet
    q.setFromUnitVectors(V(0, 1, 0), V(0.1, -0.35, 1).normalize());
    m.compose(V(ex + 0.05, y - jl * 0.12, ez + jl * 0.5), q, V(0.9, 1 + jl * 5, 0.9)); jets.setMatrixAt(i, m); q.identity();
  }
  flyR.instanceMatrix.needsUpdate = jets.instanceMatrix.needsUpdate = true;
});
// S4 5.7 — "A steel tank, 50 feet tall, splits open": low wide, scale bar drawn into the scene, the seam opens
shot(5.7, (lt, u, t) => {
  camLerp([-3.5, 0.9, -36], [-2.6, 1.3, -40.5], [1.5, 8.5, -76], [1.5, 9.2, -76], ease(u), 46);
  bar50.visible = true; bar50.userData.set(V(-2.8, 0, -60), TANK_H, sstep(0.5, 1.3, lt), 0.2, 1);
  const op = sstep(7.75, 8.6, t);      // the street-side seam bulges and gapes
  [0, 1].forEach((j) => { const p = panels[j]; p.pivot.rotation.set(op * 0.06, p.th + (j ? 1 : -1) * op * 0.035, 0, 'YXZ'); });
  if (op > 0) { tankFill.visible = true; }
  C.shake = 0.015 + op * 0.04;
});
// S5 8.75 — "2.3 million gallons of molasses pour out": the tank bursts, panels fly, the dome of syrup slumps outward
const T_BURST = 8.78;
shot(8.75, (lt, u, t) => {
  camLerp([4.5, 3.5, -40], [5.5, 8.5, -30], [0, 7, -72], [0, 4, -64], ease(u), 50);
  const tb = t - T_BURST; burst(Math.max(0, tb));
  tankFill.visible = tb < 0.25; tankFill.scale.y = clamp(1 - tb * 2);
  FP.R = TANK_R + 22 * (1 - Math.exp(-tb * 0.9)); FP.Hh = lerp(14, 8, clamp(tb / 2.5)); FP.Ld = 40; FP.dep = 2.5;
  sprayAt(t, clamp(tb * 3) * 1.3, [-14, 14], 6);
  G.flash = Math.exp(-Math.max(0, tb) * 14) * (tb >= 0 ? 0.55 : 0);
  C.shake = 0.08 * Math.exp(-tb * 1.5);
});
// S6 11.6 — "A brown wave, 25 feet high": street level, people run at camera, the wave towers behind
shot(11.6, (lt, u, t) => {
  camLerp([0.4, 1.3, 24], [0.2, 1.6, 28], [0, 4.6, -10], [0, 4.8, -6], ease(u), 48);
  burst(4);
  FP.R = 52 + 8 * lt; FP.Hh = 7.6; FP.Ld = 7; FP.dep = 1.2;
  sprayAt(t, 1, [-6.5, 6.5], 3); debris(t, 4);
  const fz = frontZ(0);
  bar25.visible = true; bar25.userData.set(V(-3.2, 0, fz + 0.8), 7.6, sstep(0.6, 1.2, lt), 0.14, 1);
  walkers(lt, props.men, [[-2.5, 8, 1, 5.6, 0.1], [1.5, 6, 1, 6.0, 0.4], [3.6, 11, 1, 5.4, 0.2], [-4.2, 4, 1, 5.8, 0.6], [0.2, 13, 1, 5.2, 0.3]]);
  walkers(lt, props.women, [[-1.2, 10, 1, 5.0, 0.5], [2.6, 3, 1, 5.5, 0.1]]);
  pose(props.horse2, 'Gallop', lt, 4.6, 0, 1 + 8 * lt, 0);
  pose(props.dog, 'Gallop', lt, -0.8, 0, 15 + 7 * lt, 0);
});
// S7 14.1 — "rolls down the street at 35 mph": tracking shot alongside the front, buildings whipping past
shot(14.1, (lt, u, t) => {
  burst(5);
  FP.R = 92 + 15.6 * lt; FP.Hh = 7.0; FP.Ld = 7; FP.dep = 1.2;   // 35 mph = 15.6 m/s
  const fz = frontZ(0);
  camLerp([-5.2, 2.4, fz + 9], [-5.2, 2.4, fz + 9], [3.5, 3.4, fz - 1], [3.5, 3.4, fz - 1], 0, 50);
  C.p.x = -5.4 + u * 0.6; C.p.y = 2.0 + u * 0.8;
  sprayAt(t, 1, [-6.5, 6.5], 3); debris(t, 6);
  pose(props.men[2], 'Death', clamp(lt * 0.5) * 2.0, 3.8, floodH(3.8, fz - 2) - 0.6, fz - 2.5, 0.6);
});
// S8 16.7 — "It throws a truck into the harbor": the front reaches the wharf, the truck tumbles into the water
const T_TRUCK = 17.15;
shot(16.7, (lt, u, t) => {
  burst(5);
  FP.R = Math.min(133, 116 + 15.6 * lt); FP.Hh = 6.2; FP.Ld = 7; FP.dep = 1.1;
  camLerp([13, 2.2, 78], [11.5, 2.6, 80], [2, 4.5, 56], [3.5, 2.5, 64], ease(u), 46);
  truck.visible = true; const a = Math.max(0, t - T_TRUCK);
  truck.position.set(3.2 + a * 1.5, Math.max(-3, 0 + 5 * a - 4.9 * a * a) + (a > 0 ? 0.3 : 0), 47 + 19 * a);
  truck.rotation.set(a * 2.1, a * 0.6, a * 0.9);
  sprayAt(t, 1, [-6.5, 6.5], 4); debris(t, 5);
  G.splash = clamp((a - 1.15) * 1.6);
});
// S9 18.45 — "and knocks a streetcar off its tracks"
const T_TRAM = 18.7;
shot(18.45, (lt, u, t) => {
  burst(5);
  FP.R = 80 + 10 * lt; FP.Hh = 6.6; FP.Ld = 8; FP.dep = 1.2;
  camLerp([9, 3.0, 35], [8, 3.3, 32.5], [-3, 2.0, 16], [-3, 2.1, 16], ease(u), 50);
  tram.visible = true; const a = Math.max(0, t - T_TRAM);
  const tip = Math.min(1.25, a * a * 1.9 + a * 0.4);
  tram.position.set(-3.5 + a * 1.2, Math.sin(Math.min(1, a * 1.5) * Math.PI) * 0.6 + a * 0.3, 16 + a * 1.5); tram.rotation.set(0, -a * 0.3, -tip);
  sprayAt(t, 1, [-6.5, 6.5], 3); debris(t, 3);
});
// S10 20.35 — "Then the cold hits it": low over the slowing syrup, frost creeps, breath steams
shot(20.35, (lt, u, t) => {
  burst(5);
  FP.R = 150 + 3 * lt * (1 - u); FP.Hh = 1.4 - 0.6 * u; FP.Ld = 6; FP.dep = 0.95; FP.wob = lerp(0.8, 0.25, u);
  camLerp([3.2, 1.25, 9.5], [2.2, 1.35, 7.6], [-1, 0.8, 1], [-1.2, 0.9, 0.5], ease(u), 40);
  G.cold = sstep(0, 0.8, lt);
  M.goo.roughness = lerp(0.16, 0.55, G.cold);
  frost(G.cold, 0, 4, 9);
  pose(props.men[3], 'Idle', lt, -2.2, 0.1, 1.6, 0.5); pose(props.women[1], 'Idle', lt + 1, 0.2, 0.15, -0.6, 0.2);
  G.breath = [[-2.2, 1.66, 1.6, 0.5], [0.2, 1.6, -0.6, 0.2]];
});
// S11 21.55 — "The syrup turns thick as glue": cutaway slice — legs trapped inside the syrup
shot(21.55, (lt, u, t) => {
  burst(5);
  FP.R = 150; FP.Hh = 0.95; FP.Ld = 6; FP.dep = 0.95; FP.wob = 0.15;
  flood.material = gooClip; cutFace.visible = true; cutFace.scale.set(1, 0.95, 1); cutFace.position.set(0, 0.475, CUT_Z);
  camLerp([1.6, 1.25, 20.5], [1.1, 1.3, 19.0], [-0.3, 0.7, 12], [-0.3, 0.75, 12], ease(u), 40);
  G.cold = 1; M.goo.roughness = 0.5;
  pose(props.men[0], 'Walk', lt * 0.3, -0.6, -0.1, CUT_Z - 0.7, Math.PI * 0.9);
  pose(props.women[2], 'Idle', lt, 2.0, -0.05, CUT_Z - 1.6, -0.3);
  pose(props.horse, 'Idle_Headlow', lt, -4.4, -0.35, CUT_Z - 3.5, 0.8);
});
// S12 23.3 — "the more people struggle, the deeper they sink"
shot(23.3, (lt, u, t) => {
  burst(5);
  FP.R = 150; FP.Hh = 0.95; FP.Ld = 6; FP.dep = 0.95; FP.wob = 0.15;
  flood.material = gooClip; cutFace.visible = true; cutFace.scale.set(1, 0.95, 1); cutFace.position.set(0, 0.475, CUT_Z);
  camLerp([-1.5, 1.15, 17.6], [-1.0, 1.05, 16.8], [-0.5, 0.65, 12.6], [-0.5, 0.6, 12.6], ease(u), 36);
  G.cold = 1; M.goo.roughness = 0.5;
  const sink = 0.12 + 0.45 * sstep(0, 2.2, lt);
  pose(props.men[0], 'Punch', lt * 1.4, -0.6, -sink, CUT_Z - 0.7, Math.PI * 0.9 + Math.sin(lt * 5) * 0.2);
  pose(props.horse, 'Idle_HitReact_Right', lt, -4.4, -0.35 - sink * 0.6, CUT_Z - 3.5, 0.8);
});
// S13 25.6 — "Rescuers wade in knee-deep": sailors wade through the settled syrup
shot(25.6, (lt, u, t) => {
  burst(5);
  FP.R = 150; FP.Hh = 0.5; FP.Ld = 6; FP.dep = 0.5; FP.wob = 0.12;
  camLerp([-2.2, 0.95, 3.2], [-1.5, 1.05, 1.4], [0, 1.0, -6], [0, 1.0, -6.5], ease(u), 32);
  G.cold = 0.8; M.goo.roughness = 0.45;
  props.sailors.forEach((a, i) => pose(a, 'Walk', lt * 0.55 + i * 0.3, -1.4 + i * 1.6, -0.05, -6.5 - i * 0.8 + 0.75 * lt, 0.05 - i * 0.04, 0.6));
  pose(props.men[4], 'Idle', lt, 1.2, -0.45, -3.5, Math.PI + 0.3);
  pose(props.women[3], 'Idle', lt, -2.6, -0.4, -1.8, Math.PI - 0.2);
});
// S14 27.2 — "pulling survivors out by hand": close, a sailor hauls a man up out of the goo
const T_PULL = 27.35;
shot(27.2, (lt, u, t) => {
  burst(5);
  FP.R = 150; FP.Hh = 0.6; FP.Ld = 6; FP.dep = 0.6; FP.wob = 0.12;
  camLerp([0.4, 1.25, 4.6], [0.15, 1.15, 3.7], [0, 1.1, 0.6], [0, 1.3, 0.6], ease(u), 38);
  G.cold = 0.7; M.goo.roughness = 0.42;
  const k = sstep(T_PULL, T_PULL + 1.3, t);
  pose(props.sailors[0], 'Punch', 0.28 + k * 0.1, -0.5, -0.05 - 0.05 * k, 0.6, Math.PI / 2 - 0.25);
  pose(props.men[5], 'Jump', 0.35 + k * 0.3, 0.45, lerp(-0.95, -0.2, k), 0.6, -Math.PI / 2 + 0.25);
});
// S15 28.9 — "21 people died": high, quiet aerial over the flooded street
shot(28.9, (lt, u, t) => {
  burst(5);
  FP.R = 150; FP.Hh = 0.8; FP.Ld = 6; FP.dep = 0.8; FP.wob = 0.1;
  camLerp([10, 30, 34], [8, 34, 30], [0, 0, -14], [0, 0, -18], ease(u), 46);
  G.cold = 1; G.sat = 0.7; M.goo.roughness = 0.5;
  debris(t * 0.05, 8, -8);
  tram.visible = true; tram.position.set(-0.8, 0.6, 22); tram.rotation.set(0, -0.3, -1.25);
  props.sailors.forEach((a, i) => pose(a, 'Walk', lt * 0.5 + i, -2 + i * 2.4, -0.1, 4 + i * 3 + 0.5 * lt, Math.PI));
});
// S16 30.4 — "And for decades, on hot summer days": the clean street, warm light, people stroll
shot(30.4, (lt, u, t) => {
  camLerp([-3.6, 1.2, 24], [-2.8, 1.5, 19.5], [1, 2.6, 0], [1, 2.8, -4], ease(u), 42);
  G.summer = 1;
  panels.forEach((p) => { p.pivot.visible = false; }); roof.visible = false;   // the tank is long gone
  walkers(lt, props.men, [[7.3, 6, 1, 1.2, 0.2], [-7.4, 18, -1, 1.2, 0.6], [-1.2, 2, 1, 1.3, 0.1]]);
  walkers(lt, props.women, [[6.8, 12, -1, 1.1, 0.3], [-6.9, 5, 1, 1.15, 0.8]]);
  pose(props.kid, 'Run', lt, 2.2, 0, 6 + 3.2 * lt, 0);
  G.wisps = 1;
});
// S17 32.45 — "the whole street still smelled of molasses": close on a passer-by, sweet wisps rising from the stones
shot(32.45, (lt, u, t) => {
  camLerp([6.0, 1.5, 13.8], [6.2, 1.55, 12.6], [7.2, 1.3, 8], [7.3, 1.35, 9], ease(u), 36);
  G.summer = 1; panels.forEach((p) => { p.pivot.visible = false; }); roof.visible = false;
  pose(props.women[0], 'Walk', lt, 6.9, 0.16, 6.5 + 1.15 * lt, 0);
  pose(props.men[1], 'Walk', lt + 0.5, 7.9, 0.16, 4.6 + 1.2 * lt, 0);
  G.wisps = 1;
});
// S18 34.5 — "Could you outrun it?": the wave races at the lens
shot(34.5, (lt, u, t) => {
  burst(4);
  FP.R = 78 + 10 * lt; FP.Hh = 7.6; FP.Ld = 7; FP.dep = 1.2;
  const fz = frontZ(0);
  camLerp([0.6, 1.6, 22], [0.4, 1.8, 28], [0, 4.5, fz], [0, 5, fz], ease(u), 46);
  C.l.z = fz; sprayAt(t, 1, [-6.5, 6.5], 4); debris(t, 4);
  walkers(lt, props.men, [[-1.2, 9, 1, 5.8, 0.2], [1.6, 7, 1, 5.5, 0.5], [0.3, 4, 1, 5.2, 0.1]]);
  C.shake = 0.03 + 0.04 * u;
});

// ------------------------------------------------------------------ breath puffs, wisps, splash (simple instanced extras)
const puffs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), M.breath, 24); puffs.frustumCulled = false; world.add(puffs);
const wispGeo = new THREE.PlaneGeometry(0.22, 2.4, 1, 24); const NW = 22;
const wisps = Array.from({ length: NW }, (_, i) => { const m = new THREE.Mesh(wispGeo.clone(), M.wisp); m.userData.base = m.geometry.attributes.position.array.slice(); world.add(m); return m; });
const splash = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0xe8f2f6, roughness: 0.3 }), 160); splash.frustumCulled = false; world.add(splash);
function extras(t) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  puffs.visible = !!G.breath;
  if (G.breath) { G.breath.forEach((b, j) => { for (let i = 0; i < 12; i++) { const a = ((t * 0.7 + i / 12 + j * .37) % 1), s = 0.3 + a * 1.6;
    m.compose(V(b[0] + Math.sin(b[3]) * (0.25 + a * 0.6), b[1] - 0.05 + a * 0.3, b[2] + Math.cos(b[3]) * (0.25 + a * 0.6)), q, V(s, s, s)); puffs.setMatrixAt(j * 12 + i, m); } });
    puffs.instanceMatrix.needsUpdate = true; M.breath.opacity = 0.12; }
  M.wisp.opacity = G.wisps ? 0.22 : 0; wisps.forEach((w, i) => {
    w.visible = !!G.wisps; if (!G.wisps) return;
    const x = (hash(i * 3) - 0.5) * 16, z = 2 + hash(i * 5) * 16, p = w.geometry.attributes.position.array, b = w.userData.base;
    for (let k = 0; k < p.length; k += 3) { const y = b[k + 1] + 1.2; p[k] = b[k] + 0.35 * Math.sin(y * 2.2 + t * 1.6 + i) * y; p[k + 1] = y; p[k + 2] = b[k + 2] + 0.2 * Math.cos(y * 1.7 + t + i) * y; }
    w.geometry.attributes.position.needsUpdate = true; w.position.set(x, 0.1 + ((t * 0.25 + hash(i)) % 1) * 0.6, z);
    w.lookAt(C.p.x, w.position.y, C.p.z);
  });
  splash.visible = (G.splash || 0) > 0;
  if (splash.visible) { for (let i = 0; i < 160; i++) { const a = 0.25 + G.splash * 1.0, ang = hash(i) * 6.283, v = 3 + hash(i * 2) * 7;
    m.compose(V(truck.position.x + Math.cos(ang) * v * a, -1.1 + (6 + hash(i * 3) * 8) * a - 4.9 * a * a, truck.position.z + Math.sin(ang) * v * a), q, V(1, 1, 1).multiplyScalar(1 - a * 0.5)); splash.setMatrixAt(i, m); }
    splash.instanceMatrix.needsUpdate = true; }
}

// ------------------------------------------------------------------ captions
const capEl = document.getElementById('capt'), flashEl = document.getElementById('flash');
let lastCap = '';
function captions(t) {
  const c = (window.VO.caps || []).find((c) => t >= c.t0 && t < c.t1 + (c === window.VO.caps[window.VO.caps.length - 1] ? 2 : 0));
  const txt = c ? c.text : '';
  if (txt !== lastCap) { capEl.textContent = txt; lastCap = txt; }
  const age = c ? t - c.t0 : 1; capEl.style.transform = `scale(${(1 + 0.12 * Math.exp(-age * 22)).toFixed(3)})`;
}

// ------------------------------------------------------------------ render(t)
const tmpL = V(0, 0, 0);
function render(t) {
  t = clamp(t, 0, DUR - 1e-3);
  hideAll(); C.shake = 0; C.roll = 0;
  let i = 0; while (i < SH.length - 1 && t >= SH[i + 1].t0) i++;
  const s = SH[i], t1 = i < SH.length - 1 ? SH[i + 1].t0 : DUR, lt = t - s.t0, u = lt / (t1 - s.t0);
  FP.t = t; s.fn(lt, u, t);
  // flood
  flood.visible = FP.R > 0; if (flood.visible) updateFlood();
  // camera
  cam.fov = C.fov; cam.updateProjectionMatrix();
  const sh = C.shake; cam.position.copy(C.p).add(V(Math.sin(t * 71) * sh, Math.sin(t * 83 + 1) * sh, Math.cos(t * 67) * sh));
  tmpL.copy(C.l).add(V(Math.sin(t * 59) * sh * 2, Math.cos(t * 61) * sh * 2, 0)); cam.lookAt(tmpL);
  // light: low winter sun / warm summer sun; shadow box follows the look target
  const tgt = C.l.clone(); tgt.y = 0; sun.target.position.copy(tgt); sun.position.copy(tgt).addScaledVector(SUN_DIR, 90);
  const span = Math.min(60, 10 + cam.position.distanceTo(C.l) * 0.9);
  Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span }); sun.shadow.camera.updateProjectionMatrix();
  sun.color.set(G.summer ? 0xffd39a : 0xffe2c4).lerp(new THREE.Color(0xcfe0ff), G.cold * 0.6);
  sun.intensity = G.summer ? 3.2 : lerp(2.6, 1.6, G.cold);
  hemi.intensity = lerp(0.55, 0.7, G.cold);
  scene.fog.color.copy(FOG_DAY).lerp(new THREE.Color(0xe8c9a0), G.summer ? 0.6 : 0).lerp(new THREE.Color(0xb9c8da), G.cold * 0.5);
  R.toneMappingExposure = G.summer ? 1.12 : lerp(1.0, 0.92, G.cold);
  extras(t);
  R.render(scene, cam);
  // grade (toon-ish warm; cold shots slide blue; summer golden)
  const sat = G.sat * (G.summer ? 1.12 : lerp(1, 0.82, G.cold));
  cv.style.filter = `saturate(${sat.toFixed(2)}) contrast(${G.con.toFixed(2)})`;
  gooClip.roughness = M.goo.roughness;
  flashEl.style.opacity = (G.flash || 0).toFixed(3);
  captions(t);
}

load().then(() => {
  // re-draw scale-bar labels once the font is in
  return document.fonts.load('800 60px "Z Inter"').then(() => { bar50.userData.redraw(); bar25.userData.redraw(); });
}).then(() => {
  window.__render = render; render(window.__lastT || 0); window.__zackReady(true);
}).catch((e) => { console.error('zack3d load failed', e); window.__zackReady(false); });
