#!/usr/bin/env python3
"""Photo catalog (runs in GitHub Actions): for each line in catalog.txt  ->  "Article title | Commons category (optional)"
lists every image used in the article plus the files in the Commons category, with size, licence and description,
so specific files can be chosen by name for an episode ("photos": [{"id": "x", "file": "File:…"}])."""
import json, re, sys, time, urllib.parse, urllib.request
UA = {"User-Agent": "WikiRoulette-Catalog/1.0 (https://github.com/Mehrdadeshghi/YT)"}
def api(base, **p):
    p.update(format="json", formatversion="2"); req = urllib.request.Request(base + "?" + urllib.parse.urlencode(p), headers=UA)
    for a in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r: return json.load(r)
        except Exception as e: print("retry", e, file=sys.stderr); time.sleep(3 + a * 3)
    return {}
WP, CM = "https://en.wikipedia.org/w/api.php", "https://commons.wikimedia.org/w/api.php"
clean = lambda h: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h or "")).strip()
def info(names):
    out = []
    for i in range(0, len(names), 40):
        q = api(CM, action="query", titles="|".join(names[i:i + 40]), prop="imageinfo", iiprop="size|mime|extmetadata", iiextmetadatafilter="LicenseShortName|ImageDescription|Artist")
        for p in q.get("query", {}).get("pages", []):
            ii = (p.get("imageinfo") or [{}])[0]; m = ii.get("extmetadata", {})
            out.append((p["title"], f'{ii.get("width")}x{ii.get("height")}' + (f' {ii["duration"]:.0f}s' if ii.get("duration") else ""), "", ii.get("mime"), clean(m.get("LicenseShortName", {}).get("value")), clean(m.get("Artist", {}).get("value"))[:60], clean(m.get("ImageDescription", {}).get("value"))[:220]))
    return out
lines = ["# Photo catalog", ""]
for row in open("catalog.txt"):
    row = row.strip()
    if not row or row.startswith("#"): continue
    if row.lower().startswith(("video:", "image:")):   # "video: goblin shark" / "image: frost" → free files on Commons matching the words
        kind, q = row[:5].upper(), row[6:].strip(); ft = "video" if kind == "VIDEO" else "bitmap"
        hits = api(CM, action="query", list="search", srnamespace=6, srsearch=f"{q} filetype:{ft}", srlimit=20).get("query", {}).get("search", [])
        lines += [f"## {kind}S: {q}"] + [f"- {t} | {w} | {lic} | {who} | {d}" for t, w, h, mt, lic, who, d in info([h["title"] for h in hits])] + [""]
        continue
    art, _, cat = [x.strip() for x in row.partition("|")]
    pg = api(WP, action="query", titles=art, prop="images|pageimages", piprop="name", imlimit="max", redirects=1).get("query", {}).get("pages", [{}])[0]
    names = [i["title"] for i in pg.get("images", []) if re.search(r"\.(jpe?g|png|tiff?|svg)$", i["title"], re.I)]
    lines += [f"## {art}", f"lead: File:{pg.get('pageimage')}", "", "### in the article"]
    lines += [f"- {t} | {w} | {lic} | {who} | {d}" for t, w, h, mt, lic, who, d in info(names)]
    if cat:
        mem = api(CM, action="query", list="categorymembers", cmtitle=f"Category:{cat}", cmtype="file", cmlimit="80").get("query", {}).get("categorymembers", [])
        lines += ["", f"### Commons category: {cat}"] + [f"- {t} | {w} | {lic} | {who} | {d}" for t, w, h, mt, lic, who, d in info([m['title'] for m in mem])]
    lines.append("")
open("dist/catalog.md", "w").write("\n".join(lines)); print("\n".join(lines)[:3000])
