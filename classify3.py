import requests, json

U = "tetrashop"

R = {
    "2.0": ["3d", "2d", "conversion", "converter", "img", "image", "gl", "graphic", "islamic", "game", "unity", "ui", "design", "fotball", "bale"],
    "1.0": ["data", "pipeline", "emotion", "intelligent", "formula", "ai", "ml", "neural", "learn", "model", "writer", "video"],
    "3.0": ["anti", "fragment", "system", "integrated", "complete", "management", "managment", "server", "api", "bot", "boilerplate", "flask", "template", "sys", "hybrid"],
}

def classify(name):
    n = name.lower()
    s = {}
    for bid, kws in R.items():
        s[bid] = sum(1 for kw in kws if kw in n)
    best = max(s, key=s.get)
    return best if s[best] > 0 else "4.0"

def levenshtein(a, b):
    """محاسبه فاصله لونشتاین واقعی"""
    a, b = a.lower(), b.lower()
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i-1] == b[j-1] else 1
            dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)
    # شباهت = 1 - (فاصله / حداکثر طول)
    return 1 - (dp[m][n] / max(m, n))

def find_duplicates(repos):
    """تشخیص تکراری دقیق با لونشتاین"""
    names = [r["name"] for r in repos]
    duplicates = []
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            sim = levenshtein(names[i], names[j])
            if sim > 0.6:
                duplicates.append({
                    "pair": (names[i], names[j]),
                    "similarity": round(sim, 2)
                })
    return duplicates

repos = requests.get(f"https://api.github.com/users/{U}/repos", timeout=30).json()
print(f"Found {len(repos)} repositories.\n")

tree = {"root": {"id": "0.0", "branches": {}}}
for r in repos:
    n = r["name"]
    bid = classify(n)
    print(f"{n} -> {bid}")
    tree["root"]["branches"].setdefault(bid, {"leaves": []})["leaves"].append({
        "name": n, "url": r.get("html_url", "")
    })

json.dump(tree, open("tree2.json", "w"), indent=2)

print("\n--- Duplicate Detection (Levenshtein) ---")
dupes = find_duplicates(repos)
if dupes:
    print(f"Found {len(dupes)} potential duplicates:")
    for d in dupes:
        print(f"  - {d['pair'][0]}  <->  {d['pair'][1]}  (similarity: {d['similarity']})")
else:
    print("No duplicates found.")

print("\nDONE")
