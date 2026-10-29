# Real-3 "INSIDE X" — inside one lightning strike. Photoreal macro plates (AI, labelled ILLUSTRATION) + real slow-motion
# footage (Wikimedia Commons, CC BY / CC BY-SA) + real NASA ISS photo; measured overlays (charges, stepped leader, bars).
TITLE = 'Inside a lightning strike'
LOOK = 'storm'
ILL = 'ILLUSTRATION · AI'
PHRASES = [(['a', 'hundred', 'and', 'forty-eight'], '148'), (['thirty', 'thousand'], '30,000'), (['fifty-four', 'thousand'], '54,000'),
           (['forty'], '40'), (['five'], '5')]

SHOTS = [
    dict(src='ai:l01_11', at=0.0, move=('push', 1.06, 1.18, 0, 0, 0, 0), label=ILL, shake=(10, 0.6)),
    dict(src='video:light/slowmo_h.webm', vstart=5.8, at=0.62, seam='flash', move=('push', 1.0, 1.08, 0, 0, 0, 0), label='REAL FOOTAGE · SLOW MOTION', focus=0.5),
    dict(src='ai:l02_11', at=t('deep') - 0.04, seam='push', move=('push', 1.08, 1.26, 0, 0, 0, 0), label=ILL),
    dict(src='ai:l03_29', at=t('ice') - 0.04, seam='push', move=('push', 1.10, 1.24, 0, 0, 0, 0), label=ILL),
    dict(src='ai:l09_11', at=t('and', 2) - 0.04, seam='pull', move=('pan', 1.14, 1.2, 50, -50, 0, 0), label=ILL),
    dict(src='ai:l10_7', at=t('then') - 0.04, move=('tilt', 1.08, 1.16, 0, 0, 50, -50), label=ILL),
    dict(src='video:light/slowmo_v.webm', vstart=0.6, portrait=True, at=t('a', 3) - 0.04, move=('push', 1.0, 1.1, 0, 0, 0, 0), label='REAL FOOTAGE · SLOW MOTION'),
    dict(src='ai:l06_11', at=t('now') - 0.08, seam='flash', move=('push', 1.08, 1.22, 0, 0, 0, 0), label=ILL, shake=(10, 0.8)),
    dict(src='ai:l06_29', at=t('thirty') - 0.04, move=('push', 1.08, 1.2, 0, 0, 0, 0), label=ILL, shake=(6, 0.5)),
    dict(src='ai:l07_29', at=t('the', 7) - 0.04, seam='push', move=('push', 1.10, 1.3, 0, 0, 0, 0), label=ILL),
    dict(src='ai:l07_11', at=t('fifty') - 0.04, move=('push', 1.12, 1.2, 0, 0, 0, 0), label=ILL),
    dict(src='ai:l11_42', at=t('the', 10) - 0.04, seam='flash', move=('push', 1.10, 1.3, 0, 0, 0, 0), label=ILL, shake=(18, 1.2)),
    dict(src='video:light/slowmo_b.webm', vstart=19.6, at=t('forty', 2) - 0.04, move=('push', 1.0, 1.08, 0, 0, 0, 0), label='REAL FOOTAGE · SLOW MOTION', focus=0.5),
    dict(src='photo:light/bolt_photo.jpg', at=t('thats', 2) - 0.04, move=('pan', 1.0, 1.06, 120, -60, 0, 0), label='REAL PHOTO · F. HAAG, CC BY-SA', focus=0.33),
    dict(src='photo:light/iss_milky.jpg', at=t('see', 3) - 0.04, seam='pull', move=('push', 1.0, 1.08, 0, 0, 0, 0), label='REAL PHOTO · NASA, ISS', focus=0.5),
]

