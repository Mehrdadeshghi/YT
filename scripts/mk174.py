#!/usr/bin/env python3
"""9:16 Shorts cut from the long video #169 (Titanic): #174 the fall, #175 plans to raise her, #176 the bacteria eating her.
Fresh short narration (facts: en.wikipedia "Wreck of the Titanic", "Sinking of the Titanic", "Halomonas titanicae", "Rusticle"),
visuals = the scenes of cine/169.js (tall layout) + a hook opener over a real photo. Media via photos_from "169"."""
import json

L = json.load(open('episodes/169.json'))
KEEP = ['photos', 'lazyClips', 'voice', 'voice_style', 'mood', 'langs']
FULL = 'https://youtube.com/watch?v=siwRGT_xaKo'


def sc(vis, depth, en, de, es, fr, cap=None):
    v = {'at': 0.45, 'text': en, 'de': de, 'es': es, 'fr': fr}
    if cap: v['cap'] = cap
    return {'dur': 1.6, 'depth': depth, 'vis': vis, 'vo': [v]}


SHORTS = {
 174: dict(title='How the Titanic hit the bottom', hook=['It hit the seabed', 'at *23 mph*'], depth_open=12500,
   hookOpen={'m': 'bow', 'focus': [0.5, 0.5], 'label': 'Real photo · the bow of the Titanic, 2004 · NOAA / IFE / URI'},
   open=("The Titanic hit the seabed at twenty-three miles per hour.", "Die Titanic schlug mit siebenunddreißig Kilometern pro Stunde auf dem Meeresgrund auf.",
         "El Titanic chocó contra el fondo a treinta y siete kilómetros por hora.", "Le Titanic a heurté le fond à trente-sept kilomètres à l'heure."),
   scenes=[
    sc('impact', 12500, "Bow first: twenty-three miles per hour, sixty feet deep into the mud.",
       "Zuerst der Bug: siebenunddreißig Kilometer pro Stunde, zwanzig Meter tief in den Schlamm.",
       "Primero la proa: treinta y siete kilómetros por hora, veinte metros dentro del lodo.",
       "D'abord la proue : trente-sept kilomètres à l'heure, vingt mètres dans la boue.", '*60 ft* into the mud.'),
    sc('stern', 5000, "But the stern had it worse. Air was still trapped inside. Under the pressure, those pockets imploded and tore the hull apart.",
       "Doch das Heck traf es härter. Darin war noch Luft. Unter dem Druck implodierten diese Taschen und rissen den Rumpf auf.",
       "Pero la popa lo pasó peor. Aún tenía aire dentro. Con la presión, esas bolsas implosionaron y destrozaron el casco.",
       "Mais la poupe a souffert davantage. De l'air y était piégé. Sous la pression, ces poches ont implosé et déchiré la coque.", 'Air pockets *imploded.*'),
    sc('explode', 6500, "Survivors in the lifeboats heard explosions, about ten seconds after the stern went under.",
       "Überlebende in den Rettungsbooten hörten Explosionen, etwa zehn Sekunden nachdem das Heck versank.",
       "Los supervivientes en los botes oyeron explosiones, unos diez segundos después de hundirse la popa.",
       "Les survivants dans les canots ont entendu des explosions, environ dix secondes après que la poupe a coulé.", '*Explosions.*'),
    sc('pancake', 12500, "Then it landed so hard, its decks collapsed on top of each other.",
       "Dann schlug es so hart auf, dass die Decks aufeinander zusammenbrachen.",
       "Luego cayó con tanta fuerza que sus cubiertas se aplastaron unas sobre otras.",
       "Puis elle a touché le fond si fort que ses ponts se sont écrasés les uns sur les autres.", 'Decks *collapsed.*'),
   ],
   cta=("Did you know it broke in two? Yes or no? Comment!", "Wusstest du, dass sie zerbrach? Ja oder nein? Kommentier!",
        "¿Sabías que se partió en dos? ¿Sí o no? ¡Comenta!", "Tu savais qu'il s'était brisé en deux ? Oui ou non ? Commente !"),
   card=('Knew it broke in two?', 'YES', 'NO')),
 175: dict(title='The craziest plans to raise the Titanic', hook=['Raise the Titanic', 'with *ping-pong balls?*'], depth_open=12500,
   hookOpen={'m': 'bow', 'focus': [0.5, 0.5], 'label': 'Real photo · the bow of the Titanic, 2004 · NOAA / IFE / URI'},
   open=("Someone wanted to raise the Titanic with ping-pong balls.", "Jemand wollte die Titanic mit Tischtennisbällen heben.",
         "Alguien quiso reflotar el Titanic con pelotas de ping-pong.", "Quelqu'un voulait renflouer le Titanic avec des balles de ping-pong."),
   scenes=[
    sc('pingpong', 12500, "Fill the wreck with them, and let it float up. Except the balls would be crushed long before they got there.",
       "Das Wrack damit füllen und aufschwimmen lassen. Nur wären die Bälle zerquetscht worden, lange bevor sie unten ankamen.",
       "Llenar el pecio con ellas y dejar que flote. Pero las pelotas quedarían aplastadas mucho antes de llegar.",
       "Remplir l'épave et la laisser remonter. Sauf que les balles auraient été écrasées bien avant d'arriver.", 'The balls get *crushed.*'),
    sc('psi', 12500, "Down there, the pressure is over six thousand pounds per square inch.",
       "Dort unten liegt der Druck bei über vierhundert Bar.",
       "Allí abajo, la presión supera los cuatrocientos bares.",
       "Là-dessous, la pression dépasse les quatre cents bars.", '*6,000 psi.*'),
    sc('nitrogen', 12500, "Another plan: freeze it inside an iceberg, with half a million tons of liquid nitrogen, so it would float.",
       "Ein anderer Plan: sie in einen Eisberg einfrieren, mit einer halben Million Tonnen flüssigem Stickstoff, damit sie aufschwimmt.",
       "Otro plan: congelarlo dentro de un iceberg, con medio millón de toneladas de nitrógeno líquido, para que flotara.",
       "Autre projet : le congeler dans un iceberg, avec un demi-million de tonnes d'azote liquide, pour qu'il flotte.", 'Freeze it in an *iceberg.*'),
    sc('cta', 12500, "None of them ever worked. She is still down there.",
       "Keiner davon hat je funktioniert. Sie liegt immer noch da unten.",
       "Ninguno funcionó jamás. Sigue ahí abajo.",
       "Aucun n'a jamais abouti. Elle est toujours là-dessous.", 'Still *down there.*'),
   ],
   cta=("Craziest plan? Ping-pong or iceberg? Comment!", "Verrücktester Plan? Tischtennis oder Eisberg? Kommentier!",
        "¿El plan más loco? ¿Ping-pong o iceberg? ¡Comenta!", "Le plan le plus fou ? Ping-pong ou iceberg ? Commente !"),
   card=('Craziest plan?', 'PING-PONG', 'ICEBERG')),
 176: dict(title='Something is eating the Titanic', hook=['Something is', '*eating* the Titanic'], depth_open=12500,
   hookOpen={'m': 'rust', 'focus': [0.5, 0.5], 'label': 'Real photo · rusticles on the Titanic, 2003 · NOAA'},
   open=("Something is eating the Titanic. Right now.", "Etwas frisst die Titanic auf. Genau jetzt.",
         "Algo se está comiendo el Titanic. Ahora mismo.", "Quelque chose dévore le Titanic. En ce moment."),
   scenes=[
    sc('bacteria', 12500, "Bacteria. They feed on the iron of the hull, and leave rust behind.",
       "Bakterien. Sie fressen das Eisen des Rumpfs und hinterlassen Rost.",
       "Bacterias. Se alimentan del hierro del casco y dejan óxido.",
       "Des bactéries. Elles se nourrissent du fer de la coque et laissent de la rouille.", 'They eat the *iron.*'),
    sc('rusticles', 12500, "That rust hangs down like icicles. Ballard called them rusticles. Touch one, and it falls apart.",
       "Der Rost hängt herab wie Eiszapfen. Ballard nannte sie Rostzapfen. Berührt man einen, zerfällt er.",
       "Ese óxido cuelga como carámbanos. Ballard los llamó rustículos. Si tocas uno, se deshace.",
       "Cette rouille pend comme des stalactites. Ballard les a appelées rusticles. Touchez-en une, elle se désagrège.", '*Rusticles.*'),
    sc('lbs', 12500, "Estimates say they eat about four hundred pounds of the hull, every single day.",
       "Schätzungen zufolge fressen sie jeden Tag rund hundertachtzig Kilo des Rumpfs.",
       "Se calcula que se comen unos ciento ochenta kilos del casco cada día.",
       "On estime qu'elles dévorent environ cent quatre-vingts kilos de coque, chaque jour.", '*400 lb* a day.'),
    sc('halomonas', 12500, "One species was even named after the ship. Its discoverer says the wreck could collapse as soon as twenty thirty.",
       "Eine Art wurde sogar nach dem Schiff benannt. Ihre Entdeckerin sagt, das Wrack könnte schon zweitausenddreißig zusammenbrechen.",
       "Una especie incluso lleva el nombre del barco. Su descubridora dice que el pecio podría colapsar ya en dos mil treinta.",
       "Une espèce porte même le nom du navire. Sa découvreuse pense que l'épave pourrait s'effondrer dès deux mille trente.", 'Collapse by *2030?*'),
   ],
   cta=("Save it, or let it go? Comment!", "Retten oder loslassen? Kommentier!", "¿Salvarlo o dejarlo ir? ¡Comenta!", "Le sauver ou le laisser partir ? Commente !"),
   card=('Save the Titanic?', 'SAVE IT', 'LET IT GO')),
}

