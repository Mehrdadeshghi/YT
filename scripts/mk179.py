#!/usr/bin/env python3
"""#179 — Leicester City win the 2015–16 Premier League at 5000–1.
Facts: https://en.wikipedia.org/wiki/2015%E2%80%9316_Leicester_City_F.C._season (5000–1 underdog with bookmakers before the season;
Vardy scored in 11 consecutive games, a Premier League record (previously van Nistelrooy); champions confirmed 2 May 2016 when Chelsea
drew 2–2 with Tottenham at Stamford Bridge; 81 points, 23 wins, 12 draws, 3 defeats) and
https://en.wikipedia.org/wiki/2014%E2%80%9315_Leicester_City_F.C._season (bottom of the table for four and a half months between late
November and mid-April, finished 14th)."""
import json
seg = lambda at, text, cap, de, es, fr, **k: dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **k)
ep = {
 "ep": 179, "title": "5000 to 1. They won the league.", "series": "FOOTBALL · GREATEST NIGHTS",
 "look": "cine", "captions": True, "noOutro": True, "speed": 1.3, "tight": True, "sub": 2, "transition": "whip", "facts": True,
 "recap": False, "voice": "narrator", "wordCaps": True, "mood": "epic", "prog": 3, "capY": 1700, "subY": 1520, "subEndY": 1760,
 "scripts": ["tech.js", "football.js"], "langs": ["en", "de", "es", "fr"],
 "hook": ["5000 TO 1.", "THEY WON."],
 "cta": {"q": "Greatest upset ever?", "a": "YES", "b": "NO"},
 "spell": {"Lester": "Leicester"},
 "source": "https://en.wikipedia.org/wiki/2015%E2%80%9316_Leicester_City_F.C._season",
 "vo_open": [seg(0.3, "Five thousand to one. They still won the league.", "*5000 to 1.* They still *won the league.*",
   "Fünftausend zu eins. Und trotzdem wurden sie Meister.",
   "Cinco mil a uno. Y aun así ganaron la liga.",
   "Cinq mille contre un. Et ils ont quand même gagné le championnat.")],
 "scenes": [
  {"dur": 1.6, "vis": 0, "vo": [seg(0.45, "Lester City spent four and a half months at the bottom of the Premier League the season before.",
   "*Bottom* of the league for *4½ months.*",
   "Leicester City stand in der Saison davor viereinhalb Monate auf dem letzten Platz der Premier League.",
   "El Leicester City pasó cuatro meses y medio en el último puesto de la Premier League la temporada anterior.",
   "Leicester City a passé quatre mois et demi à la dernière place de la Premier League la saison précédente.")]},
  {"dur": 1.6, "vis": 1, "vo": [seg(0.45, "Bookmakers gave them five thousand to one. Then Vardy scored in eleven games in a row. A Premier League record.",
   "Vardy: *11 games in a row.*",
   "Die Buchmacher gaben ihnen fünftausend zu eins. Dann traf Vardy in elf Spielen hintereinander. Ein Premier-League-Rekord.",
   "Las casas de apuestas les daban cinco mil a uno. Luego Vardy marcó en once partidos seguidos. Un récord de la Premier League.",
   "Les bookmakers les donnaient à cinq mille contre un. Puis Vardy a marqué lors de onze matchs d'affilée. Un record de Premier League.")]},
  {"dur": 1.6, "vis": 2, "vo": [seg(0.45, "Twenty-three wins. Only three defeats all season. Eighty-one points.",
   "*23 wins.* Only *3 defeats.* *81 points.*",
   "Dreiundzwanzig Siege. Nur drei Niederlagen in der ganzen Saison. Einundachtzig Punkte.",
   "Veintitrés victorias. Solo tres derrotas en toda la temporada. Ochenta y un puntos.",
   "Vingt-trois victoires. Seulement trois défaites de toute la saison. Quatre-vingt-un points.")]},
  {"dur": 1.6, "vis": 3, "vo": [seg(0.45, "May second, twenty sixteen. Tottenham drew at Chelsea, and Lester were champions of England.",
   "*Champions of England.*",
   "Zweiter Mai, zweitausendsechzehn. Tottenham spielte bei Chelsea nur unentschieden, und Leicester war englischer Meister.",
   "Dos de mayo de dos mil dieciséis. El Tottenham empató en Chelsea, y el Leicester fue campeón de Inglaterra.",
   "Deux mai deux mille seize. Tottenham fait match nul à Chelsea, et Leicester est champion d'Angleterre."),
   dict(at="0.15", text="Greatest upset ever? Yes or no. Comment!", cta=True,
        de="Die größte Sensation aller Zeiten? Ja oder nein. Schreib es in die Kommentare!",
        es="¿La mayor sorpresa de la historia? Sí o no. ¡Comenta!",
        fr="La plus grande surprise de l'histoire ? Oui ou non. Commente !")]},
 ],
 "photos": [
  {"id": "music", "audio": "File:Rafael Krux - Uplifting Blockbuster (cc-by) (filmmusic).mp3", "from": 0, "len": 60, "gain": 1},
  {"id": "troph", "file": "File:LCFC lift the Premier League Trophy (26943755296) (cropped).jpg"},   # 7 May 2016, vs Everton
  {"id": "vardy", "file": "File:Jamie Vardy 08 sierpnia 2015 (cropped).jpg"},                       # 8 Aug 2015, season opener vs Sunderland
  {"id": "celeb", "file": "File:LCFC players celebrate after victory vs Everton (27859481336).jpg"},  # 7 May 2016
  {"id": "stad", "file": "File:Leicester City FC - Southampton FC 03-Apr-2016, King Power Stadium 02.jpg"},
  {"id": "whu", "file": "File:Leicester City v West Ham United April 2016.jpeg"},
 ],
}
json.dump(ep, open('episodes/179.json', 'w'), indent=1, ensure_ascii=False)
