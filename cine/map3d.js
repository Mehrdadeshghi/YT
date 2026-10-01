// Wiki Roulette — MAP3D: a cinematic WebGL Earth for map-documentary episodes.
// The planet is ray-traced in a fragment shader (perspective camera, tilt + heading, lighting, atmosphere).
// One equirectangular data texture is generated from the topojson at boot: R = land coverage, G = shallow-water halo.
// Land colour (biomes by latitude) and terrain detail are procedural, so the coast stays crisp at any zoom.
// Vector overlays (coasts, borders, territory fills, arcs, pins, flags) are projected in JS with the same camera.
const MAP = (() => {
  const TW = 8192, TH = 4096;
  const GS = 0.5, cv = document.createElement('canvas'); cv.width = W * GS; cv.height = H * GS;
  const gl = cv.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
  let prog, U = {}, cam = null, RINGS3 = null, MESH = null;
  const VS = `#version 300 es
  in vec2 p; out vec2 v; void main(){ v = p; gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
  precision highp float; in vec2 v; out vec4 o;
  uniform sampler2D tex; uniform vec3 C, F, R, Up; uniform float tanH, asp, detail, time;
  float h3(vec3 p){ p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
    return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float a = .5, s = 0.; for (int k = 0; k < 4; k++){ s += a * vn(p); p *= 2.03; a *= .5; } return s; }
  float fb2(vec3 p){ return .65 * vn(p) + .35 * vn(p * 2.1); }
  vec3 biome(float lat, float n, float n2){
    float a = abs(lat);
    vec3 trop = vec3(.13,.27,.12), sav = vec3(.42,.42,.22), des = vec3(.70,.58,.38), tem = vec3(.20,.42,.17), bor = vec3(.14,.30,.15), tun = vec3(.42,.40,.33), ice = vec3(.92,.94,.97);
    float j = (n - .5) * 9.;
    vec3 c = mix(trop, sav, smoothstep(10., 18., a + j));
    c = mix(c, des, smoothstep(18., 24., a + j) * (1. - smoothstep(32., 38., a + j)) * smoothstep(.35, .6, n2));
    c = mix(c, tem, smoothstep(32., 40., a + j));
    c = mix(c, bor, smoothstep(50., 56., a + j));
    c = mix(c, tun, smoothstep(60., 66., a + j));
    c = mix(c, ice, smoothstep(70., 76., a + j * .6));
    if (lat < -60.) c = ice;
    return c; }
  void main(){
    vec3 rd = normalize(F + v.x * tanH * asp * R + v.y * tanH * Up);
    float b = dot(C, rd), c = dot(C, C) - 1., disc = b * b - c;
    vec3 sun = normalize(-R * .45 + Up * .55 - F * .7);
    if (disc < 0.) { float dmin = sqrt(max(0., dot(C, C) - b * b)); float gl = exp(-(dmin - 1.) * 18.) * step(0., -b);
      o = vec4(vec3(.35, .6, 1.) * gl, gl * .9); return; }
    float tt = -b - sqrt(disc); vec3 p = C + tt * rd, n = normalize(p);
    float lat = asin(clamp(n.z, -1., 1.)), lon = atan(n.y, n.x);
    vec2 uv = vec2((lon + 3.14159265) / 6.2831853, (1.5707963 - lat) / 3.14159265);
    vec4 d = texture(tex, uv);
    float aa = max(fwidth(d.r) * 1.2, .02);
    float land = smoothstep(.5 - aa, .5 + aa, d.r);
    vec3 q = n * 60.;
    float nd = fb2(n * 9.), n2 = fb2(n * 4. + 7.);
    float fine = land > 0.01 ? fbm(n * detail) : .5;                       // terrain detail scaled to the camera altitude
    vec3 lc = biome(degrees(lat), nd, n2) * (.78 + .45 * fine);
    lc = mix(lc, vec3(dot(lc, vec3(.33))), .12);                         // slightly muted so highlights pop
    vec2 gr = vec2(dFdx(fine), dFdy(fine)); lc *= clamp(1. + (gr.y - gr.x) * 14., .55, 1.45);   // hill-shade from the detail field
    float deep = 1. - d.g;
    vec3 wc = mix(vec3(.07,.40,.52), vec3(.015,.07,.17), smoothstep(0., .9, deep)) * (.92 + .16 * fb2(n * detail * .5 + time * .05));
    vec3 col = mix(wc, lc, land);
    float dif = clamp(dot(n, sun), 0., 1.), amb = .35;
    col *= amb + .85 * dif;
    vec3 h = normalize(sun - rd); col += (1. - land) * pow(max(dot(n, h), 0.), 140.) * .16;
    float rim = pow(1. - max(dot(n, -rd), 0.), 3.); col = mix(col, vec3(.45, .7, 1.), rim * .55);
    o = vec4(col, 1.); }`;
  function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  function init(topo) {
    // ---- data texture
    const t = document.createElement('canvas'); t.width = TW; t.height = TH; const x = t.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
    const X = (lo) => (lo + 180) / 360 * TW, Y = (la) => (90 - la) / 180 * TH;
    const path = () => { x.beginPath(); for (const f of WORLD) { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of polys) for (const ring of poly) { let px = null; ring.forEach(([lo, la], j) => { const xx = X(lo), yy = Y(la); if (!j || Math.abs(xx - px) > TW / 2) x.moveTo(xx, yy); else x.lineTo(xx, yy); px = xx; }); x.closePath(); } } };
    x.globalCompositeOperation = 'lighter';
    path(); x.lineJoin = 'round';
    x.filter = 'blur(28px)'; x.strokeStyle = 'rgb(0,150,0)'; x.lineWidth = 70; x.stroke();
    x.filter = 'blur(8px)'; x.strokeStyle = 'rgb(0,105,0)'; x.lineWidth = 18; x.stroke();
    x.filter = 'none'; x.fillStyle = 'rgb(255,0,0)'; x.fill('nonzero');
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t); gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    for (const k of ['tex', 'C', 'F', 'R', 'Up', 'tanH', 'asp', 'detail', 'time']) U[k] = gl.getUniformLocation(prog, k);
    gl.viewport(0, 0, cv.width, cv.height);
    // ---- vector data for overlays: rings as unit vectors + bbox; internal borders mesh
    const toV = (lo, la) => { const a = lo * D2R, b = la * D2R, cb = Math.cos(b); return [cb * Math.cos(a), cb * Math.sin(a), Math.sin(b)]; };
    RINGS3 = []; for (const f of WORLD) { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of polys) for (const ring of poly) RINGS3.push({ name: f.properties.name, v: ring.map(([lo, la]) => toV(lo, la)), c: toV(...ring[0]) }); }
    MESH = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b).coordinates.map((l) => l.map(([lo, la]) => toV(lo, la)));
  }
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(...a); return a.map((q) => q / l); }, add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
  const V3 = (lo, la) => { const a = lo * D2R, b = la * D2R, cb = Math.cos(b); return [cb * Math.cos(a), cb * Math.sin(a), Math.sin(b)]; };
  // camera: target lon/lat, altitude (Earth radii), tilt (deg from straight down), heading (deg, 0 = north up)
  function setCam(c) { const T = V3(c.lon, c.lat), lo = c.lon * D2R, E = [-Math.sin(lo), Math.cos(lo), 0], N = cross(T, E), h = (c.head || 0) * D2R, ti = (c.tilt || 0) * D2R;
    const Fh = add(N.map((q) => q * Math.cos(h)), E, Math.sin(h)), C = add(T, add(T.map((q) => q * Math.cos(ti)), Fh, -Math.sin(ti)), c.alt);
    const f = nrm(add(T, C, -1)), r = nrm(cross(f, Fh)), u = cross(r, f);
    cam = { ...c, C, f, r, u, tanH: Math.tan(20 * D2R), asp: W / H }; return cam; }
  function render(t) { gl.useProgram(prog); gl.uniform3fv(U.C, cam.C); gl.uniform3fv(U.F, cam.f); gl.uniform3fv(U.R, cam.r); gl.uniform3fv(U.Up, cam.u);
    gl.uniform1f(U.tanH, cam.tanH); gl.uniform1f(U.asp, cam.asp); gl.uniform1f(U.detail, clamp(3 / cam.alt, 12, 4000)); gl.uniform1f(U.time, t); gl.uniform1i(U.tex, 0);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
  // project a unit vector → [x, y, visible]
  function PV(p) { const d = add(p, cam.C, -1), z0 = dot(d, cam.f), vis = dot(p, add(cam.C, p, -1)) > 0 && z0 > 0, z = Math.max(z0, 0.002);
    return [W / 2 + dot(d, cam.r) / (z * cam.tanH * cam.asp) * W / 2, H / 2 - dot(d, cam.u) / (z * cam.tanH) * H / 2, vis, z0 > 0]; }
  const P = (lo, la) => PV(V3(lo, la));
  // polygon projection: points behind the horizon slide onto the limb, then the ring is clipped at the near plane
  function ringPath(v) { const L = Math.hypot(...cam.C), Cn = cam.C.map((q) => q / L), hz = 1 / L, sq = Math.sqrt(Math.max(0, 1 - hz * hz)); let anyVis = false;
    const pts = v.map((p) => { const k = dot(p, Cn); if (k >= hz) { anyVis = true; return p; } const r = add(p, Cn, -k), rl = Math.hypot(...r) || 1; return add(Cn.map((q) => q * hz), r, sq / rl); });
    if (!anyVis) return null; const cs = pts.map((p) => { const d = add(p, cam.C, -1); return [dot(d, cam.r), dot(d, cam.u), dot(d, cam.f)]; }), zn = 0.0005, out = [];
    for (let i = 0; i < cs.length; i++) { const a = cs[i], b = cs[(i + 1) % cs.length], ai = a[2] >= zn, bi = b[2] >= zn; if (ai) out.push(a);
      if (ai !== bi) { const u = (zn - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, zn]); } }
    return out.map(([x, y, z]) => [W / 2 + x / (z * cam.tanH * cam.asp) * W / 2, H / 2 - y / (z * cam.tanH) * H / 2]); }
  function trace(pts, close) { g.beginPath(); let pen = false;
    for (const p of pts) { const [x, y, vis] = PV(p); if (!vis) { pen = false; continue; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } if (close) g.closePath(); }
  const near = (c, lim) => dot(c, V3(cam.lon, cam.lat)) > lim;
  return { init, setCam, render, P, PV, V3, trace, near, ringPath, get cam() { return cam; }, get rings() { return RINGS3; }, get mesh() { return MESH; }, canvas: cv };
})();

