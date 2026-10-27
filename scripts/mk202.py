#!/usr/bin/env python3
"""#202 REEL v2 (experiment E8) — the electric eel: 860 volts, and it isn't an eel. 27 Oct 2026. Voice: gemini.
Hook formula 23 "The Statistic" (hookscore 81.6 STRONG): "860 volts. Seven times your wall outlet, and it's not even an eel."
On screen "860 VOLTS / NOT EVEN AN EEL".
Facts: English Wikipedia "Electric eel" (Oct 2026):
- lead: "delivering shocks at up to 860 volts"; "not closely related to the true eels … members of the electroreceptive knifefish order".
- "obligate air-breathing"; "About every two minutes, the fish takes in air through the mouth".
- "an electric eel stacks some 6,000 electrocytes in series … in its main organ" (cells "like a battery … stacked").
- "In self-defence, electric eels have been observed to leap from the water to deliver electric shocks".
- "In 1800, the explorer Alexander von Humboldt joined a group of indigenous people who went fishing with horses … He saw two horses
  stunned by the shocks and then drowned."
English Wikipedia "Mains electricity": in the US the nominal voltage is 120 V (860 / 120 = 7.2 → "seven times").
Media: aquarium photos (CC BY / CC BY-SA), Humboldt engraving (public domain, ILLUSTRATION), ZDF Terra X clip (CC BY 4.0),
drawn graphics labelled GRAPHIC."""
import json

def SHOW(text, nums):
    """caption tokens: spoken number words -> digits ("~" merges a token into the previous one)"""
    tk = text.split(' '); out = list(tk); low = [t.lower() for t in tk]
    for ph, dg in nums.items():
        p = ph.lower().split(' ')
        for i in range(len(tk) - len(p) + 1):
            if [x.rstrip('.,?!:') for x in low[i:i + len(p)]] == p:
                last = tk[i + len(p) - 1]; tail = last[len(last.rstrip('.,?!:')):]
                out[i] = dg + tail; out[i + 1:i + len(p)] = ['~'] * (len(p) - 1)
    return ' '.join(out)
def fixshow(E, nums):
    for sg in E['vo_open'] + [v for s in E['scenes'] for v in s['vo']]:
        if sg.get('cta'): continue
        s = SHOW(sg['text'], nums)
        if s != sg['text']: sg['show'] = s
