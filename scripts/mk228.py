#!/usr/bin/env python3
"""#228 Why many smoke detectors are radioactive. Real footage: engineerguy (Bill Hammack) "How smoke detectors work", Wikimedia Commons, CC BY 3.0 (teardown + ion animation, no face shots used).
Source: en.wikipedia.org/wiki/Smoke_detector (ionization detector uses a radioisotope, typically americium-241, to ionize air; two chambers, one open, one sealed reference; alpha particles ionize air molecules, voltage between electrodes lets the ions carry a current;
smoke particles attach to ions so they no longer carry current in the open chamber; circuit detects the difference and sounds the alarm; about 0.3 ug of americium-241; late 1930s Swiss physicist Walter Jaeger, poison-gas sensor failed, lit a cigarette, meter registered a drop in current;
NFPA 2009-2013: 0.53 deaths per 100 fires in homes with working smoke detectors vs 1.18 without; optical (photoelectric) detectors are the other main type)."""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
VO = [
 seg("Many smoke detectors have a tiny bit of radioactive metal inside. Why?",
     "Many smoke detectors have a tiny bit of *radioactive* metal inside. *Why?*",
     "Viele Rauchmelder haben ein winziges Stück radioaktives Metall im Inneren. Warum?",
     "Muchos detectores de humo llevan dentro un poquito de metal radiactivo. ¿Por qué?",
     "Beaucoup de détecteurs de fumée contiennent un tout petit morceau de métal radioactif. Pourquoi ?"),
 seg("It's americium two forty-one, about three tenths of a microgram. It fires alpha particles into a small chamber of air.",
     "It's *americium-241,* about *0.3 micrograms.* It fires *alpha* particles into a small chamber of air.",
     "Es ist Americium zwei-eins-vier-eins, etwa drei Zehntel Mikrogramm. Es schießt Alphateilchen in eine kleine Luftkammer.",
     "Es americio doscientos cuarenta y uno, unas tres décimas de microgramo. Dispara partículas alfa a una pequeña cámara de aire.",
     "C’est de l’américium deux cent quarante et un, environ trois dixièmes de microgramme. Il envoie des particules alpha dans une petite chambre d’air."),
 seg("They knock electrons off air molecules, so the air carries a tiny current between two metal plates.",
     "They *knock* electrons off air molecules, so the air carries a tiny *current* between two metal plates.",
     "Sie schlagen Elektronen aus Luftmolekülen, und so trägt die Luft einen winzigen Strom zwischen zwei Metallplatten.",
     "Arrancan electrones de las moléculas del aire, y así el aire lleva una corriente diminuta entre dos placas metálicas.",
     "Elles arrachent des électrons aux molécules d’air, et l’air transporte ainsi un minuscule courant entre deux plaques métalliques."),
 seg("Smoke particles grab those charged ions and the current drops. A circuit compares it with a sealed chamber, and sounds the alarm.",
     "*Smoke* particles grab those charged ions and the current *drops.* A circuit compares it with a sealed chamber, and sounds the *alarm.*",
     "Rauchpartikel fangen diese geladenen Ionen ein, und der Strom sinkt. Eine Schaltung vergleicht ihn mit einer geschlossenen Kammer und löst den Alarm aus.",
     "Las partículas de humo atrapan esos iones cargados y la corriente baja. Un circuito la compara con una cámara sellada y hace sonar la alarma.",
     "Les particules de fumée captent ces ions chargés et le courant baisse. Un circuit le compare à une chambre scellée et déclenche l’alarme."),
 seg("A lucky accident found this. In the late nineteen thirties, Walter Jaeger built a gas sensor that failed. Then he lit a cigarette, and the meter dropped.",
     "A lucky accident found this. In the late *1930s,* *Walter* Jaeger built a gas sensor that failed. Then he lit a *cigarette,* and the *meter* dropped.",
     "Ein glücklicher Zufall brachte es ans Licht. In den späten Dreißigerjahren baute Walter Jaeger einen Gassensor, der versagte. Dann zündete er sich eine Zigarette an, und die Anzeige fiel.",
     "Lo descubrió un feliz accidente. A finales de los años treinta, Walter Jaeger construyó un sensor de gas que fallaba. Luego encendió un cigarrillo, y el medidor bajó.",
     "Un heureux hasard l’a révélé. À la fin des années trente, Walter Jaeger a construit un capteur de gaz qui ne marchait pas. Puis il a allumé une cigarette, et l’aiguille a baissé."),
 seg("It matters. In U S homes, working detectors meant zero point five three deaths per hundred fires, against one point one eight without.",
     "It matters. In U.S. homes, working detectors meant *0.53* deaths per 100 fires, against *1.18* without.",
     "Das zählt. In US-Haushalten bedeuteten funktionierende Melder null Komma fünf drei Todesfälle pro hundert Brände, gegenüber eins Komma eins acht ohne.",
     "Importa. En los hogares de EE. UU., los detectores que funcionaban significaban cero coma cincuenta y tres muertes por cada cien incendios, frente a uno coma dieciocho sin ellos.",
     "Ça compte. Dans les foyers américains, des détecteurs en état de marche signifiaient zéro virgule cinquante-trois décès pour cent incendies, contre un virgule dix-huit sans."),
 seg("Did you know it was radioactive? Comment yes or no, and subscribe.",
     "Did you know it was *radioactive?* Comment *yes* or *no,* and *subscribe.*",
     "Wusstest du, dass er radioaktiv ist? Schreib Ja oder Nein, und abonniere.",
     "¿Sabías que era radiactivo? Comenta sí o no, y suscríbete.",
     "Tu savais qu’il était radioactif ? Commente oui ou non, et abonne-toi.", cta=True),
]
SRC = 'File:How smoke detectors work.webm'
E = {
 'ep': 228, 'title': 'Why many smoke detectors are radioactive', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['RADIOACTIVE', 'ON YOUR CEILING?'], 'cta': {'q': 'Knew it was radioactive?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Smoke_detector',
 'vo_open': [VO[0]],
 'scenes': [{'dur': 1.0, 'beat': b, 'vo': [v]} for b, v in zip(['americium', 'ions', 'smoke', 'jaeger', 'rule', 'cta'], VO[1:])],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Inspiring Teaser (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf_real'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
E['real'] = {
 'sources': [SRC],
 'spans': [{'src': 0, 'from': 21, 'to': 35}, {'src': 0, 'from': 47, 'to': 60}, {'src': 0, 'from': 66, 'to': 76}, {'src': 0, 'from': 41, 'to': 47}, {'src': 0, 'from': 80, 'to': 84}],
 'tag': 'REAL TEARDOWN · CC BY 3.0',
 'title_until': 'amer-0.1',
 'events': {'rad': [0, 'radioactive'], 'why': [0, 'why'], 'amer': [1, 'americium'], 'micro': [1, 'micrograms'], 'alpha': [1, 'alpha'],
            'knock': [2, 'knock'], 'curr': [2, 'current'], 'smoke': [3, 'smoke'], 'drops': [3, 'drops'], 'alarm': [3, 'alarm'],
            'walter': [4, 'walter'], 'cig': [4, 'cigarette'], 'meter': [4, 'meter'], 'homes': [5, 'homes'], 'd053': [5, '0.53'], 'd118': [5, '1.18']},
 'shots': [
  {'from': 0, 'to': 'amer-0.2', 'span': 0, 'at': [0, 4.2], 'cx': [640, 700], 'zoom': [1, 1.08]},
  {'from': 'amer-0.2', 'to': 'alpha-0.2', 'span': 0, 'at': [8, 12], 'cx': [760, 760], 'zoom': [1, 1.1]},
  {'from': 'alpha-0.2', 'to': 'knock-0.2', 'span': 0, 'at': [12, 14], 'cx': [760, 760], 'zoom': [1.05, 1.1]},
  {'from': 'knock-0.2', 'to': 'smoke-0.2', 'span': 1, 'at': [1, 7], 'cx': [950, 930], 'zoom': [1, 1.06]},
  {'from': 'smoke-0.2', 'to': 'alarm-0.3', 'span': 2, 'at': [0.5, 8.5], 'cx': [900, 920], 'zoom': [1, 1.08]},
  {'from': 'alarm-0.3', 'to': 'walter-0.2', 'span': 4, 'at': [0, 2], 'cx': [700, 700], 'zoom': [1, 1.06]},
  {'from': 'walter-0.2', 'to': 'cig', 'span': 3, 'at': [0, 3.5], 'cx': [760, 740], 'zoom': [1, 1.06]},
  {'from': 'cig', 'to': 'homes-0.3', 'span': 1, 'at': [8, 13], 'cx': [940, 940], 'zoom': [1, 1.06]},
  {'from': 'homes-0.3', 'to': 'd118-0.3', 'span': 4, 'at': [0, 4], 'cx': [700, 700], 'zoom': [1, 1.08]},
  {'from': 'd118-0.3', 'to': 'cta-0.3', 'span': 2, 'at': [3, 7], 'cx': [920, 920], 'zoom': [1, 1.06]},
  {'from': 'cta-0.3', 'to': 'end', 'span': 3, 'at': [1, 5.5], 'cx': [760, 760], 'zoom': [1, 1.05]},
 ],
 'stamps': [
  {'from': 'rad-0.05', 'to': 'amer-0.15', 'big': 'RADIOACTIVE', 'sub': 'INSIDE MANY SMOKE DETECTORS', 'color': '#ff5a4c', 'y': 830, 'size': 110, 'pop': False},
  {'from': 'micro-0.1', 'to': 'alpha-0.1', 'big': '0.3 MICROGRAMS', 'sub': 'OF AMERICIUM-241', 'y': 830, 'size': 100},
  {'from': 'drops-0.05', 'to': 'alarm-0.15', 'big': 'CURRENT DROPS', 'sub': 'SMOKE STEALS THE IONS', 'color': '#ff5a4c', 'y': 830, 'size': 100},
  {'from': 'walter-0.1', 'to': 'meter+0.9', 'big': 'LATE 1930s', 'sub': 'A FAILED GAS SENSOR + A CIGARETTE', 'y': 830, 'size': 110},
  {'from': 'd053-0.1', 'to': 'cta-0.2', 'big': '0.53 vs 1.18', 'sub': 'DEATHS PER 100 HOME FIRES · WITH vs WITHOUT A WORKING DETECTOR', 'y': 830, 'size': 120},
 ],
 'labels': [
  {'from': 'smoke+0.1', 'to': 'drops-0.1', 'x': 760, 'y': 960, 'txt': 'SMOKE', 'sub': 'ENTERS THE CHAMBER', 'side': 'left'},
 ],
 'cues': [['rad', 0, 'tick', 0.4], ['amer', 0, 'pop', 0.5], ['alpha', 0, 'zap', 0.5], ['knock', 0, 'click', 0.5], ['smoke', 0, 'whoosh', 0.4],
          ['drops', 0, 'thump', 0.5], ['alarm', 0, 'beep', 0.7], ['walter', 0, 'pop', 0.4], ['cig', 0, 'scratch', 0.4], ['d053', 0, 'pop', 0.5],
          ['cta_a', 0, 'pop', 0.7], ['cta_b', 0, 'pop', 0.7], ['cta_sub', 0, 'coin', 0.5]],
}
open('episodes/228.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
