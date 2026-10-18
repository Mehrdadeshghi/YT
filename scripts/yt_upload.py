#!/usr/bin/env python3
"""YouTube upload (runs in the "Upload to YouTube" workflow): python3 scripts/yt_upload.py 152 154 [--slots 21:00,23:00] [--privacy private] [--dry-run] [--force]
Autopilot (daily cron, no local computer needed): python3 scripts/yt_upload.py --queue → takes the next episodes from upload_queue.txt that are
rendered and not uploaded yet, and fills the free slots of the next 36 hours (at most MAX_PER_RUN per run, one video per slot).
For each episode: newest release asset wiki_roulette_<ep>.mp4 → videos.insert with everything from uploads/<ep>.md
(title, description, tags from the hashtags, category, made for kids, altered/synthetic content, DE/ES/FR titles as localizations),
scheduled into the next free slot (Europe/Berlin), added to the playlist named in the md (created if missing).
Not possible via the API: extra audio tracks (_de/_es/_fr.m4a) and pinning a comment → YouTube Studio by hand (docs/youtube-upload.md).
Credentials only from the env (GitHub secrets YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN); nothing secret is ever printed.
Ledger: uploads/youtube.json {ep: {id, url, publishAt}} — an episode in it is skipped unless --force."""
import datetime as dt, json, os, re, subprocess, sys
from zoneinfo import ZoneInfo

REPO = os.environ.get('GITHUB_REPOSITORY', 'Mehrdadeshghi/YT')
BERLIN = ZoneInfo('Europe/Berlin')
CATEGORIES = {'film & animation': '1', 'sports': '17', 'people & blogs': '22', 'entertainment': '24', 'education': '27', 'science & technology': '28'}
LEDGER = 'uploads/youtube.json'
QUEUE = 'upload_queue.txt'
MAX_PER_RUN = 4                     # hard safety cap: never more than 4 uploads per run, whatever the input says
args = sys.argv[1:]
opt = lambda k, d: args[args.index('--' + k) + 1] if '--' + k in args else d
flag = lambda k: '--' + k in args
EPS = [a.zfill(3) for a in args if re.fullmatch(r'\d{1,3}', a) and (args.index(a) == 0 or not args[args.index(a) - 1].startswith('--'))]
SLOTS = [s.strip() for s in opt('slots', '21:00').split(',') if s.strip()]          # daily publish times, German time
PRIVACY = opt('privacy', 'scheduled')                                               # scheduled | private | unlisted | public


def field(md, name):
    m = re.search(rf'^\*\*{re.escape(name)}\s*:\*\*\s*(.*)$', md, re.M); return m.group(1).strip() if m else ''


def parse(ep):
    """everything the upload needs from uploads/<ep>.md"""
    md = open(f'uploads/{int(ep)}.md' if os.path.exists(f'uploads/{int(ep)}.md') else f'uploads/{ep}.md').read()
    title = field(md, 'Title')
    m = re.search(r'^\*\*Description:\*\*\s*\n(.*?)(?=^\*\*[^*\n]+:\*\*)', md, re.S | re.M)
    desc = m.group(1).strip() if m else ''
    settings = field(md, 'Settings').replace('**', '')
    tags = [t.lstrip('#') for t in re.findall(r'(?<!\w)#[A-Za-z][\w]*', desc) if t.lower() != '#shorts']
    pl = re.search(r'Playlist\s+"([^"]+)"', settings)
    cat = re.search(r'Category:\s*([A-Za-z &]+?)\s*(?:·|$)', settings)
    loc = {}
    for lang, label in (('de', 'Titel'), ('es', 'Título'), ('fr', 'Titre ')):
        t = field(md, label) or field(md, label.strip())
        if t: loc[lang] = {'title': t[:100], 'description': desc[:5000]}
    kids = bool(re.search(r'Made for kids:\s*Yes', settings, re.I))
    synthetic = bool(re.search(r'Altered or synthetic content:\s*Yes', settings, re.I))
    if '#shorts' not in desc.lower() and '#shorts' not in title.lower(): desc += '\n\n#shorts'
    return dict(title=title[:100], description=desc[:5000], tags=tags[:30], playlist=pl.group(1) if pl else None,
                category=CATEGORIES.get((cat.group(1) if cat else 'education').strip().lower(), '27'), kids=kids, synthetic=synthetic, localizations=loc)


