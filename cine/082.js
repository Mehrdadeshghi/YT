// Wiki Roulette #082 — Jupiter's Great Red Spot (real Juno/Voyager footage + NASA photos)
VIS.open = vopen({ clip: 'ca', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], foot: 'REAL FOOTAGE · NASA JUNO' });
VIS[0] = vscene(0, 5, { ph: 'earth', a: [0.3, 0.62, 1.0], b: [0.28, 0.64, 1.08], badge: 'TO SCALE · NASA', ring: [0.16, 0.78, 0.07, 1.2], co: [[0.16, 0.84, 540, 1150, 'EARTH', 1.8]], f2: ['WIDER THAN', 'EARTH.', null, 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 5, { clip: 'cb', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], foot: 'REAL FOOTAGE · NASA JUNO', f: ['496 KM/H', 'ITS WINDS', 0.8] });
VIS[2] = vscene(2, 5, { ph: 'voy', a: [0.5, 0.5, 1.0], b: [0.55, 0.55, 1.12], badge: 'REAL PHOTO · VOYAGER 1 · 1979', f2: ['RAGING', 'SINCE 1831.', 'AT LEAST', 0.8] });
VIS[3] = vscene(3, 5, { ph: 'evo', o: { box: [40, 640, 1000, 760] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06], badge: 'REAL PHOTOS · HUBBLE', f2: ['IT\'S', 'SHRINKING.', 'FROM 3 EARTHS WIDE TO 1.3', 0.8] });
VIS[4] = vscene(4, 5, { ph: 'lead', a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.15], badge: 'REAL PHOTO · NASA JUNO', f2: ['WHY RED?', 'NOBODY KNOWS.', null, 0.8] });
