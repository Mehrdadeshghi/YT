#!/usr/bin/env python3
"""#167 OCEAN — stonefish (Synanceia), 20 Oct 2026. Ocean track; 25–28 s; frame-1 puzzle ("there's a deadly fish in this photo").
Facts: English Wikipedia "Synanceia" (Oct 2026): the most venomous fish known; named for its grey mottled stone-like camouflage, swimmers
step on them; can survive out of the water for up to 24 hours, so stings also happen on the beach; edible — raw stonefish served as
sashimi is rendered harmless by removing the dorsal fins (main source of venom); delicacy in parts of Asia incl. south Japan.
"Synanceia verrucosa": 13 dorsal spines, each with two venom sacs; the spines have been known to pierce boot soles."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 167, 'title': 'Find the deadly fish (stonefish)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['FIND THE', 'DEADLY FISH.'],
 'cta': {'q': 'Brave enough to eat it?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Synanceia',
 'vo_open': [{'at': 0.3, 'text': "There's a deadly fish in this photo. Can you find it?",
   'de': 'In diesem Foto steckt ein tödlicher Fisch. Findest du ihn?', 'es': 'En esta foto hay un pez mortal. ¿Lo encuentras?',
   'fr': 'Il y a un poisson mortel sur cette photo. Tu le trouves ?'}],
 'scenes': [
  S(0, 'Right there. A stonefish, the most venomous fish known. And it looks exactly like a rock.',
    'A *stonefish.* The *most venomous* fish known.',
    'Genau da. Ein Steinfisch, der giftigste bekannte Fisch. Und er sieht genau aus wie ein Stein.',
    'Justo ahí. Un pez piedra, el pez más venenoso que se conoce. Y parece exactamente una roca.',
    "Juste là. Un poisson-pierre, le poisson le plus venimeux connu. Et il ressemble exactement à un caillou."),
  S(1, 'Thirteen spines on its back, each with two venom sacs. They can go right through a boot sole.',
    '*13 spines.* Each with *two venom sacs.*',
    'Dreizehn Stacheln auf dem Rücken, jeder mit zwei Giftdrüsen. Sie gehen sogar durch eine Stiefelsohle.',
    'Trece espinas en el lomo, cada una con dos sacos de veneno. Pueden atravesar la suela de una bota.',
    "Treize épines sur le dos, chacune avec deux poches de venin. Elles traversent même une semelle de botte."),
  S(2, 'It can survive out of the water for up to twenty-four hours. So people even get stung on the beach.',
    'Out of water for up to *24 hours.*',
    'Er überlebt bis zu vierundzwanzig Stunden ohne Wasser. Deshalb werden Menschen sogar am Strand gestochen.',
    'Puede sobrevivir fuera del agua hasta veinticuatro horas. Por eso hay picaduras incluso en la playa.',
    "Il survit jusqu'à vingt-quatre heures hors de l'eau. Alors on se fait piquer même sur la plage."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="And yet, people eat it. Raw, as sashimi. Cut off the spiny fin, and it's harmless.",
         cap='People eat it *raw.* As *sashimi.*',
         de='Und trotzdem wird er gegessen. Roh, als Sashimi. Schneidet man die Stachelflosse ab, ist er harmlos.',
         es='Y aun así, la gente se lo come. Crudo, como sashimi. Si le quitas la aleta con espinas, es inofensivo.',
         fr="Et pourtant, on le mange. Cru, en sashimi. On coupe la nageoire à épines, et il est inoffensif."),
    dict(at='0.15', text='Brave enough to eat it? Yes or no? Comment!', cta=True,
         de='Mutig genug, ihn zu essen? Ja oder nein? Schreib es in die Kommentare!', es='¿Te atreves a comerlo? ¿Sí o no? ¡Comenta!',
         fr='Assez courageux pour le manger ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Horror Suspense.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'hide', 'file': 'File:Guère visible !.jpg'},
  {'id': 'noaa1', 'file': 'File:Reef0915 - Flickr - NOAA Photo Library.jpg'},
  {'id': 'market', 'file': 'File:HK KTD 觀塘 Kwun Tong 瑞和街 Shui Wo Street 街市 market July 2022 Px3 150.jpg'},
  {'id': 'swim', 'video': 'File:Echter Steinfisch - 6207.ogg', 'from': 19, 'len': 7},
 ],
}
open('episodes/167.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
