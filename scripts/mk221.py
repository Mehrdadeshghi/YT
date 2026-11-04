#!/usr/bin/env python3
"""#221 Attack chain: the 29 Oct 2026 Binance hack, HyperFrames + one animated Three.js world (scripts/hf221.py, scripts/hf221w/). voice: gemini.
Facts: Binance's preliminary report of 3 Nov 2026 (https://x.com/binance/status/2117626126214504729), said on screen and in the VO
as "according to Binance". Attribution + denial: en.wikipedia.org/wiki/2026_Binance_hack (FBI alert 31 Oct; KCNA statement 3 Nov).
News explainer only: no exploit steps, no file paths, the "popular AI coding tool" stays unnamed, engineers stay A, B, C.
Report figures: 233.46M XRP 20:05-20:09 UTC from five hot wallets; ~970,500 SOL; 44.2M OP; 18,270 BTC; last transfer 23:56 UTC;
EIP-7702 delegation cleared 00:10 UTC on 30 Oct; ~$6.34B impacted; ~$2.85B frozen or intercepted. The 17:15-19:56 window has no zone in the report.
"""
import json
def seg(text, cap, de, es, fr, **kw): return dict(at=0.15, text=text, cap=cap, de=de, es=es, fr=fr, **kw)
E = {
 'ep': 221, 'title': 'A fake job interview and the $6.3 billion Binance hack', 'format': 'attack-chain', 'series': 'Attack chains',
 'engine': 'hyperframes', 'oneAsk': True, 'voice': 'gemini', 'gemini_wpm': 210, 'speed': 1.2,
 'mood': 'calm', 'prog': 1, 'langs': ['en', 'de', 'es', 'fr'],
 'hook': ['A FAKE JOB INTERVIEW', '$6.3 BILLION'],
 'cta': {'q': 'Weakest link?', 'a': 'INSTALLER', 'b': 'INTERVIEW'},
 'source': 'https://x.com/binance/status/2117626126214504729',
 'vo_open': [
  seg('A fake job interview helped steal six point three billion dollars.', 'A fake job *interview* helped steal *$6.3* billion dollars.',
      'Ein gefälschtes Bewerbungsgespräch half, sechs Komma drei Milliarden Dollar zu stehlen.',
      'Una entrevista de trabajo falsa ayudó a robar seis coma tres mil millones de dólares.',
      'Un faux entretien d’embauche a aidé à voler six virgule trois milliards de dollars.'),
  seg("Here's the attack chain, according to Binance.", "Here's the *attack chain,* according to *Binance.*",
      'Hier ist die Angriffskette, laut Binance.', 'Esta es la cadena del ataque, según Binance.', 'Voici la chaîne d’attaque, selon Binance.')],
 'scenes': [
  {'dur': 1.0, 'beat': 'june', 'vo': [seg("June. A wallet engineer downloads a tampered Homebrew. It's caught, but now the hackers know who runs the wallets.",
      "*June.* A wallet engineer downloads a *tampered Homebrew.* It's *caught,* but now the hackers know who runs the *wallets.*",
      'Juni. Ein Wallet-Ingenieur lädt ein manipuliertes Homebrew herunter. Es fällt auf, aber nun wissen die Hacker, wer die Wallets betreut.',
      'Junio. Un ingeniero de wallets descarga un Homebrew manipulado. Lo detectan, pero los hackers ya saben quién gestiona las wallets.',
      'Juin. Un ingénieur wallet télécharge un Homebrew piégé. C’est repéré, mais les pirates savent désormais qui gère les wallets.')]},
  {'dur': 1.0, 'beat': 'september', 'vo': [seg('September. A real job site. Engineer B gets two interviews, a fake CEO, then an assignment: undetected malware.',
      '*September.* A real *job site.* Engineer *B* gets two *interviews,* a *fake CEO,* then an *assignment:* *undetected malware.*',
      'September. Eine echte Jobplattform. Ingenieur B bekommt zwei Gespräche, einen falschen CEO, dann eine Aufgabe: unentdeckte Schadsoftware.',
      'Septiembre. Un portal de empleo real. El ingeniero B tiene dos entrevistas, un falso CEO y una tarea: malware no detectado.',
      'Septembre. Un vrai site d’emploi. L’ingénieur B passe deux entretiens, un faux PDG, puis un devoir : un malware non détecté.')]},
  {'dur': 1.0, 'beat': 'oct20', 'vo': [seg('October twentieth. An internal AI tool lets them take over engineers A and C. A holds a token for deploying containers.',
      '*October 20th.* An *internal AI tool* lets them take over engineers *A* and *C.* A holds a *token* for deploying containers.',
      'Zwanzigster Oktober. Ein internes KI-Tool hilft ihnen, die Ingenieure A und C zu übernehmen. A hat einen Token, der Container ausrollt.',
      'Veinte de octubre. Una herramienta interna de IA les da el control de los ingenieros A y C. A tiene un token para desplegar contenedores.',
      'Vingt octobre. Un outil d’IA interne leur livre les ingénieurs A et C. A détient un jeton pour déployer des conteneurs.')]},
  {'dur': 1.0, 'beat': 'oct29', 'vo': [seg("October twenty-ninth. With A's stolen credentials, they deploy a container and reach the wallet signing service.",
      "*October 29th.* With A's *stolen credentials,* they *deploy* a *container* and reach the *wallet signing service.*",
      'Neunundzwanzigster Oktober. Mit den gestohlenen Zugangsdaten von A rollen sie einen Container aus und erreichen den Wallet-Signierdienst.',
      'Veintinueve de octubre. Con las credenciales robadas de A, despliegan un contenedor y llegan al servicio de firma de wallets.',
      'Vingt-neuf octobre. Avec les identifiants volés de A, ils déploient un conteneur et atteignent le service de signature des wallets.')]},
  {'dur': 1.0, 'beat': 'drain', 'vo': [seg('The drain: two hundred thirty-three million X R P in four minutes. Then Solana, Optimism, eighteen thousand two hundred seventy Bitcoin.',
      'The *drain:* *233* million XRP in four *minutes.* Then *Solana,* *Optimism,* *18,270* Bitcoin.',
      'Der Abfluss: zweihundertdreiunddreißig Millionen XRP in vier Minuten. Dann Solana, Optimism, achtzehntausendzweihundertsiebzig Bitcoin.',
      'El drenaje: doscientos treinta y tres millones de XRP en cuatro minutos. Luego Solana, Optimism y dieciocho mil doscientos setenta Bitcoin.',
      'La vidange : deux cent trente-trois millions de XRP en quatre minutes. Puis Solana, Optimism, dix-huit mille deux cent soixante-dix Bitcoin.')]},
  {'dur': 1.0, 'beat': 'twist', 'vo': [seg("Binance stops withdrawals, but the outflow keeps running. E I P seventy-seven-oh-two gave the attacker's contract rights on-chain. With M P C wallets, no single key can revoke it fast.",
      "Binance *stops* withdrawals, but the *outflow* keeps running. *EIP-7702* gave the attacker's contract *rights* on-chain. With *MPC* wallets, *no single key* can revoke it fast.",
      'Binance stoppt die Auszahlungen, aber der Abfluss läuft weiter. E I P siebzig zweiundsiebzig gab dem Vertrag des Angreifers Rechte auf der Chain. Bei MPC-Wallets kann kein einzelner Schlüssel das schnell widerrufen.',
      'Binance detiene los retiros, pero la salida sigue. E I P siete siete cero dos dio derechos en la cadena al contrato del atacante. Con wallets MPC, ninguna clave única puede revocarlo rápido.',
      'Binance coupe les retraits, mais la fuite continue. E I P sept sept zéro deux a donné des droits on-chain au contrat de l’attaquant. Avec des wallets MPC, aucune clé unique ne peut révoquer ça vite.')]},
  {'dur': 1.0, 'beat': 'payoff', 'vo': [
    seg("Six point three four billion hit. Two point eight five billion frozen. Binance says users won't pay. The FBI points to North Korea. North Korea denies it.",
      "*$6.34* billion hit. *$2.85* billion *frozen.* Binance says users *won't pay.* The *FBI* points to *North Korea.* North Korea *denies* it.",
      'Sechs Komma drei vier Milliarden Dollar betroffen. Zwei Komma acht fünf Milliarden eingefroren. Binance sagt, Nutzer zahlen nicht. Das FBI verweist auf Nordkorea. Nordkorea bestreitet es.',
      'Seis coma tres cuatro mil millones afectados. Dos coma ocho cinco mil millones congelados. Binance dice que los usuarios no pagarán. El FBI señala a Corea del Norte. Corea del Norte lo niega.',
      'Six virgule trente-quatre milliards touchés. Deux virgule quatre-vingt-cinq milliards gelés. Binance dit que les utilisateurs ne paieront pas. Le FBI désigne la Corée du Nord. La Corée du Nord dément.'),
    seg('Weakest link: the fake installer or the fake interview? Comment installer or interview, and subscribe.',
      'Weakest *link:* the fake *installer* or the fake *interview?* Comment *installer* or *interview,* and *subscribe.*',
      'Das schwächste Glied: der falsche Installer oder das falsche Gespräch? Schreib Installer oder Interview, und abonniere.',
      'El eslabón más débil: ¿el instalador falso o la entrevista falsa? Comenta instalador o entrevista, y suscríbete.',
      'Le maillon faible : le faux installeur ou le faux entretien ? Commente installeur ou entretien, et abonne-toi.', cta=True)]},
 ],
 'photos': [
  {'id': 'music', 'audio': 'File:Rafael Krux - Lights - Creepy Ambient Suspense (cc-by) (filmmusic).mp3', 'from': 0, 'len': 62},
 ],
}
# The picture is one continuous animated world (scripts/hf221.py + scripts/hf221w/), no photos: only the music comes from "photos".
E['hf'] = {'style': 'doku', 'custom': 'hf221', 'workers': 3}   # WebGL capture calibrates as slow: auto would pick 1 worker
E['hf_open'] = {'tpl': 'plain', 'name': 'hook'}
for sc in E['scenes']: sc['hf'] = {'tpl': 'plain', 'name': sc['beat']}
open('episodes/221.json', 'w').write(json.dumps(E, indent=1, ensure_ascii=False) + '\n')
