#!/usr/bin/env python3
"""#158 — Istanbul 2005: Liverpool 0–3 down at half-time vs Milan, 3–3, won on penalties.
Facts: https://en.wikipedia.org/wiki/2005_UEFA_Champions_League_final (first-minute Maldini goal, Crespo twice before half-time,
three goals in a six-minute spell: Gerrard, Šmicer, Alonso (rebound of his saved penalty); 117th-minute double save by Dudek from
Shevchenko from under 3 yards; shoot-out 3–2: Serginho over, Pirlo saved, Riise saved by Dida, Shevchenko saved)."""
import json
seg = lambda at, text, cap, de, es, fr, **k: dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **k)
ep = {
 "ep": 158, "title": "3-0 down at half-time. They still won. (Istanbul 2005)", "series": "FOOTBALL · GREATEST NIGHTS",
 "look": "cine", "captions": True, "noOutro": True, "speed": 1.3, "tight": True, "sub": 2, "transition": "whip", "facts": True,
 "recap": False, "voice": "narrator", "wordCaps": True, "mood": "epic", "prog": 3, "capY": 1700, "subY": 1520, "subEndY": 1760,
 "scripts": ["tech.js", "football.js"], "langs": ["en", "de", "es", "fr"],
 "hook": ["3–0 DOWN", "AT HALF-TIME.", "THEY WON."],
 "cta": {"q": "Greatest comeback ever?", "a": "YES", "b": "NO"},
 "spell": {"Jerrard": "Gerrard", "Shmeetser": "Šmicer", "Smeetser": "Šmicer", "Doodek": "Dudek", "Dudeck": "Dudek"},
 "source": "https://en.wikipedia.org/wiki/2005_UEFA_Champions_League_final",
 "vo_open": [seg(0.3, "Three-nil down at half-time, in a final. They still won.", "*3–0 down* at half-time.",
   "Drei zu null hinten zur Halbzeit, in einem Finale. Und sie haben trotzdem gewonnen.",
   "Perdiendo tres a cero al descanso, en una final. Y aun así ganaron.",
   "Menés trois à zéro à la mi-temps, en finale. Et ils ont quand même gagné.")],
 "scenes": [
  {"dur": 1.6, "vis": 0, "vo": [seg(0.45, "Istanbul, two thousand five. Milan scored in the first minute, then twice more before the break.",
   "Milan: *first minute*… then *twice more.*",
   "Istanbul, zweitausendfünf. Milan traf in der ersten Minute, dann noch zweimal vor der Pause.",
   "Estambul, dos mil cinco. El Milan marcó en el primer minuto y luego dos veces más antes del descanso.",
   "Istanbul, deux mille cinq. Milan marque dès la première minute, puis encore deux fois avant la pause.")]},
  {"dur": 1.6, "vis": 1, "vo": [seg(0.45, "Then Liverpool scored three goals in six minutes. Jerrard. Shmeetser. Alonso. Three all!",
   "*Three goals* in *six minutes!*",
   "Dann schoss Liverpool drei Tore in sechs Minuten. Gerrard. Šmicer. Alonso. Drei zu drei!",
   "Entonces el Liverpool marcó tres goles en seis minutos. Gerrard. Šmicer. Alonso. ¡Tres a tres!",
   "Puis Liverpool marque trois buts en six minutes. Gerrard. Šmicer. Alonso. Trois partout !")]},
  {"dur": 1.6, "vis": 2, "vo": [seg(0.45, "Extra time. Shevchenko shoots from under three yards. Doodek saves. Twice.",
   "Under *3 yards*… *saved. Twice.*",
   "Verlängerung. Schewtschenko schießt aus weniger als drei Metern. Dudek hält. Zweimal.",
   "Prórroga. Shevchenko dispara a menos de tres metros. Dudek para. Dos veces.",
   "Prolongation. Shevchenko frappe à moins de trois mètres. Dudek arrête. Deux fois.")]},
  {"dur": 1.6, "vis": 3, "vo": [seg(0.45, "Penalties. Doodek wobbles his legs, saves from Pirlo and Shevchenko, and Liverpool lift the cup.",
   "Saves from *Pirlo* and *Shevchenko!*",
   "Elfmeterschießen. Dudek wackelt mit den Beinen, hält gegen Pirlo und Schewtschenko, und Liverpool holt den Pokal.",
   "Penaltis. Dudek baila sobre la línea, para a Pirlo y a Shevchenko, y el Liverpool levanta la copa.",
   "Tirs au but. Dudek gigote sur sa ligne, arrête Pirlo et Shevchenko, et Liverpool soulève la coupe."),
   dict(at="0.15", text="Greatest comeback ever? Yes or no. Comment!", cta=True,
        de="Größtes Comeback aller Zeiten? Ja oder nein. Schreib es in die Kommentare!",
        es="¿La mayor remontada de la historia? Sí o no. ¡Comenta!",
        fr="Le plus grand retour de l'histoire ? Oui ou non. Commente !")]},
 ],
 "photos": [
  {"id": "music", "audio": "File:Dramatic Trailer by Rafael Krux.ogg", "from": 0, "len": 60, "gain": 1},
  {"id": "stad", "file": "File:Atatürk Olimpiyat.jpg"},
  {"id": "ger", "file": "File:Steven Gerrard faces.jpg"},
  {"id": "dud", "file": "File:Jerzy Dudek (483145329).jpg"},
  {"id": "cup", "file": "File:Liverpool European Cup.jpg"},
 ],
}
json.dump(ep, open('episodes/158.json', 'w'), indent=1, ensure_ascii=False)
