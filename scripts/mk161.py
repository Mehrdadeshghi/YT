#!/usr/bin/env python3
"""#161 DEEP SEA — blobfish, 20 Oct 2026. Ocean track; 25–28 s; frame-1 contradiction ("this is NOT what a blobfish looks like").
Facts: English Wikipedia (Oct 2026)
- "Mr Blobby (fish)": the famous blobfish (Psychrolutes microporos) was caught at 1013–1340 m (3,320–4,400 ft) in June 2003; its soft, swollen look
  is barotrauma (cells rupturing) from rapid decompression when brought to the surface; in its habitat it is a tadpole-shaped fish with a tapered tail;
  it won "ugliest animal in the world" in 2013 (Ugly Animal Preservation Society).
- "Psychrolutes marcidus": lives at 600–1,200 m (2,000–3,900 ft), pressure 60 to 120 times sea level; flesh is a gelatinous mass slightly less dense than
  water, so it floats above the sea floor without spending energy on swimming; eats edible matter that floats in front of it.
- "Blobfish" (disambiguation): Psychrolutes phrictus, the blob sculpin, is also commonly known as a blobfish (live photo at 1,317 m, NOAA/MBARI)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 161, 'title': 'This is NOT what a blobfish looks like', 'series': 'DEEP SEA',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THIS IS NOT', 'ITS REAL FACE.'],
 'cta': {'q': 'Still ugly?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Mr_Blobby_(fish)',
 'vo_open': [{'at': 0.3, 'text': 'This is not what a blobfish looks like.',
   'de': 'So sieht ein Blobfisch gar nicht aus.', 'es': 'Así no es como se ve un pez borrón.', 'fr': "Ce n'est pas à ça que ressemble un blobfish."}],
 'scenes': [
  S(0, 'In twenty thirteen, this face was voted the ugliest animal in the world.', 'Voted *ugliest animal* in the world.',
    'Zweitausenddreizehn wurde dieses Gesicht zum hässlichsten Tier der Welt gewählt.',
    'En dos mil trece, esta cara fue votada como el animal más feo del mundo.',
    'En deux mille treize, ce visage a été élu animal le plus laid du monde.'),
  S(1, 'But it was pulled up from over three thousand feet. The fast pressure drop ruptured its cells.',
    'Pulled up from *3,000+ ft.* The pressure drop *ruptured its cells.*',
    'Aber er wurde aus über tausend Metern Tiefe hochgezogen. Der schnelle Druckabfall ließ seine Zellen platzen.',
    'Pero lo subieron desde más de mil metros. La caída rápida de presión le reventó las células.',
    "Mais il a été remonté de plus de mille mètres. La chute de pression a fait éclater ses cellules."),
  S(2, 'Down there, the water presses up to a hundred and twenty times harder, and a blobfish looks like this.',
    'Up to *120×* the pressure. *This* is a blobfish.',
    'Da unten drückt das Wasser bis zu hundertzwanzigmal stärker, und ein Blobfisch sieht so aus.',
    'Allá abajo, el agua aprieta hasta ciento veinte veces más, y un pez borrón se ve así.',
    "Là-dessous, l'eau appuie jusqu'à cent vingt fois plus fort, et un blobfish ressemble à ça."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Its jelly body floats, so it hovers without swimming and lets food drift into its mouth.',
         cap='A *jelly body* that floats. Food *drifts in.*',
         de='Sein Körper aus Gallerte schwebt, also treibt er ohne zu schwimmen und lässt sich das Futter ins Maul treiben.',
         es='Su cuerpo gelatinoso flota, así que se queda quieto sin nadar y deja que la comida le llegue a la boca.',
         fr="Son corps gélatineux flotte : il plane sans nager et laisse la nourriture dériver jusqu'à sa bouche."),
    dict(at='0.15', text='Still ugly? Yes or no? Comment!', cta=True, de='Immer noch hässlich? Ja oder nein? Ab in die Kommentare!',
         es='¿Sigue siendo feo? ¿Sí o no? ¡Comenta!', fr='Toujours moche ? Oui ou non ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 50, 'len': 60, 'gain': 0.5},
  {'id': 'deck', 'file': 'File:Psyphrcomp.jpg'},
  {'id': 'live', 'file': 'File:Psychrolutes phrictus 1.jpg'},
 ],
}
open('episodes/161.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
