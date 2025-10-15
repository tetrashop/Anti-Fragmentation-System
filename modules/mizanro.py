class MizanroSystem:
    def __init__(self):
        self.name = "سیستم میزان‌رو"
        self.version = "1.0"
    
    def analyze(self, text):
        """
        تحلیل متن با سیستم میزان‌رو
        """
        try:
            # پیاده‌سازی اولیه
            analysis_result = self.perform_analysis(text)
            
            return {
                'success': True,
                'system': self.name,
                'version': self.version,
                'input_text': text,
                'analysis': analysis_result
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def perform_analysis(self, text):
        """انجام تحلیل‌های مختلف روی متن"""
        words = text.split()
        
        return {
            'word_count': len(words),
            'sentence_count': text.count('.') + text.count('!') + text.count('?'),
            'avg_word_length': sum(len(word) for word in words) / len(words) if words else 0,
            'unique_words': len(set(words)),
            'readability_score': self.calculate_readability(text)
        }
    
    def calculate_readability(self, text):
        """محاسبه ساده خوانایی"""
        words = text.split()
        if len(words) < 5:
            return 100
        return min(100, max(0, (len(words) / len(text)) * 1000))
