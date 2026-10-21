#!/usr/bin/env python3
"""#177 OCEAN — hagfish (Myxini), 21 Oct 2026. Ocean track, US angle (the Highway 101 slime spill); 25–30 s; frame-1 = an impossible number.
Facts: English Wikipedia "Hagfish" (Oct 2026): eel-shaped jawless fish ("slime eels"); slime expands to 10,000 times its original size in
0.4 seconds; it clogs a predator fish's gills, the predator releases the hagfish; if still captured it ties itself in an overhand knot and works
the knot from head to tail, scraping off the slime; 2017 road accident on U.S. Highway 101 spilled 7,500 pounds (3,400 kg) of hagfish, they emitted
enough slime to cover the road and a nearby car; hagfish skin is usually referred to as "eel skin", durable leather for wallets and belts."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
SRC = 'Hagfish-slime-and-mucin-flow-properties-and-their-implications-for-defense-srep30371-'
E = {
 'ep': 177, 'title': 'The slime fish (hagfish)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['10,000× BIGGER', 'IN 0.4 SECONDS.'],
 'cta': {'q': 'Would you touch one?', 'a': 'YES', 'b': 'NO WAY'},
 'source': 'https://en.wikipedia.org/wiki/Hagfish',
 'vo_open': [{'at': 0.3, 'text': "This fish's slime grows ten thousand times bigger. In less than half a second.",
   'de': 'Der Schleim dieses Fisches wird zehntausendmal größer. In weniger als einer halben Sekunde.',
   'es': 'La baba de este pez crece diez mil veces. En menos de medio segundo.',
   'fr': "La bave de ce poisson devient dix mille fois plus grosse. En moins d'une demi-seconde."}],
 'scenes': [
  S(0, 'Meet the hagfish. No jaws. When a shark bites, the slime clogs its gills, and the shark lets go.',
    'The slime *clogs the shark’s gills.*',
    'Das ist der Schleimaal. Keine Kiefer. Wenn ein Hai zubeißt, verstopft der Schleim seine Kiemen, und der Hai lässt los.',
    'Te presento al mixino. Sin mandíbulas. Cuando un tiburón lo muerde, la baba le tapa las branquias, y el tiburón lo suelta.',
    "Voici la myxine. Pas de mâchoires. Quand un requin la mord, la bave bouche ses branchies, et le requin la lâche."),
  S(1, 'Covered in its own slime? It ties itself in a knot, and slides the knot down its body to scrape it off.',
    'It ties itself *in a knot.*',
    'Selbst voller Schleim? Er macht einen Knoten in sich selbst und schiebt ihn den Körper entlang, um alles abzustreifen.',
    '¿Cubierto de su propia baba? Se hace un nudo a sí mismo y lo desliza por el cuerpo para quitársela.',
    "Couverte de sa propre bave ? Elle se fait un nœud et le fait glisser le long de son corps pour tout racler."),
  S(2, "Twenty seventeen: a truck spilled seventy-five hundred pounds of hagfish on Highway 101. Slime covered the road, and a car.",
    '*7,500 lb* of hagfish on *Highway 101.*',
    'Zweitausendsiebzehn: Ein Lastwagen verlor dreieinhalb Tonnen Schleimaale auf dem Highway 101. Schleim bedeckte die Straße und ein Auto.',
    'Dos mil diecisiete: un camión derramó tres mil cuatrocientos kilos de mixinos en la autopista 101. La baba cubrió la carretera y un coche.',
    "Deux mille dix-sept : un camion a renversé trois tonnes et demie de myxines sur l'autoroute 101. La bave a couvert la route, et une voiture."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Ever owned an “eel skin” wallet? That leather usually comes from hagfish.',
         cap='“Eel skin” wallets? *Usually hagfish.*',
         de='Schon mal ein Portemonnaie aus „Aalleder“ gehabt? Dieses Leder stammt meistens vom Schleimaal.',
         es='¿Alguna vez tuviste una cartera de “piel de anguila”? Ese cuero suele venir del mixino.',
         fr="Déjà eu un portefeuille en « peau d'anguille » ? Ce cuir vient généralement de la myxine."),
    dict(at='0.15', text='Touch one? Yes or no? Comment!', cta=True,
         de='Würdest du einen anfassen? Ja oder nein? Schreib es in die Kommentare!', es='¿Tocarías uno? ¿Sí o no? ¡Comenta!',
         fr="Tu en toucherais une ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Horror Suspense.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'sea', 'file': 'File:Purple hagfish on seafloor (OOI 237).jpg'},
  {'id': 'det', 'file': 'File:Hagfish Slime Predator Deterrence.jpg'},
  {'id': 'held', 'file': 'File:Black hagfish, Eptatretus deani 01.jpg'},
  {'id': 'knot', 'video': f'File:{SRC}s1.ogv', 'from': 12, 'len': 7},
 ],
}
open('episodes/177.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
