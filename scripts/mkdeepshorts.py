#!/usr/bin/env python3
"""9:16 Shorts cut from the long video #139 (deep sea): each = a hook opener + 2–3 of its scenes (same narration, same media,
re-laid-out for the tall frame by cine/139.js) + a spoken comment question. Episodes #145–#151 load cine/139.js."""
import json, shutil

L = json.load(open('episodes/139.json'))
KEEP = ['photos', 'lazyClips', 'scripts', 'voice', 'voice_style', 'mood', 'langs']
SHORTS = [  # ep, scenes (indices in #139), hook lines (rich text), opener VO (en, de, es, fr), opener media, CTA (en, de, es, fr), card q/a/b, title
 (145, [21, 24, 25], ['Nobody had seen', 'this *before 2016*'],
  ("Nobody had ever seen this animal before 2016.", "Vor 2016 hatte niemand dieses Tier je gesehen.", "Nadie había visto este animal antes de 2016.", "Personne n'avait jamais vu cet animal avant 2016."),
  {'m': 'casper', 'label': 'Real footage · NOAA Okeanos Explorer · Hawaii, 2016'},
  ("Cute or creepy? Comment, and subscribe for more deep sea!", "Süß oder gruselig? Kommentier, und abonnier für mehr Tiefsee!", "¿Mono o escalofriante? Comenta y suscríbete para más mar profundo.", "Mignon ou flippant ? Commente, et abonne-toi pour plus d'abysses !"),
  ('Cute or creepy?', 'CUTE', 'CREEPY'), 'The ghost octopus nobody had seen before 2016'),
 (146, [7, 8], ['This fish has a', '*see-through head*'],
  ("This fish has a see-through head. And its eyes are inside it.", "Dieser Fisch hat einen durchsichtigen Kopf. Und seine Augen sitzen darin.", "Este pez tiene la cabeza transparente. Y sus ojos están dentro.", "Ce poisson a une tête transparente. Et ses yeux sont à l'intérieur."),
  {'m': 'barrel', 'focus': [0.45, 0.5], 'label': 'Real photo · barreleye (Macropinna microstoma)'},
  ("Would you believe this is real? Comment yes or no, and subscribe!", "Hättest du gedacht, dass es echt ist? Kommentier ja oder nein, und abonnier!", "¿Te creerías que es real? Comenta sí o no, y suscríbete.", "Tu aurais cru que c'est réel ? Commente oui ou non, et abonne-toi !"),
  ('Believe it is real?', 'YES', 'NO'), 'The fish with a see-through head'),
 (147, [13, 14, 15], ['The *vampire squid*', 'from hell'],
  ("Its scientific name means: vampire squid from hell.", "Sein wissenschaftlicher Name bedeutet: Vampirtintenfisch aus der Hölle.", "Su nombre científico significa: calamar vampiro del infierno.", "Son nom scientifique signifie : calmar vampire de l'enfer."),
  {'m': 'vamp', 'fit': 'contain', 'z0': 0.92, 'z1': 1.0, 'label': 'Illustration · Vampyroteuthis infernalis (Carl Chun, 1911)'},
  ("Scary or harmless? Comment, and subscribe for more deep sea!", "Gruselig oder harmlos? Kommentier, und abonnier für mehr Tiefsee!", "¿Aterrador o inofensivo? Comenta y suscríbete para más mar profundo.", "Effrayant ou inoffensif ? Commente, et abonne-toi pour plus d'abysses !"),
  ('Scary or harmless?', 'SCARY', 'HARMLESS'), 'The vampire squid from hell'),
 (148, [26, 27], ['Two shrimp,', 'locked in *glass*. Forever.'],
  ("Two shrimp, locked inside a house of glass... forever.", "Zwei Garnelen, eingesperrt in einem Haus aus Glas... für immer.", "Dos gambas, encerradas en una casa de cristal... para siempre.", "Deux crevettes, enfermées dans une maison de verre... pour toujours."),
  {'m': 'sponge', 'label': "Real photo · Venus' flower basket · NOAA, Gulf of Mexico"},
  ("Romantic or terrifying? Comment, and subscribe!", "Romantisch oder schrecklich? Kommentier, und abonnier!", "¿Romántico o aterrador? Comenta y suscríbete.", "Romantique ou terrifiant ? Commente, et abonne-toi !"),
  ('Romantic or terrifying?', 'ROMANTIC', 'TERRIFYING'), "Two shrimp locked in a glass house forever"),
 (149, [29, 30, 31], ['*1,000×* the pressure.', 'And yet: a fish.'],
  ("At the bottom of the ocean, the pressure is crushing. And yet, a fish lives there.", "Am Grund des Ozeans ist der Druck erdrückend. Und trotzdem lebt dort ein Fisch.", "En el fondo del océano, la presión es aplastante. Y aun así, allí vive un pez.", "Au fond de l'océan, la pression est écrasante. Et pourtant, un poisson y vit."),
  {'m': 'snail', 'crop': [0.07, 0.31, 0.99, 0.735], 'label': 'Real photo · hadal snailfish, Mariana Trench (Gerringer et al., 2017)'},
  ("Would you go down there? Comment yes or no, and subscribe!", "Würdest du da runter? Kommentier ja oder nein, und abonnier!", "¿Bajarías hasta allí? Comenta sí o no, y suscríbete.", "Tu descendrais là-bas ? Commente oui ou non, et abonne-toi !"),
  ('Would you go down there?', 'YES', 'NO'), 'The deepest fish ever filmed (8,336 m)'),
 (150, [9, 10], ['Longer than a *blue whale*', '... and not one animal'],
  ("It's longer than a blue whale. And it's not even one animal.", "Es ist länger als ein Blauwal. Und es ist nicht mal ein einzelnes Tier.", "Es más largo que una ballena azul. Y ni siquiera es un solo animal.", "C'est plus long qu'une baleine bleue. Et ce n'est même pas un seul animal."),
  {'m': 'praya', 'label': 'Real photo · giant siphonophore (Praya dubia)'},
  ("One animal or many? Comment, and subscribe for more deep sea!", "Ein Tier oder viele? Kommentier, und abonnier für mehr Tiefsee!", "¿Un animal o muchos? Comenta y suscríbete para más mar profundo.", "Un animal ou plusieurs ? Commente, et abonne-toi pour plus d'abysses !"),
  ('One animal or many?', 'ONE', 'MANY'), 'Longer than a blue whale, and not one animal'),
 (151, [18, 19], ['It can swallow prey', '*bigger than itself*'],
  ("This eel can swallow a fish bigger than itself.", "Dieser Aal kann einen Fisch verschlucken, der größer ist als er selbst.", "Esta anguila puede tragarse un pez más grande que ella.", "Cette anguille peut avaler un poisson plus gros qu'elle."),
  {'m': 'eel', 'fit': 'contain', 'z0': 0.98, 'z1': 1.08, 'label': 'Real photo · pelican eel specimen (Smithsonian)'},
  ("Nightmare fuel or genius design? Comment, and subscribe!", "Albtraum oder geniales Design? Kommentier, und abonnier!", "¿Pesadilla o diseño genial? Comenta y suscríbete.", "Cauchemar ou design génial ? Commente, et abonne-toi !"),
  ('Nightmare or genius?', 'NIGHTMARE', 'GENIUS'), 'The eel that swallows prey bigger than itself'),
]
for ep, idx, hook, op, ho, cta, card, title in SHORTS:
    sc = []
    for i in idx:
        s = json.loads(json.dumps(L['scenes'][i])); s['vis'] = i; s['dur'] = 1.6; sc.append(s)
    for s in sc:                                                          # years as words: the narrator must not swallow "2016" (heard as "2006")
        for v in s['vo']: v['text'] = v['text'].replace('In 2016,', 'In twenty sixteen,')
    sc[-1]['vo'].append({'at': '0.15', 'text': cta[0], 'cta': True, 'de': cta[1], 'es': cta[2], 'fr': cta[3]})
    first = L['scenes'][idx[0]]['depth']; prev = L['scenes'][idx[0] - 1]['depth'] if idx[0] else 0
    E = {k: L[k] for k in KEEP if k in L}
    E.update({'ep': ep, 'title': title, 'series': 'DEEP SEA', 'look': 'cine', 'style': 'pro', 'captions': True, 'wordCaps': True, 'noOutro': True,
              'tight': True, 'recap': False, 'tail': 0.2, 'transition': 'fade', 'sub': 2, 'speed': 1.1, 'capY': 1700, 'capSize': 54, 'subY': 1565, 'subEndY': 1565,
              'openMin': 1.6, 'photos_from': '139', 'depth_open': prev if prev else first, 'hook': hook, 'hookOpen': ho,
              'cta': {'q': card[0], 'a': card[1], 'b': card[2]}, 'source': L['source'], 'from_long': 139,
              'vo_open': [{'at': 0, 'text': op[0], 'de': op[1], 'es': op[2], 'fr': op[3]}], 'scenes': sc})
    json.dump(E, open(f'episodes/{ep}.json', 'w'), ensure_ascii=False, indent=1)
    E['scripts'] = [x for x in L['scripts'] if x != '139.js'] + ['139.js']; json.dump(E, open(f'episodes/{ep}.json', 'w'), ensure_ascii=False, indent=1)
    open(f'cine/{ep}.js', 'w').write(f'// #{ep}: 9:16 short cut from #139 — all visuals live in cine/139.js (loaded via ep.scripts)\n')
    print(ep, title, len(sc), 'scenes', sum(len(v['text'].split()) for s in sc for v in s['vo']) + len(op[0].split()), 'words')
