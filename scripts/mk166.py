#!/usr/bin/env python3
"""#166 DEEP SEA — yeti crab (Kiwa), 20 Oct 2026. Ocean track; 25–30 s; frame-1 contradiction ("grows its own food — on its arms").
Facts: English Wikipedia "Kiwa hirsuta" + "Kiwa (crustacean)" (Oct 2026): K. hirsuta discovered March 2005 on hydrothermal vents of the
Pacific-Antarctic Ridge, south of Easter Island, 2,200 m (7,200 ft) deep; ~15 cm (5.9 in); setae (hair) on the legs/claws carry bacteria;
epibiotic bacteria are the main food source; K. puravida waves its claws ("dancing crab") to stir water so the bacteria get enough chemicals
("by growing their own food"); eyes strongly reduced, no pigment, thought to be blind."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 166, 'title': 'This crab grows its own food (yeti crab)', 'series': 'DEEP SEA',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['IT GROWS ITS FOOD', 'ON ITS ARMS.'],
 'cta': {'q': 'Cool or gross?', 'a': 'COOL', 'b': 'GROSS'},
 'source': 'https://en.wikipedia.org/wiki/Kiwa_hirsuta',
 'vo_open': [{'at': 0.3, 'text': 'This crab grows its own food. On its arms.',
   'de': 'Diese Krabbe züchtet ihr eigenes Essen. Auf ihren Armen.', 'es': 'Este cangrejo cultiva su propia comida. En sus brazos.',
   'fr': 'Ce crabe cultive sa propre nourriture. Sur ses bras.'}],
 'scenes': [
  S(0, 'Meet the yeti crab. Found in two thousand five, seventy-two hundred feet down, on hot vents in the South Pacific.',
    'The *yeti crab.* Found in 2005, *7,200 ft* down.',
    'Das ist die Yeti-Krabbe. Entdeckt zweitausendfünf, zweitausendzweihundert Meter tief, an heißen Quellen im Südpazifik.',
    'Este es el cangrejo yeti. Descubierto en dos mil cinco, a dos mil doscientos metros, junto a fuentes calientes del Pacífico Sur.',
    "Voici le crabe yéti. Découvert en deux mille cinq, à deux mille deux cents mètres, près de sources chaudes du Pacifique Sud."),
  S(1, 'Those hairy arms are covered in bacteria. And the bacteria are its main food.', 'Hairy arms full of *bacteria* = its *main food.*',
    'Diese haarigen Arme sind voller Bakterien. Und die Bakterien sind ihr Hauptessen.',
    'Esos brazos peludos están cubiertos de bacterias. Y esas bacterias son su comida principal.',
    'Ces bras poilus sont couverts de bactéries. Et ces bactéries sont sa nourriture principale.'),
  S(2, 'Some yeti crabs even dance. They wave their claws to bring chemicals to the bacteria.', 'Some even *dance* to feed their *farm.*',
    'Manche Yeti-Krabben tanzen sogar. Sie wedeln mit den Scheren, damit die Bakterien Chemikalien bekommen.',
    'Algunos cangrejos yeti hasta bailan. Mueven las pinzas para llevar sustancias químicas a las bacterias.',
    'Certains crabes yéti dansent même. Ils agitent leurs pinces pour apporter des substances chimiques aux bactéries.'),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="Oh, and it's probably blind.", cap="And it's probably *blind.*",
         de='Ach ja, und sie ist wahrscheinlich blind.', es='Ah, y probablemente es ciego.', fr='Ah, et il est sans doute aveugle.'),
    dict(at='0.15', text='Food growing on your arms. Cool or gross? Comment!', cta=True,
         de='Essen, das auf deinen Armen wächst. Cool oder eklig? Schreib es in die Kommentare!',
         es='Comida que crece en tus brazos. ¿Genial o asqueroso? ¡Comenta!', fr='De la nourriture qui pousse sur tes bras. Cool ou dégoûtant ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 50, 'len': 60, 'gain': 0.5},
  {'id': 'yeti', 'file': 'File:Galathée yéti, un habitant des profondeurs abyssales (Ifremer 00569-68091 - 34595).jpg'},
  {'id': 'yeti2', 'file': 'File:Galathée yéti, un habitant des profondeurs abyssales (Ifremer 00569-68091 - 25272).jpg'},
  {'id': 'yeti3', 'file': 'File:Galathée yéti, un habitant des profondeurs abyssales (Ifremer 00569-68091 - 34593).jpg'},
  {'id': 'yeti4', 'file': 'File:Galathée yéti, un habitant des profondeurs abyssales (Ifremer 00569-68091 - 34594).jpg'},
  {'id': 'smoker', 'file': 'File:Blacksmoker in Atlantic Ocean.jpg'},
  {'id': 'dance', 'video': 'File:Dancing-for-Food-in-the-Deep-Sea-Bacterial-Farming-by-a-New-Species-of-Yeti-Crab-pone.0026243.s001.ogv', 'from': 0, 'len': 11},
 ],
}
open('episodes/166.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
