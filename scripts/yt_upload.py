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
MAX_PER_RUN = 5                     # hard safety cap: never more than 5 uploads per run (= one day of slots), whatever the input says
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


def add_to_playlist(yt, vid, name):
    """playlistItems.insert; retries only on Google's transient 409/5xx (SERVICE_UNAVAILABLE right after an upload), never re-uploads"""
    import time
    from googleapiclient.errors import HttpError
    for wait in (0, 20, 60, 180):
        time.sleep(wait)
        try:
            yt.playlistItems().insert(part='snippet', body={'snippet': {'playlistId': playlist_id(yt, name), 'resourceId': {'kind': 'youtube#video', 'videoId': vid}}}).execute()
            print(f'  added to playlist "{name}"'); return True
        except HttpError as ex:
            if ex.resp.status not in (409, 500, 502, 503): print(f'  playlist failed: {ex}'); return False
            print(f'  playlist: Google busy ({ex.resp.status}), retry in {(20, 60, 180, 0)[(0, 20, 60, 180).index(wait)]} s' if wait != 180 else '  playlist: still busy, will be retried by --fix-playlists')
    return False


def fix_playlists():
    """add ledger videos whose playlist step failed (no upload)"""
    led = json.load(open(LEDGER)); yt = youtube()
    for ep, v in led.items():
        if v.get('playlist') and not v.get('in_playlist'):
            print(f'#{ep}: {v["url"]}'); v['in_playlist'] = add_to_playlist(yt, v['id'], v['playlist'])
    json.dump(led, open(LEDGER, 'w'), indent=1, ensure_ascii=False)


def stats():
    """read-only: public numbers of every upload (views, likes, comments, length) → stats.tsv + log, sorted by views"""
    import re as _re
    yt = youtube(); ch = yt.channels().list(part='contentDetails,statistics', mine=True).execute()['items'][0]
    up = ch['contentDetails']['relatedPlaylists']['uploads']; ids = []; req = yt.playlistItems().list(part='contentDetails', playlistId=up, maxResults=50)
    while req: r = req.execute(); ids += [i['contentDetails']['videoId'] for i in r['items']]; req = yt.playlistItems().list_next(req, r)
    rows = []
    for i in range(0, len(ids), 50):
        for v in yt.videos().list(part='snippet,statistics,contentDetails,status', id=','.join(ids[i:i + 50])).execute()['items']:
            d = v['contentDetails']['duration']; m = _re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', d); sec = int(m[1] or 0) * 3600 + int(m[2] or 0) * 60 + int(m[3] or 0)
            st = v['statistics']; rows.append([v['snippet']['publishedAt'][:10], int(st.get('viewCount', 0)), int(st.get('likeCount', 0)), int(st.get('commentCount', 0)), sec, v['status']['privacyStatus'], v['snippet']['title'][:80], v['id']])
    rows.sort(key=lambda r: -r[1])
    with open('stats.tsv', 'w') as f:
        f.write('published\tviews\tlikes\tcomments\tseconds\tprivacy\ttitle\tid\n'); [f.write('\t'.join(map(str, r)) + '\n') for r in rows]
    print(f'channel: {ch["statistics"]}  videos listed: {len(rows)}'); [print('\t'.join(map(str, r))) for r in rows]


def schedule_existing(yt, vid, at):
    """give an already uploaded, never published private video a publish time (videos.update keeps all other status fields)"""
    st = yt.videos().list(part='status', id=vid).execute()['items'][0]['status']
    if st.get('privacyStatus') != 'private' or st.get('publishAt'): print(f'  {vid}: not private/unscheduled ({st.get("privacyStatus")}, {st.get("publishAt")}) — left alone'); return False
    body = {k: st[k] for k in ('privacyStatus', 'selfDeclaredMadeForKids', 'containsSyntheticMedia', 'embeddable', 'license', 'publicStatsViewable') if k in st}
    body['publishAt'] = at
    r = yt.videos().update(part='status', body={'id': vid, 'status': body}).execute()['status']
    print(f'  scheduled {vid}: privacy {r.get("privacyStatus")} · publishAt {r.get("publishAt")}'); return r.get('publishAt') is not None


FOOTBALL = re.compile(r'football|soccer|world cup|champions|goal|corner|brazil|bayern|barcelona|chelsea|zidane|maracan|match|⚽', re.I)
JUNK = {'#banknifty', '#automobile', '#cryptocurrency', '#crypto'}