// ---------------------------------------------------------------- camera path
// keys: [[t, lon, lat, alt, tilt, head], …]  — spring-smoothed; altitude interpolates in log space; o.hop lifts long moves
function camPath(t, keys, o = {}) { const k0 = keys[0]; let lon = k0[1], lat = k0[2], la = Math.log(k0[3]), ti = k0[4] || 0, hd = k0[5] || 0, hop = 0;
  for (let i = 1; i < keys.length; i++) { const k = keys[i], p = spring(t - k[0], o.k || 14, o.d || 7.6), q = clamp(p);
    lon += (k[1] - keys[i - 1][1]) * p; lat += (k[2] - keys[i - 1][2]) * p; la += (Math.log(k[3]) - Math.log(keys[i - 1][3])) * p;
    ti += ((k[4] ?? 0) - (keys[i - 1][4] ?? 0)) * p; hd += ((k[5] ?? 0) - (keys[i - 1][5] ?? 0)) * p;
    if (k[6]) hop += k[6] * Math.sin(Math.PI * q); }
  return { lon, lat, alt: Math.exp(la) * (1 + hop), tilt: ti, head: hd }; }
// space + planet; returns the camera (for overlays)
function earth(t, c, o = {}) { const dr = o.drift ?? 1; c = { ...c, head: (c.head || 0) + dr * t * 1.6, alt: c.alt * Math.exp(-dr * 0.018 * t) }; const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#02040A'); gr.addColorStop(1, '#070B16'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  stars(t, 220, 77); MAP.setCam(c); if (!window.NOGL) MAP.render(t); g.imageSmoothingQuality = 'high'; g.drawImage(MAP.canvas, 0, 0, W, H);
  if (o.coast !== false) coasts(o);
  const sh = g.createLinearGradient(0, 0, 0, 820); sh.addColorStop(0, 'rgba(2,4,10,0.72)'); sh.addColorStop(1, 'rgba(2,4,10,0)'); g.fillStyle = sh; g.fillRect(0, 0, W, 820);
  return MAP.cam; }
