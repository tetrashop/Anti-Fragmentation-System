class AntiFragmentationSystem:
    def __init__(self):
        self.name = "سامانه ضد چندپارگی"
    
    def process(self, text):
        """
        پردازش متن برای کاهش چندپارگی
        """
        try:
            # الگوریتم ضد چندپارگی
            processed_text = self.remove_fragmentation(text)
            
            return {
                'success': True,
                'original': text,
                'processed': processed_text,
                'fragmentation_score': self.calculate_fragmentation_score(text),
                'system': self.name
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def remove_fragmentation(self, text):
        # پیاده‌سازی الگوریتم ضد چندپارگی
        # اینجا می‌توانید منطق خاص خود را اضافه کنید
        processed = text.replace('  ', ' ')  # حذف فاصله‌های اضافی
        processed = ' '.join(processed.split())  # نرمال‌سازی فاصله‌ها
        return processed
    
    def calculate_fragmentation_score(self, text):
        # محاسبه میزان چندپارگی متن
        words = text.split()
        if len(words) == 0:
            return 0
        unique_words = len(set(words))
        return unique_words / len(words)
