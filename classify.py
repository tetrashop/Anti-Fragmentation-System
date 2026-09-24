import requests, json

U = "tetrashop"

# قوانین طبقه‌بندی
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

def jaccard_similarity(str1, str2):
    """شباهت جاکارد بین دو رشته کلمات"""
    set1 = set(str1.lower().replace('-', '_').replace('.', '_').split('_'))
    set2 = set(str2.lower().replace('-', '_').replace('.', '_').split('_'))
    # حذف کلمات تکراری ناخواسته مثل نام کاربری
    common = set1.intersection(set2)
    union = set1.union(set2)
    return len(common) / len(union) if union else 0

def find_duplicates(repos):
    """پیدا کردن مخازن مشابه/تکراری"""
    duplicates = []
    names = [r["name"] for r in repos]
    
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            sim = jaccard_similarity(names[i], names[j])
            if sim > 0.3:  # آستانه شباهت
                duplicates.append({
                    "pair": (names[i], names[j]),
                    "score": round(sim, 2)
                })
    return duplicates

# دریافت مخازن
repos = requests.get(f"https://api.github.com/users/{U}/repos", timeout=30).json()
print(f"Found {len(repos)} repositories.\n")

# طبقه‌بندی و ساخت درخت
tree = {"root": {"id": "0.0", "branches": {}}}
for r in repos:
    n = r["name"]
    bid = classify(n)
    print(f"{n} -> {bid}")
    tree["root"]["branches"].setdefault(bid, {"leaves": []})["leaves"].append({
        "name": n, "url": r.get("html_url", "")
    })

# ذخیره درخت
json.dump(tree, open("tree2.json", "w"), indent=2)

# تشخیص تکراری
print("\n--- Duplicate Detection ---")
dupes = find_duplicates(repos)
if dupes:
    print(f"Found {len(dupes)} potential duplicates:")
    for d in dupes:
        print(f"  - {d['pair'][0]}  <->  {d['pair'][1]}  (similarity: {d['score']})")
else:
    print("No duplicates found.")

print("\nDONE")
