#!/usr/bin/env python3
"""#234 LAST STOP, part 1 (original animated mini-series, fiction; owner 20.11.2026: new series, "geile story").
Serial plan (story-skills:genre-craft): season goal = Leo must get off this train alive before it reaches its last stop.
Monster rule stated early: whoever gets off at this station becomes the station. Part 1 question: where am I? → a station with his name.
Cliffhanger: the doors open, and his mom is waving on the platform."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 234, 'title': 'LAST STOP · Part 1', 'format': 'mini-series', 'series': 'LAST STOP',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Fenrir', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'scared teenage boy telling it fast, close to the mic, tense and real', 'hook': [], 'cta': {'q': 'Would you get off?'},
 'vo_open': [seg("The last train stopped at a station with my name on the sign.", "The last train stopped at a station with *my name* on the sign.",
    'Die letzte Bahn hielt an einer Station mit meinem Namen auf dem Schild.', 'El último tren paró en una estación con mi nombre en el letrero.', 'Le dernier métro s’est arrêté à une station qui portait mon nom.',
    tts="The last train stopped... at a station with MY name on the sign.", style='stunned, fast, low voice')],
 'scenes': [
  {'dur': 1.0, 'beat': 'stare', 'vo': [seg("Every passenger turned to look at me. None of them blinked.", "Every passenger turned to look at me. *None* of them *blinked.*",
    'Alle Fahrgäste drehten sich zu mir um. Keiner blinzelte.', 'Todos los pasajeros se giraron a mirarme. Ninguno parpadeaba.', 'Tous les passagers se sont tournés vers moi. Aucun ne clignait des yeux.',
    tts="Every passenger turned to look at me. <short pause> None of them blinked.", style='creeped out whisper')]},
  {'dur': 1.0, 'beat': 'ticket', 'vo': [seg("The conductor handed me a ticket. One way. Tonight.", "The conductor handed me a ticket. *One way.* *Tonight.*",
    'Der Schaffner gab mir ein Ticket. Nur Hinfahrt. Heute Nacht.', 'El revisor me dio un billete. Solo ida. Esta noche.', 'Le contrôleur m’a tendu un ticket. Aller simple. Ce soir.',
    tts="The conductor handed me a ticket. <short pause> One way. <short pause> Tonight.", style='tense, quiet, reading it')]},
  {'dur': 1.0, 'beat': 'rule', 'vo': [seg("An old woman whispered: don't get off. Whoever gets off here becomes the station.", "An old woman whispered: *don't* get off. Whoever gets off here *becomes the station.*",
    'Eine alte Frau flüsterte: Steig nicht aus. Wer hier aussteigt, wird zur Station.', 'Una anciana susurró: no te bajes. Quien baja aquí se convierte en la estación.', 'Une vieille dame a chuchoté : ne descends pas. Celui qui descend ici devient la station.',
    tts="An old woman whispered... don't get off. Whoever gets off here... becomes the station.", style='urgent raspy whisper')]},
  {'dur': 1.0, 'beat': 'mom', 'vo': [seg("Then the doors opened. And my mom was on the platform, waving at me.", "Then the doors *opened.* And my *mom* was on the platform, *waving* at me.",
    'Dann gingen die Türen auf. Und meine Mutter stand auf dem Bahnsteig und winkte mir.', 'Entonces se abrieron las puertas. Y mi madre estaba en el andén, saludándome.', 'Puis les portes se sont ouvertes. Et ma mère était sur le quai, à me faire signe.',
    tts="Then the doors opened. <short pause> And my mom was on the platform... waving at me.", style='disbelief, breaking voice', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 100, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep234', 'tag': 'LAST STOP · PART 1', 'title_until': 'sign', 'look': 'raw', 'next': 'PART 2', 'next_at': 'waving+0.8',
 'events': {'name': [0, 'name'], 'sign': [0, 'sign'], 'every': [1, 'every'], 'blinked': [1, 'blinked'], 'ticket': [2, 'ticket'], 'oneway': [2, 'one'], 'tonight': [2, 'tonight'],
            'whispered': [3, 'whispered'], 'dont': [3, 'dont'], 'becomes': [3, 'becomes'], 'station': [3, 'station'], 'opened': [4, 'opened'], 'mom': [4, 'mom'], 'waving': [4, 'waving']},
 'shots': [
  {'from': 0, 'to': 'every-0.2', 'vid': 'clips/wake.webm', 'zoom': [1.0, 1.1], 'focus': [[.55, .45], [.6, .42]], 'fx': {'sign': {'at': 'name', 'txt': 'LEO MARTIN', 'sub': 'LAST STOP · NO RETURN', 'y': 360}}},
  {'from': 'every-0.2', 'to': 'ticket-0.2', 'vid': 'clips/passengers.webm', 'grade': 'saturate(.8) contrast(1.15) brightness(1.4)', 'zoom': [1.0, 1.12], 'focus': [[.5, .45], [.5, .45]], 'fx': {'flicker': True, 'sting': 'blinked'}},
  {'from': 'ticket-0.2', 'to': 'whispered-0.2', 'vid': 'clips/conductor.webm', 'zoom': [1.0, 1.1], 'focus': [[.45, .55], [.4, .6]], 'fx': {'sign': {'at': 'oneway', 'style': 'ticket', 'txt': 'ONE WAY', 'sub': 'ADMIT ONE · LEO MARTIN', 'foot': 'TONIGHT · NO RETURN', 'y': 1150}}},
  {'from': 'whispered-0.2', 'to': 'opened-0.2', 'vid': 'clips/oldlady.webm', 'zoom': [1.0, 1.12], 'focus': [[.5, .4], [.5, .38]], 'fx': {'heartbeat': True, 'sting': 'station'}},
  {'from': 'opened-0.2', 'to': 'end', 'vid': 'clips/platform.webm', 'zoom': [1.0, 1.15], 'focus': [[.55, .35], [.55, .32]], 'fx': {'sting': 'waving'}},
 ],
 'cues': [['name', 0, 'hit', .7], ['every', 0, 'riser', .35], ['blinked', 0, 'hit', .6], ['ticket', 0, 'paper', .5], ['oneway', 0, 'stamp', .7], ['station', 0, 'hit', .8], ['opened', 0, 'whoosh', .6], ['waving', 0, 'hit', .9]],
}
open('episodes/234.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