OVERLAYS = [
    dict(type='hook', text="It doesn't strike down.", at=0.0, end=t('deep') - 0.05, y=330),
    dict(type='flash', at=0.62, end=1.4, hits=[(0.62, 0.9)], color='#e8e4ff', decay=0.5),
    dict(type='charges', at=t('positive') - 0.1, end=t('then') - 0.04, pts=[
        (300, 520, 1, t('positive')), (540, 470, 1, t('positive') + 0.08), (780, 540, 1, t('positive') + 0.16), (420, 600, 1, t('positive') + 0.24), (660, 610, 1, t('positive') + 0.3),
        (330, 900, -1, t('negative')), (560, 940, -1, t('negative') + 0.08), (790, 890, -1, t('negative') + 0.16), (450, 1010, -1, t('negative') + 0.24), (680, 1020, -1, t('negative') + 0.3)]),
    dict(type='path', at=t('creeps') - 0.1, end=t('a', 3) - 0.04, pts=[(560, 330), (500, 470), (585, 610), (520, 760), (610, 900), (545, 1050), (600, 1180)],
         step=0.42, text='≈148 FT / STEP', lx=640, ly=740),
    dict(type='flash', at=t('now') - 0.08, end=t('now') + 1.0, hits=[(t('now') - 0.08, 1.0)], color='#ffffff', decay=0.7),
    dict(type='counter', label='RETURN STROKE · UP TO', v0=0, v1=33, unit='% OF LIGHT SPEED', at=t('at') - 0.04, end=t('thirty') - 0.06, x=70, y=300, dur=0.8),
    dict(type='counter', label='CURRENT · AVERAGE BOLT', v0=0, v1=30000, unit='AMPS', red=True, at=t('thirty') - 0.02, end=t('the', 7) - 0.1, x=70, y=300, dur=0.8),
    dict(type='bars', at=t('fifty') - 0.02, end=t('the', 10) - 0.06, y=360, rows=[
        ('LIGHTNING CHANNEL', 54000, '54,000 °F', True, t('fifty') + 0.05),
        ('SURFACE OF THE SUN', 9930, '9,930 °F', False, t('surface'))]),
    dict(type='flash', at=t('the', 10) - 0.04, end=t('the', 10) + 0.8, hits=[(t('the', 10) - 0.04, 0.8)], color='#f0e8ff', decay=0.5),
    dict(type='counter', label='NEXT STROKE AFTER', v0=0, v1=40, unit='MS', at=t('forty', 2) - 0.02, end=t('thats', 2) - 0.08, x=70, y=300, dur=0.6),
    dict(type='flash', at=t('thats', 2) - 0.04, end=t('see', 3) - 0.04, hits=[(t('thats', 2) - 0.04, 0.6), (t('thats', 2) + 0.12, 0.4), (t('thats', 2) + 0.3, 0.5)], color='#e6e0ff', decay=0.12),
]

CUES = [
    ['crack', 0.0, 0.7], ['thunder', 0.05, 0.6, 3.0], ['rain', 0.0, 0.35, END - 0.5],
    ['zap', 0.62, 0.3], ['thunder', 0.7, 0.45, 2.5],
    ['rumble', t('deep') - 0.1, 0.35, 3.6],
    ['tick', t('positive'), 0.3], ['tick', t('negative'), 0.3],
    ['zap', t('creeps'), 0.2], ['zap', t('creeps') + 0.84, 0.2], ['zap', t('creeps') + 1.68, 0.2],
    ['riser', t('a', 3) - 0.1, 0.4, t('now') - t('a', 3) - 0.3],
    ['crack', t('they'), 0.6], ['crack', t('now') - 0.08, 0.9], ['boom', t('now') - 0.06, 0.7],
    ['thunder', t('the', 10) - 0.04, 0.95, 3.5], ['boom', t('the', 10) - 0.04, 0.6],
    ['crack', t('strike', 2), 0.5], ['crack', t('thats', 2), 0.35], ['thunder', t('see', 3) - 0.1, 0.4, 2.5],
]
MUSIC = dict(f=(41.2, 61.74), gain=0.5)
