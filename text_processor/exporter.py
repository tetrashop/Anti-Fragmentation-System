import json
from datetime import datetime

class Exporter:
    """خروجی تحلیل به فرمت‌های مختلف"""
    def to_json(self, data):
        return json.dumps(data, ensure_ascii=False, indent=2)

    def to_markdown(self, data, title="گزارش تحلیل متن"):
        d = datetime.now().strftime('%Y-%m-%d %H:%M')
        lines = [f"# {title}", f"\n**تاریخ**: {d}\n", "---\n"]
        if 'cleaned_text' in data:
            lines.append(f"## متن تصحیح‌شده\n\n> {data['cleaned_text']}\n")
        if 'stats' in data:
            s = data['stats']
            lines.append(f"## آمار\n\n| شاخص | مقدار |\n|------|-------|\n| کلمات | {s.get('word_count',0)} |\n| جملات | {s.get('sentence_count',0)} |\n| کاراکترها | {s.get('char_count',0)} |\n")
        if 'readability' in data:
            r = data['readability']
            lines.append(f"## خوانایی\n\n- **امتیاز**: {r.get('readability_score',0)}/100\n- **سطح**: {r.get('level','')}\n- **زمان مطالعه**: {r.get('estimated_reading_time_min',0)} دقیقه\n")
        if 'keywords' in data and data['keywords']:
            kw = ', '.join(f"`{k['word']}`" for k in data['keywords'][:10])
            lines.append(f"## کلیدواژه‌ها\n\n{kw}\n")
        if 'summary' in data and data['summary']:
            lines.append(f"## خلاصه\n\n{data['summary']}\n")
        if 'sentiment' in data and 'label' in data.get('sentiment', {}):
            s = data['sentiment']
            lines.append(f"## احساسات\n\n- **برچسب**: {s['label']}\n- **امتیاز**: {s['score']}\n")
        return '\n'.join(lines)

    def to_csv(self, data):
        rows = [['بخش', 'کلید', 'مقدار']]
        if 'stats' in data:
            for k, v in data['stats'].items():
                rows.append(['آمار', k, str(v)])
        if 'readability' in data:
            for k, v in data['readability'].items():
                if not isinstance(v, (list, dict)):
                    rows.append(['خوانایی', k, str(v)])
        if 'sentiment' in data:
            for k, v in data['sentiment'].items():
                if not isinstance(v, (list, dict)):
                    rows.append(['احساسات', k, str(v)])
        return '\n'.join(','.join(f'"{c}"' if ',' in str(c) else str(c) for c in row) for row in rows)

    def to_txt(self, data):
        out = []
        if 'cleaned_text' in data:
            out.append("=== متن تصحیح‌شده ===\n" + data['cleaned_text'])
        if 'summary' in data:
            out.append("\n=== خلاصه ===\n" + data['summary'])
        if 'keywords' in data:
            out.append("\n=== کلیدواژه‌ها ===\n" + ', '.join(k['word'] for k in data['keywords']))
        return '\n'.join(out)
