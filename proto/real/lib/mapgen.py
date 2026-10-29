#!/usr/bin/env python3
"""Inset-map path from Natural Earth (public domain) for the 'map' overlay (360x420 box).
    python mapgen.py countries|states "Name1,Name2" LON0 LON1 LAT0 LAT1 DOTLON DOTLAT  → JSON {path, dot}
Equirectangular with cos(mid-lat) x-scaling, fitted into the box with a margin; polygons clipped by the view."""
import json, math, os, sys
from shapely.geometry import shape, box

HERE = os.path.dirname(os.path.abspath(__file__))
kind, names = sys.argv[1], sys.argv[2].split(',')
lon0, lon1, lat0, lat1, dlon, dlat = map(float, sys.argv[3:9])
gj = json.load(open(f'{HERE}/../media/ne_50m_{kind}.geojson'))
BW, BH, M = 360, 420, 16
k = math.cos(math.radians((lat0 + lat1) / 2))
sx = (BW - 2 * M) / ((lon1 - lon0) * k); sy = (BH - 2 * M) / (lat1 - lat0); s = min(sx, sy)
ox = (BW - (lon1 - lon0) * k * s) / 2; oy = (BH - (lat1 - lat0) * s) / 2
P = lambda lo, la: (ox + (lo - lon0) * k * s, oy + (lat1 - la) * s)
view = box(lon0, lat0, lon1, lat1)
d = []
for f in gj['features']:
    pr = f['properties']; nm = pr.get('NAME') or pr.get('name') or pr.get('ADMIN')
    if names != ['*'] and nm not in names: continue
    g = shape(f['geometry']).intersection(view)
    if g.is_empty: continue
    polys = [g] if g.geom_type == 'Polygon' else [p for p in getattr(g, 'geoms', []) if p.geom_type == 'Polygon']
    for p in polys:
        pts = [P(*c) for c in p.exterior.simplify(0.02).coords]
        if len(pts) > 2: d.append('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
x, y = P(dlon, dlat)
print(json.dumps(dict(path=' '.join(d), dot=[round(x, 1), round(y, 1)])))
