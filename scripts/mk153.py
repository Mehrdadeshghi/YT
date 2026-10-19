#!/usr/bin/env python3
"""#153 HOW IT WORKS #11 — how a guided missile finds its target (INS → drift → GPS/jamming → TERCOM → DSMAC → CEP).
Facts (English Wikipedia, Oct 2026): Inertial navigation system (best accelerometers, 10 micro-g: 50 m / 164 ft error within 17 min),
Joint Direct Attack Munition (GPS signal travels 20,200 km ≈ 12,550 mi, easy to jam; published accuracy under 33 ft / 10 m CEP),
Tomahawk (missile) + TERCOM (radar altimeter vs stored terrain map; DSMAC camera vs satellite images near the target),
Circular error probable (CEP = radius that holds 50 % of the hits). Media: U.S. Navy / DoD test photos and footage (public domain)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 153, 'title': 'How does a missile find its target?', 'series': 'HOW IT WORKS #11',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'voice_style': 'explainer', 'wordCaps': True, 'mood': 'epic', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['NO PILOT.', 'NO EYES.', 'ON TARGET.'],
 'cta': {'q': 'Smarter than you thought?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Missile_guidance',
 'vo_open': [{'at': 0, 'text': 'No pilot. No eyes. Still on target. How?',
   'de': 'Kein Pilot. Keine Augen. Trotzdem im Ziel. Wie?',
   'es': 'Sin piloto. Sin ojos. Y aun así da en el blanco. ¿Cómo?',
   'fr': "Pas de pilote. Pas d'yeux. Et pourtant dans la cible. Comment ?"}],
 # v2 (19 Oct 2026): cut from 50 s to ~30 s — analytics: all top Shorts are 25–29 s, 41–51 s ones keep far fewer viewers
 'scenes': [
  S(0, 'Gyroscopes feel every turn. But tiny errors grow: about a hundred and sixty feet in seventeen minutes.',
    '*164 ft* off in *17 minutes.*',
    'Gyroskope spüren jede Drehung. Aber kleine Fehler wachsen: rund fünfzig Meter in siebzehn Minuten.',
    'Los giroscopios sienten cada giro. Pero los errores crecen: unos cincuenta metros en diecisiete minutos.',
    "Des gyroscopes sentent chaque virage. Mais les erreurs grandissent : environ cinquante mètres en dix-sept minutes."),
  S(1, 'So it checks GPS. But GPS can be jammed.',
    'GPS can be *jammed.*',
    'Also prüft sie per GPS. Aber GPS kann man stören.',
    'Así que consulta el GPS. Pero el GPS se puede bloquear.',
    "Alors il vérifie avec le GPS. Mais le GPS peut être brouillé."),
  S(2, 'Plan B: radar matches the hills below to a stored map. Near the target, a camera matches satellite photos.',
    'Radar vs *map*. Camera vs *satellite photos.*',
    'Plan B: Ein Radar vergleicht die Hügel mit einer gespeicherten Karte. Kurz vor dem Ziel vergleicht eine Kamera Satellitenfotos.',
    'Plan B: un radar compara las colinas con un mapa guardado. Cerca del objetivo, una cámara compara fotos de satélite.',
    "Plan B : un radar compare les collines à une carte enregistrée. Près de la cible, une caméra compare des photos satellite."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Never misses? Wrong. Only half land within thirty-three feet.',
         cap='Only *half* land within *33 ft.*',
         de='Trifft immer? Falsch. Nur die Hälfte landet innerhalb von zehn Metern.',
         es='¿Nunca falla? Falso. Solo la mitad cae a menos de diez metros.',
         fr="Ne rate jamais ? Faux. Seule la moitié tombe à moins de dix mètres."),
    dict(at='0.15', text='Smarter than you thought? Comment yes or no!', cta=True,
         de='Klüger als gedacht? Schreib ja oder nein in die Kommentare!',
         es='¿Más lista de lo que pensabas? ¡Comenta sí o no!',
         fr="Plus malin que tu pensais ? Commente oui ou non !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'launch', 'video': 'File:DOD Conducts Ground-launched Cruise Missile Test (190818-O-PZ834-724).webm', 'from': 18, 'len': 5},
  {'id': 'flight', 'file': 'File:Tomahawk Block IV cruise missile.jpg'},
  {'id': 'jdam', 'file': 'File:Navy conducts JDAM-LR tests 02.jpg'},
  {'id': 'tlaunch', 'file': 'File:US Navy 020823-N-9999X-001 Tactical Tomahawk launches during contractor testing.jpg'},
  {'id': 'plant', 'file': 'File:A U.S. Navy Tomahawk cruise missile flies by an isolated industrial complex during a flight test - DPLA - 1a6a16602c21ee7d921844583b149b55.jpeg'},
  {'id': 'hit', 'file': 'File:UGM-109 hits RA-5C on San Clemente Island 1986.JPEG'},
 ],
}
open('episodes/153.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
