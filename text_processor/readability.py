import re

class ReadabilityAnalyzer:
    """تحلیل خوانایی متن فارسی با معیارهای علمی"""
    
    def __init__(self):
        self._sent_split = re.compile(r'[.!؟…]')
        self._word_re = re.compile(r'[\w\u0600-\u06FF‌]+')
    
    def _syllables(self, word):
        vowels = set('اآایووههیءأإؤئ')
        count = 0
        prev_vowel = False
        for ch in word:
            is_v = ch in vowels
            if is_v and not prev_vowel:
                count += 1
            prev_vowel = is_v
        return max(1, count)
    
    def _is_complex(self, word):
        return len(word) > 7 or self._syllables(word) > 3
    
    def analyze(self, text):
        if not text or len(text) < 10:
            return {"error": "متن کافی نیست"}
        
        sentences = [s for s in self._sent_split.split(text) if s.strip()]
        words = self._word_re.findall(text)
        
        if not sentences or not words:
            return {"error": "متن قابل تحلیل نیست"}
        
        n_sent = len(sentences)
        n_words = len(words)
        n_chars = sum(len(w) for w in words)
        complex_words = sum(1 for w in words if self._is_complex(w))
        syllables = sum(self._syllables(w) for w in words)
        
        avg_word_len = n_chars / n_words
        avg_sent_len = n_words / n_sent
        complex_ratio = complex_words / n_words
        
        readability = 100 - ((avg_sent_len * 1.5) + (avg_word_len * 8) + (complex_ratio * 40))
        readability = max(0, min(100, round(readability, 1)))
        
        if readability >= 80:
            level = "خیلی ساده (مناسب عموم)"
        elif readability >= 60:
            level = "ساده (مناسب دبیرستان)"
        elif readability >= 40:
            level = "متوسط (مناسب دانشگاهی)"
        elif readability >= 20:
            level = "دشوار (تخصصی)"
        else:
            level = "خیلی دشوار (فنی/علمی)"
        
        return {
            "readability_score": readability,
            "level": level,
            "avg_word_length": round(avg_word_len, 2),
            "avg_sentence_length": round(avg_sent_len, 2),
            "complex_word_ratio": round(complex_ratio, 3),
            "total_sentences": n_sent,
            "total_words": n_words,
            "total_syllables": syllables,
            "estimated_reading_time_min": round(n_words / 200, 1),
            "recommendations": self._recommend(avg_sent_len, avg_word_len, complex_ratio)
        }
    
    def _recommend(self, asl, awl, cr):
        r = []
        if asl > 25:
            r.append("جملات را کوتاه‌تر کنید (میانگین بالای ۲۵ کلمه)")
        if awl > 6:
            r.append("از واژگان ساده‌تر استفاده کنید")
        if cr > 0.2:
            r.append("کلمات تخصصی را با معادل ساده جایگزین یا توضیح دهید")
        if not r:
            r.append("متن از خوانایی مناسبی برخوردار است")
        return r