def has_asset(ep):
    try: find_asset(ep); return True
    except SystemExit: return False


def find_asset(ep):
    """newest release that has wiki_roulette_<ep>.mp4 → its download URL"""
    name = f'wiki_roulette_{int(ep)}.mp4'
    for alt in (name, f'wiki_roulette_{ep}.mp4'):
        out = subprocess.run(['gh', 'api', f'repos/{REPO}/releases?per_page=100', '--jq', f'[.[] | .assets[] | select(.name == "{alt}") | .browser_download_url][0]'],
                             capture_output=True, text=True).stdout.strip()
        if out and out != 'null': return out, alt
    sys.exit(f'#{ep}: no release asset {name} (render it first)')


def next_slots(n, taken):
    """the next n free publish times (Europe/Berlin daily SLOTS, at least 20 min from now), as UTC ISO strings"""
    now = dt.datetime.now(BERLIN) + dt.timedelta(minutes=20); out = []; day = now.date()
    while len(out) < n:
        for s in SLOTS:
            h, m = map(int, s.split(':')); t = dt.datetime(day.year, day.month, day.day, h, m, tzinfo=BERLIN)
            iso = t.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
            if t > now and iso not in taken and iso not in out: out.append(iso)
            if len(out) == n: break
        day += dt.timedelta(days=1)
    return out


def youtube():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'):
        if not os.environ.get(k): sys.exit(f'secret {k} is missing → docs/youtube-upload.md, step 3')
    c = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                    client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'])
    return build('youtube', 'v3', credentials=c, cache_discovery=False)


def playlist_id(yt, name, cache={}):
    if name in cache: return cache[name]
    req = yt.playlists().list(part='snippet', mine=True, maxResults=50)
    while req:
        r = req.execute()
        for p in r.get('items', []):
            if p['snippet']['title'].strip().lower() == name.lower(): cache[name] = p['id']; return p['id']
        req = yt.playlists().list_next(req, r)
    p = yt.playlists().insert(part='snippet,status', body={'snippet': {'title': name}, 'status': {'privacyStatus': 'public'}}).execute()
    print(f'  new playlist "{name}"'); cache[name] = p['id']; return p['id']


def check():
    """read-only: which channel the token belongs to (no upload, 1 quota unit)"""
    ch = youtube().channels().list(part='snippet,statistics,status', mine=True).execute().get('items', [])
    if not ch: sys.exit('the token has no YouTube channel')
    for c in ch:
        print(f'channel: {c["snippet"]["title"]} · id {c["id"]} · {c["statistics"].get("subscriberCount")} subscribers · {c["statistics"].get("videoCount")} videos · '
              f'long uploads {c.get("status", {}).get("longUploadsStatus")}')


