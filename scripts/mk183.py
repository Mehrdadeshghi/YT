#!/usr/bin/env python3
"""#183 — Denmark win UEFA Euro 1992 after getting in ten days before the tournament.
Facts: https://en.wikipedia.org/wiki/UEFA_Euro_1992_final (Yugoslavia ejected ten days before the tournament because of the breakup of
the country and the warfare there; Denmark brought in with nine days to prepare; group: 0–0 England, loss to Sweden, 2–1 France;
semi-final 22 June 1992 v the Netherlands, the reigning European champions: 2–2, Schmeichel saved van Basten's penalty, 5–4 on penalties;
final 26 June 1992 at the Nya Ullevi, Gothenburg, v world champions Germany: 2–0, John Jensen and Kim Vilfort),
https://en.wikipedia.org/wiki/UEFA_Euro_1992 and https://en.wikipedia.org/wiki/Denmark_national_football_team (UEFA announced it on
31 May 1992; Denmark were runners-up of Yugoslavia's qualifying group. The "called back from the beach" story is a myth: most players
were already together for a friendly against the CIS — so the VO does not claim a vacation)."""
import json
seg = lambda at, text, cap, de, es, fr, **k: dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **k)
ep = {
 "ep": 183, "title": "Not even in the tournament. Then they won it.", "series": "FOOTBALL · GREATEST NIGHTS",
 "look": "cine", "captions": True, "noOutro": True, "speed": 1.3, "tight": True, "sub": 2, "transition": "whip", "facts": True,
 "recap": False, "voice": "narrator", "wordCaps": True, "mood": "epic", "prog": 3, "capY": 1700, "subY": 1520, "subEndY": 1760,
 "scripts": ["tech.js", "football.js"], "langs": ["en", "de", "es", "fr"],
 "hook": ["10 DAYS BEFORE:", "NOT EVEN IN IT."],
 "cta": {"q": "Bigger upset?", "a": "DENMARK", "b": "LEICESTER"},
 "spell": {"Shmy-kel": "Schmeichel", "Vil-fort": "Vilfort", "Vil-fort.": "Vilfort."},
 "source": "https://en.wikipedia.org/wiki/UEFA_Euro_1992_final",
 "vo_open": [seg(0.3, "Ten days before the Euros, Denmark weren't even in it. Then they won it.",
   "*10 days before:* not even *in it.* Then they *won it.*",
   "Zehn Tage vor der EM war Dänemark nicht einmal dabei. Dann haben sie sie gewonnen.",
   "Diez días antes de la Eurocopa, Dinamarca ni siquiera estaba clasificada. Y luego la ganó.",
   "Dix jours avant l'Euro, le Danemark n'était même pas qualifié. Puis il l'a gagné.")],
 "scenes": [
  {"dur": 1.6, "vis": 0, "vo": [seg(0.45, "Yugoslavia had qualified, then got thrown out over the war. Denmark, second in the group, took the spot. Nine days to prepare.",
   "*Yugoslavia out.* Denmark in. *9 days* to prepare.",
   "Jugoslawien hatte sich qualifiziert und wurde wegen des Krieges ausgeschlossen. Dänemark, Zweiter der Gruppe, bekam den Platz. Neun Tage Vorbereitung.",
   "Yugoslavia se había clasificado, pero fue expulsada por la guerra. Dinamarca, segunda del grupo, ocupó su lugar. Nueve días para prepararse.",
   "La Yougoslavie s'était qualifiée, puis a été exclue à cause de la guerre. Le Danemark, deuxième du groupe, a pris sa place. Neuf jours pour se préparer.")]},
  {"dur": 1.6, "vis": 1, "vo": [seg(0.45, "A draw with England. A loss to hosts Sweden. Then they beat France.",
   "*Draw. Loss.* Then they *beat France.*",
   "Ein Unentschieden gegen England. Eine Niederlage gegen Gastgeber Schweden. Dann schlugen sie Frankreich.",
   "Un empate con Inglaterra. Una derrota ante la anfitriona Suecia. Luego vencieron a Francia.",
   "Un nul contre l'Angleterre. Une défaite contre la Suède, pays hôte. Puis ils battent la France.")]},
  {"dur": 1.6, "vis": 2, "vo": [seg(0.45, "Next: the Netherlands, reigning European champions. Tied at two, then penalties. Shmy-kel saved van Basten's kick.",
   "*Schmeichel* saves *van Basten.*",
   "Dann die Niederlande, amtierender Europameister. Zwei zu zwei, dann Elfmeterschießen. Schmeichel hielt den Schuss von van Basten.",
   "Después, los Países Bajos, vigentes campeones de Europa. Dos a dos y penaltis. Schmeichel paró el disparo de van Basten.",
   "Ensuite, les Pays-Bas, champions d'Europe en titre. Deux partout, puis les tirs au but. Schmeichel arrête le tir de van Basten.")]},
  {"dur": 1.6, "vis": 3, "vo": [seg(0.45, "Final: world champions Germany. Jensen scored. Vil-fort scored. Two-nil. Denmark, champions of Europe.",
   "*2–0.* Denmark, *champions of Europe.*",
   "Finale: Weltmeister Deutschland. Jensen traf. Vilfort traf. Zwei zu null. Dänemark ist Europameister.",
   "Final: Alemania, campeona del mundo. Marcó Jensen. Marcó Vilfort. Dos a cero. Dinamarca, campeona de Europa.",
   "Finale : l'Allemagne, championne du monde. Jensen marque. Vilfort marque. Deux à zéro. Le Danemark, champion d'Europe."),
   dict(at="0.15", text="Denmark or Lester: which upset was bigger? Comment!", cta=True,
        de="Dänemark oder Leicester: Welche Sensation war größer? Schreib es in die Kommentare!",
        es="Dinamarca o Leicester: ¿qué sorpresa fue mayor? ¡Comenta!",
        fr="Le Danemark ou Leicester : quelle surprise était la plus grande ? Commente !")]},
 ],
 "photos": [
  {"id": "music", "audio": "File:Rafael Krux - The Epic 2.ogg", "from": 0, "len": 60, "gain": 1},
  {"id": "stad", "file": "File:Nya Ullevi 2013-07-06 001.jpg"},             # final + semi-final venue (photo 2013)
  {"id": "air", "file": "File:Ullevi juni 2019.jpg"},                      # CC0, Ullevi from the river (2019)
  {"id": "malmo", "file": "File:Sweden malmö stadion sweden.jpg"},          # Malmö Stadion: Denmark v England + v France
  {"id": "schm", "file": "File:Peter Schmeichel juli 1991.JPG"},           # PD, July 1991
  {"id": "vb", "file": "File:Marco van Basten 1989 crop.jpg"},             # CC0 Anefo, 1989
 ],
}
ep["spell"]["Lester"] = "Leicester"
json.dump(ep, open('episodes/183.json', 'w'), indent=1, ensure_ascii=False)
