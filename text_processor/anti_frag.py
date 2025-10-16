class AntiFragmentation:
    def __init__(self):
        self.loaded = True
    
    def process(self, text):
        try:
            fragmentation_before = self._calculate_fragmentation(text)
            processed_text = self._reduce_fragmentation(text)
            fragmentation_after = self._calculate_fragmentation(processed_text)
            
            if fragmentation_before > 0:
                improvement = ((fragmentation_before - fragmentation_after) / fragmentation_before) * 100
            else:
                improvement = 0
            
            return {
                'success': True,
                'processed_text': processed_text,
                'fragmentation_score_before': fragmentation_before,
                'fragmentation_score_after': fragmentation_after,
                'improvement_percentage': round(improvement, 2)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'processed_text': text
            }
    
    def _calculate_fragmentation(self, text):
        score = 0
        score += text.count('  ') * 2
        score += text.count('   ') * 3
        score += text.count('\n\n') * 2
        return score
    
    def _reduce_fragmentation(self, text):
        processed = text
        while '  ' in processed:
            processed = processed.replace('  ', ' ')
        while '\n\n\n' in processed:
            processed = processed.replace('\n\n\n', '\n\n')
        return processed.strip()

anti_frag_processor = AntiFragmentation()
