#!/usr/bin/env python3
"""#209 REEL v2 (E8), HyperFrames kit: the Old Man of the Lake, a tree floating upright in Crater Lake. 31 Oct 2026. voice: gemini.
Facts: English Wikipedia "Crater Lake" + "Old Man of the Lake" (Oct 2026, catalog-75 articles.md)
- Crater Lake, Oregon: "No rivers flow into or out of the lake; the evaporation is compensated for by rain and snowfall";
  "With a depth of 1,949 feet (594 m), the lake is the deepest in the United States."
- Old Man of the Lake: "a 30-foot (9 m) tall tree trunk ... that has been bobbing vertically in Crater Lake ... since at least 1896";
  "stands approximately 4 feet (1.2 m) above the water"; "During the period of observation in 1938 [July 1 - September 30], the Old
  Man traveled at least 62.1 miles (99.9 km)." "In 1988 ... the scientists decided to tie the Old Man off ... Upon immobilizing the log,
  the weather went from clear to stormy. After it started snowing in August, they released the Old Man. Soon after, the weather
  cleared up, encouraging superstitions."
Hook (scripts/reel/hookscore.py): "You've never seen this: a tree floating upright since 1896." 77.8 STRONG (formula 18 Cold Open Demo).
"""
import json
RP, GR = 'Real photo', 'Graphic'
E = {
 'ep': 209, 'title': 'The tree that floats upright in Crater Lake', 'format': 'reel2', 'hook_formula': '18 Cold Open Demo',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['FLOATING UPRIGHT', 'SINCE 1896'],
 'cta': {'q': 'Coincidence or curse?', 'a': 'COINCIDENCE', 'b': 'CURSE'},
 'source': 'https://en.wikipedia.org/wiki/Old_Man_of_the_Lake',
 'vo_open': [{'at': 0.15,
   'text': "You've never seen this: a tree floating upright since eighteen ninety-six.",
   'cap': "You've never seen this: a *tree* floating *upright* since *1896.*",
   'de': 'So etwas hast du noch nie gesehen: ein Baum, der seit achtzehnhundertsechsundneunzig aufrecht im Wasser treibt.',
   'es': 'Nunca has visto esto: un árbol que flota de pie desde mil ochocientos noventa y seis.',
   'fr': "Tu n'as jamais vu ça : un arbre qui flotte debout depuis mille huit cent quatre-vingt-seize."}],
 'scenes': [
  {'dur': 1.0, 'beat': 'deep', 'vo': [dict(at=0.2,
    text='Crater Lake, Oregon: one thousand nine hundred forty-nine feet, the deepest lake in the US.',
    cap='*Crater Lake,* Oregon: *1,949 feet,* the *deepest lake* in the US.',
    de='Crater Lake in Oregon: fünfhundertvierundneunzig Meter, der tiefste See der USA.',
    es='Crater Lake, Oregón: quinientos noventa y cuatro metros, el lago más profundo de Estados Unidos.',
    fr='Crater Lake, dans l’Oregon : cinq cent quatre-vingt-quatorze mètres, le lac le plus profond des États-Unis.')]},
  {'dur': 1.0, 'beat': 'fill', 'vo': [dict(at=0.2,
    text='No rivers flow in or out. Only rain and snow fill it.',
    cap='No *rivers* flow in or out. Only *rain* and *snow* fill it.',
    de='Kein Fluss fließt hinein oder hinaus. Nur Regen und Schnee füllen ihn.',
    es='Ningún río entra ni sale. Solo la lluvia y la nieve lo llenan.',
    fr="Aucune rivière n'y entre ni n'en sort. Seules la pluie et la neige le remplissent.")]},
  {'dur': 1.0, 'beat': 'oldman', 'vo': [
    dict(at=0.2, text='The Old Man of the Lake: a thirty-foot trunk.',
      cap='The *Old Man of the Lake:* a *30-foot* trunk.',
      de='Der Old Man of the Lake: ein neun Meter langer Baumstamm.',
      es='El Viejo del Lago: un tronco de nueve metros.',
      fr='Le Vieil Homme du Lac : un tronc de neuf mètres.'),
    dict(at=0.1, text='About four feet stand above the water.',
      cap='About *four feet* stand *above the water.*',
      de='Etwa ein Meter zwanzig ragt aus dem Wasser.',
      es='Alrededor de un metro veinte sobresale del agua.',
      fr="Environ un mètre vingt dépasse de l'eau.")]},
  {'dur': 1.0, 'beat': 'drift', 'vo': [dict(at=0.2,
    text='In the summer of nineteen thirty-eight, it drifted at least sixty-two miles.',
    cap='In the summer of *1938,* it *drifted* at least *62 miles.*',
    de='Im Sommer neunzehnhundertachtunddreißig trieb er mindestens hundert Kilometer weit.',
    es='En el verano de mil novecientos treinta y ocho, recorrió al menos cien kilómetros.',
    fr='À l’été mille neuf cent trente-huit, il a dérivé sur au moins cent kilomètres.')]},
  {'dur': 1.0, 'beat': 'curse', 'vo': [
    dict(at=0.2, text='In nineteen eighty-eight, scientists tied it up. Then came storms, and snow in August.',
      cap='In *1988,* scientists *tied it up.* Then came *storms,* and *snow in August.*',
      de='Neunzehnhundertachtundachtzig banden Forscher ihn fest. Dann kamen Stürme und Schnee im August.',
      es='En mil novecientos ochenta y ocho, unos científicos lo ataron. Llegaron tormentas y nieve en agosto.',
      fr='En mille neuf cent quatre-vingt-huit, des scientifiques l’ont attaché. Puis sont venues les tempêtes, et la neige en août.'),
    dict(at=0.1, text='They let it go, and the sky cleared.',
      cap='They *let it go,* and the *sky cleared.*',
      de='Sie ließen ihn los, und der Himmel klarte auf.',
      es='Lo soltaron, y el cielo se despejó.',
      fr="Ils l'ont relâché, et le ciel s'est dégagé."),
    dict(at=0.15, text='A floating coincidence, or a curse? Comment coincidence or curse.', cta=True,
      cap='A floating *coincidence,* or a *curse?* Comment *coincidence* or *curse.*',
      de='Ein schwimmender Zufall oder ein Fluch des Sees? Schreib Zufall oder Fluch.',
      es='¿Una coincidencia flotante o una maldición del lago? Comenta coincidencia o maldición.',
      fr='Une coïncidence flottante, ou une malédiction du lac ? Commente coïncidence ou malédiction.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Winter Reflections.ogg', 'from': 0, 'len': 60},
  {'id': 'oldman', 'file': 'File:Crater Lake Old Man of the Lake.jpg'},
  {'id': 'oldman2', 'file': 'File:220 old man.JPG'},
  {'id': 'aerial', 'file': 'File:Aerial Crater Lake (cropped).jpg'},
  {'id': 'bluer', 'file': 'File:Bluer than Blue.jpg'},
  {'id': 'winter', 'file': 'File:Crater Lake in Winter 2, Crater Lake National Park.jpg'},
  {'id': 'snow', 'file': 'File:Crater Lake and Wizard Island with snow-covered caldera rim June 2025.jpg'},
 ],
}

# ---- HyperFrames kit (scripts/hf_kit.py)
E['hf'] = {'theme': {'cu': '#E8C36A', 'vg': '#5FB4F0', 'capcu': '#F2CF7C', 'capvg': '#86C8F5', 'chipvg': '#86C8F5', 'chipcu': '#F2CF7C', 'p0': '#E8C36A'},
           'caps': {'cu': ['1896', 'old', '30foot', 'four', '1938', '62', 'coincidence'], 'vg': ['deepest', 'crater', 'rain', 'snow', 'sky', 'upright'],
                    'rd': ['storms', 'curse', 'tied']}}
E['hf_open'] = {'tpl': 'photo', 'name': 'hook', 'src': 'oldman', 'pos': '18% 50%', 'enter': 'none', 'zoom': [1.0, 1.08],
  'label': ['Old Man of the Lake', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'top': 262, 'items': [{'kicker': 'Floating upright', 'text': 'Since 1896', 'c': 'vg'}]}]}
hfs = [
 {'tpl': 'photo', 'src': 'bluer', 'pos': '50% 50%', 'enter': 'whip', 'zoom': [1.0, 1.08], 'label': ['Crater Lake, Oregon', RP], 'labelY': 1030,
  'els': [{'el': 'counter', 'kicker': 'Deepest lake in the U.S.', 'at': '1949-0.1', 'to': 1949, 'unit': ' ft', 'dur': 1.0, 'ticks': 10}]},
 {'tpl': 'photo', 'src': 'winter', 'pos': '50% 50%', 'enter': 'zoom', 'zoom': [1.0, 1.06], 'label': ['Crater Lake in winter', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': 'Fed only by', 'text': 'Rain + snow', 'c': 'vg', 'size': 220, 'at': 'only-0.1'},
          {'el': 'chip', 'text': ['No rivers', 'in'], 'cls': 'myth', 'y': 560, 'x': 40, 'at': 'rivers-0.05', 'sfx': 'wrong', 'gain': 0.4},
          {'el': 'chip', 'text': ['No rivers', 'out'], 'cls': 'myth', 'y': 560, 'x': 360, 'at': 'out-0.05', 'sfx': 'wrong', 'gain': 0.4}]},
 {'tpl': 'photo', 'src': 'oldman2', 'pos': '50% 50%', 'enter': 'vwhip', 'zoom': [1.0, 1.06], 'label': ['Old Man of the Lake, 2005', RP], 'labelY': 1030,
  'els': [{'el': 'counter', 'kicker': 'Tree trunk', 'at': '30foot-0.1', 'to': 30, 'unit': ' ft', 'dur': 0.6, 'ticks': 6},
          {'el': 'ruler', 'at': 'four-0.1', 'sw': 120, 'fill_at': 'four', 'fill_from': 0, 'fill': 1, 'l1': '30 ft',
           'grad': 'linear-gradient(90deg,#3E7FB8,#86C8F5)', 'glow': 'rgba(134,200,245,.6)'},
          {'el': 'sub', 'text': '≈ 4 ft above the water', 'top': 610, 'at': 'above-0.1'}]},
 {'tpl': 'card', 'src': 'aerial', 'label': ['Crater Lake from the air', RP], 'flood': 'radial-gradient(120% 70% at 50% 45%, #0E2A3E 0%, #07141E 55%, #05090D 100%)',
  'els': [{'el': 'counter', 'kicker': 'Summer 1938 · at least', 'at': '62-0.1', 'to': 62, 'unit': ' miles', 'dur': 0.8, 'ticks': 8, 'top': 250}]},
 {'tpl': 'photo', 'src': 'snow', 'pos': '50% 50%', 'enter': 'iris', 'zoom': [1.0, 1.08], 'label': ['Crater Lake with snow', RP], 'labelY': 1030,
  'els': [{'el': 'chip', 'text': ['1988', 'tied up'], 'y': 560, 'at': 'tied-0.05', 'fx': 'slide'},
          {'el': 'stamp', 'text': 'Snow in August', 'at': 'august-0.2', 'x': 110, 'y': 300, 'size': 130, 'color': '#86C8F5'},
          {'el': 'chip', 'text': ['Let go', 'sky cleared'], 'cls': 'done', 'y': 640, 'at': 'sky-0.05', 'fx': 'stamp', 'sfx': 'ding', 'gain': 0.6},
          {'el': 'ab', 'q': 'What was it?', 'title': '<span class="cu">Coincidence</span> or <span class="rd">curse</span>', 'size': 150,
           'a': {'src': 'oldman', 'label': 'Coincidence', 'sub': 'real photo', 'img': {'w': 1100, 'x': -330, 'y': 0}, 'pulse': 'coincidence'},
           'b': {'src': 'snow', 'label': 'Curse', 'sub': 'real photo', 'img': {'w': 1100, 'x': -330, 'y': 0}, 'pulse': 'curse'}},
          {'el': 'loop'}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/209.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
