#!/usr/bin/env python3
"""#233 SENT TOMORROW, part 5 of 5 = finale (original animated mini-series, fiction).
Serial craft (owner 19.11.2026): answer Part 4's question at once (the reflection is alive: the glass cracks), state the monster rule
(she can only come through glass), set piece (smash the window), close the loop (Maya sends the first text herself), twist for season 2."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 233, 'title': 'SENT TOMORROW · Part 5 (Finale)', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'teenage girl telling it fast, close to the mic, tense and real', 'hook': [], 'cta': {'q': 'Season 2?'},
 'vo_open': [seg("My reflection pressed its hand on the glass. And the glass cracked.", "My reflection pressed its hand on the glass. And the glass *cracked.*",
    'Mein Spiegelbild drückte die Hand ans Glas. Und das Glas bekam Risse.', 'Mi reflejo apoyó la mano en el cristal. Y el cristal se agrietó.', 'Mon reflet a posé sa main sur la vitre. Et la vitre s’est fissurée.',
    tts="My reflection pressed its hand on the glass... <short pause> and the glass CRACKED.", style='terrified, fast, breathless')],
 'scenes': [
  {'dur': 1.0, 'beat': 'rule', 'vo': [seg("One last text from me. Break the glass. She can only come through glass.", "One last text from *me.* Break the glass. She can only come through *glass.*",
    'Eine letzte Nachricht von mir. Zerbrich das Glas. Sie kommt nur durch Glas.', 'Un último mensaje mío. Rompe el cristal. Solo puede pasar a través del cristal.', 'Un dernier message de moi. Casse la vitre. Elle ne peut passer que par le verre.',
    tts="<gasp> One last text from me. <short pause> Break the glass. She can only come through glass.", style='urgent whisper, reading fast')]},
  {'dur': 1.0, 'beat': 'smash', 'vo': [seg("So I grabbed the fire extinguisher. And I smashed it.", "So I grabbed the *fire extinguisher.* And I *smashed* it.",
    'Also packte ich den Feuerlöscher. Und schlug zu.', 'Así que agarré el extintor. Y lo rompí.', 'Alors j’ai attrapé l’extincteur. Et je l’ai brisée.',
    tts="So I grabbed the fire extinguisher... <breath> and I SMASHED it.", style='fierce, determined, shouting the last word')]},
  {'dur': 1.0, 'beat': 'loop', 'vo': [seg("At sunrise, we were safe. I typed one text to myself. Don't open the door. And hit send.", "At *sunrise,* we were safe. I typed one text to *myself.* Don't open the door. And hit *send.*",
    'Bei Sonnenaufgang waren wir sicher. Ich schrieb mir selbst eine Nachricht. Mach die Tür nicht auf. Und drückte auf Senden.', 'Al amanecer estábamos a salvo. Me escribí un mensaje a mí misma. No abras la puerta. Y lo envié.', 'Au lever du soleil, on était en sécurité. Je me suis écrit un message. N’ouvre pas la porte. Et j’ai appuyé sur envoyer.',
    tts="<sigh> At sunrise, we were safe. <short pause> I typed one text to myself... Don't open the door. <short pause> And hit send.", style='calm, exhausted, relieved, quiet')]},
  {'dur': 1.0, 'beat': 'twist', 'vo': [seg("But in the car window, Mom's reflection was still smiling.", "But in the car window, *Mom's* reflection was still *smiling.*",
    'Aber in der Autoscheibe lächelte Mamas Spiegelbild immer noch.', 'Pero en la ventanilla del coche, el reflejo de mamá seguía sonriendo.', 'Mais dans la vitre de la voiture, le reflet de maman souriait encore.',
    tts="But in the car window... <short pause> Mom's reflection was still smiling.", style='slow, chilling whisper', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 80, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep233', 'tag': 'SENT TOMORROW · FINALE', 'title_until': 'cracked', 'look': 'raw', 'next': 'THE END?', 'next2': '', 'next_at': 'smiling+0.8',
 'events': {'glass0': [0, 'glass'], 'cracked': [0, 'cracked'], 'last': [1, 'last'], 'me': [1, 'me'], 'break': [1, 'break'], 'only': [1, 'only'], 'grabbed': [2, 'grabbed'], 'smashed': [2, 'smashed'],
            'sunrise': [3, 'sunrise'], 'myself': [3, 'myself'], 'dont': [3, 'dont'], 'send': [3, 'send'], 'car': [4, 'car'], 'moms': [4, 'moms'], 'smiling': [4, 'smiling']},
 'shots': [
  {'from': 0, 'to': 'last-0.2', 'vid': 'clips/crack.webm', 'grade': 'saturate(.85) contrast(1.2) brightness(1.7)', 'zoom': [1.0, 1.12], 'focus': [[.45, .4], [.45, .38]], 'fx': {'sting': 'cracked', 'rain': True}},
  {'from': 'last-0.2', 'to': 'grabbed-0.2', 'img': 'phone.jpg', 'zoom': [1.0, 1.12], 'focus': [[.5, .45], [.5, .42]], 'fx': {'msg': {'at': 'me', 'txt': 'Break the glass. She can only come through glass.', 'from': 'Me'}, 'buzz': 'last', 'glitch': 'only'}},
  {'from': 'grabbed-0.2', 'to': 'smashed+1.0', 'img': 'smash.jpg', 'zoom': [1.0, 1.2], 'focus': [[.45, .45], [.45, .45]], 'fx': {'sting': 'smashed'}},
  {'from': 'smashed+1.0', 'to': 'car-0.2', 'vid': 'clips/dawn.webm', 'zoom': [1.0, 1.1], 'focus': [[.35, .55], [.3, .55]], 'fx': {'msg': {'at': 'dont', 'txt': 'Don’t open the door.', 'from': 'To: Me · SENT'}}},
  {'from': 'car-0.2', 'to': 'end', 'img': 'carwin.jpg', 'zoom': [1.0, 1.25], 'focus': [[.4, .4], [.4, .36]], 'fx': {'sting': 'smiling'}},
 ],
 'cues': [['cracked', 0, 'crack', .9], ['me', 0, 'ding', .5], ['grabbed', 0, 'whoosh', .5], ['smashed', 0, 'boom', 1.0], ['smashed', .05, 'crack', .9], ['send', 0, 'pop', .5], ['car', 0, 'riser', .4], ['smiling', 0, 'hit', .9]],
}
open('episodes/233.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
