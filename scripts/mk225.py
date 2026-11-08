#!/usr/bin/env python3
"""#225 How an airbag works. Picture: real sky + landscape panorama, real asphalt, modelled car and cockpit (scripts/hf225w/), workflow offline-render.yml.
Source: en.wikipedia.org/wiki/Airbag (crash sensors, typically MEMS accelerometers, feed an airbag control unit; deployment typically decided 15 to 30 ms after crash onset; an igniter starts a gas generator, the burning propellant makes inert gas that inflates the bag in about 20 to 30 ms; modern bags use guanidine nitrate, which makes nitrogen; the whole process takes about 0.04 seconds; deflation begins immediately through vents in the fabric; the dust is cornstarch, french chalk or talcum powder that lubricates the bag; US rules: deploy in crashes at least equivalent to a 14 mph barrier collision; a rear-facing infant seat in front puts the head close to the airbag: severe injuries or death).
Safety message stays as in the source; no crash with people shown.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 225, 'title': 'How an airbag works', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['0.04 SECONDS', 'TO SAVE YOU'], 'cta': {'q': 'Knew it was this fast?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Airbag',
 'vo_open': [seg("In a crash, your airbag has about four hundredths of a second to do its job. Here's what happens in that time.", "In a crash, your airbag has about *four hundredths* of a second to do its job. Here's what happens in that *time.*",
    'Bei einem Unfall hat dein Airbag etwa vier Hundertstelsekunden für seinen Job. Das passiert in dieser Zeit.', 'En un choque, tu airbag tiene unas cuatro centésimas de segundo para hacer su trabajo. Esto es lo que pasa en ese tiempo.', 'Lors d’un choc, ton airbag a environ quatre centièmes de seconde pour faire son travail. Voici ce qui se passe pendant ce temps.')],
 'scenes': [
  {'dur': 1.0, 'beat': 'sense', 'vo': [seg("The car hits something. Tiny acceleration sensors feel the sudden stop, and a control unit decides, in fifteen to thirty milliseconds: fire, or don't.",
    "The car *hits* something. Tiny acceleration *sensors* feel the sudden *stop,* and a *control unit* decides, in *15 to 30 milliseconds:* fire, or don't.",
    'Das Auto prallt auf. Winzige Beschleunigungssensoren spüren den plötzlichen Stopp, und ein Steuergerät entscheidet in fünfzehn bis dreißig Millisekunden: zünden oder nicht.',
    'El coche choca. Unos diminutos sensores de aceleración notan el frenazo, y una unidad de control decide, en quince a treinta milisegundos: disparar o no.',
    'La voiture percute. De minuscules capteurs d’accélération sentent l’arrêt brutal, et un calculateur décide, en quinze à trente millisecondes : déclencher ou pas.')]},
  {'dur': 1.0, 'beat': 'fire', 'vo': [seg("If it fires, an igniter sets off a small charge inside the steering wheel. It burns and makes nitrogen gas, and the bag fills in about twenty to thirty milliseconds.",
    "If it *fires,* an *igniter* sets off a small charge inside the steering wheel. It burns and makes *nitrogen* gas, and the bag *fills* in about *20 to 30 milliseconds.*",
    'Wenn es zündet, löst ein Zünder eine kleine Ladung im Lenkrad aus. Sie verbrennt zu Stickstoff, und der Sack füllt sich in etwa zwanzig bis dreißig Millisekunden.',
    'Si dispara, un iniciador enciende una pequeña carga dentro del volante. Arde y produce nitrógeno, y la bolsa se llena en unos veinte a treinta milisegundos.',
    'S’il se déclenche, un allumeur met à feu une petite charge dans le volant. Elle brûle et produit de l’azote, et le sac se remplit en vingt à trente millisecondes.')]},
  {'dur': 1.0, 'beat': 'vent', 'vo': [seg("But a rock-hard balloon would hurt. So the gas is already escaping through vents, and the bag softens as you sink into it.",
    "But a *rock-hard* balloon would hurt. So the gas is already escaping through *vents,* and the bag *softens* as you sink into it.",
    'Aber ein steinharter Ballon würde verletzen. Deshalb entweicht das Gas schon durch Öffnungen, und der Sack wird weich, während du hineinsinkst.',
    'Pero un globo duro como una piedra haría daño. Así que el gas ya sale por unas rejillas, y la bolsa se ablanda mientras te hundes en ella.',
    'Mais un ballon dur comme la pierre ferait mal. Alors le gaz s’échappe déjà par des évents, et le sac se ramollit quand tu t’y enfonces.')]},
  {'dur': 1.0, 'beat': 'dust', 'vo': [seg("And that white dust? Powder like cornstarch or talc, so the bag can unfold smoothly.",
    "And that white *dust?* Powder like *cornstarch* or *talc,* so the bag can *unfold* smoothly.",
    'Und der weiße Staub? Puder wie Maisstärke oder Talk, damit sich der Sack glatt entfalten kann.', '¿Y ese polvo blanco? Polvo como maicena o talco, para que la bolsa se despliegue suavemente.', 'Et cette poussière blanche ? De la poudre comme de l’amidon de maïs ou du talc, pour que le sac se déplie en douceur.')]},
  {'dur': 1.0, 'beat': 'rule', 'vo': [seg("In the U S, front airbags must fire in a crash like hitting a wall at fourteen miles an hour. And never put a rear-facing child seat in front of one.",
    "In the U.S., front airbags must fire in a crash like hitting a *wall* at *14 miles an hour.* And *never* put a rear-facing *child seat* in front of one.",
    'In den USA müssen Front-Airbags bei einem Aufprall zünden, der einem Wandaufprall mit zweiundzwanzig Kilometern pro Stunde entspricht. Und setz nie einen rückwärtsgerichteten Kindersitz vor einen Airbag.',
    'En Estados Unidos, los airbags frontales deben dispararse en un choque como contra un muro a veintidós kilómetros por hora. Y nunca pongas una silla infantil a contramarcha delante de uno.',
    'Aux États-Unis, les airbags frontaux doivent se déclencher dans un choc comme contre un mur à vingt-deux kilomètres-heure. Et ne mets jamais un siège enfant dos à la route devant un airbag.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Did you know it was this fast? Comment yes or no, and subscribe.", "Did you know it was this *fast?* Comment *yes* or *no,* and *subscribe.*",
    'Wusstest du, dass er so schnell ist? Schreib Ja oder Nein, und abonniere.', '¿Sabías que era tan rápido? Comenta sí o no, y suscríbete.', 'Tu savais que c’était aussi rapide ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': .6}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf225'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/225.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
