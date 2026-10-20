#!/usr/bin/env python3
"""#168 — 2022 World Cup final: Argentina 3–3 France, Mbappé hat-trick, Argentina win 4–2 on penalties.
Facts: https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_final (Argentina 2–0 up (Messi pen, Di María); France no attempt on goal
until the 80th minute; Mbappé two goals within 97 seconds; Messi 3–2 in extra time; Mbappé penalty 3–3 = hat-trick, second man after
Geoff Hurst 1966; 123rd minute, 15 seconds of extra time left: Emiliano Martínez blocks Kolo Muani with his left shin; shoot-out:
Mbappé ✓ Messi ✓ Coman saved, Dybala ✓ Tchouaméni wide, Paredes ✓ Kolo Muani ✓ Montiel ✓ → 4–2; "France became the first team
in history to score three goals in a World Cup final and lose")."""
import json
seg = lambda at, text, cap, de, es, fr, **k: dict(at=at, text=text, cap=cap, de=de, es=es, fr=fr, **k)
ep = {
 "ep": 168, "title": "He scored 3 in a World Cup final. And lost.", "series": "FOOTBALL · GREATEST NIGHTS",
 "look": "cine", "captions": True, "noOutro": True, "speed": 1.3, "tight": True, "sub": 2, "transition": "whip", "facts": True,
 "recap": False, "voice": "narrator", "wordCaps": True, "mood": "epic", "prog": 3, "capY": 1700, "subY": 1520, "subEndY": 1760,
 "scripts": ["tech.js", "football.js"], "langs": ["en", "de", "es", "fr"],
 "hook": ["HAT-TRICK", "IN THE FINAL.", "AND LOST."],
 "cta": {"q": "Greatest final ever?", "a": "YES", "b": "NO"},
 "spell": {"Embappay": "Mbappé", "Em-bappay": "Mbappé", "Mbappay": "Mbappé"},
 "source": "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_final",
 "vo_open": [seg(0.3, "He scored three goals in a World Cup final. And lost.", "*3 goals* in a final. *And lost.*",
   "Er schoss drei Tore in einem WM-Finale. Und verlor.",
   "Marcó tres goles en una final del Mundial. Y perdió.",
   "Il a marqué trois buts en finale de Coupe du monde. Et il a perdu.")],
 "scenes": [
  {"dur": 1.6, "vis": 0, "vo": [seg(0.45, "Qatar, twenty twenty-two. Argentina led France two-nil, and France had no shot on goal until the eightieth minute.",
   "France: *no shot* until the *80th minute.*",
   "Katar, zweitausendzweiundzwanzig. Argentinien führte zwei zu null, und Frankreich hatte bis zur achtzigsten Minute keinen Torschuss.",
   "Catar, dos mil veintidós. Argentina ganaba dos a cero, y Francia no tiró a puerta hasta el minuto ochenta.",
   "Qatar, deux mille vingt-deux. L'Argentine mène deux à zéro, et la France n'a pas tiré au but avant la quatre-vingtième minute.")]},
  {"dur": 1.6, "vis": 1, "vo": [seg(0.45, "Then Embappay scored twice in ninety-seven seconds. Extra time: Messi scores. Embappay scores again. Three all!",
   "*Twice* in *97 seconds!*",
   "Dann traf Mbappé zweimal in siebenundneunzig Sekunden. Verlängerung: Messi trifft. Mbappé trifft wieder. Drei zu drei!",
   "Entonces Mbappé marcó dos veces en noventa y siete segundos. Prórroga: marca Messi. Mbappé marca otra vez. ¡Tres a tres!",
   "Puis Mbappé marque deux fois en quatre-vingt-dix-sept secondes. Prolongation : Messi marque. Mbappé marque encore. Trois partout !")]},
  {"dur": 1.6, "vis": 2, "vo": [seg(0.45, "Fifteen seconds left. France get one last chance. The keeper blocks it with his leg.",
   "*15 seconds* left… *blocked!*",
   "Noch fünfzehn Sekunden. Frankreich hat eine letzte Chance. Der Torwart blockt mit dem Bein.",
   "Quedan quince segundos. Francia tiene una última ocasión. El portero la bloquea con la pierna.",
   "Plus que quinze secondes. La France a une dernière occasion. Le gardien bloque avec la jambe.")]},
  {"dur": 1.6, "vis": 3, "vo": [seg(0.45, "Penalties. France miss two, and Messi finally lifts the World Cup.",
   "France *miss two.* Messi *lifts the cup.*",
   "Elfmeterschießen. Frankreich verschießt zwei, und Messi holt endlich den WM-Pokal.",
   "Penaltis. Francia falla dos, y Messi por fin levanta la Copa del Mundo.",
   "Tirs au but. La France en rate deux, et Messi soulève enfin la Coupe du monde."),
   dict(at="0.15", text="Greatest final ever? Yes or no. Comment!", cta=True,
        de="Bestes Finale aller Zeiten? Ja oder nein. Schreib es in die Kommentare!",
        es="¿La mejor final de la historia? Sí o no. ¡Comenta!",
        fr="La plus grande finale de l'histoire ? Oui ou non. Commente !")]},
 ],
 "photos": [
  {"id": "music", "audio": "File:Dramatic Trailer by Rafael Krux.ogg", "from": 0, "len": 60, "gain": 1},
  {"id": "mbap", "file": "File:2022 wc final 05.jpg"},                                        # Mbappé scoring in extra time (the final)
  {"id": "mpen", "file": "File:Argentina 3-3 Francia - Copa Mundial 2022 - Messi patea un penal.jpg"},   # the final
  {"id": "dima", "file": "File:2022 wc final 06.jpg"},                                        # Di María 2–0 (the final)
  {"id": "emi", "file": "File:Dibu Martínez saves against Jonathan David - ARG v CAN - 2024-07-09.jpg"},  # NOT from the final
  {"id": "mont", "file": "File:Argentina 3-3 Francia - Copa Mundial 2022 - Montiel patea el penal de la victoria.jpg"},
  {"id": "troph", "file": "File:2022 wc final 07.jpg"},                                       # Di María kisses the trophy
  {"id": "obel", "file": "File:Festejos en el Obelisco de Buenos Aires por la obtención de la Copa del Mundo de Fútbol 2022.jpg"},
 ],
}
json.dump(ep, open('episodes/168.json', 'w'), indent=1, ensure_ascii=False)
