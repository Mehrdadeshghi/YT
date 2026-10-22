#!/usr/bin/env python3
"""#182 OCEAN — mimic octopus (Thaumoctopus mimicus), 22 Oct 2026. Ocean track; 26–30 s; frame-1 impossible number ("one octopus, 18 disguises").
Facts: English Wikipedia "Mimic octopus" (Oct 2026): first discovered off the coast of Sulawesi, Indonesia in 1998; can switch between disguises of
up to 18 different marine animals, changing colour, shape and behaviour; lionfish: holds its arms out radially to mimic the fish's spines;
sea snake: hides 6 of its arms and holds the remaining 2 parallel; a mimic octopus harassed by damselfish mimicked a banded sea snake, a known
damselfish predator; flatfish mimicry may be its preferred guise: a 2008 study saw nearly 500 instances by a single individual over 5 days."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 182, 'title': 'One octopus, 18 disguises (mimic octopus)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['ONE OCTOPUS.', '18 DISGUISES.'],
 'cta': {'q': 'Which disguise is best?', 'a': 'LIONFISH', 'b': 'SNAKE'},
 'source': 'https://en.wikipedia.org/wiki/Mimic_octopus',
 'vo_open': [{'at': 0.3, 'text': 'One octopus. Up to eighteen different animals.',
   'de': 'Ein Oktopus. Bis zu achtzehn verschiedene Tiere.', 'es': 'Un pulpo. Hasta dieciocho animales distintos.', 'fr': "Une pieuvre. Jusqu'à dix-huit animaux différents."}],
 'scenes': [
  S(0, 'Mimic octopus. Nobody even knew it existed until nineteen ninety-eight, off Sulawesi, Indonesia.',
    'The *mimic octopus.* Discovered in *1998.*',
    'Der Mimik-Oktopus. Bis neunzehnhundertachtundneunzig wusste niemand, dass es ihn gibt, vor Sulawesi in Indonesien.',
    'El pulpo mimo. Nadie sabía que existía hasta mil novecientos noventa y ocho, frente a Sulawesi, Indonesia.',
    "La pieuvre mimétique. Personne ne savait qu'elle existait avant mille neuf cent quatre-vingt-dix-huit, au large de Sulawesi, en Indonésie."),
  S(1, 'Lionfish. It spreads its arms out wide, like the spines of a lionfish.',
    'Arms out = *lionfish spines.*',
    'Feuerfisch. Er spreizt seine Arme weit ab, wie die Stacheln eines Feuerfischs.',
    'Pez león. Abre los brazos como las espinas de un pez león.',
    "Poisson-lion. Elle écarte ses bras comme les épines d'un poisson-lion."),
  S(2, 'Sea snake. It hides six arms and stretches out two. When damselfish attacked one, it turned into their predator: a banded sea snake.',
    'Damselfish attack? It becomes a *sea snake.*',
    'Seeschlange. Er versteckt sechs Arme und streckt zwei aus. Als Riffbarsche einen angriffen, wurde er zu ihrem Feind: einer gebänderten Seeschlange.',
    'Serpiente marina. Esconde seis brazos y estira dos. Cuando unos peces damisela atacaron a uno, se convirtió en su depredador: una serpiente marina rayada.',
    "Serpent de mer. Elle cache six bras et en tend deux. Quand des demoiselles l'ont attaquée, elle est devenue leur prédateur : un serpent de mer rayé."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Favorite disguise: a flat fish. One octopus did it nearly five hundred times in five days.',
         cap='Nearly *500 times* in *5 days.*',
         de='Seine Lieblingsverkleidung: ein Plattfisch. Ein einziger Oktopus machte das fast fünfhundert Mal in fünf Tagen.',
         es='Su disfraz favorito: un pez plano. Un solo pulpo lo hizo casi quinientas veces en cinco días.',
         fr="Son déguisement préféré : un poisson plat. Une seule pieuvre l'a fait près de cinq cents fois en cinq jours."),
    dict(at='0.15', text='Which disguise is best? Lionfish or snake? Comment!', cta=True,
         de='Welche Verkleidung ist die beste? Feuerfisch oder Schlange? Schreib es in die Kommentare!',
         es='¿Qué disfraz es el mejor? ¿Pez león o serpiente? ¡Comenta!',
         fr='Quel déguisement est le meilleur ? Poisson-lion ou serpent ? Commente !')]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'face', 'file': 'File:Mimic octopus (Thaumoctopus mimicus) (16059533407).jpg'},
  {'id': 'lembeh', 'file': 'File:Mimic Octopus.jpg'},
  {'id': 'spread', 'file': 'File:Mimic Octopus 7.jpg'},
  {'id': 'lion', 'file': 'File:Pterois volitans Cologne Zoo 31122014 3.jpg'},
  {'id': 'krait', 'file': 'File:Laticauda colubrina 59741742.jpg'},
  {'id': 'swim', 'video': 'File:Mimic Octopus video.webm', 'from': 9, 'len': 9},
 ],
}
open('episodes/182.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
