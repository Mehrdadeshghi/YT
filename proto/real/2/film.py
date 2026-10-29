# Real-2 TRUE STORY cold open — the 33 Chilean miners (2010 Copiapó mining accident).
# Real archive photos (Gobierno de Chile, CC BY 2.0; NASA PD; the note: public-domain tracing) + photoreal recreations labelled RECREATION.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
MAP = json.load(open(f'{HERE}/../media/map_chile.json'))

TITLE = 'The 33 miners: the note from 2,300 feet'
LOOK = 'mine'
REC, REAL = 'RECREATION · AI', 'REAL PHOTO · GOV. OF CHILE'
PHRASES = [(['twenty-three', 'hundred'], '2,300'), (['twenty', 'ten'], '2010'), (['thirty-three'], '33'), (['three'], '3'),
           (['two'], '2'), (['seventeen'], '17'), (['twenty-one'], '21'), (['sixty-nine'], '69')]

SHOTS = [
    dict(src='ai:m12_42', at=0.0, move=('push', 1.06, 1.18, 0, 0, 30, -10), label=REC, shake=(9, 0.55)),
    dict(src='ai:m06_11', at=0.62, seam='push', move=('push', 1.08, 1.2, 0, 0, 0, 0), label=REC),
    dict(src='ai:m04_29', at=t('nobody') - 0.04, move=('tilt', 1.14, 1.22, 0, 0, 90, -90), label=REC),
    dict(src='photo:mine/rigs.jpg', at=t('august') - 0.04, seam='pull', move=('pan', 1.0, 1.05, 300, -200, 0, 0), label=REAL, focus=0.5),
    dict(src='ai:m02_29', at=t('caves') - 0.1, seam='flash', move=('push', 1.08, 1.26, 0, 0, -20, 30), label=REC, shake=(20, 1.0)),
    dict(src='ai:m03_11', at=t('thirty') - 0.04, move=('push', 1.10, 1.22, 0, 0, 0, 0), label=REC),
    dict(src='ai:m01_5', at=t('the', 2) - 0.04, seam='push', move=('push', 1.10, 1.26, 0, 0, 40, -40), label=REC),
    dict(src='ai:m05_29', at=t('their') - 0.04, move=('push', 1.10, 1.22, 0, 0, 0, 0), label=REC),
    dict(src='ai:m05_11', at=t('they') - 0.04, seam='push', move=('push', 1.12, 1.26, 0, 0, 0, 0), label=REC),
    dict(src='photo:mine/drill.jpg', at=t('above') - 0.04, move=('tilt', 1.0, 1.06, 0, 0, 0, -40), label='REAL PHOTO · GOV. OF CHILE', focus=0.35),
    dict(src='ai:m12_7', at=t('day') - 0.06, seam='flash', move=('push', 1.10, 1.28, 0, 0, 0, 0), label=REC, shake=(16, 1.0)),
    dict(src='ai:m13_7', at=t('they', 2) - 0.04, move=('push', 1.10, 1.22, 0, 0, 0, 0), label=REC),
    dict(src='ai:m06_29', at=t('we') - 0.1, seam='push', move=('push', 1.14, 1.2, 0, 0, 0, 0), label=REC),
    dict(src='photo:mine/capsule_day.jpg', at=t('getting') - 0.04, seam='pull', move=('pan', 1.0, 1.08, 120, -60, 0, 0), label=REAL, focus=0.45),
    dict(src='photo:mine/fenix.jpg', at=t('capsule') - 0.04, seam='push', move=('push', 1.0, 1.06, 0, 0, 0, 0), label='REAL PHOTO · FÉNIX 2 ON DISPLAY', focus=0.5),
    dict(src='photo:mine/capsule_night.jpg', at=t('built') - 0.04, move=('pan', 1.0, 1.06, 200, -120, 0, 0), label=REAL, focus=0.3),
    dict(src='ai:m09_11', at=t('one') - 0.04, move=('tilt', 1.14, 1.26, 0, 0, -60, 60), label=REC),
    dict(src='photo:mine/flag.jpg', at=t('the', 7) - 0.04, seam='pull', move=('push', 1.0, 1.08, -140, -200, 0, 0), label=REAL, focus=0.62),
    dict(src='ai:m06_29', at=t('could') - 0.04, move=('pullback', 1.24, 1.08, 0, 0, 0, 0), label=REC),
]

