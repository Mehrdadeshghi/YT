#!/usr/bin/env python3
"""#172 OCEAN — sarcastic fringehead (Neoclinus blanchardi), 21 Oct 2026. Ocean track, US angle (California coast); 25–28 s; frame-1 = the real
gaping mouth + an impossible number. Facts: English Wikipedia "Sarcastic fringehead" (Oct 2026): male gape may be as much as four times its size
when closed; interior brightly coloured; typically 6–10 in; lives off North America from San Francisco to central Baja California; backs into
shells, burrows, crevices and man-made objects such as bottles and soda cans, exposing only its head; territorial scuffle = pressing distended
mouths against each other ("kissing") until one bites the other's head, which shows which fish is larger; the loser is displaced and must search
for a new shelter; most aggressive of the three US fringehead species; divers have noted these fish can damage their wetsuits."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 172, 'title': 'The fish with the giant mouth (sarcastic fringehead)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['ITS MOUTH OPENS', '4× BIGGER.'],
 'cta': {'q': 'Scary or adorable?', 'a': 'SCARY', 'b': 'ADORABLE'},
 'source': 'https://en.wikipedia.org/wiki/Sarcastic_fringehead',
 'vo_open': [{'at': 0.3, 'text': "This fish's mouth opens four times bigger.",
   'de': 'Das Maul dieses Fisches öffnet sich auf das Vierfache.', 'es': 'La boca de este pez se abre cuatro veces más grande.',
   'fr': "La bouche de ce poisson s'ouvre quatre fois plus grand."}],
 'scenes': [
  S(0, 'Meet the sarcastic fringehead, off the coast of California. It moves into shells, bottles, even soda cans.',
    'It lives in *bottles* and *soda cans.*',
    'Das ist der Sarkastische Fransenkopf, vor der Küste Kaliforniens. Er zieht in Muscheln, Flaschen, sogar Getränkedosen.',
    'Te presento al cabeza de fleco sarcástico, frente a la costa de California. Vive en conchas, botellas, hasta latas de refresco.',
    "Voici la blennie sarcastique, au large de la Californie. Elle s'installe dans des coquillages, des bouteilles, même des canettes."),
  S(1, 'Only six to ten inches long. But get close, and it flares a giant, brightly colored mouth.',
    'Get close, and it *flares its mouth.*',
    'Nur fünfzehn bis fünfundzwanzig Zentimeter lang. Aber komm ihm zu nah, und er reißt ein riesiges, knallbuntes Maul auf.',
    'Solo mide de quince a veinticinco centímetros. Pero acércate, y abre una boca enorme y de colores brillantes.',
    "Seulement quinze à vingt-cinq centimètres. Mais approche-toi, et elle déploie une bouche géante aux couleurs vives."),
  S(2, 'Two males fight by pressing their open mouths together, until one bites the other. The loser loses its home.',
    'They fight *mouth to mouth.*',
    'Zwei Männchen kämpfen, indem sie ihre offenen Mäuler aneinanderdrücken, bis einer zubeißt. Der Verlierer verliert sein Zuhause.',
    'Dos machos pelean apretando sus bocas abiertas, hasta que uno muerde al otro. El perdedor se queda sin casa.',
    "Deux mâles se battent en pressant leurs bouches ouvertes, jusqu'à ce que l'un morde l'autre. Le perdant perd sa maison."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="Divers say it can even damage their wetsuits.",
         cap="It can damage *divers' wetsuits.*",
         de='Taucher berichten, dass er sogar ihre Neoprenanzüge beschädigen kann.',
         es='Los buzos cuentan que hasta puede dañar sus trajes de neopreno.',
         fr="Les plongeurs racontent qu'elle peut même abîmer leurs combinaisons."),
    dict(at='0.15', text='Scary or adorable? Comment!', cta=True,
         de='Gruselig oder süß? Schreib es in die Kommentare!', es='¿Da miedo o es adorable? ¡Comenta!',
         fr='Effrayante ou adorable ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Horror Suspense.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'gape', 'file': 'File:Fringehead.jpg'},
  {'id': 'tube', 'file': 'File:Sarcastic fringehead in plastic tube.JPG'},
  {'id': 'hand', 'file': 'File:Neoclinus blanchardi 141837334.jpg'},
  {'id': 'face', 'file': 'File:Sarcastic Fringehead (Neoclinus blanchardi) at the Monterey Bay Aquarium.jpg'},
  {'id': 'rock', 'file': 'File:Sarcastic fringehead.jpg'},
 ],
}
open('episodes/172.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
