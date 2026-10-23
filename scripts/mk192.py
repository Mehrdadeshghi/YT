#!/usr/bin/env python3
"""#192 WHY? — Why is the sky blue? 24 Oct 2026. Template #186 (cine/why.js), voice: gemini.
Facts: English Wikipedia (Oct 2026)
- "Sky": on the Moon no atmospheric scattering occurs, making the lunar sky black even when the Sun is visible; scattering is
  stronger at the shorter (bluer) end of the visible spectrum.
- "Rayleigh scattering": scattering inversely proportional to the fourth power of the wavelength (blue scattered much more than
  red); this results in indirect blue and violet light coming from all regions of the sky; the human eye responds to this
  wavelength combination as if it were a combination of blue and white light. Three factors: sunlight's spectrum, scattering by
  oxygen and nitrogen molecules, the human visual system.
- "Diffuse sky radiation": Earth's atmosphere scatters short-wavelength light more efficiently; blue more strongly than red or green.
- "Color vision": spectrum about 380–740 nm; violet 380–450, blue 450–485, red 625–740 nm.
- "Sunset": at sunrise and sunset the path through the atmosphere is longer; blue and green components are removed almost
  completely, leaving the longer-wavelength orange and red hues."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 192, 'title': 'Why is the sky blue?', 'series': 'WHY? #7',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['IS THE SKY', 'BLUE?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY IS THE', 'SKY BLUE?'],
 'cta': {'q': 'Blue sky or sunset?', 'a': 'BLUE SKY', 'b': 'SUNSET'},
 'source': 'https://en.wikipedia.org/wiki/Rayleigh_scattering',
 'vo_open': [{'at': 0.3, 'text': "On the Moon, the sky is black, even at noon. Here, it's blue. Why?",
   'de': 'Auf dem Mond ist der Himmel schwarz, sogar mittags. Hier ist er blau. Warum?',
   'es': 'En la Luna, el cielo es negro, incluso a mediodía. Aquí es azul. ¿Por qué?',
   'fr': "Sur la Lune, le ciel est noir, même à midi. Ici, il est bleu. Pourquoi ?"}],
 'scenes': [
  S(0, 'Reason one: air. Sunlight holds every color, and air scatters blue far more than red. So blue comes at you from all over the sky.',
    'Reason one: *air.* Sunlight = *every color.* Air scatters *blue* far more than *red.*',
    'Grund eins: Luft. Sonnenlicht enthält alle Farben, und Luft streut Blau viel stärker als Rot. Darum kommt Blau von überall am Himmel.',
    'Razón uno: el aire. La luz del sol tiene todos los colores, y el aire dispersa el azul mucho más que el rojo. Por eso el azul te llega de todo el cielo.',
    "Raison numéro un : l'air. La lumière du soleil contient toutes les couleurs, et l'air diffuse le bleu bien plus que le rouge. Le bleu arrive donc de tout le ciel."),
  S(1, 'Reason two: your eyes. Violet scatters even more, but your eyes see the blue-violet mix as sky blue.',
    'Reason two: *your eyes.* *Violet* scatters even more. You see the mix as *sky blue.*',
    'Grund zwei: deine Augen. Violett wird sogar noch stärker gestreut, aber deine Augen sehen die Blau-Violett-Mischung als Himmelblau.',
    'Razón dos: tus ojos. El violeta se dispersa aún más, pero tus ojos ven esa mezcla de azul y violeta como azul cielo.',
    "Raison numéro deux : tes yeux. Le violet est encore plus diffusé, mais tes yeux voient ce mélange bleu-violet comme du bleu ciel."),
  {'dur': 1.6, 'vis': 2, 'vo': [
    dict(at=0.45, text='Reason three: at sunset, light crosses much more air. Blue and green get scattered out, and orange and red are left.',
         cap='Reason three: at *sunset,* light crosses *more air.* *Blue* is gone. *Orange* and *red* are left.',
         de='Grund drei: Beim Sonnenuntergang durchquert das Licht viel mehr Luft. Blau und Grün werden herausgestreut, und Orange und Rot bleiben übrig.',
         es='Razón tres: al atardecer, la luz atraviesa mucho más aire. El azul y el verde se dispersan, y quedan el naranja y el rojo.',
         fr="Raison numéro trois : au coucher du soleil, la lumière traverse beaucoup plus d'air. Le bleu et le vert sont diffusés, il reste l'orange et le rouge."),
    dict(at='0.15', text='Blue sky or sunset? Tell us below, and send us your next why.', cta=True,
         de='Blauer Himmel oder Sonnenuntergang? Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Cielo azul o atardecer? Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Ciel bleu ou coucher de soleil ? Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Carefree.ogg', 'from': 0, 'len': 60, 'gain': 0.35},
  {'id': 'blue', 'file': 'File:Clear blue sky (4-12-2026).jpg'},
  {'id': 'blue2', 'file': 'File:A clear blue sky with a white airplane contrail.jpg'},
  {'id': 'blue3', 'file': 'File:Above all, the clear blue sky - geograph.org.uk - 6484960.jpg'},
  {'id': 'moon', 'file': 'File:Aldrin Apollo 11 original.jpg'},
  {'id': 'iss', 'file': "File:ISS-51 Moon, Earth's limb and the thin blue atmosphere.jpg"},
  {'id': 'prism', 'file': 'File:Light splitting.jpg'},
  {'id': 'prism2', 'file': 'File:Dispersion of White Light Through a Prism.jpg'},
  {'id': 'sunset', 'file': 'File:Tappan Zee Bridge at Sunset.jpg'},
  {'id': 'sunset2', 'file': 'File:Sunset near Great Sand Dunes National Park.jpg'},
  {'id': 'sunset3', 'file': 'File:Full cycle of a Sunset on the high plains of the Mojave Desert.jpg'},
  {'id': 'fiery', 'file': 'File:Fiery South Atlantic Sunset.jpg'},
  {'id': 'sclip', 'video': 'File:Timelapse Joshua Tree Clouds and Sunset Near West Entrance.webm', 'from': 2, 'len': 12},
 ],
}
open('episodes/192.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
