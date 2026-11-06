#!/usr/bin/env python3
"""#223 Why store security gates beep (acousto-magnetic EAS). Picture: real-photo environment + modelled objects (scripts/hf223w/), workflow offline-render.yml.
Sources: en.wikipedia.org/wiki/Electronic_article_surveillance (two loose strips: amorphous metal + semi-hard magnet; bursts at about 58 kHz, the strip's resonance; it keeps oscillating after the burst; this induces an AC voltage in the receiver antenna; alarm only on correct frequency, repetition; demagnetizing deactivates; non-deactivated tags carried around cause unwanted alarms). US patent 8746580 family: demagnetizing shifts the resonance out of the detection window.
This is one common type of gate, labelled as such. How it works only: nothing here shows how to defeat a tag.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 223, 'title': 'Why store security gates beep', 'format': 'how-it-works', 'series': 'How It Works',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 175, 'speed': 1.0, 'mood': 'calm', 'prog': 0, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['THE GATE IS', 'LISTENING'], 'cta': {'q': 'Ever beeped for nothing?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Electronic_article_surveillance',
 'vo_open': [
  seg("Many store gates aren't looking for stolen stuff. They're listening for a tiny strip of metal that won't stop ringing.", "Many store gates aren't looking for *stolen* stuff. They're *listening* for a tiny strip of metal that won't stop *ringing.*",
      'Viele Ladenschranken suchen nicht nach gestohlener Ware. Sie lauschen auf einen winzigen Metallstreifen, der nicht aufhört zu klingen.',
      'Muchas puertas de tienda no buscan cosas robadas. Escuchan una diminuta tira de metal que no deja de sonar.',
      'Beaucoup de portiques de magasin ne cherchent pas d’objets volés. Ils écoutent une minuscule lamelle de métal qui n’arrête pas de sonner.')],
 'scenes': [
  {'dur': 1.0, 'beat': 'tag', 'vo': [seg("Inside this plastic tag: a thin metal strip, loose enough to vibrate, and a small magnet right beside it.",
      "Inside this plastic *tag:* a thin *metal strip,* loose enough to *vibrate,* and a small *magnet* right beside it.",
      'In diesem Plastik-Etikett: ein dünner Metallstreifen, lose genug zum Schwingen, und direkt daneben ein kleiner Magnet.',
      'Dentro de esta etiqueta de plástico: una tira fina de metal, lo bastante suelta para vibrar, y un pequeño imán justo al lado.',
      'Dans cette étiquette en plastique : une fine lamelle de métal, assez libre pour vibrer, et un petit aimant juste à côté.')]},
  {'dur': 1.0, 'beat': 'burst', 'vo': [seg("The gate fires short bursts at fifty-eight thousand cycles a second. That's the strip's natural pitch, so it starts to vibrate, like a tuning fork.",
      "The gate fires short *bursts* at *58,000 cycles* a second. That's the strip's natural *pitch,* so it starts to *vibrate,* like a *tuning fork.*",
      'Die Schranke feuert kurze Impulse mit achtundfünfzigtausend Schwingungen pro Sekunde. Das ist die Eigenfrequenz des Streifens, also schwingt er mit, wie eine Stimmgabel.',
      'La puerta lanza pulsos cortos a cincuenta y ocho mil ciclos por segundo. Es el tono natural de la tira, así que empieza a vibrar, como un diapasón.',
      'Le portique envoie de courtes impulsions à cinquante-huit mille cycles par seconde. C’est la note naturelle de la lamelle, alors elle se met à vibrer, comme un diapason.')]},
  {'dur': 1.0, 'beat': 'listen', 'vo': [seg("Here's the trick. The burst stops, and the gate goes quiet and listens. The strip keeps ringing, and that makes a tiny signal in the gate's antenna.",
      "Here's the *trick.* The burst *stops,* and the gate goes *quiet* and listens. The strip keeps *ringing,* and that makes a tiny *signal* in the gate's *antenna.*",
      'Der Trick: Der Impuls stoppt, die Schranke wird still und lauscht. Der Streifen klingt weiter, und das erzeugt ein winziges Signal in ihrer Antenne.',
      'El truco: el pulso se detiene, y la puerta se calla y escucha. La tira sigue sonando, y eso crea una señal diminuta en su antena.',
      'L’astuce : l’impulsion s’arrête, le portique se tait et écoute. La lamelle continue de sonner, et cela crée un minuscule signal dans son antenne.'),
    seg("Right pitch, right rhythm: alarm.", "Right *pitch,* right *rhythm:* *alarm.*",
      'Richtiger Ton, richtiger Rhythmus: Alarm.', 'Tono correcto, ritmo correcto: alarma.', 'Bonne note, bon rythme : alarme.')]},
  {'dur': 1.0, 'beat': 'pay', 'vo': [seg("So why doesn't it beep when you pay? At checkout, a pad demagnetizes that little magnet. The strip falls out of tune, and the gate can't hear it.",
      "So why doesn't it beep when you *pay?* At *checkout,* a pad *demagnetizes* that little magnet. The strip falls out of *tune,* and the gate can't *hear* it.",
      'Warum piept es nicht, wenn du bezahlt hast? An der Kasse entmagnetisiert ein Feld den kleinen Magneten. Der Streifen verstimmt sich, und die Schranke hört ihn nicht mehr.',
      '¿Por qué no pita cuando pagas? En la caja, una placa desmagnetiza ese pequeño imán. La tira se desafina, y la puerta ya no la oye.',
      'Pourquoi ça ne sonne pas quand tu paies ? À la caisse, un socle démagnétise ce petit aimant. La lamelle se désaccorde, et le portique ne l’entend plus.')]},
  {'dur': 1.0, 'beat': 'false', 'vo': [seg("But if a cashier misses a tag, or a tag from another store is still in your bag, you get the beep for nothing.",
      "But if a cashier *misses* a tag, or a tag from *another store* is still in your bag, you get the *beep* for nothing.",
      'Aber wenn an der Kasse ein Etikett übersehen wird oder eines aus einem anderen Laden noch in deiner Tasche liegt, piept es grundlos.',
      'Pero si en la caja se pasa por alto una etiqueta, o aún llevas en la bolsa una de otra tienda, pita sin motivo.',
      'Mais si une étiquette est oubliée à la caisse, ou s’il en reste une d’un autre magasin dans ton sac, ça sonne pour rien.')]},
  {'dur': 1.0, 'beat': 'cta', 'vo': [seg("Has a store gate ever beeped at you for nothing? Comment yes or no, and subscribe.",
      "Has a store gate ever *beeped* at you for nothing? Comment *yes* or *no,* and *subscribe.*",
      'Hat eine Ladenschranke schon mal grundlos bei dir gepiept? Schreib Ja oder Nein, und abonniere.',
      '¿Alguna vez te ha pitado una puerta de tienda sin motivo? Comenta sí o no, y suscríbete.',
      'Un portique a-t-il déjà sonné pour rien à ton passage ? Commente oui ou non, et abonne-toi.', cta=True)]},
 ],
 'photos': [{'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60, 'gain': .55}],
}
E['hf'] = {'style': 'doku', 'custom': 'hf223'}
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/223.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
