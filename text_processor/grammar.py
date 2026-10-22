import re

class GrammarChecker:
    """بررسی و اصلاح خطاهای دستوری رایج فارسی"""
    RULES = [
        (r'\b(را)\s+(به)\b', r'\1 \2', 'ترتیب «را به»'),
        (r'\bبود\s+است\b', 'بوده است', 'اصلاح «بود است»'),
        (r'\bمی\s+(شود|شد|شوم|شوی)\b', r'می‌\1', 'نیم‌فاصله می'),
        (r'\bنمی\s+(شود|شد|شوم|شوی)\b', r'نمی‌\1', 'نیم‌فاصله نمی'),
        (r'\b(چه)\s+(قدر|گونه|طور)\b', r'چ\2', 'ترکیب «چه قدر»'),
        (r'\b(این|آن)\s+(ها)\b', r'\1‌ها', 'ترکیب ضمیر جمع'),
        (r'\b(هیچ)\s+(کدام|یک)\b', r'هیچ‌\2', 'نیم‌فاصله هیچ'),
        (r'\b(هیچ)\s+(گاه)\b', r'هیچ‌گاه', 'ترکیب هیچگاه'),
        (r'\b(به)\s+(هر)\s+(حال)\b', r'به‌هرحال', 'ترکیب به‌هرحال'),
        (r'\bهٔ\b', 'ه‌ی', 'اصلاح «هٔ» به «ه‌ی»'),
        (r'(\d+)\s*%', r'\1٪', 'علامت درصد فارسی'),
    ]

    def check(self, text):
        if not text:
            return {'error': 'متن خالی است', 'issues': []}
        issues = []
        fixed = text
        for pattern, replacement, desc in self.RULES:
            matches = re.findall(pattern, fixed)
            if matches:
                issues.append({'description': desc, 'count': len(matches)})
                fixed = re.sub(pattern, replacement, fixed)
        return {
            'has_issues': len(issues) > 0,
            'issue_count': sum(i['count'] for i in issues),
            'issues': issues,
            'fixed_text': fixed,
            'changed': fixed != text
        }
