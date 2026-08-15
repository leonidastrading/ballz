import json, re

BASE = "/tmp/ballz/lib/"

def load_arr(fname, varname):
    with open(BASE + fname) as f:
        src = f.read()
    m = re.search(r'export const ' + varname + r' = (\[.*\]);', src, re.S)
    start, end = m.span(1)
    return src, start, end, json.loads(m.group(1))

def normalize(name):
    n = name.strip().lower()
    n = re.sub(r"\(?\b20(2[4-9]|3[0-9])\b\)?", "", n)
    n = re.sub(r"[^\w\s]", "", n)
    n = re.sub(r"\s+", " ", n).strip()
    return n

# ---- 1) known-good lookup from real source data (2024 Today's Golfer sheet + Ball Addict's 2026-sheet Cover column) ----
_, _, _, data2024 = load_arr("data2024.js", "BALLS_2024")
_, _, _, dataBA = load_arr("dataBallAddict.js", "BALLS_BALL_ADDICT")

lookup = {}
for b in data2024:
    if b.get("cover"):
        lookup[normalize(b["name"])] = b["cover"]
for b in dataBA:
    if b.get("cover"):
        lookup.setdefault(normalize(b["name"]), b["cover"])

# ---- 2) manual researched overrides for balls not present in either source sheet's own material data ----
# Researched via web search (manufacturer/retailer/reviewer sources) since these balls' cover material
# isn't present in any of our uploaded CSVs.
MANUAL = {
    "amazon basics": "Ionomer",
    "amazon basics core soft": "Ionomer",
    "bridgestone tour b rx": "Urethane",
    "bridgestone tour b rxs": "Urethane",
    "bridgestone tour b x": "Urethane",
    "bridgestone tour b xs": "Urethane",
    "bridgestone e12 straight": "Ionomer",
    "bridgestone e12 hilaunch": "Ionomer",
    "bridgestone e12 speed": "Ionomer",
    "bridgestone e6 soft feel": "Ionomer",
    "callaway chrome tour triple diamond": "Urethane",
    "callaway triple diamond": "Urethane",
    "callaway erc soft": "Urethane",
    "callaway supersoft": "Ionomer",
    "callaway warbird": "Ionomer",
    "callaway warbird distance": "Ionomer",
    "kirkland performance white": "Urethane",
    "kirkland performance yellow": "Urethane",
    "kirkland performance v35": "Urethane",
    "kirkland signature v30": "Urethane",
    "maxfli softfli": "Ionomer",
    "maxfli straightfli": "Ionomer",
    "maxfli trifli": "Ionomer",
    "maxfli revolution": "Ionomer",
    "members mark pro series 2": "Urethane",
    "members mark": "Urethane",
    "mizuno pro s": "Urethane",
    "mizuno pro x": "Urethane",
    "mizuno rb max": "Urethane",
    "mizuno rb 566": "Ionomer",
    "pxg tour": "Urethane",
    "pxg tour x": "Urethane",
    "pxg xtreme tour": "Urethane",
    "pxg xtreme tour x": "Urethane",
    "pinnacle rush": "Ionomer",
    "pinnacle soft": "Ionomer",
    "pinnacle distance": "Ionomer",
    "seed sd 15 country mile": "Ionomer",
    "snell pr3": "Urethane",
    "snell pr4": "Urethane",
    "snell prime pr3": "Urethane",
    "snell prime pr4": "Urethane",
    "srixon qstar ultispeed": "Ionomer",
    "srixon qstar ad333": "Ionomer",
    "srixon ultispeed": "Ionomer",
    "srixon ultispeed line": "Ionomer",
    "srixon soft feel": "Ionomer",
    "srixon ultisoft": "Ionomer",
    "srixon zstar": "Urethane",
    "srixon zstar diamond": "Urethane",
    "srixon zstar divide": "Urethane",
    "srixon zstar xv": "Urethane",
    "taylormade distance": "Ionomer",
    "taylormade tour response": "Urethane",
    "titleist pro v1x left dash": "Urethane",
    "titleist tour soft": "Ionomer",
    "titleist trufeel": "Ionomer",
    "titleist velocity": "Ionomer",
    "tour edge exotics": "Urethane",
    "tour edge hot launch": "Ionomer",
    "vice drive": "Ionomer",
    "wilson duo soft": "Ionomer",
    "wilson triad": "Urethane",
}

def resolve_cover(name, existing):
    if existing:
        return existing
    n = normalize(name)
    if n in lookup:
        return lookup[n]
    if n in MANUAL:
        return MANUAL[n]
    # try prefix match against MANUAL keys for names with extra trailing words
    for k, v in MANUAL.items():
        if n.startswith(k):
            return v
    return None

report = {}

def patch_file(fname, varname):
    src, start, end, arr = load_arr(fname, varname)
    filled = 0
    still_missing = []
    for b in arr:
        resolved = resolve_cover(b["name"], b.get("cover"))
        if resolved and not b.get("cover"):
            filled += 1
        if resolved:
            b["cover"] = resolved
        else:
            still_missing.append(b["name"])
    new_json = json.dumps(arr, indent=2)
    new_src = src[:start] + new_json + src[end:]
    with open(BASE + fname, "w") as f:
        f.write(new_src)
    report[fname] = (filled, len(arr), still_missing)

patch_file("data.js", "BALLS")
patch_file("data2025.js", "BALLS_2025")
patch_file("dataMgs2025.js", "BALLS_MGS2025")
patch_file("dataBallAddict.js", "BALLS_BALL_ADDICT")

for fname, (filled, total, missing) in report.items():
    print(f"{fname}: filled {filled} (total {total}), still missing {len(missing)}")
    for m in missing:
        print("   -", m)
