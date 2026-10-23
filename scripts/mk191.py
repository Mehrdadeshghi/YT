#!/usr/bin/env python3
"""#191 WHY? — Why do you never see baby pigeons? 24 Oct 2026. Template #186 (cine/why.js), voice: gemini.
Facts: English Wikipedia (Oct 2026)
- "Rock dove": estimated population up to 120 million worldwide; wild rock doves settle in crevices of cliff faces to nest;
  the nest is a flimsy platform laid on a ledge, under cover; skyscrapers, highway overpasses … with ample crevices are
  conducive to nesting; squabs fed on crop milk; pigeon milk is produced in the crops of both parents; fledging period about 30 days.
- "Columbidae": squabs leave the nest after 25–32 days.
- "Crop milk": body weight doubling within the first two days after birth.
- "Squab (food)": squabs must be brooded and fed by both parents until four weeks old; squabs reach adult size, but are not yet
  ready to fly, after roughly a month."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 191, 'title': 'Why do you never see baby pigeons?', 'series': 'WHY? #6',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['NEVER SEE', 'BABY PIGEONS?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY NO', 'BABY PIGEONS?'],
 'cta': {'q': 'Ever seen a baby pigeon?', 'a': 'YES', 'b': 'NEVER'},
 'source': 'https://en.wikipedia.org/wiki/Rock_dove',
 'vo_open': [{'at': 0.3, 'text': 'There are up to a hundred and twenty million pigeons. Ever seen a baby one? Why not?',
   'de': 'Es gibt bis zu hundertzwanzig Millionen Tauben. Schon mal ein Taubenbaby gesehen? Warum nicht?',
   'es': 'Hay hasta ciento veinte millones de palomas. ¿Alguna vez viste una cría? ¿Por qué no?',
   'fr': "Il y a jusqu'à cent vingt millions de pigeons. Déjà vu un bébé pigeon ? Pourquoi pas ?"}],
 'scenes': [
  S(0, 'Reason one: hidden nests. Pigeons nest in cracks and on ledges, under cover: on cliffs, under overpasses, on skyscrapers.',
    'Reason one: *hidden nests.* In *cracks* and on *ledges,* under *cover.*',
    'Grund eins: versteckte Nester. Tauben nisten in Spalten und auf Vorsprüngen, gut geschützt: an Klippen, unter Brücken, an Hochhäusern.',
    'Razón uno: nidos ocultos. Las palomas anidan en grietas y salientes, a cubierto: en acantilados, bajo puentes, en rascacielos.',
    "Raison numéro un : des nids cachés. Les pigeons nichent dans des fissures et sur des corniches, à l'abri : falaises, dessous de ponts, gratte-ciel."),
  S(1, 'Reason two: the babies stay home for about a month. Both parents feed them pigeon milk, and their weight doubles in two days.',
    'Reason two: they stay home *about a month.* *Pigeon milk.* Weight *doubles in 2 days.*',
    'Grund zwei: Die Babys bleiben etwa einen Monat im Nest. Beide Eltern füttern sie mit Taubenmilch, und ihr Gewicht verdoppelt sich in zwei Tagen.',
    'Razón dos: las crías se quedan en el nido casi un mes. Los dos padres les dan leche de paloma, y su peso se duplica en dos días.',
    "Raison numéro deux : les bébés restent au nid environ un mois. Les deux parents les nourrissent de lait de pigeon, et leur poids double en deux jours."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text="Reason three: when they finally leave, they're already adult-sized. So you have seen baby pigeons. You just couldn't tell.",
         cap="Reason three: they leave *adult-sized.* You *have* seen them. You just *couldn't tell.*",
         de='Grund drei: Wenn sie endlich ausfliegen, sind sie schon so groß wie Erwachsene. Du hast also schon Taubenbabys gesehen. Du hast es nur nicht gemerkt.',
         es='Razón tres: cuando por fin salen, ya tienen tamaño de adulto. Así que sí has visto crías de paloma. Solo que no lo notaste.',
         fr="Raison numéro trois : quand ils sortent enfin, ils ont déjà la taille d'un adulte. Donc tu as déjà vu des bébés pigeons. Tu ne l'as juste pas remarqué."),
    dict(at='0.15', text='Ever seen a baby pigeon? Tell us below, and send us your next why.', cta=True,
         de='Schon mal ein Taubenbaby gesehen? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Alguna vez viste una cría de paloma? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Déjà vu un bébé pigeon ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'flock', 'file': 'File:Feral Pigeons at Stoke Newington Brooke Road.JPG'},
  {'id': 'adult', 'file': 'File:Pigeon portrait 4861.jpg'},
  {'id': 'squab', 'file': 'File:Pigeon baby in nest.jpg'},
  {'id': 'squab2', 'file': 'File:Baby Pigeon in Mymensingh, Bangladesh.jpg'},
  {'id': 'sclip', 'video': 'File:Few hours old squab.ogg', 'from': 0, 'len': 12},
  {'id': 'kid5', 'file': 'File:Stadttaube kueken.jpeg'},
  {'id': 'd18', 'file': 'File:Rock dove 18 days old in its nest and one egg.jpg'},
  {'id': 'd20', 'file': 'File:Pigeon Chicks2 2am.jpg'},
  {'id': 'feed', 'file': 'File:Feral Pigeon feeding squabs, Lithuania.jpg'},
  {'id': 'crevice', 'file': 'File:Feral pigeon on cliffside at Berry Head, Devon 2.jpg'},
  {'id': 'overpass', 'file': 'File:Pigeons under overpass (29328368381).jpg'},
  {'id': 'nyc2', 'file': 'File:Air conditioner cage with pigeon nest in Manhattan 03.jpg'},
  {'id': 'juv', 'file': 'File:Rock pigeon juvenile bob kerrey pedestrian bridge DSC 4822.jpg'},
  {'id': 'juv2', 'file': 'File:Rock pigeon juvenile bob kerrey pedestrian bridge DSC 4841.jpg'},
  {'id': 'mex', 'file': 'File:PigeonMexicoCity06.JPG'},
  {'id': 'fledg', 'file': 'File:Feral pigeon, fledgeling, Soyaux, Nouvelle-Aquitaine, France 2024.jpg'},
 ],
}
open('episodes/191.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
