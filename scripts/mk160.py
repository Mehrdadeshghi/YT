#!/usr/bin/env python3
"""#160 OCEAN — mantis shrimp, 20 Oct 2026. Ocean track; 25–29 s; frame-1 contradiction ("one punch, two hits").
Facts: English Wikipedia "Mantis shrimp" (Oct 2026): Odontodactylus scyllarus strikes at 23 m/s (51 mph) from a standing start;
the strike creates vapor-filled cavitation bubbles between club and target; their collapse hits the prey a second time;
even if the strike misses, the shock wave can stun or kill; the collapsing bubbles produce light (sonoluminescence);
some species keep 16 distinct photoreceptor types vs the 4 types of photoreceptor cell humans have."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 160, 'title': 'One punch, two hits (mantis shrimp)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'epic', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['ONE PUNCH.', 'TWO HITS.'],
 'cta': {'q': 'Keep one in your fish tank?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Mantis_shrimp',
 'vo_open': [{'at': 0.3, 'text': 'This shrimp punches so fast, every punch hits twice.',
   'de': 'Diese Garnele schlägt so schnell zu, dass jeder Schlag zweimal trifft.', 'es': 'Este camarón golpea tan rápido que cada golpe pega dos veces.',
   'fr': 'Cette crevette frappe si vite que chaque coup touche deux fois.'}],
 'scenes': [
  S(0, 'Its club shoots out at fifty-one miles an hour, from a standing start.', 'Its club: *51 mph* from a *standing start.*',
    'Ihre Keule schießt mit dreiundachtzig Kilometern pro Stunde nach vorn, aus dem Stand.',
    'Su maza sale disparada a ochenta y tres kilómetros por hora, desde parado.',
    "Sa massue part à quatre-vingt-trois kilomètres à l'heure, à partir de l'arrêt."),
  S(1, 'So fast, it creates vapor bubbles in the water. When they collapse, they hit the prey a second time.',
    'Vapor bubbles *collapse* and hit it *a second time.*',
    'So schnell, dass im Wasser Dampfblasen entstehen. Wenn sie zusammenfallen, treffen sie die Beute ein zweites Mal.',
    'Tan rápido que crea burbujas de vapor en el agua. Al colapsar, golpean a la presa por segunda vez.',
    "Si vite qu'elle crée des bulles de vapeur dans l'eau. En éclatant, elles frappent la proie une deuxième fois."),
  S(2, 'Even a miss can stun or kill, thanks to the shock wave. And the bubbles flash with light.',
    'A *miss* can still *stun or kill.*',
    'Selbst wenn sie danebenschlägt, kann die Schockwelle betäuben oder töten. Und die Blasen blitzen sogar auf.',
    'Aunque falle, la onda de choque puede aturdir o matar. Y las burbujas hasta destellan.',
    "Même si elle rate, l'onde de choc peut assommer ou tuer. Et les bulles émettent même de la lumière."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='And its eyes have up to sixteen types of light receptors. You have four.',
         cap='Up to *16* light receptor types. You: *4.*',
         de='Und ihre Augen haben bis zu sechzehn Arten von Lichtrezeptoren. Du hast vier.',
         es='Y sus ojos tienen hasta dieciséis tipos de receptores de luz. Tú tienes cuatro.',
         fr="Et ses yeux ont jusqu'à seize types de récepteurs de lumière. Toi, tu en as quatre."),
    dict(at='0.15', text='Keep one in your fish tank? Yes or no?', cta=True,
         de='Würdest du eine im Aquarium halten? Ja oder nein?', es='¿Tendrías uno en tu acuario? ¿Sí o no?', fr="Tu en mettrais une dans ton aquarium ? Oui ou non ?")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Dramatic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'swim', 'video': 'File:Peacock mantis shrimp (Odontodactylus scyllarus).webm', 'from': 0, 'len': 11},
  {'id': 'club', 'file': 'File:Camarón mantis (Odontodactylus scyllarus), Anilao, Filipinas, 2023-08-24, DD 167.jpg'},
  {'id': 'eyes2', 'file': 'File:Odontodactylus scyllarus eyes.jpg'},
 ],
}
open('episodes/160.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
