#!/usr/bin/env python3
"""#173 CURIOSITY — sailing stones of Racetrack Playa, Death Valley (US angle), 21 Oct 2026. 25–28 s; frame-1 contradiction ("nobody pushed these rocks").
Facts: English Wikipedia "Sailing stones" (Oct 2026)
- rocks move and inscribe long tracks on Racetrack Playa, Death Valley National Park, California; tracks often up to 330 ft (100 m) long
- "Some stones weigh as much as a human"; studied since the early 1900s (first documented account 1915), cause not confirmed until 2014
- researchers observed the movements using GPS and time-lapse photography; largest documented movement Dec 20, 2013, more than 60 rocks
  (paper: "Sliding Rocks on Racetrack Playa … First Observation of Rocks in Motion", PLoS ONE 2014; GPS units inserted into a cavity bored into the rock)
- cause: large ice sheets a few millimeters thick on an ephemeral winter pond break up on sunny mornings, are driven by light winds and shove the rocks
  at up to 5 m/min (≈ 16 ft/min)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 173, 'title': 'Nobody pushed these rocks', 'series': 'MYSTERY',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['NOBODY PUSHED', 'THESE ROCKS.'],
 'cta': {'q': 'Did you guess ice?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Sailing_stones',
 'vo_open': [{'at': 0.3, 'text': 'Nobody pushed these rocks.',
   'de': 'Niemand hat diese Steine geschoben.', 'es': 'Nadie empujó estas rocas.', 'fr': "Personne n'a poussé ces pierres."}],
 'scenes': [
  S(0, 'Stones as heavy as a person slide across a dry lake in Death Valley, leaving trails up to three hundred thirty feet long.',
    'Stones *as heavy as a person.* Trails up to *330 ft.*',
    'Steine, so schwer wie ein Mensch, rutschen im Death Valley über einen ausgetrockneten See und hinterlassen bis zu hundert Meter lange Spuren.',
    'Piedras tan pesadas como una persona se deslizan por un lago seco en el Valle de la Muerte y dejan huellas de hasta cien metros.',
    "Des pierres aussi lourdes qu'un humain glissent sur un lac asséché de la Vallée de la Mort et laissent des traces jusqu'à cent mètres."),
  S(1, 'For nearly a century, nobody ever saw one move.', 'Nearly *100 years.* Nobody *saw one move.*',
    'Fast hundert Jahre lang hat niemand je einen davon wandern sehen.',
    'Durante casi un siglo, nadie vio moverse ni una.',
    "Pendant près d'un siècle, personne n'en a jamais vu bouger une."),
  S(2, 'Scientists hid GPS trackers inside the rocks. Then, on December twentieth, twenty thirteen, more than sixty rocks moved at once.',
    '*GPS* inside the rocks. Then *60+ rocks* moved at once.',
    'Forscher versteckten GPS-Sender in den Steinen. Dann, am zwanzigsten Dezember zweitausenddreizehn, bewegten sich über sechzig Steine gleichzeitig.',
    'Los científicos escondieron GPS dentro de las rocas. Y el veinte de diciembre de dos mil trece, más de sesenta rocas se movieron a la vez.',
    "Des chercheurs ont caché des GPS dans les pierres. Puis, le vingt décembre deux mille treize, plus de soixante pierres ont bougé d'un coup."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Ice. Sheets just a few millimeters thin, pushed by light wind, shoving the rocks about sixteen feet a minute.',
         cap='*Ice,* a few mm thin. Wind pushes. *16 ft a minute.*',
         de='Eis. Platten, nur ein paar Millimeter dünn, von leichtem Wind getrieben, schieben die Steine rund fünf Meter pro Minute.',
         es='Hielo. Placas de pocos milímetros, empujadas por un viento suave, arrastran las rocas unos cinco metros por minuto.',
         fr="De la glace. Des plaques de quelques millimètres, poussées par un vent léger, déplacent les pierres d'environ cinq mètres par minute."),
    dict(at='0.15', text='Did you guess ice? Yes or no? Comment!', cta=True, de='Hättest du auf Eis getippt? Ja oder nein? Ab in die Kommentare!',
         es='¿Adivinaste que era hielo? ¿Sí o no? ¡Comenta!', fr='Tu avais deviné la glace ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 50, 'len': 60, 'gain': 0.5},
  {'id': 'trail', 'file': 'File:Racetrack, Death Valley National Park.jpg'},
  {'id': 'visitor', 'file': 'File:Death Valley Scenic Byway - Visitor to Racetrack Playa - NARA - 7717976.jpg'},
  {'id': 'lone', 'file': 'File:A lone rock with its trail on the Racetrack playa. (bafbecc6-178c-43d7-aa49-d4501fa5ca8a).jpg'},
  {'id': 'gps', 'file': 'File:Sliding-Rocks-on-Racetrack-Playa-Death-Valley-National-Park-First-Observation-of-Rocks-in-Motion-pone.0105948.g004.jpg'},
  {'id': 'dec20', 'file': 'File:Racetrack playa 2013-12-20.jpg'},
  {'id': 'ice', 'file': 'File:Sliding-Rocks-on-Racetrack-Playa-Death-Valley-National-Park-First-Observation-of-Rocks-in-Motion-pone.0105948.g008.jpg'},
 ],
}
open('episodes/173.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
