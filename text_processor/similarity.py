import re
from collections import Counter

class SimilarityAnalyzer:
    """تحلیل شباهت دو متن با سه معیار"""
    def __init__(self):
        self._word = re.compile(r'[\w\u0600-\u06FF‌]+')

    def _tokens(self, t):
        return self._word.findall(t.lower())

    def _cosine(self, a, b):
        ca, cb = Counter(a), Counter(b)
        if not ca or not cb: return 0.0
        common = set(ca) & set(cb)
        num = sum(ca[k]*cb[k] for k in common)
        den = (sum(v*v for v in ca.values())**0.5) * (sum(v*v for v in cb.values())**0.5)
        return num/den if den else 0.0

    def _jaccard(self, a, b):
        sa, sb = set(a), set(b)
        return len(sa & sb)/len(sa | sb) if sa|sb else 0.0

    def _levenshtein_ratio(self, s1, s2):
        if not s1 or not s2: return 0.0
        if len(s1) > 500 or len(s2) > 500:
            s1, s2 = s1[:500], s2[:500]
        m, n = len(s1), len(s2)
        prev = list(range(n+1))
        for i in range(1, m+1):
            cur = [i] + [0]*n
            for j in range(1, n+1):
                cur[j] = min(prev[j]+1, cur[j-1]+1, prev[j-1] + (s1[i-1] != s2[j-1]))
            prev = cur
        return 1 - prev[n]/max(m, n)

    def compare(self, a, b):
        if not a or not b:
            return {'error': 'هر دو متن الزامی است'}
        ta, tb = self._tokens(a), self._tokens(b)
        cos = self._cosine(ta, tb)
        jac = self._jaccard(ta, tb)
        lev = self._levenshtein_ratio(a[:500], b[:500])
        avg = (cos + jac + lev) / 3
        if avg >= 0.75: verdict = 'بسیار مشابه (احتمال سرقت ادبی)'
        elif avg >= 0.5: verdict = 'نسبتاً مشابه'
        elif avg >= 0.25: verdict = 'کمی مشابه'
        else: verdict = 'متفاوت'
        return {
            'cosine': round(cos, 3), 'jaccard': round(jac, 3),
            'levenshtein': round(lev, 3), 'average': round(avg, 3),
            'verdict': verdict,
            'common_words': list(set(ta) & set(tb))[:15]
        }