for ep, S in SHORTS.items():
    scenes = json.loads(json.dumps(S['scenes']))
    c = S['cta']; scenes[-1]['vo'].append({'at': '0.15', 'text': c[0], 'cta': True, 'de': c[1], 'es': c[2], 'fr': c[3]})
    E = {k: L[k] for k in KEEP if k in L}
    o = S['open']
    E.update({'ep': ep, 'title': S['title'], 'series': 'TITANIC', 'look': 'cine', 'style': 'pro', 'captions': True, 'wordCaps': True, 'noOutro': True,
              'tight': True, 'recap': False, 'tail': 0.2, 'transition': 'fade', 'sub': 2, 'speed': 1.1, 'capY': 1700, 'capSize': 54, 'subY': 1565, 'subEndY': 1565,
              'openMin': 1.6, 'photos_from': '169', 'depth_open': S['depth_open'], 'hook': S['hook'], 'hookOpen': S['hookOpen'],
              'cta': {'q': S['card'][0], 'a': S['card'][1], 'b': S['card'][2]}, 'source': 'https://en.wikipedia.org/wiki/Wreck_of_the_Titanic', 'from_long': 169,
              'scripts': [x for x in L['scripts'] if x != '169.js'] + ['169.js'],
              'vo_open': [{'at': 0.3, 'text': o[0], 'de': o[1], 'es': o[2], 'fr': o[3]}], 'scenes': scenes})
    json.dump(E, open(f'episodes/{ep}.json', 'w'), ensure_ascii=False, indent=1)
    open(f'cine/{ep}.js', 'w').write(f'// #{ep}: 9:16 short cut from #169 (Titanic) — all visuals live in cine/169.js (loaded via ep.scripts)\n')
    print(ep, S['title'], sum(len(v['text'].split()) for s in scenes for v in s['vo']) + len(o[0].split()), 'words')
