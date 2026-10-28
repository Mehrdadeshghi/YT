#!/usr/bin/env python3
"""#212 REEL v2 (E8), HyperFrames MOTION v2 (first episode of the quality upgrade), Target: Europe.
The Eiffel Tower was due to be dismantled in 1909 — radio saved it. voice: gemini.
Facts: English Wikipedia "Eiffel Tower" (Oct 2026, catalog-79 articles.md):
- "Eiffel was to receive all income from the commercial exploitation of the tower during the exhibition and for the next 20 years."
- "Originally commissioned as a temporary structure for the 1889 Exposition Universelle, Eiffel was slated for dismantling in 1909 ...
  the structure was spared from scheduled demolition due to its demonstrated utility in early 20th-century scientific and technological
  advancements, specifically radio telegraphy."
- protest of the artists: "... against the erection ... of this useless and monstrous Eiffel Tower ..."
- "From 1910, the astronomical clocks of the Paris Observatory sent the time to sea daily through the Eiffel Tower within a radius of
  5 000 km."  (5,000 km = 3,107 mi → "over three thousand miles")
- "In 1914, at the outbreak of World War I, a radio transmitter located in the tower jammed German radio communications, seriously
  hindering their advance on Paris"
Hook (scripts/reel/hookscore.py): "Your Eiffel Tower should have been gone by 1909." 80.8 STRONG (formula 19 The Deadline).
Motion: real footage (Edison/Lumière 1898-1900 PD, drone 4K, night), stop-motion of Féau's 1888 photos, 2.5D parallax of Durandelle's
1888 photo, 3D globe (NASA Blue Marble) with the 5,000 km time-signal ring, kinetic typography, velocity-matched seams.
"""
import json
RP, RF, GR, AN = 'Real photo', 'Real footage', 'Graphic', 'Animation'
E = {
 'ep': 212, 'title': 'The Eiffel Tower was supposed to come down in 1909', 'format': 'reel2', 'hook_formula': '19 The Deadline',
 'engine': 'hyperframes', 'motion': 'v2', 'target': 'Europe', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 190, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['EIFFEL TOWER', 'GONE BY 1909'],
 'cta': {'q': 'Tear it down in 1909?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Eiffel_Tower',
 'vo_open': [{'at': 0.15,
   'text': 'Your Eiffel Tower should have been gone by nineteen oh nine.',
   'cap': 'Your *Eiffel Tower* should have been *gone* by *1909.*',
   'de': 'Dein Eiffelturm hätte neunzehnhundertneun eigentlich verschwunden sein sollen.',
   'es': 'Tu Torre Eiffel debería haber desaparecido en mil novecientos nueve.',
   'fr': "Ta tour Eiffel aurait dû disparaître en mille neuf cent neuf."}],
 'scenes': [
  {'beat': 'temporary', 'vo': [
    dict(at=0.2, text="It was built for the eighteen eighty-nine World's Fair. Paris gave it twenty years.",
      cap="It was *built* for the *1889* World's Fair. Paris gave it *twenty years.*",
      de='Gebaut wurde er für die Weltausstellung achtzehnhundertneunundachtzig. Paris gab ihm zwanzig Jahre.',
      es='Se construyó para la Exposición Universal de mil ochocientos ochenta y nueve. París le dio veinte años.',
      fr="Elle a été construite pour l'Exposition universelle de mille huit cent quatre-vingt-neuf. Paris lui a donné vingt ans.")]},
  {'beat': 'hated', 'vo': [
    dict(at=0.15, text='Artists called it useless and monstrous.',
      cap='Artists called it *useless* and *monstrous.*',
      de='Künstler nannten ihn nutzlos und monströs.',
      es='Los artistas la llamaron inútil y monstruosa.',
      fr='Des artistes la jugeaient inutile et monstrueuse.')]},
  {'beat': 'radio', 'vo': [
    dict(at=0.15, text='So what saved it? Radio. The tower became a giant antenna.',
      cap='So what *saved* it? *Radio.* The tower became a giant *antenna.*',
      de='Was hat ihn gerettet? Funk. Der Turm wurde zur riesigen Antenne.',
      es='¿Y qué la salvó? La radio. La torre se convirtió en una antena gigante.',
      fr="Alors, qu'est-ce qui l'a sauvée ? La radio. La tour est devenue une antenne géante.")]},
  {'beat': 'time', 'vo': [
    dict(at=0.15, text='From nineteen ten, it sent the exact time out to sea, up to five thousand kilometres. That is over three thousand miles.',
      cap='From *1910,* it sent the exact *time* out to sea, up to *5,000 kilometres.* That is over *3,000 miles.*',
      de='Ab neunzehnhundertzehn funkte er die genaue Uhrzeit auf das Meer hinaus, bis zu fünftausend Kilometer weit.',
      es='Desde mil novecientos diez, enviaba la hora exacta al mar, hasta cinco mil kilómetros.',
      fr="Dès mille neuf cent dix, elle envoyait l'heure exacte en mer, jusqu'à cinq mille kilomètres.")]},
  {'beat': 'jammed', 'vo': [
    dict(at=0.15, text='In nineteen fourteen, it jammed German radio as their army closed in on Paris.',
      cap='In *1914,* it *jammed* German radio as their army closed in on *Paris.*',
      de='Neunzehnhundertvierzehn störte er den deutschen Funk, als deren Armee auf Paris vorrückte.',
      es='En mil novecientos catorce, interfirió la radio alemana mientras su ejército se acercaba a París.',
      fr="En mille neuf cent quatorze, elle brouillait la radio allemande alors que leur armée approchait de Paris.")]},
  {'beat': 'payoff', 'vo': [
    dict(at=0.15, text="Paris didn't keep it for its looks. It kept it for its antenna.",
      cap="Paris didn't keep it for its *looks.* It kept it for its *antenna.*",
      de='Paris behielt ihn nicht wegen seiner Schönheit. Sondern wegen seiner Antenne.',
      es='París no la conservó por su belleza. La conservó por su antena.',
      fr="Paris ne l'a pas gardée pour sa beauté. Elle l'a gardée pour son antenne."),
    dict(at=0.15, text='Tear it down in nineteen oh nine: yes or no? Comment yes or no.', cta=True,
      cap='Tear it down in *1909:* *yes* or *no?* Comment *yes* or *no.*',
      de='Abreißen, neunzehnhundertneun: ja oder nein? Schreib ja oder nein.',
      es='¿Derribarla en mil novecientos nueve: sí o no? Comenta sí o no.',
      fr='La démolir en mille neuf cent neuf : oui ou non ? Commente oui ou non.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Gymnopedie No. 1..ogg', 'from': 0, 'len': 60, 'gain': 1.6},
  {'id': 'night', 'video': 'File:Vido al la Eiffel-turo 02.webm', 'from': 0, 'len': 6},
  {'id': 'climb', 'video': 'File:Eiffel Tower Drone 4k-Qx c1X3zfEc-313-251.webm', 'from': 72, 'len': 18, 'fps': 15, 'w': 1920},
  {'id': 'lumiere', 'video': "File:Vue Lumière No 992 - Panorama pendant l'ascension de la Tour Eiffel (1898).ogv", 'from': 0.5, 'len': 7},
  {'id': 'paris', 'video': 'File:Timelapse Tour Eiffel à Paris.webm', 'from': 0, 'len': 10, 'w': 1920},
  {'id': 'apr', 'file': 'File:Eiffel Tower 1888-04-10.jpg'},
  {'id': 'may', 'file': 'File:Eiffel Tower 1888-05-10.jpg'},
  {'id': 'oct', 'file': 'File:Eiffel Tower 1888-10-14.jpg'},
  {'id': 'nov', 'file': 'File:Eiffel Tower 1888-11-14.jpg'},
  {'id': 'dec', 'file': 'File:Eiffel Tower 1888-12-26.jpg'},
  {'id': 'durandelle', 'file': 'File:Louis-Emile Durandelle, The Eiffel Tower - State of the Construction, 1888, grayscale.jpg'},
  {'id': 'antenna', 'file': 'File:Antenne tour Eiffel 1914.jpg'},
  {'id': 'earth', 'file': 'File:Whole world - land and oceans.jpg'},
 ],
}

# ---- HyperFrames kit, MOTION v2 (scripts/hf_kit.py)
E['hf'] = {'motion': True,
           'theme': {'cu': '#E9B45A', 'vg': '#9CC3E6', 'capcu': '#F2C46E', 'capvg': '#B5D3EE', 'chipvg': '#B5D3EE', 'chipcu': '#F2C46E', 'p0': '#E9B45A'},
           'caps': {'cu': ['eiffel', '1889', 'twenty', 'saved', 'radio', 'antenna', 'time', 'yes'], 'vg': ['1910', '5000', '3000', 'paris'],
                    'rd': ['gone', '1909', 'useless', 'monstrous', 'jammed', '1914', 'no', 'looks']},
           'derive': [{'fn': 'cutout', 'src': 'durandelle', 'id': 'dur_fg', 'method': 'sky', 'thr': 150, 'flat': 22}]}

E['hf_open'] = {'tpl': 'footage', 'name': 'hook',
  'clips': [{'src': 'night', 'label': ['Eiffel Tower at night', RF], 'cam': [{'s': 1.12, 'y': 60}, {'at': 0.2, 's': 1.0, 'y': 0, 'dur': 2.2, 'ease': 'power2.out'}]}],
  'els': [{'el': 'kinetic', 'lines': [{'text': 'Gone by', 'top': 210, 'size': 120},
                                      {'text': '*1909*', 'at': '1909-0.1', 'top': 320, 'size': 300, 'ac': 'rd', 'stamp': True}]},
          {'el': 'stamp', 'text': 'To be dismantled', 'at': 'gone-0.05', 'x': 150, 'y': 700, 'size': 96, 'rot': -7}]}

hfs = [
 # S1 stop-motion of the 1888 construction (Féau), the 20-year deal counts up beside it
 {'tpl': 'flip', 'seam': 'left', 'box': {'x': 60, 'y': 250, 'w': 470, 'h': 1050}, 'label': ['T. Féau, 1888', RP],
  'frames': [{'src': 'apr'}, {'src': 'may', 'at': 'built'}, {'src': 'oct', 'at': '1889-0.05'}, {'src': 'nov', 'at': 'world'},
             {'src': 'dec', 'at': 'fair'}],
  'cam': [{'s': 1.0}, {'at': 'paris', 's': 1.03, 'dur': 'end', 'ease': 'power1.inOut'}],
  'els': [{'el': 'kinetic', 'lines': [{'text': 'Built|for', 'at': 'built-0.05', 'x': 570, 'w': 470, 'top': 330, 'size': 120},
                                      {'text': '*1889*', 'at': '1889-0.05', 'x': 570, 'w': 470, 'top': 560, 'size': 210}]},
          {'el': 'counter', 'kicker': 'Paris gave it', 'at': 'twenty-0.05', 'to': 20, 'unit': ' yrs', 'top': 860, 'size': 200, 'dur': 0.8, 'ticks': 8,
           'c': 'cu', 'box_x': 560, 'box_w': 500}]},
 # S2 2.5D parallax of Durandelle's 1888 photo; the protest words hit
 {'tpl': 'parallax', 'seam': 'left', 'src': 'durandelle', 'fg': 'dur_fg', 'img': {'w': 1500, 'x': -210, 'y': -40}, 'label': ['L.-E. Durandelle, 1888', RP],
  'cam': [{'s': 1.0, 'x': 60}, {'at': 0.0, 's': 1.12, 'x': -60, 'y': 40, 'dur': 'end', 'ease': 'power1.inOut'}],
  'els': [{'el': 'kinetic', 'lines': [{'text': '*Useless*', 'at': 'useless-0.05', 'out': 'monstrous-0.02', 'top': 280, 'size': 230, 'ac': 'rd'},
                                      {'text': '*Monstrous*', 'at': 'monstrous-0.02', 'top': 280, 'size': 230, 'ac': 'rd', 'stamp': True}]},
          {'el': 'chip', 'text': ['Artists’ protest, 1887', 'Quote'], 'x': 40, 'y': 520, 'at': 'artists', 'fx': 'slide'}]},
 # S3 the drone climbs the real tower to its antenna (2x speed), hard cut to the 1914 antenna photo on "antenna"
 {'tpl': 'footage', 'seam': 'up',
  'clips': [{'src': 'climb', 'label': ['Eiffel Tower, drone', RF], 'cam': [{'s': 1.05}, {'at': 'radio', 's': 1.18, 'dur': 0.5, 'ease': 'expo.out', 'sfx': 'thump'}]},
            {'src': 'antenna', 'at': 'antenna-0.08', 'fit': 'card', 'ar': 1162 / 1181, 'w': 860, 'y': 760, 'label': ['Radio antenna, 1914', RP],
             'flood': 'radial-gradient(120% 70% at 50% 45%, #2B2418 0%, #120F0A 60%, #080706 100%)', 'grain': True,
             'cam': [{'s': 1.15}, {'at': 'antenna', 's': 1.0, 'dur': 0.6, 'ease': 'expo.out'}]}],
  'els': [{'el': 'kinetic', 'lines': [{'text': 'Saved by', 'at': 'saved-0.05', 'out': 'radio-0.02', 'top': 230, 'size': 150},
                                      {'text': '*Radio*', 'at': 'radio-0.02', 'top': 230, 'size': 260, 'ac': 'cu', 'stamp': True}]}]},
 # S4 3D globe: Paris pin, the 5,000 km time-signal ring rolls out over the sea
 {'tpl': 'plain', 'seam': 'push', 'flood': '#05080F',
  'els': [{'el': 'space'},
          {'el': 'globe', 'tex': 'earth', 'box': {'x': 0, 'y': 0, 'w': 1080, 'h': 1500}, 'accent': '#F2B544',
           'keys': [{'lon': 2.35, 'lat': 47, 'r': 900, 'cy': 820}, {'at': 0.1, 'lon': -8, 'lat': 44, 'r': 470, 'cy': 820, 'dur': 1.6},
                    {'at': '5000-0.2', 'lon': -12, 'lat': 40, 'r': 400, 'cy': 820, 'dur': 1.4}],
           'pins': [{'lon': 2.35, 'lat': 48.86, 'at': 'time-0.1', 'text': 'Paris'}],
           'rings': [{'c': [2.35, 48.86], 'km': 5000, 'at': 'sea-0.2', 'dur': 1.6, 'sfx': 'sonar'}],
           'label': ['NASA Blue Marble · range', GR], 'labelY': 1030},
          {'el': 'kinetic', 'lines': [{'text': 'From *1910*', 'at': '1910-0.05', 'top': 220, 'size': 150, 'ac': 'vg'}]},
          {'el': 'counter', 'kicker': 'Time signal range', 'at': '5000-0.05', 'to': 5000, 'unit': ' km', 'top': 1110, 'size': 150, 'dur': 0.9, 'ticks': 8, 'c': 'cu'},
          {'el': 'chip', 'text': ['Over 3,000 miles', 'Paris Observatory'], 'x': 330, 'y': 1270, 'at': '3000-0.1', 'fx': 'stamp', 'sfx': 'pop'}]},
 # S5 1898 Lumière footage climbing the tower (archival card), JAMMED
 {'tpl': 'footage', 'seam': 'left',
  'clips': [{'src': 'lumiere', 'fit': 'band', 'ar': 4 / 3, 'w': 1080, 'y': 860, 'grain': True, 'label': ['Lumière film, 1898', RF],
             'cam': [{'s': 1.0}, {'at': 'jammed', 's': 1.12, 'dur': 0.35, 'ease': 'expo.out', 'sfx': 'zap', 'gain': 0.7}]}],
  'els': [{'el': 'kinetic', 'lines': [{'text': '*1914*', 'at': '1914-0.05', 'top': 230, 'size': 230, 'ac': 'rd'}]},
          {'el': 'stamp', 'text': 'Jammed', 'at': 'jammed-0.1', 'x': 250, 'y': 640, 'size': 170, 'rot': -8},
          {'el': 'chip', 'text': ['German radio', 'blocked'], 'cls': 'myth', 'x': 40, 'y': 1120, 'at': 'german', 'fx': 'slide', 'sfx': 'glitch', 'gain': 0.5}]},
 # S6 ARRIVAL (inverse zoom): Paris today, the opinion line, then the one ask + loop
 {'tpl': 'footage', 'seam': 'pull',
  'clips': [{'src': 'paris', 'label': ['Paris, timelapse', RF], 'cam': [{'s': 1.1}, {'at': 'antenna', 's': 1.0, 'dur': 1.0, 'ease': 'power2.out'}]}],
  'els': [{'el': 'kinetic', 'lines': [{'text': 'Not for its|*looks*', 'at': 'looks-0.4', 'out': 'antenna-0.05', 'top': 240, 'size': 170, 'ac': 'rd'},
                                      {'text': 'For its|*antenna*', 'at': 'antenna-0.05', 'top': 240, 'size': 170, 'ac': 'cu'}]},
          {'el': 'ab', 'q': 'Tear it down in 1909?', 'title': '<span class="rd">Yes</span> or <span class="cu">No</span>', 'size': 170,
           'a': {'src': 'durandelle', 'label': 'Yes', 'sub': 'tear it down', 'img': {'w': 760, 'x': -150, 'y': -60}, 'pulse': 'yes'},
           'b': {'src': 'antenna', 'label': 'No', 'sub': 'keep it', 'img': {'w': 620, 'x': -75, 'y': -10}, 'pulse': 'no'}},
          {'el': 'loop'}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/212.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