OVERLAYS = [
    dict(type='hook', text='Day 17. 2,300 ft down.', at=0.0, end=t('nobody') - 0.05, y=330),
    dict(type='gauge', label='DEPTH · FT', v0=0, v1=2300, lo=0, hi=2500, step=250, at=t('nobody') - 0.02, end=t('august') - 0.1, x=780, y=320, h=720, dur=1.4, delay=0.1),
    dict(type='stamp', text='05 AUG 2010 · 14:00 · SAN JOSÉ MINE', at=t('august') - 0.02, end=t('caves') - 0.15, x=56, y=230),
    dict(type='map', path=MAP['path'], dot=MAP['dot'], text='Atacama Desert, Chile', coord='27.16°S 70.50°W', at=t('copper') - 0.1, end=t('caves') - 0.15, x=660, y=330),
    dict(type='counter', label='TRAPPED', v0=0, v1=33, unit='MEN', at=t('thirty') - 0.02, end=t('the', 2) - 0.1, x=70, y=300, dur=0.6),
    dict(type='counter', label='TO THE ENTRANCE', v0=0, v1=3, unit='MILES', at=t('three') - 0.02, end=t('the', 2) - 0.1, x=70, y=520, dur=0.5),
    dict(type='counter', label='FOOD MEANT FOR · AT MOST', v0=3, v1=3, unit='DAYS', at=t('their') - 0.02, end=t('they') - 0.05, x=70, y=300, dur=0.3),
    dict(type='counter', label='STRETCHED TO', v0=3, v1=14, unit='DAYS', red=True, at=t('they') - 0.02, end=t('above') - 0.1, x=70, y=300, dur=0.9),
    dict(type='stamp', text='DAY 17 · 22 AUG 2010 · DRILL NO. 8', at=t('day') - 0.04, end=t('they', 2) - 0.1, x=56, y=230),
    dict(type='flash', at=t('day') - 0.06, end=t('day') + 0.7, hits=[(t('day') - 0.06, 0.9)], color='#ffe9c4', decay=0.5),
    dict(type='flash', at=t('caves') - 0.1, end=t('caves') + 0.7, hits=[(t('caves') - 0.1, 0.7)], color='#ffd9a0', decay=0.45),
    dict(type='note', src='assets/note.svg', text='THE REAL NOTE · 22 AUG 2010 · TRACED, PUBLIC DOMAIN', at=t('we') - 0.1, end=t('getting') - 0.06, y=560, wipe=1.4),
    dict(type='measure', p0=[456, 880], p1=[642, 880], text='21 IN', at=t('twenty', 3) - 0.05, end=t('built') - 0.06, lx=680, ly=850),
    dict(type='counter', label='RESCUE', v0=0, v1=69, unit='DAYS', at=t('could') - 0.02, end=END - 0.2, x=70, y=300, dur=1.0),
]

CUES = [
    ['drill', 0.0, 0.5, 0.7], ['crack', 0.02, 0.5], ['rumble', 0.0, 0.5, 2.0],
    ['stamp', t('august'), 0.3],
    ['boom', t('caves') - 0.1, 0.85], ['rumble', t('caves') - 0.2, 0.8, 3.2],
    ['tick', t('thirty'), 0.25], ['thump', t('missing'), 0.35],
    ['drill', t('above') - 0.1, 0.45, t('day') - t('above')],
    ['crack', t('day') - 0.06, 0.6], ['boom', t('day') - 0.06, 0.55], ['hit', t('punches'), 0.45],
    ['paper', t('note'), 0.4], ['pulse', t('they') - 0.2, 0.4, t('above') - t('they') + 0.1, 80],
    ['stamp', t('we'), 0.3],
    ['rumble', t('one') - 0.1, 0.35, 1.8],
]
COPY = {'note.svg': 'mine/note.svg'}
MUSIC = dict(f=(46.25, 69.3), gain=0.55)
