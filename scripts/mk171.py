#!/usr/bin/env python3
"""Episode 171 OCEAN — cone snail (Conidae), 21 Oct 2026. Ocean track; ~27 s; frame-1 contradiction (a snail that hunts fish with a harpoon).
Facts: English Wikipedia "Cone snail" (Oct 2026): all cone snails are venomous; prey incl. small fish; a modified radula tooth, hollow and barbed,
likened to a harpoon, loaded with venom and fired from the proboscis; the harpoon of Conus catus reaches up to 90 km/h (56 mph), one of the fastest
complete movements recorded in animals; approximately 30 records of humans killed; harpoon can sting through a wetsuit; geography and tulip cones
secrete insulin that paralyzes nearby fish (hypoglycaemic shock); ziconotide (from Conus magus venom) approved by the U.S. FDA in December 2004.
"Conus geographus": fires a venom-tipped tooth, pulls the prey in; insulin passes through the fish's gills -> hypoglycaemic shock.
"Ziconotide": painkiller for severe chronic pain, derived from Conus magus, FDA approval 28 Dec 2004."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 171, 'title': 'This snail hunts fish with a harpoon (cone snail)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THIS SNAIL', 'HUNTS FISH.'],
 'cta': {'q': 'Pick one up on the beach?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Cone_snail',
 'vo_open': [{'at': 0.3, 'text': 'This snail hunts fish. With a harpoon.',
   'de': 'Diese Schnecke jagt Fische. Mit einer Harpune.', 'es': 'Este caracol caza peces. Con un arpón.',
   'fr': 'Cet escargot chasse des poissons. Au harpon.'}],
 'scenes': [
  S(0, 'Cone snails turned a tooth into a hollow, barbed harpoon, loaded with venom and fired from a long tube.',
    'A tooth turned into a *barbed harpoon.*',
    'Kegelschnecken haben einen Zahn zu einer hohlen Harpune mit Widerhaken gemacht, gefüllt mit Gift und aus einem langen Rüssel abgefeuert.',
    'Los caracoles cono convirtieron un diente en un arpón hueco con púas, cargado de veneno y disparado desde un tubo largo.',
    "Les cônes ont transformé une dent en harpon creux et barbelé, rempli de venin et tiré depuis un long tube."),
  S(1, 'Fifty-six miles per hour. That harpoon is one of the fastest moves ever measured in an animal.',
    'Up to *56 mph.*',
    'Neunzig Kilometer pro Stunde. Diese Harpune ist eine der schnellsten Bewegungen, die je bei einem Tier gemessen wurden.',
    'Noventa kilómetros por hora. Ese arpón es uno de los movimientos más rápidos jamás medidos en un animal.',
    "Quatre-vingt-dix kilomètres à l'heure. Ce harpon est l'un des mouvements les plus rapides jamais mesurés chez un animal."),
  S(2, 'Humans are not safe either. About thirty people have been killed, and the harpoon can go through a wetsuit.',
    'About *30 people* killed.',
    'Auch Menschen sind nicht sicher. Etwa dreißig Todesfälle sind bekannt, und die Harpune geht sogar durch einen Neoprenanzug.',
    'Los humanos tampoco están a salvo. Se conocen unas treinta muertes, y el arpón atraviesa un traje de neopreno.',
    "Les humains non plus ne sont pas à l'abri. On connaît une trentaine de morts, et le harpon traverse une combinaison de plongée."),
  S(3, 'Insulin is its secret weapon. The geography cone releases it, and nearby fish go into shock.',
    '*Insulin* as a weapon.',
    'Insulin ist seine Geheimwaffe. Die Landkarten-Kegelschnecke gibt es ab, und Fische in der Nähe fallen in einen Schock.',
    'La insulina es su arma secreta. El cono geógrafo la libera, y los peces cercanos entran en shock.',
    "L'insuline est son arme secrète. Le cône géographe la libère, et les poissons autour tombent en état de choc."),
  {'dur': 1.6, 'vis': 4, 'vo': [
    dict(at=0.45, text='Doctors even turned cone snail venom into a painkiller, approved in the US in two thousand four.',
         cap='Its venom became a *painkiller.*',
         de='Ärzte haben aus dem Gift sogar ein Schmerzmittel gemacht, in den USA zugelassen seit zweitausendvier.',
         es='Incluso convirtieron su veneno en un analgésico, aprobado en Estados Unidos en dos mil cuatro.',
         fr="On a même fait de son venin un antidouleur, autorisé aux États-Unis en deux mille quatre."),
    dict(at='0.15', text='Pick one up on the beach? Yes or no? Comment!', cta=True,
         de='Würdest du eine am Strand aufheben? Ja oder nein? Schreib es in die Kommentare!', es='¿Recogerías uno en la playa? ¿Sí o no? ¡Comenta!',
         fr='Tu en ramasserais un sur la plage ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'eat', 'file': 'File:Conus eating a fish.jpg'},
  {'id': 'appar', 'file': 'File:Cone shell venom apparatus.jpg'},
  {'id': 'live', 'file': 'File:Conus geographus 59839864.jpg'},
  {'id': 'textile', 'file': 'File:Textile cone.JPG'},
  {'id': 'redsea', 'file': 'File:Caracol de mar (Conus geographus), mar Rojo, Egipto, 2023-04-16, DD 51.jpg'},
  {'id': 'magus', 'file': 'File:Conus magus 002.jpg'},
 ],
}
open('episodes/171.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
