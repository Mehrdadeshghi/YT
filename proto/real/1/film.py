# Real-1 "WHAT HAPPENS IF…" — open a plane door at 35,000 ft. Simulation (AI, labelled) → the real case (NTSB photos).
# Facts: proto/real/1/facts.md. t()/te()/END are injected by lib/build.py.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
MAP = json.load(open(f'{HERE}/../media/map_pdx.json'))

TITLE = 'What happens if a plane door opens at 35,000 ft'
LOOK = 'cabin'
SIM, REAL = 'SIMULATION · AI', 'REAL PHOTO · NTSB'
PHRASES = [(['thirty-five', 'thousand'], '35,000'), (['eight'], '8'), (['fifteen'], '15'), (['ten', 'thousand'], '10,000'),
           (['twelve', 'eighty-two'], '1282'), (['twenty', 'twenty-four'], '2024')]

SHOTS = [
    dict(src='photo:plane/hole_in.jpg', at=0.0, move=('push', 1.04, 1.14, 0, 0, 0, 0), label='REAL PHOTO · NTSB, 2024', focus=0.5, shake=(7, 0.55)),
    dict(src='photo:plane/hole_out.jpg', at=0.62, seam='push', move=('push', 1.25, 1.4, 120, 60, 0, 0), zoom=1.0, label=REAL, focus=0.42),
    dict(src='ai:p03_11', at=t('nobody') - 0.04, move=('push', 1.08, 1.22, 0, 0, 0, 0), label=SIM),
    dict(src='ai:p04_11', at=t('the') - 0.04, seam='push', move=('push', 1.10, 1.24, 0, 0, 0, 0), label=SIM),
    dict(src='ai:p04_29', at=t('nearly') - 0.04, seam='push', move=('push', 1.10, 1.24, 0, 0, 0, 0), label=SIM),
    dict(src='ai:p02_29', at=t('but') - 0.04, move=('pan', 1.16, 1.2, 60, -60, 0, 0), label=SIM),
    dict(src='ai:p05_29', at=t('explosive') - 0.12, seam='flash', move=('push', 1.10, 1.3, 0, 0, 0, 0), label=SIM, shake=(22, 1.6)),
    dict(src='ai:p01_5', at=t('pressure') - 0.04, move=('push', 1.10, 1.22, 0, 0, 0, 0), label=SIM, shake=(8, 1.4)),
    dict(src='ai:p05_5', at=t('anything') - 0.04, move=('pan', 1.18, 1.24, 70, -70, 0, 0), label=SIM, shake=(10, 1.2)),
    dict(src='ai:p06_11', at=t('a', 3) - 0.04, move=('push', 1.10, 1.22, 0, 0, 0, 0), label=SIM),
    dict(src='ai:p07_11', at=t('masks') - 0.1, move=('tilt', 1.16, 1.22, 0, 0, -80, 80), label=SIM, shake=(6, 0.4)),
    dict(src='ai:p07_29', at=t('at', 2) - 0.04, seam='push', move=('push', 1.10, 1.26, 0, 0, 0, 0), label=SIM),
    dict(src='ai:p09_11', at=t('the', 5) - 0.04, move=('push', 1.10, 1.24, 0, 0, 0, 40), label=SIM, shake=(5, 1.6)),
    dict(src='photo:plane/hole_in2.jpg', at=t('this', 3) - 0.04, seam='pull', move=('push', 1.0, 1.08, 0, 0, 0, 0), label=REAL, focus=0.45),
    dict(src='photo:plane/hole_out.jpg', at=t('a', 5) - 0.04, move=('pan', 1.0, 1.06, 260, -140, 0, 0), label=REAL, focus=0.42),
    dict(src='ai:p05_29', at=t('a', 6) - 0.04, move=('push', 1.18, 1.32, 0, 0, 0, -30), label='RECREATION · AI', shake=(9, 1.0)),
    dict(src='photo:plane/plug_yard.jpg', at=t('everyone') - 0.04, move=('pan', 1.0, 1.06, 160, -80, 0, 0), label=REAL, focus=0.5),
    dict(src='photo:plane/hole_in.jpg', at=t('the', 7) - 0.04, seam='push', move=('push', 1.0, 1.1, 0, -40, 0, 0), label=REAL, focus=0.5),
    dict(src='ai:p08_29', at=t('so') - 0.04, move=('push', 1.10, 1.2, 0, 0, 0, 0), label=SIM),
]

