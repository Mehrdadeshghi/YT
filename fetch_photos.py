#!/usr/bin/env python3
"""
Wiki Roulette: fetch the real photos an episode asks for (runs in GitHub Actions, not in Claude's sandbox).

    python3 fetch_photos.py 020 022 023

Each episode JSON may list  "photos": [{"id": "lead", "article": "Jeanne Calment"},
                                        {"id": "sign", "article": "Monowi, Nebraska", "match": "sign"}]
  id       name the visuals use:  photo(t, 'lead', ...)
  article  English Wikipedia article to take the image from
  match    optional: pick the first article image whose file name contains this word; default = ONLY the article's lead image
  file     optional: an exact Wikimedia Commons file ("File:Greenland shark profile.jpg"), hand-picked from catalog.md
           (no article needed). The licence check still applies.
Only freely licensed files (public domain / CC0 / CC BY / CC BY-SA) are used.
Writes assets/photos/<ep>_<id>.jpg and assets/photos/<ep>.credits.json (author, license, source page).
If a photo can't be found, the episode renders with its drawn fallback.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

API = "https://en.wikipedia.org/w/api.php"
UA = {"User-Agent": "WikiRoulette-PhotoFetcher/1.0 (https://github.com/Mehrdadeshghi/YT)"}
FREE = re.compile(r"(public domain|^pd|cc0|cc[- ]by)", re.I)
OUT, WIDTH = "assets/photos", 1600

def api(**p):
    p.update(format="json", formatversion="2")
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(p), headers=UA)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            print("   retry", e); time.sleep(2 + attempt * 3)
    raise RuntimeError("api failed")

def clean(html): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()

def candidates(article, match, file=None):
    if file: return [file if file.startswith("File:") else "File:" + file]
    page = api(action="query", titles=article, prop="pageimages|images", piprop="name", imlimit="max", redirects=1)["query"]["pages"][0]
    names = [i["title"] for i in page.get("images", []) if i["title"].lower().endswith((".jpg", ".jpeg", ".png"))]
    lead = page.get("pageimage")
    if match:   # explicit choice: only files whose name contains the match word
        return [n for n in names if match.lower() in n.lower()]
    # default: ONLY the article's lead image. Other images in an article can be unrelated
    # (navboxes, comparisons), so no fallback: a missing lead image means the drawn version is used.
    # Other article images can be maps, comparisons or unrelated (Labrador in #038, "Tsar_Bomba_Paris.png" in #055),
    # so there is deliberately no fallback: a missing lead image means the drawn version is used.
    return [f"File:{lead}"] if lead else []

def fetch(ep, spec, credits):
    for name in candidates(spec.get("article"), spec.get("match"), spec.get("file"))[:12]:
        info = api(action="query", titles=name, prop="imageinfo", iiprop="url|size|extmetadata", iiurlwidth=WIDTH)["query"]["pages"][0]
        if "imageinfo" not in info: continue
        ii = info["imageinfo"][0]; meta = ii.get("extmetadata", {})
        lic = clean(meta.get("LicenseShortName", {}).get("value"))
        if not FREE.search(lic) or max(ii.get("width", 0), ii.get("thumbwidth", 0)) < (360 if spec.get("file") else 480):
            print(f"   skip {name} ({lic or 'no license'}, {ii.get('width')} px)"); continue
        url = ii.get("thumburl") or ii["url"]; dst = f"{OUT}/{ep}_{spec['id']}.jpg"
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r: data = r.read()
        if not data.startswith(b"\xff\xd8"):   # png/svg thumbnails → convert to jpg on a paper-white background
            from PIL import Image; import io
            im = Image.open(io.BytesIO(data)).convert("RGBA"); bg = Image.new("RGB", im.size, (242, 238, 230)); bg.paste(im, mask=im.split()[3])
            buf = io.BytesIO(); bg.save(buf, "JPEG", quality=92); data = buf.getvalue()
        open(dst, "wb").write(data)
        author = clean(re.sub(r"<[^>]+>", " ", meta.get("Artist", {}).get("value") or "")) or "unknown"
        if re.search(r"unknown author|anonymous", author, re.I): author = "Unknown author"
        credits[spec["id"]] = {"file": name, "author": author[:80], "license": lic, "page": ii.get("descriptionurl"),
                               "credit": f"Photo: {author[:40]} / {lic}"}
        print(f"   ok   {dst} <- {name} [{lic}]"); return
    print(f"   none found for {spec}")

def fetch_video(ep, spec, credits):
    """{"id": "x", "video": "File:….webm", "from": 12, "len": 5} → assets/clips/<ep>_<id>/0001.jpg … (30 fps, 1080 px wide)"""
    import subprocess, shutil, tempfile
    name = spec["video"] if spec["video"].startswith("File:") else "File:" + spec["video"]
    q = api(action="query", titles=name, prop="videoinfo", viprop="url|size|derivatives|extmetadata")["query"]["pages"][0]
    vi = (q.get("videoinfo") or [{}])[0]; meta = vi.get("extmetadata", {}); lic = clean(meta.get("LicenseShortName", {}).get("value"))
    if not vi or not FREE.search(lic): print(f"   skip video {name} ({lic or 'no license'})"); return
    ders = sorted([d for d in vi.get("derivatives", []) if d.get("height") and d["height"] <= 1080 and "webm" in d.get("type", "") + d.get("src", "")],
                  key=lambda d: -d["height"])
    url = ders[0]["src"] if ders else vi["url"]
    tmp = tempfile.mkdtemp(); src = os.path.join(tmp, "v")
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r, open(src, "wb") as f: shutil.copyfileobj(r, f)
    out = f"assets/clips/{ep}_{spec['id']}"; shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(spec.get("from", 0)), "-t", str(spec.get("len", 5)), "-i", src,
                    "-vf", "fps=30,scale=1080:-2", "-q:v", "3", f"{out}/%04d.jpg"], check=True)
    n = len([x for x in os.listdir(out) if x.endswith(".jpg")]); shutil.copy(f"{out}/0001.jpg", f"{OUT}/{ep}_{spec['id']}.jpg")
    author = clean(re.sub(r"<[^>]+>", " ", meta.get("Artist", {}).get("value") or "")) or "unknown"
    credits[spec["id"]] = {"file": name, "author": author[:80], "license": lic, "page": vi.get("descriptionurl"), "frames": n,
                           "credit": f"Video: {author[:40]} / {lic}"}
    print(f"   ok   {out} ({n} frames) <- {name} [{lic}] via {url[-40:]}")

os.makedirs(OUT, exist_ok=True)
for ep in sys.argv[1:]:
    E = json.load(open(f"episodes/{ep}.json")); credits = {}
    print(f"== {ep} {E.get('title')}")
    for spec in E.get("photos", []):
        try: fetch_video(ep, spec, credits) if spec.get("video") else fetch(ep, spec, credits)
        except Exception as e: print("   error", spec, e)
    json.dump(credits, open(f"{OUT}/{ep}.credits.json", "w"), indent=1, ensure_ascii=False)
