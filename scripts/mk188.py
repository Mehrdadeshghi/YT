#!/usr/bin/env python3
"""#188 WHY? #3 — Why do zebras have stripes? 23 Oct 2026. WHY? series (template #186, cine/why.js).
Facts: English Wikipedia "Zebra" (Oct 2026), section Function:
- "Several theories have been proposed for the function of these patterns, with most evidence supporting them as a deterrent for
  biting flies." (lead)
- Crypsis: Caro notes zebras graze in open habitat and do not behave cryptically; Melin et al. (2016): lions and hyenas do not appear
  to perceive the stripes when they are a certain distance away, day or night.
- Thermoregulation: a 2018 experimental study dressed water-filled metal barrels in horse, zebra and cattle hides and concluded zebra
  stripes had no effect on thermoregulation (other studies disagree → the VO only says what that test found).
- Flies: horse flies spread diseases that are lethal to equines (African horse sickness, equine influenza, …); Caro et al. (2019):
  zebra stripes kept flies from landing, both on zebras and on horses dressed in zebra-print coats.
Not claimed: that the fly question is settled (the article cautions how the stripes repel flies is less clear) → "most evidence points to"."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 188, 'title': 'Why do zebras have stripes?', 'series': 'WHY? #3',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['WHY DO ZEBRAS', 'HAVE STRIPES?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY DO ZEBRAS', 'HAVE STRIPES?'],
 'cta': {'q': 'Did you guess flies?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Zebra',
 'vo_open': [{'at': 0.3, 'text': 'Horses are plain. Zebras wear stripes. Why?',
   'de': 'Pferde sind einfarbig. Zebras tragen Streifen. Warum?', 'es': 'Los caballos son lisos. Las cebras llevan rayas. ¿Por qué?',
   'fr': 'Les chevaux sont unis. Les zèbres portent des rayures. Pourquoi ?'}],
 'scenes': [
  S(0, 'Camouflage? That was idea one. But zebras graze out in the open, and lions can\'t even see the stripes from far away.',
    '*Camouflage?* Idea one. But zebras graze in the *open.* Lions can\'t see the stripes from *far away.*',
    'Idee eins: Tarnung. Aber Zebras grasen im offenen Gelände, und Löwen sehen die Streifen aus der Ferne gar nicht.',
    'Idea uno: camuflaje. Pero las cebras pastan a campo abierto, y los leones ni siquiera ven las rayas de lejos.',
    "Première idée : le camouflage. Mais les zèbres broutent à découvert, et les lions ne voient même pas les rayures de loin."),
  S(1, 'Keeping cool? That was idea two. One test wrapped water barrels in zebra skin. The stripes made no difference.',
    '*Keeping cool?* Idea two. Water barrels in *zebra skin.* The stripes: *no difference.*',
    'Idee zwei: Kühlung. Ein Test hüllte Wasserfässer in Zebrafell. Die Streifen machten keinen Unterschied.',
    'Idea dos: refrescarse. Una prueba envolvió barriles de agua en piel de cebra. Las rayas no cambiaron nada.',
    "Deuxième idée : rester au frais. Un test a enveloppé des barils d'eau dans de la peau de zèbre. Les rayures n'ont rien changé."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text='Most evidence points to biting flies. Horse flies spread deadly diseases. Dress a horse in a zebra coat, and the flies stop landing.',
         cap='Most evidence: *biting flies.* They spread *deadly diseases.* A horse in a *zebra coat?* Flies *stop landing.*',
         de='Die meisten Belege sprechen für stechende Fliegen. Bremsen übertragen tödliche Krankheiten. Zieh einem Pferd einen Zebramantel an, und die Fliegen landen nicht mehr.',
         es='La mayoría de las pruebas apuntan a las moscas que pican. Los tábanos transmiten enfermedades mortales. Ponle a un caballo un abrigo de cebra, y las moscas dejan de posarse.',
         fr="La plupart des preuves désignent les mouches piqueuses. Les taons transmettent des maladies mortelles. Mets un manteau zébré à un cheval, et les mouches ne se posent plus."),
    dict(at='0.15', text='Did you guess flies? Tell us below, and send us your next why.', cta=True,
         de='Hättest du auf Fliegen getippt? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Adivinaste lo de las moscas? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Tu avais deviné les mouches ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'horse', 'file': 'File:Mare foal poland.jpg'},
  {'id': 'horse2', 'file': 'File:Biandintz eta zaldiak - modified2.jpg'},
  {'id': 'zebra', 'file': 'File:Zebra (44482375151).jpg'},
  {'id': 'zebra2', 'file': 'File:Grevy Zebra of Samburu.jpg'},
  {'id': 'zclose', 'file': 'File:100 Plains zebra hair patterns close-up in Etosha National Park Photo by Giles Laurent.jpg'},
  {'id': 'open', 'file': 'File:Zebras grazing among acacia trees, Serengeti National Park.jpg'},
  {'id': 'open2', 'file': 'File:Zebra herd, Maasai Mara National Reserve, Kenya.jpg'},
  {'id': 'lion', 'file': 'File:Lioness zebras and wildbeast in Ngorongoro Crater.jpg'},
  {'id': 'fly', 'file': 'File:Horse fly Tabanus 2.jpg'},
  {'id': 'flyhorse', 'file': 'File:Hevoset kesälaitumella 10.jpg'},
  {'id': 'coat', 'file': 'File:Horse in a zebra coat - near Hurstfold Farm - geograph.org.uk - 7236268.jpg'},
  {'id': 'zclip', 'video': 'File:Nairobi National Park (August 2025) Zebra.webm', 'from': 1, 'len': 10},
 ],
}
open('episodes/188.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
