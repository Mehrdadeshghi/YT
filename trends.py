"""Search demand check (runs in GitHub Actions): Google Trends (web + YouTube search) for a list of topics,
normalised across groups with an anchor term, plus Google/YouTube autocomplete suggestions per topic.
trends.txt: first line "anchor: <term>", then one search term per line.  Output: dist/trends.md"""
import json, os, time, urllib.parse, urllib.request
from pytrends.request import TrendReq

rows = [l.strip() for l in open('trends.txt') if l.strip() and not l.startswith('#')]
anchor = rows[0].split(':', 1)[1].strip(); terms = rows[1:]
GEO = os.environ.get('GEO', '')                       # '' = worldwide
py = TrendReq(hl='en-US', tz=0, retries=3, backoff_factor=2, timeout=(10, 30))


def interest(prop):
    """average interest over 12 months for every term, scaled so that the anchor = 100"""
    out = {}
    for i in range(0, len(terms), 4):
        grp = [t for t in terms[i:i + 4] if t != anchor] + [anchor]
        for attempt in range(4):
            try:
                py.build_payload(grp, timeframe='today 12-m', geo=GEO, gprop=prop); df = py.interest_over_time(); break
            except Exception as e:
                print('retry', grp, e, flush=True); time.sleep(30 * (attempt + 1)); df = None
        if df is None or df.empty: continue
        a = max(df[anchor].mean(), 0.01)
        for t in grp:
            if t != anchor: out[t] = round(100 * df[t].mean() / a, 1)
        time.sleep(8)
    return out


def suggest(q, ds=''):
    url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&' + urllib.parse.urlencode({'q': q, 'ds': ds})
    try:
        return json.loads(urllib.request.urlopen(url, timeout=15).read().decode('utf-8', 'ignore'))[1][:8]
    except Exception as e:
        return [f'(error {e})']


web, yt = interest(''), interest('youtube')
os.makedirs('dist', exist_ok=True)
with open('dist/trends.md', 'w') as f:
    f.write(f'# Search demand (Google Trends, last 12 months, geo={GEO or "worldwide"})\n\nRelative interest, anchor "{anchor}" = 100.\n\n')
    f.write('| term | Google web | YouTube search |\n|---|---|---|\n')
    for t in sorted(terms, key=lambda t: -(yt.get(t, 0) + web.get(t, 0))):
        f.write(f'| {t} | {web.get(t, "n/a")} | {yt.get(t, "n/a")} |\n')
    f.write('\n## What people type (autocomplete)\n')
    for t in terms:
        f.write(f'\n**{t}**\n- YouTube: {"; ".join(suggest(t, "yt"))}\n- Google: {"; ".join(suggest(t))}\n')
print(open('dist/trends.md').read())
