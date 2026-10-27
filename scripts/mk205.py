#!/usr/bin/env python3
"""#205 REEL v2 (experiment E8) — 1969: the U.S. switched off the American Falls of Niagara. 27 Oct 2026. Voice: gemini.
Hook formula 3 "Nobody Tells You" (hookscore 84.4 STRONG): "Nobody tells you America switched off Niagara Falls in 1969."
On screen "AMERICAN FALLS / SWITCHED OFF".
Facts: English Wikipedia "Niagara Falls" + "American Falls" (Oct 2026):
- "In June 1969, a temporary rock and earth dam was constructed, completely diverting the Niagara River from American Falls for
  several months." "the U.S. Army Corps of Engineers blocked the flow of water over the American Falls from June to November 1969."
- "While Horseshoe Falls absorbed the extra flow, the U.S. Army Corps of Engineers studied the riverbed and mechanically bolted and
  strengthened any faults they found".
- Why: "To survey the rockfall and determine how to prevent the falls from becoming a series of rapids"; huge mound of rock at its
  base from rockfalls (1954 Prospect Point).
- "During this time, two bodies were removed from under the falls".
- "in November 1969, the temporary dam was dynamited, restoring flow to American Falls."
Media: 1969 photos of the dry falls (public domain / CC BY-SA 4.0 / CC BY 2.0), modern footage (CC BY 4.0 / CC BY-SA 4.0),
drawn graphics labelled GRAPHIC."""
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
 'ep': 205, 'title': 'The year America switched off its side of Niagara Falls', 'format': 'reel2', 'hook_formula': '3 Nobody Tells You',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'epic', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['AMERICAN FALLS', 'SWITCHED OFF'],
 'cta': {'q': 'Would you walk on the dry falls?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Niagara_Falls',
 'vo_open': [V('Nobody tells you America switched off part of Niagara Falls in nineteen sixty-nine.',
   'Nobody tells you America *switched off* part of *Niagara Falls* in *1969.*',
   'Kaum jemand weiß: Neunzehnhundertneunundsechzig haben die USA einen Teil der Niagarafälle abgeschaltet.',
   'Nadie te lo cuenta: en mil novecientos sesenta y nueve, Estados Unidos apagó parte de las cataratas del Niágara.',
   "Personne ne te le dit : en mille neuf cent soixante-neuf, les États-Unis ont éteint une partie des chutes du Niagara.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V('In June, Army engineers built a temporary dam of rock and earth. The American Falls went dry.',
    'In *June,* *Army engineers* built a temporary dam of *rock and earth.* The *American Falls* went *dry.*',
    'Im Juni baute das Ingenieurkorps der US-Armee einen provisorischen Damm aus Fels und Erde. Die American Falls fielen trocken.',
    'En junio, el Cuerpo de Ingenieros del Ejército construyó una presa provisional de roca y tierra. Las cataratas americanas se secaron.',
    "En juin, le corps des ingénieurs de l'armée a construit un barrage provisoire de roche et de terre. Les chutes américaines se sont asséchées.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V('All the water went over the Horseshoe Falls instead.',
    'All the water went over the *Horseshoe Falls* instead.',
    'Das ganze Wasser stürzte stattdessen über die Horseshoe Falls.',
    'Toda el agua cayó por las cataratas Horseshoe.',
    "Toute l'eau passait par les chutes du Fer-à-Cheval.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('Why? Rockfalls had piled a huge mound of rock at its base. Engineers studied the riverbed and bolted weak spots.',
    'Why? *Rockfalls* had piled a *huge mound of rock* at its base. Engineers studied the riverbed and *bolted* weak spots.',
    'Warum? Felsstürze hatten am Fuß einen riesigen Geröllberg aufgetürmt. Ingenieure untersuchten das Flussbett und verankerten die Schwachstellen.',
    '¿Por qué? Los desprendimientos habían amontonado una enorme pila de roca en la base. Los ingenieros estudiaron el lecho y atornillaron los puntos débiles.',
    "Pourquoi ? Des éboulements avaient entassé un énorme tas de roches à la base. Les ingénieurs ont étudié le lit du fleuve et boulonné les points faibles.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V('Under the dry falls, they found two bodies. In November, they blew up the dam, and the falls came back.',
    'Under the dry falls, they found *two bodies.* In *November,* they *blew up the dam,* and the falls came back.',
    'Unter den trockenen Fällen fanden sie auch zwei Leichen. Im November sprengten sie den Damm, und die Fälle kamen zurück.',
    'Bajo las cataratas secas también encontraron dos cuerpos. En noviembre volaron la presa, y las cataratas volvieron.',
    "Sous les chutes à sec, ils ont aussi trouvé deux corps. En novembre, ils ont fait sauter le barrage, et les chutes sont revenues.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [
    V('Would you walk on the dry falls? Yes or no, comment below.', None,
      'Würdest du über die trockenen Fälle laufen? Ja oder nein, schreib es in die Kommentare.',
      '¿Caminarías por las cataratas secas? Sí o no, coméntalo abajo.',
      "Tu marcherais sur les chutes à sec ? Oui ou non, dis-le en commentaire.", cta=True),
    V('Before they switch Niagara off again.', 'Before they *switch Niagara off* again.',
      'Bevor sie Niagara wieder abschalten.',
      'Antes de que vuelvan a apagar el Niágara.',
      "Avant qu'ils n'éteignent encore le Niagara.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'dry', 'file': 'File:1969 Drained American Falls of Niagara River During Preservation Work (PICT0302).jpg'},
  {'id': 'dry2', 'file': 'File:Dewatered American Falls (1969) (Niagara Falls, northwest of Buffalo, New York State, USA) (19936707609).jpg'},
  {'id': 'dry3', 'file': 'File:Dryniagara.jpg'},
  {'id': 'rainbow', 'file': 'File:America Falls with rainbow - panoramio.jpg'},
  {'id': 'both', 'file': 'File:American Falls and Horseshoe Falls.jpg'},
  {'id': 'talus', 'file': 'File:American Falls (Niagara Falls, northwest of Buffalo, New York State, USA) 9 (19936769208).jpg'},
  {'id': 'camerican', 'video': 'File:Niagara Falls montage 2025-09-06.webm', 'from': 0, 'len': 5},
  {'id': 'ccrest', 'video': 'File:Niagara Falls montage 2025-09-06.webm', 'from': 9.9, 'len': 4.6},
  {'id': 'chorse', 'video': 'File:Niagara Falls montage 2025-09-06.webm', 'from': 15.3, 'len': 5},
  {'id': 'cboat', 'video': 'File:Niagara American and Bridal Veil Falls.ogv', 'from': 6, 'len': 8},
 ],
}
fixshow(E, {'nineteen sixty-nine': '1969'})
open('episodes/205.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
