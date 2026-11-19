#!/usr/bin/env python3
"""#231 SENT TOMORROW, part 3 of 5 (original animated mini-series, fiction). Frames: Figma; motion: Wan 2.2 on Kaggle (scripts/comic/ep231/clips.json → clips/*.webm);
voice: Gemini 3.8 with per-line delivery ("style") and light inline vocal tags ("tts"); no yes/no ask (owner, 16.11.2026)."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 231, 'title': 'SENT TOMORROW · Part 3', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'scared teenage girl, close to the mic, tense and real', 'hook': [], 'cta': {'q': 'Who is on the stairs?'},
 'vo_open': [seg("The voice on the phone was mine. And it said: get out. Now.", "The voice on the phone was *mine.* And it said: get *out.* *Now.*",
    'Die Stimme am Telefon war meine. Und sie sagte: Raus. Sofort.', 'La voz del teléfono era la mía. Y dijo: sal. Ya.', 'La voix au téléphone, c’était la mienne. Et elle a dit : sors. Maintenant.',
    tts="The voice on the phone was mine. <short pause> And it said... get out. NOW.", style='shaky whisper, then urgent')],
 'scenes': [
  {'dur': 1.0, 'beat': 'elevator', 'vo': [seg("Someone is in the elevator. Coming up to your floor. Take the stairs.", "Someone is in the *elevator.* Coming up to *your* floor. Take the *stairs.*",
    'Jemand ist im Aufzug. Er kommt zu deinem Stockwerk. Nimm die Treppe.', 'Alguien está en el ascensor. Sube a tu piso. Ve por las escaleras.', 'Quelqu’un est dans l’ascenseur. Il monte à ton étage. Prends l’escalier.',
    style='fast urgent whisper, like giving orders')]},
  {'dur': 1.0, 'beat': 'run', 'vo': [seg("So I ran. Six floors down. In my socks.", "So I *ran.* Six floors *down.* In my *socks.*",
    'Also rannte ich. Sechs Stockwerke runter. In Socken.', 'Así que corrí. Seis pisos abajo. En calcetines.', 'Alors j’ai couru. Six étages. En chaussettes.',
    tts="<heavy breath> So I ran. Six floors down... in my socks.", style='out of breath, running')]},
  {'dur': 1.0, 'beat': 'window', 'vo': [seg("On the third floor, I saw Mom's car in the parking lot.", "On the third floor, I saw *Mom's car* in the parking lot.",
    'Im dritten Stock sah ich Mamas Auto auf dem Parkplatz.', 'En el tercer piso vi el coche de mamá en el aparcamiento.', 'Au troisième étage, j’ai vu la voiture de maman sur le parking.',
    tts="<breath> On the third floor... I saw Mom's car in the parking lot.", style='confused, breathless, quiet')]},
  {'dur': 1.0, 'beat': 'below', 'vo': [seg("Then a voice from the stairs below. Maya? Come down, sweetie.", "Then a voice from the stairs *below.* *Maya?* Come down, sweetie.",
    'Dann eine Stimme von unten. Maya? Komm runter, Schatz.', 'Entonces una voz desde abajo. ¿Maya? Baja, cariño.', 'Puis une voix, plus bas dans l’escalier. Maya ? Descends, ma chérie.',
    tts="Then a voice from the stairs below... <short pause> Maya? <short pause> Come down, sweetie.", style='frightened whisper, then a warm, too calm mother voice')]},
  {'dur': 1.0, 'beat': 'reveal', 'vo': [seg("And my own voice whispered: that's not Mom.", "And my own voice whispered: that's *not* Mom.",
    'Und meine eigene Stimme flüsterte: Das ist nicht Mama.', 'Y mi propia voz susurró: esa no es mamá.', 'Et ma propre voix a chuchoté : ce n’est pas maman.',
    tts="And my own voice whispered... <short pause> that's NOT Mom.", style='barely audible terrified whisper', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 40, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep231', 'tag': 'SENT TOMORROW · PART 3', 'title_until': 'out', 'look': 'raw', 'next': 'PART 4', 'next_at': 'not+0.8',
 'events': {'mine0': [0, 'mine'], 'out': [0, 'out'], 'now': [0, 'now'], 'elevator': [1, 'elevator'], 'stairs': [1, 'stairs'], 'ran': [2, 'ran'], 'socks': [2, 'socks'],
            'third': [3, 'third'], 'car': [3, 'car'], 'below': [4, 'below'], 'maya': [4, 'maya'], 'sweetie': [4, 'sweetie'], 'whispered': [5, 'whispered'], 'not': [5, 'not']},
 'shots': [
  {'from': 0, 'to': 'elevator-0.4', 'vid': 'clips/answer.webm', 'zoom': [1.06, 1.16], 'focus': [[.45, .36], [.45, .32]], 'fx': {'heartbeat': True, 'sting': 'now'}},
  {'from': 'elevator-0.4', 'to': 'ran-0.2', 'vid': 'clips/elevator.webm', 'zoom': [1.0, 1.1], 'focus': [[.5, .45], [.5, .42]], 'fx': {'flicker': True}},
  {'from': 'ran-0.2', 'to': 'third-0.2', 'vid': 'clips/run.webm', 'rate': .38, 'zoom': [1.0, 1.06], 'focus': [[.5, .5], [.5, .5]], 'fx': {'heartbeat': True}},
  {'from': 'third-0.2', 'to': 'below-0.2', 'vid': 'clips/window.webm', 'zoom': [1.0, 1.1], 'focus': [[.6, .4], [.65, .35]], 'fx': {}},
  {'from': 'below-0.2', 'to': 'whispered-0.2', 'vid': 'clips/below.webm', 'zoom': [1.0, 1.15], 'focus': [[.5, .5], [.5, .5]], 'fx': {'flicker': True}},
  {'from': 'whispered-0.2', 'to': 'end', 'vid': 'clips/frozen.webm', 'zoom': [1.0, 1.12], 'focus': [[.45, .38], [.45, .34]], 'fx': {'heartbeat': True, 'sting': 'not'}},
 ],
 'cues': [['now', 0, 'hit', .7], ['elevator', 0, 'riser', .35], ['ran', 0, 'whoosh', .6], ['car', 0, 'tick', .4], ['maya', 0, 'riser', .4], ['not', 0, 'hit', .9]],
}
open('episodes/231.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
