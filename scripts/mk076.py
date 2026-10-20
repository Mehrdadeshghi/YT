#!/usr/bin/env python3
"""#076 DEEP SEA — goblin shark (experiment E3: hook = an impossible NUMBER; its twin #077 oarfish opens with a question).
Rewritten 20 Oct 2026 from the older, longer draft: 25–30 s, one idea per scene, drawn jaw mechanism + real photos.
Facts: English Wikipedia "Goblin shark" (featured article, Oct 2026): jaws 2.1–9.5 times more protrusible than other sharks;
two pairs of elastic ligaments pulled taut, released on the bite → "catapult" the jaws forward, almost to the end of the snout;
re-opening and re-closing during the strike, never observed in other sharks; pink skin; lineage some 125 million years old
("living fossil"); a few kept alive in aquariums only survived briefly: Tokai University one week, Tokyo Sea Life Park two days."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 76, 'title': 'Goblin shark: jaws 9.5x farther', 'series': 'DEEP SEA', 'experiment': 'E3 hook = number (vs #077 question hook)',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['ITS JAWS SHOOT OUT', '9.5× FARTHER'],
 'cta': {'q': 'Scarier than a great white?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Goblin_shark',
 'vo_open': [{'at': 0.3, 'text': "This shark's jaws shoot out up to nine and a half times farther than other sharks'.",
   'cap': "Jaws shoot out *9.5× farther* than other sharks'.",
   'de': 'Die Kiefer dieses Hais schießen bis zu neuneinhalbmal weiter heraus als bei anderen Haien.',
   'es': 'Las mandíbulas de este tiburón salen disparadas hasta nueve veces y media más lejos que las de otros tiburones.',
   'fr': "Les mâchoires de ce requin jaillissent jusqu'à neuf fois et demie plus loin que celles des autres requins."}],
 'scenes': [
  S(0, 'Two stretched ligaments work like a slingshot. When it bites, they catapult the jaws almost to the tip of its snout.',
    'Ligaments *catapult* the jaws *forward.*',
    'Zwei gespannte Bänder wirken wie eine Steinschleuder. Beim Biss katapultieren sie die Kiefer fast bis zur Schnauzenspitze.',
    'Dos ligamentos tensos funcionan como un tirachinas. Al morder, catapultan las mandíbulas casi hasta la punta del hocico.',
    "Deux ligaments tendus agissent comme un lance-pierre. Quand il mord, ils catapultent les mâchoires presque jusqu'au bout du museau."),
  S(1, 'Then it does something no other shark does: it opens and snaps shut a second time.',
    '*Snaps twice.* No other shark does that.',
    'Dann macht er etwas, das kein anderer Hai macht: Er öffnet das Maul und schnappt ein zweites Mal zu.',
    'Luego hace algo que ningún otro tiburón hace: abre y vuelve a cerrar la boca una segunda vez.',
    "Puis il fait ce qu'aucun autre requin ne fait : il rouvre la gueule et la referme une deuxième fois."),
  S(2, 'This pink living fossil comes from a lineage about one hundred twenty-five million years old.',
    'A *125-million-year-old* lineage.',
    'Dieses rosa lebende Fossil stammt aus einer Linie, die rund hundertfünfundzwanzig Millionen Jahre alt ist.',
    'Este fósil viviente rosado pertenece a un linaje de unos ciento veinticinco millones de años.',
    "Ce fossile vivant rose appartient à une lignée vieille d'environ cent vingt-cinq millions d'années."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='A few were kept in aquariums. The longest lasted one week.', cap='In an aquarium: *one week.* Max.',
         de='Ein paar kamen in Aquarien. Der längste überlebte eine Woche.',
         es='Algunos fueron llevados a acuarios. El que más duró vivió una semana.',
         fr="Quelques-uns ont été mis en aquarium. Le plus résistant a tenu une semaine."),
    dict(at='0.15', text='Scarier than a great white? Yes or no? Comment!', cta=True,
         de='Gruseliger als ein Weißer Hai? Ja oder nein? Schreib es in die Kommentare!',
         es='¿Más aterrador que un tiburón blanco? ¿Sí o no? ¡Comenta!',
         fr="Plus effrayant qu'un grand requin blanc ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.5},
  {'id': 'jaws', 'file': 'File:Mistukurina owstoni museum victoria - head detail.jpg'},
  {'id': 'live', 'file': 'File:Goblin shark (Mitsukurina owstoni).jpg'},
  {'id': 'front', 'file': 'File:Goblin shark snout.jpg'},
 ],
}
open('episodes/076.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
