#!/usr/bin/env python3
"""#201 REEL v2 (E8) — HyperFrames pilot: why the Statue of Liberty is green. 27 Oct 2026. voice: gemini.
Rendered with HyperFrames (scripts/hf_build.py → hf/201/), NOT cine.html — the owner compares the look.
Facts: English Wikipedia "Statue of Liberty" (Oct 2026, catalog-73 articles.md)
- Design: copper sheets shaped by repoussé, "the copper need be only 0.094 inches (2.4 mm) thick" (→ less than a tenth of an inch).
- Construction: "When built, the statue was reddish-brown and shiny, but within twenty years it had oxidized to its current green
  color through reactions with air, water and acidic pollution, forming a layer of verdigris which protects the copper".
- Dedicated October 28, 1886.
- 1906: "Originally, it was a dull copper color, but shortly after 1900 a green patina, also called verdigris ... began to spread.
  As early as 1902 it was mentioned in the press; by 1906 it had entirely covered the statue. Believing that the patina was evidence
  of corrosion, Congress authorized US$62,800 ... for various repairs, and to paint the statue both inside and out. There was
  considerable public protest against the proposed exterior painting. The Army Corps of Engineers studied the patina ... and
  concluded that it protected the skin, 'softened the outlines of the Statue and made it beautiful.' The statue was painted only
  on the inside."
Hook (scripts/reel/hookscore.py): "Nobody tells you the Statue of Liberty was born brown." 84.4 STRONG (formula 3 Nobody Tells You).
"""
import json
E = {
 'ep': 201, 'title': 'Why the Statue of Liberty is green', 'format': 'reel2', 'hook_formula': '3 Nobody Tells You',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['SHE WAS', 'BORN BROWN'],
 'cta': {'q': 'Which Lady Liberty?', 'a': 'BROWN', 'b': 'GREEN'},
 'source': 'https://en.wikipedia.org/wiki/Statue_of_Liberty',
 'vo_open': [{'at': 0.15,
   'text': 'Nobody tells you the Statue of Liberty was born brown. Then she turned green, and Congress almost painted over it.',
   'cap': 'Nobody tells you the *Statue of Liberty* was born *brown.* Then she turned *green,* and *Congress* almost *painted over it.*',
   'de': 'Kaum einer weiß: Die Freiheitsstatue war am Anfang braun. Dann wurde sie grün, und der Kongress hätte sie fast übermalt.',
   'es': 'Nadie te cuenta que la Estatua de la Libertad nació marrón. Luego se volvió verde, y el Congreso estuvo a punto de pintarla.',
   'fr': "Personne ne te dit que la statue de la Liberté est née marron. Puis elle est devenue verte, et le Congrès a failli la repeindre."}],
 'scenes': [
  {'dur': 1.0, 'beat': 'copper', 'vo': [dict(at=0.2,
    text='Her skin is copper, less than a tenth of an inch thick.',
    cap='Her skin is *copper,* less than *a tenth of an inch* thick.',
    de='Ihre Haut ist aus Kupfer, nur zwei Komma vier Millimeter dick.',
    es='Su piel es de cobre, de solo dos coma cuatro milímetros de grosor.',
    fr='Sa peau est en cuivre, épaisse de seulement deux virgule quatre millimètres.')]},
  {'dur': 1.0, 'beat': 'patina', 'vo': [dict(at=0.2,
    text='Air, water and acid pollution turned it green. By nineteen oh six, the patina covered her completely.',
    cap='Air, water and *acid pollution* turned it *green.* By *1906,* the *patina* covered her *completely.*',
    de='Luft, Wasser und saure Abgase machten sie grün. Neunzehnhundertsechs war sie komplett von Patina bedeckt.',
    es='El aire, el agua y la contaminación ácida la volvieron verde. En mil novecientos seis, la pátina ya la cubría por completo.',
    fr="L'air, l'eau et la pollution acide l'ont rendue verte. En mille neuf cent six, la patine la couvrait entièrement.")]},
  {'dur': 1.0, 'beat': 'money', 'vo': [dict(at=0.2,
    text='Congress thought it was corrosion, and approved sixty-two thousand eight hundred dollars for repairs, and to paint her inside and out.',
    cap='Congress thought it was *corrosion,* and approved *$62,800* for repairs, and to *paint her* inside and out.',
    de='Der Kongress hielt das für Korrosion und bewilligte zweiundsechzigtausendachthundert Dollar für Reparaturen und einen Anstrich, innen und außen.',
    es='El Congreso creyó que era corrosión y aprobó sesenta y dos mil ochocientos dólares para reparaciones y para pintarla por dentro y por fuera.',
    fr='Le Congrès y a vu de la corrosion et a voté soixante-deux mille huit cents dollars pour des réparations et pour la peindre, dedans et dehors.')]},
  {'dur': 1.0, 'beat': 'verdict', 'vo': [dict(at=0.2,
    text='People protested. Army engineers found the green layer protects the copper.',
    cap='People *protested.* Army engineers found the *green layer protects* the copper.',
    de='Die Leute protestierten. Ingenieure der Armee fanden heraus: Die grüne Schicht schützt das Kupfer.',
    es='La gente protestó. Los ingenieros del Ejército descubrieron que la capa verde protege el cobre.',
    fr="Le public a protesté. Les ingénieurs de l'armée ont découvert que la couche verte protège le cuivre.")]},
  {'dur': 1.0, 'beat': 'armor', 'vo': [
    dict(at=0.2, text='So they only painted the inside. That green is her armor.',
      cap='So they only painted the *inside.* That green is her *armor.*',
      de='Also wurde nur innen gestrichen. Das Grün ist ihre Rüstung.',
      es='Así que solo pintaron el interior. Ese verde es su armadura.',
      fr="Alors on n'a peint que l'intérieur. Ce vert, c'est son armure."),
    dict(at=0.15, text='Brown or green: which Lady Liberty would you pick? Comment brown or green.', cta=True,
      cap='*Brown* or *green:* which Lady Liberty would you pick? Comment *brown* or *green.*',
      de='Braun oder grün: Welche Freiheitsstatue wäre dir lieber? Schreib braun oder grün.',
      es='Marrón o verde: ¿qué Estatua de la Libertad prefieres? Comenta marrón o verde.',
      fr='Marron ou verte : quelle statue de la Liberté tu préfères ? Commente marron ou vert.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3', 'from': 2, 'len': 50, 'gain': 0.5},
  {'id': 'front', 'file': 'File:Front view of Statue of Liberty (cropped).jpg'},
  {'id': 'torch', 'file': 'File:The Torch of the Statue of Liberty (352b4d9d-1dd8-b71b-0bee-0f4169b52f62).JPG'},
  {'id': 'head', 'file': 'File:Head of the Statue of Liberty on display in a park in Paris (cropped).jpg'},
  {'id': 'boat2', 'video': 'File:View of Statue of Liberty on a Boat.webm', 'from': 11, 'len': 5},
  {'id': 'drone', 'video': 'File:Statue Of Liberty 4k Drone.webm', 'from': 86, 'len': 7},
 ],
}
open('episodes/201.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
