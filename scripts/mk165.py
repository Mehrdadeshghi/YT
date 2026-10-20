#!/usr/bin/env python3
"""#165 OCEAN — box jellyfish, 20 Oct 2026. Ocean track; 25–28 s; frame-1 contradiction ("24 eyes. No brain.").
Facts: English Wikipedia (Oct 2026)
- "Box jellyfish": six eyes on each of their four rhopalia = 24 eyes in total; box jellyfish have true eyes with retinas, corneas and lenses
  (each rhopalium has two image-forming lens eyes); in species such as Tripedalia cystophora the upper lens eye looks straight up out of the
  water and is used to navigate to mangrove lagoons by observing the direction of the tree canopy; they actively hunt small fish rather than drift,
  up to 1.5–2 m/s or about 4 knots (4.6 mph); more than 170 toxic proteins were identified in the venom; in Australia jugs of vinegar are placed
  along swimming beaches for rapid first aid.
- "Jellyfish": although they lack a true brain, cnidarian jellyfish have a "ring" nervous system."""
import json, sys
FPS1 = '--preview' in sys.argv          # first fetch: long clips at 1 fps to pick the seconds
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
clip = lambda f, a, n, pv: {'video': f, **({'from': 0, 'len': pv, 'fps': 1} if FPS1 else {'from': a, 'len': n})}
E = {
 'ep': 165, 'title': '24 eyes. No brain.', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['24 EYES.', 'NO BRAIN.'],
 'cta': {'q': 'Still going in the water?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Box_jellyfish',
 'vo_open': [{'at': 0.3, 'text': 'Twenty-four eyes. No brain.',
   'de': 'Vierundzwanzig Augen. Kein Gehirn.', 'es': 'Veinticuatro ojos. Sin cerebro.', 'fr': 'Vingt-quatre yeux. Pas de cerveau.'}],
 'scenes': [
  S(0, 'A box jellyfish has six eyes on each of its four sides. Two in each cluster even have a lens and a retina, like yours.',
    '*6 eyes* on each of its *4 sides.* Some have a *lens* and a *retina.*',
    'Eine Würfelqualle hat sechs Augen an jeder ihrer vier Seiten. Zwei davon haben sogar eine Linse und eine Netzhaut, wie deine.',
    'Una medusa de caja tiene seis ojos en cada uno de sus cuatro lados. Dos de ellos tienen incluso lente y retina, como los tuyos.',
    "Une méduse-boîte a six yeux sur chacun de ses quatre côtés. Deux d'entre eux ont même un cristallin et une rétine, comme les tiens."),
  S(1, 'One eye looks straight up, out of the water, so it can steer by the trees above.',
    'One eye looks *up, out of the water,* to steer by the *trees.*',
    'Ein Auge schaut senkrecht nach oben, aus dem Wasser heraus, damit sie sich an den Bäumen orientieren kann.',
    'Un ojo mira hacia arriba, fuera del agua, para guiarse por los árboles.',
    "Un œil regarde droit vers le haut, hors de l'eau, pour se repérer grâce aux arbres."),
  S(2, "And it doesn't just drift. It hunts fish, at up to four point six miles an hour.",
    "It doesn't drift. It *hunts,* at up to *4.6 mph.*",
    'Und sie treibt nicht einfach. Sie jagt Fische, mit bis zu sieben Kilometern pro Stunde.',
    'Y no solo flota a la deriva. Caza peces, a hasta siete kilómetros por hora.',
    "Et elle ne fait pas que dériver. Elle chasse des poissons, jusqu'à sept kilomètres à l'heure."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Its venom holds over a hundred and seventy toxic proteins. That is why Australian beaches keep vinegar ready for first aid.',
         cap='*170+ toxic proteins.* Beaches keep *vinegar* for first aid.',
         de='Ihr Gift enthält über hundertsiebzig giftige Proteine. Deshalb steht an australischen Stränden Essig für die Erste Hilfe bereit.',
         es='Su veneno tiene más de ciento setenta proteínas tóxicas. Por eso las playas australianas tienen vinagre listo para los primeros auxilios.',
         fr="Son venin contient plus de cent soixante-dix protéines toxiques. C'est pour ça que les plages australiennes gardent du vinaigre pour les premiers secours."),
    dict(at='0.15', text='Still going in the water? Yes or no? Comment!', cta=True,
         de='Gehst du trotzdem ins Wasser? Ja oder nein? Ab in die Kommentare!',
         es='¿Todavía te metes al agua? ¿Sí o no? ¡Comenta!', fr="Tu vas quand même dans l'eau ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 20, 'len': 60, 'gain': 0.5},
  {'id': 'swim', **clip('File:Carybdea Civitavecchia (2013).webm', 52, 5, 123)},
  {'id': 'swim2', **clip('File:Carybdea Civitavecchia (2013).webm', 99, 6, 2)},
  {'id': 'trip', 'file': 'File:Tripedalia-cystophora-Bielecki.jpg'},
  {'id': 'avispa', 'file': 'File:Avispa marina.jpg'},
  {'id': 'vinegar', 'file': 'File:Australia - Marine Stingers (Vinegar depot).jpg'},
 ],
}
open('episodes/165.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
