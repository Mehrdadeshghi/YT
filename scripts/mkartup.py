#!/usr/bin/env python3
"""Upload texts for the art batch #129-#138 → uploads/<ep>.md (EN + DE/ES/FR), credits only for media the visuals use."""
import json, re

T = {  # ep: (EN title, DE, ES, FR, EN hook line for the description, hashtags)
 129: ("There's a SKULL hidden in this painting 💀", 'In diesem Gemälde ist ein TOTENKOPF versteckt 💀', 'Hay una CALAVERA escondida en este cuadro 💀', 'Un CRÂNE est caché dans ce tableau 💀',
       "Holbein's The Ambassadors (1533) hides a stretched skull you can only see from the side.", '#art #arthistory #holbein #painting #hiddendetails'),
 130: ("Someone painted MUSIC on a butt 500 years ago 🎵", 'Jemand malte vor 500 Jahren NOTEN auf einen Hintern 🎵', 'Alguien pintó MÚSICA en un trasero hace 500 años 🎵', "Quelqu'un a peint de la MUSIQUE sur des fesses il y a 500 ans 🎵",
       "In Bosch's Garden of Earthly Delights, a sinner in hell has sheet music painted on his backside. Here is how it sounds.", '#art #bosch #arthistory #painting #weirdhistory'),
 131: ("Someone cut a DOOR through The Last Supper 🚪", 'Jemand brach eine TÜR durch das Abendmahl 🚪', 'Alguien abrió una PUERTA en La Última Cena 🚪', 'Quelqu\'un a percé une PORTE dans La Cène 🚪',
       "Leonardo's Last Supper started flaking right after 1498. In 1652, a doorway was cut right where Jesus' feet were.", '#leonardodavinci #lastsupper #arthistory #art #history'),
 132: ("The Night Watch is NOT at night 🌙", 'Die Nachtwache spielt NICHT in der Nacht 🌙', 'La ronda de noche NO es de noche 🌙', "La Ronde de nuit n'est PAS la nuit 🌙",
       "Rembrandt's Night Watch (1642) only looked like night because of dark varnish. And it was cut on all four sides in 1715.", '#rembrandt #nightwatch #arthistory #art #rijksmuseum'),
 133: ("The biggest art heist in history is STILL unsolved 🖼️", 'Der größte Kunstraub der Geschichte ist bis heute UNGELÖST 🖼️', 'El mayor robo de arte de la historia SIGUE sin resolverse 🖼️', "Le plus grand vol d'art de l'histoire n'est TOUJOURS pas résolu 🖼️",
       "1990, Boston: two fake police officers stole 13 artworks from the Isabella Stewart Gardner Museum. The empty frames still hang.", '#truecrime #artheist #art #mystery #vermeer'),
 134: ("He sold a FAKE Vermeer to the Nazis 🎨", 'Er verkaufte den Nazis einen FALSCHEN Vermeer 🎨', 'Vendió un Vermeer FALSO a los nazis 🎨', 'Il a vendu un FAUX Vermeer aux nazis 🎨',
       'Han van Meegeren fooled the experts and Hermann Göring, then had to paint another fake in front of witnesses to save his life.', '#art #forgery #history #vermeer #truecrime'),
 135: ("Bought for $1,175. Sold for $450 MILLION 💰", 'Gekauft für 1.175 $. Verkauft für 450 MILLIONEN 💰', 'Comprado por 1.175 $. Vendido por 450 MILLONES 💰', 'Acheté 1 175 $. Vendu 450 MILLIONS 💰',
       'Salvator Mundi sold for £45 in 1958. In 2017 it became the most expensive painting ever sold, and it has not been shown in public since.', '#leonardodavinci #salvatormundi #art #money #mystery'),
 136: ("This paint was made from REAL MUMMIES 🧟", 'Diese Farbe wurde aus ECHTEN MUMIEN gemacht 🧟', 'Esta pintura se hacía con MOMIAS REALES 🧟', 'Cette peinture était faite avec de VRAIES MOMIES 🧟',
       'Mummy brown was made from ground-up Egyptian mummies, and painters used it for about 200 years.', '#art #history #egypt #mummy #weirdhistory'),
 137: ("This beautiful green KILLED people ☠️", 'Dieses schöne Grün hat MENSCHEN GETÖTET ☠️', 'Este verde precioso MATÓ a gente ☠️', 'Ce beau vert a TUÉ des gens ☠️',
       "Scheele's green was made with arsenic and used for wallpaper, dresses and toys. Did it kill Napoleon?", '#history #art #napoleon #arsenic #weirdhistory'),
 138: ("This blue was worth as much as GOLD 💎", 'Dieses Blau war so viel wert wie GOLD 💎', 'Este azul valía tanto como el ORO 💎', "Ce bleu valait autant que l'OR 💎",
       'Ultramarine came from Afghan lapis lazuli and was so expensive that painters saved it for the Virgin Mary.', '#art #arthistory #vermeer #color #history'),
}
DESC = {'de': 'Mehr Geheimnisse der Kunstgeschichte jede Woche.', 'es': 'Más secretos del arte cada semana.', 'fr': "Plus de secrets de l'histoire de l'art chaque semaine."}
SUB = {'de': 'Abonnieren für mehr Kunst-Geheimnisse.', 'es': 'Suscríbete para más secretos del arte.', 'fr': "Abonne-toi pour plus de secrets de l'art."}
LAB = {'de': 'Deutsch', 'es': 'Español', 'fr': 'Français'}

for ep, (en, de, es, fr, hook, tags) in T.items():
    E = json.load(open(f'episodes/{ep}.json')); cr = json.load(open(f'assets/photos/{ep}.credits.json'))
    js = open(f'cine/{ep}.js').read(); used = [k for k in cr if k == 'music' or re.search(rf"['\"]{re.escape(k)}['\"]", js)]
    q = E['cta']['q']; cred = []
    for k in used:
        c = cr[k]; kind = 'Music' if k in ('music', 'butt') else 'Image'
        cred.append(f"- {kind}: {c['file'].replace('File:', '')} — {re.sub(r'\s*\(\s*\d+\s*\)', '', c['author'])}, {c['license']}, via Wikimedia Commons ({c['page']})")
    t = {'en': en, 'de': de, 'es': es, 'fr': fr}
    md = [f"# #{ep} {E['series']} — {E['title']}", '', f"**Title:** {en}", f"**Alt title:** {E['title']} #shorts", '',
          '**Description:**', f"{hook}", '', f"{q} Comment below 👇", 'Follow for a new art secret every day.', '', f"Source: {E['source']}", '',
          'The presenter is an AI-generated character (not a real person). Voice: AI narrator.', '', 'Credits:', *cred, '', tags + ' #shorts', '',
          f"**Pinned comment:** {q} Tell me in the comments 👇", '',
          f"**Audio tracks:** wiki_roulette_{ep}_de.m4a (German), wiki_roulette_{ep}_es.m4a (Spanish), wiki_roulette_{ep}_fr.m4a (French)", '',
          f"**Settings:** Playlist \"{E['series'].split(' #')[0].title()}\" · Made for kids: No · Altered or synthetic content: **Yes** (AI presenter) · Category: Education", '']
    for L in ('de', 'es', 'fr'):
        vo = [s[L] for s in E['vo_open']]
        md += [f"## {LAB[L]}", '', f"**Titel / Title:** {t[L]}", '', f"{vo[0]} {DESC[L]}", '', E['scenes'][5]['vo'][-1][L], '', SUB[L], '', tags + ' #shorts', '']
    open(f'uploads/{ep}.md', 'w').write('\n'.join(md)); print(ep, len(used), 'credits')
