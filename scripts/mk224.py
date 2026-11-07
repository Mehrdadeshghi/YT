#!/usr/bin/env python3
"""#224 How adaptive cruise control and lane keeping work. Picture: real sky + landscape panorama, real asphalt photo, modelled cars (scripts/hf224w/), workflow offline-render.yml.
Sources: en.wikipedia.org/wiki/Adaptive_cruise_control (radar at 24 or 77 GHz, time for the signal to return gives distance, accurate to 160+ m / about 525 ft; throttle and in many systems braking; supplements, does not replace, the driver; adding lane centering may make it Level 2).
en.wikipedia.org/wiki/Lane_departure_warning_system (camera behind the windshield near the mirror; edge detection on front-camera images; lane keeping steers back with corrective torque; depends on visible markings: faded, missing or snow-covered markings fail; AAA testing: approaching a simulated disabled vehicle led to a collision 66 per cent of the time, average impact 25 mph; most systems require the driver to stay in control).
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 224, 'title': 'How adaptive cruise control and lane keeping work', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['ONE RADAR.', 'ONE CAMERA.'], 'cta': {'q': 'Trust it on a long drive?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Adaptive_cruise_control',
 'vo_open': [seg("On the highway, some cars steer and brake by themselves. Their secret: one radar and one camera.", "On the highway, some cars *steer* and *brake* by themselves. Their secret: one *radar* and one *camera.*",
    'Auf der Autobahn lenken und bremsen manche Autos von selbst. Ihr Geheimnis: ein Radar und eine Kamera.', 'En la autopista, algunos coches giran y frenan solos. Su secreto: un radar y una cámara.', 'Sur l’autoroute, certaines voitures tournent et freinent toutes seules. Leur secret : un radar et une caméra.')],
 'scenes': [
  {'dur': 1.0, 'beat': 'radar', 'vo': [seg("Behind the front bumper, the radar sends out radio waves. They bounce off the car ahead, and the time they take to come back gives the distance, out to about five hundred feet.",
    "Behind the front *bumper,* the radar sends out *radio waves.* They *bounce* off the car ahead, and the *time* they take to come back gives the *distance,* out to about *500 feet.*",
    'Hinter der vorderen Stoßstange sendet das Radar Funkwellen aus. Sie prallen vom Auto davor ab, und ihre Laufzeit ergibt den Abstand, bis etwa hundertfünfzig Meter.',
    'Detrás del parachoques, el radar emite ondas de radio. Rebotan en el coche de delante, y el tiempo que tardan en volver da la distancia, hasta unos ciento cincuenta metros.',
    'Derrière le pare-chocs, le radar envoie des ondes radio. Elles rebondissent sur la voiture devant, et leur temps de retour donne la distance, jusqu’à environ cent cinquante mètres.')]},
  {'dur': 1.0, 'beat': 'gap', 'vo': [seg("If that car slows down, yours eases off and brakes. When the gap opens up again, it speeds back up to the speed you set.",
    "If that car *slows* down, yours eases off and *brakes.* When the *gap* opens up again, it speeds back *up* to the speed you *set.*",
    'Wird das Auto davor langsamer, geht deins vom Gas und bremst. Wird die Lücke wieder größer, beschleunigt es zurück auf dein eingestelltes Tempo.',
    'Si ese coche frena, el tuyo suelta el gas y frena. Cuando el hueco se abre, vuelve a la velocidad que elegiste.',
    'Si cette voiture ralentit, la tienne lève le pied et freine. Quand l’écart se rouvre, elle revient à la vitesse que tu as choisie.')]},
  {'dur': 1.0, 'beat': 'camera', 'vo': [seg("Staying in the lane is the camera's job. It sits behind the windshield and looks for the edges of the painted lines.",
    "Staying in the *lane* is the camera's job. It sits behind the *windshield* and looks for the *edges* of the painted *lines.*",
    'In der Spur bleiben ist Aufgabe der Kamera. Sie sitzt hinter der Windschutzscheibe und sucht die Kanten der aufgemalten Linien.',
    'Mantenerse en el carril es trabajo de la cámara. Está detrás del parabrisas y busca los bordes de las líneas pintadas.',
    'Rester dans la voie, c’est le travail de la caméra. Elle est derrière le pare-brise et cherche les bords des lignes peintes.')]},
  {'dur': 1.0, 'beat': 'drift', 'vo': [seg("Start to drift, and a little force on the steering turns you back.", "Start to *drift,* and a little *force* on the steering turns you *back.*",
    'Driftest du ab, lenkt dich eine kleine Kraft an der Lenkung zurück.', 'Si empiezas a desviarte, una pequeña fuerza en la dirección te devuelve.', 'Si tu dérives, une petite force sur la direction te ramène.')]},
  {'dur': 1.0, 'beat': 'catch', 'vo': [seg("But it only knows what it can see. Faded lines or snow can hide the lane. And when AAA tested a simulated broken-down car in the lane, the cars hit it sixty-six percent of the time.",
    "But it only knows what it can *see.* *Faded* lines or *snow* can hide the lane. And when *AAA* tested a simulated *broken-down* car in the lane, the cars hit it *66 percent* of the time.",
    'Aber es weiß nur, was es sieht. Verblasste Linien oder Schnee können die Spur verbergen. Und als der AAA ein simuliertes Pannenauto in die Spur stellte, fuhren die Autos in sechsundsechzig Prozent der Fälle dagegen.',
    'Pero solo sabe lo que ve. Las líneas borrosas o la nieve pueden ocultar el carril. Y cuando AAA probó con un coche averiado simulado en el carril, los coches chocaron el sesenta y seis por ciento de las veces.',
    'Mais elle ne connaît que ce qu’elle voit. Des lignes effacées ou la neige peuvent cacher la voie. Et quand AAA a testé une voiture en panne simulée dans la voie, les voitures l’ont percutée soixante-six pour cent du temps.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("That's why your hands stay on the wheel. Would you trust it on a long drive? Comment yes or no, and subscribe.",
    "That's why your *hands* stay on the wheel. Would you *trust* it on a long drive? Comment *yes* or *no,* and *subscribe.*",
    'Deshalb bleiben deine Hände am Lenkrad. Würdest du ihm auf einer langen Fahrt vertrauen? Schreib Ja oder Nein, und abonniere.',
    'Por eso tus manos siguen en el volante. ¿Confiarías en él en un viaje largo? Comenta sí o no, y suscríbete.',
    'C’est pour ça que tes mains restent sur le volant. Lui ferais-tu confiance sur un long trajet ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Inspiring Teaser (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf224'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/224.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