def retag():
    """remove misleading hashtags from old uploads (#football on non-football videos, unrelated finance/car tags, '##'); backup first"""
    yt = youtube()                                       # --dry-run still reads (needs the API), it only skips the updates
    ch = yt.channels().list(part='contentDetails', mine=True).execute()['items'][0]; up = ch['contentDetails']['relatedPlaylists']['uploads']
    ids = []; req = yt.playlistItems().list(part='contentDetails', playlistId=up, maxResults=50)
    while req: r = req.execute(); ids += [i['contentDetails']['videoId'] for i in r['items']]; req = yt.playlistItems().list_next(req, r)
    backup = json.load(open('uploads/retag_backup.json')) if os.path.exists('uploads/retag_backup.json') else {}
    changed = 0
    for i in range(0, len(ids), 50):
        for v in yt.videos().list(part='snippet', id=','.join(dict.fromkeys(ids[i:i + 50]))).execute()['items']:
            sn = v['snippet']; ctx = re.sub(r'#+\w+', ' ', sn['title'] + ' ' + sn.get('description', ''))   # topic words only, hashtags don't count
            bad = set(JUNK) | (set() if FOOTBALL.search(ctx) else {'#football'})
            def clean(text):
                if not (re.search(r'#{2,}', text) or any(re.search(rf'(?<!\w){re.escape(b)}(?!\w)', text, re.I) for b in bad)): return text
                text = re.sub(r'#{2,}(?=\w)', '#', text)
                for b in bad: text = re.sub(rf'(?<!\w){re.escape(b)}(?!\w)', '', text, flags=re.I)
                return re.sub(r'[ \t]{2,}', ' ', text).strip()
            nt, nd = clean(sn['title']), clean(sn.get('description', ''))
            tags = [t for t in sn.get('tags', []) if '#' + t.lower() not in bad]
            if (nt, nd, tags) == (sn['title'], sn.get('description', ''), sn.get('tags', [])): continue
            changed += 1; print(f'{v["id"]}: "{sn["title"][:60]}" → "{nt[:60]}"' + (' (description)' if nd != sn.get('description', '') else '') + (f' tags -{len(sn.get("tags", [])) - len(tags)}' if tags != sn.get('tags', []) else ''))
            if flag('dry-run'): continue
            backup.setdefault(v['id'], {k: sn.get(k) for k in ('title', 'description', 'tags', 'categoryId')})
            json.dump(backup, open('uploads/retag_backup.json', 'w'), indent=1, ensure_ascii=False)
            body = {'id': v['id'], 'snippet': {k: sn[k] for k in ('categoryId', 'defaultLanguage', 'defaultAudioLanguage') if k in sn}}
            body['snippet'].update(title=nt[:100], description=nd[:5000], tags=tags)
            yt.videos().update(part='snippet', body=body).execute()
    print(f'{changed} videos {"would change" if flag("dry-run") else "changed"} (backup: uploads/retag_backup.json)')


def main():
    if 'check' in args: return check()
    if 'retag' in args: return retag()
    if 'stats' in args: return stats()
    if 'fix-playlists' in args: return fix_playlists()
    led = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
    taken = {v.get('publishAt') for v in led.values()}
    if flag('queue'):                                   # autopilot: free slots in the next 36 h, queue order, only rendered episodes
        horizon = (dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=36)).strftime('%Y-%m-%dT%H:%M:%SZ')
        free = [s for s in next_slots(MAX_PER_RUN, taken) if s <= horizon]
        queue = [l.split('#')[0].strip().zfill(3) for l in open(QUEUE) if l.split('#')[0].strip()] if os.path.exists(QUEUE) else []
        todo = []
        pending = [e for e in queue if str(int(e)) in led and not led[str(int(e))].get('publishAt')]   # uploaded private (test) but never scheduled
        if pending and free and not flag('dry-run'):
            yt0 = youtube()
            for e in pending:
                if not free: break
                at = free.pop(0); print(f'#{e}: already uploaded privately → schedule')
                if schedule_existing(yt0, led[str(int(e))]['id'], at): led[str(int(e))]['publishAt'] = at; json.dump(led, open(LEDGER, 'w'), indent=1, ensure_ascii=False)
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
        led[str(int(e))] = {'id': vid, 'url': f'https://youtube.com/shorts/{vid}', 'publishAt': at, 'title': M['title'], 'playlist': M['playlist'], 'in_playlist': False}
        json.dump(led, open(LEDGER, 'w'), indent=1, ensure_ascii=False)          # write the ledger at once: an upload is never repeated
        if M['playlist']: led[str(int(e))]['in_playlist'] = add_to_playlist(yt, vid, M['playlist'])
        json.dump(led, open(LEDGER, 'w'), indent=1, ensure_ascii=False); os.remove(name)
    print('\nBy hand in YouTube Studio for each video: Languages → add DE/ES/FR audio tracks (release *_de/_es/_fr.m4a), pin the comment from the md.')


if __name__ == '__main__':
    main()