// crisp coastlines + borders near the camera target
function coasts(o = {}) { const lim = Math.cos(Math.min(1.4, MAP.cam.alt * 1.2 + 0.05));
  g.save(); g.lineJoin = 'round'; g.strokeStyle = o.coastCol || 'rgba(255,248,225,0.30)'; g.lineWidth = 1.6;
  for (const r of MAP.rings) { if (!MAP.near(r.c, lim - 0.25)) continue; MAP.trace(r.v, true); g.stroke(); }
  g.strokeStyle = o.borderCol || 'rgba(255,255,255,0.55)'; g.lineWidth = 2.2; g.setLineDash([10, 7]);
  for (const l of MAP.mesh) { if (!MAP.near(l[0], lim - 0.35) && !MAP.near(l[l.length - 1], lim - 0.35)) continue; MAP.trace(l, false); g.stroke(); } g.setLineDash([]); g.restore(); }
// fill a country (topojson name) or a custom [[lon,lat],…] polygon
function territory(who, col, a = 0.55, o = {}) { if (a <= 0) return; if (o.zoomFade !== false) a *= 0.4 + 0.6 * clamp(MAP.cam.alt / 0.06); g.save(); g.globalAlpha = a; g.fillStyle = col;
  const rings = typeof who === 'string' ? MAP.rings.filter((r) => r.name === who).map((r) => r.v) : [who.map(([lo, la]) => MAP.V3(lo, la))];
  const path = new Path2D(); for (const v of rings) { const q = MAP.ringPath(v); if (!q || q.length < 3) continue; q.forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y)); path.closePath(); }
  if (o.spot) { const sp = new Path2D(); sp.rect(-50, -50, W + 100, H + 100); sp.addPath(path); g.save(); g.globalAlpha = o.spot; g.fillStyle = 'rgba(2,6,14,1)'; g.fill(sp, 'evenodd'); g.restore(); }
  g.fill(path, 'evenodd'); if (o.stroke) { g.globalAlpha = Math.min(1, a * 1.8); g.strokeStyle = o.stroke; g.lineWidth = o.lw || 4; g.shadowColor = o.stroke; g.shadowBlur = o.glow ?? 18; g.stroke(path); } g.restore(); }
