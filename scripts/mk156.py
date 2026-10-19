#!/usr/bin/env python3
"""#156 DEEP SEA — barreleye remake (experiment E1, 19 Oct 2026): same topic as #146, new execution.
#146 got 1,005 Shorts-feed views but kept only 18 % of viewers at the halfway point (relative retention 0.08) → test a stronger,
surprising first frame ("those aren't its eyes"), 25 s instead of 31 s, one idea per scene, motion on every beat.
Facts: English Wikipedia "Macropinna microstoma" (Oct 2026): the 'eyes' at the front are olfactory organs; real eyes = green lenses
inside a transparent fluid-filled shield; known since 1939, not photographed alive until 2004 (dome destroyed in nets);
2008: eyes rotate up and forward; ~15 cm (6 in); 600–800 m (2,000–2,600 ft)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 156, 'title': "Those aren't its eyes (barreleye)", 'series': 'DEEP SEA', 'experiment': 'E1 barreleye remake (vs #146)',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ["THOSE AREN'T", 'ITS EYES.'],
 'cta': {'q': 'Real or fake?', 'a': 'REAL', 'b': 'FAKE'},
 'source': 'https://en.wikipedia.org/wiki/Macropinna_microstoma',
 'vo_open': [{'at': 0.3, 'text': "Those aren't its eyes. That's its nose.",
   'de': 'Das sind nicht seine Augen. Das ist seine Nase.', 'es': 'Esos no son sus ojos. Es su nariz.', 'fr': "Ce ne sont pas ses yeux. C'est son nez."}],
 'scenes': [
  S(0, 'Its real eyes are the two green domes inside its see-through head.', 'Real eyes: *inside* its *see-through head.*',
    'Seine echten Augen sind die zwei grünen Kuppeln in seinem durchsichtigen Kopf.', 'Sus ojos de verdad son las dos cúpulas verdes dentro de su cabeza transparente.',
    'Ses vrais yeux sont les deux dômes verts dans sa tête transparente.'),
  S(1, 'And they turn: straight up to spot prey, then forward to eat.', 'Eyes turn *up*… then *forward.*',
    'Und sie drehen sich: nach oben, um Beute zu sehen, dann nach vorne zum Fressen.', 'Y giran: hacia arriba para ver presas, luego hacia delante para comer.',
    "Et ils tournent : vers le haut pour repérer une proie, puis vers l'avant pour manger."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text='Scientists knew this fish for sixty-five years before anyone saw it alive. Nets crushed its clear head.',
         cap='*65 years* before anyone saw it *alive.*',
         de='Forscher kannten diesen Fisch fünfundsechzig Jahre, bevor ihn jemand lebend sah. Netze zerdrückten seinen durchsichtigen Kopf.',
         es='Los científicos conocían este pez desde hacía sesenta y cinco años antes de verlo vivo. Las redes aplastaban su cabeza transparente.',
         fr="Les scientifiques connaissaient ce poisson depuis soixante-cinq ans avant de le voir vivant. Les filets écrasaient sa tête transparente."),
    dict(at='0.15', text='Real or fake? Comment!', cta=True, de='Echt oder fake? Schreib es in die Kommentare!', es='¿Real o falso? ¡Comenta!', fr='Vrai ou faux ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.5},
  {'id': 'fish', 'file': 'File:Barreleye-fish GoK.jpg'},
  {'id': 'ill', 'file': 'File:Macropinna microstoma illustration.png'},
  {'id': 'kr', 'file': 'File:Photo 2025-03-12 심해어 통안어 배럴아이.jpg'},
 ],
}
open('episodes/156.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
