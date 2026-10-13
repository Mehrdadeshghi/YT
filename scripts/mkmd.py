#!/usr/bin/env python3
"""#143 Matchday preview (13 Oct 2026): "Predict tonight's 3 big Champions League games" — new broadcast-graphics look,
human-like Chirp 3 HD hype voice, EN + DE/ES/FR. Win probabilities and opening-round results from Sportradar (13 Oct 2026)."""
import json

R = [  # (EN, cap, DE, ES, FR)
 ("Atlético against Manchester United, in Madrid. Atlético lost their opener at Liverpool. United beat Sabah four-nil. The data gives Atlético forty-nine percent.",
  "Atlético *49%*",
  "Atlético gegen Manchester United, in Madrid. Atlético hat das erste Spiel in Liverpool verloren. United schlug Sabah vier zu null. Die Daten geben Atlético neunundvierzig Prozent.",
  "Atlético contra Manchester United, en Madrid. El Atlético perdió su primer partido en Liverpool. El United goleó cuatro a cero al Sabah. Los datos dan al Atlético un cuarenta y nueve por ciento.",
  "L'Atlético contre Manchester United, à Madrid. L'Atlético a perdu son premier match à Liverpool. United a battu Sabah quatre à zéro. Les données donnent quarante-neuf pour cent à l'Atlético."),
 ("Galatasaray against Barcelona, in Istanbul. Barça put five past Feyenoord. But in Istanbul, anything can happen. Barcelona: seventy-five percent.",
  "Barcelona *75%*",
  "Galatasaray gegen Barcelona, in Istanbul. Barça hat Feyenoord fünf Tore eingeschenkt. Aber in Istanbul kann alles passieren. Barcelona: fünfundsiebzig Prozent.",
  "Galatasaray contra Barcelona, en Estambul. El Barça le metió cinco al Feyenoord. Pero en Estambul puede pasar de todo. Barcelona: setenta y cinco por ciento.",
  "Galatasaray contre Barcelone, à Istanbul. Le Barça en a mis cinq à Feyenoord. Mais à Istanbul, tout peut arriver. Barcelone : soixante-quinze pour cent."),
 ("Viking from Norway against Bayern. Bayern won their opener five-nil. Viking's chance? Four percent. Upset of the year?",
  "Viking *4%*",
  "Viking aus Norwegen gegen Bayern. Bayern gewann das erste Spiel fünf zu null. Vikings Chance? Vier Prozent. Die Sensation des Jahres?",
  "El Viking noruego contra el Bayern. El Bayern ganó su primer partido cinco a cero. ¿La opción del Viking? Un cuatro por ciento. ¿La sorpresa del año?",
  "Viking, de Norvège, contre le Bayern. Le Bayern a gagné son premier match cinq à zéro. La chance de Viking ? Quatre pour cent. La surprise de l'année ?"),
 ("Comment your three scores now. Tomorrow I'll show who got them right!",
  "Your *3 scores* 👇",
  "Schreib jetzt deine drei Tipps in die Kommentare. Morgen zeige ich, wer richtig lag!",
  "Escribe ahora tus tres resultados en los comentarios. ¡Mañana te enseño quién acertó!",
  "Écris tes trois scores en commentaire. Demain, je te montre qui avait raison !"),
]
sc = [{'dur': 1.6, 'vis': i, 'vo': [{'at': 0.45, 'text': e, 'cap': c, 'de': d, 'es': s, 'fr': f}]} for i, (e, c, d, s, f) in enumerate(R)]
sc[-1]['vo'].append({'at': '0.1', 'text': "Subscribe so you don't miss it!", 'cta': True, 'de': 'Abonnier, damit du es nicht verpasst!',
                     'es': '¡Suscríbete para no perdértelo!', 'fr': 'Abonne-toi pour ne pas le rater !'})
E = {'ep': 143, 'title': "Predict tonight's Champions League (13 Oct 2026)", 'series': 'MATCHDAY · PREDICT IT',
     'look': 'cine', 'style': 'pro', 'captions': True, 'wordCaps': True, 'noOutro': True, 'tight': True, 'tail': 0.25, 'sub': 2,
     'voice': 'chirp', 'voice_style': 'hype', 'mood': 'epic', 'scripts': ['pro.js'], 'capY': 1700, 'capSize': 52, 'openMin': 1.6,
     'noCommentCard': True, 'subY': 1530, 'subEndY': 1530,
     'cta': {'q': 'Your 3 scores?', 'a': 'ATM–MUN', 'b': 'GAL–BAR'},
     'source': 'https://www.uefa.com/uefachampionsleague/fixtures-results/',
     'vo_open': [{'at': 0, 'text': "Three huge Champions League games tonight. Can you predict all three?",
                  'de': 'Drei riesige Champions-League-Spiele heute Abend. Kannst du alle drei vorhersagen?',
                  'es': 'Tres partidazos de Champions esta noche. ¿Puedes acertar los tres?',
                  'fr': 'Trois énormes matchs de Ligue des champions ce soir. Tu peux prédire les trois ?'}],
     'scenes': sc,
     'photos': [{'id': 'metro', 'file': 'File:Estadio Wanda Metropolitano (2018).jpg'}, {'id': 'rams', 'file': 'File:Galatasaray Nef Stadium before match 2022.jpg'},
                {'id': 'ultras', 'file': 'File:Saracoglunuyakinsampiyonlukdahayakin.JPG'}, {'id': 'luz12', 'file': 'File:Estadio da Luz 2012.jpg'},
                {'id': 'music', 'audio': 'File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3', 'from': 0, 'len': 45, 'gain': 0.5}]}
json.dump(E, open('episodes/143.json', 'w'), ensure_ascii=False, indent=1)
print(len(sc), 'scenes', sum(len(v['text'].split()) for s in sc for v in s['vo']) + 11, 'words')
