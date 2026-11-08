#!/usr/bin/env python3
"""#226 How the tire pressure warning knows (TPMS). Picture: real sky panorama, real asphalt photo, modelled car (scripts/hf226w/), workflow offline-render.yml.
Source: en.wikipedia.org/wiki/Tire-pressure_monitoring_system (direct TPMS: a battery-driven pressure sensor in each wheel, most often on the inside of the valve, data to a central unit;
indirect TPMS: no pressure sensors, the smaller rolling diameter of an under-inflated tire is measurable through the ABS/ESC wheel speed sensors; FMVSS 138: warning when pressure is 25 percent or more
below the recommended cold inflation pressure, US light vehicles sold after September 1, 2007; the 2000 TREAD Act followed the Firestone tire controversy, recall linked to more than 100 deaths).
Pressures and speeds shown on screen are illustrations.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 226, 'title': 'How the tire pressure warning knows', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['HOW DOES', 'IT KNOW?'], 'cta': {'q': 'Check your tires yourself?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Tire-pressure_monitoring_system',
 'vo_open': [seg("Your car knows when one tire is low, while you're driving. How does it know?", "Your car knows when one *tire* is *low,* while you're driving. How does it *know?*",
    'Dein Auto merkt während der Fahrt, wenn ein Reifen zu wenig Luft hat. Woher weiß es das?', 'Tu coche sabe cuándo un neumático está bajo, mientras conduces. ¿Cómo lo sabe?', 'Ta voiture sait quand un pneu est sous-gonflé, pendant que tu roules. Comment le sait-elle ?')],
 'scenes': [
  {'dur': 1.0, 'beat': 'direct', 'vo': [seg("Many cars hide a tiny battery-powered sensor inside each wheel, right on the valve. It measures the air pressure and radios it to the car.",
    "Many cars hide a tiny battery-powered *sensor* inside each *wheel,* right on the *valve.* It measures the air *pressure* and *radios* it to the car.",
    'Viele Autos verstecken in jedem Rad einen winzigen Sensor mit Batterie, direkt am Ventil. Er misst den Luftdruck und funkt ihn ans Auto.',
    'Muchos coches esconden un diminuto sensor con pila dentro de cada rueda, justo en la válvula. Mide la presión del aire y la envía por radio al coche.',
    'Beaucoup de voitures cachent un minuscule capteur à pile dans chaque roue, juste sur la valve. Il mesure la pression et l’envoie par radio à la voiture.')]},
  {'dur': 1.0, 'beat': 'indirect', 'vo': [seg("Other cars have no pressure sensor at all. They use the wheel-speed sensors of the anti-lock brakes. A low tire is a little smaller, so it spins a little faster than the others.",
    "Other cars have *no* pressure sensor at all. They use the *wheel-speed* sensors of the anti-lock *brakes.* A low tire is a little *smaller,* so it spins a little *faster* than the others.",
    'Andere Autos haben gar keinen Drucksensor. Sie nutzen die Raddrehzahl-Sensoren des ABS. Ein platter Reifen ist ein bisschen kleiner, also dreht er sich ein bisschen schneller als die anderen.',
    'Otros coches no tienen ningún sensor de presión. Usan los sensores de velocidad de rueda del ABS. Un neumático bajo es un poco más pequeño, así que gira un poco más rápido que los demás.',
    'D’autres voitures n’ont aucun capteur de pression. Elles utilisent les capteurs de vitesse de roue de l’ABS. Un pneu dégonflé est un peu plus petit, donc il tourne un peu plus vite que les autres.')]},
  {'dur': 1.0, 'beat': 'law', 'vo': [seg("Since September two thousand seven, new cars in the U S must have it. The rule came after a tire recall linked to more than a hundred deaths.",
    "Since September *2007,* new cars in the U.S. must *have* it. The rule came after a tire *recall* linked to more than *100 deaths.*",
    'Seit September zweitausendsieben müssen neue Autos in den USA das haben. Die Regel kam nach einem Reifenrückruf, der mit über hundert Todesfällen in Verbindung gebracht wurde.',
    'Desde septiembre de dos mil siete, los coches nuevos en Estados Unidos deben tenerlo. La norma llegó tras una retirada de neumáticos vinculada a más de cien muertes.',
    'Depuis septembre deux mille sept, les voitures neuves aux États-Unis doivent l’avoir. La règle est venue après un rappel de pneus lié à plus de cent morts.')]},
  {'dur': 1.0, 'beat': 'twist', 'vo': [seg("But the warning light only has to come on when a tire is twenty-five percent low. It can be low long before that.",
    "But the warning *light* only has to come on when a tire is *25 percent* low. It can be low long *before* that.",
    'Aber die Warnleuchte muss erst angehen, wenn ein Reifen fünfundzwanzig Prozent zu wenig Druck hat. Zu niedrig kann er schon lange vorher sein.',
    'Pero la luz de aviso solo tiene que encenderse cuando a un neumático le falta un veinticinco por ciento. Puede estar bajo mucho antes.',
    'Mais le voyant n’est obligé de s’allumer que lorsqu’un pneu a perdu vingt-cinq pour cent. Il peut être sous-gonflé bien avant.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Do you check your tire pressure yourself? Comment yes or no, and subscribe.",
    "Do you check your tire pressure *yourself?* Comment *yes* or *no,* and *subscribe.*",
    'Prüfst du deinen Reifendruck selbst? Schreib Ja oder Nein, und abonniere.', '¿Revisas tú mismo la presión de tus neumáticos? Comenta sí o no, y suscríbete.', 'Vérifies-tu toi-même la pression de tes pneus ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Kevin MacLeod - Calmant.ogg', 'from': 0, 'len': 60}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf226'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/226.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