// great-circle arrow from A to B, drawn to progress p
function arc3d(A, B, p, col = GOLD, o = {}) { if (p <= 0) return; const a = MAP.V3(...A), b = MAP.V3(...B), om = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)), n = 80, pts = [];
  for (let i = 0; i <= n * clamp(p); i++) { const u = i / n, s = Math.sin(om) || 1, k1 = Math.sin((1 - u) * om) / s, k2 = Math.sin(u * om) / s, lift = 1 + (o.lift ?? 0.02) * Math.sin(Math.PI * u);
    pts.push(MAP.PV([(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift])); }
  if ((o.a ?? 1) <= 0) return; g.save(); g.globalAlpha = o.a ?? 1; g.strokeStyle = col; g.lineWidth = o.w || 7; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 16; if (o.dash) g.setLineDash(o.dash);
  g.beginPath(); let pen = false; pts.forEach(([x, y, v]) => { if (!v) { pen = false; return; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; }); g.stroke(); g.setLineDash([]);
  if (!pts.at(-1)[2]) { g.restore(); return; }
  if (pts.length > 2) { const [x1, y1] = pts.at(-1), [x0, y0] = pts.at(-3), an = Math.atan2(y1 - y0, x1 - x0); g.fillStyle = col; g.beginPath(); g.moveTo(x1 + Math.cos(an) * 22, y1 + Math.sin(an) * 22);
    g.lineTo(x1 + Math.cos(an + 2.5) * 22, y1 + Math.sin(an + 2.5) * 22); g.lineTo(x1 + Math.cos(an - 2.5) * 22, y1 + Math.sin(an - 2.5) * 22); g.fill(); }
  g.restore(); }
// a place label with a dot, anchored on the map
function place(lon, lat, name, t, tIn, o = {}) { const [x, y, vis] = MAP.P(lon, lat); if (!vis || t < tIn) return; const s = spring(t - tIn, 300, 18);
  g.save(); g.fillStyle = o.color || TXT; g.beginPath(); g.arc(x, y, 8 * s, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 3; g.stroke();
  if (name) { g.globalAlpha = clamp(s); const fs = o.size || 40; g.font = F.ui(fs); const tw = g.measureText(name).width, dx = o.left ? -24 - tw - 28 : 24, y0 = y - fs * 0.62 + (o.dy ?? 0);
    g.fillStyle = 'rgba(6,10,18,0.78)'; rrect(x + dx, y0 - 8, tw + 28, fs + 16, (fs + 16) / 2); g.fill(); g.strokeStyle = o.color || 'rgba(255,255,255,0.35)'; g.lineWidth = 2; g.stroke();
    text(name, x + dx + 14, y0 + fs * 0.82, 'ui', fs, o.color || TXT); } g.restore(); return [x, y]; }

// ---------------------------------------------------------------- flags (drawn, waving)
function flagBase(code, w, h, X = g) { const F = (c, x, y, ww, hh) => { X.fillStyle = c; X.fillRect(x, y, ww, hh); };
  const hz = (cs) => cs.forEach((c, i) => F(c, 0, i * h / cs.length, w, h / cs.length + 0.5)), vt = (cs) => cs.forEach((c, i) => F(c, i * w / cs.length, 0, w / cs.length + 0.5, h));
  const star = (cx, cy, r, c) => { X.fillStyle = c; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r; X.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } X.fill(); };
  switch (code) {
    case 'GB': { F('#012169', 0, 0, w, h); X.save(); X.beginPath(); X.rect(0, 0, w, h); X.clip(); X.lineCap = 'butt';
      X.strokeStyle = '#FFF'; X.lineWidth = h * 0.2; X.beginPath(); X.moveTo(0, 0); X.lineTo(w, h); X.moveTo(w, 0); X.lineTo(0, h); X.stroke();
      X.strokeStyle = '#C8102E'; X.lineWidth = h * 0.067; X.beginPath(); X.moveTo(0, 0); X.lineTo(w, h); X.moveTo(w, 0); X.lineTo(0, h); X.stroke(); X.restore();
      F('#FFF', w / 2 - h * 0.167, 0, h * 0.333, h); F('#FFF', 0, h / 2 - h * 0.167, w, h * 0.333); F('#C8102E', w / 2 - h * 0.1, 0, h * 0.2, h); F('#C8102E', 0, h / 2 - h * 0.1, w, h * 0.2); break; }
    case 'AR': hz(['#74ACDF', '#FFFFFF', '#74ACDF']); X.fillStyle = '#F6B40E'; X.beginPath(); X.arc(w / 2, h / 2, h * 0.11, 0, 6.283); X.fill();
      X.strokeStyle = '#F6B40E'; X.lineWidth = 2; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; X.beginPath(); X.moveTo(w / 2 + Math.cos(a) * h * 0.12, h / 2 + Math.sin(a) * h * 0.12); X.lineTo(w / 2 + Math.cos(a) * h * 0.16, h / 2 + Math.sin(a) * h * 0.16); X.stroke(); } break;
    case 'FR': vt(['#0055A4', '#FFFFFF', '#EF4135']); break;
    case 'ES': F('#AA151B', 0, 0, w, h); F('#F1BF00', 0, h / 4, w, h / 2); break;
    case 'DK': F('#C8102E', 0, 0, w, h); F('#FFF', w * 0.32, 0, h * 0.14, h); F('#FFF', 0, h * 0.43, w, h * 0.14); break;
    case 'GL': F('#FFF', 0, 0, w, h / 2); F('#C8102E', 0, h / 2, w, h / 2); X.save(); X.beginPath(); X.arc(w * 0.375, h / 2, h / 3, 0, 6.283); X.clip();
      F('#C8102E', 0, 0, w, h / 2); F('#FFF', 0, h / 2, w, h / 2); X.restore(); break;
    case 'CA': F('#D80621', 0, 0, w / 4, h); F('#FFF', w / 4, 0, w / 2, h); F('#D80621', w * 0.75, 0, w / 4 + 0.5, h);
      { const s = h / 2.2, cx = w / 2, cy = h / 2 + s * 0.05; X.fillStyle = '#D80621'; X.beginPath();
        [[0, -1], [.18, -.62], [.38, -.75], [.32, -.2], [.62, -.42], [.68, -.28], [.9, -.32], [.78, -.02], [.85, .08], [.42, .38], [.48, .55], [.06, .48], [.06, .9], [-.06, .9], [-.06, .48], [-.48, .55], [-.42, .38], [-.85, .08], [-.78, -.02], [-.9, -.32], [-.68, -.28], [-.62, -.42], [-.32, -.2], [-.38, -.75], [-.18, -.62]]
          .forEach(([x, y], i) => i ? X.lineTo(cx + x * s, cy + y * s) : X.moveTo(cx + x * s, cy + y * s)); X.fill(); } break;
    case 'NL': hz(['#AE1C28', '#FFFFFF', '#21468B']); break;
    case 'BE': vt(['#000000', '#FDDA24', '#EF3340']); break;
    case 'RU': hz(['#FFFFFF', '#0039A6', '#D52B1E']); break;
    case 'LT': hz(['#FDB913', '#006A44', '#C1272D']); break;
    case 'PL': hz(['#FFFFFF', '#DC143C']); break;
    case 'EP': hz(['#111111', '#FFFFFF']); break;                       // Province of East Prussia
    case 'NM': hz(['#111111', '#FFFFFF', '#2A6FDB']); break;            // Neutral Moresnet
    case 'PR': hz(['#111111', '#FFFFFF']); break;                       // Prussia (simplified)
    case 'US': for (let i = 0; i < 13; i++) F(i % 2 ? '#FFF' : '#B22234', 0, i * h / 13, w, h / 13 + 0.5); F('#3C3B6E', 0, 0, w * 0.4, h * 7 / 13);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) star(w * 0.035 + c * w * 0.066, h * 0.055 + r * h * 0.1, h * 0.028, '#FFF'); break;
    case 'EO': F('#009900', 0, 0, w, h); F('#FFF', 0, 0, w / 3, h / 2); star(w / 6, h / 4, h * 0.17, '#009900'); break;   // Esperanto
    default: F('#888', 0, 0, w, h); }
}
// waving flag: rendered once per call into strips with a travelling sine
const FLAGC = document.createElement('canvas'); FLAGC.width = 600; FLAGC.height = 400; const FG = FLAGC.getContext('2d');
function flag(code, x, y, w, t, o = {}) { const h = w * (o.ratio || (code === 'GB' ? 0.5 : code === 'US' ? 0.526 : code === 'CA' ? 0.5 : 0.667)); const s = o.s ?? 1; if (s <= 0) return;
  FG.setTransform(1, 0, 0, 1, 0, 0); FG.clearRect(0, 0, 600, 400); FG.setTransform(600 / w, 0, 0, 600 / w, 0, 0); flagBase(code, w, h, FG);
  const ph = h * 600 / w, n = 30, amp = o.still ? 0 : h * 0.06;
  g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 24; g.fillStyle = 'rgba(0,0,0,0.001)'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowBlur = 0;
  for (let i = 0; i < n; i++) { const u = i / n, dy = Math.sin(u * 7 - t * 5) * amp * u, sh = 0.82 + 0.18 * Math.cos(u * 7 - t * 5);
    g.drawImage(FLAGC, u * 600, 0, 600 / n + 1, ph, -w / 2 + u * w, -h / 2 + dy, w / n + 1, h);
    if (!o.still) { g.fillStyle = `rgba(0,0,0,${(1 - sh) * 0.8})`; g.fillRect(-w / 2 + u * w, -h / 2 + dy, w / n + 1, h); } }
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 2; g.strokeRect(-w / 2, -h / 2 + Math.sin(-t * 5) * 0, w, h); g.restore(); }
// "A vs B" header
function versus(a, b, la, lb, t, tIn, y = 760) { const s = spring(t - tIn, 220, 18); if (s <= 0) return; g.save(); g.globalAlpha = clamp(s);
  flag(a, 300 - (1 - s) * 300, y, 300, t); flag(b, 780 + (1 - s) * 300, y, 300, t + 0.5);
  text('VS', 540, y + 28, 'disp', 90, GOLD, { align: 'center', shadow: true });
  if (la) text(la, 300, y + 160, 'ui', 34, TXT, { align: 'center', shadow: true }); if (lb) text(lb, 780, y + 160, 'ui', 34, TXT, { align: 'center', shadow: true }); g.restore(); }
