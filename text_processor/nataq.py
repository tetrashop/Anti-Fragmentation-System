#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
پردازشگر جامع «نطق مصطلح» - نسخه دانشگاهی
ویرایش هوشمند متون فارسی و عربی با استانداردهای آکادمیک
"""

import re

class NataqProcessor:
    def __init__(self, max_length: int = None):
        """
        max_length: حداکثر طول مجاز متن (مثلاً ۲۵۰ کلمه برای چکیده)
        """
        self.max_length = max_length
        
        # نگاشت نویسه‌های عربی به فارسی
        self.arabic_chars = {
            'ي': 'ی', 'ك': 'ک', 'ى': 'ی', 'ة': 'ه', 'ۀ': 'هٔ',
            'ؤ': 'و', 'ئ': 'ی', 'أ': 'ا', 'إ': 'ا', 'آ': 'ا',
        }
        
        # اعداد
        self.eng_nums = dict(zip('0123456789', '۰۱۲۳۴۵۶۷۸۹'))
        self.ar_nums = dict(zip('٠١٢٣٤٥٦٧٨٩', '۰۱۲۳۴۵۶۷۸۹'))
        
        # پیشوندها و پسوندهای نیم‌فاصله
        self.mi_prefixes = ['می', 'نمی', 'همی']
        self.suffixes = ['ها', 'های', 'تر', 'ترین', 'اش', 'ام', 'ات', 
                        'ای', 'ایم', 'اید', 'اند', 'بود', 'شود', 'کرد']
        
        # اصلاحات املایی دانشگاهی
        self.academic_spell = {
            # افعال پرکاربرد
            'می شود': 'می‌شود', 'نمی شود': 'نمی‌شود',
            'می کند': 'می‌کند', 'نمی کند': 'نمی‌کند',
            'می دهد': 'می‌دهد', 'نمی دهد': 'نمی‌دهد',
            'می رود': 'می‌رود', 'نمی رود': 'نمی‌رود',
            'می گوید': 'می‌گوید', 'نمی گوید': 'نمی‌گوید',
            'می باشد': 'می‌باشد', 'نمی باشد': 'نمی‌باشد',
            'می خواهم': 'می‌خواهم', 'نمی خواهم': 'نمی‌خواهم',
            'می خواست': 'می‌خواست', 'نمی خواست': 'نمی‌خواست',
            'می توان': 'می‌توان', 'نمی توان': 'نمی‌توان',
            'می یابد': 'می‌یابد', 'نمی یابد': 'نمی‌یابد',
            'می نماید': 'می‌نماید', 'نمی نماید': 'نمی‌نماید',
            'می گردد': 'می‌گردد', 'نمی گردد': 'نمی‌گردد',
            
            # واژگان دانشگاهی
            'به وسیله': 'به‌وسیله', 'به وسیلهٔ': 'به‌وسیلهٔ',
            'به منزله': 'به‌منزلۀ', 'به منزلهٔ': 'به‌منزلۀ',
            'به طور': 'به‌طور', 'به طوری': 'به‌طوری',
            'به گونه': 'به‌گونه', 'به گونه ای': 'به‌گونه‌ای',
            'به جهت': 'به‌جهت', 'به دلیل': 'به‌دلیل',
            'به علاوه': 'به‌علاوه', 'به عبارت': 'به‌عبارت',
            'به ترتیب': 'به‌ترتیب', 'به ترتیبی': 'به‌ترتیبی',
            'به خصوص': 'به‌خصوص', 'به ویژه': 'به‌ویژه',
            'به طور کلی': 'به‌طور کلی', 'به طور خلاصه': 'به‌طور خلاصه',
            'در مورد': 'درمورد', 'در خصوص': 'درخصوص',
            'در رابطه': 'دررابطه', 'در ارتباط': 'درارتباط',
            'از جمله': 'ازجمله', 'از طریق': 'ازطریق',
            'از نظر': 'ازنظر', 'از لحاظ': 'ازلحاظ',
            'با توجه': 'با‌توجه', 'با وجود': 'با‌وجود',
            'با این': 'با‌این', 'با آن': 'با‌آن',
            
            # اصطلاحات علمی
            'به کار': 'به‌کار', 'به کارگیری': 'به‌کارگیری',
            'به عمل': 'به‌عمل', 'به وجود': 'به‌وجود',
            'به شمار': 'به‌شمار', 'به حساب': 'به‌حساب',
            'پیش بینی': 'پیش‌بینی', 'پیش بینی شده': 'پیش‌بینی‌شده',
            'پیش گفته': 'پیش‌گفته', 'پیش رو': 'پیش‌رو',
            'پیش نیاز': 'پیش‌نیاز', 'پیش شرط': 'پیش‌شرط',
            'پس از': 'پس‌از', 'پیش از': 'پیش‌از',
            'هم چنین': 'همچنین', 'هم چنان': 'همچنان',
            'هم اکنون': 'هم‌اکنون', 'هم اکنون': 'هم‌اکنون',
            'هر چند': 'هرچند', 'هر گاه': 'هرگاه',
            'هر کدام': 'هرکدام', 'هر یک': 'هریک',
            
            # واژگان مرکب
            'آنها': 'آن‌ها', 'اینها': 'این‌ها',
            'چه طور': 'چطور', 'چه گونه': 'چگونه', 'چه قدر': 'چقدر',
            'کدام یک': 'کدام‌یک', 'چنان چه': 'چنانچه',
            'بهترین': 'بهترین', 'بهترين': 'بهترین',
            'بزرگترین': 'بزرگ‌ترین', 'کوچکترین': 'کوچک‌ترین',
            'مهمترین': 'مهم‌ترین', 'عمده‌ترین': 'عمده‌ترین',
            
            # اصلاحات نگارشی
            '...': '…', '..': '…',
            '--': '–', '---': '—',
            '""': '«»', "''": '«»',
            
            # غلط‌های املایی رایج دانشگاهی
            'مساله': 'مسئله', 'مسأله': 'مسئله',
            'جرا': 'چرا', 'چطور': 'چطور',
            'انها': 'آن‌ها', 'انها': 'آن‌ها',
            'انچه': 'آنچه', 'ان چه': 'آنچه',
            'بدین': 'بدین', 'بدینوسیله': 'بدین‌وسیله',
            'بدین وسیله': 'بدین‌وسیله', 'بدینوسیله': 'بدین‌وسیله',
        }
        
        # الگوهای نگارشی دانشگاهی
        self.academic_patterns = [
            (r'\b(\d+)\s*-\s*(\d+)\b', r'\1 تا \2'),  # 5-10 → ۵ تا ۱۰
            (r'(\w)\s*\.\s*(\w)', r'\1. \2'),  # فاصله بین نقطه و کلمه
            (r'\(\s*', '('),  # حذف فاصله بعد از پرانتز باز
            (r'\s*\)', ')'),  # حذف فاصله قبل از پرانتز بسته
        ]
    
    def process(self, text: str) -> str:
        """پردازش کامل متن دانشگاهی"""
        if not text:
            return text
        
        t = text
        
        # ۱. نویسه‌های عربی → فارسی
        t = self._fix_characters(t)
        
        # ۲. اعداد → فارسی
        t = self._fix_numbers(t)
        
        # ۳. نیم‌فاصله پیشوندها
        t = self._fix_prefixes(t)
        
        # ۴. نیم‌فاصله پسوندها
        t = self._fix_suffixes(t)
        
        # ۵. اصلاحات املایی دانشگاهی
        t = self._fix_academic_spelling(t)
        
        # ۶. نشانه‌های نگارشی
        t = self._fix_punctuation(t)
        
        # ۷. الگوهای دانشگاهی
        for pattern, replacement in self.academic_patterns:
            t = re.sub(pattern, replacement, t)
        
        # ۸. حذف فاصله‌های اضافی
        t = re.sub(r' +', ' ', t)
        
        # ۹. اصلاح نیم‌فاصله‌های تکراری
        t = re.sub(r'‌{2,}', '‌', t)
        
        # ۱۰. اصلاح فاصله بین «ه» و «ی» نکره
        t = re.sub(r'(?<=\wه)\s+ی\b', '‌ای', t)
        
        # ۱۱. اصلاح «است» بعد از کلمات
        t = re.sub(r'(?<=\w)\s+است\b', ' است', t)
        
        return t.strip()
    
    def process_with_limit(self, text: str) -> dict:
        """
        پردازش با محدودیت طول
        بازگشت: متن پردازش‌شده + اطلاعات طول
        """
        processed = self.process(text)
        word_count = len(processed.split())
        char_count = len(processed)
        
        result = {
            "processed_text": processed,
            "word_count": word_count,
            "char_count": char_count,
            "success": True
        }
        
        if self.max_length:
            result["max_length"] = self.max_length
            result["remaining_words"] = self.max_length - word_count
            result["remaining_chars"] = self.max_length * 5 - char_count  # تقریبی
            result["exceeded"] = word_count > self.max_length
            
            if word_count > self.max_length:
                result["warning"] = f"⚠️ متن {word_count - self.max_length} کلمه از حد مجاز ({self.max_length}) فراتر رفته است"
                # خلاصه‌سازی اضطراری (اختیاری)
                words = processed.split()
                result["trimmed_text"] = ' '.join(words[:self.max_length]) + '…'
            else:
                result["warning"] = None
        
        return result
    
    # ======================= متدهای کمکی =======================
    def _fix_characters(self, text: str) -> str:
        for k, v in self.arabic_chars.items():
            text = text.replace(k, v)
        return text
    
    def _fix_numbers(self, text: str) -> str:
        for k, v in self.eng_nums.items():
            text = text.replace(k, v)
        for k, v in self.ar_nums.items():
            text = text.replace(k, v)
        return text
    
    def _fix_prefixes(self, text: str) -> str:
        for pref in self.mi_prefixes:
            text = re.sub(r'\b' + pref + r'\s+(?=\w)', pref + '‌', text)
        return text
    
    def _fix_suffixes(self, text: str) -> str:
        for suf in self.suffixes:
            text = re.sub(r'(?<=\w)\s+' + suf + r'\b', '‌' + suf, text)
        return text
    
    def _fix_academic_spelling(self, text: str) -> str:
        for wrong, right in self.academic_spell.items():
            text = text.replace(wrong, right)
        return text
    
    def _fix_punctuation(self, text: str) -> str:
        punctuation = r'،؛:!؟\.\)\]\}…'
        # حذف فاصله قبل از نشانه
        text = re.sub(r'\s+([{0}])'.format(punctuation), r'\1', text)
        # یک فاصله بعد از نشانه
        text = re.sub(r'([{0}])(?!\s)'.format(punctuation), r'\1 ', text)
        return text
    
    def analyze(self, text: str) -> dict:
        """تحلیل کامل متن با گزارش تغییرات"""
        processed = self.process(text)
        changes = []
        
        if text != processed:
            if any(k in text for k in self.arabic_chars):
                changes.append("اصلاح نویسه‌های عربی")
            if '‌' in processed and '‌' not in text:
                changes.append("افزودن نیم‌فاصله‌های استاندارد")
            if len(text) != len(processed):
                changes.append("بهینه‌سازی فاصله‌گذاری")
        
        return {
            "original": text,
            "processed": processed,
            "changed": text != processed,
            "changes": changes,
            "char_count_before": len(text),
            "char_count_after": len(processed),
            "word_count": len(processed.split())
        }
