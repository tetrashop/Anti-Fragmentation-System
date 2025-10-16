"""
ماژول‌های پردازش متن فارسی
"""
from .nataq import nataq_processor
from .mizanro import mizanro_analyzer  
from .anti_frag import anti_frag_processor

__all__ = ['NataqProcessor', 'MizanroAnalyzer', 'AntiFragmentation']
