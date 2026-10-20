#!/usr/bin/env python3
"""Upload text for #169 (16:9 long-form Titanic) → uploads/169.md. Usage: mk169up.py 0:00 0:24 …  (start time of each chapter, in order).
Chapters are plain lines INSIDE the description (yt_upload.py takes the description up to the next **Field:** line)."""
import json, re, sys

EP = 169
E = json.load(open(f'episodes/{EP}.json')); cr = json.load(open(f'assets/photos/{EP}.credits.json'))
js = open(f'cine/{EP}.js').read()
media = set(re.findall(r"scene169\('\w+', '(\w+)'", js)) | set(re.findall(r"media169\(\w+, '(\w+)'", js))     # media actually shown
used = [k for k in cr if k == 'music' or k in media]
times = sys.argv[1:] or ['?'] * len(E['chapters'])
assert len(times) == len(E['chapters']), 'one time per chapter'

TITLE = {'en': "Why the Titanic Is Disappearing: A Journey 12,500 Feet Down",
         'de': 'Warum die Titanic verschwindet: Eine Reise 3.800 Meter in die Tiefe',
         'es': 'Por qué el Titanic está desapareciendo: un viaje a 3.800 metros de profundidad',
         'fr': "Pourquoi le Titanic est en train de disparaître : un voyage à 3 800 mètres de fond"}
DESC = {'en': "We follow the Titanic from the night of April 14, 1912 all the way down to the wreck, 12,500 feet below the North Atlantic: how she broke in two, how the bow and the stern fell, how she was lost for 73 years and found in 1985, and why scientists think she may not last much longer. Rusticles, iron-eating bacteria, and the Titanic's own species, Halomonas titanicae. Real 1912 photos and newsreel footage, real NOAA photos of the wreck.",
        'de': 'Wir folgen der Titanic von der Nacht des 14. April 1912 bis hinunter zum Wrack, 3.800 Meter unter dem Nordatlantik: wie sie zerbrach, wie Bug und Heck in die Tiefe fielen, wie sie 73 Jahre verschollen war, 1985 gefunden wurde – und warum Forscher glauben, dass sie nicht mehr lange hält. Rostikel, eisenfressende Bakterien und die Titanic-eigene Art Halomonas titanicae. Echte Fotos und Wochenschau-Aufnahmen von 1912, echte NOAA-Fotos vom Wrack.',
        'es': 'Seguimos al Titanic desde la noche del 14 de abril de 1912 hasta el naufragio, a 3.800 metros bajo el Atlántico Norte: cómo se partió en dos, cómo cayeron la proa y la popa, cómo estuvo perdido 73 años hasta 1985 y por qué los científicos creen que no durará mucho más. Rustículas, bacterias que comen hierro y la especie propia del Titanic, Halomonas titanicae. Fotos y noticiarios reales de 1912, fotos reales del naufragio de la NOAA.',
        'fr': "On suit le Titanic depuis la nuit du 14 avril 1912 jusqu'à l'épave, à 3 800 mètres sous l'Atlantique Nord : comment il s'est brisé en deux, comment la proue et la poupe sont tombées, comment il a été perdu 73 ans avant d'être retrouvé en 1985, et pourquoi les scientifiques pensent qu'il ne tiendra plus longtemps. Rusticles, bactéries mangeuses de fer et l'espèce propre au Titanic, Halomonas titanicae. Vraies photos et actualités filmées de 1912, vraies photos NOAA de l'épave."}
CH = {'en': [c[0] for c in E['chapters']],
      'de': ['Intro', 'Die letzte Nacht', 'Der Sturz', '73 Jahre verschollen', 'Das Wrack heute', 'Das Wrack lebt', 'Verschwindet sie?'],
      'es': ['Intro', 'La última noche', 'La caída', 'Perdido 73 años', 'El naufragio hoy', 'El naufragio está vivo', '¿Desaparecerá?'],
      'fr': ['Intro', 'La dernière nuit', 'La chute', 'Perdu pendant 73 ans', "L'épave aujourd'hui", "L'épave est vivante", 'Va-t-elle disparaître ?']}
