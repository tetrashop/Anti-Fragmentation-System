from .nataq import NataqProcessor
from .mizanro import MizanroAnalyzer
from .anti_frag import AntiFragmentation
from .summarizer import Summarizer
from .keywords import KeywordExtractor
from .readability import ReadabilityAnalyzer
from .sentiment import SentimentAnalyzer
from .grammar import GrammarChecker
from .stats import StatsAnalyzer

class ComprehensiveAnalyzer:
    """تحلیل جامع متن - همه ماژول‌ها در یک عبور"""
    def __init__(self, max_length=None):
        self.nataq = NataqProcessor(max_length=max_length)
        self.mizanro = MizanroAnalyzer()
        self.anti_frag = AntiFragmentation()
        self.summarizer = Summarizer()
        self.keywords = KeywordExtractor()
        self.readability = ReadabilityAnalyzer()
        self.sentiment = SentimentAnalyzer()
        self.grammar = GrammarChecker()
        self.stats_analyzer = StatsAnalyzer()
        self.max_length = max_length

    def analyze(self, text):
        if not text:
            return {"error": "متن ورودی خالی است"}
        
        # ۱. اصلاح نویسه‌ها و نیم‌فاصله
        corrected = self.nataq.process(text)
        
        # ۲. کاهش چندپارگی
        frag_result = self.anti_frag.process(corrected)
        cleaned = frag_result['processed_text'] if isinstance(frag_result, dict) else frag_result
        
        # ۳. اصلاح دستوری
        grammar_result = self.grammar.check(cleaned)
        final_clean = grammar_result.get('fixed_text', cleaned)
        
        # ۴. تحلیل‌های موازی
        quality = self.mizanro.analyze(final_clean)
        readable = self.readability.analyze(final_clean)
        kws = self.keywords.extract(final_clean)
        summary = self.summarizer.summarize(final_clean)
        senti = self.sentiment.analyze(final_clean)
        stats = self.stats_analyzer.analyze(final_clean)
        
        wc = len(final_clean.split())
        result = {
            "success": True,
            "original_text": text,
            "cleaned_text": final_clean,
            "quality": quality.get('analysis', quality),
            "readability": readable,
            "keywords": kws.get('keywords', []),
            "summary": summary.get('summary', ''),
            "sentiment": senti,
            "grammar": grammar_result,
            "stats": {
                "word_count": wc,
                "char_count": len(final_clean),
                "sentence_count": readable.get('total_sentences', 0)
            },
            "detailed_stats": stats
        }
        
        if self.max_length:
            result['limit'] = {
                "max": self.max_length,
                "remaining": self.max_length - wc,
                "exceeded": wc > self.max_length
            }
        
        return result
