// Wiki Roulette #075 — Hydrothermal vents / black smokers (real NOAA + Ifremer footage + photos)
VIS.open = vopen({ clip: 'ca', a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.08] });
VIS[0] = vscene(0, 5, { ph: 'lead', a: [0.5, 0.45, 1.0], b: [0.5, 0.4, 1.12], badge: 'REAL PHOTO · ATLANTIC OCEAN', f2: ['UP TO', '464 °C.', 'BLACK SMOKER WATER', 0.8], k: [[0.8, 'hit', 1.2], [0.85, 'crack', 0.6]] });
VIS[1] = vscene(1, 5, { clip: 'cb', a: [0.4, 0.45, 1.0], b: [0.4, 0.45, 1.08], foot: 'REAL FOOTAGE · IFREMER', f2: ['IT CAN NOT', 'BOIL.', 'THE PRESSURE IS TOO HIGH', 0.8] });
VIS[2] = vscene(2, 5, { ph: 'chimney', a: [0.5, 0.5, 1.0], b: [0.5, 0.45, 1.1], badge: 'REAL PHOTO · NOAA · A 38 M CHIMNEY', f2: ['GODZILLA:', '40 M TALL.', 'UNTIL IT FELL OVER IN 1996', 0.8] });
VIS[3] = vscene(3, 5, { ph: 'riftia', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], badge: 'REAL PHOTO · NOAA · GALÁPAGOS', f2: ['TUBE WORMS:', '2+ METRES.', 'NO MOUTH. NO GUT. BACTERIA FEED THEM.', 0.8] });
VIS[4] = vscene(4, 5, { clip: 'cf', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], foot: 'REAL FOOTAGE · NOAA · MARIANAS', f2: ['DID LIFE', 'START HERE?', 'SOME SCIENTISTS THINK SO', 0.8] });
