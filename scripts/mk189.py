#!/usr/bin/env python3
"""#189 WHY? — Why do onions make you cry? 23 Oct 2026. WHY? series (template #186, cine/why.js).
Facts: English Wikipedia (Oct 2026, via catalog-64 articles.md)
- "Onion" (Eye irritation): freshly cut onions sting the eyes and cause often uncontrollable tears; chopping damages cells, which
  releases enzymes (alliinases) → sulfenic acids → a second enzyme, lachrymatory factor synthase (LFS) → syn-propanethial-S-oxide,
  a gas that diffuses through the air, reaches the eyes and activates sensory neurons; lacrimal glands produce tears to dilute and
  flush out the irritant. The chain of reactions serves as a defence mechanism. Cutting under running water or submerged reduces it;
  leaving the root end intact also reduces irritation (the base has a higher concentration of sulphur compounds).
  Sunions (LFS-silenced, 30 years of cross-breeding, no GM) commercially available since early 2018 → description only.
- "Alliinase": normally sequestered within the plant cell; released when the plant is damaged by a feeding animal; deterrent; part of
  the plant's defence against herbivores; "the same reaction occurs when onion or garlic is cut with a knife"; LFS → "a potent tear gas".
- "Tears": irritation can increase tear secretion by up to ~100-fold (basal ~0.5–2.2 µL/min → ~300 µL/min).
Not claimed: anything about chilling or sharp knives (not in the sources)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 189, 'title': 'Why do onions make you cry?', 'series': 'WHY? #4',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['DO ONIONS MAKE', 'YOU CRY?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY DO ONIONS', 'MAKE YOU CRY?'],
 'cta': {'q': 'Do onions make YOU cry?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Onion',
 'vo_open': [{'at': 0.3, 'text': 'A whole onion: harmless. Cut it, and you cry. Why?',
   'de': 'Eine ganze Zwiebel: harmlos. Schneid sie, und du weinst. Warum?',
   'es': 'Una cebolla entera: inofensiva. La cortas, y lloras. ¿Por qué?',
   'fr': "Un oignon entier : inoffensif. Coupe-le, et tu pleures. Pourquoi ?"}],
 'scenes': [
  S(0, 'Reason one: it is a trap. Its cells hide enzymes. Cut them, and they burst out, to fight off hungry animals.',
    'Reason one: *a trap.* Its cells hide *enzymes.* Cut them: they *burst out.* Against *hungry animals.*',
    'Grund eins: Es ist eine Falle. Ihre Zellen verstecken Enzyme. Schneidest du sie, brechen sie heraus, gegen hungrige Tiere.',
    'Razón uno: es una trampa. Sus células esconden enzimas. Si las cortas, salen disparadas, para ahuyentar a los animales hambrientos.',
    "Raison numéro un : c'est un piège. Ses cellules cachent des enzymes. Coupe-les, et elles s'échappent, pour repousser les animaux affamés."),
  S(1, 'Reason two: tear gas. A second enzyme turns it into a gas that drifts right into your eyes.',
    'Reason two: *tear gas.* A *second enzyme* makes a *gas.* It drifts into your *eyes.*',
    'Grund zwei: Tränengas. Ein zweites Enzym macht daraus ein Gas, das direkt in deine Augen zieht.',
    'Razón dos: gas lacrimógeno. Una segunda enzima lo convierte en un gas que flota directo a tus ojos.',
    "Raison numéro deux : du gaz lacrymogène. Une deuxième enzyme en fait un gaz qui monte droit dans tes yeux."),
  S(2, 'Reason three: your eyes fight back. Nerves fire, and tears flood out. Up to a hundred times more.',
    'Reason three: *your eyes fight back.* Nerves fire. Tears flood out: up to *100×* more.',
    'Grund drei: Deine Augen wehren sich. Nerven schlagen Alarm, und Tränen spülen alles raus. Bis zu hundertmal mehr.',
    'Razón tres: tus ojos se defienden. Los nervios dan la alarma y las lágrimas lo arrastran. Hasta cien veces más.',
    "Raison numéro trois : tes yeux se défendent. Les nerfs s'affolent, et les larmes coulent. Jusqu'à cent fois plus."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='The fix: cut it under running water, and leave the root on.',
         cap='The fix: cut it under *running water.* Leave the *root* on.',
         de='Der Trick: unter fließendem Wasser schneiden, und die Wurzel dranlassen.',
         es='El truco: córtala bajo el agua del grifo, y deja la raíz.',
         fr="L'astuce : coupe-le sous l'eau du robinet, et garde la racine."),
    dict(at='0.15', text='Do onions make you cry? Tell us below, and send us your next why.', cta=True,
         de='Bringen dich Zwiebeln zum Weinen? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Las cebollas te hacen llorar? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Les oignons te font pleurer ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'whole', 'file': 'File:Liat Portal for Foodie Disorder - Red Onion.jpg'},
  {'id': 'whole2', 'file': 'File:Liat Portal for Foodie Disorder - Onions.jpg'},
  {'id': 'chopped', 'file': 'File:Chopped red onion.jpg'},
  {'id': 'chopped2', 'file': 'File:Chopped onions on a cutting board with knife.jpg'},
  {'id': 'cells', 'video': 'File:Cytoplasmic streaming.webm', 'from': 3, 'len': 10},
  {'id': 'cells2', 'file': 'File:Onion Epidermis Cells W.M. 40x - 177.jpg'},
  {'id': 'cutting', 'file': 'File:Cutting onion bulb.jpg'},
  {'id': 'cutting2', 'file': 'File:Cutting onion for salsa sauce at Kapana Single quoters in Windhoek.jpg'},
  {'id': 'mol', 'file': 'File:Syn-propanethial-S-oxide-3D-balls.png'},
  {'id': 'eye', 'file': 'File:A small piece of dirt has entered the eye-After some seconds tears will appear 2014-06-22 04-04.jpg'},
  {'id': 'eye2', 'file': 'File:DSCF4880 gözyaşı.JPG'},
  {'id': 'cross', 'file': 'File:Onion - Cross Section.jpg'},
  {'id': 'halved', 'file': 'File:Berlinwohnung rote zwiebel schnitt 10.04.2012 14-59-48.jpg'},
 ],
}
open('episodes/189.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
