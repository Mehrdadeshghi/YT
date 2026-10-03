// Wiki Roulette #071 — Giant isopod (real NOAA footage + photos)
VIS.open = vopen({ clip: 'cb', a: [0.55, 0.5, 1.0], b: [0.55, 0.5, 1.08] });
VIS[0] = vscene(0, 5, { ph: 'lead', a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.12], badge: 'REAL SPECIMEN', f2: ['5+ YEARS', 'NO FOOD.', 'SURVIVED IN CAPTIVITY', 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 5, { clip: 'ca', a: [0.6, 0.55, 1.4], b: [0.6, 0.55, 1.5], foot: 'REAL FOOTAGE · NOAA · 816 M DEEP', f2: ['FILMED', '816 M DOWN.', 'BY A ROBOT SUB · GULF OF MEXICO', 0.8] });
VIS[2] = vscene(2, 5, { clip: 'cc', a: [0.5, 0.5, 1.0], b: [0.48, 0.5, 1.1], foot: 'REAL FOOTAGE · NOAA', f2: ['IT EATS', 'DEAD WHALES.', 'DOWN TO 2,140 M', 0.8] });
VIS[3] = vscene(3, 5, { ph: 'hand', a: [0.5, 0.4, 1.0], b: [0.5, 0.37, 1.1], badge: 'REAL PHOTO · VIETNAM', ring: [0.5, 0.37, 0.2, 1.2], f: ['UP TO 50 CM', 'THE LARGEST CONFIRMED', 0.8] });
VIS[4] = vscene(4, 5, { ph: 'face', a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.15], badge: 'REAL PHOTO · AQUARIUM', f2: ['4,000', 'FACETS.', 'PER EYE · A COUSIN OF THE WOODLOUSE', 0.8] });
