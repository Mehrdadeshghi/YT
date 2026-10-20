#!/usr/bin/env python3
"""#170 OCEAN — lion's mane jellyfish, 21 Oct 2026. Ocean track; 25–28 s; frame-1 impossible comparison ("longer than a blue whale").
Facts: English Wikipedia (Oct 2026)
- "Lion's mane jellyfish": the largest recorded specimen was measured off the coast of Massachusetts in 1865, bell 210 cm (7 ft) across,
  tentacles around 36.6 m (120 ft) long — "this unusual length – longer than a blue whale"; it may have been a different Cyanea species and
  the record is treated with skepticism (shown on screen); closer to its mouth the total number of tentacles is around 1,200; the tentacles
  have stinging cells; it eats fish, zooplankton and smaller jellyfish; tentacles may keep the ability to sting for up to 25 days after
  detaching; July 2010: around 150 beachgoers were stung by the remains of a broken-up lion's mane at Wallis Sands State Beach, Rye,
  New Hampshire — believed to be a single specimen.
- "Blue whale": maximum confirmed length 29.9–30.5 m (98–100 ft) (drawn comparison bar only)."""
import json, sys
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 170, 'title': 'Longer than a blue whale', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['LONGER THAN', 'A BLUE WHALE.'],
 'cta': {'q': 'Swim next to one?', 'a': 'YES', 'b': 'NO'},
 'source': "https://en.wikipedia.org/wiki/Lion%27s_mane_jellyfish",
 'vo_open': [{'at': 0.3, 'text': 'This jellyfish is longer than a blue whale.',
   'de': 'Diese Qualle ist länger als ein Blauwal.', 'es': 'Esta medusa es más larga que una ballena azul.', 'fr': "Cette méduse est plus longue qu'une baleine bleue."}],
 'scenes': [
  S(0, 'Massachusetts, eighteen sixty-five: the biggest one ever measured. Its tentacles: about a hundred and twenty feet.',
    'Record: *1865.* Tentacles: about *120 feet.*',
    'Die größte je vermessene: vor Massachusetts, im Jahr achtzehnhundertfünfundsechzig. Ihre Tentakel: etwa sechsunddreißig Meter.',
    'La más grande jamás medida: frente a Massachusetts, en mil ochocientos sesenta y cinco. Sus tentáculos: unos treinta y seis metros.',
    "La plus grande jamais mesurée : au large du Massachusetts, en mille huit cent soixante-cinq. Ses tentacules : environ trente-six mètres."),
  S(1, 'Near its mouth: around twelve hundred tentacles. They sting, and even drag in other jellyfish.',
    'Around *1,200 tentacles.* They even drag in *other jellyfish.*',
    'Nahe am Maul: rund zwölfhundert Tentakel. Sie nesseln und ziehen sogar andere Quallen heran.',
    'Cerca de la boca: unos mil doscientos tentáculos. Pican, e incluso arrastran otras medusas.',
    "Près de sa bouche : environ mille deux cents tentacules. Ils piquent, et attirent même d'autres méduses."),
  S(2, 'Even torn off, a tentacle can keep stinging for up to twenty-five days.',
    'Torn off, a tentacle can sting for up to *25 days.*',
    'Selbst abgerissen kann ein Tentakel noch bis zu fünfundzwanzig Tage lang nesseln.',
    'Incluso arrancado, un tentáculo puede seguir picando hasta veinticinco días.',
    "Même arraché, un tentacule peut encore piquer jusqu'à vingt-cinq jours."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Back in twenty ten, about a hundred and fifty people got stung on one New Hampshire beach. Probably all by one single jellyfish.',
         cap='*2010:* about *150 people* stung on one beach. Probably by *one* jellyfish.',
         de='Im Jahr zweitausendzehn wurden an einem Strand in New Hampshire rund hundertfünfzig Menschen genesselt. Wahrscheinlich alle von den Resten einer einzigen Qualle.',
         es='En dos mil diez, unas ciento cincuenta personas sufrieron picaduras en una playa de New Hampshire. Probablemente todas por los restos de una sola medusa.',
         fr="En deux mille dix, environ cent cinquante personnes ont été piquées sur une plage du New Hampshire. Probablement toutes par les morceaux d'une seule méduse."),
    dict(at='0.15', text='Swim next to one? Yes or no? Comment!', cta=True,
         de='Traust du dich, neben einer zu schwimmen? Ja oder nein? Ab in die Kommentare!',
         es='¿Te atreves a nadar cerca de una? ¿Sí o no? ¡Comenta!', fr="Tu oserais nager près d'une ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 40, 'len': 60, 'gain': 0.5},
  {'id': 'swim', 'video': "File:VIDEO Lion's mane jelly Aquarium of the Pacific July 2023.webm", 'from': 2, 'len': 8},
  {'id': 'fjord', 'file': "File:Lion's mane jellyfish in Gullmarn fjord at Sämstad 3.jpg"},
  {'id': 'under', 'file': "File:Lion's mane jellyfish open showing underside.jpg"},
  {'id': 'moon', 'file': "File:Three moon jellyfishes captured by a lion's mane jellyfish 1.jpg"},
  {'id': 'beach', 'file': 'File:Amager East, Copenhagen, Denmark - panoramio (11).jpg'},
 ],
}
open('episodes/170.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
