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
        if not text or not isinstance(text, str):
            return {"error": "متن ورودی نامعتبر است"}
        try:
            corrected = self.nataq.process(text)
        except Exception:
            corrected = text
        try:
            frag_result = self.anti_frag.process(corrected)
            cleaned = frag_result['processed_text'] if isinstance(frag_result, dict) else frag_result
        except Exception:
            cleaned = corrected
        try:
            grammar_result = self.grammar.check(cleaned)
            final_clean = grammar_result.get('fixed_text', cleaned)
        except Exception:
            grammar_result = {"has_issues": False, "fixed_text": cleaned}
            final_clean = cleaned

        try:
            quality = self.mizanro.analyze(final_clean)
            quality_data = quality.get('analysis', quality) if isinstance(quality, dict) else quality
        except Exception:
            quality_data = {}
        try:
            readable = self.readability.analyze(final_clean)
        except Exception:
            readable = {}
        try:
            kws = self.keywords.extract(final_clean)
            keywords_data = kws.get('keywords', []) if isinstance(kws, dict) else []
        except Exception:
            keywords_data = []
        try:
            summary = self.summarizer.summarize(final_clean)
            summary_text = summary.get('summary', '') if isinstance(summary, dict) else str(summary)
        except Exception:
            summary_text = ""
        try:
            senti = self.sentiment.analyze(final_clean)
        except Exception:
            senti = {"label": "نامشخص", "score": 0}
        try:
            stats = self.stats_analyzer.analyze(final_clean)
        except Exception:
            stats = {}

        wc = len(final_clean.split())
        sentence_count = readable.get('total_sentences', 0) if isinstance(readable, dict) else 0
        result = {
            "success": True,
            "original_text": text,
            "cleaned_text": final_clean,
            "quality": quality_data,
            "readability": readable,
            "keywords": keywords_data,
            "summary": summary_text,
            "sentiment": senti,
            "grammar": grammar_result,
            "stats": {
                "word_count": wc,
                "char_count": len(final_clean),
                "sentence_count": sentence_count
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
