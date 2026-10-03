// Wiki Roulette #083 — Venus flytrap (real footage + photos)
VIS.open = vopen({ clip: 'cb', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] });
VIS[0] = vscene(0, 5, { ph: 'lead', a: [0.5, 0.5, 1.0], b: [0.5, 0.48, 1.2], ring: [0.5, 0.5, 0.15, 1.4], co: [[0.5, 0.6, 540, 1150, 'TRIGGER HAIRS INSIDE', 2.0]], f2: ['2 TOUCHES.', '20 SECONDS.', null, 0.8], k: [[0.8, 'hit', 1.2]] });
VIS[1] = vscene(1, 5, { clip: 'cd', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], foot: 'REAL FOOTAGE', f: ['0.1 SECONDS', 'TO SNAP SHUT', 0.8], k: [[0.8, 'crack', 1], [0.82, 'hit', 1.2]] });
VIS[2] = vscene(2, 5, { clip: 'cc', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], foot: 'REAL FOOTAGE · A FLY INSIDE', f2: ['5 MORE', 'TOUCHES.', 'THEN IT STARTS DIGESTING', 0.8] });
VIS[3] = vscene(3, 5, { ph: 'fly', a: [0.5, 0.5, 1.0], b: [0.48, 0.48, 1.15], badge: 'REAL PHOTO · A TRAPPED FLY', f: ['10 DAYS', 'TO DIGEST', 0.8] });
VIS[4] = vscene(4, 5, { ph: 'brno', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO', f2: ['WILD ONLY', 'IN THE CAROLINAS.', '~100 KM AROUND WILMINGTON', 0.8] });
