#!/usr/bin/env python3
"""#229 SENT TOMORROW, part 1 of 5: original animated mini-series (strategy since 16.11.2026: mini-series, strong hooks, one continuing story, animation).
Pictures: own illustrations generated in Figma (file "SENT TOMORROW – character tests"), animated by scripts/comic/series.js. Fiction; Maya narrates (first person).
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 229, 'title': 'SENT TOMORROW · Part 1', 'format': 'mini-series', 'series': 'SENT TOMORROW',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_voice': 'Leda', 'gemini_wpm': 100, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'gemini_style': 'scared teenage girl, close to the mic, tense and real',
 'hook': [], 'cta': {'q': 'Who is outside the door?'},
 'vo_open': [seg("Someone is knocking on my door, and my phone just told me not to open it.", "Someone is *knocking* on my door, and my phone just told me *not* to open it.",
    'Jemand klopft an meine Tür, und mein Handy hat mir gerade gesagt, dass ich nicht aufmachen soll.', 'Alguien está llamando a mi puerta, y mi móvil me acaba de decir que no abra.', 'Quelqu’un frappe à ma porte, et mon téléphone vient de me dire de ne pas ouvrir.',
    tts="<whispers> Someone is knocking on my door... <short pause> and my phone just told me NOT to open it.")],
 'scenes': [
  {'dur': 1.0, 'beat': 'text', 'vo': [seg("Twelve minutes ago, I got a text from my own number. Don't open the door. Sent... tomorrow.", "*Twelve minutes* ago, I got a text from my *own number.* *Don't* open the door. Sent... *tomorrow.*",
    'Vor zwölf Minuten bekam ich eine Nachricht von meiner eigenen Nummer. Mach die Tür nicht auf. Gesendet… morgen.', 'Hace doce minutos recibí un mensaje de mi propio número. No abras la puerta. Enviado… mañana.', 'Il y a douze minutes, j’ai reçu un message de mon propre numéro. N’ouvre pas la porte. Envoyé… demain.',
    tts="<breath> Twelve minutes ago, I got a text. From my OWN number. <short pause> Don't open the door. <short pause> Sent... tomorrow.")]},
  {'dur': 1.0, 'beat': 'laugh', 'vo': [seg("I thought it was a glitch. Then the knocking started.", "I thought it was a *glitch.* Then the *knocking* started.",
    'Ich dachte, es wäre ein Fehler. Dann fing das Klopfen an.', 'Pensé que era un fallo. Entonces empezaron los golpes.', 'J’ai cru à un bug. Puis on a commencé à frapper.',
    tts="<chuckle> I thought it was a glitch. <long pause> Then the knocking started.")]},
  {'dur': 1.0, 'beat': 'alone', 'vo': [seg("Mom's on a night shift. I'm alone.", "Mom's on a *night shift.* I'm *alone.*",
    'Mama hat Nachtschicht. Ich bin allein.', 'Mamá tiene turno de noche. Estoy sola.', 'Maman est de garde de nuit. Je suis seule.',
    tts="<whispers> Mom's on a night shift. <breath> I'm alone.")]},
  {'dur': 1.0, 'beat': 'second', 'vo': [seg("Then another text, from me. Look through the peephole. Don't make a sound.", "Then *another* text, from *me.* Look through the *peephole.* Don't make a *sound.*",
    'Dann noch eine Nachricht, von mir. Schau durch den Türspion. Mach kein Geräusch.', 'Luego otro mensaje, mío. Mira por la mirilla. No hagas ruido.', 'Puis un autre message, de moi. Regarde par le judas. Ne fais pas de bruit.',
    tts="<gasp> Then another text... from me. <whispers> Look through the peephole. Don't make a sound.")]},
  {'dur': 1.0, 'beat': 'reveal', 'vo': [seg("So I looked. And the girl standing outside was me.", "So I *looked.* And the girl standing outside was *me.*",
    'Also schaute ich. Und das Mädchen da draußen war ich.', 'Así que miré. Y la chica de afuera era yo.', 'Alors j’ai regardé. Et la fille dehors, c’était moi.',
    tts="<heavy breath> So I looked... <long pause> <whispers> and the girl standing outside... was ME.")]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("She's still out there.", "She's *still* out there.",
    'Sie ist immer noch da draußen.', 'Sigue ahí fuera.', 'Elle est toujours dehors.', tts="<whispers> She's still out there.", cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': .9}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['comic'] = {
 'dir': 'scripts/comic/ep229', 'tag': 'SENT TOMORROW · PART 1', 'title_until': 'ago', 'look': 'raw',
 'events': {'knocking0': [0, 'knocking'], 'not': [0, 'not'], 'ago': [1, 'twelve'], 'own': [1, 'own'], 'dont': [1, 'dont'], 'sent': [1, 'sent'], 'tomorrow': [1, 'tomorrow'],
            'thought': [2, 'thought'], 'glitch': [2, 'glitch'], 'knocking': [2, 'knocking'], 'mom': [3, 'moms'], 'alone': [3, 'alone'], 'another': [4, 'another'], 'peephole': [4, 'peephole'],
            'looked': [5, 'looked'], 'outside': [5, 'outside'], 'me': [5, 'me'], 'still': [6, 'still']},
 'shots': [
  {'from': 0, 'to': 'ago-0.2', 'img': 'door.jpg', 'zoom': [1.06, 1.16], 'focus': [[.5, .52], [.5, .56]], 'fx': {'knock': [0.12, 0.5, 'knocking0'], 'underlight': [.5, .63], 'msg': {'at': 0.05, 'txt': 'DON\u2019T OPEN THE DOOR.', 'from': 'Me'}}},
  {'from': 'ago-0.2', 'to': 'dont-0.25', 'img': 'bed.jpg', 'zoom': [1.0, 1.08], 'focus': [[.45, .55], [.42, .6]], 'fx': {'rain': [.5, 0, 1, .42], 'buzz': 'own-0.4'}},
  {'from': 'dont-0.25', 'to': 'thought-0.2', 'img': 'phone.jpg', 'zoom': [1.0, 1.1], 'focus': [[.5, .45], [.5, .42]], 'fx': {'screen': {'rect': [.308, .226, .692, .649], 'msgs': [{'at': 'dont', 'from': 'Me', 'txt': 'Don\u2019t open the door.', 'sub': 'SENT: TOMORROW 11:58 PM', 'sub_at': 'sent'}]}, 'glitch': 'tomorrow'}},
  {'from': 'thought-0.2', 'to': 'knocking-0.1', 'img': 'laugh.jpg', 'zoom': [1.02, 1.08], 'focus': [[.45, .4], [.45, .38]], 'fx': {'rain': [.5, 0, 1, .4]}},
  {'from': 'knocking-0.1', 'to': 'mom-0.15', 'img': 'door.jpg', 'zoom': [1.12, 1.24], 'focus': [[.5, .62], [.5, .66]], 'fx': {'knock': ['knocking', 'knocking+0.4', 'knocking+0.8'], 'underlight': [.5, .63]}},
  {'from': 'mom-0.15', 'to': 'looked-0.2', 'img': 'wall.jpg', 'zoom': [1.0, 1.1], 'focus': [[.4, .35], [.38, .3]], 'fx': {'buzz': 'another', 'heartbeat': True, 'msg': {'at': 'another', 'txt': 'Look through the peephole. Don\u2019t make a sound.', 'from': 'Me'}}},
  {'from': 'looked-0.2', 'to': 'outside-0.1', 'img': 'peek.jpg', 'zoom': [1.0, 1.1], 'focus': [[.7, .3], [.76, .26]], 'fx': {'heartbeat': True}},
  {'from': 'outside-0.1', 'to': 'end', 'img': 'peephole.jpg', 'zoom': [1.0, 1.22], 'focus': [[.5, .45], [.5, .42]], 'fx': {'flicker': True, 'sting': 'me'}},
 ],
 'cues': [[ 'knocking0', 0, 'thump', 1], ['not', -.1, 'beep', .5], ['own', -.4, 'beep', .45], ['tomorrow', 0, 'zap', .6], ['knocking', 0, 'thump', 1], ['knocking', .4, 'thump', 1], ['knocking', .8, 'thump', 1], ['alone', 0, 'riser', .3], ['another', -.2, 'beep', .5], ['looked', 0, 'swish', .35], ['me', 0, 'hit', .9]],
}
# animated clips (Wan 2.2 on Kaggle, scripts/comic/ep229/clips.json → clips/*.webm) replace the stills; the door clip opened the door, so the door stays a still
for s in E['comic']['shots']:
    v = {'bed.jpg': 'bed', 'laugh.jpg': 'laugh', 'wall.jpg': 'wall', 'peek.jpg': 'peek', 'peephole.jpg': 'peephole'}.get(s.get('img'))
    if v: s['vid'] = f'clips/{v}.webm'; s.pop('img'); s['zoom'] = [1.0, 1.06]; s.update({'rate': .85} if v == 'peek' else {})
open('episodes/229.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
