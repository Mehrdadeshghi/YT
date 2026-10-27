#!/usr/bin/env python3
"""#203 REEL v2 (experiment E8) — How the black box survives a crash (and why it's orange). 27 Oct 2026. Voice: gemini.
Hook formula 22 "Contrarian Flip" (hookscore 73.0 STRONG): "3,400 G's. The black box on your flight survives it, and it's not even black."
On screen "3,400 G / NOT EVEN BLACK".
Facts: English Wikipedia "Flight recorder" (Oct 2026):
- "required to be painted bright orange, to aid in their recovery after accidents"; "the unit is usually mounted in the aircraft's
  tail section, where it is more likely to survive a crash".
- "withstand an acceleration of 3400 g (33 km/s2) for 6.5 milliseconds. This is roughly equivalent to an impact velocity of
  270 knots (310 mph; 500 km/h)".
- "temperatures of over 1,000 °C (1,830 °F)".
- underwater locator beacon: "operate for up to 30 days and are able to operate while immersed to a depth of up to 6,000 meters (20,000 ft)".
- (Popular culture) "why the entire airplane is not made out of the material … (it's because then it would be too heavy to fly)".
Media: NTSB photos (public domain), recorders in the tail + locator beacon by YSSYguy (CC BY-SA 3.0), drawn graphics labelled GRAPHIC."""
import json

def SHOW(text, nums):
    """caption tokens: spoken number words -> digits ("~" merges a token into the previous one)"""
    tk = text.split(' '); out = list(tk); low = [t.lower() for t in tk]
    for ph, dg in nums.items():
        p = ph.lower().split(' ')
        for i in range(len(tk) - len(p) + 1):
            if [x.rstrip('.,?!:') for x in low[i:i + len(p)]] == p:
                last = tk[i + len(p) - 1]; tail = last[len(last.rstrip('.,?!:')):]
                out[i] = dg + tail; out[i + 1:i + len(p)] = ['~'] * (len(p) - 1)
    return ' '.join(out)
def fixshow(E, nums):
    for sg in E['vo_open'] + [v for s in E['scenes'] for v in s['vo']]:
        if sg.get('cta'): continue
        s = SHOW(sg['text'], nums)
        if s != sg['text']: sg['show'] = s
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 203, 'title': 'How the black box survives a crash', 'format': 'reel2', 'hook_formula': '22 Contrarian Flip',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'epic', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['3,400 G', 'NOT EVEN BLACK'],
 'cta': {'q': 'Did you know it was orange?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Flight_recorder',
 'vo_open': [V("Three thousand four hundred G's. The black box on your flight survives it, and it's not even black.",
   "*3,400 G's.* The *black box* on your flight survives it, and it's *not even black.*",
   'Dreitausendvierhundert g. Die Blackbox in deinem Flugzeug übersteht das, und sie ist nicht mal schwarz.',
   'Tres mil cuatrocientas g. La caja negra de tu vuelo lo resiste, y ni siquiera es negra.',
   "Trois mille quatre cents g. La boîte noire de ton avion y survit, et elle n'est même pas noire.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V("It's bright orange, so investigators can find it. And it sits in the tail, the safest spot.",
    "It's *bright orange,* so investigators can *find it.* And it sits in the *tail,* the safest spot.",
    'Sie ist knallorange, damit Ermittler sie finden. Und sie sitzt im Heck, dem sichersten Platz.',
    'Es naranja brillante, para que los investigadores la encuentren. Y va en la cola, el lugar más seguro.',
    "Elle est orange vif, pour que les enquêteurs la retrouvent. Et elle est dans la queue, l'endroit le plus sûr.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V("Like hitting the ground at three hundred ten miles per hour. Then fire: over one thousand eight hundred thirty degrees.",
    "Like hitting the ground at *310 mph.* Then *fire:* over *1,830 °F.*",
    'Das entspricht einem Aufprall mit rund fünfhundert Kilometern pro Stunde. Dann das Feuer: über tausend Grad Celsius.',
    'Es como chocar contra el suelo a unos quinientos kilómetros por hora. Luego el fuego: más de mil grados Celsius.',
    "C'est comme percuter le sol à environ cinq cents kilomètres à l'heure. Puis le feu : plus de mille degrés Celsius.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('If it sinks, a beacon pings for thirty days, even twenty thousand feet down.',
    'If it sinks, a *beacon pings* for *30 days,* even *20,000 feet* down.',
    'Versinkt sie, sendet ein Peilsender bis zu dreißig Tage lang Signale, aus bis zu sechstausend Metern Tiefe.',
    'Si se hunde, una baliza emite señales hasta treinta días, desde hasta seis mil metros de profundidad.',
    "Si elle coule, une balise émet des signaux jusqu'à trente jours, depuis six mille mètres de profondeur.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V('Why not build the whole plane out of it? Too heavy to fly.',
    'Why not build the *whole plane* out of it? *Too heavy to fly.*',
    'Warum also nicht das ganze Flugzeug daraus bauen? Es wäre zu schwer zum Fliegen.',
    '¿Y por qué no construir todo el avión con eso? Sería demasiado pesado para volar.',
    "Alors pourquoi ne pas construire tout l'avion comme ça ? Il serait trop lourd pour voler.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [
    V('Did you know it was orange? Comment yes or no.', None,
      'Wusstest du, dass sie orange ist? Ja oder nein, schreib es in die Kommentare.',
      '¿Sabías que era naranja? Sí o no, coméntalo abajo.',
      "Tu savais qu'elle était orange ? Oui ou non, dis-le en commentaire.", cta=True),
    V('The black box was never black.', 'The *black box* was *never black.*',
      'Denn die Blackbox war nie schwarz.',
      'Porque la caja negra nunca fue negra.',
      "Parce que la boîte noire n'a jamais été noire.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'potomac', 'file': 'File:Flight data recorder from NTSB recovery of crash related items on the Potomac River, 2 February 2025 - 1 (cropped).jpg'},
  {'id': 'pair', 'file': 'File:FDR-CVR from 21 Air LLC Flight 7598 (55516818053).jpg'},
  {'id': 'tail', 'file': 'File:Flightrecorders.JPG'},
  {'id': 'carry', 'file': 'File:An NTSB investigator carries out one of the recorders from UPS 1354. (9518907464).jpg'},
  {'id': 'lab', 'file': 'File:UPS Flight 1354 Recorders in the NTSB Lab (9544477945).jpg'},
  {'id': 'swaim', 'file': 'File:Investigator Robert Swaim with the flight data recorder (15978107931).jpg'},
  {'id': 'ulb', 'file': 'File:Underwaterlocatorbeacon.JPG'},
  {'id': 'atlas', 'file': 'File:Atlas Air Flight Recorders (47218247282).jpg'},
 ],
}
fixshow(E, {'three thousand four hundred': '3,400', 'thirty': '30', 'twenty thousand': '20,000', 'three hundred ten miles per hour': '310 mph', 'one thousand eight hundred thirty degrees': '1,830 °F'})
open('episodes/203.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
