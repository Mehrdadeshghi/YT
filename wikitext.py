#!/usr/bin/env python3
"""Plain text of every article listed in catalog.txt ("Article | Category" rows) → dist/articles.md, for fact-checking scripts.
Runs in GitHub Actions next to catalog.py (the sandbox can't reach Wikipedia)."""
import json, time, urllib.parse, urllib.request
UA = {"User-Agent": "WikiRoulette-Facts/1.0 (https://github.com/Mehrdadeshghi/YT)"}
arts = [r.split('|')[0].strip() for r in open('catalog.txt') if '|' in r and not r.startswith('#')]
arts += [r[8:].strip() for r in open('catalog.txt') if r.lower().startswith('article:')]
out = ['# Article texts', '']
for a in arts:
    q = urllib.parse.urlencode({'action': 'query', 'prop': 'extracts', 'explaintext': 1, 'titles': a, 'redirects': 1, 'format': 'json', 'formatversion': 2})
    for k in range(3):
        try: p = json.load(urllib.request.urlopen(urllib.request.Request('https://en.wikipedia.org/w/api.php?' + q, headers=UA), timeout=40))['query']['pages'][0]; break
        except Exception as e: print('retry', a, e); time.sleep(3 + 3 * k); p = {}
    out += [f'## {p.get("title", a)}', '', p.get('extract', '(not found)'), '']
open('dist/articles.md', 'w').write('\n'.join(out)); print(len(arts), 'articles')
