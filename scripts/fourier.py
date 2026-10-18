#!/usr/bin/env python3
"""Fourier epicycles for a map outline ("How many circles does it take to draw X?").
  python3 scripts/fourier.py usa|tx|… <ep> → cine/<ep>_fou.js  (coefficients sorted by size, stages with the miss in miles, labels)
Outline: Natural Earth 1:10m (public domain), Albers equal-area projection, resampled by arc length.
Data: ne_10m_admin_1_states_provinces.geojson + ne_10m_lakes.geojson from raw.githubusercontent.com/nvkelso/natural-earth-vector
(master/geojson) saved as states.geojson / lakes.geojson in $NE_DIR (default out/ne)."""
import json, math, os, sys
import numpy as np
NE = os.environ.get('NE_DIR', 'out/ne')
# per region: screen name, projection centre (lon0, lat0) so the shape stands upright, labels (name, lon, lat) that pop up as the pen passes
REGIONS = {
    'usa': dict(name='USA', lon0=-96, lat0=37.5, labels=[('Florida', -81.5, 27.5), ('Texas', -99, 31), ('California', -119.5, 37), ('Maine', -69.3, 45.3), ('Michigan', -84.8, 43.6),
               ('Cape Cod', -70.2, 41.8), ('Puget Sound', -122.5, 47.6), ('Chesapeake Bay', -76.2, 38.2), ('Louisiana', -91.5, 30.5)]),
    'tx': dict(name='TEXAS', lon0=-99.5, lat0=31.2, labels=[('Panhandle', -101.5, 36.5), ('Red River', -96.5, 33.8), ('El Paso', -106.5, 31.8), ('Big Bend', -103.2, 29.0),
               ('Rio Grande', -100.6, 29.0), ('Brownsville', -97.5, 25.9), ('Corpus Christi', -97.4, 27.8), ('Galveston', -94.8, 29.3), ('Sabine River', -93.7, 31.0)]),
    'fl': dict(name='FLORIDA', lon0=-83.5, lat0=28.0, labels=[('Pensacola', -87.2, 30.35), ('Apalachicola', -85.4, 29.7), ('Big Bend', -83.2, 29.45), ('Tampa Bay', -82.75, 27.65),
               ('Cape Sable', -81.1, 25.15), ('Miami', -80.15, 25.8), ('Cape Canaveral', -80.6, 28.45), ('Jacksonville', -81.4, 30.35)]),
    'ca': dict(name='CALIFORNIA', lon0=-119.5, lat0=37.0, labels=[('Oregon line', -122.0, 42.0), ('Lake Tahoe', -120.0, 39.0), ('Colorado River', -114.6, 33.5), ('San Diego', -117.2, 32.7),
               ('Los Angeles', -118.15, 33.75), ('Point Conception', -120.47, 34.45), ('Big Sur', -121.8, 36.2), ('San Francisco', -122.5, 37.75), ('Cape Mendocino', -124.4, 40.44)]),
}

def albers(lon, lat, lon0=-96, lat0=37.5, p1=29.5, p2=45.5, R=6371.0):
    r = math.radians; n = (math.sin(r(p1)) + math.sin(r(p2))) / 2; C = math.cos(r(p1)) ** 2 + 2 * n * math.sin(r(p1))
    rho = lambda la: R * math.sqrt(C - 2 * n * math.sin(r(la))) / n; th = n * r(lon - lon0)
    return rho(lat) * math.sin(th), -(rho(lat0) - rho(lat) * math.cos(th))   # km; y up → flip later

def outline(name):
    """USA: union of the lower 48 states + DC (state shorelines show the Great Lakes, e.g. Michigan's mitten); a state code → that state."""
    from shapely.geometry import shape
    from shapely.ops import unary_union
    d = json.load(open(f'{NE}/states.geojson'))
    fs = [f for f in d['features'] if f['properties'].get('adm0_a3') == 'USA']
    pick = [f for f in fs if f['properties']['postal'] not in ('AK', 'HI')] if name == 'usa' else [f for f in fs if f['properties']['postal'] == name.upper()]
    u = unary_union([shape(f['geometry']).buffer(0) for f in pick])
    lakes = [shape(f['geometry']).buffer(0) for f in json.load(open(f'{NE}/lakes.geojson'))['features'] if f['properties'].get('scalerank', 9) <= 2]
    u = u.difference(unary_union(lakes)).buffer(0.02).buffer(-0.02)          # Great Lakes shorelines (Michigan's mitten), close tiny slivers
    g = max(getattr(u, 'geoms', [u]), key=lambda q: q.area)
    return [list(p) for p in g.exterior.coords[:-1]]

def resample(P, N):
    P = np.array(P + [P[0]]); seg = np.hypot(*np.diff(P, axis=0).T); s = np.concatenate([[0], np.cumsum(seg)]); u = np.linspace(0, s[-1], N, endpoint=False)
    return np.interp(u, s, P[:, 0]) + 1j * np.interp(u, s, P[:, 1])

def miss(z, approx):    # symmetric Hausdorff distance between the true outline and the drawn curve, in km
    from scipy.spatial import cKDTree
    a = np.c_[z.real, z.imag]; b = np.c_[approx.real, approx.imag]
    return max(cKDTree(b).query(a)[0].max(), cKDTree(a).query(b)[0].max())

if __name__ == '__main__':
    name, ep = sys.argv[1], sys.argv[2]; R = REGIONS[name]; prj = lambda lo, la: albers(lo, la, R['lon0'], R['lat0'])
    ring = outline(name); pts = [prj(x, y) for x, y in ring]
    N = 4096; z = resample(pts, N)                                                         # albers() already returns screen coordinates (y down)
    c = np.fft.fft(z) / N; k = np.fft.fftfreq(N, 1 / N).astype(int)
    order = [0] + sorted(range(1, N), key=lambda i: -abs(c[i]))                 # centre first, then biggest circles
    STAGES = [1, 3, 10, 30, 60, 150, 500]
    t = np.arange(N) / N; st = []
    for n in STAGES:
        sel = order[:n + 1]; ap = sum(c[i] * np.exp(2j * np.pi * k[i] * t) for i in sel)
        st.append({'n': n, 'mi': round(miss(z, ap) * 0.621371)})
    coef = [[int(k[i]), round(c[i].real, 3), round(c[i].imag, 3)] for i in order[:STAGES[-1] + 1]]
    simp = z[::8]; box = [float(z.real.min()), float(z.imag.min()), float(z.real.max()), float(z.imag.max())]
    labels = []
    for nm, lo, la in R['labels']:
        x, y = prj(lo, la); p = complex(x, y); j = int(np.argmin(abs(z - p))); labels.append([nm, round(x, 1), round(y, 1), round(j / N, 4)])
    js = (f"// generated by scripts/fourier.py ({name}) — Natural Earth 1:10m, Albers equal-area, {N} samples\n"
          f"const FOU = {json.dumps({'name': R['name'], 'coef': coef, 'stages': st, 'box': [round(v, 1) for v in box], 'outline': [[round(q.real, 1), round(q.imag, 1)] for q in simp], 'labels': labels}, separators=(',', ':'))};\n")
    open(f'cine/{ep}_fou.js', 'w').write(js); print(st, len(js) // 1024, 'KB')
