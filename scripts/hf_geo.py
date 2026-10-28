#!/usr/bin/env python3
"""Map geometry for the HyperFrames kit's "map" template (run LOCALLY from scripts/mk<ep>.py; the result is stored in the episode JSON,
so CI needs neither the data nor shapely).

    import hf_geo
    G = hf_geo.region(bbox=(4, 42, 10, 47.5), width=2400, pts={'Paris': (2.35, 48.85)}, res='50m', simplify=0.6)
    → {'w', 'h', 'd' (SVG path of the land, projected), 'pts' {name: [x, y]}}

Data: Natural Earth land via the world-atlas npm package (TopoJSON, ISC / public domain), cached in models/geo/.
Projection: equirectangular with cos(mid-latitude) — fine for regional maps; label the map "Map · Graphic" on screen.
"""
import json, os, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'models', 'geo')


def topo(name):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, name)
    if not os.path.exists(p):
        urllib.request.urlretrieve(f'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/{name}', p)
    return json.load(open(p))


def rings(T, obj):
    """decode a TopoJSON object into polygon rings [[lon, lat], ...]"""
    sx, sy = T['transform']['scale']; tx, ty = T['transform']['translate']
    arcs = []
    for a in T['arcs']:
        x = y = 0; pts = []
        for dx, dy in a:
            x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    def arc(i): return arcs[i] if i >= 0 else arcs[~i][::-1]
    out = []
    def ring(r):
        pts = []
        for i in r:
            a = arc(i); pts.extend(a if not pts else a[1:])
        return pts
    geoms = T['objects'][obj]['geometries'] if T['objects'][obj]['type'] == 'GeometryCollection' else [T['objects'][obj]]
    for g in geoms:
        if g['type'] == 'Polygon': out += [ring(r) for r in g['arcs']]
        elif g['type'] == 'MultiPolygon': out += [ring(r) for p in g['arcs'] for r in p]
    return out


def region(bbox, width=2400, pts=None, res='50m', simplify=0.5, pad=0.0):
    from shapely.geometry import Polygon, box
    from shapely.ops import unary_union
    lon0, lat0, lon1, lat1 = bbox
    T = topo(f'land-{res}.json')
    clip = box(lon0 - pad, lat0 - pad, lon1 + pad, lat1 + pad)
    polys = []
    for r in rings(T, 'land'):
        if len(r) < 4: continue
        P = Polygon(r).buffer(0)
        if P.intersects(clip): polys.append(P.intersection(clip))
    land = unary_union(polys)
    import math
    kx = math.cos(math.radians((lat0 + lat1) / 2))
    s = width / ((lon1 - lon0) * kx)
    def pr(lon, lat): return ((lon - lon0) * kx * s, (lat1 - lat) * s)
    h = round((lat1 - lat0) * s)
    d = []
    geoms = getattr(land, 'geoms', [land])
    for g in geoms:
        if g.is_empty or g.geom_type != 'Polygon': continue
        for ring in [g.exterior] + list(g.interiors):
            xy = [pr(x, y) for x, y in ring.coords]
            from shapely.geometry import LineString
            ls = LineString(xy).simplify(simplify)
            c = list(ls.coords)
            if len(c) < 3: continue
            d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in c) + 'Z')
    return {'w': width, 'h': h, 'd': ''.join(d), 'pts': {k: [round(v, 1) for v in pr(*ll)] for k, ll in (pts or {}).items()}}
