#!/usr/bin/env python3
"""#230 SENT TOMORROW, part 2 of 5 (original animated mini-series, fiction). Frames: Figma; motion: Wan 2.2 on Kaggle (scripts/comic/ep230/clips.json → clips/*.webm);
voice: Gemini 3.8 with per-line delivery ("style") and light inline vocal tags ("tts"); no yes/no ask (owner, 16.11.2026)."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 230, 'title': 'SENT TOMORROW · Part 2', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'scared teenage girl, close to the mic, tense and real', 'hook': [], 'cta': {'q': 'Whose voice was it?'},
 'vo_open': [seg("She didn't knock again. She slid something under my door.", "She didn't *knock* again. She *slid* something under my door.",
    'Sie klopfte nicht noch einmal. Sie schob etwas unter meiner Tür durch.', 'No volvió a llamar. Deslizó algo por debajo de mi puerta.', 'Elle n’a plus frappé. Elle a glissé quelque chose sous ma porte.',
    tts="She didn't knock again... <short pause> She slid something under my door.", style='shaky whisper, frightened')],
 'scenes': [
  {'dur': 1.0, 'beat': 'note', 'vo': [seg("A note. In my handwriting. Don't trust Mom's call at twelve oh seven.", "A *note.* In *my* handwriting. Don't trust Mom's call at *12:07.*",
    'Ein Zettel. In meiner Handschrift. Trau Mamas Anruf um 0:07 Uhr nicht.', 'Una nota. Con mi letra. No confíes en la llamada de mamá a las 12:07.', 'Un mot. De mon écriture. Ne crois pas l’appel de maman à minuit sept.',
    tts="<breath> A note. In MY handwriting. <short pause> Don't trust Mom's call at twelve oh seven.", style='disbelief, quiet, reading slowly')]},
  {'dur': 1.0, 'beat': 'clock', 'vo': [seg("It was twelve oh six.", "It was *12:06.*", 'Es war 0:06 Uhr.', 'Eran las 12:06.', 'Il était minuit six.', style='barely breathing whisper')]},
  {'dur': 1.0, 'beat': 'call', 'vo': [seg("Then my phone rang. Mom.", "Then my phone *rang.* *Mom.*", 'Dann klingelte mein Handy. Mama.', 'Entonces sonó mi móvil. Mamá.', 'Puis mon téléphone a sonné. Maman.',
    tts="<gasp> Then my phone rang. <short pause> Mom.", style='startled, scared')]},
  {'dur': 1.0, 'beat': 'empty', 'vo': [seg("I checked the peephole again. The hallway was empty.", "I checked the *peephole* again. The hallway was *empty.*",
    'Ich schaute wieder durch den Türspion. Der Flur war leer.', 'Volví a mirar por la mirilla. El pasillo estaba vacío.', 'J’ai regardé par le judas. Le couloir était vide.', style='tense whisper')]},
  {'dur': 1.0, 'beat': 'reveal', 'vo': [seg("So I answered. And it wasn't Mom's voice. It was mine.", "So I *answered.* And it wasn't *Mom's* voice. It was *mine.*",
    'Also ging ich ran. Und es war nicht Mamas Stimme. Es war meine.', 'Así que contesté. Y no era la voz de mamá. Era la mía.', 'Alors j’ai répondu. Et ce n’était pas la voix de maman. C’était la mienne.',
    tts="So I answered... <short pause> and it wasn't Mom's voice. <breath> It was MINE.", style='trembling, horrified whisper', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 20, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep230', 'tag': 'SENT TOMORROW · PART 2', 'title_until': 'slid', 'look': 'raw', 'next': 'PART 3', 'next_at': 'mine+0.6',
 'events': {'knock': [0, 'knock'], 'slid': [0, 'slid'], 'note': [1, 'note'], 'hand': [1, 'handwriting'], 'dont': [1, 'dont'], 'six': [2, '1206'], 'rang': [3, 'rang'], 'mom': [3, 'mom'],
            'peephole': [4, 'peephole'], 'empty': [4, 'empty'], 'answered': [5, 'answered'], 'mine': [5, 'mine']},
 'shots': [
  {'from': 0, 'to': 'note-0.2', 'vid': 'clips/note.webm', 'rate': .55, 'zoom': [1.0, 1.08], 'focus': [[.5, .55], [.5, .6]], 'fx': {}},
  {'from': 'note-0.2', 'to': 'six-0.2', 'vid': 'clips/unfold.webm', 'rate': .12, 'zoom': [1.0, 1.06], 'focus': [[.45, .5], [.45, .5]], 'fx': {'note': {'at': 'hand', 'lines': ['Don’t trust', 'Mom’s call', 'at 12:07.', '— M']}}},
  {'from': 'six-0.2', 'to': 'rang-0.15', 'img': 'phone.jpg', 'zoom': [1.0, 1.12], 'focus': [[.5, .45], [.5, .42]], 'fx': {'screen': {'rect': [.308, .226, .692, .649], 'clock': {'from': '12:06', 'to': '12:07', 'change': 'six+0.9', 'label': 'MONDAY'}, 'msgs': []}}},
  {'from': 'rang-0.15', 'to': 'peephole-0.2', 'vid': 'clips/floor.webm', 'rate': .75, 'zoom': [1.0, 1.08], 'focus': [[.45, .45], [.45, .42]], 'fx': {'call': {'at': 'rang', 'name': 'Mom'}, 'buzz': 'rang', 'heartbeat': True}},
  {'from': 'peephole-0.2', 'to': 'answered-0.2', 'vid': 'clips/empty.webm', 'zoom': [1.0, 1.12], 'focus': [[.5, .5], [.5, .48]], 'fx': {'flicker': True}},
  {'from': 'answered-0.2', 'to': 'end', 'vid': 'clips/answer.webm', 'zoom': [1.0, 1.14], 'focus': [[.45, .38], [.45, .34]], 'fx': {'heartbeat': True, 'sting': 'mine'}},
 ],
 'cues': [['slid', 0, 'scratch', .5], ['note', 0, 'pen', .4], ['six', 0, 'tick', .5], ['rang', 0, 'beep', .9], ['rang', .5, 'beep', .9], ['rang', 1.0, 'beep', .9], ['empty', 0, 'riser', .3], ['answered', 0, 'click', .6], ['mine', 0, 'hit', .9]],
}
open('episodes/230.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
