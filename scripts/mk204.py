#!/usr/bin/env python3
"""#204 REEL v2 (experiment E8) — D. B. Cooper: $200,000, four parachutes, one night jump, never identified. 27 Oct 2026. Voice: gemini.
Hook formula 25 "Someone Else's Result" (hookscore 88.0 STRONG): "$200,000, four parachutes, one night jump. And you still don't know his name."
On screen "$200,000 / NEVER FOUND".
Facts: English Wikipedia "D. B. Cooper" (Oct 2026):
- November 24, 1971, alias "Dan Cooper", hijacked Northwest Orient Flight 305, a Boeing 727, Portland → Seattle; told the crew he
  had a bomb ("I have a bomb in my briefcase"); demanded $200,000 and four parachutes upon landing in Seattle.
- Released the passengers in Seattle for the money and parachutes; took off again (around 7:40 pm), opened the aft door, deployed
  the airstair and parachuted over a remote, heavily wooded area of Southwest Washington; "moonless night".
- 1980: eight-year-old Brian Ingram found $6,000 of the ransom on the Columbia River bank (Tena Bar); the rest was never recovered.
- "His true identity and fate remain unknown"; "the only documented unsolved case of air piracy in the history of commercial aviation".
Media: FBI sketches, wanted poster, ticket and recovered bills (public domain, U.S. Government); Northwest Orient 727 photos
(CC BY-SA 2.0 / CC BY 2.5); drawn graphics labelled GRAPHIC."""
import json

def SHOW(text, nums):
    """caption tokens: spoken number words -> digits ("~" merges a token into the previous one)"""
    tk = text.split(' '); out = list(tk); low = [t.lower() for t in tk]
    for ph, dg in nums.items():
        p = ph.lower().split(' ')
        for i in range(len(tk) - len(p) + 1):
            if [x.rstrip('.,?!:') for x in low[i:i + len(p)]] == p:
                last = tk[i + len(p) - 1]; tail = last[len(last.rstrip('.,?!:')):]
                out[i] = dg + tail; out[i + 1:i + len(p)] = ['~'] * (len(p) - 1)
    return ' '.join(out)
def fixshow(E, nums):
    for sg in E['vo_open'] + [v for s in E['scenes'] for v in s['vo']]:
        if sg.get('cta'): continue
        s = SHOW(sg['text'], nums)
        if s != sg['text']: sg['show'] = s
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 204, 'title': 'D. B. Cooper: the jump nobody solved', 'format': 'reel2', 'hook_formula': "25 Someone Else's Result",
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['$200,000', 'NEVER FOUND'],
 'cta': {'q': 'Did he survive the jump?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/D._B._Cooper',
 'vo_open': [V("Two hundred thousand dollars, four parachutes, one night jump. And you still don't know his name.",
   "*$200,000,* *4 parachutes,* one night jump. And you still don't know his *name.*",
   'Zweihunderttausend Dollar, vier Fallschirme, ein Sprung in die Nacht. Und bis heute kennt niemand seinen Namen.',
   'Doscientos mil dólares, cuatro paracaídas, un salto de noche. Y todavía nadie sabe su nombre.',
   "Deux cent mille dollars, quatre parachutes, un saut dans la nuit. Et on ne connaît toujours pas son nom.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V('Nineteen seventy-one. A man calling himself Dan Cooper hijacks a jet with a bomb.',
    '*1971.* A man calling himself *Dan Cooper* hijacks a jet with a *bomb.*',
    'Neunzehnhunderteinundsiebzig. Ein Mann, der sich Dan Cooper nennt, entführt ein Flugzeug, mit einer Bombe.',
    'Mil novecientos setenta y uno. Un hombre que se hace llamar Dan Cooper secuestra un avión con una bomba.',
    "Mille neuf cent soixante et onze. Un homme qui se fait appeler Dan Cooper détourne un avion avec une bombe.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V('In Seattle, he swaps the passengers for the cash and four parachutes.',
    'In *Seattle,* he swaps the passengers for the *cash* and *4 parachutes.*',
    'In Seattle tauscht er die Passagiere gegen das Geld und vier Fallschirme.',
    'En Seattle, cambia a los pasajeros por el dinero y cuatro paracaídas.',
    "À Seattle, il échange les passagers contre l'argent et quatre parachutes.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('Over the forests of Washington, he lowers the rear stairs and jumps into the night.',
    'Over the *forests of Washington,* he lowers the *rear stairs* and *jumps* into the night.',
    'Dann, über den Wäldern von Washington, klappt er die Hecktreppe aus und springt in die Nacht.',
    'Luego, sobre los bosques de Washington, baja la escalera trasera y salta a la noche.',
    "Puis, au-dessus des forêts de l'État de Washington, il abaisse l'escalier arrière et saute dans la nuit.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V("In nineteen eighty, a boy found six thousand dollars of it by the Columbia River. Still the only unsolved airline hijacking.",
    "In *1980,* a boy found *$6,000* of it by the *Columbia River.* Still the *only unsolved* airline hijacking.",
    'Neunzehnhundertachtzig fand ein Junge sechstausend Dollar davon am Columbia River. Es ist bis heute die einzige ungelöste Flugzeugentführung.',
    'En mil novecientos ochenta, un niño encontró seis mil dólares junto al río Columbia. Sigue siendo el único secuestro aéreo sin resolver.',
    "En mille neuf cent quatre-vingt, un garçon a trouvé six mille dollars au bord du fleuve Columbia. C'est toujours le seul détournement d'avion jamais résolu.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [
    V('Did he survive the jump? Yes or no, comment below.', None,
      'Hat er den Sprung überlebt? Ja oder nein, schreib es in die Kommentare.',
      '¿Sobrevivió al salto? Sí o no, coméntalo abajo.',
      "A-t-il survécu au saut ? Oui ou non, dis-le en commentaire.", cta=True),
    V('Most of that two hundred thousand dollars was never found.', 'Most of that *$200,000* was *never found.*',
      'Der Großteil der zweihunderttausend Dollar wurde nie gefunden.',
      'La mayor parte de los doscientos mil dólares nunca apareció.',
      "L'essentiel des deux cent mille dollars n'a jamais été retrouvé.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'sketch', 'file': 'File:CompositeB-FBI-1973.jpg'},
  {'id': 'poster', 'file': 'File:DB Cooper Wanted Poster.jpg'},
  {'id': 'ticket', 'file': 'File:July 2016 D.B. Cooper Plane Ticket (28379315406).jpg'},
  {'id': 'jet', 'file': 'File:Northwest Orient 727 (6961699414).jpg'},
  {'id': 'stair', 'file': 'File:Northwest Boeing 727 airstair (1975).jpg'},
  {'id': 'money', 'file': 'File:Money stolen by D. B. Cooper.jpg'},
 ],
}
fixshow(E, {'two hundred thousand dollars': '$200,000', 'four': '4', 'nineteen seventy-one': '1971', 'nineteen eighty': '1980', 'six thousand dollars': '$6,000'})
open('episodes/204.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
