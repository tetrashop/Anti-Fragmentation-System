from .comprehensive import ComprehensiveAnalyzer

class BatchProcessor:
    """پردازش دسته‌ای متون"""
    MAX_BATCH = 50
    MAX_TEXT_LEN = 20000

    def __init__(self, max_length=None):
        self.analyzer = ComprehensiveAnalyzer(max_length=max_length)

    def process(self, texts):
        if not isinstance(texts, list):
            return {'error': 'ورودی باید آرایه باشد'}
        if len(texts) == 0:
            return {'error': 'آرایه خالی است'}
        if len(texts) > self.MAX_BATCH:
            return {'error': f'حداکثر {self.MAX_BATCH} متن مجاز است'}
        results = []
        for i, t in enumerate(texts):
            if not isinstance(t, str):
                results.append({'index': i, 'error': 'نوع نامعتبر'})
                continue
            if len(t) > self.MAX_TEXT_LEN:
                results.append({'index': i, 'error': f'متن بیش از {self.MAX_TEXT_LEN} کاراکتر'})
                continue
            try:
                r = self.analyzer.analyze(t)
                r['index'] = i
                results.append(r)
            except Exception as e:
                results.append({'index': i, 'error': str(e)})
        success = sum(1 for r in results if 'error' not in r)
        return {
            'total': len(texts),
            'success': success,
            'failed': len(texts) - success,
            'results': results
        }
