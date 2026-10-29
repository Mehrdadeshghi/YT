#!/usr/bin/env python3
"""#220 "Why do you do that?" (unconscious psychology, HyperFrames KINETIC style): hearing your name in a loud room
(cocktail party effect). Oct 2026. voice: gemini.
Facts (checked Oct 29 2026):
- English Wikipedia "Cocktail party effect": "The effect was first defined and named 'the cocktail party problem' by Colin Cherry in
  1953"; shadowing task ("repeat aloud the message ... heard in a specified ear"), "participants were able to detect their name from the
  unattended channel"; Treisman's attenuation model: unattended information "is not completely blocked out ... Instead, the
  information is weakened (attenuated)"; "One's own name, according to Treisman, has a low threshold value ... and thus is recognized
  more easily." -> said as "one classic theory".
- Wood & Cowan (1995), JEP:LMC 21(1):255, doi:10.1037/0278-7393.21.1.255: Moray's 1959 finding "never has been directly replicated
  ... Similar to N. Moray, only 34.6% of the participants recalled hearing their name in the channel to be ignored."
- Conway, Cowan & Bunting (2001), Psychonomic Bulletin & Review 8(2):331, doi:10.3758/BF03196169: "Both of these previous
  investigations have shown that approximately 33% of subjects report hearing their own name in an unattended, irrelevant message.
  Here we show that subjects who detect their name in the irrelevant message have relatively low working-memory capacities,
  suggesting that they have difficulty blocking out, or inhibiting, distracting information."
"""
import json
RP, IL, GR = 'Real photo', 'Illustration', 'Graphic'
E = {
 'ep': 220, 'title': 'Why you hear your name across a loud room', 'format': 'why-unconscious', 'series': 'Why do you do that?',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['A LOUD ROOM', 'YOUR NAME'],
 'cta': {'q': 'Your name in a crowd?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Cocktail_party_effect',
 'vo_open': [{'at': 0.15,
   'text': 'Why do you hear your own name across a loud, crowded room?',
   'cap': 'Why do you hear your *own name* across a *loud,* crowded *room?*',
   'de': 'Warum hörst du deinen eigenen Namen quer durch einen lauten, vollen Raum?',
   'es': '¿Por qué oyes tu propio nombre en una sala ruidosa y llena de gente?',
   'fr': 'Pourquoi tu entends ton propre prénom à travers une pièce bruyante et bondée ?'}],
 'scenes': [
  {'dur': 1.0, 'beat': 'name', 'vo': [dict(at=0.2,
    text="It's called the cocktail party effect. Colin Cherry named the problem in nineteen fifty-three.",
    cap="It's called the *cocktail party* effect. *Colin Cherry* named the problem in *1953.*",
    de='Das nennt man den Cocktailparty-Effekt. Colin Cherry gab dem Problem neunzehnhundertdreiundfünfzig seinen Namen.',
    es='Se llama el efecto cóctel. Colin Cherry le puso nombre al problema en mil novecientos cincuenta y tres.',
    fr='On appelle ça l’effet cocktail. Colin Cherry a nommé le problème en mille neuf cent cinquante-trois.')]},
  {'dur': 1.0, 'beat': 'filter', 'vo': [dict(at=0.2,
    text="One classic theory: your brain turns the voices you ignore down, not off.",
    cap="One classic theory: your brain turns the voices you *ignore* *down,* not *off.*",
    de='Eine klassische Theorie: Dein Gehirn dreht die Stimmen, die du ignorierst, leiser, nicht aus.',
    es='Una teoría clásica: tu cerebro baja el volumen de las voces que ignoras, pero no las apaga.',
    fr='Une théorie classique : ton cerveau baisse les voix que tu ignores, sans les couper.')]},
  {'dur': 1.0, 'beat': 'through', 'vo': [dict(at=0.2,
    text='Words that matter to you, like your own name, can still break through.',
    cap='Words that *matter* to you, like your own *name,* can still *break through.*',
    de='Wörter, die dir wichtig sind, wie dein eigener Name, kommen trotzdem durch.',
    es='Las palabras que te importan, como tu nombre, aún pueden colarse.',
    fr='Les mots qui comptent pour toi, comme ton prénom, peuvent quand même passer.')]},
  {'dur': 1.0, 'beat': 'test', 'vo': [
    dict(at=0.2, text='In a classic test, people repeated a voice in one ear.',
      cap='In a classic *test,* people *repeated* a voice in *one ear.*',
      de='In einem klassischen Test sprachen Leute eine Stimme in einem Ohr nach.',
      es='En una prueba clásica, la gente repetía una voz que oía por un oído.',
      fr='Dans un test classique, des gens répétaient une voix entendue dans une oreille.'),
    dict(at=0.1, text='About a third heard their name in the other ear.',
      cap='About *a third* heard their *name* in the *other ear.*',
      de='Etwa ein Drittel hörte im anderen Ohr den eigenen Namen.',
      es='Cerca de un tercio oyó su nombre por el otro oído.',
      fr='Environ un tiers a entendu son prénom dans l’autre oreille.')]},
  {'dur': 1.0, 'beat': 'twist', 'vo': [
    dict(at=0.2, text='The twist: people who caught their name tended to have lower working memory. They were worse at blocking out distractions.',
      cap='The *twist:* people who *caught* their name tended to have *lower* working memory. They were worse at *blocking out* distractions.',
      de='Der Clou: Wer seinen Namen hörte, hatte eher ein schwächeres Arbeitsgedächtnis. Diese Leute blendeten Ablenkung schlechter aus.',
      es='El giro: quienes captaron su nombre solían tener menos memoria de trabajo. Les costaba más bloquear distracciones.',
      fr='Le twist : ceux qui ont capté leur prénom avaient plutôt moins de mémoire de travail. Ils filtraient moins bien les distractions.'),
    dict(at=0.15, text='Do you always hear your name in a crowd? Comment yes or no, and subscribe.', cta=True,
      cap='Do you always hear your *name* in a crowd? Comment *yes* or *no,* and *subscribe.*',
      de='Hörst du deinen Namen in der Menge immer? Schreib ja oder nein, und abonniere.',
      es='¿Siempre oyes tu nombre entre la multitud? Comenta sí o no, y suscríbete.',
      fr='Tu entends toujours ton prénom dans la foule ? Commente oui ou non, et abonne-toi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Inspiring Teaser (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60},
  {'id': 'bar', 'file': 'File:Interior of a crowded bar moments before midnight, June 30, 1919, when wartime prohibition went into effect New York City LCCN99405168.jpg'},
  {'id': 'tags', 'file': 'File:Hello My Name Is (15283079263).jpg'},
  {'id': 'room', 'file': 'File:Group of men, including David Dubinsky and Harry Truman, conversing and laughing in a crowded room (5279148229).jpg'},
  {'id': 'phones', 'file': 'File:Vintage Western Electric Headphones, Model CW-834, Made In USA, Circa 1920s (36309563731).jpg'},
  {'id': 'ears', 'file': 'File:Figur 1.png'},
 ],
}
E['hf'] = {'style': 'kinetic',
           'caps': {'cu': ['cocktail', 'party', 'cherry', 'name', 'third', 'ear'], 'vg': ['ignore', 'down', 'off', 'matter', 'test', 'repeated'],
                    'rd': ['twist', 'lower', 'caught', 'blocking']}}
E['hf_open'] = {'tpl': 'split', 'name': 'hook', 'a': 'bar', 'b': 'tags',
  'labelA': ['Crowded bar, New York, 1919', RP], 'labelB': ['Name tags', RP]}
hfs = [
 {'tpl': 'photo', 'src': 'room', 'pos': '50% 45%', 'label': ['A crowded room', RP]},
 {'tpl': 'photo', 'src': 'bar', 'pos': '50% 50%', 'label': ['Crowded bar, New York, 1919', RP]},
 {'tpl': 'photo', 'src': 'tags', 'pos': '40% 50%', 'label': ['Name tags', RP]},
 {'tpl': 'photo', 'src': 'ears', 'pos': '50% 50%', 'label': ['Two ears, two messages', GR]},
 {'tpl': 'photo', 'src': 'phones', 'pos': '50% 55%', 'label': ['Headphones, 1920s', RP],
  'els': [{'el': 'ab', 'q': 'Your name in a crowd?', 'a': {'src': 'tags', 'label': 'Yes'}, 'b': {'src': 'bar', 'label': 'No'}}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/220.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
