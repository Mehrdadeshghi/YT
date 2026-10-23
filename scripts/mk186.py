#!/usr/bin/env python3
"""#186 WHY? #1 — Why are pigeon nests so bad? 23 Oct 2026. Pilot of the "WHY?" series (everyday why-questions, cine/why.js).
Facts: English Wikipedia (Oct 2026)
- "Rock dove": the nest is a flimsy platform of straw and sticks, laid on a ledge, under cover; wild rock doves nest in crevices of
  rock formations and cliff faces — caves, canyons, sea cliffs. "Human structures provide an excellent imitation of cliff structures";
  skyscrapers, highway overpasses, farm buildings … are conducive to rock dove nesting. The species can breed at any time of the year
  due to their ability to produce crop milk; laying of eggs can take place up to six times per year; pigeon milk is produced in the
  crops of both parents.
- "Columbidae": relatively flimsy nests; the female may build the nest with material gathered by the male, or the male builds it alone.
- "Village weaver": the male weaves the nest; it needs about 300 long strips of leaf, which the male tears off and transports one by one.
- "Bird nest": the nest may form part of the courtship display, such as in weaver birds; high-quality nests may be selected for by females.
Not claimed: any single "official" reason; the three reasons are the sourced facts, framed as reasons, no "scientists think"."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 186, 'title': 'Why are pigeon nests so bad?', 'series': 'WHY? #1',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['WHY ARE PIGEON', 'NESTS SO BAD?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY ARE PIGEON', 'NESTS SO BAD?'],
 'cta': {'q': 'Pigeons: lazy or smart?', 'a': 'LAZY', 'b': 'SMART'},
 'source': 'https://en.wikipedia.org/wiki/Rock_dove',
 'vo_open': [{'at': 0.3, 'text': 'Weaver birds build this. Pigeons build this. Why?',
   'de': 'Webervögel bauen das. Tauben bauen das. Warum?', 'es': 'Los tejedores construyen esto. Las palomas, esto. ¿Por qué?',
   'fr': 'Les tisserins construisent ça. Les pigeons construisent ça. Pourquoi ?'}],
 'scenes': [
  S(0, 'Reason one: pigeons are cliff birds. In the wild, they nest on ledges in sea cliffs and caves.',
    'Reason one: *cliff birds.* Wild ones nest on *ledges* in *sea cliffs* and *caves.*',
    'Grund eins: Tauben sind Felsenvögel. In freier Natur nisten sie auf Felsvorsprüngen in Klippen am Meer und in Höhlen.',
    'Razón uno: las palomas son aves de acantilado. En libertad anidan en salientes de acantilados marinos y en cuevas.',
    "Raison numéro un : les pigeons sont des oiseaux de falaise. À l'état sauvage, ils nichent sur des corniches de falaises et dans des grottes."),
  S(1, 'Skyscrapers and highway overpasses? To a pigeon, just more cliffs.',
    '*Skyscrapers* and *overpasses?* To a pigeon: more *cliffs.*',
    'Wolkenkratzer und Autobahnbrücken? Für eine Taube einfach noch mehr Klippen.',
    '¿Rascacielos y pasos elevados? Para una paloma, solo más acantilados.',
    "Gratte-ciel et ponts d'autoroute ? Pour un pigeon, ce sont juste d'autres falaises."),
  S(2, 'Reason two: no show-off. A weaver male tears off about three hundred leaf strips to impress a female. A pigeon dad may just bring sticks.',
    'Reason two: *no show-off.* A weaver tears off *300 leaf strips.* A pigeon dad: *sticks.*',
    'Grund zwei: kein Angeben. Ein Webervogel-Männchen reißt rund dreihundert Blattstreifen ab, um ein Weibchen zu beeindrucken. Ein Tauben-Papa bringt oft nur Stöckchen.',
    'Razón dos: nada de presumir. Un tejedor macho arranca unas trescientas tiras de hoja para impresionar a una hembra. Un palomo a veces solo trae palitos.',
    "Raison numéro deux : pas de frime. Un tisserin mâle arrache environ trois cents lanières de feuilles pour séduire une femelle. Un papa pigeon apporte parfois juste des brindilles."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Reason three: nonstop babies. Pigeons make milk, so they can breed all year, up to six times. Both parents make it. Even dads.',
         cap='Reason three: *nonstop babies.* Pigeons make *milk.* Up to *6 times* a year. *Both parents.* Even *dads.*',
         de='Grund drei: Babys ohne Pause. Tauben machen Milch, darum können sie das ganze Jahr brüten, bis zu sechs Mal. Beide Eltern machen sie. Sogar die Väter.',
         es='Razón tres: bebés sin parar. Las palomas producen leche, así que pueden criar todo el año, hasta seis veces. La producen los dos padres. Incluso los machos.',
         fr="Raison numéro trois : des bébés non-stop. Les pigeons produisent du lait, donc ils peuvent se reproduire toute l'année, jusqu'à six fois. Les deux parents en font. Même les pères."),
    dict(at='0.15', text='Lazy or smart? Comment! And tell us your next why.', cta=True,
         de='Faul oder schlau? Schreib es in die Kommentare! Und schick uns dein nächstes Warum.',
         es='¿Vagas o listas? ¡Comenta! Y dinos tu próximo porqué.',
         fr='Paresseux ou malins ? Commente ! Et dis-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'weaver', 'file': 'File:Weaver Bird Nest Closeup.jpg'},
  {'id': 'weaver2', 'file': 'File:Village Weaver Nest 7.jpg'},
  {'id': 'wbuild', 'file': 'File:Black-headed weaver (Ploceus cucullatus bohndorffi) male nest building.jpg'},
  {'id': 'wclip', 'video': 'File:001 Black-headed weaver building its nest at Kibale forest National Park Video by Giles Laurent.webm', 'from': 4, 'len': 10},
  {'id': 'pnest', 'file': 'File:Pigeon nest.jpg'},
  {'id': 'pnest2', 'file': 'File:Feral pigeon nest, Bangalore.jpg'},
  {'id': 'cliff', 'file': 'File:133109 rosh hanikra - pigeons nesting in the rock cliffs PikiWiki Israel.jpg'},
  {'id': 'cliff2', 'file': 'File:133110 rosh hanikra - pigeons nesting in the rock cliffs PikiWiki Israel.jpg'},
  {'id': 'cliff3', 'file': 'File:Feral pigeons on cliffs at Hunstanton, Norfolk.jpg'},
  {'id': 'nyc', 'file': 'File:Air conditioner cage with pigeon nest in Manhattan 01.jpg'},
  {'id': 'nyc2', 'file': 'File:Air conditioner cage with pigeon nest in Manhattan 03.jpg'},
  {'id': 'overpass', 'file': 'File:Pigeons under overpass (29328368381).jpg'},
  {'id': 'twig', 'file': 'File:Pigeon building nest i Eskilstuna, Sweden.jpg'},
  {'id': 'feed', 'file': 'File:Feral Pigeon feeding squabs, Lithuania.jpg'},
  {'id': 'feed2', 'file': 'File:Pigeon 1050170.jpg'},
 ],
}
open('episodes/186.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
