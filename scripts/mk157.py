#!/usr/bin/env python3
"""#157 DEEP SEA — sea pig (Scotoplanes), 20 Oct 2026. Ocean track; 25–28 s; frame-1 surprise ("breathes through its butt").
Facts: English Wikipedia "Scotoplanes" (Oct 2026): sea cucumbers (Elpidiidae), 4–6 in long; gas exchange through the anus;
leg-like tube feet inflated/deflated with water (hydraulic); shelter juvenile crabs (Neolithodes diomedeae), reducing their predation risk;
groups of 300–600 recorded; 1,200–5,000 m (3,900–16,400 ft); brought too close to the surface they disintegrate."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 157, 'title': 'It breathes through its butt (sea pig)', 'series': 'DEEP SEA',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['IT BREATHES', 'THROUGH ITS BUTT.'],
 'cta': {'q': 'Cute or gross?', 'a': 'CUTE', 'b': 'GROSS'},
 'source': 'https://en.wikipedia.org/wiki/Scotoplanes',
 'vo_open': [{'at': 0.3, 'text': 'This animal breathes through its butt.',
   'de': 'Dieses Tier atmet durch seinen Hintern.', 'es': 'Este animal respira por el trasero.', 'fr': 'Cet animal respire par les fesses.'}],
 'scenes': [
  S(0, "Meet the sea pig. It's a sea cucumber, four to six inches long, and it walks on legs it pumps full of water.",
    'A *sea cucumber* that walks on *water-pumped legs.*',
    'Das ist das Seeschwein. Eine Seegurke, zehn bis fünfzehn Zentimeter lang, und sie läuft auf Beinen, die sie mit Wasser aufpumpt.',
    'Este es el cerdo marino. Un pepino de mar de diez a quince centímetros que camina sobre patas que llena de agua.',
    "Voici le cochon de mer. Un concombre de mer de dix à quinze centimètres, qui marche sur des pattes gonflées d'eau."),
  S(1, 'Baby crabs hide underneath it, to stay safe from predators.', 'Baby crabs *hide underneath it.*',
    'Baby-Krabben verstecken sich darunter, um vor Räubern sicher zu sein.', 'Los cangrejos bebé se esconden debajo, a salvo de los depredadores.',
    "Des bébés crabes se cachent dessous, à l'abri des prédateurs."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text='Herds of up to six hundred live as deep as sixteen thousand four hundred feet. Bring one up to the surface, and it falls apart.',
         cap='Up to *16,400 ft* deep. At the surface it *falls apart.*',
         de='Herden von bis zu sechshundert Tieren leben bis zu fünftausend Meter tief. Holt man eins an die Oberfläche, zerfällt es.',
         es='Manadas de hasta seiscientos viven hasta a cinco mil metros de profundidad. Si subes uno a la superficie, se deshace.',
         fr="Des troupeaux de six cents vivent jusqu'à cinq mille mètres de fond. Remonté à la surface, il se désagrège."),
    dict(at='0.15', text='Cute or gross? Comment!', cta=True, de='Süß oder eklig? Schreib es in die Kommentare!', es='¿Tierno o asqueroso? ¡Comenta!', fr='Mignon ou dégoûtant ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 20, 'len': 60, 'gain': 0.5},
  {'id': 'pig', 'file': 'File:Scotoplanes globosa.jpg'},
  {'id': 'pig1', 'file': 'File:Scotoplanes globosa1.jpg'},
  {'id': 'crab', 'file': 'File:Scotoplanes globosa and crab (cropped).jpg'},
  {'id': 'feet', 'file': 'File:Scotoplanes Tube Feet.jpg'},
  {'id': 'elp', 'file': 'File:Unidentified Elasipodida.jpg'},
 ],
}
open('episodes/157.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
