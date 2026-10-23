#!/usr/bin/env python3
"""#195 WHY? #10 — Why do we get goosebumps? 24 Oct 2026. WHY? series (template #186, cine/why.js), voice: Gemini TTS.
Facts: English Wikipedia (Oct 2026, catalog-68 articles.md)
- "Goose bumps": created when tiny muscles at the base of each hair, the arrector pili muscles, contract and pull the hair straight
  up; the reflex is started by the sympathetic nervous system (fight-or-flight responses). In animals with fur, the erect hairs trap
  air → insulation; in anger or fear the erect hairs make the animal appear larger to intimidate enemies (frightened cats,
  chimpanzees). Porcupines raise their quills when threatened. Goose bumps in humans under stress are "considered by some to be a
  vestigial reflex" → "some call it a leftover reflex". Triggers in humans: cold, fear, strong emotions, a horror film; "Music can
  also be a cause of piloerection".
- "Arrector pili muscle": involuntary; cold, fear stimulate the sympathetic nervous system; principal function in most mammals is
  thermal insulation (air trapped between the erect hairs helps retain heat); response to a perceived threat → seem larger.
- "Porcupine": quills are modified hairs (keratin); quill erection is the first of the four defensive displays.
Not claimed: that music goosebumps are explained by the leftover reflex (no causal link in the source)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 195, 'title': 'Why do we get goosebumps?', 'series': 'WHY? #10',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['DO WE GET', 'GOOSEBUMPS?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY DO WE GET', 'GOOSEBUMPS?'],
 'cta': {'q': 'Does music give YOU goosebumps?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Goose_bumps',
 'vo_open': [{'at': 0.3, 'text': 'A scared cat puffs up. You get goosebumps. Same reflex. Why?',
   'de': 'Eine erschrockene Katze plustert sich auf. Du kriegst Gänsehaut. Derselbe Reflex. Warum?',
   'es': 'Un gato asustado se eriza. A ti se te pone la piel de gallina. El mismo reflejo. ¿Por qué?',
   'fr': "Un chat effrayé se hérisse. Toi, tu as la chair de poule. Le même réflexe. Pourquoi ?"}],
 'scenes': [
  S(0, 'Reason one: tiny muscles at the base of each hair. Your fight-or-flight nerves make them pull the hair straight up.',
    'Reason one: *tiny muscles* at the base of each *hair.* *Fight-or-flight* nerves pull it *straight up.*',
    'Grund eins: winzige Muskeln an der Wurzel jedes Haares. Deine Kampf-oder-Flucht-Nerven lassen sie das Haar aufrichten.',
    'Razón uno: músculos diminutos en la base de cada pelo. Tus nervios de lucha o huida hacen que tiren del pelo hacia arriba.',
    "Raison numéro un : de minuscules muscles à la base de chaque poil. Tes nerfs de combat ou de fuite leur font redresser le poil."),
  S(1, 'Reason two: a warm coat. On a furry animal, raised hair traps air and holds in heat.',
    'Reason two: *a warm coat.* On a *furry animal*, raised hair *traps air* and holds in *heat.*',
    'Grund zwei: ein warmer Mantel. Bei einem Tier mit Fell fängt aufgestelltes Haar Luft ein und hält die Wärme.',
    'Razón dos: un abrigo caliente. En un animal peludo, el pelo erizado atrapa aire y guarda el calor.',
    "Raison numéro deux : un manteau chaud. Chez un animal à fourrure, les poils dressés emprisonnent l'air et gardent la chaleur."),
  S(2, 'Reason three: look bigger. Scared animals puff up. A porcupine raises its quills, and quills are hairs too.',
    'Reason three: *look bigger.* Scared animals *puff up.* A *porcupine* raises its *quills.* Quills are *hairs* too.',
    'Grund drei: größer wirken. Verängstigte Tiere plustern sich auf. Ein Stachelschwein stellt seine Stacheln auf, und Stacheln sind auch Haare.',
    'Razón tres: parecer más grande. Los animales asustados se erizan. Un puercoespín levanta sus púas, y las púas también son pelos.',
    "Raison numéro trois : paraître plus gros. Les animaux effrayés se hérissent. Un porc-épic dresse ses piquants, et les piquants sont aussi des poils."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Some call it a leftover reflex. It even fires during music, or a horror movie.',
         cap='Some call it a *leftover reflex.* It even fires during *music*, or a *horror movie.*',
         de='Manche nennen es einen Reflex aus alter Zeit. Er springt sogar bei Musik an, oder bei einem Horrorfilm.',
         es='Algunos lo llaman un reflejo sobrante. Incluso salta con la música, o con una película de terror.',
         fr="Certains parlent d'un réflexe hérité. Il se déclenche même avec la musique, ou devant un film d'horreur."),
    dict(at='0.15', text='Does music give you goosebumps? Tell us below, and tell us your next why.', cta=True,
         de='Kriegst du bei Musik Gänsehaut? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿La música te pone la piel de gallina? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='La musique te donne la chair de poule ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'arm', 'file': 'File:Goose bumps.jpg'},
  {'id': 'cat2', 'file': 'File:Angry Cat (14564413376).jpg'},
  {'id': 'cat3', 'file': 'File:Hannibal Poenaru - Nasty cat ! (by-sa).jpg'},
  {'id': 'porc2', 'file': 'File:African crested Porcupine -Hystrix cristata-.jpg'},
  {'id': 'crowd', 'file': 'File:Calgary Folk Music Festival 2023 audience viewing main stage concert.jpg'},
 ],
}
open('episodes/195.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
