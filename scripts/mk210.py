#!/usr/bin/env python3
"""#210 REEL v2 (E8), HyperFrames kit: the first jack-o'-lanterns were turnips. 31 Oct 2026 (Halloween). voice: gemini.
Facts: English Wikipedia "Jack-o'-lantern" (Oct 2026, catalog-75 articles.md)
- "a carved lantern, most commonly made from a pumpkin, or formerly a root vegetable such as a mangelwurzel, rutabaga or turnip."
- "It is believed that the custom of making jack-o'-lanterns at Halloween time began in Ireland and Britain." "In the 19th century,
  'turnips or mangel wurzels, hollowed out to act as lanterns and often carved with grotesque faces,' were used on Halloween in parts
  of England, Ireland, Wales and Scotland."
- "sometimes they were set on windowsills to keep harmful spirits out of one's home."
- "Its name comes from the phenomenon of strange lights flickering over peat bogs, called jack-o'-lanterns (also known as
  will-o'-the-wisps)."
- "the Irish legend of Stingy Jack, a drunkard who, after deceiving people throughout his life and even Satan, is doomed to roam the
  Earth with only a hollowed turnip to light his way."
- "Jack-o'-lanterns carved from pumpkins are a yearly Halloween tradition that developed in the United States when Celtic influenced
  immigrants brought their root vegetable carving traditions with them."
Hook (scripts/reel/hookscore.py): "The first jack-o'-lanterns weren't pumpkins. You'd carve turnips." 80.0 STRONG (formula 22 Contrarian Flip).
"""
import json
RP = 'Real photo'
E = {
 'ep': 210, 'title': "The first jack-o'-lanterns were turnips", 'format': 'reel2', 'hook_formula': '22 Contrarian Flip',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ["WEREN'T PUMPKINS", 'TURNIPS'],
 'cta': {'q': 'Which would you carve?', 'a': 'TURNIP', 'b': 'PUMPKIN'},
 'source': "https://en.wikipedia.org/wiki/Jack-o'-lantern",
 'vo_open': [{'at': 0.15,
   'text': "The first jack-o'-lanterns weren't pumpkins. You'd carve turnips.",
   'cap': "The first *jack-o'-lanterns* weren't *pumpkins.* You'd carve *turnips.*",
   'de': 'Die ersten Halloween-Laternen waren keine Kürbisse. Man schnitzte Rüben.',
   'es': 'Las primeras linternas de Halloween no eran calabazas. Se tallaban nabos.',
   'fr': "Les premières lanternes d'Halloween n'étaient pas des citrouilles. On sculptait des navets."}],
 'scenes': [
  {'dur': 1.0, 'beat': 'carve', 'vo': [
    dict(at=0.2, text='In the eighteen hundreds, parts of Ireland, Scotland, Wales and England carved turnips.',
      cap='In the *1800s,* parts of *Ireland, Scotland, Wales* and *England* carved *turnips.*',
      de='Im neunzehnten Jahrhundert schnitzte man in Teilen Irlands, Schottlands, Wales und Englands Rüben.',
      es='En el siglo diecinueve, en partes de Irlanda, Escocia, Gales e Inglaterra se tallaban nabos.',
      fr="Au dix-neuvième siècle, dans une partie de l'Irlande, de l'Écosse, du pays de Galles et de l'Angleterre, on sculptait des navets."),
    dict(at=0.1, text='Hollowed out, with grotesque faces.',
      cap='*Hollowed out,* with *grotesque faces.*',
      de='Ausgehöhlt, mit grotesken Fratzen.',
      es='Vaciados, con caras grotescas.',
      fr='Évidés, avec des visages grotesques.')]},
  {'dur': 1.0, 'beat': 'spirits', 'vo': [dict(at=0.2,
    text='Some were set on windowsills to keep harmful spirits out.',
    cap='Some were set on *windowsills* to keep *harmful spirits* out.',
    de='Manche standen auf der Fensterbank, um böse Geister fernzuhalten.',
    es='Algunos se ponían en las ventanas para mantener fuera a los malos espíritus.',
    fr='Certains étaient posés sur le rebord des fenêtres pour éloigner les esprits malfaisants.')]},
  {'dur': 1.0, 'beat': 'name', 'vo': [dict(at=0.2,
    text='The name came from strange lights flickering over peat bogs.',
    cap='The *name* came from strange *lights* flickering over *peat bogs.*',
    de='Der Name kam von seltsamen Lichtern, die über Torfmooren flackerten.',
    es='El nombre venía de extrañas luces que parpadeaban sobre las turberas.',
    fr='Le nom venait d’étranges lueurs qui vacillaient au-dessus des tourbières.')]},
  {'dur': 1.0, 'beat': 'jack', 'vo': [
    dict(at=0.2, text='In Irish legend, Stingy Jack even tricked the Devil.',
      cap='In Irish legend, *Stingy Jack* even *tricked the Devil.*',
      de='In einer irischen Legende trickste der geizige Jack sogar den Teufel aus.',
      es='En una leyenda irlandesa, Jack el Tacaño engañó incluso al diablo.',
      fr='Dans une légende irlandaise, Jack le Radin a même dupé le Diable.'),
    dict(at=0.1, text='He was doomed to roam the Earth, lit by a hollowed turnip.',
      cap='He was *doomed* to *roam the Earth,* lit by a *hollowed turnip.*',
      de='Er war verdammt, über die Erde zu wandern, nur mit einer ausgehöhlten Rübe als Licht.',
      es='Quedó condenado a vagar por la Tierra, alumbrado por un nabo hueco.',
      fr='Il fut condamné à errer sur Terre, éclairé par un navet évidé.')]},
  {'dur': 1.0, 'beat': 'pumpkin', 'vo': [
    dict(at=0.2, text='Immigrants brought the custom to America, where it moved to the pumpkin.',
      cap='*Immigrants* brought the custom to *America,* where it moved to the *pumpkin.*',
      de='Einwanderer brachten den Brauch nach Amerika, und dort wurde daraus der Kürbis.',
      es='Los inmigrantes llevaron la costumbre a América, donde pasó a la calabaza.',
      fr="Les immigrés ont apporté la coutume en Amérique, où elle est passée à la citrouille."),
    dict(at=0.15, text='Turnip or pumpkin: which would you carve? Comment turnip or pumpkin.', cta=True,
      cap='*Turnip* or *pumpkin:* which would you carve? Comment *turnip* or *pumpkin.*',
      de='Rübe oder Kürbis: Was würdest du schnitzen? Schreib Rübe oder Kürbis.',
      es='Nabo o calabaza: ¿cuál tallarías tú? Comenta nabo o calabaza.',
      fr='Navet ou citrouille : lequel sculpterais-tu ? Commente navet ou citrouille.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Horror Suspense.ogg', 'from': 0, 'len': 60},
  {'id': 'irish', 'file': "File:Traditional Irish halloween Jack-o'-lantern.jpg"},
  {'id': 'pumpkin', 'file': 'File:Jack-O-Lantern at night.jpg'},
  {'id': 'tumshie', 'file': 'File:Halloween Tumshie 2022.jpg'},
  {'id': 'cornish', 'file': "File:Traditional Cornish Jack-o'-Lantern made from a turnip.jpg"},
  {'id': 'samhuinn', 'file': 'File:Samhuinn carved turnip at University of Edinburgh editathon - 31st October 2016 01.jpg'},
  {'id': 'stingy', 'file': "File:Traditional Irish Halloween, Stingy Jack, Oíche Shamhna, Jack O'Lantern Turnip.jpg"},
  {'id': 'pumpkins', 'file': 'File:Jack-o-lantern 2.jpg'},
 ],
}

# ---- HyperFrames kit (scripts/hf_kit.py)
E['hf'] = {'theme': {'cu': '#F08A2E', 'vg': '#E6D9A6', 'capcu': '#F59A44', 'capvg': '#EFE3B4', 'chipvg': '#EFE3B4', 'chipcu': '#F59A44', 'p0': '#F08A2E'},
           'caps': {'cu': ['pumpkin', 'america', 'jack'], 'vg': ['turnip', 'hollowed', 'ireland', 'scotland', 'wales', 'england', 'peat', 'lights'],
                    'rd': ['grotesque', 'harmful', 'spirits', 'devil', 'doomed']}}
E['hf_open'] = {'tpl': 'split', 'name': 'hook', 'a': 'irish', 'b': 'pumpkin',
  'imgA': {'w': 1492, 'x': -206, 'y': 0}, 'imgB': {'w': 2880, 'x': -900, 'y': 0},
  'labelA': ['Ireland, early 1900s', RP], 'labelB': ['Today', RP],
  'wipes': [{'to': 'A', 'at': 'turnips-0.15', 'dur': 0.55}],
  'els': [{'el': 'title', 'top': 262, 'items': [
    {'kicker': "The first jack-o'-lanterns", 'text': "Weren't pumpkins", 'c': 'cu', 'size': 200},
    {'kicker': "You'd carve", 'kat': 'youd', 'out_prev': 'youd-0.1', 'text': 'Turnips', 'c': 'vg', 'at': 'turnips-0.1'}]}]}
hfs = [
 {'tpl': 'photo', 'src': 'tumshie', 'pos': '50% 50%', 'enter': 'whip', 'zoom': [1.0, 1.08], 'label': ['Scottish turnip lantern', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': 'In the 1800s', 'text': 'Turnips', 'c': 'vg', 'size': 230, 'at': 'turnips-0.1', 'kat': '1800s-0.1', 'out': 'hollowed-0.15', 'out_fx': 'up'},
          {'el': 'title', 'kicker': 'Hollowed out', 'text': 'Grotesque faces', 'c': 'rd', 'size': 190, 'at': 'grotesque-0.1', 'kat': 'hollowed-0.05'},
          {'el': 'chip', 'text': 'Ireland', 'y': 560, 'x': 40, 'at': 'ireland-0.05'},
          {'el': 'chip', 'text': 'Scotland', 'y': 560, 'x': 230, 'at': 'scotland-0.05'},
          {'el': 'chip', 'text': 'Wales', 'y': 630, 'x': 40, 'at': 'wales-0.05'},
          {'el': 'chip', 'text': 'England', 'y': 630, 'x': 200, 'at': 'england-0.05'}]},
 {'tpl': 'photo', 'src': 'cornish', 'pos': '50% 50%', 'enter': 'zoom', 'zoom': [1.0, 1.08], 'label': ['Cornish turnip lantern', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': 'On the windowsill', 'text': 'Spirits out', 'c': 'rd', 'size': 230, 'at': 'spirits-0.1', 'kat': 'windowsills-0.1'}]},
 {'tpl': 'photo', 'src': 'samhuinn', 'pos': '50% 50%', 'enter': 'vwhip', 'zoom': [1.0, 1.06], 'label': ['Edinburgh, 2016', RP], 'labelY': 1030,
  'els': [{'el': 'glass', 'eyebrow': 'The name', 'line': 'Lights over <span class="vg">peat bogs</span>', 'at': 'name-0.1', 'lift': 120,
           'quote': "Jack-o'-lantern, also called will-o'-the-wisp"}]},
 {'tpl': 'photo', 'src': 'stingy', 'pos': '50% 40%', 'enter': 'iris', 'zoom': [1.0, 1.08], 'label': ['Irish turnip lantern', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'top': 262, 'items': [
    {'kicker': 'Irish legend', 'text': 'Stingy Jack', 'c': 'cu', 'at': 'stingy-0.1', 'kat': 'irish-0.1'},
    {'kicker': 'Doomed to', 'kat': 'doomed-0.05', 'out_prev': 'doomed-0.1', 'text': 'Roam the Earth', 'c': 'vg', 'size': 200, 'at': 'roam-0.1'}]}]},
 {'tpl': 'photo', 'src': 'pumpkins', 'pos': '50% 50%', 'enter': 'whip', 'zoom': [1.0, 1.08], 'label': ['Pumpkin lantern', RP], 'labelY': 1030,
  'els': [{'el': 'title', 'kicker': 'In America', 'text': 'Pumpkins', 'c': 'cu', 'size': 230, 'at': 'pumpkin-0.1', 'kat': 'america-0.1'},
          {'el': 'ab', 'q': 'Which would you carve?', 'title': '<span class="vg">Turnip</span> or <span class="cu">pumpkin</span>', 'size': 170,
           'a': {'src': 'irish', 'label': 'Turnip', 'sub': 'early 1900s', 'img': {'w': 560, 'x': -45, 'y': 0}, 'pulse': 'turnip'},
           'b': {'src': 'pumpkin', 'label': 'Pumpkin', 'sub': 'today', 'img': {'w': 1100, 'x': -320, 'y': 0}, 'pulse': 'pumpkin#2'}},
          {'el': 'loop'}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/210.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
