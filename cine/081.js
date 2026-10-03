// Wiki Roulette #081 — Carrington Event (real NASA/NOAA-era footage of modern storms + 1859 documents)
VIS.open = vopen({ clip: 'ca', a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], foot: 'REAL FOOTAGE · NASA SDO · 2024 FLARE' });
VIS[0] = vscene(0, 6, { ph: 'lead', o: { box: [40, 700, 1000, 650] }, a: [0.55, 0.5, 1.0], b: [0.55, 0.5, 1.1], badge: "CARRINGTON'S OWN DRAWING · 1859", f2: ['SEPT 1,', '1859.', 'A GIANT FLARE ON THE SUN', 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 6, { clip: 'cb', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], foot: 'REAL FOOTAGE · NASA SDO · THE SUN TODAY', f2: ['EARTH HIT IN', '17.6 HOURS.', null, 0.8] });
VIS[2] = vscene(2, 6, { clip: 'cc', a: [0.5, 0.62, 1.3], b: [0.5, 0.62, 1.36], foot: 'REAL FOOTAGE · AURORA OVER CHILE · 2024', f2: ['AURORAS OVER', 'CUBA & COLOMBIA.', 'AND HAWAII', 0.8] });
VIS[3] = vscene(3, 6, { ph: 'nyt', o: { box: [40, 700, 1000, 600] }, a: [0.5, 0.06, 1.0], b: [0.5, 0.08, 1.1], badge: 'THE NEW YORK TIMES · 1859', f2: ['TELEGRAPHS', 'SPARKED.', 'OPERATORS GOT SHOCKS', 0.8], k: [[0.8, 'crack', 1], [0.85, 'hit', 1]] });
VIS[4] = vscene(4, 6, { clip: 'cd', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], foot: 'REAL FOOTAGE · AURORA FROM THE ISS', f2: ['2 HOURS ON', 'AURORA POWER.', 'BATTERIES UNPLUGGED', 0.8] });
VIS[5] = vscene(5, 6, { clip: 'ce', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], foot: 'REAL FOOTAGE · AURORA FROM THE ISS', f: ['$2.6 TRILLION', 'POSSIBLE US LOSS IF IT HIT TODAY', 0.8] });