ASK = {'en': 'Should people still be allowed to visit the wreck? YES or LEAVE IT? 👇', 'de': 'Sollten Menschen das Wrack weiter besuchen dürfen? JA oder IN RUHE LASSEN? 👇',
       'es': '¿Debería seguir permitiéndose visitar el naufragio? ¿SÍ o DÉJALO EN PAZ? 👇', 'fr': "Faut-il encore autoriser les visites de l'épave ? OUI ou LAISSEZ-LA ? 👇"}
LAB = {'de': ('Deutsch', 'Titel'), 'es': ('Español', 'Título'), 'fr': ('Français', 'Titre ')}
TAGS = '#titanic #shipwreck #ocean #deepsea #history #documentary #science'

def chapters(L):
    return [f"{t} {n}" for t, n in zip(times, CH[L])]

cred, seen = [], set()
for k in used:
    c = cr[k]
    if c['page'] in seen: continue
    seen.add(c['page']); au = c['author'] if c['author'] not in (None, 'null', '', 'unknown') else ('Ifremer' if 'Ifremer' in c['file'] else 'NOAA' if 'Alvin' in c['file'] else 'Unknown author')
    kind = 'Music' if k == 'music' else ('Video' if c.get('frames') else 'Image')
    cred.append(f"- {kind}: \"{c['file'].replace('File:', '').rsplit('.', 1)[0]}\" — {re.sub(r'\s*\(\s*\d+\s*\)', '', au)[:60]}, {c['license']}")

md = [f"# #{EP} Long video — {E['title']} (16:9)", '', f"**Title:** {TITLE['en']}", '',
      '**Description:**', DESC['en'], '', ASK['en'], '', 'Chapters:', *chapters('en'), '',
      'Sources: https://en.wikipedia.org/wiki/Wreck_of_the_Titanic · https://en.wikipedia.org/wiki/Sinking_of_the_Titanic · https://en.wikipedia.org/wiki/Titanic · https://en.wikipedia.org/wiki/Halomonas_titanicae · https://en.wikipedia.org/wiki/Rusticle · https://en.wikipedia.org/wiki/Bathypelagic_zone',
      '', 'Narration: AI voice. Photos and footage are real (credits below); the sinking, sonar and bacteria scenes are drawn illustrations and are labelled on screen. The Grand Staircase photo shows the identical staircase of the sister ship Olympic.',
      '', TAGS, '', 'Credits (all via Wikimedia Commons, commons.wikimedia.org/wiki/File:<name>):', *cred, '',
      f"**Pinned comment:** {ASK['en']}", '',
      f"**Audio tracks:** wiki_roulette_{EP}_de.m4a (German), wiki_roulette_{EP}_es.m4a (Spanish), wiki_roulette_{EP}_fr.m4a (French)", '',
      '**Thumbnail:** render `cine.html?ep=169&wide=1&thumb=1` (bow photo, "12,500 FT DOWN / And it\'s disappearing.")', '',
      '**Settings:** Playlist "Deep Sea" · Made for kids: No · Altered or synthetic content: No (only the narration voice is AI; no realistic people or events are generated) · Category: Education · Long video (16:9), not a Short', '']
for L in ('de', 'es', 'fr'):
    md += [f"## {LAB[L][0]}", f"**{LAB[L][1]}:** {TITLE[L]}", '', DESC[L], '', ASK[L], '', *chapters(L), '', TAGS, '']
d = re.search(r'^\*\*Description:\*\*\s*\n(.*?)(?=^\*\*[^*\n]+:\*\*)', '\n'.join(md), re.S | re.M).group(1); assert len(d) < 4900, len(d)   # YouTube limit 5,000
open(f'uploads/{EP}.md', 'w').write('\n'.join(md)); print(EP, len(used), 'credits', len(md), 'lines, description', len(d))