OVERLAYS = [
    dict(type='hook', text='This door blew out mid-flight.', at=0.0, end=t('nobody') - 0.05, y=330),
    dict(type='counter', label='CABIN PRESSURE PUSH', v0=0, v1=7.8, fmt='{:.1f}', unit='LB / SQ IN', at=t('nearly') - 0.1, end=t('but') - 0.1, x=70, y=300, dur=1.0),
    dict(type='counter', label='ALTITUDE', v0=34000, v1=35000, unit='FT', at=t('but') + 0.05, end=t('explosive') - 0.15, x=70, y=300, dur=1.0),
    dict(type='flash', at=t('explosive') - 0.12, end=t('explosive') + 0.8, hits=[(t('explosive') - 0.12, 1.0)], decay=0.55),
    dict(type='counter', label='EXPLOSIVE DECOMPRESSION: UNDER', v0=0.5, v1=0.5, fmt='{:.1f}', unit='SEC', red=True, at=t('pressure') - 0.02, end=t('anything') - 0.1, x=70, y=300, dur=0.9, ease='power3.out'),
    dict(type='timer', label='USEFUL CONSCIOUSNESS', from_=15, at=t('fifteen') - 0.15, end=t('the', 5) - 0.08, x=70, y=290, sub='AT 35,000 FT: 15–30 S\nAFTER RAPID DECOMPRESSION'),
    dict(type='gauge', label='ALTITUDE · FT', v0=35000, v1=10000, lo=0, hi=40000, step=5000, at=t('the', 5) - 0.02, end=t('this', 3) - 0.1, x=790, y=330, h=700, dur=1.7),
    dict(type='stamp', text='05 JAN 2024 · ALASKA 1282 · 16,000 FT', at=t('alaska') - 0.1, end=t('a', 5) - 0.1, x=56, y=230),
    dict(type='map', path=MAP['path'], dot=MAP['dot'], text='Portland, Oregon', coord='45.59°N 122.60°W', at=t('alaska') + 0.25, end=t('a', 5) - 0.1, x=660, y=330),
    dict(type='frame', box=[380, 560, 760, 1330], text='SEAT 26A · EMPTY', at=t('seat') - 0.02, end=t('so') - 0.06),
    dict(type='counter', label='ON BOARD → SURVIVED', v0=0, v1=177, unit='OF 177', at=t('everyone') - 0.02, end=t('the', 7) - 0.1, x=70, y=300, dur=0.8),
]
for o in OVERLAYS:
    if 'from_' in o: o['from'] = o.pop('from_')

CUES = [
    ['boom', 0.0, 0.5], ['wind', 0.0, 0.4, t('nobody') - 0.2], ['hiss', 0.6, 0.35, 1.0],
    ['tick', t('eight'), 0.3],
    ['riser', t('but') - 0.2, 0.35, t('explosive') - t('but') + 0.05],
    ['boom', t('explosive') - 0.12, 0.85], ['crack', t('explosive') - 0.1, 0.5], ['hiss', t('explosive') - 0.1, 0.35, 1.6],
    ['wind', t('explosive') - 0.05, 0.45, 1.4], ['wind', t('explosive') + 1.2, 0.15, t('the', 5) - t('explosive') - 0.8],
    ['hit', t('anything') + 0.1, 0.35], ['hit', t('becomes') + 0.05, 0.3], ['thump', t('masks') + 0.05, 0.5],
    ['pulse', t('clock') - 0.1, 0.3, t('the', 5) - t('clock') + 0.2, 100],
    ['rumble', t('the', 5) - 0.1, 0.55, 2.4],
    ['stamp', t('this', 3), 0.35],
    ['wind', t('a', 6) - 0.05, 0.4, 2.0],
    ['tick', t('empty'), 0.35],
]
MUSIC = dict(f=(49.0, 73.42), gain=0.5)