// year badge (documentary style)
function yearTag(y, t, tIn, o = {}) { const s = spring(t - tIn, 300, 18); if (s <= 0) return; g.save(); g.translate(o.x ?? 80, o.y ?? 560); g.scale(s, s);
  text(String(y), 0, 0, 'disp', o.size || 170, o.color || TXT, { shadow: true }); g.restore(); }
// a flag on a pole planted at a map position
function flagPin(lon, lat, code, t, tIn, o = {}) { const [x, y, vis] = MAP.P(lon, lat); if (!vis || t < tIn) return; const s = spring(t - tIn, 260, 16) * (o.s ?? 1); if (s <= 0.01) return;
  const ph = (o.pole || 110) * s; g.save(); g.strokeStyle = '#EDE6D8'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - ph); g.stroke();
  g.fillStyle = 'rgba(0,0,0,0.5)'; g.beginPath(); g.ellipse(x, y, 14, 5, 0, 0, 6.283); g.fill(); g.restore();
  const w = (o.w || 130) * s; flag(code, x + w / 2 + 2, y - ph + w * 0.3, w, t, { s: 1 });
  if (o.label) { const fs = o.size || 36; g.font = F.ui(fs); const tw = g.measureText(o.label).width; mapLabel(o.label, o.left ? x - tw - 44 : x + 16, y + 54, TXT, fs); } }

