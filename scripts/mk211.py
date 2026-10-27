#!/usr/bin/env python3
"""#211 REEL v2 (E8), HyperFrames kit: the Brooklyn Bridge was finished from a bedroom. Oct/Nov 2026. voice: gemini.
Facts: English Wikipedia "Brooklyn Bridge" (Oct 2026, catalog-77 articles.md)
- "In June 1869 ... Roebling sustained a crush injury to his foot when a ferry pinned it against a piling. After amputation of his
  crushed toes, he developed a tetanus infection that left him incapacitated and resulted in his death the following month.
  Washington Roebling, John Roebling's 32-year-old son, was then hired to fill his father's role."
- "decompression sickness ... first called 'caisson disease'"; "Washington Roebling himself suffered a paralyzing injury as a result
  of caisson disease ... directing 'the completion of the bridge through a telescope from his bedroom.' His wife, Emily Warren Roebling
  ... understood mathematics, calculations of catenary curves, strengths of materials, bridge specifications, and the intricacies of
  cable construction. She spent the next 11 years helping supervise the bridge's construction, performing much of the chief
  engineer's duties, including day-to-day supervision and project management."
- "The New York and Brooklyn Bridge was opened for use on May 24, 1883 ... Officially, Emily Warren Roebling was the first to cross."
Hook (scripts/reel/hookscore.py): "Nobody tells you the Brooklyn Bridge was finished from a bedroom." 83.0 STRONG (formula 3 Nobody Tells You).
"""
import json
RP, RF, IL = 'Real photo', 'Real footage', 'Illustration'
E = {
 'ep': 211, 'title': 'The Brooklyn Bridge was finished from a bedroom', 'format': 'reel2', 'hook_formula': '3 Nobody Tells You',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['BROOKLYN BRIDGE', 'FROM A BEDROOM'],
 'cta': {'q': 'Who finished it?', 'a': 'WASHINGTON', 'b': 'EMILY'},
 'source': 'https://en.wikipedia.org/wiki/Brooklyn_Bridge',
 'vo_open': [{'at': 0.15,
   'text': 'Nobody tells you the Brooklyn Bridge was finished from a bedroom.',
   'cap': 'Nobody tells you the *Brooklyn Bridge* was finished from a *bedroom.*',
   'de': 'Kaum einer weiß: Die Brooklyn Bridge wurde aus einem Schlafzimmer heraus fertiggebaut.',
   'es': 'Nadie te cuenta que el puente de Brooklyn se terminó desde un dormitorio.',
   'fr': "Personne ne te dit que le pont de Brooklyn a été terminé depuis une chambre à coucher."}],
 'scenes': [
  {'dur': 1.0, 'beat': 'john', 'vo': [
    dict(at=0.2, text='Its designer, John Roebling, crushed his foot in eighteen sixty-nine.',
      cap='Its designer, *John Roebling,* crushed his *foot* in *1869.*',
      de='Ihr Planer, John Roebling, quetschte sich achtzehnhundertneunundsechzig den Fuß.',
      es='Su diseñador, John Roebling, se aplastó un pie en mil ochocientos sesenta y nueve.',
      fr='Son concepteur, John Roebling, se fait écraser le pied en mille huit cent soixante-neuf.'),
    dict(at=0.1, text='Tetanus killed him the next month.',
      cap='*Tetanus* killed him the *next month.*',
      de='Einen Monat später starb er an Tetanus.',
      es='El tétanos lo mató al mes siguiente.',
      fr='Le tétanos le tue le mois suivant.')]},
  {'dur': 1.0, 'beat': 'bends', 'vo': [dict(at=0.2,
    text='His son Washington took over, until the bends paralyzed him.',
    cap='His son *Washington* took over, until *the bends* paralyzed him.',
    de='Sein Sohn Washington übernahm, bis ihn die Taucherkrankheit lähmte.',
    es='Su hijo Washington tomó el relevo, hasta que la enfermedad del buzo lo paralizó.',
    fr='Son fils Washington prend la relève, jusqu’à ce que la maladie des caissons le paralyse.')]},
  {'dur': 1.0, 'beat': 'telescope', 'vo': [dict(at=0.2,
    text='So he watched the work through a telescope from his bedroom.',
    cap='So he watched the work through a *telescope* from his *bedroom.*',
    de='Also verfolgte er die Arbeit mit einem Fernrohr aus seinem Schlafzimmer.',
    es='Así que siguió la obra con un telescopio desde su dormitorio.',
    fr='Alors il suit le chantier au télescope depuis sa chambre.')]},
  {'dur': 1.0, 'beat': 'emily', 'vo': [
    dict(at=0.2, text='His wife Emily learned the math: catenary curves, material strength, cables.',
      cap='His wife *Emily* learned the math: *catenary curves, material strength, cables.*',
      de='Seine Frau Emily lernte die Mathematik: Kettenlinien, Materialfestigkeit, Kabel.',
      es='Su esposa Emily aprendió las matemáticas: catenarias, resistencia de materiales, cables.',
      fr='Sa femme Emily apprend les maths : chaînettes, résistance des matériaux, câbles.'),
    dict(at=0.1, text='For eleven years, she ran the site day to day.',
      cap='For *eleven years,* she *ran the site* day to day.',
      de='Elf Jahre lang leitete sie die Baustelle im Alltag.',
      es='Durante once años, dirigió la obra día a día.',
      fr='Pendant onze ans, elle dirige le chantier au quotidien.')]},
  {'dur': 1.0, 'beat': 'cross', 'vo': [
    dict(at=0.2, text='On May twenty-fourth, eighteen eighty-three, she was the first to cross.',
      cap='On *May 24, 1883,* she was the *first to cross.*',
      de='Am vierundzwanzigsten Mai achtzehnhundertdreiundachtzig ging sie als Erste hinüber.',
      es='El veinticuatro de mayo de mil ochocientos ochenta y tres, fue la primera en cruzarlo.',
      fr='Le vingt-quatre mai mille huit cent quatre-vingt-trois, elle est la première à le traverser.'),
    dict(at=0.15, text='Who really finished the bridge: Washington or Emily? Comment Washington or Emily.', cta=True,
      cap='Who really *finished* the bridge: *Washington* or *Emily?* Comment *Washington* or *Emily.*',
      de='Wer hat die Brücke wirklich fertiggebaut: Washington oder Emily? Schreib Washington oder Emily.',
      es='¿Quién terminó de verdad el puente: Washington o Emily? Comenta Washington o Emily.',
      fr='Qui a vraiment terminé le pont : Washington ou Emily ? Commente Washington ou Emily.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Fantasy Chamber Adventure by Rafael Krux.ogg', 'from': 0, 'len': 60},
  {'id': 'leslie', 'file': "File:1883 Frank Leslie's Illustrated Newspaper Brooklyn Bridge New York City.jpg"},
  {'id': 'john', 'file': 'File:John Augustus Roebling by unidentified photographer, c. 1869, albumen slver print, from the National Portrait Gallery - NPG-NPG 79 222.jpg'},
  {'id': 'caisson', 'file': 'File:AmCyc Caisson - Caisson of East River Bridge.jpg'},
  {'id': 'tower', 'file': 'File:Brooklyn Bridge Tower 1.jpg'},
  {'id': 'emily', 'file': 'File:Brooklyn Museum - Portrait of Emily Warren Roebling - Charles-Émile-Auguste Carolus-Duran.jpg'},
  {'id': 'washington', 'file': 'File:Brooklyn Museum - Portrait of Washington A. Roebling - Théobald Chartran.jpg'},
  {'id': 'film', 'video': 'File:New Brooklyn to New York via Brooklyn Bridge, no. 2 (1899).webm', 'from': 30, 'len': 7},
  {'id': 'night', 'file': 'File:Brooklyn Bridge walkway at night.jpg'},
 ],
}

# ---- HyperFrames kit (scripts/hf_kit.py)
E['hf'] = {'theme': {'cu': '#E2A85C', 'vg': '#9FC7E8', 'capcu': '#EDB86E', 'capvg': '#B3D4EE', 'chipvg': '#B3D4EE', 'chipcu': '#EDB86E', 'p0': '#E2A85C'},
           'caps': {'cu': ['brooklyn', 'bedroom', 'telescope', 'emily', 'eleven', 'first'], 'vg': ['catenary', 'material', 'cables', 'washington', 'may', '1883'],
                    'rd': ['crushed', 'tetanus', 'bends', 'paralyzed', 'foot']}}
E['hf_open'] = {'tpl': 'photo', 'name': 'hook', 'src': 'leslie', 'img': {'w': 1500, 'x': -210, 'y': -260}, 'enter': 'none', 'zoom': [1.0, 1.08],
  'label': ["Frank Leslie's, 1883", IL], 'labelY': 1030,
  'els': [{'el': 'title', 'top': 262, 'items': [{'kicker': 'The Brooklyn Bridge', 'text': 'From a bedroom', 'c': 'cu', 'size': 200}]}]}
hfs = [
 {'tpl': 'photo', 'src': 'john', 'pos': '50% 35%', 'enter': 'whip', 'zoom': [1.0, 1.06], 'label': ['John A. Roebling, c. 1869', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': '1869', 'text': 'Crushed foot', 'c': 'rd', 'size': 220, 'at': 'crushed-0.1', 'kat': '1869-0.1'},
          {'el': 'stamp', 'text': 'Tetanus', 'at': 'tetanus-0.1', 'x': 520, 'y': 520, 'size': 140}]},
 {'tpl': 'card', 'src': 'caisson', 'label': ['Caisson, East River Bridge', IL], 'flood': 'radial-gradient(120% 70% at 50% 45%, #2A2216 0%, #120F0A 55%, #090807 100%)',
  'els': [{'el': 'title', 'kicker': 'Washington Roebling', 'text': 'The bends', 'c': 'rd', 'size': 230, 'at': 'bends-0.1', 'kat': 'washington-0.1'},
          {'el': 'chip', 'in': 'card', 'text': ['Caisson disease', 'paralyzed'], 'cls': 'myth', 'x': 22, 'y': 86, 'at': 'paralyzed-0.1', 'fx': 'slide', 'sfx': 'wrong', 'gain': 0.5}]},
 {'tpl': 'card', 'src': 'washington', 'pos': '50% 40%', 'box': {'x': 240, 'y': 520, 'w': 600, 'h': 620}, 'label': ['Chartran portrait', 'Painting'], 'zoom': [1.0, 1.06], 'flood': 'radial-gradient(120% 70% at 50% 45%, #1F2A33 0%, #0E1318 55%, #07090C 100%)',
  'els': [{'el': 'title', 'kicker': 'Through a telescope', 'text': 'From his bed', 'c': 'cu', 'size': 220, 'at': 'bedroom-0.1', 'kat': 'telescope-0.1'}]},
 {'tpl': 'photo', 'src': 'emily', 'pos': '50% 20%', 'enter': 'zoom', 'zoom': [1.0, 1.06], 'label': ['Emily Warren Roebling, Carolus-Duran', 'Painting'], 'labelY': 1030,
  'els': [{'el': 'stack', 'top': 610, 'w': 620, 'label': ['What she learned', 'Graphic'], 'labelY': 545, 'label_at': 'math', 'layers': [
            {'text': 'Catenary curves', 'cls': 'l1', 'at': 'catenary-0.1'},
            {'text': 'Material strength', 'cls': 'l2', 'at': 'material-0.1'},
            {'text': 'Cables', 'cls': 'l3', 'at': 'cables-0.1'}]},
          {'el': 'counter', 'kicker': 'She ran the site', 'at': 'eleven-0.1', 'to': 11, 'unit': ' years', 'dur': 0.6, 'ticks': 6}]},
 {'tpl': 'card', 'src': 'film', 'label': ['Crossing the bridge, 1899', RF], 'flood': 'radial-gradient(120% 70% at 50% 45%, #1C2530 0%, #0D1218 55%, #07090C 100%)',
  'els': [{'el': 'title', 'kicker': 'May 24, 1883', 'text': 'First to cross', 'c': 'cu', 'size': 200, 'at': 'first-0.1', 'kat': 'may-0.1'},
          {'el': 'ab', 'q': 'Who really finished it?', 'title': '<span class="vg">Washington</span> or <span class="cu">Emily</span>', 'size': 160,
           'a': {'src': 'washington', 'label': 'Washington', 'sub': 'portrait', 'img': {'w': 520, 'x': -25, 'y': 0}, 'pulse': 'washington'},
           'b': {'src': 'emily', 'label': 'Emily', 'sub': 'portrait', 'img': {'w': 520, 'x': -25, 'y': 0}, 'pulse': 'emily'}},
          {'el': 'loop'}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/211.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
