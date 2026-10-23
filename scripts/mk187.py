#!/usr/bin/env python3
"""#187 WHY? #2 — Why are flamingos pink? 23 Oct 2026. WHY? series (template #186, cine/why.js).
Facts: English Wikipedia (Oct 2026)
- "Flamingo": young flamingos hatch with greyish-red plumage, adults light pink to bright red due to aqueous bacteria and beta-carotene
  from their food; the pink or reddish colour comes from carotenoids in their diet of animal and plant plankton; these carotenoids are
  broken down into pigments by liver enzymes; flamingos filter-feed on brine shrimp, cyanobacteria (blue-green algae) …; a well-fed,
  healthy flamingo is more vibrantly coloured, thus a more desirable mate; a white or pale flamingo is usually unhealthy or malnourished;
  both the male and the female feed their chicks with a kind of crop milk.
- "Greater flamingo": chicks are covered in grey fluffy down; adults feeding chicks also become paler; during the breeding season they
  spread uropygial (preen-gland) secretions, which contain carotenoids, over their feathers to enhance their colour — described as
  applying "make-up".
- "Crop milk": in flamingos, crop milk in the first weeks is bright red; it resembles blood in colour but contains no red blood cells;
  the red colour is from canthaxanthin."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 187, 'title': 'Why are flamingos pink?', 'series': 'WHY? #2',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['ARE FLAMINGOS', 'PINK?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY ARE', 'FLAMINGOS PINK?'],
 'cta': {'q': 'Knew flamingos make milk?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Flamingo',
 'vo_open': [{'at': 0.3, 'text': 'Baby flamingos are grey. Adults are pink. Why?',
   'de': 'Flamingo-Küken sind grau. Erwachsene sind rosa. Warum?', 'es': 'Los flamencos bebé son grises. Los adultos, rosas. ¿Por qué?',
   'fr': 'Les bébés flamants sont gris. Les adultes sont roses. Pourquoi ?'}],
 'scenes': [
  S(0, 'Reason one: they are what they eat. Brine shrimp and algae are full of pigments called carotenoids. Their liver turns them pink.',
    'Reason one: *you are what you eat.* Brine shrimp and algae: full of *carotenoids.* The liver turns them *pink.*',
    'Grund eins: Sie sind, was sie essen. Salzkrebschen und Algen stecken voller Farbstoffe, sogenannter Carotinoide. Ihre Leber macht daraus Rosa.',
    'Razón uno: son lo que comen. Las artemias y las algas están llenas de pigmentos llamados carotenoides. Su hígado los vuelve rosa.',
    "Raison numéro un : ils sont ce qu'ils mangent. Les artémies et les algues sont pleines de pigments, les caroténoïdes. Leur foie les transforme en rose."),
  S(1, 'Reason two: pink means healthy. A pale flamingo is usually sick or starving. Bright pink wins a mate, so in breeding season, they even put on make-up.',
    'Reason two: *pink = healthy.* Pale = usually *sick* or *starving.* In breeding season: *make-up.*',
    'Grund zwei: Rosa heißt gesund. Ein blasser Flamingo ist meist krank oder hungrig. Kräftiges Rosa gewinnt einen Partner, darum tragen sie in der Brutzeit sogar Make-up auf.',
    'Razón dos: rosa significa sano. Un flamenco pálido suele estar enfermo o hambriento. El rosa intenso conquista pareja, así que en celo hasta se maquillan.',
    "Raison numéro deux : rose veut dire en bonne santé. Un flamant pâle est souvent malade ou affamé. Le rose vif séduit, alors en saison des amours, ils se maquillent même."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text='Reason three: they feed their color away. Mom and dad feed the chick a bright red milk. It looks like blood. And the parents turn pale.',
         cap='Reason three: *they feed it away.* Mom and dad make *red milk.* Looks like *blood.* Parents turn *pale.*',
         de='Grund drei: Sie verfüttern ihre Farbe. Mama und Papa füttern das Küken mit knallroter Milch. Sie sieht aus wie Blut. Und die Eltern werden blass.',
         es='Razón tres: regalan su color. Mamá y papá alimentan al polluelo con una leche roja intensa. Parece sangre. Y los padres palidecen.',
         fr="Raison numéro trois : ils donnent leur couleur. Papa et maman nourrissent le poussin d'un lait rouge vif. On dirait du sang. Et les parents pâlissent."),
    dict(at='0.15', text='Did you know they make milk? Tell us below, and send us your next why.', cta=True,
         de='Wusstest du, dass sie Milch machen? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Sabías que producen leche? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr="Tu savais qu'ils font du lait ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'chick', 'file': 'File:Fluffy Flamingo Chick (20587754630).jpg'},
  {'id': 'chick2', 'file': 'File:Flamingo chick, Washington Wetland Centre - geograph.org.uk - 3384282.jpg'},
  {'id': 'adult', 'file': 'File:American flamingo in Galápagos (Phoenicopterus ruber).jpg'},
  {'id': 'adult2', 'file': 'File:Phoenicopterus ruber Bonaire 1.jpg'},
  {'id': 'shrimp', 'file': 'File:Artemia salina 4.jpg'},
  {'id': 'shrimp2', 'file': 'File:Live brine shrimp.jpg'},
  {'id': 'feedclip', 'video': 'File:Phoenicopterus roseus feeding - adult.ogv', 'from': 0, 'len': 12},
  {'id': 'flock', 'file': 'File:American flamingos (Phoenicopterus ruber) Cu.jpg'},
  {'id': 'preen', 'file': 'File:020 Greater flamingo preening in the Camargue Photo by Giles Laurent.jpg'},
  {'id': 'preen2', 'file': 'File:Flamingo preening (38733467980).jpg'},
  {'id': 'milk', 'file': 'File:Rosaflamingo-Küken - Fuetterung mit Kropfmilch.jpg'},
  {'id': 'milk2', 'file': 'File:Lesser Flamingo adult feeding crop milk.jpg'},
  {'id': 'milk3', 'file': 'File:Flickr - law keven - Think Pink.....jpg'},
 ],
}
open('episodes/187.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