// framed real photo (only if CI found one) with a caption strip
function photoCard(t, id, x, y, w, h, tIn, cap) { if (!hasPhoto(id) || t < tIn) return false; const s = spring(t - tIn, 200, 18);
  g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(-0.03); g.scale(s, s); g.translate(-x - w / 2, -y - h / 2);
  g.fillStyle = '#EDE6D8'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; g.fillRect(x - 14, y - 14, w + 28, h + 70); g.shadowBlur = 0;
  photo(t, id, x, y, w, h, { r: 0 }); if (cap) text(cap, x, y + h + 42, 'mono', 24, PINK, { ls: 3 }); g.restore(); return true; }
// liquor bottle icon
function bottle(x, y, s, col, lab, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.moveTo(-30, 80); g.lineTo(-30, -20); g.quadraticCurveTo(-30, -45, -12, -55); g.lineTo(-12, -100); g.lineTo(12, -100); g.lineTo(12, -55); g.quadraticCurveTo(30, -45, 30, -20); g.lineTo(30, 80); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(-22, -15, 8, 85); g.fillStyle = '#EDE6D8'; g.fillRect(-26, 5, 52, 40); g.fillStyle = '#2B2A28'; g.fillRect(-14, -112, 28, 14);
  text(lab, 0, 31, 'mono', 11, PINK, { align: 'center' }); g.restore(); }
