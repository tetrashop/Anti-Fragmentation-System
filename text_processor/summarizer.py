import re
from collections import Counter

class Summarizer:
    """خلاصه‌ساز استخراجی مبتنی بر فرکانس واژگان"""
    
    STOP_WORDS = set('''و در به از که با این را بر آن تا هم یا اگر اما پس چرا چه چون هر یک هیچ همه نیز ولی بود شد است هست نیست می‌شود می‌کند دارد برای بین خود وی او ما شما آنها ایشان همین همان یکی دیگر برخی چند ضمن طبق اساس نظر طریق سوی روی زیر بالا'''.split())
    
    def __init__(self, ratio=0.3, max_sentences=5):
        self.ratio = ratio
        self.max_sentences = max_sentences
        self._sent_split = re.compile(r'(?<=[.!؟…])\s+')
        self._word_re = re.compile(r'[\w\u0600-\u06FF‌]+')
    
    def _sentences(self, text):
        return [s.strip() for s in self._sent_split.split(text) if len(s.strip()) > 20]
    
    def _tokens(self, text):
        return [w for w in self._word_re.findall(text) 
                if w not in self.STOP_WORDS and len(w) > 2]
    
    def summarize(self, text):
        if not text or len(text) < 100:
            return {"summary": text, "original_length": len(text), "summary_length": len(text)}
        
        sents = self._sentences(text)
        if len(sents) <= 2:
            return {"summary": text, "original_length": len(text), "summary_length": len(text)}
        
        freq = Counter(self._tokens(text))
        max_freq = max(freq.values()) if freq else 1
        weights = {w: f / max_freq for w, f in freq.items()}
        
        scored = []
        for idx, s in enumerate(sents):
            tokens = self._tokens(s)
            if not tokens:
                continue
            score = sum(weights.get(w, 0) for w in tokens) / (len(tokens) ** 0.5)
            score *= 1.0 + (1.0 / (idx + 2))
            scored.append((score, idx, s))
        
        n = min(self.max_sentences, max(1, int(len(sents) * self.ratio)))
        top = sorted(scored, reverse=True)[:n]
        chosen = sorted(top, key=lambda x: x[1])
        summary = ' '.join(s for _, _, s in chosen)
        
        return {
            "summary": summary,
            "original_length": len(text),
            "summary_length": len(summary),
            "compression_ratio": round(len(summary)/len(text), 2),
            "sentences_used": len(chosen)
        }
