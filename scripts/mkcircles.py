#!/usr/bin/env python3
"""Circles episode from the #152 template: python3 scripts/mkcircles.py <region> <ep> <n> <Name> <NextA> <NextB>
→ cine/<ep>_fou.js (scripts/fourier.py), episodes/<ep>.json, cine/<ep>.js. Translations of state names: NAMES below."""
import json, subprocess, sys
NAMES = {'Texas': ('Texas', 'Texas', 'le Texas'), 'Florida': ('Florida', 'Florida', 'la Floride'), 'California': ('Kalifornien', 'California', 'la Californie'),
         'Michigan': ('Michigan', 'Míchigan', 'le Michigan'), 'Alaska': ('Alaska', 'Alaska', "l'Alaska")}
region, ep, n, name, na, nb = sys.argv[1:7]
subprocess.run([sys.executable, 'scripts/fourier.py', region, ep], check=True)
de, es, fr = NAMES[name]; A, B = NAMES[na], NAMES[nb]
E = json.load(open('episodes/152.json'))
E.update(ep=int(ep), title=f'How many circles does it take to draw {name}?', series=f'CIRCLES #{n}', scripts=[f'{ep}_fou.js', 'circles.js'],
         cta={'q': 'Which state next?', 'a': na.upper(), 'b': nb.upper()})
E['vo_open'] = [{'at': 0.3, 'text': f'{name}. How many spinning circles does it take to draw it?',      # 0.3 s: the name must not sit under the opening swish
                 'de': f'{de}. Wie viele sich drehende Kreise braucht man, um es zu zeichnen?',
                 'es': f'{es}. ¿Cuántos círculos giratorios hacen falta para dibujarlo?',
                 'fr': f'{fr[0].upper() + fr[1:]}. Combien de cercles qui tournent faut-il pour la dessiner ?' if fr.startswith('la') else f'{fr[0].upper() + fr[1:]}. Combien de cercles qui tournent faut-il pour le dessiner ?'}]
E['scenes'][0]['vo'] = [{'at': 30.2, 'text': f'{na} or {nb} next? Comment below, and subscribe!', 'cta': True,
                         'de': f'Als Nächstes {A[0]} oder {B[0]}? Schreib es in die Kommentare und abonnier!',
                         'es': f'¿{A[1]} o {B[1]}? Escríbelo en los comentarios y suscríbete.',
                         'fr': f'{A[2][0].upper() + A[2][1:]} ou {B[2]} ensuite ? Dis-le en commentaire, et abonne-toi !'}]
open(f'episodes/{ep}.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
open(f'cine/{ep}.js', 'w').write(f'// CIRCLES #{n} ({name}): all visuals live in cine/circles.js (data: cine/{ep}_fou.js from scripts/fourier.py {region} {ep}).\n')
