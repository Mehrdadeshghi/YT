#!/usr/bin/env python3
"""#196 REEL v2 (experiment E8) — Hoover Dam: why it was poured in blocks with cooling pipes. 25 Oct 2026. Voice: gemini.
Hook formula 5 "Time Collapse" (hookscore 84.4 STRONG): "125 years of cooling? You'd never wait that long." / on screen "125 YEARS · CUT TO 2".
Facts: English Wikipedia "Hoover Dam" (Oct 2026), section Construction → Dam:
- First concrete poured June 6, 1933; concrete pouring ceased May 29, 1935 (→ "about two years of pouring").
- "Since concrete heats and contracts as it cures … engineers calculated that if the dam were to be built in a single continuous pour,
  the concrete would take 125 years to cool, and the resulting stresses would cause the dam to crack and crumble."
- Instead: blocks in columns, some as large as 50 ft square and 5 ft high; each five-foot form contained 1-inch steel pipes;
  cool river water poured through the pipes, followed by ice-cold water from a refrigeration plant.
- When a block had cured and stopped contracting, the pipes were filled with grout.
- More than 582 miles (937 km) of cooling pipes were placed within the concrete.
Media: Bureau of Reclamation / NARA photos (public domain), aerial photo CC BY-SA 4.0, drawn graphics labelled GRAPHIC."""
import json
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 196, 'title': 'Why Hoover Dam is full of pipes', 'format': 'reel2', 'hook_formula': '5 Time Collapse',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'epic', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['125 YEARS', 'CUT TO 2'],
 'cta': {'q': 'Would you have thought of the pipes?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Hoover_Dam',
 'vo_open': [V("A hundred and twenty-five years of cooling? You'd never wait that long.", "*125 years* of cooling? You'd never wait that long.",
   'Hundertfünfundzwanzig Jahre Abkühlen? So lange würdest du nie warten.',
   '¿Ciento veinticinco años enfriándose? Nunca esperarías tanto.',
   "Cent vingt-cinq ans de refroidissement ? Tu n'attendrais jamais aussi longtemps.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V('Concrete heats up as it cures. One giant pour would crack.',
    'Concrete *heats up* as it cures. One giant pour would *crack.*',
    'Beton wird beim Aushärten heiß. Ein einziger riesiger Guss würde reißen.',
    'El hormigón se calienta al fraguar. Un solo vertido gigante se agrietaría.',
    "Le béton chauffe en durcissant. Une seule coulée géante se fissurerait.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V('So Hoover Dam was poured in blocks, five feet high. Inside every block: one-inch steel pipes.',
    'So Hoover Dam was poured in *blocks,* *5 feet* high. Inside every block: *1-inch steel pipes.*',
    'Also wurde der Hoover-Damm in Blöcken gegossen, eineinhalb Meter hoch. In jedem Block: zweieinhalb Zentimeter dicke Stahlrohre.',
    'Así que la presa Hoover se vertió en bloques de metro y medio de alto. Dentro de cada bloque: tubos de acero de una pulgada.',
    "Le barrage Hoover a donc été coulé en blocs d'un mètre cinquante de haut. Dans chaque bloc : des tuyaux d'acier de deux centimètres et demi.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('River water ran through them, then ice-cold water from a refrigeration plant. Over five hundred eighty-two miles of pipe, hidden in the concrete.',
    '*River water* ran through them, then *ice-cold water* from a refrigeration plant. Over *582 miles* of pipe, hidden in the concrete.',
    'Erst floss Flusswasser hindurch, dann eiskaltes Wasser aus einer Kühlanlage. Über neunhundertsiebenunddreißig Kilometer Rohre, versteckt im Beton.',
    'Primero pasó agua del río, luego agua helada de una planta de refrigeración. Más de novecientos treinta y siete kilómetros de tubos, ocultos en el hormigón.',
    "D'abord de l'eau du fleuve, puis de l'eau glacée d'une usine frigorifique. Plus de neuf cent trente-sept kilomètres de tuyaux, cachés dans le béton.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V('Once a block stopped shrinking, the pipes were filled with grout. About two years of pouring, not a hundred and twenty-five years of cooling.',
    'Once a block stopped shrinking, the pipes were *filled with grout.* About *2 years* of pouring, not *125 years* of cooling.',
    'Sobald ein Block nicht mehr schrumpfte, wurden die Rohre mit Mörtel verfüllt. Etwa zwei Jahre Gießen statt hundertfünfundzwanzig Jahre Abkühlen.',
    'Cuando un bloque dejaba de encogerse, los tubos se rellenaban con lechada. Unos dos años de vertido, no ciento veinticinco años de enfriamiento.',
    "Dès qu'un bloc cessait de rétrécir, les tuyaux étaient remplis de coulis. Environ deux ans de coulage, au lieu de cent vingt-cinq ans de refroidissement.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [
    V('Would you have thought of the pipes? Yes or no, comment below.', None,
      'Wärst du auf die Rohre gekommen? Ja oder nein, schreib es in die Kommentare.',
      '¿Se te habrían ocurrido los tubos? Sí o no, coméntalo abajo.',
      "Tu aurais pensé aux tuyaux ? Oui ou non, dis-le en commentaire.", cta=True),
    V('Because the other option was a hundred and twenty-five years.', 'Because the other option was *125 years.*',
      'Denn die Alternative waren hundertfünfundzwanzig Jahre.',
      'Porque la otra opción eran ciento veinticinco años.',
      "Parce que l'autre option, c'était cent vingt-cinq ans.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'aerial', 'file': 'File:2017 Aerial view Hoover Dam 4774.jpg'},
  {'id': 'pour', 'file': 'File:Pourdam.jpg'},
  {'id': 'forms', 'file': 'File:Damforms.jpg'},
  {'id': 'colI', 'file': "File:Looking upstream through the 'I' column forms along Arizona side of middle gorge. 'H' columns at right, 'J' columns... - NARA - 293922.jpg"},
  {'id': 'colJ', 'file': "File:Placing concrete in column 'J'-4. Top of forms at elevation 575. View looks toward Arizona side - NARA - 293932.jpg"},
  {'id': 'pipes', 'file': 'File:Downstream Face of Dam (214c06cd-56a3-4893-85ad-4dadcdb036f8).jpg'},
  {'id': 'upstream', 'file': 'File:Damupstream.jpg'},
  {'id': 'cblocks', 'video': 'File:The Story of Hoover Dam.webm', 'from': 579, 'len': 5},
  {'id': 'cbucket', 'video': 'File:The Story of Hoover Dam.webm', 'from': 599, 'len': 7},
  {'id': 'cover', 'video': 'File:The Story of Hoover Dam.webm', 'from': 624, 'len': 5},
 ],
}
open('episodes/196.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
