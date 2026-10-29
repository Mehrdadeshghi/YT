#!/usr/bin/env python3
"""#218 "Why do you do that?" (unconscious psychology, HyperFrames KINETIC style): the doorway effect. Oct 2026. voice: gemini.
Facts (checked Oct 29 2026):
- English Wikipedia "Event perception" (redirect target of "Doorway effect"), section Relation to episodic memory:
  "Event boundaries can also lead to forgetting. According to EST, when event models are updated, information belonging to the
  prior event is discarded from working memory. This accounts for the short-term memory loss commonly experienced when people
  walk through doorways ... The 'doorway effect' is observed even when participants traverse virtual spaces in VR".
- Radvansky, Krawietz & Tamplin (2011), QJEP 64(8), doi:10.1080/17470218.2011.571267, abstract: "a location-updating effect in
  which there is a decline in memory when people move from one location to another" ... Exp. 2 "an actual, rather than a virtual,
  environment" ... Exp. 3 "having a person return to the original room ... memory did not improve by reinstating this context."
- Radvansky, Pettijohn & Kim (2015), Psychology and Aging, doi:10.1037/a0039259: "both younger and older adults had memory disrupted
  after walking through a doorway. Importantly, the magnitude of this disruption was similar in the 2 age groups."
- McFadyen et al. (2021), BMC Psychology 9:59, doi:10.1186/s40359-021-00536-3 "Doorways do not always cause forgetting": four
  experiments, "no significant effect of doorways on forgetting"; only "under working memory load, memory was more susceptible to
  interference after moving through doorways." -> said honestly in the video.
"""
import json
RP, PT, GR = 'Real photo', 'Painting', 'Graphic'
E = {
 'ep': 218, 'title': 'Why you forget why you walked into a room', 'format': 'why-unconscious', 'series': 'Why do you do that?',
 'engine': 'hyperframes', 'oneAsk': True, 'loop': True, 'voice': 'gemini', 'gemini_wpm': 195, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['WALK INTO A ROOM', 'FORGET WHY'],
 'cta': {'q': 'Happens to you?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Event_perception',
 'vo_open': [{'at': 0.15,
   'text': 'Why do you walk into a room and forget why you came?',
   'cap': 'Why do you *walk* into a *room* and *forget* why you came?',
   'de': 'Warum gehst du in ein Zimmer und vergisst, was du da wolltest?',
   'es': '¿Por qué entras en una habitación y olvidas a qué venías?',
   'fr': 'Pourquoi tu entres dans une pièce et tu oublies ce que tu venais faire ?'}],
 'scenes': [
  {'dur': 1.0, 'beat': 'name', 'vo': [dict(at=0.2,
    text='Psychologists call it the doorway effect.',
    cap='Psychologists call it the *doorway effect.*',
    de='Psychologen nennen das den Türeffekt.',
    es='Los psicólogos lo llaman el efecto puerta.',
    fr='Les psychologues appellent ça l’effet de la porte.')]},
  {'dur': 1.0, 'beat': 'scenes', 'vo': [dict(at=0.2,
    text='Your brain cuts your day into scenes, like a movie. A doorway is a scene break.',
    cap='Your brain cuts your day into *scenes,* like a *movie.* A *doorway* is a *scene break.*',
    de='Dein Gehirn schneidet deinen Tag in Szenen, wie einen Film. Eine Tür ist ein Szenenwechsel.',
    es='Tu cerebro corta tu día en escenas, como una película. Una puerta es un cambio de escena.',
    fr='Ton cerveau découpe ta journée en scènes, comme un film. Une porte, c’est un changement de scène.')]},
  {'dur': 1.0, 'beat': 'files', 'vo': [dict(at=0.2,
    text='Walk through, and it files the last scene away, along with what you came for.',
    cap='Walk through, and it *files* the last scene *away,* along with what you *came for.*',
    de='Gehst du hindurch, legt es die letzte Szene ab, samt dem, wofür du gekommen bist.',
    es='Al cruzarla, archiva la escena anterior, junto con lo que venías a buscar.',
    fr='Tu la franchis, et il range la scène d’avant, avec ce que tu venais chercher.')]},
  {'dur': 1.0, 'beat': 'lab', 'vo': [dict(at=0.2,
    text="In Gabriel Radvansky's experiments, people forgot more after walking through a doorway, in virtual rooms and in real ones.",
    cap="In *Gabriel Radvansky's* experiments, people *forgot more* after a *doorway,* in *virtual* rooms and in *real* ones.",
    de='In den Experimenten von Gabriel Radvansky vergaßen Menschen nach einer Tür mehr, in virtuellen und in echten Räumen.',
    es='En los experimentos de Gabriel Radvansky, la gente olvidaba más tras cruzar una puerta, en salas virtuales y reales.',
    fr='Dans les expériences de Gabriel Radvansky, on oubliait davantage après une porte, dans des pièces virtuelles comme réelles.')]},
  {'dur': 1.0, 'beat': 'back', 'vo': [
    dict(at=0.2, text="Walking back into the first room didn't bring the memory back.",
      cap="Walking *back* into the first room didn't bring the *memory* back.",
      de='Zurück ins erste Zimmer zu gehen, brachte die Erinnerung nicht zurück.',
      es='Volver a la primera habitación no devolvía el recuerdo.',
      fr='Retourner dans la première pièce ne faisait pas revenir le souvenir.'),
    dict(at=0.1, text="And older adults weren't hit any harder than young ones.",
      cap="And *older* adults weren't hit any *harder* than *young* ones.",
      de='Und Ältere traf es nicht stärker als Junge.',
      es='Y a los mayores no les afectaba más que a los jóvenes.',
      fr='Et les plus âgés n’étaient pas plus touchés que les jeunes.')]},
  {'dur': 1.0, 'beat': 'catch', 'vo': [
    dict(at=0.2, text="One catch: a twenty twenty-one study couldn't repeat it, except when people's minds were already busy.",
      cap="One *catch:* a *2021* study couldn't *repeat* it, except when people's minds were already *busy.*",
      de='Ein Haken: Eine Studie von zweitausendeinundzwanzig konnte es nicht wiederholen, außer wenn der Kopf schon voll war.',
      es='Un matiz: un estudio de dos mil veintiuno no pudo repetirlo, salvo cuando la mente ya estaba ocupada.',
      fr='Un bémol : une étude de deux mille vingt et un n’a pas pu le reproduire, sauf quand l’esprit était déjà occupé.'),
    dict(at=0.15, text='Does this happen to you? Comment yes or no, and subscribe.', cta=True,
      cap='Does this *happen* to you? Comment *yes* or *no,* and *subscribe.*',
      de='Passiert dir das auch? Schreib ja oder nein, und abonniere.',
      es='¿Te pasa a ti? Comenta sí o no, y suscríbete.',
      fr='Ça t’arrive aussi ? Commente oui ou non, et abonne-toi.')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Kevin MacLeod - Scheming Weasel (faster).wav', 'from': 0, 'len': 60},
  {'id': 'halpert', 'file': 'File:Woman in Doorway, by Samuel Halpert.jpg'},
  {'id': 'doors', 'file': 'File:Vilhelm Hammershøi- Weiße Türen, offene Türen, 1905.jpg'},
  {'id': 'strand', 'file': 'File:Interior. Strandgade 30 (SM 2402).png'},
  {'id': 'white', 'file': 'File:Vilhelm Hammershøi - Hvide døre. Interiør fra Strandgade 25 - 1913.png'},
  {'id': 'vr', 'file': 'File:A virtual reality (25779404897).jpg'},
 ],
}
E['hf'] = {'style': 'kinetic',
           'caps': {'cu': ['doorway', 'scene', 'movie', 'files', 'radvansky', 'virtual', 'real'], 'vg': ['memory', 'older', 'young', 'busy'],
                    'rd': ['forget', 'forgot', 'catch', 'repeat']}}
E['hf_open'] = {'tpl': 'split', 'name': 'hook', 'a': 'halpert', 'b': 'doors',
  'labelA': ['Samuel Halpert, Woman in Doorway', PT], 'labelB': ['Hammershøi, open doors, 1905', PT]}
hfs = [
 {'tpl': 'photo', 'src': 'doors', 'pos': '50% 50%', 'label': ['Hammershøi, open doors, 1905', PT]},
 {'tpl': 'photo', 'src': 'strand', 'pos': '45% 50%', 'label': ['Hammershøi, Strandgade 30', PT]},
 {'tpl': 'photo', 'src': 'halpert', 'pos': '60% 40%', 'label': ['Samuel Halpert, Woman in Doorway', PT]},
 {'tpl': 'photo', 'src': 'vr', 'pos': '62% 40%', 'label': ['Virtual reality headset', RP]},
 {'tpl': 'photo', 'src': 'white', 'pos': '50% 50%', 'label': ['Hammershøi, White Doors, 1913', PT]},
 {'tpl': 'photo', 'src': 'strand', 'pos': '45% 50%', 'label': ['Hammershøi, Strandgade 30', PT],
  'els': [{'el': 'ab', 'q': 'Happens to you?', 'a': {'src': 'halpert', 'label': 'Yes'}, 'b': {'src': 'doors', 'label': 'No'}}]},
]
for sc, h in zip(E['scenes'], hfs): sc['hf'] = h
open('episodes/218.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
