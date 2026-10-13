#!/usr/bin/env python3
"""Upload texts for the deep-sea shorts #145-#151 (cut from the long video #139)."""
import json, re
cr = json.load(open('assets/photos/139.credits.json'))
U = {
 145: (['casper', 'dumbo', 'dumbo2'], "Nobody had seen this animal before 2016 👻", "Vor 2016 hatte niemand dieses Tier gesehen 👻", "Nadie había visto este animal antes de 2016 👻", "Personne n'avait vu cet animal avant 2016 👻",
       "In 2016, NOAA's robot found a ghost-white octopus more than 4,000 m deep near Hawaii. Plus the dumbo octopus, which lives as deep as 7,000 m.", '#deepsea #octopus #ocean #animals #nature'),
 146: (['barrel', 'barrelill'], "This fish has a see-through head 👀", "Dieser Fisch hat einen durchsichtigen Kopf 👀", "Este pez tiene la cabeza transparente 👀", "Ce poisson a une tête transparente 👀",
       "The barreleye's head is a transparent dome, and its tube-shaped eyes inside look straight up for the silhouettes of prey.", '#deepsea #fish #ocean #animals #weird'),
 147: (['vamp', 'vamp2'], "The vampire squid from hell 🧛", "Der Vampirtintenfisch aus der Hölle 🧛", "El calamar vampiro del infierno 🧛", "Le calmar vampire de l'enfer 🧛",
       "Vampyroteuthis infernalis means 'vampire squid from hell'. It doesn't drink blood: it eats marine snow, and it can release a cloud of glowing mucus.", '#deepsea #squid #ocean #animals #creepy'),
 148: (['sponge', 'shrimp'], "Two shrimp, locked in glass. Forever 💍", "Zwei Garnelen, für immer in Glas eingesperrt 💍", "Dos gambas encerradas en cristal. Para siempre 💍", "Deux crevettes enfermées dans du verre. Pour toujours 💍",
       "Venus' flower basket is a deep-sea sponge with a skeleton of glass. A pair of shrimp often gets in while young and grows too big to leave. In Japan it became a symbol of a couple staying together for life.", '#deepsea #ocean #animals #love #nature'),
 149: (['abyss', 'snail'], "The deepest fish ever filmed: 8,336 m 🐟", "Der tiefste je gefilmte Fisch: 8.336 m 🐟", "El pez más profundo jamás filmado: 8.336 m 🐟", "Le poisson le plus profond jamais filmé : 8 336 m 🐟",
       "At the bottom of the ocean the pressure is more than 1,000 times what we feel at the surface. Yet snailfish live there, and one was filmed 8,336 m down off Japan in 2022.", '#deepsea #marianatrench #fish #ocean #science'),
 150: (['siph', 'praya'], "Longer than a blue whale... and not one animal 🐋", "Länger als ein Blauwal... und kein einzelnes Tier 🐋", "Más largo que una ballena azul... y no es un solo animal 🐋", "Plus long qu'une baleine bleue... et pas un seul animal 🐋",
       "Siphonophores are colonies of specialised parts grown from a single egg. In 2020 one was filmed off Australia with a ring about 47 m long, longer than a blue whale.", '#deepsea #ocean #animals #science #nature'),
 151: (['eel', 'eelx'], "This eel swallows prey bigger than itself 😱", "Dieser Aal verschluckt Beute, die größer ist als er selbst 😱", "Esta anguila se traga presas más grandes que ella 😱", "Cette anguille avale des proies plus grosses qu'elle 😱",
       "The pelican eel's mouth is far larger than the rest of its head, and its loosely hinged jaw opens wide enough to swallow a fish much larger than itself.", '#deepsea #eel #ocean #animals #weird'),
}
for ep, (ids, en, de, es, fr, hook, tags) in U.items():
    E = json.load(open(f'episodes/{ep}.json')); q = E['cta']['q']
    cred = [f"- {'Music' if k == 'music' else ('Video' if cr[k].get('frames') else 'Image')}: {cr[k]['file'].replace('File:', '')} — {re.sub(r'\s*\(\s*\d+\s*\)', '', cr[k]['author'] if cr[k]['author'] not in (None, 'null', '') else 'Ifremer')}, {cr[k]['license']}, via Wikimedia Commons ({cr[k]['page']})" for k in ids + ['music']]
    md = [f"# #{ep} DEEP SEA (short from #139) — {E['title']}", '', f"**Title:** {en}", '', '**Description:**', hook, '',
          f"{q} Comment below 👇 Full journey to the bottom of the ocean on the channel.", '', f"Source: {E['source']}", '',
          'Real photos and footage (credits below). Voice: AI narrator.', '', 'Credits:', *cred, '', tags + ' #shorts', '',
          f"**Pinned comment:** {q} 👇 Watch the full 5-minute dive on my channel.", '',
          f"**Audio tracks:** wiki_roulette_{ep}_de.m4a (German), wiki_roulette_{ep}_es.m4a (Spanish), wiki_roulette_{ep}_fr.m4a (French)", '',
          '**Settings:** Link the long video #139 as "Related video" in YouTube Studio · Playlist "Deep Sea" · Made for kids: No · Altered or synthetic content: No · Category: Education', '',
          '## Deutsch', '', f'**Titel:** {de}', '', '## Español', '', f'**Título:** {es}', '', '## Français', '', f'**Titre :** {fr}', '']
    open(f'uploads/{ep}.md', 'w').write('\n'.join(md)); print(ep, len(cred))
