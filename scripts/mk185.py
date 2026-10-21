#!/usr/bin/env python3
"""#185 OCEAN — Portuguese man o' war, 22 Oct 2026. Ocean track; ~30 s; frame-1 contradiction ("not a jellyfish, not even one animal").
Facts: English Wikipedia "Portuguese man o' war" (Oct 2026)
- resembles a jellyfish but is a siphonophore, a colonial organism made of zooids; all zooids develop from the same single fertilized
  egg and are genetically identical; zooids specialise in hunting (dactylozooids), digestion (gastrozooids), reproduction (gonozooids).
- the pneumatophore (gas float) works as flotation device and sail; over 12 in (30 cm) long; gas is mostly air but contains
  as much as 13% carbon monoxide, actively produced by the animal.
- tentacles typically about 10 m (30 ft), can reach over 30 m (100 ft).
- left- and right-handed floats sail to opposite sides of the wind, "so at most half the population will be pushed towards the coast".
- detached tentacles and dead specimens (including washed-up ones) sting just as painfully and may stay potent for hours or even days.
Not in the article → not in the VO: US beach locations (only the Boca Raton photo caption names Florida, shown as photo label)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 185, 'title': 'Not a jellyfish', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['NOT A JELLYFISH.', 'NOT ONE ANIMAL.'],
 'cta': {'q': 'Ever seen one on a beach?', 'a': 'YES', 'b': 'NO'},
 'source': "https://en.wikipedia.org/wiki/Portuguese_man_o%27_war",
 'vo_open': [{'at': 0.3, 'text': "This is not a jellyfish. It's not even one animal.",
   'de': 'Das ist keine Qualle. Es ist nicht mal ein einzelnes Tier.', 'es': 'Esto no es una medusa. Ni siquiera es un solo animal.',
   'fr': "Ce n'est pas une méduse. Ce n'est même pas un seul animal."}],
 'scenes': [
  S(0, 'A colony of tiny clones, all from one single egg. Some only hunt, some only eat, some only breed.',
    'A *colony* of clones, from *one egg.* Some *hunt*, some *eat*, some *breed.*',
    'Eine Kolonie aus winzigen Klonen, alle aus einem einzigen Ei. Manche jagen nur, manche fressen nur, manche pflanzen sich nur fort.',
    'Una colonia de diminutos clones, todos de un solo huevo. Unos solo cazan, otros solo comen, otros solo se reproducen.',
    "Une colonie de minuscules clones, tous issus d'un seul œuf. Certains ne font que chasser, d'autres que manger, d'autres que se reproduire."),
  S(1, 'The float on top is also its sail. Up to thirteen percent of the gas inside is carbon monoxide.',
    'The float is a *sail.* Up to *13%* of its gas: *carbon monoxide.*',
    'Die Blase oben ist gleichzeitig sein Segel. Bis zu dreizehn Prozent des Gases darin sind Kohlenmonoxid.',
    'El flotador de arriba también es su vela. Hasta el trece por ciento del gas de dentro es monóxido de carbono.',
    "Le flotteur du dessus est aussi sa voile. Jusqu'à treize pour cent du gaz à l'intérieur, c'est du monoxyde de carbone."),
  S(2, 'Tentacles below: usually thirty feet long. Some reach over a hundred.',
    'Tentacles: usually *30 feet.* Some over *100 feet.*',
    'Die Tentakel darunter: meist rund zehn Meter lang. Manche über dreißig Meter.',
    'Los tentáculos de abajo: normalmente unos diez metros. Algunos, más de treinta.',
    'Les tentacules en dessous : en général une dizaine de mètres. Certains, plus de trente.'),
  S(3, 'Some floats lean left, some lean right. So the wind can blow at most half of them ashore.',
    'Some lean *left*, some lean *right.* The wind blows at most *half* ashore.',
    'Manche Segel neigen sich nach links, manche nach rechts. So kann der Wind höchstens die Hälfte an Land treiben.',
    'Unas velas se inclinan a la izquierda, otras a la derecha. Así el viento solo puede llevar a la orilla a la mitad, como mucho.',
    "Certaines voiles penchent à gauche, d'autres à droite. Le vent ne peut donc pousser au plus que la moitié vers la côte."),
  {'dur': 1.6, 'vis': 4, 'vo': [
    dict(at=0.45, text='Washed up and dead, it can still sting. For hours, even days.',
         cap='Dead on the beach, it can *still sting.* For *hours*, even *days.*',
         de='Angespült und tot kann es immer noch nesseln. Stundenlang, sogar tagelang.',
         es='Varado y muerto, todavía puede picar. Durante horas, incluso días.',
         fr="Échoué et mort, il peut encore piquer. Pendant des heures, voire des jours."),
    dict(at='0.15', text='Ever seen one on a beach? Yes or no? Comment!', cta=True,
         de='Schon mal eins am Strand gesehen? Ja oder nein? Ab in die Kommentare!',
         es='¿Alguna vez has visto una en la playa? ¿Sí o no? ¡Comenta!', fr='Tu en as déjà vu une sur la plage ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 70, 'len': 60, 'gain': 0.5},
  {'id': 'float', 'file': 'File:Portuguese Man-O-War (Physalia physalis).jpg'},
  {'id': 'close', 'file': 'File:Physalia physalis close up.jpg'},
  {'id': 'side', 'file': 'File:Portuguese man-o-war Physalia sp.png'},
  {'id': 'canary', 'file': 'File:Physalia physalis EM1B0679 (40827501481).jpg'},
  {'id': 'beach', 'file': 'File:Physalia physalis Boca Raton FL.JPG'},
 ],
}
open('episodes/185.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
