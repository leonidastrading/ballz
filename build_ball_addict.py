import csv, re, json

SRC_2026 = "/tmp/ballz/raw_ball_addict_2026.csv"
SRC_2025 = "/tmp/ballz/raw_ball_addict_2025.csv"
OUT = "/tmp/ballz/lib/dataBallAddict.js"

def fnum(s):
    if s is None:
        return None
    s = s.strip()
    if not s or s.upper() == "N/A":
        return None
    m = re.search(r"-?\d+(\.\d+)?", s)
    if not m:
        return None
    try:
        return float(m.group(0))
    except ValueError:
        return None

def frating10(s):
    # "8/10" -> 8.0
    v = fnum(s)
    return v

def fpercent_to_10(s):
    # "35%" -> 3.5 (on a /10 scale, to line up with the X/10 ratings from the other sheet)
    v = fnum(s)
    if v is None:
        return None
    return round(v / 10, 2)

with open(SRC_2026) as f:
    rows2026 = list(csv.reader(f))
h26 = [c.strip() for c in rows2026[0]]
idx26 = {h: i for i, h in enumerate(h26)}
data2026 = [r for r in rows2026[1:] if r and r[0].strip()]

with open(SRC_2025) as f:
    rows2025 = list(csv.reader(f))
h25 = [c.strip() for c in rows2025[0]]
idx25 = {h: i for i, h in enumerate(h25)}
data2025 = [r for r in rows2025[1:] if r and r[0].strip()]

def normalize(name):
    n = name.strip().lower()
    n = re.sub(r"\(?\b20(2[4-9]|3[0-9])\b\)?", "", n)
    n = re.sub(r"[^\w\s]", "", n)
    n = re.sub(r"\s+", " ", n).strip()
    return n

names2026_norm = {normalize(r[0]) for r in data2026}

NON_CONFORMING_PREFIXES = [
    "bigga", "snyder", "trust", "tiger cliff", "red lobster", "wright and ditson",
    "meijer", "piss missile", "sugar", "nexgen", "legato", "diawings",
    "athletic works", "parks trx", "clear black", "clear green", "mg senior",
]

def is_non_conforming(name):
    n = normalize(name)
    return any(n.startswith(p) for p in NON_CONFORMING_PREFIXES)

kept_2026 = [r for r in data2026 if not is_non_conforming(r[0])]
kept_2025 = []
for r in data2025:
    name = r[0]
    if normalize(name) in names2026_norm:
        continue
    if is_non_conforming(name):
        continue
    kept_2025.append(r)

CONDITIONS_BALL_ADDICT = [
    "Chipping", "Pitch", "50 Yard", "PW", "9 Iron", "7 Iron", "4H", "Driver",
]

def g(r, idx, key):
    if key not in idx:
        return None
    return r[idx[key]]

balls = []

for r in kept_2026:
    name = r[0].strip()
    conditions = {}
    conditions["Chipping"] = {
        "spin": fnum(g(r, idx26, "Chipping Spin")),
        "launch": fnum(g(r, idx26, "Chipping Launch")),
    }
    conditions["Pitch"] = {
        "spin": fnum(g(r, idx26, "Pitch Spin")),
        "launch": fnum(g(r, idx26, "Pitch Launch")),
    }
    conditions["9 Iron"] = {
        "carry": fnum(g(r, idx26, "9 Iron Carry")),
        "total": fnum(g(r, idx26, "9 Iron Distance")),
        "speed": fnum(g(r, idx26, "9I Ball Speed")),
        "spin": fnum(g(r, idx26, "9 Iron Spin")),
        "smash": fnum(g(r, idx26, "9I Smash Factor")),
        "launch": fnum(g(r, idx26, "9 Iron Launch")),
    }
    conditions["7 Iron"] = {
        "carry": fnum(g(r, idx26, "7 Iron Carry")),
        "total": fnum(g(r, idx26, "7 Iron Distance")),
        "speed": fnum(g(r, idx26, "7 Iron Ball Speed")),
        "spin": fnum(g(r, idx26, "7 Iron Spin")),
        "smash": fnum(g(r, idx26, "7 Iron Smash")),
        "launch": fnum(g(r, idx26, "7 Iron Launch")),
    }
    conditions["4H"] = {
        "carry": fnum(g(r, idx26, "4H Carry")),
        "total": fnum(g(r, idx26, "4H Distance")),
        "speed": fnum(g(r, idx26, "4H Ball Speed")),
        "spin": fnum(g(r, idx26, "4H Spin")),
        "smash": fnum(g(r, idx26, "4H Smash")),
        "launch": fnum(g(r, idx26, "4H Launch")),
    }
    conditions["Driver"] = {
        "carry": fnum(g(r, idx26, "Driver Carry")),
        "total": fnum(g(r, idx26, "Driver Distance")),
        "speed": fnum(g(r, idx26, "Driver Ball Speed")),
        "spin": fnum(g(r, idx26, "Driver Spin")),
        "smash": fnum(g(r, idx26, "Smash")),
        "launch": fnum(g(r, idx26, "Launch")),
    }
    ball = {
        "name": name,
        "source": "2026",
        "conditions": conditions,
        "compression": fnum(g(r, idx26, "Compression")),
        "dimples": fnum(g(r, idx26, "Dimples")),
        "price": fnum(g(r, idx26, "Price")),
        "accuracy": frating10(g(r, idx26, "Accuracy")),
        "consistency": frating10(g(r, idx26, "Consistency")),
        "durability": frating10(g(r, idx26, "Durability")),
        "forgiveness": frating10(g(r, idx26, "Forgiveness")),
        "feel": None,
        "missHitFeel": None,
        "value": None,
        "greenSpin": None,
        "cover": (g(r, idx26, "Cover") or "").strip() or None,
    }
    balls.append(ball)

