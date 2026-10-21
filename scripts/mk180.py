#!/usr/bin/env python3
"""#180 OCEAN — cookiecutter shark (Isistius brasiliensis), 22 Oct 2026. Ocean track, US angle (U.S. Navy submarines, Hawaii); 25–32 s;
frame-1 = "the Navy feared an enemy weapon — it was this little shark".
Facts: English Wikipedia "Cookiecutter shark" (Oct 2026): max recorded length 42 cm (17 in) males, 56 cm (22 in) females; during the 1970s several
U.S. Navy submarines were forced back to base after cookiecutter bites to the neoprene boots of their AN/BQR-19 sonar domes, the sound-transmitting oil
leaked and impaired navigation; an unknown enemy weapon was initially feared; it attaches with suctorial lips, narrow upper teeth anchor, saw-like
lower teeth slice, then it twists and rotates its body to complete a circular cut; crater wound averaging 5 cm (2.0 in) across; photophores cover
the underside with a vivid green glow except a dark collar, hypothesised to mimic the silhouette of a small fish from below (a lure for predators,
which then lose a plug of flesh); bite scars on whales, seals, great white sharks; off Hawaii nearly every adult spinner dolphin bears scars;
bitten swimmers in Hawaiian channels (2009, 2019)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 180, 'title': 'The shark that bit Navy submarines (cookiecutter shark)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['IT ATTACKED', 'U.S. NAVY SUBS.'],
 'cta': {'q': 'Would you swim there at night?', 'a': 'YES', 'b': 'NO WAY'},
 'source': 'https://en.wikipedia.org/wiki/Cookiecutter_shark',
 'vo_open': [{'at': 0.3, 'text': 'The U.S. Navy feared a secret enemy weapon. It was this shark. Under two feet long.',
   'de': 'Die US-Marine fürchtete eine geheime feindliche Waffe. Es war dieser Hai. Keine sechzig Zentimeter lang.',
   'es': 'La Marina de Estados Unidos temía un arma enemiga secreta. Era este tiburón. De menos de sesenta centímetros.',
   'fr': "La marine américaine craignait une arme ennemie secrète. C'était ce requin. Moins de soixante centimètres."}],
 'scenes': [
  S(0, 'Nineteen seventies: it bit holes in the sonar domes of Navy submarines. Oil leaked out, and the subs had to go back to base.',
    'It bit *Navy submarines.*',
    'In den Siebzigern biss er Löcher in die Sonarkuppeln von Marine-U-Booten. Öl lief aus, und die U-Boote mussten zurück zur Basis.',
    'En los años setenta mordió las cúpulas de sonar de submarinos de la Marina. Se salió el aceite, y los submarinos tuvieron que volver a la base.',
    "Dans les années soixante-dix, il a troué les dômes sonar de sous-marins de la Marine. L'huile a fui, et les sous-marins ont dû rentrer à la base."),
  S(1, 'Its bite: suction lips grab on, saw teeth slice in, then it twists, and cuts out a round plug, two inches wide.',
    'It cuts out a *round plug.*',
    'Sein Biss: Saug-Lippen halten fest, Sägezähne schneiden, dann dreht er sich und schneidet ein rundes Stück heraus, fünf Zentimeter breit.',
    'Su mordida: labios de ventosa se pegan, dientes de sierra cortan, luego gira y arranca un trozo redondo de cinco centímetros.',
    "Sa morsure : des lèvres ventouses s'accrochent, des dents en scie tranchent, puis il tourne et découpe un morceau rond de cinq centimètres."),
  S(2, 'Its belly glows green. Except one dark collar, that looks like a small fish from below. Hunters come for the fish, and lose a bite.',
    'The dark collar *looks like a small fish.*',
    'Sein Bauch leuchtet grün. Bis auf einen dunklen Kragen, der von unten wie ein kleiner Fisch aussieht. Jäger kommen wegen des Fisches und verlieren ein Stück.',
    'Su vientre brilla en verde. Salvo un collar oscuro, que desde abajo parece un pez pequeño. Los cazadores vienen por el pez y pierden un bocado.',
    "Son ventre brille en vert. Sauf un collier sombre qui, vu d'en bas, ressemble à un petit poisson. Les chasseurs viennent pour le poisson et perdent un morceau."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Whales, seals, even great whites carry its round scars. Off Hawaii, nearly every adult spinner dolphin has them.',
         cap='Off Hawaii: *nearly every spinner dolphin.*',
         de='Wale, Robben, sogar Weiße Haie tragen seine runden Narben. Vor Hawaii hat fast jeder erwachsene Spinnerdelfin welche.',
         es='Ballenas, focas, incluso tiburones blancos llevan sus cicatrices redondas. En Hawái, casi todos los delfines tornillo adultos las tienen.',
         fr="Baleines, phoques, même des grands requins blancs portent ses cicatrices rondes. À Hawaï, presque tous les dauphins à long bec adultes en ont."),
    dict(at='0.15', text='Swim there at night? Yes or no? Comment!', cta=True,
         de='Würdest du dort nachts schwimmen? Ja oder nein? Schreib es in die Kommentare!', es='¿Nadarías ahí de noche? ¿Sí o no? ¡Comenta!',
         fr="Tu nagerais là-bas la nuit ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Horror Suspense.ogg', 'from': 60, 'len': 60, 'gain': 1},
  {'id': 'shark', 'file': 'File:Cookiecutter shark.jpg'},
  {'id': 'front', 'file': 'File:Isistius brasiliensis front view.jpg'},
  {'id': 'noaa', 'file': 'File:Cookiecutter shark noaa.jpg'},
  {'id': 'sub', 'file': 'File:US Navy 061207-N-6536T-045 The Fast attack submarine USS Los Angeles (SSN 688) pulls into the Port of Los Angeles for a namesake city visit.jpg'},
  {'id': 'jaws', 'file': 'File:Isistius brasiliensis jaws.jpg'},
  {'id': 'bites', 'file': 'File:Cookie cutter shark bites2.jpg'},
  {'id': 'belly', 'file': 'File:Isistius brasiliensis belly.jpg'},
  {'id': 'seal', 'file': 'File:Elephant seal cookiecutter shark bites.jpg'},
 ],
}
open('episodes/180.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
