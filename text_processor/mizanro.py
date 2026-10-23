import re

class MizanroAnalyzer:
    def analyze(self, text):
        if not text:
            return {'success': False, 'error': 'متن خالی است'}

        words = text.split()
        word_count = len(words)
        char_count = len(text)

        # تقسیم جملات
        sentences = re.split(r'[.!؟…]+', text)
        sentences = [s for s in sentences if s.strip()]
        sentence_count = len(sentences)

        unique_words = len(set(words))
        avg_sentence_length = word_count / sentence_count if sentence_count else 0
        lexical_diversity = unique_words / word_count if word_count else 0
        score = min(100, word_count * 3 + char_count // 10)

        return {
            'success': True,
            'analysis': {
                'word_count': word_count,
                'char_count': char_count,
                'sentence_count': sentence_count,
                'unique_words': unique_words,
                'avg_sentence_length': round(avg_sentence_length, 2),
                'lexical_diversity': round(lexical_diversity, 2),
                'complexity_score': score
            }
        }
