import re

class SentimentAnalyzer:
    """تحلیل احساسات متن فارسی"""
    POSITIVE = set('خوب عالی موفق مفید بهتر بهترین پیشرفت بهبود افزایش درست صحیح مثبت زیبا لذت کارآمد ارزشمند خلاقانه تحسین برتر پیشرفته رشد دستاورد امید قدرت توانایی نوآوری هوشمند دقیق کیفیت برجسته چشمگیر فوق‌العاده خوشحال راضی محبوب'.split())
    NEGATIVE = set('بد بدتر بدترین ضعیف مشکل خطا خراب شکست ناکام ناموفق کاهش افت منفی زشت آسیب ضرر خطر نگران ناراحت غم اشتباه بحران ضعف نامناسب ناکافی سردرگمی ناامید نارضایتی درد رنج'.split())

    def analyze(self, text):
        if not text:
            return {'error': 'متن خالی است'}
        words = re.findall(r'[\w\u0600-\u06FF‌]+', text)
        pos = [w for w in words if w in self.POSITIVE]
        neg = [w for w in words if w in self.NEGATIVE]
        total = len(pos) + len(neg)
        if total == 0:
            return {'label': 'خنثی', 'score': 0.0, 'positive_count': 0, 'negative_count': 0, 'confidence': 0, 'keywords': {'positive': [], 'negative': []}}
        score = (len(pos) - len(neg)) / total
        label = 'مثبت' if score >= 0.3 else 'منفی' if score <= -0.3 else 'خنثی'
        return {
            'label': label, 'score': round(score, 2),
            'positive_count': len(pos), 'negative_count': len(neg),
            'confidence': round(min(1, total / 8), 2),
            'keywords': {'positive': list(set(pos))[:5], 'negative': list(set(neg))[:5]}
        }
