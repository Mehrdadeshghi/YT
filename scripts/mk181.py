#!/usr/bin/env python3
"""#181 OCEAN — coelacanth (Latimeria), 22 Oct 2026. Ocean track, "back from the dead" angle; 25–30 s; frame-1 = an impossible number.
Facts: English Wikipedia (Oct 2026). "Marjorie Courtenay-Latimer": a fish "thought to have been extinct for 65 million years"; 22 December 1938
she examined the bycatch of the trawler Nerine; "five feet (150 cm) long", "four limb-like fins". "Coelacanth": lobe-finned fish, more closely
related to lungfish and tetrapods than to ray-finned fish; gestation "up to five years, which is 1.5 years longer than the deep-sea frilled shark,
the previous record holder"; Indonesian coelacanth first recognised in a local fish market in Manado in September 1997 by Mark Erdmann and his wife
Arnaz Mehta. "Indonesian coelacanth": on their honeymoon; life expectancy of up to 100 years (not used)."""
import json
S = lambda vis, text, cap, de, es, fr, **kw: {'dur': 1.6, 'vis': vis, 'vo': [dict(at=0.45, text=text, cap=cap, de=de, es=es, fr=fr, **kw)]}
E = {
 'ep': 181, 'title': 'The fish that came back (coelacanth)', 'series': 'OCEAN',
 'look': 'cine', 'captions': True, 'noOutro': True, 'speed': 1.2, 'tight': True, 'sub': 2, 'transition': 'whip', 'facts': True,
 'recap': False, 'voice': 'narrator', 'wordCaps': True, 'mood': 'calm', 'prog': 3, 'capY': 1700, 'subY': 1520, 'subEndY': 1760,
 'scripts': ['tech.js'], 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['"EXTINCT" FOR', '65 MILLION YEARS.'],
 'cta': {'q': 'Did you know it still exists?', 'a': 'YES', 'b': 'NO'},
 'source': 'https://en.wikipedia.org/wiki/Coelacanth',
 'vo_open': [{'at': 0.3, 'text': 'Scientists thought this fish died out sixty-five million years ago. Then a fishing boat caught one.',
   'de': 'Forscher dachten, dieser Fisch sei vor fünfundsechzig Millionen Jahren ausgestorben. Dann fing ein Fischerboot einen.',
   'es': 'Los científicos creían que este pez se extinguió hace sesenta y cinco millones de años. Entonces un barco pesquero atrapó uno.',
   'fr': "Les scientifiques pensaient que ce poisson avait disparu il y a soixante-cinq millions d'années. Puis un bateau de pêche en a attrapé un."}],
 'scenes': [
  S(0, 'South Africa, nineteen thirty-eight. A young museum curator found it in a trawler’s catch. Five feet long.',
    'Found in a *trawler’s catch.* *5 feet* long.',
    'Südafrika, neunzehnhundertachtunddreißig. Eine junge Museumskuratorin fand ihn im Fang eines Fischtrawlers. Eineinhalb Meter lang.',
    'Sudáfrica, mil novecientos treinta y ocho. Una joven conservadora de museo lo encontró en la captura de un pesquero. Un metro y medio de largo.',
    "Afrique du Sud, mille neuf cent trente-huit. Une jeune conservatrice de musée l'a trouvé dans la pêche d'un chalutier. Un mètre cinquante de long."),
  S(1, 'Look at the fins. They grow on stalks, like little legs. It’s closer to you than to a tuna.',
    'Fins on stalks, *like little legs.*',
    'Schau dir die Flossen an. Sie wachsen auf Stielen, wie kleine Beine. Er ist näher mit dir verwandt als mit einem Thunfisch.',
    'Mira las aletas. Crecen sobre tallos, como patitas. Es más pariente tuyo que de un atún.',
    "Regarde ses nageoires. Elles poussent sur des tiges, comme de petites pattes. Il est plus proche de toi que d'un thon."),
  S(2, 'Pregnancy? Up to five years. That beats the frilled shark, the old record holder.',
    'Pregnant for *up to 5 years.*',
    'Schwangerschaft? Bis zu fünf Jahre. Damit schlägt er den Krausenhai, den alten Rekordhalter.',
    '¿El embarazo? Hasta cinco años. Supera al tiburón anguila, el antiguo récord.',
    "La gestation ? Jusqu'à cinq ans. Il bat le requin-lézard, l'ancien détenteur du record."),
  {'dur': 1.6, 'vis': 3, 'vo': [
    dict(at=0.45, text='Nineteen ninety-seven: a second species turned up. In an Indonesian fish market, spotted by a couple on their honeymoon.',
         cap='A second species, *in a fish market.*',
         de='Neunzehnhundertsiebenundneunzig: Eine zweite Art tauchte auf. Auf einem Fischmarkt in Indonesien, entdeckt von einem Paar in den Flitterwochen.',
         es='Mil novecientos noventa y siete: apareció una segunda especie. En un mercado de pescado de Indonesia, descubierta por una pareja de luna de miel.',
         fr="Mille neuf cent quatre-vingt-dix-sept : une deuxième espèce est apparue. Sur un marché aux poissons en Indonésie, repérée par un couple en lune de miel."),
    dict(at='0.15', text='Did you know it still exists? Yes or no? Comment!', cta=True,
         de='Wusstest du, dass es ihn noch gibt? Ja oder nein? Schreib es in die Kommentare!', es='¿Sabías que todavía existe? ¿Sí o no? ¡Comenta!',
         fr="Tu savais qu'il existe encore ? Oui ou non ? Commente !")]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 60, 'gain': 1},
  {'id': 'live', 'file': 'File:Coelacanth off Pumula on the KwaZulu-Natal South Coast, South Africa, on 22 November 2019.png'},
  {'id': 'marj', 'file': 'File:Marjorie Courtenay-Latimer and Coelacanth.jpg'},
  {'id': 'holo', 'file': 'File:West Indian Ocean Coelacanth (Latimeria chalumnae) holotype.jpg'},
  {'id': 'fin', 'file': 'File:Pectoral fin Latimeria chalumnae.jpg'},
  {'id': 'side', 'file': 'File:Latimeria chalumnae Harvard.jpg'},
  {'id': 'emb', 'file': 'File:Latimeria chalumnae embryo.jpg'},
  {'id': 'indo', 'file': 'File:Latimeria menadoensis.jpg'},
  {'id': 'stamp', 'file': 'File:Latimeria menadoensis 2000 Indonesia stamp.jpg'},
 ],
}
open('episodes/181.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False))
