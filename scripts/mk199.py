#!/usr/bin/env python3
"""#199 REEL v2 (E8) — Mount Rushmore's hidden Hall of Records. 25 Oct 2026. voice: gemini.
Facts: English Wikipedia "Mount Rushmore", section "Hall of Records" (Oct 2026)
- Borglum envisioned a Hall of Records for the Constitution and the Declaration of Independence, in a vault cut into the
  mountain, entrance near the top behind the heads, reached by a long series of stairways up the side of Mount Rushmore.
- They started a vault in a crag behind the Abraham Lincoln figure, cut about 70 feet (21 m) into the rock; work stopped in 1939
  to focus on the heads; no trail was ever built; off-limits to the public (a few people documented it with park rangers).
- 1998: a repository inside the mouth of the cave: 16 enamel panels with biographical/historical information and the texts of
  the documents Borglum wanted to preserve; teakwood box inside a titanium vault in the ground, engraved granite capstone.
Hook (scripts/reel/hookscore.py): "Nobody tells you about the room behind Lincoln's head." 81.4 STRONG (formula 3 Nobody Tells You)."""
import json
E = {
 'ep': 199, 'title': "The secret room behind Lincoln's head", 'format': 'reel2', 'hook_formula': '3 Nobody Tells You',
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 78, 'voice': 'gemini',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'wordCaps': True, 'mood': 'calm', 'prog': 3,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ["A ROOM BEHIND", "LINCOLN'S HEAD"],
 'cta': {'q': "Open Lincoln's room to visitors?", 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Mount_Rushmore#Hall_of_Records',
 'vo_open': [{'at': 0.15, 'text': "Nobody tells you about the room behind Lincoln's head. And you're not allowed in.",
   'de': 'Kaum einer weiß: Hinter Lincolns Kopf gibt es einen Raum. Und du darfst nicht hinein.',
   'es': 'Nadie te cuenta que hay una sala detrás de la cabeza de Lincoln. Y no te dejan entrar.',
   'fr': "Personne ne te dit qu'il y a une salle derrière la tête de Lincoln. Et tu n'as pas le droit d'y entrer."}],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [dict(at=0.3,
    text='Sculptor Gutzon Borglum planned a Hall of Records up there: a vault for the Declaration of Independence and the Constitution, with giant stairways up the mountain.',
    cap='Sculptor *Gutzon Borglum* planned a *Hall of Records:* the *Declaration of Independence* and the *Constitution,* with *giant stairways.*',
    de='Bildhauer Gutzon Borglum plante dort oben eine Halle der Urkunden: einen Tresor für die Unabhängigkeitserklärung und die Verfassung, mit riesigen Treppen den Berg hinauf.',
    es='El escultor Gutzon Borglum planeó allí arriba una Sala de los Registros: una cámara para la Declaración de Independencia y la Constitución, con escaleras gigantes por la montaña.',
    fr="Le sculpteur Gutzon Borglum y prévoyait une Salle des Archives : un coffre pour la Déclaration d'indépendance et la Constitution, avec d'immenses escaliers sur la montagne.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [dict(at=0.3,
    text='His crew cut seventy feet into the rock. Then, in nineteen thirty-nine, work stopped to finish the faces. No trail was ever built.',
    cap='His crew cut *seventy feet* into the rock. In *1939* work *stopped* for the faces. *No trail* was ever built.',
    de='Seine Leute schlugen gut zwanzig Meter in den Fels. Dann, neunzehnhundertneununddreißig, wurde die Arbeit gestoppt, um die Gesichter fertigzustellen. Ein Weg wurde nie gebaut.',
    es='Su equipo excavó unos veintiún metros en la roca. Luego, en mil novecientos treinta y nueve, se paró la obra para terminar las caras. Nunca se construyó un sendero.',
    fr='Son équipe a creusé environ vingt et un mètres dans la roche. Puis, en mille neuf cent trente-neuf, le chantier a été arrêté pour finir les visages. Aucun sentier n’a jamais été construit.')]},
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.3,
      text='But in nineteen ninety-eight, they finally filled it: sixteen enamel panels with those texts, sealed in a titanium vault.',
      cap='But in *1998* they finally filled it: *sixteen enamel panels,* sealed in a *titanium vault.*',
      de='Doch neunzehnhundertachtundneunzig wurde er endlich gefüllt: sechzehn Emailtafeln mit diesen Texten, versiegelt in einem Titantresor.',
      es='Pero en mil novecientos noventa y ocho por fin la llenaron: dieciséis paneles de esmalte con esos textos, sellados en una cámara de titanio.',
      fr='Mais en mille neuf cent quatre-vingt-dix-huit, on l’a enfin rempli : seize panneaux émaillés avec ces textes, scellés dans un coffre en titane.'),
    dict(at='0.15', text="Should they open Lincoln's hidden room to visitors? Comment yes or no.", cta=True,
      de='Sollte man Lincolns verborgenen Raum für Besucher öffnen? Schreib ja oder nein.',
      es='¿Deberían abrir la sala oculta de Lincoln a los visitantes? Comenta sí o no.',
      fr='Faudrait-il ouvrir la salle cachée de Lincoln aux visiteurs ? Commente oui ou non.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'rush', 'file': 'File:Mount Rushmore Closeup 2017.jpg'},
  {'id': 'rushw', 'file': 'File:Dean Franklin - 06.04.03 Mount Rushmore Monument (by-sa).jpg'},
  {'id': 'hall', 'file': 'File:Hall of Records - Behind Mt. Rushmore.JPG'},
  {'id': 'hallop', 'file': 'File:Mount Rushmore Hall of Records opening.jpg'},
  {'id': 'borglum', 'file': 'File:Mount Rushmore National Memorial - Gutzon Borglum portrait.jpg'},
  {'id': 'decl', 'file': 'File:United States Declaration of Independence.jpg'},
  {'id': 'const', 'file': 'File:Constitution of the United States, page 1.jpg'},
  {'id': 'build', 'file': 'File:Mount Rushmore2.jpg'},
  {'id': 'top', 'file': 'File:The Top of Mt. Rushmore looking out.JPG'},
  {'id': 'panel', 'file': 'File:Borglum biography panel for the Hall of Records at Mt Rushmore.jpg'},
 ],
}
open('episodes/199.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
