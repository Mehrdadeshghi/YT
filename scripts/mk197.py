#!/usr/bin/env python3
"""#197 REEL v2 (experiment E8) — Sperm whale: the loudest animal on Earth hunts by sound. 25 Oct 2026. Voice: gemini.
(Planned topic "mantis shrimp punch" was already covered as #160 → replaced by the sperm whale, same Deep Sea playlist.)
Hook formula 26 "The Superlative" (hookscore 84.4 STRONG): "236 decibels. You've never heard this animal." / on screen "236 DECIBELS · LOUDEST ANIMAL".
Facts: English Wikipedia "Sperm whale" (Oct 2026):
- vocalization source level as loud as 236 decibels (re 1 µPa m) underwater, the loudest of any animal.
- plunging to 2,250 metres (7,380 ft); dives as much as 2,250 m for up to 120 minutes.
- head up to one-third of the animal's length; spermaceti organ (fats and waxes) generates powerful, focused clicks for echolocation.
- "The lower jaw is the primary reception path for the echoes."
- air passing the phonic lips is recycled, which "allows the whale to continuously generate clicks for as long as it is submerged".
- "Tagging studies have shown that sperm whales hunt upside down at the bottom of their deep dives."
- feeds notably on the giant squid, but mainly medium-sized squid; skin with giant squid sucker scars (article photo).
Media: Commons photos (CC0 / PD / CC BY / CC BY-SA), real footage (eye retraction, CC BY-SA 3.0), drawn graphics labelled GRAPHIC."""
import json
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 197, 'title': 'The loudest animal on Earth', 'format': 'reel2', 'hook_formula': '26 The Superlative',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['236 DECIBELS', 'LOUDEST ANIMAL'],
 'cta': {'q': 'Would you swim next to one?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Sperm_whale',
 'vo_open': [V("Two hundred thirty-six decibels. You've never heard this animal.", "*236 decibels.* You've never heard this animal.",
   'Zweihundertsechsunddreißig Dezibel. Dieses Tier hast du noch nie gehört.',
   'Doscientos treinta y seis decibelios. Nunca has oído a este animal.',
   "Deux cent trente-six décibels. Tu n'as jamais entendu cet animal.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V("It's the sperm whale, and it hunts in total darkness.",
    "It's the *sperm whale,* and it hunts in *total darkness.*",
    'Es ist der Pottwal, und er jagt in völliger Dunkelheit.',
    'Es el cachalote, y caza en la oscuridad total.',
    "C'est le cachalot, et il chasse dans le noir total.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V('It dives up to seven thousand three hundred eighty feet, for up to two hours.',
    'It dives up to *7,380 feet,* for up to *2 hours.*',
    'Er taucht bis zu zweitausendzweihundertfünfzig Meter tief, bis zu zwei Stunden lang.',
    'Se sumerge hasta dos mil doscientos cincuenta metros, durante hasta dos horas.',
    "Il plonge jusqu'à deux mille deux cent cinquante mètres, pendant jusqu'à deux heures.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('It sees with sound. Clicks from a head a third of its body. The echoes come back through its lower jaw.',
    'It *sees with sound.* Clicks from a head *1/3 of its body.* The echoes come back through its *lower jaw.*',
    'Er sieht mit Schall. Klicks aus einem Kopf, der ein Drittel seines Körpers ausmacht. Das Echo kommt über den Unterkiefer zurück.',
    'Ve con el sonido. Chasquidos desde una cabeza que es un tercio de su cuerpo. El eco vuelve por su mandíbula inferior.',
    "Il voit avec le son. Des clics venus d'une tête qui fait un tiers de son corps. L'écho revient par sa mâchoire inférieure.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V('It recycles its air, so it can click through a two-hour dive. Tags show it hunts upside down, for squid, even giant squid.',
    'It *recycles its air,* so it can click through a *2-hour dive.* Tags show it hunts *upside down,* for squid, even *giant squid.*',
    'Er nutzt seine Luft immer wieder, so kann er einen zweistündigen Tauchgang lang klicken. Sender zeigen: Er jagt kopfüber, nach Tintenfischen, sogar Riesenkalmaren.',
    'Recicla su aire, así que puede chasquear durante una inmersión de dos horas. Las marcas muestran que caza boca abajo, calamares, incluso calamares gigantes.',
    "Il recycle son air, donc il peut cliquer pendant une plongée de deux heures. Des balises montrent qu'il chasse à l'envers, des calmars, même des calmars géants.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [V('The loudest animal on Earth, using its voice to see.',
    'The *loudest animal on Earth,* using its voice *to see.*',
    'Das lauteste Tier der Erde, und es benutzt seine Stimme zum Sehen.',
    'El animal más ruidoso de la Tierra, usando su voz para ver.',
    "L'animal le plus bruyant de la Terre, qui se sert de sa voix pour voir.")]},
  {'dur': 1.6, 'vis': 5, 'vo': [
    V('Would you swim next to one? Yes or no, comment below.', None,
      'Würdest du neben einem schwimmen? Ja oder nein, schreib es in die Kommentare.',
      '¿Nadarías junto a uno? Sí o no, coméntalo abajo.',
      "Tu nagerais à côté d'un cachalot ? Oui ou non, dis-le en commentaire.", cta=True),
    V('Just not in front of two hundred thirty-six decibels.', 'Just not in front of *236 decibels.*',
      'Nur nicht direkt vor zweihundertsechsunddreißig Dezibel.',
      'Solo que no delante de doscientos treinta y seis decibelios.',
      "Mais pas devant deux cent trente-six décibels.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 20, 'len': 60, 'gain': 0.5},
  {'id': 'mom', 'file': 'File:Mother and baby sperm whale.jpg'},
  {'id': 'mom2', 'file': 'File:Sperm whale mother with calf.jpg'},
  {'id': 'dive', 'file': 'File:Dive to the deep. (9570628647).jpg'},
  {'id': 'fluke', 'file': 'File:Sperm whale starting to dive (1).jpg'},
  {'id': 'head', 'file': 'File:Sperm Whale. (8066472961).jpg'},
  {'id': 'head2', 'file': 'File:Sperm whale. (8066489885).jpg'},
  {'id': 'eye', 'video': 'File:Sperm whale eye retraction.ogv', 'from': 0, 'len': 4},
  {'id': 'scars', 'file': 'File:A piece of sperm whale skin with Giant Squid sucker scars.JPG'},
  {'id': 'pod', 'file': 'File:0b4a8510 by vitaly sokol-dbw6sol.jpg'},
  {'id': 'pod2', 'file': 'File:0b4a8510 by vitaly sokol-dbw4sol.jpg'},
  {'id': 'diver', 'file': 'File:0b4a8510 by vitaly sokol-dbw5sol.jpg'},
  {'id': 'xsec', 'file': 'File:Cross section of a sperm whale head.png'},
 ],
}
open('episodes/197.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
