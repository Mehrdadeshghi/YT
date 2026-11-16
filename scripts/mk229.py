#!/usr/bin/env python3
"""#229 SENT TOMORROW, part 1 of 5: original animated mini-series (strategy since 16.11.2026: mini-series, strong hooks, one continuing story, animation).
Pictures: own illustrations generated in Figma (file "SENT TOMORROW – character tests"), animated by scripts/comic/series.js. Fiction; Maya narrates (first person).
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 229, 'title': 'SENT TOMORROW · Part 1', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 165, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'A 17-year-old girl telling a true story that still scares her: hushed, tense, intimate, natural pauses before the reveals, rising fear at the end. Not theatrical.',
 'hook': ['A TEXT FROM', 'MY OWN NUMBER'], 'cta': {'q': 'Should I open the door?', 'a': 'yes', 'b': 'no'},
 'vo_open': [seg('At eleven fifty-eight p m, I got a text from my own number.', 'At *11:58 p.m.,* I got a text from my *own number.*',
    'Um 23:58 Uhr bekam ich eine Nachricht von meiner eigenen Nummer.', 'A las 11:58 de la noche recibí un mensaje de mi propio número.', 'À 23h58, j’ai reçu un message de mon propre numéro.')],
 'scenes': [
  {'dur': 1.0, 'beat': 'text', 'vo': [seg("It said: don't open the door. Sent... tomorrow.", "It said: *don't open the door.* Sent... *tomorrow.*",
    'Da stand: Mach die Tür nicht auf. Gesendet… morgen.', 'Decía: no abras la puerta. Enviado… mañana.', 'Il disait : n’ouvre pas la porte. Envoyé… demain.')]},
  {'dur': 1.0, 'beat': 'laugh', 'vo': [seg("I laughed. A glitch, right? Then someone knocked.", "I *laughed.* A *glitch,* right? Then someone *knocked.*",
    'Ich lachte. Ein Fehler, oder? Dann klopfte jemand.', 'Me reí. Un fallo, ¿no? Entonces alguien llamó a la puerta.', 'J’ai ri. Un bug, non ? Puis quelqu’un a frappé.')]},
  {'dur': 1.0, 'beat': 'alone', 'vo': [seg("Mom was on a night shift. I was alone.", "Mom was on a *night shift.* I was *alone.*",
    'Mama hatte Nachtschicht. Ich war allein.', 'Mamá tenía turno de noche. Estaba sola.', 'Maman était de garde de nuit. J’étais seule.')]},
  {'dur': 1.0, 'beat': 'second', 'vo': [seg("Another text from me: look through the peephole. Don't make a sound.", "Another text from *me:* look through the *peephole.* Don't make a *sound.*",
    'Noch eine Nachricht von mir: Schau durch den Türspion. Mach kein Geräusch.', 'Otro mensaje mío: mira por la mirilla. No hagas ruido.', 'Un autre message de moi : regarde par le judas. Ne fais pas de bruit.')]},
  {'dur': 1.0, 'beat': 'reveal', 'vo': [seg("So I looked. And the girl standing outside... was me.", "So I *looked.* And the girl standing outside... was *me.*",
    'Also schaute ich. Und das Mädchen da draußen… war ich.', 'Así que miré. Y la chica que estaba afuera… era yo.', 'Alors j’ai regardé. Et la fille dehors… c’était moi.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Should I open the door? Comment yes or no. Part two tomorrow.", "Should I open the door? Comment *yes* or *no.* Part *two* tomorrow.",
    'Soll ich die Tür aufmachen? Schreib Ja oder Nein. Teil zwei morgen.', '¿Abro la puerta? Comenta sí o no. Segunda parte mañana.', 'Je dois ouvrir la porte ? Commente oui ou non. Deuxième partie demain.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep229', 'tag': 'SENT TOMORROW · PART 1', 'title_until': 'said-0.1',
 'events': {'own': [0, 'own'], 'said': [1, 'said'], 'door': [1, 'door'], 'sent': [1, 'sent'], 'tomorrow': [1, 'tomorrow'], 'laughed': [2, 'laughed'], 'glitch': [2, 'glitch'], 'knocked': [2, 'knocked'],
            'mom': [3, 'mom'], 'alone': [3, 'alone'], 'another': [4, 'another'], 'peephole': [4, 'peephole'], 'sound': [4, 'sound'], 'looked': [5, 'looked'], 'outside': [5, 'outside'], 'me': [5, 'me']},
 'shots': [
  {'from': 0, 'to': 'said-0.2', 'img': 'bed.jpg', 'zoom': [1.0, 1.14], 'focus': [[.45, .55], [.4, .62]], 'fx': {'rain': [.5, 0, 1, .42], 'glow': [.45, .63, .22, '#5ef0ff'], 'buzz': 'own-1.2'}},
  {'from': 'said-0.2', 'to': 'laughed-0.25', 'img': 'phone.jpg', 'zoom': [1.0, 1.1], 'focus': [[.5, .45], [.5, .42]], 'fx': {'screen': {'rect': [.308, .226, .692, .649], 'msgs': [{'at': 'said', 'from': 'Me', 'txt': 'Don’t open the door.', 'sub': 'SENT: TOMORROW 11:58 PM', 'sub_at': 'sent'}]}, 'glitch': 'tomorrow'}},
  {'from': 'laughed-0.25', 'to': 'knocked-0.15', 'img': 'laugh.jpg', 'zoom': [1.02, 1.1], 'focus': [[.45, .4], [.45, .38]], 'fx': {'rain': [.5, 0, 1, .4], 'glow': [.55, .5, .2, '#5ef0ff']}},
  {'from': 'knocked-0.15', 'to': 'another-0.3', 'img': 'door.jpg', 'zoom': [1.0, 1.2], 'focus': [[.5, .5], [.5, .55]], 'fx': {'knock': ['knocked', 'knocked+0.45'], 'underlight': [.5, .63]}},
  {'from': 'another-0.3', 'to': 'looked-0.25', 'img': 'wall.jpg', 'zoom': [1.04, 1.16], 'focus': [[.4, .35], [.38, .3]], 'fx': {'glow': [.37, .33, .16, '#5ef0ff'], 'buzz': 'another', 'heartbeat': True, 'msg': {'at': 'another', 'txt': 'Look through the peephole. Don’t make a sound.', 'from': 'Me'}}},
  {'from': 'looked-0.25', 'to': 'outside-0.1', 'img': 'peek.jpg', 'zoom': [1.0, 1.18], 'focus': [[.7, .3], [.78, .25]], 'fx': {'heartbeat': True}},
  {'from': 'outside-0.1', 'to': 'end', 'img': 'peephole.jpg', 'zoom': [1.0, 1.3], 'focus': [[.5, .45], [.5, .42]], 'fx': {'flicker': True, 'sting': 'me'}},
 ],
 'cues': [['own', -1.2, 'beep', .5], ['said', 0, 'pop', .4], ['tomorrow', 0, 'zap', .6], ['laughed', 0, 'bloop', .3], ['knocked', 0, 'thump', 1], ['knocked', .45, 'thump', 1], ['alone', 0, 'riser', .35], ['another', 0, 'beep', .5], ['peephole', 0, 'tick', .4], ['looked', 0, 'swish', .4], ['me', 0, 'hit', .9], ['cta_a', 0, 'pop', .6], ['cta_b', 0, 'pop', .6]],
}
open('episodes/229.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
