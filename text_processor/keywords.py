import re
from collections import Counter

class KeywordExtractor:
    """استخراج کلیدواژه با روش فرکانس-وزنی"""
    
    STOP_WORDS = set('''و در به از که با این را بر آن تا هم یا اگر اما پس چرا چه چون هر یک هیچ همه نیز ولی بود شد است هست نیست می‌شود می‌کند دارد برای بین خود وی او ما شما آنها همین همان یکی دیگر برخی چند ضمن طبق اساس نظر طریق سوی روی زیر بالا همچنین بنابراین علاوه'''.split())
    
    def __init__(self, top_n=10):
        self.top_n = top_n
        self._word_re = re.compile(r'[\w\u0600-\u06FF‌]+')
    
    def extract(self, text):
        if not text:
            return {"keywords": []}
        
        words = self._word_re.findall(text.lower())
        filtered = [w for w in words if w not in self.STOP_WORDS and len(w) > 3]
        
        if not filtered:
            return {"keywords": []}
        
        counts = Counter(filtered)
        bigrams = Counter()
        for i in range(len(filtered) - 1):
            bigrams[f"{filtered[i]} {filtered[i+1]}"] += 1
        
        top_words = [(w, c, 'unigram') for w, c in counts.most_common(self.top_n * 2)]
        top_bigrams = [(w, c, 'bigram') for w, c in bigrams.most_common(self.top_n) if c >= 2]
        
        all_kw = top_words + top_bigrams
        all_kw.sort(key=lambda x: x[1] * (1.5 if x[2] == 'bigram' else 1.0), reverse=True)
        
        return {
            "keywords": [{"word": w, "frequency": c, "type": t} 
                        for w, c, t in all_kw[:self.top_n]],
            "total_words": len(words),
            "unique_words": len(counts)
        }