// an ellipse-shaped island polygon in lon/lat (for places too small for the 50m data)
function islandPoly(lon, lat, rxKm, ryKm, rot = 0, seed = 1) { const r = rng(seed), pts = []; for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283, k = 0.85 + 0.25 * r();
  const x = Math.cos(a) * rxKm * k, y = Math.sin(a) * ryKm * k, xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot);
  pts.push([lon + xr / (111.32 * Math.cos(lat * D2R)), lat + yr / 110.57]); } return pts; }
// a dashed line along given lon/lat points, drawn to progress p
function line3d(pts, p, col = GOLD, o = {}) { const n = Math.max(2, Math.ceil(pts.length * clamp(p))); g.save(); g.strokeStyle = col; g.lineWidth = o.w || 5; g.shadowColor = col; g.shadowBlur = o.glow ?? 10;
  if (o.dash) g.setLineDash(o.dash); g.beginPath(); let pen = false; for (let i = 0; i < n; i++) { const [x, y, v] = MAP.P(...pts[i]); if (!v) { pen = false; continue; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } g.stroke(); g.restore(); }
const densify = (pts, k = 20) => { const out = []; for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < k; j++) { const u = j / k; out.push([lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)]); } out.push(pts.at(-1)); return out; };

// documentary inset: a framed detail map that floats over the moving globe (fn draws in local coords 0..w × 0..h)
function inset(t, tIn, title, fn, o = {}) { const s = spring(t - tIn, 220, 20); if (s <= 0.01) return; const x = o.x ?? 60, y = o.y ?? 660, w = o.w ?? 960, h = o.h ?? 560;
  g.save(); g.globalAlpha = clamp(s * 1.4); g.translate(x + w / 2, y + h / 2); g.scale(0.9 + 0.1 * s, 0.9 + 0.1 * s); g.translate(-w / 2, -h / 2);
  g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 50; g.fillStyle = '#0B1520'; rrect(0, 0, w, h, 26); g.fill(); g.shadowBlur = 0;
  g.save(); rrect(0, 0, w, h, 26); g.clip(); const z = 1 + 0.06 * (t - tIn) / 6; g.translate(w / 2, h / 2); g.scale(z, z); g.translate(-w / 2, -h / 2); fn(w, h); g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 3; rrect(0, 0, w, h, 26); g.stroke();
  if (title) { g.font = F.mono(24); g.letterSpacing = '4px'; const tw = g.measureText(title).width + 40; g.letterSpacing = '0px'; g.fillStyle = GOLD; rrect(24, -22, tw, 44, 22); g.fill(); text(title, 44, 9, 'mono', 24, BG, { ls: 4 }); }
  g.restore(); }
// flat-map helpers for insets
function waterBG(w, h, t, col = '#123A5A') { g.fillStyle = col; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(160,210,240,0.10)'; g.lineWidth = 2;
  for (let k = 0; k < 26; k++) { const y = k * 24 + 8, x0 = ((t * 30 + k * 71) % 160) - 160; for (let x = x0; x < w; x += 160) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y); g.stroke(); } } }
function mapLabel(str, x, y, col = TXT, size = 30, o = {}) { g.font = F.ui(size); const tw = g.measureText(str).width; g.fillStyle = 'rgba(6,10,18,0.72)'; rrect(x - (o.center ? tw / 2 + 14 : 0), y - size * 0.95, tw + 28, size * 1.35, size * 0.67); g.fill();
  text(str, x + (o.center ? 0 : 14), y, 'ui', size, col, { align: o.center ? 'center' : 'left' }); }
