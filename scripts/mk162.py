#!/usr/bin/env python3
"""#162 DEEP SEA — Japanese spider crab, 21 Oct 2026. Ocean track; 25–28 s; frame-1 impossible number ("12 feet wide").
Facts: English Wikipedia "Japanese spider crab" (Oct 2026): largest leg span of any arthropod, up to 3.7 m (12.1 ft) claw to claw;
AMNH specimen 3.8 m (12.5 ft) across its outstretched legs; up to 19 kg (42 lb); decorates its shell with sponges and other animals
(attached by mechanical adhesion and secretions) as camouflage; molting takes about 100 minutes, the crab loses its mobility,
starts at the rear of the carapace and ends with its walking legs."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 162, 'title': 'This crab is 12 feet wide (Japanese spider crab)', 'series': 'DEEP SEA',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THIS CRAB IS', '12 FEET WIDE.'],
 'cta': {'q': 'Would you pet one?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Japanese_spider_crab',
 'vo_open': [{'at': 0.3, 'text': 'This crab is twelve feet wide.',
   'de': 'Diese Krabbe ist dreieinhalb Meter breit.', 'es': 'Este cangrejo mide tres metros y medio de ancho.', 'fr': 'Ce crabe mesure trois mètres et demi de large.'}],
 'scenes': [
  S(0, 'The Japanese spider crab has the biggest leg span of any arthropod on Earth, claw to claw.',
    'The *biggest leg span* of any arthropod.',
    'Die Japanische Riesenkrabbe hat die größte Beinspannweite aller Gliederfüßer der Erde, von Schere zu Schere.',
    'El cangrejo araña japonés tiene la mayor envergadura de patas de todos los artrópodos, de pinza a pinza.',
    "Le crabe-araignée géant du Japon a la plus grande envergure de pattes de tous les arthropodes, d'une pince à l'autre."),
  S(1, 'One museum specimen measures twelve and a half feet across.', 'One specimen: *12.5 feet* across.',
    'Ein Exemplar im Museum misst drei Meter achtzig.', 'Un ejemplar de museo mide tres metros ochenta.',
    'Un spécimen de musée mesure trois mètres quatre-vingts.'),
  S(2, 'It weighs up to forty-two pounds, and it glues sponges and living animals onto its shell as a disguise.',
    'Up to *42 pounds.* It wears *sponges as a disguise.*',
    'Sie wiegt bis zu neunzehn Kilo und klebt sich Schwämme und lebende Tiere als Tarnung auf den Panzer.',
    'Pesa hasta diecinueve kilos y se pega esponjas y animales vivos en el caparazón para camuflarse.',
    "Il pèse jusqu'à dix-neuf kilos et se colle des éponges et des animaux vivants sur la carapace pour se camoufler."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='To grow, it climbs out of its own shell. That takes about a hundred minutes, and the legs come out last.',
         cap='It climbs out of its *own shell.* Legs come out *last.*',
         de='Um zu wachsen, klettert sie aus ihrem eigenen Panzer. Das dauert etwa hundert Minuten, und die Beine kommen zuletzt.',
         es='Para crecer, sale de su propio caparazón. Tarda unos cien minutos, y las patas salen al final.',
         fr='Pour grandir, il sort de sa propre carapace. Cela prend environ cent minutes, et les pattes sortent en dernier.'),
    dict(at='0.15', text='Would you pet one? Yes or no? Comment!', cta=True,
         de='Würdest du eine streicheln? Ja oder nein? Schreib es in die Kommentare!', es='¿Acariciarías uno? ¿Sí o no? ¡Comenta!',
         fr='Tu en caresserais un ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Dramatic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'swim', 'video': 'File:Giant Japanese Spider Crab, Shedd Aquarium, Chicago.webmhd.webm', 'from': 0, 'len': 8},
  {'id': 'amnh', 'file': 'File:Japanese spider crab.jpg'},
  {'id': 'sapporo', 'file': 'File:タカアシガニ (Macrocheira kaempferi) (15257827710).jpg'},
 ],
}
open('episodes/162.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