for r in kept_2025:
    name = r[0].strip()
    conditions = {}
    conditions["50 Yard"] = {
        "spin": fnum(g(r, idx25, "50 Yard Spin")),
        "launch": fnum(g(r, idx25, "50 YD Launch")),
    }
    conditions["PW"] = {
        "carry": fnum(g(r, idx25, "PW Carry")),
        "total": fnum(g(r, idx25, "PW Distance")),
        "speed": fnum(g(r, idx25, "PW Ball Speed")),
        "spin": fnum(g(r, idx25, "PW Spin")),
        "smash": fnum(g(r, idx25, "PW Smash Factor")),
        "launch": fnum(g(r, idx25, "PW Launch")),
    }
    conditions["7 Iron"] = {
        "carry": fnum(g(r, idx25, "7 Iron Carry")),
        "total": fnum(g(r, idx25, "7 Iron Distance")),
        "speed": fnum(g(r, idx25, "7 Iron Ball Speed")),
        "spin": fnum(g(r, idx25, "7 Iron Spin")),
        "smash": fnum(g(r, idx25, "7 Iron Smash")),
        "launch": fnum(g(r, idx25, "7 Iron Launch")),
    }
    conditions["Driver"] = {
        "carry": fnum(g(r, idx25, "Driver Carry")),
        "total": fnum(g(r, idx25, "Driver Distance")),
        "speed": fnum(g(r, idx25, "Driver Ball Speed")),
        "spin": fnum(g(r, idx25, "Driver Spin")),
        "smash": fnum(g(r, idx25, "Driver Smash")),
        "launch": fnum(g(r, idx25, "Driver Launch")),
    }
    ball = {
        "name": name,
        "source": "2025",
        "conditions": conditions,
        "compression": fnum(g(r, idx25, "Compression")),
        "dimples": None,
        "price": None,
        "accuracy": fpercent_to_10(g(r, idx25, "Accuracy")),
        "consistency": frating10(g(r, idx25, "Consistency")),
        "durability": frating10(g(r, idx25, "Durability")),
        "forgiveness": frating10(g(r, idx25, "Forgiveness")),
        "feel": frating10(g(r, idx25, "Feel")),
        "missHitFeel": frating10(g(r, idx25, "Miss Hit Feel")),
        "value": frating10(g(r, idx25, "Value")),
        "greenSpin": fnum(g(r, idx25, "Green Spin")),
        "cover": None,
    }
    balls.append(ball)

assert len(balls) == len(kept_2026) + len(kept_2025)
names = [b["name"] for b in balls]
assert len(names) == len(set(n.lower() for n in names)), "unexpected duplicate names in final set"

out = []
out.append("// Auto-generated: cleaned/combined 2026 + 2025 golf ball data.")
out.append("// 2025-sheet balls already present in the 2026 sheet were removed (duplicates),")
out.append("// and any ball/brand not found on the official USGA Conforming Golf Ball List")
out.append("// (effective Aug 5 - Sep 1, 2026) was removed as non-conforming.")
out.append("// NOTE: 'accuracy' is normalized to a /10 scale for both sheets (2025 sheet's")
out.append("// raw value was a % — divided by 10 to line up with the 2026 sheet's X/10 rating).")
out.append("export const CONDITIONS_BALL_ADDICT = " + json.dumps(CONDITIONS_BALL_ADDICT) + ";")
out.append("")
out.append("export const BALLS_BALL_ADDICT = " + json.dumps(balls, indent=2) + ";")
out.append("")

with open(OUT, "w") as f:
    f.write("\n".join(out))

print("wrote", OUT)
print("total balls:", len(balls), "(2026:", len(kept_2026), ", 2025:", len(kept_2025), ")")
print(json.dumps(balls[0], indent=2)[:600])
print(json.dumps(balls[-1], indent=2)[:600])
