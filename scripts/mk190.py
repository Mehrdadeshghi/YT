#!/usr/bin/env python3
"""#190 WHY? — Why is the ocean salty (but rivers aren't)? 23 Oct 2026. WHY? series (template #186, cine/why.js).
Facts: English Wikipedia (Oct 2026, catalog-67 articles.md)
- "Seawater": average salinity about 3.5 % (35 g/L); Halley (1715): salt and other minerals were carried into the sea by rivers after
  rainfall washed it out of the ground; upon reaching the ocean these salts concentrated as more salt arrived over time. Chloride results
  from outgassing (as hydrochloric acid) from Earth's interior via volcanos and hydrothermal vents; sodium leached out of the ocean floor.
- "Salinity": seawater ~35 g/kg; rivers and lakes from less than 0.01 g/kg to a few g/kg (→ "tiny bits").
- "Water cycle": evaporation is powered by the sun; the evaporative phase separates water molecules from salts.
- "Great Salt Lake" (Utah): rivers deposit around 1.1 million tons of minerals a year; no outlet besides evaporation, so the minerals
  accumulate and give the lake high salinity, far saltier than seawater.
Not claimed: that the ocean is still getting saltier (Seawater: salinity stable for billions of years, sinks remove salt)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 190, 'title': 'Why is the ocean salty?', 'series': 'WHY? #5',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js', 'why.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'why': {'q': ['IS THE OCEAN', 'SALTY?'], 'next': 'YOUR NEXT WHY? COMMENT IT'},
 'hook': ['WHY IS THE', 'OCEAN SALTY?'],
 'cta': {'q': 'Did you know this?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Seawater',
 'vo_open': [{'at': 0.3, 'text': 'Rivers are fresh. The ocean is salty. Why?',
   'de': 'Flüsse sind süß. Das Meer ist salzig. Warum?', 'es': 'Los ríos son de agua dulce. El mar es salado. ¿Por qué?',
   'fr': "Les rivières sont douces. L'océan est salé. Pourquoi ?"}],
 'scenes': [
  S(0, 'Reason one: rain. It washes tiny bits of salt out of the ground, and rivers carry it to the sea.',
    'Reason one: *rain.* It washes *salt* out of the *ground.* Rivers carry it to the *sea.*',
    'Grund eins: Regen. Er wäscht winzige Mengen Salz aus dem Boden, und Flüsse tragen es ins Meer.',
    'Razón uno: la lluvia. Arrastra pequeñas cantidades de sal del suelo, y los ríos la llevan al mar.',
    'Raison numéro un : la pluie. Elle lessive de minuscules quantités de sel du sol, et les rivières les emportent vers la mer.'),
  S(1, 'Reason two: the sun. It turns the water into vapor, but the salt stays behind.',
    'Reason two: *the sun.* The *water* turns to *vapor.* The *salt* stays *behind.*',
    "Grund zwei: die Sonne. Sie verwandelt das Wasser in Dampf, aber das Salz bleibt zurück.",
    'Razón dos: el sol. Convierte el agua en vapor, pero la sal se queda.',
    "Raison numéro deux : le soleil. Il transforme l'eau en vapeur, mais le sel reste."),
  S(2, 'Great Salt Lake, in Utah: no river flows out, so its minerals pile up. It is far saltier than the ocean.',
    "*Great Salt Lake,* Utah: *no river* flows out. Minerals *pile up.* Far *saltier* than the *ocean.*",
    'Der Große Salzsee in Utah: Kein Fluss fließt hinaus, also sammeln sich die Mineralien an. Er ist viel salziger als das Meer.',
    'El Gran Lago Salado de Utah: ningún río sale de él, así que sus minerales se acumulan. Es mucho más salado que el océano.',
    "Le Grand Lac Salé, dans l'Utah : aucune rivière n'en sort, alors ses minéraux s'accumulent. Il est bien plus salé que l'océan."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Reason three: volcanoes. The chloride in sea salt came out of volcanoes and vents on the seafloor.',
         cap='Reason three: *volcanoes.* The *chloride* in sea salt came from *volcanoes* and *seafloor vents.*',
         de='Grund drei: Vulkane. Das Chlorid im Meersalz kam aus Vulkanen und heißen Quellen am Meeresboden.',
         es='Razón tres: los volcanes. El cloruro de la sal marina salió de volcanes y fuentes hidrotermales del fondo del mar.',
         fr='Raison numéro trois : les volcans. Le chlorure du sel marin est sorti des volcans et des sources hydrothermales du fond marin.'),
    dict(at='0.15', text='Did you know this? Yes or no. Tell us below, and send us your next why.', cta=True,
         de='Wusstest du das? Ja oder nein. Schreib es unten rein, und schick uns dein nächstes Warum.',
         es='¿Lo sabías? Sí o no. Dínoslo abajo, y mándanos tu próximo porqué.',
         fr='Tu le savais ? Oui ou non. Dis-le en commentaire, et envoie-nous ton prochain pourquoi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Carefree.ogg', 'from': 0, 'len': 60, 'gain': 0.5},
  {'id': 'river', 'file': 'File:Fast mountain river flowing through the conifer forest.jpg'},
  {'id': 'river2', 'file': 'File:Fortymile Wild and Scenic River, Alaska (36497858011).jpg'},
  {'id': 'ocean', 'file': 'File:Big wave breaking in Santa Cruz.jpg'},
  {'id': 'ocean2', 'file': 'File:Waves in pacifica 1.jpg'},
  {'id': 'oclip', 'video': 'File:Ocean surface waves.ogv', 'from': 2, 'len': 10},
  {'id': 'rainrocks', 'file': 'File:Jumbo Rocks campsite after heavy rain (46491397825).jpg'},
  {'id': 'runoff', 'file': 'File:Beverage Knob Rd after rain in Rock Cave, West Virginia, US, on 7 August 2023 (07).jpg'},
  {'id': 'mouth', 'file': 'File:The mouth of the Vistula River into the Baltic Sea.jpg'},
  {'id': 'mouth2', 'file': 'File:Endpoint of the Colorado River.jpg'},
  {'id': 'ponds', 'file': 'File:Salt ponds SF Bay (dro!d).jpg'},
  {'id': 'ponds2', 'file': 'File:Solar Evaporation Ponds, Atacama Desert.jpg'},
  {'id': 'gsl', 'file': 'File:Great Salt Lake (June 2008).jpg'},
  {'id': 'gsl2', 'file': 'File:Antelope Island State Park, Utah.jpg'},
  {'id': 'gslsat', 'file': 'File:Great Salt Lake by Sentinel-2.jpg'},
  {'id': 'crystals', 'file': 'File:Great Salt Lake crystals.jpg'},
  {'id': 'smoker', 'file': 'File:Blacksmoker in Atlantic Ocean.jpg'},
  {'id': 'smoker2', 'file': 'File:Brothers blacksmoker hires.jpg'},
  {'id': 'vclip', 'video': 'File:0501-hydrothermal-vents-640x360.webm', 'from': 8, 'len': 10},
 ],
}
open('episodes/190.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