def main():
    if 'check' in args: return check()
    led = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
    taken = {v.get('publishAt') for v in led.values()}
    if flag('queue'):                                   # autopilot: free slots in the next 36 h, queue order, only rendered episodes
        horizon = (dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=36)).strftime('%Y-%m-%dT%H:%M:%SZ')
        free = [s for s in next_slots(MAX_PER_RUN, taken) if s <= horizon]
        queue = [l.split('#')[0].strip().zfill(3) for l in open(QUEUE) if l.split('#')[0].strip()] if os.path.exists(QUEUE) else []
        todo = []
        for e in queue:
            if len(todo) == len(free): break
            if str(int(e)) in led: continue
            if has_asset(e): todo.append(e)
            else: print(f'#{e}: in the queue but not rendered yet — skipped for now')
        if not todo: print(f'nothing to upload (free slots in the next 36 h: {len(free)}, waiting in the queue: {len([e for e in queue if str(int(e)) not in led])})'); return
        when = free[:len(todo)]
    else:
        if not EPS: sys.exit(__doc__)
        todo = [e for e in EPS if flag('force') or str(int(e)) not in led]
        for e in EPS:
            if e not in todo: print(f'#{e}: already uploaded → {led[str(int(e))]["url"]} (use --force to upload again)')
        if len(todo) > MAX_PER_RUN: print(f'safety cap: only the first {MAX_PER_RUN} of {len(todo)} are uploaded in this run'); todo = todo[:MAX_PER_RUN]
        when = next_slots(len(todo), taken) if PRIVACY == 'scheduled' else [None] * len(todo)
    yt = None if flag('dry-run') else youtube()
    for e, at in zip(todo, when):
        M = parse(e); url, name = find_asset(e)
        status = {'privacyStatus': 'private' if PRIVACY == 'scheduled' else PRIVACY, 'selfDeclaredMadeForKids': M['kids'], 'containsSyntheticMedia': M['synthetic'], 'embeddable': True}
        if at: status['publishAt'] = at
        body = {'snippet': {'title': M['title'], 'description': M['description'], 'tags': M['tags'], 'categoryId': M['category'],
                            'defaultLanguage': 'en', 'defaultAudioLanguage': 'en'}, 'status': status, 'localizations': M['localizations']}
        local = dt.datetime.fromisoformat(at.replace('Z', '+00:00')).astimezone(BERLIN).strftime('%a %d.%m. %H:%M') if at else PRIVACY
        print(f'#{e}: "{M["title"]}" · {local} · playlist {M["playlist"]} · category {M["category"]} · kids {M["kids"]} · synthetic {M["synthetic"]} · '
              f'{len(M["tags"])} tags · titles {"/".join(M["localizations"]) or "-"}')
        if flag('dry-run'): print('  (dry run)', name, url); continue
        subprocess.run(['curl', '-sSLf', '-o', name, url], check=True)
        from googleapiclient.http import MediaFileUpload
        req = yt.videos().insert(part='snippet,status,localizations', body=body, media_body=MediaFileUpload(name, mimetype='video/mp4', chunksize=8 << 20, resumable=True))
        resp = None
        while resp is None: _, resp = req.next_chunk()
        vid = resp['id']; print(f'  uploaded → https://youtube.com/shorts/{vid}')
        chk = yt.videos().list(part='status,snippet,localizations', id=vid).execute().get('items', [{}])[0]; st = chk.get('status', {})
        print(f'  YouTube has: privacy {st.get("privacyStatus")} · publishAt {st.get("publishAt")} · upload {st.get("uploadStatus")} · madeForKids {st.get("selfDeclaredMadeForKids")} · '
              f'synthetic {st.get("containsSyntheticMedia")} · titles {"/".join(chk.get("localizations", {})) or "-"}')
        if M['playlist']:
            try: yt.playlistItems().insert(part='snippet', body={'snippet': {'playlistId': playlist_id(yt, M['playlist']), 'resourceId': {'kind': 'youtube#video', 'videoId': vid}}}).execute()
            except Exception as ex: print(f'  playlist failed: {ex}')
        led[str(int(e))] = {'id': vid, 'url': f'https://youtube.com/shorts/{vid}', 'publishAt': at, 'title': M['title']}
        json.dump(led, open(LEDGER, 'w'), indent=1, ensure_ascii=False); os.remove(name)
    print('\nBy hand in YouTube Studio for each video: Languages → add DE/ES/FR audio tracks (release *_de/_es/_fr.m4a), pin the comment from the md.')


if __name__ == '__main__':
    main()
