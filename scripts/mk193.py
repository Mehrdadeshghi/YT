#!/usr/bin/env python3
"""#193 WHY? — Why does the Moon look huge near the horizon? 24 Oct 2026. Template #186 (cine/why.js), voice: gemini.
Facts: English Wikipedia "Moon illusion" (Oct 2026)
- The Moon is actually only about 1.5% farther away and thus smaller in angular size at the horizon than when above.
- Its angle can be measured with a theodolite and stays constant; photographs at different elevations show the same size.
- Pebble test: a pebble 0.33 inches (8.4 mm) wide at arm's length (25 inches, 64 cm) covers the full Moon high in the sky, and the
  same pebble also covers it on the horizon.
- Remains inconclusively explained; Ross and Plug: "No single theory has emerged victorious"; the illusion is usually an apparent
  increase in diameter of about 50 percent; the most important factor is the sight of the terrain. The apparent distance
  explanation (terrain cues make the horizon Moon seem far away → judged larger; Kaufman and Rock 1962, Ponzo-like) is the one
  most often found in textbooks.
- Historical references start with Aristotle (~330 BC)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 193, 'title': 'Why does the Moon look huge near the horizon?', 'series': 'WHY? #8',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['IS THE RISING', 'MOON SO HUGE?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY IS THE RISING', 'MOON SO HUGE?'],
 'cta': {'q': 'Will you try the pebble test?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Moon_illusion',
 'vo_open': [{'at': 0.3, 'text': 'Near the horizon, the Moon looks huge. High up, it looks tiny. Why?',
   'de': 'Am Horizont sieht der Mond riesig aus. Hoch oben wirkt er winzig. Warum?',
   'es': 'Cerca del horizonte, la Luna parece enorme. En lo alto, parece diminuta. ¿Por qué?',
   'fr': "Près de l'horizon, la Lune paraît énorme. Tout en haut, elle paraît minuscule. Pourquoi ?"}],
 'scenes': [
  S(0, "Reason one: it's not bigger. Photos show the same size, and at the horizon it's even a bit farther away.",
    "Reason one: *not bigger.* Photos: *same size.* Even a bit *farther away.*",
    'Grund eins: Er ist nicht größer. Fotos zeigen dieselbe Größe, und am Horizont ist er sogar ein bisschen weiter weg.',
    'Razón uno: no es más grande. Las fotos muestran el mismo tamaño, y en el horizonte está incluso un poco más lejos.',
    "Raison numéro un : elle n'est pas plus grande. Les photos montrent la même taille, et à l'horizon elle est même un peu plus loin."),
  S(1, 'Try it: a small pebble at arm\'s length covers the Moon, high or low.',
    '*Try it:* a small *pebble* at *arm\'s length* covers it, *high or low.*',
    'Probier es aus: Ein kleiner Kieselstein auf Armlänge verdeckt den Mond, ob hoch oder tief.',
    'Pruébalo: una piedrita con el brazo estirado tapa la Luna, alta o baja.',
    "Essaie : un petit caillou à bout de bras cache la Lune, qu'elle soit haute ou basse."),
  S(2, 'Reason two, the textbook idea: the land makes the Moon seem far away, so your brain blows it up, usually by about fifty percent.',
    'Reason two: the *land* makes it seem *far away,* so your *brain* blows it up: about *50%.*',
    'Grund zwei, die Lehrbuch-Erklärung: Die Landschaft lässt den Mond weit weg wirken, also bläst dein Gehirn ihn auf, meist um etwa fünfzig Prozent.',
    'Razón dos, la idea de los libros: el paisaje hace que la Luna parezca lejana, y tu cerebro la agranda, normalmente un cincuenta por ciento.',
    "Raison numéro deux, l'idée des manuels : le paysage fait paraître la Lune lointaine, alors ton cerveau la grossit, en général d'environ cinquante pour cent."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='The twist: scientists still argue about why. Even Aristotle wrote about it.',
         cap='The twist: scientists *still argue.* Even *Aristotle* wrote about it.',
         de='Der Clou: Wissenschaftler streiten bis heute über das Warum. Schon Aristoteles hat darüber geschrieben.',
         es='El giro: los científicos aún discuten el porqué. Hasta Aristóteles escribió sobre ello.',
         fr="Le twist : les scientifiques se disputent encore sur le pourquoi. Même Aristote en parlait."),
    dict(at='0.15', text='Will you try the pebble test? Tell us below, and send us your next why.', cta=True,
         de='Machst du den Kieselstein-Test? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Harás la prueba de la piedrita? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Tu vas tester le caillou ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Calmant.ogg', 'from': 0, 'len': 60, 'gain': 0.4},
  {'id': 'mclip', 'video': 'File:Moon rising over Joshua Trees (29952161293).webm', 'from': 0, 'len': 11},
  {'id': 'harvest', 'file': 'File:2017-10-06 Harvest moon over Albufeira (3).JPG'},
  {'id': 'harvest2', 'file': 'File:06-10-2017 Harvest moon over Albufeira.JPG'},
  {'id': 'hauser', 'file': 'File:Hauser Lake Moon.jpg'},
  {'id': 'anhinga', 'file': 'File:AnhingaTrailMoonriseWeb (8721138690).jpg'},
  {'id': 'nyc', 'file': 'File:Jul 9, 2009 - Full moon over 96th St.jpg'},
  {'id': 'high', 'file': 'File:Full moon with cloudy skies at night.jpg'},
  {'id': 'bartlett', 'file': 'File:Bartlett Cove sunset and nearly-full moon (6b0615df-e9f3-4413-aa6e-f33a03adb85c).JPG'},
  {'id': 'full', 'file': 'File:FullMoon2010.jpg'},
  {'id': 'redmoon', 'file': 'File:Red Moon Rising.jpg'},
  {'id': 'aristotle', 'file': 'File:Aristotle Altemps Inv8575.jpg'},
  {'id': 'ponzo', 'file': 'File:Ponzo-Taeuschung.png'},
 ],
}
open('episodes/193.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
