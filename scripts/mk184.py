#!/usr/bin/env python3
"""#184 HOW IT WORKS #13 — why airplane windows are round (and the "square window" myth of the Comet).
Facts (English Wikipedia, "de Havilland Comet", "BOAC Flight 781", "South African Airways Flight 201", "Stress concentration"):
- 10 January 1954: Comet G-ALYP (BOAC Flight 781) broke up in mid-air off Elba, all 35 on board killed.
  8 April 1954: Comet G-ALYY (SAA Flight 201) crashed in the Mediterranean near Naples, all 21 killed → 56.
- RAE reconstruction of G-ALYP: fatigue crack growth from a countersunk rivet hole near the aft corner of the rear
  Automatic Direction Finder (ADF) window, a cut-out in the roof above the cockpit → explosive decompression.
- "Square window myths": the passenger windows were rectangular with subtle rounded corners; their shape was not a factor
  in the report ("windows" in the Cohen report = the ADF cut-outs).
- Water-tank test: G-ALYU burst open on 24 June 1954 after 3,057 flight cycles (1,221 actual + 1,836 simulated).
- Stress concentration: sharp internal corners and holes raise stress; the maximum stress occurs where the radius of curvature
  is lowest; fatigue cracks always start at stress raisers. Later jetliners (707, DC-8): rectangular windows with a larger
  corner radius, mitigating stress concentration points.
Media: real photos (Commons) + drawn graphics (labelled GRAPHIC)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 184, 'title': 'Why airplane windows are round', 'series': 'HOW IT WORKS #13',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'voice_style': 'explainer', 'wordCaps': True, 'mood': 'epic', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['SQUARE', 'WINDOWS?', 'A MYTH.'],
 'cta': {'q': 'Believed the square-window story?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/De_Havilland_Comet',
 'vo_open': [{'at': 0, 'text': "Square windows tore the first jetliner apart. That's a myth.",
   'de': 'Eckige Fenster haben das erste Düsenverkehrsflugzeug zerrissen. Das ist ein Mythos.',
   'es': 'Las ventanas cuadradas destrozaron el primer avión a reacción. Es un mito.',
   'fr': "Des hublots carrés ont déchiré le premier avion de ligne à réaction. C'est un mythe."}],
 'scenes': [
  S(0, 'Nineteen fifty-four. Two Comet jets broke apart over the Mediterranean. Fifty-six people died.',
    '1954: two Comets, *56 lives.*',
    'Neunzehnhundertvierundfünfzig. Zwei Comet-Jets brachen über dem Mittelmeer auseinander. Sechsundfünfzig Menschen starben.',
    'Mil novecientos cincuenta y cuatro. Dos aviones Comet se partieron sobre el Mediterráneo. Murieron cincuenta y seis personas.',
    'Mille neuf cent cinquante-quatre. Deux Comet se sont brisés au-dessus de la Méditerranée. Cinquante-six personnes sont mortes.'),
  S(1, 'Rounded corners already. The real crack started at a tiny rivet hole, by a cut-out in the roof.',
    'Crack from a *rivet hole.*',
    'Die Fenster hatten schon runde Ecken. Der echte Riss begann an einem winzigen Nietloch, an einem Ausschnitt im Dach.',
    'Las ventanas ya tenían esquinas redondeadas. La grieta real empezó en un diminuto agujero de remache, junto a un recorte en el techo.',
    "Les hublots avaient déjà des coins arrondis. La vraie fissure est partie d'un minuscule trou de rivet, près d'une découpe dans le toit."),
  S(2, 'Every flight pumps the cabin up like a balloon. In a water tank, a test Comet burst after three thousand fifty-seven flights.',
    '*3,057* pressure cycles → burst.',
    'Jeder Flug pumpt die Kabine auf wie einen Ballon. In einem Wassertank platzte ein Test-Comet nach dreitausendsiebenundfünfzig Flügen.',
    'Cada vuelo infla la cabina como un globo. En un tanque de agua, un Comet de prueba reventó tras tres mil cincuenta y siete vuelos.',
    "Chaque vol gonfle la cabine comme un ballon. Dans un bassin d'eau, un Comet d'essai a éclaté après trois mille cinquante-sept vols."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="Stress piles up where a corner is sharpest. That's why today's windows get big, round corners.",
         cap='Sharp corner = *stress.*',
         de='Spannung staut sich dort, wo eine Ecke am schärfsten ist. Darum haben Fenster heute große, runde Ecken.',
         es='La tensión se acumula donde la esquina es más aguda. Por eso las ventanas de hoy tienen esquinas grandes y redondas.',
         fr="Les contraintes s'accumulent là où l'angle est le plus vif. C'est pour ça que les hublots d'aujourd'hui ont de grands coins arrondis."),
    dict(at='0.15', text='Did you believe the square-window story? Comment yes or no!', cta=True,
         de='Hast du die Geschichte mit den eckigen Fenstern geglaubt? Schreib ja oder nein!',
         es='¿Te creías la historia de las ventanas cuadradas? ¡Comenta sí o no!',
         fr="Tu croyais à l'histoire des hublots carrés ? Commente oui ou non !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Dramatic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'comet', 'file': 'File:BOAC Comet 1952 Entebbe.jpg'},
  {'id': 'wreck', 'file': 'File:Fuselage of de Havilland Comet Airliner G-ALYP.JPG'},
  {'id': 'win', 'file': 'File:Comet 1 windows.png'},
  {'id': 'adf', 'file': 'File:Comet G-ALYP ADF windows.png'},
  {'id': 'hatch', 'file': 'File:Comet G-ALYU escape hatch failure.png'},
  {'id': 'modern', 'file': 'File:Window seat view of Finnair flight - 01.jpg'},
  {'id': 'modern2', 'file': 'File:Looking out the cabin window (294744333).jpg'},
 ],
}
open('episodes/184.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
