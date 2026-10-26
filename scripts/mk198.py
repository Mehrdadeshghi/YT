#!/usr/bin/env python3
"""#198 REEL v2 (experiment E8) — Golden Gate Bridge: why it is "International Orange". 25 Oct 2026. Voice: gemini.
Hook formula 23 "The Statistic" (hookscore 87.0 STRONG): "38 painters never stop painting your favorite bridge." / on screen "38 PAINTERS · NEVER STOP".
Facts: English Wikipedia "Golden Gate Bridge" + "International orange" (Oct 2026):
- GGB: "The famous International Orange color was Morrow's personal selection, winning out over other possibilities, including the US Navy's
  suggestion that it be painted with black and yellow stripes to ensure visibility by passing ships."
- GGB: the color "was selected by consulting architect Irving Morrow because it complements the natural surroundings and enhances the
  bridge's visibility in fog."
- GGB: "it is now maintained by 38 painters who touch up the paintwork where it becomes seriously corroded"; "The ongoing maintenance task
  of painting the bridge is continuous." Salt carried by fog or mist caused corrosion (deck section).
- International orange: the Golden Gate tone (hex F04A00) is "slightly lighter than the standard international orange used by military
  contractors and in engineering (hex BA160C), thus increasing its visibility to ships".
NOT used: the popular "they just kept the primer colour" story — Wikipedia only says the bridge was originally painted with red lead primer.
Media: Commons photos (CC0 / PD / CC BY / CC BY-SA), real footage (ship crossing, CC BY-SA 4.0), drawn graphics labelled GRAPHIC."""
import json
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 198, 'title': 'Why the Golden Gate Bridge is orange', 'format': 'reel2', 'hook_formula': '23 The Statistic',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'epic', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['38 PAINTERS', 'NEVER STOP'],
 'cta': {'q': 'Orange or stripes?', 'a': 'ORANGE', 'b': 'STRIPES'},
 'source': 'https://en.wikipedia.org/wiki/Golden_Gate_Bridge',
 'vo_open': [V('Thirty-eight painters never stop painting your favorite bridge.', '*38 painters* never stop painting your favorite bridge.',
   'Achtunddreißig Maler hören nie auf, deine Lieblingsbrücke zu streichen.',
   'Treinta y ocho pintores nunca dejan de pintar tu puente favorito.',
   "Trente-huit peintres ne cessent jamais de peindre ton pont préféré.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V("Salt spray and fog keep attacking the Golden Gate's steel.",
    "*Salt spray* and *fog* keep attacking the Golden Gate's *steel.*",
    'Salzgischt und Nebel greifen den Stahl der Golden Gate ständig an.',
    'La brisa salada y la niebla atacan sin parar el acero del Golden Gate.',
    "Les embruns salés et le brouillard attaquent sans cesse l'acier du Golden Gate.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V("And the color isn't red. It's International Orange.",
    "And the color *isn't red.* It's *International Orange.*",
    'Und die Farbe ist nicht Rot. Sie heißt International Orange.',
    'Y el color no es rojo. Es naranja internacional.',
    "Et la couleur n'est pas rouge. C'est l'orange international.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('The U.S. Navy wanted black and yellow stripes, so ships could see it.',
    'The *U.S. Navy* wanted *black and yellow stripes,* so ships could see it.',
    'Die US-Marine wollte schwarz-gelbe Streifen, damit Schiffe sie sehen.',
    'La Marina de Estados Unidos quería rayas negras y amarillas, para que los barcos lo vieran.',
    "La marine américaine voulait des rayures noires et jaunes, pour que les navires le voient.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [V('Architect Irving Morrow picked orange. It fits the hills, and it stands out in San Francisco fog.',
    'Architect *Irving Morrow* picked orange. It *fits the hills,* and it *stands out* in San Francisco fog.',
    'Architekt Irving Morrow wählte Orange. Es passt zu den Hügeln und sticht im Nebel von San Francisco heraus.',
    'El arquitecto Irving Morrow eligió el naranja. Combina con las colinas y destaca en la niebla de San Francisco.',
    "L'architecte Irving Morrow a choisi l'orange. Il s'accorde avec les collines et ressort dans le brouillard de San Francisco.")]},
  {'dur': 1.6, 'vis': 4, 'vo': [V("Its shade is even a bit lighter than standard, for ships. So that orange isn't decoration. It's there to be seen.",
    "Its shade is even *a bit lighter* than standard, for ships. So that orange *isn't decoration.* It's there *to be seen.*",
    'Der Farbton ist sogar etwas heller als der Standard, für die Schiffe. Dieses Orange ist also keine Deko. Es ist da, um gesehen zu werden.',
    'Su tono es incluso un poco más claro que el estándar, por los barcos. Así que ese naranja no es decoración. Está ahí para que lo vean.',
    "Sa teinte est même un peu plus claire que la norme, pour les navires. Cet orange n'est donc pas décoratif. Il est là pour être vu.")]},
  {'dur': 1.6, 'vis': 5, 'vo': [
    V('Orange or stripes: which would you pick? Comment below.', None,
      'Orange oder Streifen: Was hättest du gewählt? Schreib es in die Kommentare.',
      'Naranja o rayas: ¿cuál elegirías? Coméntalo abajo.',
      "Orange ou rayures : tu choisirais quoi ? Dis-le en commentaire.", cta=True),
    V('Either way, thirty-eight painters would be busy.', 'Either way, *38 painters* would be busy.',
      'So oder so hätten achtunddreißig Maler viel zu tun.',
      'De cualquier forma, treinta y ocho pintores tendrían trabajo.',
      "Dans tous les cas, trente-huit peintres auraient du travail.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'tower', 'file': 'File:Golden Gate Bridge tower views 01.jpg'},
  {'id': 'tower18', 'file': 'File:Golden Gate Bridge tower views 18.jpg'},
  {'id': 'battery', 'file': 'File:Golden Gate Bridge as seen from Battery East.jpg'},
  {'id': 'platform', 'file': 'File:Maintenance platform on the Golden Gate Bridge in San Francisco 134.jpg'},
  {'id': 'wheel', 'file': 'File:Maintenance wheel on the Golden Gate bridge in San Francisco 89.jpg'},
  {'id': 'maint89', 'file': 'File:San Francisco 1989 09.jpg'},
  {'id': 'navy', 'file': 'File:Fleet Week 141010-N-OP638-037.jpg'},
  {'id': 'hills', 'file': 'File:The Bridge (August 2013).jpg'},
  {'id': 'fogtower', 'file': 'File:Golden Gate Bridge tower in fog (July 2022).JPG'},
  {'id': 'fog2', 'file': 'File:Fog Golden Gate Bridge.jpg'},
  {'id': 'pillar', 'file': 'File:Golden Gate bridge pillar.jpg'},
  {'id': 'ship', 'video': 'File:Ship crossing the Golden Gate.webm', 'from': 4, 'len': 6},
  {'id': 'vista', 'file': 'File:Sausalito (CA, USA), Golden Gate Bridge Vista Point -- 2022 -- 3066.jpg'},
 ],
}
open('episodes/198.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
