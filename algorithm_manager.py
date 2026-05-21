import os
import sys
import json
import shutil
import importlib
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Tuple

class AlgorithmManager:
    """مدیریت پویای الگوریتم‌های پردازش متن"""

    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.text_processor_dir = self.base_dir / "text_processor"
        self.backup_dir = self.base_dir / "algorithm_backups"
        self.backup_dir.mkdir(exist_ok=True)

        # نگاشت نام الگوریتم به نام ماژول و کلاس
        self.algorithms = {
            "nataq": {
                "module": "nataq",
                "class": "NataqProcessor",
                "file": "nataq.py"
            },
            "mizanro": {
                "module": "mizanro",
                "class": "MizanroAnalyzer",
                "file": "mizanro.py"
            },
            "anti_frag": {
                "module": "anti_frag",
                "class": "AntiFragmentation",
                "file": "anti_frag.py"
            }
        }

    def backup_algorithm(self, algo_name: str) -> str:
        """تهیه پشتیبان از فایل فعلی الگوریتم و برگرداندن مسیر پشتیبان"""
        if algo_name not in self.algorithms:
            raise ValueError(f"الگوریتم نامعتبر: {algo_name}")

        algo = self.algorithms[algo_name]
        src = self.text_processor_dir / algo["file"]
        if not src.exists():
            raise FileNotFoundError(f"فایل {src} یافت نشد")

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{algo_name}_{timestamp}.py"
        dst = self.backup_dir / backup_name
        shutil.copy2(src, dst)
        return str(dst)

    def rollback_algorithm(self, algo_name: str, backup_path: str) -> bool:
        """بازگشت به یک نسخه پشتیبان مشخص"""
        if algo_name not in self.algorithms:
            raise ValueError(f"الگوریتم نامعتبر: {algo_name}")

        algo = self.algorithms[algo_name]
        target = self.text_processor_dir / algo["file"]
        backup_file = Path(backup_path)

        if not backup_file.exists():
            raise FileNotFoundError(f"فایل پشتیبان {backup_path} یافت نشد")

        # ابتدا از وضعیت فعلی پشتیبان می‌گیریم (برای safety)
        self.backup_algorithm(algo_name)

        # جایگزینی فایل
        shutil.copy2(backup_file, target)

        # بارگذاری مجدد ماژول
        self.reload_module(algo["module"])
        return True

    def update_algorithm(self, algo_name: str, new_code: str) -> Tuple[bool, str]:
        """
        جایگزینی کد الگوریتم با کد جدید
        new_code: محتوای کامل فایل پایتون جدید
        بازگشت: (موفقیت, پیام)
        """
        if algo_name not in self.algorithms:
            return False, f"الگوریتم نامعتبر: {algo_name}"

        algo = self.algorithms[algo_name]
        target_path = self.text_processor_dir / algo["file"]

        # اعتبارسنجی سینتکس پایتون
        try:
            compile(new_code, str(target_path), 'exec')
        except SyntaxError as e:
            return False, f"خطای سینتکس در کد جدید: {e}"

        # پشتیبان‌گیری از نسخه فعلی
        backup_path = self.backup_algorithm(algo_name)

        # نوشتن کد جدید
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(new_code)

        # تلاش برای بارگذاری مجدد ماژول
        try:
            self.reload_module(algo["module"])
            # تست صحت عملکرد با ساخت نمونه
            self.test_algorithm(algo_name)
        except Exception as e:
            # در صورت شکست، بازگشت خودکار
            shutil.copy2(backup_path, target_path)
            self.reload_module(algo["module"])
            return False, f"خطا در بارگذاری الگوریتم جدید؛ بازگشت خودکار انجام شد: {e}"

        return True, f"الگوریتم {algo_name} با موفقیت به‌روزرسانی شد. پشتیبان: {backup_path}"

    def reload_module(self, module_name: str) -> None:
        """بارگذاری مجدد یک ماژول در text_processor"""
        full_module_name = f"text_processor.{module_name}"
        if full_module_name in sys.modules:
            importlib.reload(sys.modules[full_module_name])
        else:
            importlib.import_module(full_module_name)

        # بارگذاری مجدد __init__.py برای به‌روزرسانی ارجاع‌ها
        if "text_processor" in sys.modules:
            importlib.reload(sys.modules["text_processor"])

    def test_algorithm(self, algo_name: str) -> bool:
        """تست ساده عملکرد الگوریتم با یک ورودی نمونه"""
        if algo_name == "nataq":
            from text_processor import NataqProcessor
            proc = NataqProcessor()
            result = proc.process("كتاب")
            if "کتاب" not in str(result):
                raise RuntimeError("تست نطق شکست خورد")
        elif algo_name == "mizanro":
            from text_processor import MizanroAnalyzer
            analyzer = MizanroAnalyzer()
            result = analyzer.analyze("تست")
            if "word_count" not in result:
                raise RuntimeError("تست میزان‌رو شکست خورد")
        elif algo_name == "anti_frag":
            from text_processor import AntiFragmentation
            proc = AntiFragmentation()
            result = proc.process("متن  تست")
            if "processed_text" not in result:
                raise RuntimeError("تست ضد چندپارگی شکست خورد")
        return True

    def list_backups(self, algo_name: str = None) -> Dict:
        """لیست پشتیبان‌های موجود"""
        backups = {}
        for file in sorted(self.backup_dir.glob("*.py")):
            name_parts = file.stem.rsplit("_", 2)
            if len(name_parts) >= 3:
                algo = name_parts[0]
                timestamp = f"{name_parts[-2]}_{name_parts[-1]}"
                if algo_name is None or algo == algo_name:
                    if algo not in backups:
                        backups[algo] = []
                    backups[algo].append({
                        "filename": file.name,
                        "path": str(file),
                        "timestamp": timestamp,
                        "size": file.stat().st_size
                    })
        return backups

    def get_current_algorithm_code(self, algo_name: str) -> str:
        """دریافت کد فعلی یک الگوریتم"""
        if algo_name not in self.algorithms:
            raise ValueError(f"الگوریتم نامعتبر: {algo_name}")
        algo = self.algorithms[algo_name]
        path = self.text_processor_dir / algo["file"]
        if not path.exists():
            raise FileNotFoundError(f"فایل {path} یافت نشد")
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
