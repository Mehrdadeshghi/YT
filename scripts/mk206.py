#!/usr/bin/env python3
"""#206 REEL v2 (E8), HyperFrames kit: the Gateway Arch didn't fit on its last day. 31 Oct 2026. voice: gemini.
Facts: English Wikipedia "Gateway Arch" (Oct 2026, catalog-75 articles.md)
- "630-foot-tall (192 m) monument in St. Louis, Missouri"; "Both the width and height of the arch are 630 feet".
- Topping out, October 28 1965: "A Catholic priest and a rabbi prayed over the keystone, a 10-short-ton (9.1 t), eight-foot-long
  (2.4 m) triangular section. It was slated to be inserted at 10:00 a.m. local time but was done 30 minutes early because thermal
  expansion had constricted the 8.5-foot (2.6 m) gap at the top by 5 inches (13 cm). To mitigate this, workers used fire hoses to
  spray water on the surface of the south leg to cool it down and make it contract. The keystone was inserted in 13 minutes with only
  6 inches (15 cm) remaining. For the next section, a hydraulic jack had to pry apart the legs six feet (1.8 m)."
- 8.5 ft = 102 in; minus 5 in = 97 in (arithmetic for the bar graphic).
Hook (scripts/reel/hookscore.py): "Nobody tells you the Gateway Arch didn't fit." 100.0 STRONG (formula 3 Nobody Tells You).
"""
import json
RP = 'Real photo'
E = {
 'ep': 206, 'title': "The Gateway Arch didn't fit", 'format': 'reel2', 'hook_formula': '3 Nobody Tells You',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['GATEWAY ARCH', "DIDN'T FIT"],
 'cta': {'q': 'Which trick?', 'a': 'HOSES', 'b': 'JACK'},
 'source': 'https://en.wikipedia.org/wiki/Gateway_Arch',
 'vo_open': [{'at': 0.15,
   'text': "Nobody tells you the Gateway Arch didn't fit.",
   'cap': "Nobody tells you the *Gateway Arch* didn't *fit.*",
   'de': 'Kaum einer weiß: Der Gateway Arch hat am Ende nicht gepasst.',
   'es': 'Nadie te cuenta que el Gateway Arch no encajaba.',
   'fr': "Personne ne te dit que la Gateway Arch ne rentrait pas."}],
 'scenes': [
  {'dur': 1.0, 'beat': 'legs', 'vo': [dict(at=0.2,
    text='Six hundred thirty feet up, two legs had to meet.',
    cap='*630 feet* up, two *legs* had to *meet.*',
    de='In hundertzweiundneunzig Metern Höhe mussten sich zwei Beine treffen.',
    es='A ciento noventa y dos metros de altura, dos patas tenían que unirse.',
    fr='À cent quatre-vingt-douze mètres de haut, deux piliers devaient se rejoindre.')]},
  {'dur': 1.0, 'beat': 'keystone', 'vo': [
    dict(at=0.2, text='The last piece, the keystone, weighed ten tons.',
      cap='The last piece, the *keystone,* weighed *ten tons.*',
      de='Das letzte Stück, der Schlussstein, wog neun Tonnen.',
      es='La última pieza, la clave, pesaba nueve toneladas.',
      fr='La dernière pièce, la clé de voûte, pesait neuf tonnes.'),
    dict(at=0.1, text='It needed an eight-and-a-half-foot gap.',
      cap='It needed an *8.5-foot gap.*',
      de='Dafür brauchte es eine Lücke von zwei Komma sechs Metern.',
      es='Necesitaba un hueco de dos coma seis metros.',
      fr='Il lui fallait un espace de deux virgule six mètres.')]},
  {'dur': 1.0, 'beat': 'heat', 'vo': [dict(at=0.2,
    text='But heat expanded the steel. The gap shrank five inches.',
    cap='But *heat* expanded the steel. The gap *shrank five inches.*',
    de='Aber die Wärme dehnte den Stahl aus. Die Lücke schrumpfte um dreizehn Zentimeter.',
    es='Pero el calor dilató el acero. El hueco se redujo trece centímetros.',
    fr="Mais la chaleur a dilaté l'acier. L'espace a rétréci de treize centimètres.")]},
  {'dur': 1.0, 'beat': 'hoses', 'vo': [dict(at=0.2,
    text='So workers cooled the south leg with fire hoses.',
    cap='So workers *cooled* the south leg with *fire hoses.*',
    de='Also kühlten Arbeiter das Südbein mit Feuerwehrschläuchen.',
    es='Así que los obreros enfriaron la pata sur con mangueras de bomberos.',
    fr='Alors les ouvriers ont refroidi le pilier sud avec des lances à incendie.')]},
  {'dur': 1.0, 'beat': 'spare', 'vo': [
    dict(at=0.2, text='The keystone went in with six inches to spare.',
      cap='The keystone went in with *six inches* to spare.',
      de='Der Schlussstein passte mit fünfzehn Zentimetern Luft hinein.',
      es='La clave entró con quince centímetros de margen.',
      fr='La clé de voûte est entrée avec quinze centimètres de marge.'),
    dict(at=0.1, text='For the next piece, a jack pried the legs six feet apart.',
      cap='For the next piece, a *jack* pried the legs *six feet* apart.',
      de='Für das nächste Stück drückte eine Hydraulikpresse die Beine eins Komma acht Meter auseinander.',
      es='Para la siguiente pieza, un gato hidráulico separó las patas un metro ochenta.',
      fr="Pour la pièce suivante, un vérin a écarté les piliers d'un mètre quatre-vingts."),
    dict(at=0.15, text='Hoses or jack: which trick made it fit? Comment hoses or jack.', cta=True,
      cap='*Hoses* or *jack:* which trick made it *fit?* Comment *hoses* or *jack.*',
      de='Schläuche oder Presse: Welcher Trick hat es passend gemacht? Schreib Schläuche oder Presse.',
      es='Mangueras o gato: ¿qué truco lo hizo encajar? Comenta mangueras o gato.',
      fr='Lances ou vérin : quelle astuce a tout fait rentrer ? Commente lances ou vérin.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60},
  {'id': 'sept', 'file': 'File:Arch Construction September 1965.jpg'},
  {'id': 'june', 'file': 'File:June 1965 Arch Construction.jpg'},
  {'id': 'sunset', 'file': 'File:Gateway Arch at Sunset.jpg'},
  {'id': 'south', 'file': 'File:St. Louis gateway arch underside view southern leg.jpg'},
  {'id': 'top', 'file': 'File:Beacon and Lightning Rod (6214298221).jpg'},
  {'id': 'reflect', 'file': 'File:Gateway arch reflect 1.jpg'},
 ],
}

# ---- HyperFrames kit (scripts/hf_kit.py)
E['hf'] = {'theme': {'cu': '#E9A04F', 'vg': '#8FC3E6', 'capcu': '#F2B064', 'capvg': '#A9D4F2', 'chipvg': '#A9D4F2', 'chipcu': '#F2B064', 'p0': '#E9A04F'},
           'caps': {'cu': ['heat', 'shrank', 'five', 'inches'], 'vg': ['hoses', 'cooled', 'keystone', 'jack', 'fit'], 'rd': ['didnt']}}
E['hf_open'] = {'tpl': 'split', 'name': 'hook', 'a': 'sept', 'b': 'sunset',
  'imgA': {'w': 2833, 'x': -876, 'y': 0}, 'imgB': {'w': 1280, 'x': -100, 'y': 0},
  'labelA': ['Sept 1965', RP], 'labelB': ['Today', RP],
  'wipes': [{'to': 'A', 'at': 'didnt-0.1', 'dur': 0.55}],
  'els': [{'el': 'title', 'top': 262, 'items': [{'kicker': 'The Gateway Arch', 'text': "Didn't fit", 'c': 'cu'}]}]}
hfs = [
 {'tpl': 'photo', 'src': 'june', 'pos': '50% 50%', 'enter': 'whip', 'zoom': [1.0, 1.06], 'label': ['June 1965', RP], 'labelY': 1030,
  'els': [{'el': 'counter', 'kicker': 'Height', 'at': '630', 'to': 630, 'unit': ' ft', 'dur': 0.8, 'ticks': 8},
          {'el': 'sub', 'text': 'Two legs · one gap at the top', 'at': 'legs'}]},
 {'tpl': 'card', 'src': 'sept', 'label': ['Sept 1965', RP], 'flood': 'radial-gradient(120% 70% at 50% 45%, #2A2016 0%, #120E0A 55%, #090807 100%)',
  'els': [{'el': 'counter', 'kicker': 'The keystone', 'at': 'ten', 'to': 10, 'unit': ' tons', 'dur': 0.6, 'ticks': 6, 'top': 250},
          {'el': 'sub', 'text': 'Gap at the top · 8.5 ft', 'at': '85foot'}]},
 {'tpl': 'plain', 'flood': 'radial-gradient(120% 70% at 50% 40%, #2B1A10 0%, #120B08 60%, #080605 100%)',
  'els': [{'el': 'title', 'kicker': 'Oct 28, 1965', 'text': 'Too tight', 'c': 'rd', 'size': 230, 'at': 'shrank-0.1'},
          {'el': 'bars', 'top': 520, 'label': ['Gap at the top', 'Graphic'], 'labelY': 450, 'rows': [
            {'label': 'Planned', 'value': 102, 'show': '102 in', 'c': 'linear-gradient(90deg,#5E7F96,#8FC3E6)', 'at': 'heat'},
            {'label': 'After the heat', 'value': 97, 'show': '97 in', 'c': 'linear-gradient(90deg,#9C4E22,#E9A04F)', 'at': 'gap'}]},
          {'el': 'stamp', 'text': '−5 in', 'at': 'inches', 'x': 560, 'y': 860, 'size': 140, 'color': '#FF5A4E'}]},
 {'tpl': 'photo', 'src': 'south', 'pos': '50% 50%', 'enter': 'zoom', 'zoom': [1.0, 1.08], 'label': ['South leg', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': 'The fix', 'text': 'Fire hoses', 'c': 'vg', 'size': 230, 'at': 'fire-0.1'},
          {'el': 'chip', 'text': ['Cooled steel', 'contracts'], 'y': 560, 'at': 'cooled', 'fx': 'slide'}]},
 {'tpl': 'photo', 'src': 'top', 'pos': '50% 40%', 'enter': 'vwhip', 'zoom': [1.0, 1.06], 'label': ['Top of the arch', RP], 'labelY': 1030,
  'els': [{'el': 'counter', 'kicker': 'To spare', 'at': 'six', 'to': 6, 'unit': ' in', 'dur': 0.5, 'ticks': 5, 'out': 'jack-0.2'},
          {'el': 'stamp', 'text': 'Jack: 6 ft', 'at': 'jack', 'x': 200, 'y': 520, 'size': 150, 'color': '#E9A04F'},
          {'el': 'ab', 'q': 'Which trick made it fit?', 'title': '<span class="vg">Hoses</span> or <span class="cu">jack</span>',
           'a': {'src': 'south', 'label': 'Hoses', 'sub': 'south leg', 'img': {'w': 600, 'x': -60, 'y': 0}, 'pulse': 'hoses'},
           'b': {'src': 'june', 'label': 'Jack', 'sub': '1965 photo', 'img': {'w': 1100, 'x': -330, 'y': 0}, 'pulse': 'jack#2'}},
          {'el': 'loop'}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/206.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