V = lambda text, cap, de, es, fr, at=0.45, **kw: {k: v for k, v in dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **kw).items() if v is not None}
E = {
 'ep': 202, 'title': 'The electric eel is not an eel', 'format': 'reel2', 'hook_formula': '23 The Statistic',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'gemini', 'wordCaps': True, 'mood': 'epic', 'prog': 0,
 'oneAsk': True, 'loop': True, 'capY': 1250, 'cardY': 1150, 'capSize': 76, 'capCX': 465, 'capW': 690,
 'scripts': ['tech.js', 'r2kit.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['860 VOLTS', 'NOT EVEN AN EEL'],
 'cta': {'q': 'Would you swim in its river?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Electric_eel',
 'vo_open': [V("Eight hundred sixty volts. Seven times your wall outlet, and it's not even an eel.",
   "*860 volts.* *Seven times* your wall outlet, and it's not even an eel.",
   'Achthundertsechzig Volt. Fast viermal so viel wie deine Steckdose, und es ist nicht mal ein Aal.',
   'Ochocientos sesenta voltios. Más que cualquier otro animal, y ni siquiera es una anguila.',
   "Huit cent soixante volts. Plus que n'importe quel autre animal, et ce n'est même pas une anguille.", at=0.2)],
 'scenes': [
  {'dur': 1.6, 'vis': 0, 'vo': [V("It's the electric eel, actually a knifefish. It even breathes air, about every two minutes.",
    "It's the *electric eel,* actually a *knifefish.* It even *breathes air,* about every *2 minutes.*",
    'Es ist der Zitteraal, eigentlich ein Messerfisch. Er atmet sogar Luft, etwa alle zwei Minuten.',
    'Es la anguila eléctrica, en realidad un pez cuchillo. Incluso respira aire, más o menos cada dos minutos.',
    "C'est l'anguille électrique, en fait un poisson-couteau. Elle respire même de l'air, environ toutes les deux minutes.")]},
  {'dur': 1.6, 'vis': 1, 'vo': [V("Its secret: about six thousand cells stacked in a row, like tiny batteries. That's how it builds the voltage.",
    "Its secret: about *6,000 cells* stacked in a row, like *tiny batteries.* That's how it builds the *voltage.*",
    'Sein Geheimnis: rund sechstausend Zellen in einer Reihe, wie winzige Batterien. So baut er die Spannung auf.',
    'Su secreto: unas seis mil células apiladas en fila, como pilas diminutas. Así acumula el voltaje.',
    "Son secret : environ six mille cellules empilées en rang, comme de minuscules piles. C'est comme ça qu'elle crée la tension.")]},
  {'dur': 1.6, 'vis': 2, 'vo': [V('When threatened, it leaps out of the water to shock. In eighteen hundred, Alexander von Humboldt watched eels attack horses. Two horses drowned.',
    'When threatened, it *leaps out of the water* to shock. In *1800,* Alexander von *Humboldt* watched eels *attack horses.* *Two horses drowned.*',
    'Wenn er sich bedroht fühlt, springt er aus dem Wasser und schockt. Im Jahr achtzehnhundert sah Alexander von Humboldt, wie Zitteraale Pferde angriffen. Zwei Pferde ertranken.',
    'Si se siente amenazada, salta fuera del agua para dar descargas. En mil ochocientos, Alexander von Humboldt vio a anguilas atacar caballos. Dos caballos se ahogaron.',
    "Menacée, elle bondit hors de l'eau pour électrocuter. En mille huit cent, Alexander von Humboldt a vu des anguilles attaquer des chevaux. Deux chevaux se sont noyés.")]},
  {'dur': 1.6, 'vis': 3, 'vo': [
    V('Would you swim in its river? Yes or no, comment below.', None,
      'Würdest du in seinem Fluss schwimmen? Ja oder nein, schreib es in die Kommentare.',
      '¿Nadarías en su río? Sí o no, coméntalo abajo.',
      "Tu nagerais dans sa rivière ? Oui ou non, dis-le en commentaire.", cta=True),
    V('Not with eight hundred sixty volts in the water.', 'Not with *860 volts* in the water.',
      'Nicht mit achthundertsechzig Volt im Wasser.',
      'No con ochocientos sesenta voltios en el agua.',
      "Pas avec huit cent soixante volts dans l'eau.", at='0.15')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Dramatic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 0.8},
  {'id': 'gdynia', 'file': 'File:Electrophorus electricus in Gdynia Oceanarium.jpg'},
  {'id': 'boston', 'file': 'File:Electric-eel.jpg'},
  {'id': 'pits', 'file': 'File:Electrophorus electricus showing lateral line pits.jpg'},
  {'id': 'cas', 'file': 'File:Electric eel CAS.jpg'},
  {'id': 'two', 'file': 'File:Eelectricus.jpg'},
  {'id': 'humboldt', 'file': 'File:Gymnoten-Humboldt battle with horses.jpg'},
  {'id': 'cstack', 'video': 'File:Zitteraal funktioniert wie eine Batterie.webm', 'from': 28.5, 'len': 5.5},
  {'id': 'cglow', 'video': 'File:Zitteraal funktioniert wie eine Batterie.webm', 'from': 97, 'len': 8},
  {'id': 'cstrike', 'video': 'File:Electric-eels-use-high-voltage-to-track-fast-moving-prey-ncomms9638-s8.ogv', 'from': 57, 'len': 9},
 ],
}
fixshow(E, {'eight hundred sixty': '860', 'six thousand': '6,000', 'eighteen hundred': '1800'})
open('episodes/202.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
