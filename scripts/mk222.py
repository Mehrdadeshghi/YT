#!/usr/bin/env python3
"""#222 How some cars warn each other about a traffic jam (V2V / Car2X). Picture: own offline-rendered 3D world (scripts/hf222w/, workflow offline-render.yml).
Sources: NHTSA V2V fact sheet (BSM: heading, speed, location, up to 10 times a second); en.wikipedia.org/wiki/Vehicular_communication_systems (DSRC ~300 m / 980 ft; Dec 2016 DOT proposal);
ETSI EN 302 636-1 (GeoNetworking: single hop and multi-hop); en.wikipedia.org/wiki/Vehicle-to-everything (Nov 18 2020 FCC: 45 of 75 MHz in 5.9 GHz to Wi-Fi); Euro NCAP on the Golf 8 (benefit depends on how many cars have it);
FCC Second Report and Order, Nov 21 2024 (C-V2X in the upper 30 MHz). The hop chain is illustrative: the standard allows forwarding, we don't claim every car does it.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 222, 'title': 'How some cars warn each other about a traffic jam', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['CARS THAT WARN', 'EACH OTHER'], 'cta': {'q': 'Talk to every stranger?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://www.nhtsa.gov/document/v2v-communications-factsheet',
 'vo_open': [
  seg("Some cars can warn each other about a traffic jam you can't even see yet.", "Some cars can *warn* each other about a traffic *jam* you can't even see yet.",
      'Manche Autos warnen sich gegenseitig vor einem Stau, den du noch gar nicht sehen kannst.', 'Algunos coches se avisan entre sí de un atasco que aún ni puedes ver.', 'Certaines voitures s’avertissent d’un bouchon que tu ne vois même pas encore.'),
  seg('How does a warning jump between strangers?', 'How does a warning *jump* between *strangers?*',
      'Wie springt eine Warnung zwischen Fremden?', '¿Cómo salta un aviso entre desconocidos?', 'Comment une alerte saute-t-elle entre inconnus ?')],
 'scenes': [
  {'dur': 1.0, 'beat': 'brake', 'vo': [seg("A car reaches the back of a jam and brakes hard. A small radio inside it starts to broadcast. No phone call. No cell tower.",
      "A car reaches the back of a *jam* and *brakes* hard. A small *radio* inside it starts to *broadcast.* No phone call. No *cell tower.*",
      'Ein Auto erreicht das Stauende und bremst stark. Ein kleines Funkgerät darin beginnt zu senden. Kein Anruf. Kein Mobilfunkmast.',
      'Un coche llega al final del atasco y frena fuerte. Una pequeña radio empieza a emitir. Sin llamadas. Sin antenas de móvil.',
      'Une voiture arrive au bout du bouchon et freine fort. Une petite radio se met à émettre. Pas d’appel. Pas d’antenne-relais.')]},
  {'dur': 1.0, 'beat': 'data', 'vo': [seg("Up to ten times a second, these cars share where they are, how fast they're going, and which way.",
      "Up to *10 times* a second, these cars share *where* they are, how *fast* they're going, and which *way.*",
      'Bis zu zehnmal pro Sekunde teilen diese Autos mit, wo sie sind, wie schnell sie fahren und in welche Richtung.',
      'Hasta diez veces por segundo, estos coches comparten dónde están, a qué velocidad van y hacia dónde.',
      'Jusqu’à dix fois par seconde, ces voitures partagent où elles sont, à quelle vitesse et dans quelle direction.')]},
  {'dur': 1.0, 'beat': 'hop', 'vo': [seg("One broadcast only reaches about a thousand feet. So here's the trick: the standard lets the next car pass it on, hop by hop.",
      "One *broadcast* only reaches about a *1,000 feet.* So here's the *trick:* the standard lets the *next car* pass it on, *hop by hop.*",
      'Eine Sendung reicht nur etwa dreihundert Meter. Der Trick: Der Standard lässt das nächste Auto sie weitergeben, Sprung für Sprung.',
      'Una emisión solo llega a unos trescientos metros. El truco: el estándar deja que el siguiente coche la pase, salto a salto.',
      'Une émission ne porte qu’à environ trois cents mètres. L’astuce : la norme laisse la voiture suivante la relayer, de saut en saut.')]},
  {'dur': 1.0, 'beat': 'arrive', 'vo': [seg("Far behind, a driver still doing eighty gets the warning on the dashboard: jam ahead, slow down. Before the jam is even in sight.",
      "Far *behind,* a driver still doing *80* gets the *warning* on the dashboard: *jam ahead,* slow down. Before the jam is even in *sight.*",
      'Weit dahinter bekommt ein Fahrer mit hundertdreißig die Warnung aufs Display: Stau voraus, langsamer fahren. Noch bevor der Stau in Sicht ist.',
      'Muy atrás, un conductor a ciento treinta recibe el aviso en el tablero: atasco adelante, reduce. Antes de ver siquiera el atasco.',
      'Loin derrière, un conducteur à cent trente reçoit l’alerte au tableau de bord : bouchon devant, ralentis. Avant même de voir le bouchon.')]},
  {'dur': 1.0, 'beat': 'catch', 'vo': [seg("The catch: it only works if the other car has one too.", "The *catch:* it only works if the *other car* has one *too.*",
      'Der Haken: Es funktioniert nur, wenn das andere Auto auch eins hat.', 'La trampa: solo funciona si el otro coche también tiene una.', 'Le hic : ça ne marche que si l’autre voiture en a une aussi.'),
    seg("In twenty sixteen, the U S proposed requiring it. In twenty twenty, the F C C gave most of its airwaves to Wi-Fi. Cars kept the rest.",
      "In *2016,* the U.S. *proposed* requiring it. In *2020,* the *FCC* gave most of its airwaves to *Wi-Fi.* Cars kept the *rest.*",
      'Zweitausendsechzehn schlugen die USA vor, es vorzuschreiben. Zweitausendzwanzig gab die FCC den größten Teil der Funkfrequenzen an WLAN. Autos behielten den Rest.',
      'En dos mil dieciséis, Estados Unidos propuso exigirlo. En dos mil veinte, la FCC dio la mayor parte de sus frecuencias al wifi. Los coches se quedaron con el resto.',
      'En deux mille seize, les États-Unis ont proposé de l’imposer. En deux mille vingt, la FCC a donné l’essentiel de ses fréquences au wifi. Les voitures ont gardé le reste.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Would you let your car talk to every stranger on the road? Comment yes or no, and subscribe.",
      "Would you let your car talk to every *stranger* on the road? Comment *yes* or *no,* and *subscribe.*",
      'Würdest du dein Auto mit jedem Fremden auf der Straße reden lassen? Schreib Ja oder Nein, und abonniere.',
      '¿Dejarías que tu coche hablara con cada desconocido en la carretera? Comenta sí o no, y suscríbete.',
      'Laisserais-tu ta voiture parler à chaque inconnu sur la route ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Rafael Krux - Inspiring Teaser (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf222'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/222.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
