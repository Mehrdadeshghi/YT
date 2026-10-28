# python3 glbinfo.py assets/glb/*.glb → animation names + rough bounds per model (reads the GLB JSON chunk only)
import sys, json, struct
for f in sys.argv[1:]:
    b = open(f, 'rb').read()
    n = struct.unpack('<I', b[12:16])[0]
    j = json.loads(b[20:20 + n])
    anims = [a.get('name') for a in j.get('animations', [])]
    mn = [1e9] * 3; mx = [-1e9] * 3
    for m in j.get('meshes', []):
        for p in m['primitives']:
            acc = j['accessors'][p['attributes']['POSITION']]
            for i in range(3):
                mn[i] = min(mn[i], acc['min'][i]); mx[i] = max(mx[i], acc['max'][i])
    print(f.split('/')[-1], 'skins', len(j.get('skins', [])), 'mats', len(j.get('materials', [])), 'size', [round(mx[i] - mn[i], 2) for i in range(3)], 'anims', anims)
