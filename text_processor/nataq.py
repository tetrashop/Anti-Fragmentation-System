import re

class NataqProcessor:
    def __init__(self, max_length=None):
        self.max_length = max_length
        
        # نگاشت نویسه - دیکشنری برای سرعت
        self.arabic_map = str.maketrans({
            'ي': 'ی', 'ك': 'ک', 'ى': 'ی', 'ة': 'ه', 'ۀ': 'هٔ',
            'ؤ': 'و', 'ئ': 'ی', 'أ': 'ا', 'إ': 'ا', 'آ': 'ا',
        })
        self.num_map = str.maketrans({
            '0': '۰','1': '۱','2': '۲','3': '۳','4': '۴',
            '5': '۵','6': '۶','7': '۷','8': '۸','9': '۹',
            '٠': '۰','١': '۱','٢': '۲','٣': '۳','٤': '۴',
            '٥': '۵','٦': '۶','٧': '۷','٨': '۸','٩': '۹',
        })
        
        # قوانین - کامپایل رجکس برای سرعت
        self._mi_re = re.compile(r'\b(می|نمی)\s+(?=\w)')
        self._suffix_re = re.compile(r'(?<=\w)\s+(ها|های|تر|ترین|اش|ام|ات|ای|ایم|اید|اند)\b')
        self._space_before_punc = re.compile(r'\s+([،؛:!؟\.\)\]\}…])')
        self._space_after_punc = re.compile(r'([،؛:!؟\.\(\[\{…])(?!\s)')
        self._multi_space = re.compile(r' +')
        self._multi_zwnj = re.compile(r'‌{2,}')
        self._he_ye = re.compile(r'(?<=\wه)\s+ی\b')
        
        # اصلاحات - فقط موارد پرتکرار
        self._fixes = {
            'می شود': 'می‌شود', 'نمی شود': 'نمی‌شود',
            'می کند': 'می‌کند', 'نمی کند': 'نمی‌کند',
            'می باشد': 'می‌باشد', 'نمی باشد': 'نمی‌باشد',
            'می توان': 'می‌توان', 'نمی توان': 'نمی‌توان',
            'به وسیله': 'به‌وسیله', 'به طور': 'به‌طور',
            'به منزله': 'به‌منزلۀ', 'به گونه': 'به‌گونه',
            'با توجه': 'با‌توجه', 'از طریق': 'ازطریق',
            'آنها': 'آن‌ها', 'اینها': 'این‌ها',
            'پیش بینی': 'پیش‌بینی', 'هم چنین': 'همچنین',
            '...': '…', 'مساله': 'مسئله',
        }
    
    def process(self, text):
        if not text:
            return text
        
        # ۱. ترنسلیت سریع نویسه‌ها
        t = text.translate(self.arabic_map)
        t = t.translate(self.num_map)
        
        # ۲. نیم‌فاصله پیشوندها (فقط می/نمی)
        t = self._mi_re.sub(r'\1‌', t)
        
        # ۳. نیم‌فاصله پسوندها
        t = self._suffix_re.sub(r'‌\1', t)
        
        # ۴. اصلاحات سریع (فقط موارد پرتکرار)
        for wrong, right in self._fixes.items():
            t = t.replace(wrong, right)
        
        # ۵. نگارش
        t = self._space_before_punc.sub(r'\1', t)
        t = self._space_after_punc.sub(r'\1 ', t)
        
        # ۶. حذف فاصله اضافی
        t = self._multi_space.sub(' ', t)
        t = self._multi_zwnj.sub('‌', t)
        
        # ۷. «ه ی» نکره
        t = self._he_ye.sub('‌ای', t)
        
        return t.strip()
    
    def process_with_limit(self, text):
        processed = self.process(text)
        words = processed.split()
        wc = len(words)
        
        r = {"processed_text": processed, "word_count": wc, 
             "char_count": len(processed), "success": True}
        
        if self.max_length:
            r["max_length"] = self.max_length
            r["remaining"] = self.max_length - wc
            if wc > self.max_length:
                r["warning"] = f"⚠️ {wc - self.max_length} کلمه اضافه"
                r["trimmed"] = ' '.join(words[:self.max_length]) + '…'
        
        return r
    
    def analyze(self, text):
        p = self.process(text)
        return {"original": text, "processed": p, 
                "changed": text != p, "word_count": len(p.split())}
