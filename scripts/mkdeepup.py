#!/usr/bin/env python3
"""Upload text for #139 (16:9 long-form) → uploads/139.md. Usage: mkdeepup.py 0:00 0:12 1:40 …  (start time of each chapter, in order)."""
import json, re, sys

EP = 139
E = json.load(open(f'episodes/{EP}.json')); cr = json.load(open(f'assets/photos/{EP}.credits.json'))
js = open(f'cine/{EP}.js').read()
used = [k for k in cr if k == 'music' or re.search(rf"['\"]{re.escape(k)}['\"]", js)]
times = sys.argv[1:] or ['?'] * len(E['chapters'])
assert len(times) == len(E['chapters']), 'one time per chapter'

TITLE = {'en': 'What Lives 11 km Down? A Journey to the Bottom of the Ocean',
         'de': 'Was lebt 11 km tief im Meer? Eine Reise zum Grund des Ozeans',
         'es': '¿Qué vive a 11 km de profundidad? Un viaje al fondo del océano',
         'fr': "Qu'est-ce qui vit à 11 km de profondeur ? Voyage au fond de l'océan"}
DESC = {'en': 'From the last light of the twilight zone to the bottom of the Mariana Trench: we dive 11 kilometers down and meet the animals that live where sunlight never reaches. Lanternfish, the barreleye, the vampire squid, the pelican eel, a ghost-white octopus nobody had seen before, the dumbo octopus, the deepest fish ever filmed and more. Real footage and photos from NOAA Ocean Exploration and other research teams.',
        'de': 'Vom letzten Licht der Dämmerungszone bis zum Grund des Marianengrabens: Wir tauchen 11 Kilometer tief und treffen die Tiere, die dort leben, wo nie Sonnenlicht ankommt. Laternenfische, der Gespensterfisch, der Vampirtintenfisch, der Pelikanaal, ein geisterweißer Krake, den vorher niemand gesehen hatte, der Dumbo-Oktopus, der tiefste je gefilmte Fisch und mehr. Echte Aufnahmen und Fotos von NOAA Ocean Exploration und anderen Forschungsteams.',
        'es': 'Desde la última luz de la zona crepuscular hasta el fondo de la fosa de las Marianas: bajamos 11 kilómetros y conocemos a los animales que viven donde nunca llega el sol. El pez linterna, el pez de cabeza transparente, el calamar vampiro, la anguila pelícano, un pulpo blanco fantasma que nadie había visto, el pulpo dumbo, el pez más profundo jamás filmado y más. Imágenes y fotos reales de NOAA Ocean Exploration y otros equipos de investigación.',
        'fr': "De la dernière lueur de la zone crépusculaire jusqu'au fond de la fosse des Mariannes : on plonge à 11 kilomètres et on rencontre les animaux qui vivent là où le soleil n'arrive jamais. Poissons-lanternes, le poisson à tête transparente, le calmar vampire, l'anguille pélican, une pieuvre blanche fantôme jamais vue auparavant, la pieuvre dumbo, le poisson le plus profond jamais filmé et plus encore. Images et photos réelles de NOAA Ocean Exploration et d'autres équipes de recherche."}
CH = {'en': [c[0] for c in E['chapters']],
      'de': ['Intro', 'Die Dämmerungszone', 'Die Mitternachtszone', 'Die Tiefsee-Ebene', 'Die Hadalzone', 'Noch unerforscht'],
      'es': ['Intro', 'La zona crepuscular', 'La zona de medianoche', 'El abismo', 'La zona hadal', 'Aún por explorar'],
      'fr': ['Intro', 'La zone crépusculaire', 'La zone de minuit', 'Les abysses', 'La zone hadale', 'Encore inexploré']}
ASK = {'en': 'Which animal surprised you the most? Tell me in the comments 👇', 'de': 'Welches Tier hat dich am meisten überrascht? Schreib es in die Kommentare 👇',
       'es': '¿Qué animal te sorprendió más? Cuéntamelo en los comentarios 👇', 'fr': "Quel animal t'a le plus surpris ? Dis-le-moi en commentaire 👇"}
LAB = {'de': 'Deutsch', 'es': 'Español', 'fr': 'Français'}
TAGS = '#deepsea #ocean #marinebiology #animals #documentary #nature #science'

def chapters(L):
    return [f"{t} {n}" for t, n in zip(times, CH[L])]

cred, seen = [], set()
for k in used:
    c = cr[k]
    if c['page'] in seen: continue
    seen.add(c['page']); c['author'] = c['author'] if c['author'] not in (None, 'null', '') else ('Ifremer' if 'Ifremer' in c['file'] else 'Unknown author'); kind = 'Music' if k == 'music' else ('Video' if c.get('frames') else 'Image')
    cred.append(f"- {kind}: {c['file'].replace('File:', '')} — {re.sub(r'\s*\(\s*\d+\s*\)', '', c['author'])}, {c['license']}, via Wikimedia Commons ({c['page']})")

md = [f"# #{EP} Long video — {E['title']} (16:9)", '', f"**Title:** {TITLE['en']}", '',
      '**Description:**', DESC['en'], '', ASK['en'], '', '**Chapters:**', *chapters('en'), '',
      'Sources: https://en.wikipedia.org/wiki/Deep_sea · https://en.wikipedia.org/wiki/Mesopelagic_zone · https://en.wikipedia.org/wiki/Abyssal_zone · https://en.wikipedia.org/wiki/Hadal_zone · Martini & Haddock (2017), Scientific Reports (bioluminescence survey off California)',
      '', 'Narration: AI voice. All animal footage and photos are real (credits below).', '', 'Credits:', *cred, '', TAGS, '',
      f"**Pinned comment:** {ASK['en']}", '',
      f"**Audio tracks:** wiki_roulette_{EP}_de.m4a (German), wiki_roulette_{EP}_es.m4a (Spanish), wiki_roulette_{EP}_fr.m4a (French)", '',
      '**Settings:** Playlist "Deep Sea" (new) · Made for kids: No · Altered or synthetic content: No (only the narration voice is AI; no realistic people or events are generated) · Category: Education · Thumbnail: dumbo octopus or the ghost octopus with the text "11 KM DOWN"', '']
for L in ('de', 'es', 'fr'):
    md += [f"## {LAB[L]}", '', f"**Titel / Title:** {TITLE[L]}", '', DESC[L], '', ASK[L], '', *chapters(L), '', TAGS, '']
open(f'uploads/{EP}.md', 'w').write('\n'.join(md)); print(EP, len(used), 'credits', len(md), 'lines')
