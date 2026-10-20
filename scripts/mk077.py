#!/usr/bin/env python3
"""#077 DEEP SEA — giant oarfish, "the doomsday fish" (experiment E3: QUESTION hook; goblin shark #076 = number hook).
Facts: English Wikipedia (Oct 2026)
- "Giant oarfish": world's longest bony fish; sightings of healthy specimens in their natural habitat are unusual; "earthquake fish",
  popularly believed to surface before/after earthquakes, "such correlation is not supported"; self-amputation of the body behind
  the vent, several times in a lifetime, all fish over 1.5 m have shortened bodies; organs concentrated toward the head.
- "Oarfish": called "doomsday fish"; harbingers of doom, "reinforced by the numerous beachings before the disastrous
  2011 Tōhoku earthquake and tsunami"; photo caption: U.S. Navy SEAL candidates holding a 23 ft giant oarfish, San Diego, Sept 1996."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 77, 'title': 'The doomsday fish (giant oarfish)', 'series': 'DEEP SEA', 'experiment': 'E3 question hook (vs #076 number hook)',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1560, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['WHY IS THIS THE', '“DOOMSDAY FISH”?'],
 'cta': {'q': 'Swim next to one?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Giant_oarfish',
 'vo_open': [{'at': 0.3, 'text': 'Why do people call this the doomsday fish?',
   'de': 'Warum nennen die Leute ihn den Weltuntergangsfisch?', 'es': '¿Por qué lo llaman el pez del fin del mundo?',
   'fr': "Pourquoi l'appelle-t-on le poisson de l'apocalypse ?"}],
 'scenes': [
  S(0, "It's a giant oarfish, the longest bony fish on Earth. This one, near San Diego, was twenty-three feet.",
    'The *longest bony fish* on Earth: *23 feet.*',
    'Es ist ein Riemenfisch, der längste Knochenfisch der Welt. Dieser hier, bei San Diego, war sieben Meter lang.',
    'Es un pez remo gigante, el pez óseo más largo del planeta. Este, cerca de San Diego, medía siete metros.',
    "C'est un régalec, le plus long poisson osseux du monde. Celui-ci, près de San Diego, mesurait sept mètres."),
  S(1, 'Healthy ones are rarely seen. But many washed up in Japan before the twenty eleven earthquake and tsunami.',
    'Many washed up before *Japan’s 2011 quake.*',
    "Gesunde sieht man fast nie. Aber vor dem Erdbeben und Tsunami in Japan zweitausendelf wurden viele angespült.",
    'Casi nunca se ven sanos. Pero muchos aparecieron en las playas de Japón antes del terremoto y tsunami de dos mil once.',
    "On en voit rarement en bonne santé. Mais beaucoup se sont échoués au Japon avant le séisme et le tsunami de deux mille onze."),
  S(2, 'So can it predict earthquakes? The data says no. There is no real link.',
    'Predict quakes? *No real link.*',
    'Kann er also Erdbeben vorhersagen? Die Daten sagen nein. Es gibt keinen echten Zusammenhang.',
    '¿Entonces puede predecir terremotos? Los datos dicen que no. No hay ninguna relación real.',
    'Alors, peut-il prédire les séismes ? Les données disent non. Il n’y a aucun vrai lien.'),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='The real weird part: it cuts off its own tail, again and again. Its organs sit near the head, so it survives.',
         cap='It *cuts off its own tail.* Again and again.',
         de='Das wirklich Seltsame: Er trennt seinen eigenen Schwanz ab, immer wieder. Seine Organe liegen nah am Kopf, also überlebt er.',
         es='Lo realmente raro: se corta su propia cola, una y otra vez. Sus órganos están cerca de la cabeza, así que sobrevive.',
         fr="Le plus étrange : il se coupe la queue, encore et encore. Ses organes sont près de la tête, alors il survit."),
    dict(at='0.15', text='Would you swim next to one? Yes or no? Comment!', cta=True,
         de='Würdest du neben einem schwimmen? Ja oder nein? Schreib es in die Kommentare!',
         es='¿Nadarías junto a uno? ¿Sí o no? ¡Comenta!', fr='Tu nagerais à côté de lui ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.5},
  {'id': 'navy', 'file': 'File:Giant Oarfish.jpg'},
  {'id': 'beach', 'file': 'File:Regalecus glesne 297924803.jpg'},
  {'id': 'head', 'file': 'File:Regalecus glesne NZ.jpg'},
 ],
}
open('episodes/077.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
