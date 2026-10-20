#!/usr/bin/env python3
"""#159 CURIOSITY — the June 1962 Alcatraz escape (experiment E6: a curiosity topic done fairly, with REAL public-domain FBI photos).
Facts: English Wikipedia "June 1962 Alcatraz escape attempt" (Oct 2026): night of June 11, 1962, Frank Morris + John and Clarence Anglin;
dummy heads from a papier-mâché-like mix of soap, toothpaste, concrete dust and toilet paper, hair from the barbershop floor;
over six months they widened the vents beneath their sinks with saw blades, spoons and a drill improvised from a vacuum-cleaner motor;
six-by-fourteen-foot rubber raft; frigid waters of the bay; escape not discovered until 7 am June 12 — officers tried to rouse
Clarence Anglin and the dummy head fell onto the floor; no bodies were found; FBI (1979): most likely drowned; case still debated."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 159, 'title': 'The heads that fooled Alcatraz (1962 escape)', 'series': 'CURIOSITY', 'experiment': 'E6 curiosity done fairly, real FBI photos',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1560, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THESE HEADS FOOLED', 'THE GUARDS ALL NIGHT.'],
 'cta': {'q': 'Did they make it?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/June_1962_Alcatraz_escape_attempt',
 'vo_open': [{'at': 0.3, 'text': 'These heads fooled the guards all night.',
   'de': 'Diese Köpfe haben die Wärter eine ganze Nacht lang getäuscht.', 'es': 'Estas cabezas engañaron a los guardias toda la noche.',
   'fr': 'Ces têtes ont trompé les gardiens toute la nuit.'}],
 'scenes': [
  S(0, 'In nineteen sixty-two, three Alcatraz inmates made them from soap, toilet paper and hair from the barbershop floor.',
    'Made of *soap, toilet paper* and *real hair.*',
    'Neunzehnhundertzweiundsechzig bauten drei Häftlinge auf Alcatraz sie aus Seife, Klopapier und Haaren vom Boden des Friseurs.',
    'En mil novecientos sesenta y dos, tres presos de Alcatraz las hicieron con jabón, papel higiénico y pelo del suelo de la barbería.',
    "En mille neuf cent soixante-deux, trois détenus d'Alcatraz les ont faites avec du savon, du papier toilette et des cheveux ramassés chez le coiffeur."),
  S(1, 'For six months, they dug through the vents under their sinks with spoons and a drill made from a vacuum cleaner.',
    '*Six months* of digging, with *spoons.*',
    'Sechs Monate lang gruben sie sich durch die Lüftungsschächte unter ihren Waschbecken, mit Löffeln und einem Bohrer aus einem Staubsauger.',
    'Durante seis meses cavaron por las rejillas bajo sus lavabos, con cucharas y un taladro hecho con una aspiradora.',
    "Pendant six mois, ils ont creusé les grilles d'aération sous leurs lavabos, avec des cuillères et une perceuse faite d'un aspirateur."),
  S(2, 'Then they slipped into the freezing bay on a homemade raft, fourteen feet long.',
    'A *homemade raft* into the *freezing bay.*',
    'Dann glitten sie auf einem selbst gebauten Floß, gut vier Meter lang, in die eiskalte Bucht.',
    'Luego se metieron en la bahía helada en una balsa casera de cuatro metros.',
    'Puis ils se sont glissés dans la baie glacée sur un radeau fait maison de quatre mètres.'),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='At seven a.m., a guard tried to wake one of them, and the head fell on the floor. No bodies were ever found.',
         cap='The head *fell on the floor.* No bodies *ever found.*',
         de='Um sieben Uhr morgens wollte ein Wärter einen von ihnen wecken, und der Kopf fiel auf den Boden. Leichen wurden nie gefunden.',
         es='A las siete de la mañana, un guardia intentó despertar a uno, y la cabeza cayó al suelo. Nunca se encontraron los cuerpos.',
         fr="À sept heures du matin, un gardien a voulu en réveiller un, et la tête est tombée par terre. On n'a jamais retrouvé les corps."),
    dict(at='0.15', text='Did they make it? Yes or no? Comment!', cta=True,
         de='Haben sie es geschafft? Ja oder nein? Schreib es in die Kommentare!', es='¿Lo lograron? ¿Sí o no? ¡Comenta!', fr="Ils s'en sont sortis ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 40, 'len': 60, 'gain': 0.5},
  {'id': 'head', 'file': 'File:Dummy head made by Frank Morris to facilitate his escape from Alcatraz in 1962.jpg'},
  {'id': 'heads', 'file': 'File:Dummy heads.jpg'},
  {'id': 'vent', 'file': 'File:Alcatraz cell vent.JPG'},
  {'id': 'isle', 'file': 'File:Alcatraz Island March 1962.jpg'},
  {'id': 'morris', 'file': 'File:Frank Morris.jpg'},
  {'id': 'john', 'file': 'File:John Anglin.jpg'},
  {'id': 'clar', 'file': 'File:Clarence Anglin.jpg'},
 ],
}
open('episodes/159.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
