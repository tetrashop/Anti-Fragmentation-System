import re
from collections import Counter

class StatsAnalyzer:
    """آمار پیشرفته متن"""
    STOP = set('و در به از که با این را بر آن تا هم یا اگر اما پس چرا چه چون هر یک هیچ همه نیز ولی بود شد است هست نیست می‌شود می‌کند دارد برای بین خود وی او ما شما آنها'.split())

    def __init__(self):
        self._word = re.compile(r'[\w\u0600-\u06FF‌]+')
        self._sent = re.compile(r'[.!؟…]+')

    def _tokens(self, t):
        return [w for w in self._word.findall(t.lower()) if w not in self.STOP and len(w) > 2]

    def analyze(self, text):
        if not text:
            return {'error': 'متن خالی است'}
        words = self._word.findall(text)
        sents = [s.strip() for s in self._sent.split(text) if s.strip()]
        tokens = self._tokens(text)
        freq = Counter(tokens)
        bigrams = Counter(f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens)-1))
        trigrams = Counter(f"{tokens[i]} {tokens[i+1]} {tokens[i+2]}" for i in range(len(tokens)-2))
        sent_lengths = [len(self._word.findall(s)) for s in sents]
        rare = [w for w, c in freq.items() if c == 1][:10]
        return {
            'total_words': len(words),
            'unique_words': len(set(self._word.findall(text.lower()))),
            'stop_word_count': len(words) - len(tokens),
            'top_words': [{'word': w, 'count': c} for w, c in freq.most_common(15)],
            'top_bigrams': [{'phrase': b, 'count': c} for b, c in bigrams.most_common(10) if c >= 2],
            'top_trigrams': [{'phrase': t, 'count': c} for t, c in trigrams.most_common(5) if c >= 2],
            'rare_words': rare,
            'sentence_lengths': sent_lengths,
            'avg_sentence_length': round(sum(sent_lengths)/len(sent_lengths), 2) if sent_lengths else 0,
            'max_sentence_length': max(sent_lengths) if sent_lengths else 0,
            'min_sentence_length': min(sent_lengths) if sent_lengths else 0,
            'vocabulary_richness': round(len(freq)/len(tokens), 3) if tokens else 0
        }
