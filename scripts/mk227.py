#!/usr/bin/env python3
"""#227 How a speed camera knows how fast you're going. Picture: real sky + landscape panorama, real asphalt photo, modelled car and camera (scripts/hf227w/), workflow offline-render.yml.
Sources: en.wikipedia.org/wiki/Radar_speed_gun (narrow radio beam; the returned signal's frequency is increased in proportion to the object's speed of approach; cosine effect: aimed at an angle, the measured speed is lower than the actual speed, "the error is always in the favor of the driver"; Connecticut State Police tested radar in 1947 and began issuing tickets from its readings in February 1949).
en.wikipedia.org/wiki/Traffic_enforcement_camera (Doppler radar, LIDAR, stereo vision or number-plate recognition; the Gatso flash illuminates number plates and calibration lines on the road when taking photographs; average-speed cameras time vehicles over a known fixed distance).
How it works only: nothing about detecting, jamming or evading speed cameras.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 227, 'title': "How a speed camera knows how fast you're going", 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ["IT CAN'T SEE", 'YOUR SPEEDOMETER'], 'cta': {'q': 'Cameras on every highway?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Radar_speed_gun',
 'vo_open': [seg("A speed camera can't see your speedometer. So how does it know you were doing seventy-two?", "A speed camera can't see your *speedometer.* So how does it know you were doing *72?*",
    'Ein Blitzer kann deinen Tacho nicht sehen. Woher weiß er also, dass du hundertsechzehn gefahren bist?', 'Un radar de velocidad no puede ver tu velocímetro. ¿Cómo sabe entonces que ibas a ciento dieciséis?', 'Un radar ne voit pas ton compteur. Alors comment sait-il que tu roulais à cent seize ?')],
 'scenes': [
  {'dur': 1.0, 'beat': 'beam', 'vo': [seg("It fires a narrow radio beam at your car. The beam bounces back, and the trick is in the echo.",
    "It fires a narrow *radio beam* at your car. The beam *bounces* back, and the trick is in the *echo.*",
    'Er schickt einen schmalen Funkstrahl auf dein Auto. Der Strahl prallt zurück, und der Trick steckt im Echo.',
    'Lanza un haz de radio estrecho hacia tu coche. El haz rebota, y el truco está en el eco.',
    'Il envoie un faisceau radio étroit sur ta voiture. Le faisceau rebondit, et l’astuce est dans l’écho.')]},
  {'dur': 1.0, 'beat': 'doppler', 'vo': [seg("You're driving toward it, so the echo comes back squeezed, at a slightly higher frequency. The faster you go, the bigger the shift. It's the same effect that makes a siren sound higher as it comes at you.",
    "You're driving *toward* it, so the echo comes back *squeezed,* at a slightly higher *frequency.* The *faster* you go, the bigger the *shift.* It's the same effect that makes a *siren* sound higher as it comes at you.",
    'Du fährst auf ihn zu, also kommt das Echo gestaucht zurück, mit etwas höherer Frequenz. Je schneller du bist, desto größer die Verschiebung. Derselbe Effekt lässt eine Sirene höher klingen, wenn sie auf dich zukommt.',
    'Vas hacia él, así que el eco vuelve comprimido, con una frecuencia un poco más alta. Cuanto más rápido vas, mayor es el cambio. Es el mismo efecto que hace que una sirena suene más aguda al acercarse.',
    'Tu roules vers lui, donc l’écho revient compressé, à une fréquence un peu plus haute. Plus tu vas vite, plus le décalage est grand. C’est le même effet qui rend une sirène plus aiguë quand elle approche.')]},
  {'dur': 1.0, 'beat': 'flash', 'vo': [seg("Over the limit? A big flash lights up your plate, and the calibration lines painted on the road.",
    "Over the *limit?* A big *flash* lights up your *plate,* and the calibration *lines* painted on the road.",
    'Zu schnell? Ein greller Blitz beleuchtet dein Kennzeichen und die Messlinien auf der Straße.',
    '¿Por encima del límite? Un gran flash ilumina tu matrícula y las líneas de calibración pintadas en la carretera.',
    'Au-dessus de la limite ? Un gros flash éclaire ta plaque et les lignes de calibrage peintes sur la route.')]},
  {'dur': 1.0, 'beat': 'angle', 'vo': [seg("Here's a twist: if the beam hits you at an angle, it reads you slower, never faster. That error always goes in the driver's favor.",
    "Here's a *twist:* if the beam hits you at an *angle,* it reads you *slower,* never *faster.* That error always goes in the driver's *favor.*",
    'Der Clou: Trifft dich der Strahl schräg, misst er dich langsamer, nie schneller. Dieser Fehler geht immer zugunsten des Fahrers.',
    'El giro: si el haz te alcanza en ángulo, te mide más lento, nunca más rápido. Ese error siempre favorece al conductor.',
    'Le détail : si le faisceau te touche en biais, il te mesure plus lent, jamais plus rapide. Cette erreur joue toujours en faveur du conducteur.')]},
  {'dur': 1.0, 'beat': 'average', 'vo': [seg("Some cameras skip the beam completely. They time you between two points a known distance apart. One mile in fifty seconds is seventy-two miles an hour.",
    "Some cameras skip the beam *completely.* They *time* you between two *points* a known distance apart. One *mile* in *50 seconds* is *72* miles an hour.",
    'Manche Kameras verzichten ganz auf den Strahl. Sie stoppen deine Zeit zwischen zwei Punkten mit bekanntem Abstand. Ein Kilometer in einunddreißig Sekunden sind hundertsechzehn Stundenkilometer.',
    'Algunas cámaras ni usan el haz. Te cronometran entre dos puntos a una distancia conocida. Un kilómetro en treinta y un segundos son ciento dieciséis kilómetros por hora.',
    'Certaines caméras se passent du faisceau. Elles te chronomètrent entre deux points à distance connue. Un kilomètre en trente et une secondes, c’est cent seize kilomètres-heure.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Should every highway have them? Comment yes or no, and subscribe.",
    "Should every *highway* have them? Comment *yes* or *no,* and *subscribe.*",
    'Sollte jede Autobahn welche haben? Schreib Ja oder Nein, und abonniere.', '¿Debería tenerlos cada autopista? Comenta sí o no, y suscríbete.', 'Toutes les autoroutes devraient-elles en avoir ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': .5}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf227'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/227.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
