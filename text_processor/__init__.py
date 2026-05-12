"""
ماژول‌های پردازش متن فارسی
"""
from .nataq import NataqProcessor
from .mizanro import MizanroAnalyzer
from .anti_frag import AntiFragmentation

__all__ = ['NataqProcessor', 'MizanroAnalyzer', 'AntiFragmentation']
