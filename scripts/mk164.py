#!/usr/bin/env python3
"""Episode 164 DEEP SEA — frilled shark (Chlamydoselachus anguineus), 20 Oct 2026. Ocean track; ~26 s; frame-1 impossible number (3.5-year pregnancy).
Facts: English Wikipedia "Frilled shark" (Oct 2026): name from the fringed look of its six pairs of gill slits; 300 trident-shaped (needle-like) teeth;
devours whole prey more than half its own size; considered a "living fossil"; gestation can be as long as 3.5 years (embryo ~0.55 in/month);
first observed in its deep-water habitat in 2004 (NOAA photo, Blake Plateau)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 164, 'title': 'Pregnant for 3.5 years (frilled shark)', 'series': 'DEEP SEA',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['PREGNANT FOR', '3.5 YEARS.'],
 'cta': {'q': 'Creepy or cool?', 'a': 'CREEPY', 'b': 'COOL'},
 'source': 'https://en.wikipedia.org/wiki/Frilled_shark',
 'vo_open': [{'at': 0.3, 'text': 'This shark can be pregnant for three and a half years.',
   'de': 'Dieser Hai kann dreieinhalb Jahre lang schwanger sein.', 'es': 'Este tiburón puede estar embarazado tres años y medio.',
   'fr': 'Ce requin peut être enceinte pendant trois ans et demi.'}],
 'scenes': [
  S(0, "Meet the frilled shark, named after the frilly gills on its throat. Six pairs of them.",
    'Named after its *frilly gills.* Six pairs.',
    'Das ist der Krausenhai, benannt nach den gekräuselten Kiemen an seiner Kehle. Sechs Paare davon.',
    'Este es el tiburón anguila, llamado así por las branquias rizadas de su garganta. Seis pares.',
    "Voici le requin-lézard, nommé d'après les branchies frisées de sa gorge. Six paires."),
  S(1, 'Inside its mouth: three hundred needle-like teeth, each shaped like a tiny trident.', '*300 teeth,* each a tiny *trident.*',
    'In seinem Maul: dreihundert nadelfeine Zähne, jeder geformt wie ein winziger Dreizack.',
    'Dentro de su boca: trescientos dientes como agujas, cada uno con forma de pequeño tridente.',
    'Dans sa gueule : trois cents dents fines comme des aiguilles, chacune en forme de petit trident.'),
  S(2, 'It can swallow prey more than half its own size. Whole.', 'Prey *half its size.* Swallowed *whole.*',
    'Er kann Beute verschlingen, die mehr als halb so groß ist wie er selbst. Am Stück.',
    'Puede tragarse presas de más de la mitad de su tamaño. Enteras.',
    "Il peut avaler des proies de plus de la moitié de sa taille. En entier."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="Scientists call it a living fossil. And its babies grow so slowly, they need up to three and a half years to be born.",
         cap='A *living fossil.* Babies need *3.5 years* to be born.',
         de='Forscher nennen ihn ein lebendes Fossil. Und seine Babys wachsen so langsam, dass sie bis zu dreieinhalb Jahre bis zur Geburt brauchen.',
         es='Los científicos lo llaman un fósil viviente. Y sus crías crecen tan despacio que tardan hasta tres años y medio en nacer.',
         fr="Les scientifiques l'appellent un fossile vivant. Et ses petits grandissent si lentement qu'il leur faut jusqu'à trois ans et demi pour naître."),
    dict(at='0.15', text='Creepy or cool? Comment!', cta=True, de='Gruselig oder cool? Schreib es in die Kommentare!', es='¿Escalofriante o genial? ¡Comenta!', fr='Flippant ou génial ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 20, 'len': 60, 'gain': 0.5},
  {'id': 'wild', 'file': 'File:Chlamydoselachus anguineus NOOA.jpg'},
  {'id': 'mouth', 'file': 'File:Chlamydoselachus anguineus mouth.jpg'},
  {'id': 'garman', 'file': 'File:Chlamydoselachus anguineus by garman.png'},
  {'id': 'side', 'file': 'File:Chlamydoselachus anguineus1.jpg'},
 ],
}
open('episodes/164.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
