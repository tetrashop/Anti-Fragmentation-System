import requests, json

GITHUB_USERNAME = "tetrashop"

# قوانین طبقه‌بندی بر اساس نام مخزن
BRANCH_RULES = {
    "1.0": ["data", "pipeline", "emotion", "intelligent", "formula", "ai", "ml", "neural", "learn", "model", "writer", "video"],
    "2.0": ["3d", "2d", "conversion", "converter", "img", "image", "gl", "graphic", "islamic", "game", "unity", "ui", "design", "fotball", "bale"],
    "3.0": ["anti", "fragment", "system", "integrated", "complete", "management", "managment", "server", "api", "bot", "boilerplate", "flask", "template", "sys", "hybrid"],
}

# نام شاخه‌ها (برای نمایش خوانا)
BRANCH_NAMES = {
    "1.0": "هوش مصنوعی و داده",
    "2.0": "گرافیک، 3D و رابط کاربری",
    "3.0": "سیستم، مدیریت و آنتی‌فراگمنتیشن",
    "4.0": "سایر",
}


def classify_repo(name):
    """طبقه‌بندی مخزن بر اساس نام"""
    n = name.lower()
    scores = {}
    for branch_id, keywords in BRANCH_RULES.items():
        scores[branch_id] = sum(1 for kw in keywords if kw in n)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "4.0"


def levenshtein_similarity(a, b):
    """فاصله لونشتاین برای تشخیص شباهت نام‌ها"""
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
    return 1 - (dp[m][n] / max(m, n))


def find_duplicates(repos, threshold=0.6):
    """تشخیص مخازن تکراری/مشابه"""
    names = [r["name"] for r in repos]
    duplicates = []
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            sim = levenshtein_similarity(names[i], names[j])
            if sim > threshold:
                duplicates.append({
                    "pair": (names[i], names[j]),
                    "similarity": round(sim, 2),
                    "branch": classify_repo(names[i]),
                })
    return duplicates


def build_tree(repos):
    """ساخت درخت طبقه‌بندی با شناسه‌های سلسله‌مراتبی"""
    tree = {"root": {"id": "0.0", "branches": {}}}
    for repo in repos:
        name = repo["name"]
        branch_id = classify_repo(name)
        branch = tree["root"]["branches"].setdefault(
            branch_id, {"name": BRANCH_NAMES.get(branch_id, "Branch"), "leaves": []}
        )
        idx = len(branch["leaves"]) + 1
        branch["leaves"].append({
            "name": name,
            "id": f"{branch_id}.{idx}",
            "url": repo.get("html_url", ""),
        })
    return tree


def run_anti_fragmentation():
    print("Fetching repositories from GitHub...")
    repos = requests.get(
        f"https://api.github.com/users/{GITHUB_USERNAME}/repos", timeout=30
    ).json()
    print(f"Found {len(repos)} repositories.\n")

    # طبقه‌بندی
    print("--- Classification ---")
    for r in repos:
        print(f"  {r['name']} -> {classify_repo(r['name'])}")

    # ساخت درخت
    tree = build_tree(repos)
    with open("tree_structure.json", "w") as f:
        json.dump(tree, f, indent=2, ensure_ascii=False)

    # نمایش خلاصه شاخه‌ها
    print("\n--- Structure Summary ---")
    for branch_id, branch in tree["root"]["branches"].items():
        print(f"  Branch {branch_id} ({branch['name']}): {len(branch['leaves'])} repos")

    # تشخیص تکراری
    print("\n--- Duplicate Detection ---")
    dupes = find_duplicates(repos)
    if dupes:
        print(f"Found {len(dupes)} potential duplicates:")
        for d in dupes:
            print(f"  - {d['pair'][0]}  <->  {d['pair'][1]}  (similarity: {d['similarity']})")
    else:
        print("No duplicates found.")

    print("\n--- Analysis Complete ---")
    print("Output saved to tree_structure.json")


if __name__ == "__main__":
    run_anti_fragmentation()
