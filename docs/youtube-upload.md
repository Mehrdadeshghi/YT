# YouTube-Upload per GitHub Actions — Einrichtung (einmalig, ca. 20 min)

Danach lädt der Workflow **"Upload to YouTube"** fertige Shorts direkt aus den Releases hoch, mit:
Titel, Beschreibung, Tags, Kategorie, „Für Kinder: Nein/Ja“, „Veränderte/synthetische Inhalte“, Playlist,
Titel auf Deutsch/Spanisch/Französisch und **geplanter Veröffentlichung** (z. B. 21:00 Uhr deutscher Zeit).

**Bleibt Handarbeit in YouTube Studio** (geht über die API nicht): die Tonspuren DE/ES/FR hochladen und den Kommentar anpinnen.

Schlüssel und Tokens kommen **nur** in die GitHub-Secrets. Nie in den Chat, nie ins Repo.

---

## Schritt 1 – Google-Cloud-Projekt und YouTube-API

1. Öffne <https://console.cloud.google.com/> und melde dich mit dem Google-Konto an, dem der Kanal **Wiki Roulette** gehört.
2. Oben auf die Projektauswahl → **Neues Projekt** → Name `wiki-roulette-upload` → **Erstellen** → das Projekt auswählen.
3. Menü → **APIs & Dienste → Bibliothek** → nach **YouTube Data API v3** suchen → **Aktivieren**.

## Schritt 2 – Zustimmungsbildschirm und OAuth-Client

1. **APIs & Dienste → OAuth-Zustimmungsbildschirm** (bzw. „Google Auth Platform“) → **Jetzt starten**.
   - App-Name: `Wiki Roulette Upload`, Support-E-Mail: deine Adresse.
   - Zielgruppe: **Extern**.
   - Kontaktadresse: deine Adresse → Speichern.
2. **Zielgruppe** → bei „Testnutzer“ deine eigene Google-Adresse hinzufügen.
3. **Wichtig:** Unter **Zielgruppe → Veröffentlichungsstatus** auf **„App veröffentlichen“ / „In Produktion“** stellen.
   Im Status „Testen“ läuft die Anmeldung nach **7 Tagen** ab und der Upload hört auf zu funktionieren.
   (Die Warnung „Google hat diese App nicht überprüft“ ist bei eigener Nutzung normal.)
4. **Clients** (bzw. „Anmeldedaten“) → **Client erstellen** → Anwendungstyp **Desktop-App** → Name `wr-upload` → **Erstellen**.
5. **JSON herunterladen**. Die Datei heißt etwa `client_secret_1234….json` und landet in deinem Windows-Downloads-Ordner.

## Schritt 3 – Einmal anmelden (im Terminal, in diesem Repo)

Unter WSL liegt dein Windows-Downloads-Ordner unter `/mnt/c/Users/<DEIN-WINDOWS-NAME>/Downloads/`.

```bash
cd ~/sandbox/wikiroullete
.venv/bin/python scripts/yt_auth.py /mnt/c/Users/<DEIN-WINDOWS-NAME>/Downloads/client_secret_XXXX.json
```

- Es erscheint ein Link → im Browser öffnen → mit dem Kanal-Konto anmelden → **den Kanal Wiki Roulette auswählen**.
- „Google hat diese App nicht überprüft“ → **Erweitert → Weiter zu Wiki Roulette Upload** → alle Häkchen erlauben.
- Im Terminal erscheint dreimal `✓ GitHub secret … saved`. Fertig.
- Danach die JSON-Datei löschen.

(In Claude Code kannst du den Befehl mit `!` davor direkt in die Eingabe schreiben. Es wird nichts Geheimes angezeigt.)

## Schritt 4 – Testen

GitHub → Repo **YT** → **Actions** → **Upload to YouTube** → **Run workflow**:
- episodes: `152`
- privacy: `private`

Danach in YouTube Studio prüfen, ob das Video mit Titel, Beschreibung und Playlist da ist.

## Täglich benutzen

**Actions → Upload to YouTube → Run workflow**:

| Feld | Beispiel | Bedeutung |
|---|---|---|
| episodes | `152 153 154 155` | Welche Shorts (müssen fertig gerendert sein) |
| slots | `15:00,18:00,21:00,23:00` | Veröffentlichungszeiten pro Tag (deutsche Zeit); die nächsten freien werden genommen |
| privacy | `scheduled` | privat hochladen, zur Slot-Zeit automatisch öffentlich |
| force | aus | nur an, wenn ein Video absichtlich nochmal hochgeladen werden soll |

Oder Claude sagen: „lade 156–159 hoch“ – Claude startet den Workflow.
Jeder Upload wird in `uploads/youtube.json` vermerkt (Video-Link, Zeitpunkt). Doppelte Uploads werden so verhindert.

**Danach pro Video in YouTube Studio (ca. 1–2 min):**
1. Video → **Untertitel/Sprachen** → Sprache hinzufügen: Deutsch, Spanisch, Französisch → jeweils **Audio** → die Datei
   `wiki_roulette_NNN_de.m4a` / `_es` / `_fr` aus dem Release hochladen.
2. Nach der Veröffentlichung: den **Kommentar zum Anpinnen** aus `uploads/NNN.md` posten und anpinnen.

## Grenzen, die man kennen muss

- **Neue Google-Projekte sind „ungeprüft“**: YouTube setzt API-Uploads solcher Projekte auf **privat (gesperrt)**,
  bis Google das Projekt geprüft hat. Bis dahin: In Studio jedes Video selbst auf „Öffentlich“ bzw. „Planen“ stellen.
  Prüfung beantragen: <https://support.google.com/youtube/contact/yt_api_form> („YouTube API Services – Audit and Quota Extension“).
  Das dauert oft einige Wochen. Ob dein Projekt betroffen ist, siehst du beim Test in Schritt 4.
- **Kontingent**: 10.000 Einheiten pro Tag, ein Upload kostet 1.600 → **maximal 6 Uploads pro Tag**. Für 4 Shorts reicht das.
- Tonspuren und angepinnte Kommentare: nur in Studio.

## Wenn etwas schiefgeht

- `secret YT_… is missing` → Schritt 3 wiederholen.
- `invalid_grant` → Die Anmeldung ist abgelaufen oder wurde widerrufen. Prüfe, ob der Status „In Produktion“ ist (Schritt 2.3), dann Schritt 3 wiederholen.
- `quotaExceeded` → Das Tageslimit ist erreicht, morgen weiter.
- `no release asset` → Die Folge ist noch nicht gerendert.
