// Wiki Roulette #072 — Ocean sunfish (real footage + photos)
VIS.open = vopen({ clip: 'ca', o: { box: [40, 860, 1000, 562] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.05] });
VIS[0] = vscene(0, 6, { ph: 'lead', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], f2: ['300 MILLION', 'EGGS.', 'MORE THAN ANY OTHER VERTEBRATE', 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 6, { ph: 'larva', o: { box: [90, 700, 900, 560] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], badge: 'REAL SPECIMEN · 2.7 MM', f2: ['A LARVA:', 'UNDER 3 MM.', 'IT STARTS THIS SMALL', 0.8] });
VIS[2] = vscene(2, 6, { clip: 'cb', o: { box: [40, 700, 1000, 562] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.05], foot: 'REAL FOOTAGE', f2: ['60 MILLION', 'TIMES HEAVIER.', 'HOW MUCH IT CAN GROW', 0.8] });
VIS[3] = vscene(3, 6, { ph: 'divers', a: [0.55, 0.5, 1.0], b: [0.55, 0.5, 1.1], badge: 'REAL PHOTO · NOAA', f: ['UP TO 1 TONNE', 'FOR ADULTS', 0.8] });
VIS[4] = vscene(4, 6, { ph: 'surface', a: [0.3, 0.5, 1.0], b: [0.28, 0.48, 1.12], badge: 'REAL PHOTO · NOAA', f2: ['IT', 'SUNBATHES.', 'MAYBE TO WARM UP AFTER COLD DIVES', 0.8] });
VIS[5] = vscene(5, 6, { ph: 'caught', a: [0.5, 0.6, 1.0], b: [0.55, 0.62, 1.1], badge: 'REAL PHOTO · A HISTORIC CATCH', f2: ['40+', 'PARASITES.', 'ON IT AND INSIDE IT', 0.8] });
