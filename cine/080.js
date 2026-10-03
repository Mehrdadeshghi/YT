// Wiki Roulette #080 — Naked mole-rat (real zoo footage + photos)
VIS.open = vopen({ clip: 'ca', a: [0.35, 0.6, 1.2], b: [0.35, 0.6, 1.3] });
VIS[0] = vscene(0, 6, { ph: 'lead', a: [0.55, 0.45, 1.0], b: [0.6, 0.4, 1.12], f2: ['37+ YEARS.', 'A RODENT.', 'LONGER THAN ANY OTHER RODENT', 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 6, { clip: 'cb', a: [0.35, 0.6, 1.2], b: [0.35, 0.6, 1.3], foot: 'REAL FOOTAGE · ZOO', f2: ['AGE DOESN\'T', 'RAISE ITS RISK.', 'OF DYING', 0.8] });
VIS[2] = vscene(2, 6, { ph: 'eat', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], f2: ['HIGHLY', 'CANCER-RESISTANT.', null, 0.8] });
VIS[3] = vscene(3, 6, { clip: 'cc', a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.06], foot: 'REAL FOOTAGE · ZOO DRESDEN', f2: ['NO PAIN', 'FROM ACID.', 'OR FROM CHILI', 0.8] });
VIS[4] = vscene(4, 6, { clip: 'cd', a: [0.35, 0.5, 1.1], b: [0.35, 0.5, 1.2], foot: 'REAL FOOTAGE · ITS TUNNELS', f2: ['18 MINUTES.', 'ZERO OXYGEN.', 'AND UNHARMED', 0.8], pre: (t) => { g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(0, 0, W, H); } });
VIS[5] = vscene(5, 6, { ph: 'model', a: [0.5, 0.5, 1.0], b: [0.5, 0.55, 1.1], badge: 'MUSEUM MODEL · A COLONY', f2: ['ONE QUEEN.', 'LIKE ANTS.', 'COLONIES CAN TOP 300', 0.8] });
