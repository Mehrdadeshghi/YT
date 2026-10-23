#!/usr/bin/env python3
"""#194 WHY? #9 — Why do knuckles crack? 24 Oct 2026. WHY? series (template #186, cine/why.js), voice: Gemini TTS.
Facts: English Wikipedia "Cracking joints" (Oct 2026, catalog-68 articles.md)
- Cracking mechanism: gas dissolved in the synovial fluid; when the pressure inside the joint cavity is quickly reduced by
  mechanical expansion, gas leaves the solution and forms a bubble (cavitation). Gas thought to be mainly CO2, O2 and nitrogen.
- "Refractory period", during which the joint cannot be re-cracked, lasts about 20 minutes while the gases are slowly reabsorbed.
- In 2015, research indicated that bubbles remained in the fluid after a joint cracked → sound from the bubble forming rather than
  collapsing. 2018 French simulation said collapse; "the scientific community remains unconvinced" → "still debated".
- Knuckle cracking → arthritis: old wives' tale without scientific evidence. Donald Unger (American doctor), 2004 paper in
  Arthritis & Rheumatism: cracked the knuckles of his LEFT hand every day for more than fifty years, not the right; no arthritis or
  other ailments in either hand; 2009 Ig Nobel Prize in Medicine.
Not claimed: "MRI" (the article only says "research"), "sixty years" (the article says more than fifty)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 194, 'title': 'Why do knuckles crack?', 'series': 'WHY? #9',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['DO KNUCKLES', 'CRACK?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY DO', 'KNUCKLES CRACK?'],
 'cta': {'q': 'Do you crack your knuckles?', 'a': 'YES', 'b': 'NEVER'},
 'source': 'https://en.wikipedia.org/wiki/Cracking_joints',
 'vo_open': [{'at': 0.3, 'text': 'Pull a finger: crack. Try again right away: nothing. Why?',
   'de': 'Zieh an einem Finger: Knack. Gleich nochmal: nichts. Warum?',
   'es': 'Tira de un dedo: crac. Inténtalo otra vez enseguida: nada. ¿Por qué?',
   'fr': "Tire sur un doigt : crac. Recommence tout de suite : rien. Pourquoi ?"}],
 'scenes': [
  S(0, 'Reason one: a gas bubble. Pull the joint, the pressure drops, and gas in the joint fluid forms a bubble.',
    'Reason one: *a gas bubble.* Pull the joint: *pressure drops.* Gas in the *joint fluid* forms a *bubble.*',
    'Grund eins: eine Gasblase. Zieh am Gelenk, der Druck fällt, und Gas in der Gelenkflüssigkeit bildet eine Blase.',
    'Razón uno: una burbuja de gas. Tiras de la articulación, la presión baja y el gas del líquido articular forma una burbuja.',
    "Raison numéro un : une bulle de gaz. Tire sur l'articulation, la pression chute, et le gaz du liquide articulaire forme une bulle."),
  S(1, 'Pop when it forms, or when it bursts? A twenty fifteen study saw the bubble still there after the crack. Still debated.',
    'Pop when it *forms*, or when it *bursts?* A *2015 study:* bubble *still there* after the crack. *Still debated.*',
    'Knallt es beim Entstehen oder beim Platzen? Eine Studie von zweitausendfünfzehn sah die Blase nach dem Knacken noch. Bis heute umstritten.',
    '¿Suena al formarse o al reventar? Un estudio de dos mil quince vio la burbuja todavía ahí después del crujido. Sigue en debate.',
    "Ça claque quand elle se forme, ou quand elle éclate ? Une étude de deux mille quinze a vu la bulle encore là après le craquement. Toujours débattu."),
  S(2, 'Reason two: the reload. The gas needs about twenty minutes to dissolve back. Until then, no crack.',
    'Reason two: *the reload.* The gas needs about *20 minutes* to dissolve back. Until then: *no crack.*',
    'Grund zwei: das Nachladen. Das Gas braucht etwa zwanzig Minuten, um sich wieder zu lösen. Bis dahin: kein Knacken.',
    'Razón dos: la recarga. El gas necesita unos veinte minutos para disolverse de nuevo. Hasta entonces, nada de crujidos.',
    "Raison numéro deux : la recharge. Le gaz met environ vingt minutes à se redissoudre. D'ici là, pas de craquement."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Arthritis? A doctor cracked only his left knuckles for over fifty years. Neither hand got arthritis. He won an Ig Nobel Prize.',
         cap='*Arthritis?* A doctor cracked only his *left* knuckles for *50+ years.* *Neither hand* got arthritis. *Ig Nobel Prize.*',
         de='Arthrose? Ein Arzt knackte über fünfzig Jahre lang nur die Knöchel seiner linken Hand. Keine Hand bekam Arthrose. Dafür gab es den Ig-Nobelpreis.',
         es='¿Artritis? Un médico se crujió solo los nudillos de la mano izquierda durante más de cincuenta años. Ninguna mano tuvo artritis. Ganó un premio Ig Nobel.',
         fr="L'arthrose ? Un médecin a fait craquer seulement sa main gauche pendant plus de cinquante ans. Aucune main n'a eu d'arthrose. Il a gagné un prix Ig Nobel."),
    dict(at='0.15', text='Do you crack your knuckles? Tell us below, and tell us your next why.', cta=True,
         de='Knackst du mit den Fingern? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Te crujes los nudillos? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Tu fais craquer tes doigts ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'crack', 'file': 'File:Cracking knuckles.jpg'},
  {'id': 'scan', 'file': 'File:Visualization of Joint Cavitation.png'},
  {'id': 'bend', 'file': 'File:Hypermobile fingers.jpg'},
  {'id': 'xray', 'file': 'File:X-ray of normal hand by dorsoplantar projection.jpg'},
  {'id': 'ig4', 'file': 'File:36th Ig Nobel Prize Ceremony Zurich 034.jpg'},
 ],
}
open('episodes/194.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
