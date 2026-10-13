#!/usr/bin/env python3
"""Upload texts for the Champions League matchday specials #140-#142 → uploads/<ep>.md (EN + DE/ES/FR), credits only for media the visuals use."""
import json, re

T = {  # ep: (EN title, DE, ES, FR, EN description hook, hashtags, tonight line EN)
 140: ("1 minute from the Champions League title. TWICE 😭", '1 Minute vom Champions-League-Titel entfernt. ZWEIMAL 😭',
       'A 1 minuto de ganar la Champions. DOS VECES 😭', 'À 1 minute du titre en Ligue des champions. DEUX FOIS 😭',
       "Atlético Madrid led the 1974 European Cup final until the last minute of extra time, and the 2014 final until the 93rd minute. Then came 2016 and the post. This season's final is in their own stadium.",
       '#atleticomadrid #championsleague #ucl #football #manutd', 'Tonight: Atlético Madrid v Manchester United.'),
 141: ('They landed in Istanbul and saw: "WELCOME TO HELL" 🔥', 'Sie landeten in Istanbul und sahen: „WELCOME TO HELL“ 🔥',
       'Aterrizaron en Estambul y vieron: «WELCOME TO HELL» 🔥', "Ils ont atterri à Istanbul et ont vu : « WELCOME TO HELL » 🔥",
       'Manchester United v Galatasaray, 1993: 3–3 at Old Trafford, 0–0 in Istanbul, out on away goals, Cantona sent off at the final whistle.',
       '#galatasaray #manutd #championsleague #ucl #football', 'Tonight: Galatasaray v Barcelona in Istanbul.'),
 142: ('Barcelona 2–8 Bayern. Not a typo 😳', 'Barcelona 2:8 Bayern. Kein Tippfehler 😳', 'Barcelona 2–8 Bayern. No es una errata 😳', 'Barcelone 2–8 Bayern. Pas une faute de frappe 😳',
       "Lisbon, 14 August 2020: Bayern beat Barcelona 8–2 in a one-off quarter-final in an empty stadium. Coutinho, on loan from Barça, scored twice. The coach was sacked three days later.",
       '#fcbayern #fcbarcelona #championsleague #ucl #football', 'Tonight: Viking v Bayern and Galatasaray v Barcelona.'),
}
TON = {140: {'de': 'Heute Abend: Atlético Madrid gegen Manchester United.', 'es': 'Esta noche: Atlético de Madrid contra Manchester United.', 'fr': 'Ce soir : Atlético Madrid contre Manchester United.'},
       141: {'de': 'Heute Abend: Galatasaray gegen Barcelona in Istanbul.', 'es': 'Esta noche: Galatasaray contra Barcelona en Estambul.', 'fr': 'Ce soir : Galatasaray contre Barcelone à Istanbul.'},
       142: {'de': 'Heute Abend: Viking gegen Bayern und Galatasaray gegen Barcelona.', 'es': 'Esta noche: Viking contra Bayern y Galatasaray contra Barcelona.', 'fr': 'Ce soir : Viking contre Bayern et Galatasaray contre Barcelone.'}}
SUB = {'de': 'Abonnieren für mehr verrückte Fußball-Momente.', 'es': 'Suscríbete para más momentos locos del fútbol.', 'fr': 'Abonne-toi pour plus de moments fous du foot.'}
LAB = {'de': 'Deutsch', 'es': 'Español', 'fr': 'Français'}

for ep, (en, de, es, fr, hook, tags, tonight) in T.items():
    E = json.load(open(f'episodes/{ep}.json')); cr = json.load(open(f'assets/photos/{ep}.credits.json'))
    js = open(f'cine/{ep}.js').read(); used = [k for k in cr if k == 'music' or re.search(rf"['\"]{re.escape(k)}['\"]", js)]
    cred = [f"- {'Music' if k == 'music' else 'Image'}: {cr[k]['file'].replace('File:', '')} — {re.sub(r'\s*\(\s*\d+\s*\)', '', cr[k]['author'])}, {cr[k]['license']}, via Wikimedia Commons ({cr[k]['page']})" for k in used]
    q = E['cta']['q']; t = {'en': en, 'de': de, 'es': es, 'fr': fr}
    md = [f"# #{ep} {E['series']} — {E['title']}", '', f"**Title:** {en}", f"**Alt title:** {E['title']} #shorts", '',
          '**Description:**', hook, '', tonight, '', f"{q} Comment below 👇 and subscribe for more crazy football moments.", '',
          f"Source: {E['source']}", '', f"All photos are real (credits below); {'the airport banner and ' if ep == 141 else ''}scoreboards are graphics. Voice: AI narrator.", '',
          'Credits:', *cred, '', tags + ' #shorts', '', f"**Pinned comment:** {q} Tell me in the comments 👇", '',
          f"**Audio tracks:** wiki_roulette_{ep}_de.m4a (German), wiki_roulette_{ep}_es.m4a (Spanish), wiki_roulette_{ep}_fr.m4a (French)", '',
          "**Settings:** Playlist \"Football's Craziest Moments\" · Made for kids: No · Altered or synthetic content: No (real photos; only the narration voice is AI) · Category: Sports · post before kick-off (18:45 / 21:00 CEST)", '']
    for L in ('de', 'es', 'fr'):
        md += [f"## {LAB[L]}", '', f"**Titel / Title:** {t[L]}", '', E['vo_open'][0][L], '', TON[ep][L], '', E['scenes'][-1]['vo'][-1][L], '', SUB[L], '', tags + ' #shorts', '']
    open(f'uploads/{ep}.md', 'w').write('\n'.join(md)); print(ep, len(used), 'credits')
