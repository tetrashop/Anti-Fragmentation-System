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
    """شباهت لونشتاین (فاصله ویرایش) برای تشخیص نام‌های مشابه"""
    a, b = a.lower(), b.lower()
    # اگر یکی فقط حروف کوچک/بزرگ دیگری بود، بسیار مشابه‌اند
    if a == b:
        return 1.0
    # محاسبه شباهت ساده کاراکتری
    m, n = len(a), len(b)
    if m == 0 or n == 0:
        return 0.0
    # مقایسه کاراکتر به کاراکتر (شباهت ساده)
    common = sum(1 for i in range(min(m, n)) if a[i] == b[i])
    return common / max(m, n)

def find_duplicates_improved(repos):
    """تشخیص تکراری با ترکیب دو روش"""
    names = [r["name"] for r in repos]
    duplicates = []
    
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            n1, n2 = names[i], names[j]
            
            # روش ۱: شباهت جاکارد (کلمات)
            set1 = set(n1.lower().replace('-', '_').split('_'))
            set2 = set(n2.lower().replace('-', '_').split('_'))
            jac = len(set1.intersection(set2)) / len(set1.union(set2)) if (set1.union(set2)) else 0
            
            # روش ۲: شباهت کاراکتری (برای case-sensitive و نام‌های یک‌شکل)
            char_sim = levenshtein(n1, n2)
            
            # استفاده از بیشترین شباهت
            sim = max(jac, char_sim)
            if sim > 0.5:
                duplicates.append({
                    "pair": (n1, n2),
                    "jaccard": round(jac, 2),
                    "char_sim": round(char_sim, 2),
                    "final": round(sim, 2)
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

json.dump(tree, open("tree2.json", "w"), indent=2)

# تشخیص تکراری بهبودیافته
print("\n--- Improved Duplicate Detection ---")
dupes = find_duplicates_improved(repos)
if dupes:
    print(f"Found {len(dupes)} potential duplicates:")
    for d in dupes:
        print(f"  - {d['pair'][0]}  <->  {d['pair'][1]}  (char_sim: {d['char_sim']})")
else:
    print("No duplicates found.")

print("\nDONE")
