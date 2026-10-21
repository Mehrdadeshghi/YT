#!/usr/bin/env python3
"""#178 OCEAN — leafy seadragon (Phycodurus eques), 21 Oct 2026. Ocean track; 25–28 s; frame-1 contradiction ("This is not seaweed.").
Facts: English Wikipedia "Leafy seadragon" (Oct 2026): a marine fish in the family Syngnathidae with seahorses and pipefish; leaf-like
protrusions of skin all over the body serve only as camouflage, not for propulsion; it moves with a pair of pectoral fins on the neck and a
dorsal fin near the tail, almost completely transparent, completing the illusion of floating seaweed; as with seahorses, the male cares for
the eggs: the female produces up to 250 bright pink eggs and deposits them onto the male's tail; after 9 weeks the eggs begin to hatch;
only about 5% of the eggs survive; grows to about 8–9.5 in; found only along the southern and western coasts of Australia."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 178, 'title': 'This is not seaweed (leafy seadragon)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THIS IS NOT', 'SEAWEED.'],
 'cta': {'q': 'Could you have spotted it?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Leafy_seadragon',
 'vo_open': [{'at': 0.3, 'text': 'This is not seaweed. Look again.',
   'de': 'Das ist kein Seetang. Schau noch mal hin.', 'es': 'Esto no son algas. Mira otra vez.', 'fr': "Ce ne sont pas des algues. Regarde encore."}],
 'scenes': [
  S(0, "Fish. A leafy seadragon, cousin of the seahorse. Those leaves are skin, grown only for camouflage.",
    'A *leafy seadragon.* The leaves? *Skin.*',
    'Ein Fisch. Ein Großer Fetzenfisch, ein Verwandter des Seepferdchens. Die Blätter sind Haut, nur zur Tarnung.',
    'Un pez. Un dragón de mar foliáceo, primo del caballito de mar. Esas hojas son piel, solo para camuflarse.',
    "Un poisson. Un dragon de mer feuillu, cousin de l'hippocampe. Ces feuilles sont de la peau, juste pour se camoufler."),
  S(1, 'Tiny fins, almost completely see-through, push it along. So it drifts just like floating seaweed.',
    'Fins *almost invisible.* It *drifts* like seaweed.',
    'Winzige, fast durchsichtige Flossen schieben ihn an. So treibt er wie ein Stück Seetang.',
    'Unas aletas diminutas, casi transparentes, lo empujan. Así flota igual que un alga.',
    "De minuscules nageoires presque transparentes le poussent. Il dérive comme une algue."),
  S(2, 'Dads carry the eggs. Mom lays up to two hundred fifty bright pink eggs right onto his tail.',
    'Up to *250 pink eggs.* On *dad\'s tail.*',
    'Die Väter tragen die Eier. Das Weibchen legt bis zu zweihundertfünfzig leuchtend rosa Eier direkt auf seinen Schwanz.',
    'Los padres llevan los huevos. La hembra pone hasta doscientos cincuenta huevos rosa brillante sobre su cola.',
    "Ce sont les pères qui portent les œufs. La femelle pond jusqu'à deux cent cinquante œufs rose vif sur sa queue."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Nine weeks later, they hatch. Only about five percent of the eggs survive.',
         cap='Only about *5 %* survive.',
         de='Neun Wochen später schlüpfen sie. Nur etwa fünf Prozent der Eier überleben.',
         es='Nueve semanas después, eclosionan. Solo sobrevive un cinco por ciento de los huevos.',
         fr="Neuf semaines plus tard, ils éclosent. Seuls cinq pour cent des œufs survivent."),
    dict(at='0.15', text='Could you have spotted it? Yes or no? Comment!', cta=True,
         de='Hättest du ihn entdeckt? Ja oder nein? Schreib es in die Kommentare!', es='¿Lo habrías visto? ¿Sí o no? ¡Comenta!',
         fr="Tu l'aurais repéré ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'hide', 'file': 'File:Phycodurus eques P2023146 (cropped).JPG'},
  {'id': 'leafy', 'file': 'File:Leafy Seadragon on Kangaroo Island.jpg'},
  {'id': 'reef', 'file': 'File:Phycodurus eques P2023150.JPG'},
  {'id': 'swim', 'video': 'File:Leafy seadragon (Phycodurus eques) eating.webm', 'from': 59, 'len': 7},
 ],
}
open('episodes/178.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
