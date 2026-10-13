#!/usr/bin/env python3
"""Upload text for #143 (matchday preview) → uploads/143.md."""
import json, re
E = json.load(open('episodes/143.json')); cr = json.load(open('assets/photos/143.credits.json'))
js = open('cine/143.js').read(); used = [k for k in cr if k == 'music' or re.search(rf"['\"]{re.escape(k)}['\"]", js)]
cred = [f"- {'Music' if k == 'music' else 'Image'}: {cr[k]['file'].replace('File:', '')} — {re.sub(r'\s*\(\s*\d+\s*\)', '', cr[k]['author'])}, {cr[k]['license']}, via Wikimedia Commons ({cr[k]['page']})" for k in used]
T = {'en': 'Predict tonight\'s Champions League 🔮 (only 1% get all 3)', 'de': 'Tippe die Champions League heute Abend 🔮 Schaffst du alle 3?',
     'es': 'Predice la Champions de esta noche 🔮 ¿Aciertas las 3?', 'fr': 'Prédis la Ligue des champions ce soir 🔮 Tu trouves les 3 ?'}
T['en'] = "Predict tonight's Champions League 🔮 Can you get all 3?"
D = {'de': 'Atlético – Man United, Galatasaray – Barcelona, Viking – Bayern. Schreib deine 3 Tipps in die Kommentare 👇 Morgen zeige ich, wer richtig lag.',
     'es': 'Atlético – Man United, Galatasaray – Barcelona, Viking – Bayern. Escribe tus 3 resultados en los comentarios 👇 Mañana te enseño quién acertó.',
     'fr': "Atlético – Man United, Galatasaray – Barcelone, Viking – Bayern. Écris tes 3 scores en commentaire 👇 Demain, je te montre qui avait raison."}
tags = '#championsleague #ucl #prediction #football #atleticomadrid #manutd #fcbarcelona #galatasaray #fcbayern'
md = [f"# #143 {E['series']} — {E['title']}", '', f"**Title:** {T['en']}", '', '**Description:**',
      'Three huge Champions League games tonight (13 Oct, 21:00 CEST): Atlético Madrid v Manchester United, Galatasaray v Barcelona, Viking v Bayern Munich.',
      'Comment your 3 scores 👇 Tomorrow I\'ll show who got them right. Subscribe so you don\'t miss it!', '',
      'Win probabilities: Sportradar data model (13 Oct 2026). Last results: Champions League matchday 1. Club colours only, no official logos. Voice: AI narrator.', '',
      'Credits:', *cred, '', tags + ' #shorts', '',
      '**Pinned comment:** My picks: Atlético 2–1, Barça 2–0, Bayern 0–4. Yours? 👇', '',
      '**Audio tracks:** wiki_roulette_143_de.m4a (German), wiki_roulette_143_es.m4a (Spanish), wiki_roulette_143_fr.m4a (French)', '',
      '**Settings:** Post NOW (before 21:00 CEST) · Playlist "Matchday" (new) · Made for kids: No · Altered or synthetic content: No · Category: Sports', '']
for L, lab in (('de', 'Deutsch'), ('es', 'Español'), ('fr', 'Français')):
    md += [f'## {lab}', '', f"**Titel / Title:** {T[L]}", '', D[L], '', tags + ' #shorts', '']
open('uploads/143.md', 'w').write('\n'.join(md)); print(len(used), 'credits')
