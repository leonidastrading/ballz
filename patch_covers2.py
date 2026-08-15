import json, re

BASE = "/tmp/ballz/lib/"

def normalize(name):
    n = name.strip().lower()
    n = re.sub(r"\(?\b20(2[4-9]|3[0-9])\b\)?", "", n)
    n = re.sub(r"[^\w\s]", "", n)
    n = re.sub(r"\s+", " ", n).strip()
    return n

# Exact-name overrides (researched via web search), keyed by normalize() of the literal
# ball name as it appears in the source spreadsheets.
EXACT = {
    "seed sd 15": "Ionomer",
    "bridgestone e12 high launch": "Ionomer",
    "wilson zip": "Ionomer",
    "wilson duo 360": "Ionomer",
    "callaway hex soft": "Ionomer",
    "taylormade speedsoft ink": "Ionomer",
    "snell 20": "Urethane",
    "taylormade speedsoft yellow": "Ionomer",
    "taylormade speedsoft white": "Ionomer",
    "srixon z star": "Urethane",
    "top flite control": "Ionomer",
    "bridgestone e12 splash dry": "Ionomer",
    "kirkland v3": "Urethane",
    "vice pro junior": "Urethane",
    "snell 40": "Urethane",
    "volvik radiance": "Ionomer",
    "bridgestone electron": "Ionomer",
    "vice junior tour": "Urethane",
    "bridgestone e6 soft": "Ionomer",
    "srixon z star diamond": "Urethane",
    "volvik magma": "Ionomer",
    "srixon z star xv": "Urethane",
    "bridgestone distance force": "Ionomer",
    "bridgestone boom it": "Ionomer",
    "snell get sum": "Ionomer",
    "volvik xt soft": "Ionomer",
    "volvik power soft": "Ionomer",
    "snell 30": "Urethane",
    "bridgestone e12 splash wet": "Ionomer",
    "volvik crystal soft": "Ionomer",
    "callaway cxr power": "Ionomer",
    "inesis 500 soft": "Ionomer",
    "volvik vivid combi": "Ionomer",
    "precept laddie extreme": "Ionomer",
    "penfold hearts": "Ionomer",
    "nitro ultimate distance": "Ionomer",
    "volvik vimat": "Ionomer",
    "oncore elixr": "Urethane",
    "seed sd 05 pro feel": "Urethane",
    "volvik vivid soft": "Ionomer",
    "volvik condor": "Ionomer",
    "callaway superfast": "Ionomer",
    "volvik axia": "Ionomer",
    "volvik crystal combi": "Ionomer",
    "top flite gamer": "Ionomer",
    "precept power drive": "Ionomer",
    "volvik vista3": "Ionomer",
    "titleist pro v1xleft dash": "Urethane",
    "titleist pro v1 left dot": "Urethane",
    "vice pro drip": "Urethane",
    "wilson boost": "Ionomer",
    "top flite xl distance": "Ionomer",
    "wilson staff x": "Urethane",
    "honma twx": "Urethane",
    "honma d1": "Ionomer",
    "callaway diablo": "Ionomer",
    "inesis 900 tour": "Urethane",
    "honma tws": "Urethane",
    "penfold ace": "Ionomer",
    "taylormade tp5 x": "Urethane",
    "vice moon rock": "Urethane",
    "vice pro tan": "Urethane",
    "inesis 100 distance": "Ionomer",
    "vice pro white": "Urethane",
    "vice tour sketch": "Ionomer",
}

def load_arr(fname, varname):
    with open(BASE + fname) as f:
        src = f.read()
    m = re.search(r'export const ' + varname + r' = (\[.*\]);', src, re.S)
    start, end = m.span(1)
    return src, start, end, json.loads(m.group(1))

def patch_file(fname, varname):
    src, start, end, arr = load_arr(fname, varname)
    filled = 0
    still_missing = []
    for b in arr:
        if b.get("cover"):
            continue
        n = normalize(b["name"])
        if n in EXACT:
            b["cover"] = EXACT[n]
            filled += 1
        else:
            still_missing.append(b["name"])
    new_json = json.dumps(arr, indent=2)
    new_src = src[:start] + new_json + src[end:]
    with open(BASE + fname, "w") as f:
        f.write(new_src)
    print(f"{fname}: filled {filled} more, still missing {len(still_missing)}")
    for m in still_missing:
        print("   -", m)

patch_file("data2025.js", "BALLS_2025")
patch_file("dataBallAddict.js", "BALLS_BALL_ADDICT")
patch_file("data.js", "BALLS")
patch_file("dataMgs2025.js", "BALLS_MGS2025")
