#!/usr/bin/env python3
"""#163 HOW IT WORKS #12 — why your phone dies in the cold (and comes back when warm).
Facts:
- Apple, "iPhone Battery and Performance" (support.apple.com/en-us/101575): impedance temporarily increases at a low state of charge
  and in cold temperatures; under load the voltage then drops further; when the power system can no longer support it,
  the system shuts down to preserve the electronic components (unexpected shutdowns more likely in colder temperatures).
- Apple, "Maximizing performance" (apple.com/batteries/maximizing-performance): in a very cold environment battery life
  decreases, "but this condition is temporary"; ideal comfort zone 62–72 °F (16–22 °C).
- Apple, "If your iPhone or iPad gets too hot or too cold" (support.apple.com/en-us/118431): designed for use at 32–95 °F (0–35 °C).
- English Wikipedia, "Lithium-ion battery": at lower temperatures the internal resistance may increase; rising internal resistance
  makes the terminal voltage drop under load; many types of Li-ion cells cannot be charged safely below 0 °C (32 °F) because
  lithium plates on the anode, which can cause internal short-circuit paths.
Media: "S60 in Snow" by Prosthetic Head, CC BY-SA 4.0 (Wikimedia Commons). Everything else is drawn (labelled GRAPHIC)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 163, 'title': 'Why your phone dies in the cold', 'series': 'HOW IT WORKS #12',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.3, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'voice_style': 'explainer', 'wordCaps': True, 'mood': 'epic', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['40 %.', 'THEN IT', 'DIED.'],
 'cta': {'q': 'Ever died on you in the cold?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://support.apple.com/en-us/101575',
 'vo_open': [{'at': 0, 'text': 'Your phone said forty percent. Then it died.',
   'de': 'Dein Handy zeigte vierzig Prozent. Dann war es aus.',
   'es': 'Tu móvil decía cuarenta por ciento. Y se apagó.',
   'fr': "Ton téléphone affichait quarante pour cent. Puis il s'est éteint."}],
 'scenes': [
  S(0, "It's not broken. It's the cold. In the cold, the battery's resistance goes up.",
    'Cold = *resistance* goes up.',
    'Es ist nicht kaputt. Es ist die Kälte. In der Kälte steigt der Widerstand im Akku.',
    'No está roto. Es el frío. Con frío, la resistencia de la batería sube.',
    "Il n'est pas cassé. C'est le froid. Dans le froid, la résistance de la batterie augmente."),
  S(1, 'Open an app, the voltage drops too far, and the phone shuts down to protect itself.',
    'Voltage drops → *shutdown.*',
    'Öffnest du eine App, fällt die Spannung zu tief, und das Handy schaltet sich zum Schutz ab.',
    'Abres una app, el voltaje cae demasiado y el móvil se apaga para protegerse.',
    "Tu ouvres une appli, la tension chute trop, et le téléphone s'éteint pour se protéger."),
  S(2, "Good news: it's temporary. Warm it up, and the battery comes back.",
    "It's *temporary.* Warm it up.",
    'Die gute Nachricht: Das ist nur vorübergehend. Wärm es auf, und der Akku ist wieder da.',
    'La buena noticia: es temporal. Caliéntalo y la batería vuelve.',
    "La bonne nouvelle : c'est temporaire. Réchauffe-le, et la batterie revient."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text="But many batteries can't charge safely below freezing. Metal lithium plates inside and can short it.",
         cap="Don't charge below *32 °F.*",
         de='Aber viele Akkus darf man unter null Grad nicht sicher laden. Metallisches Lithium lagert sich ab und kann einen Kurzschluss machen.',
         es='Pero muchas baterías no se pueden cargar con seguridad bajo cero grados. El litio metálico se deposita dentro y puede causar un cortocircuito.',
         fr="Mais beaucoup de batteries ne se rechargent pas sans risque sous zéro degré. Du lithium métal se dépose et peut créer un court-circuit."),
    dict(at='0.15', text='Has your phone ever died in the cold? Comment yes or no!', cta=True,
         de='Ist dir dein Handy schon mal in der Kälte ausgegangen? Schreib ja oder nein!',
         es='¿Alguna vez se te apagó el móvil con frío? ¡Comenta sí o no!',
         fr="Ton téléphone s'est déjà éteint dans le froid ? Commente oui ou non !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Epic Trailer by Rafael Krux.ogg', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'snow', 'file': 'File:S60 in Snow.jpg'},
 ],
}
open('episodes/163.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
