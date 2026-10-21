from .nataq import NataqProcessor
from .mizanro import MizanroAnalyzer
from .anti_frag import AntiFragmentation
from .summarizer import Summarizer
from .keywords import KeywordExtractor
from .readability import ReadabilityAnalyzer

class ComprehensiveAnalyzer:
    """تحلیل جامع متن - همه ماژول‌ها در یک عبور"""
    
    def __init__(self, max_length=None):
        self.nataq = NataqProcessor(max_length=max_length)
        self.mizanro = MizanroAnalyzer()
        self.anti_frag = AntiFragmentation()
        self.summarizer = Summarizer()
        self.keywords = KeywordExtractor()
        self.readability = ReadabilityAnalyzer()
        self.max_length = max_length
    
    def analyze(self, text):
        if not text:
            return {"error": "متن ورودی خالی است"}
        
        corrected = self.nataq.process(text)
        frag_result = self.anti_frag.process(corrected)
        cleaned = frag_result['processed_text'] if isinstance(frag_result, dict) else frag_result
        
        quality = self.mizanro.analyze(cleaned)
        readable = self.readability.analyze(cleaned)
        kws = self.keywords.extract(cleaned)
        summary = self.summarizer.summarize(cleaned)
        
        wc = len(cleaned.split())
        result = {
            "success": True,
            "original_text": text,
            "cleaned_text": cleaned,
            "quality": quality.get('analysis', quality),
            "readability": readable,
            "keywords": kws.get('keywords', []),
            "summary": summary.get('summary', ''),
            "stats": {
                "word_count": wc,
                "char_count": len(cleaned),
                "sentence_count": readable.get('total_sentences', 0)
            }
        }
        
        if self.max_length:
            result['limit'] = {
                "max": self.max_length,
                "remaining": self.max_length - wc,
                "exceeded": wc > self.max_length
            }
        
        return result
