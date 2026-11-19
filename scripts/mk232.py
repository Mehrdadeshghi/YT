#!/usr/bin/env python3
"""#232 SENT TOMORROW, part 4 of 5 (original animated mini-series, fiction).
Owner 19.11.2026: story too slow → serial craft (genre-craft skill): answer last part's question in the first 2 s, one reveal + escalation, end on a new question.
Episode question: who is on the stairs? Answer: the real Mom. Reveal: Mom got a text from "Maya": don't trust Maya. Escalation: both phones: SHE'S ALREADY INSIDE.
New question: Maya's reflection is not running, it smiles."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 232, 'title': 'SENT TOMORROW · Part 4', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'scared teenage girl telling it fast, close to the mic, tense and real', 'hook': [], 'cta': {'q': 'What is in the reflection?'},
 'vo_open': [seg("The woman on the stairs was Mom. The real one.", "The woman on the stairs was *Mom.* The *real* one.",
    'Die Frau auf der Treppe war Mama. Die echte.', 'La mujer de la escalera era mamá. La de verdad.', 'La femme dans l’escalier, c’était maman. La vraie.',
    tts="The woman on the stairs was Mom. <short pause> The REAL one.", style='breathless, fast, relieved and scared at once')],
 'scenes': [
  {'dur': 1.0, 'beat': 'text', 'vo': [seg("She was shaking. She showed me a text. From me. Don't trust Maya.", "She was *shaking.* She showed me a text. From *me.* Don't trust *Maya.*",
    'Sie zitterte. Sie zeigte mir eine Nachricht. Von mir. Trau Maya nicht.', 'Estaba temblando. Me enseñó un mensaje. Mío. No confíes en Maya.', 'Elle tremblait. Elle m’a montré un message. De moi. Ne fais pas confiance à Maya.',
    tts="She was shaking. She showed me a text... from ME. <short pause> Don't trust Maya.", style='fast, confused, rising fear')]},
  {'dur': 1.0, 'beat': 'both', 'vo': [seg("I never sent that. Then both our phones buzzed. She's already inside.", "I never *sent* that. Then *both* our phones buzzed. She's *already inside.*",
    'Das habe ich nie geschickt. Dann summten beide Handys. Sie ist schon drin.', 'Yo nunca lo envié. Entonces vibraron los dos móviles. Ya está dentro.', 'Je ne l’ai jamais envoyé. Puis nos deux téléphones ont vibré. Elle est déjà à l’intérieur.',
    tts="I never sent that. <gasp> Then BOTH our phones buzzed. <short pause> She's already inside.", style='urgent, panicked whisper')]},
  {'dur': 1.0, 'beat': 'flee', 'vo': [seg("Mom grabbed my hand and we ran.", "Mom grabbed my hand and we *ran.*",
    'Mama packte meine Hand und wir rannten.', 'Mamá me agarró la mano y corrimos.', 'Maman m’a pris la main et on a couru.',
    tts="<heavy breath> Mom grabbed my hand and we RAN.", style='out of breath, running')]},
  {'dur': 1.0, 'beat': 'mirror', 'vo': [seg("But in the window, my reflection wasn't running. It was smiling.", "But in the window, my reflection *wasn't* running. It was *smiling.*",
    'Aber im Fenster rannte mein Spiegelbild nicht. Es lächelte.', 'Pero en la ventana, mi reflejo no corría. Sonreía.', 'Mais dans la vitre, mon reflet ne courait pas. Il souriait.',
    tts="But in the window... <short pause> my reflection wasn't running. <breath> It was smiling.", style='slow, horrified whisper', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 60, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep232', 'tag': 'SENT TOMORROW · PART 4', 'title_until': 'real', 'look': 'raw', 'next': 'PART 5', 'next_at': 'smiling+0.8',
 'events': {'mom0': [0, 'mom'], 'real': [0, 'real'], 'shaking': [1, 'shaking'], 'text': [1, 'text'], 'me': [1, 'me'], 'maya': [1, 'maya'], 'never': [2, 'never'], 'both': [2, 'both'],
            'buzzed': [2, 'buzzed'], 'inside': [2, 'inside'], 'grabbed': [3, 'grabbed'], 'ran': [3, 'ran'], 'window': [4, 'window'], 'reflection': [4, 'reflection'], 'smiling': [4, 'smiling']},
 'shots': [
  {'from': 0, 'to': 'shaking-0.2', 'vid': 'clips/mom.webm', 'zoom': [1.04, 1.14], 'focus': [[.5, .4], [.5, .36]], 'fx': {'sting': 'real'}},
  {'from': 'shaking-0.2', 'to': 'never-0.2', 'vid': 'clips/momphone.webm', 'rate': .7, 'zoom': [1.0, 1.1], 'focus': [[.4, .45], [.35, .45]], 'fx': {'msg': {'at': 'me', 'txt': 'Don’t trust Maya.', 'from': 'Maya'}, 'heartbeat': True}},
  {'from': 'never-0.2', 'to': 'grabbed-0.2', 'img': 'phones.jpg', 'zoom': [1.0, 1.1], 'focus': [[.5, .45], [.5, .45]], 'fx': {'msg': {'at': 'buzzed', 'txt': 'SHE’S ALREADY INSIDE.', 'from': 'Unknown'}, 'buzz': 'buzzed', 'glitch': 'inside'}},
  {'from': 'grabbed-0.2', 'to': 'window-0.2', 'vid': 'clips/flee.webm', 'rate': .45, 'zoom': [1.0, 1.06], 'focus': [[.5, .5], [.5, .5]], 'fx': {'heartbeat': True}},
  {'from': 'window-0.2', 'to': 'smiling-0.25', 'vid': 'clips/mirror.webm', 'grade': 'saturate(.85) contrast(1.3) brightness(2.1)', 'zoom': [1.25, 1.45], 'focus': [[.42, .3], [.42, .28]], 'fx': {'rain': True}},
  {'from': 'smiling-0.25', 'to': 'end', 'img': 'smile.jpg', 'zoom': [1.05, 1.3], 'focus': [[.45, .38], [.45, .36]], 'fx': {'sting': 'smiling', 'rain': True}},
 ],
 'cues': [['real', 0, 'hit', .7], ['me', 0, 'ding', .5], ['buzzed', 0, 'zap', .6], ['inside', 0, 'hit', .8], ['ran', 0, 'whoosh', .6], ['reflection', 0, 'riser', .4], ['smiling', 0, 'hit', .9]],
}
open('episodes/232.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
