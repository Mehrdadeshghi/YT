// #221 world: load the font, build every set in order down the shaft, start.
import { EV } from './core.js';
import { hook, june, september } from './desks.js';
import { drain, twist, payoff, ending } from './flow.js';
import { network, hall, chain, SETS_CHAIN } from './net_hall.js';
import { buildOverlay, overlay } from './overlay.js';
import { start } from './main.js';
const f = new FontFace('AB', 'url(assets/fonts/ArchivoBlack.woff2)'); await f.load(); document.fonts.add(f);
const P = { H: [0, 0, 0], J: [0, -30, 0], S: [0, -60, 0], N: [0, -92, 0], L: [0, -128, 0], D: [0, -122, -44], T: [0, -166, -44], R: [0, -210, -44], C: [0, -240, -44] };
hook(P.H); june(P.J); september(P.S);
network(P.N, P.L); hall(P.L);
drain(P.D); twist(P.T); payoff(P.R); ending(P.C);
chain(); window.__chain = SETS_CHAIN;
buildOverlay(); window.__overlay = overlay;
start();
