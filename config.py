import os
from datetime import timedelta

class Config:
    """کلاس پیکربندی اصلی"""
    
    # کلید مخفی
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # تنظیمات پایگاه داده
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # تنظیمات آپلود
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}
    
    # تنظیمات جلسه
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # تنظیمات API
    API_RATE_LIMIT = "100 per hour"
    
    # تنظیمات پردازش متن
    MAX_TEXT_LENGTH = 10000  # حداکثر طول متن برای پردازش
    
    # تنظیمات ماژول‌های پردازش زبان
    HAZM_ENABLED = True
    PARSEL_TONGUE_ENABLED = True
    PERSIAN_PROCESSOR_ENABLED = True
    
    # تنظیمات کش
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # تنظیمات لاگ
    LOG_LEVEL = 'INFO'
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # تنظیمات ایمیل (در صورت نیاز)
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'localhost'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    @staticmethod
    def init_app(app):
        """مقداردهی اولیه برنامه با پیکربندی"""
        # ایجاد پوشه آپلود اگر وجود ندارد
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)
        
        # تنظیم سطح لاگ
        import logging
        logging.basicConfig(
            level=getattr(logging, Config.LOG_LEVEL),
            format=Config.LOG_FORMAT
        )


class DevelopmentConfig(Config):
    """پیکربندی توسعه"""
    
    DEBUG = True
    TESTING = False
    
    # تنظیمات توسعه
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or 'sqlite:///dev_app.db'
    
    # غیرفعال کردن کش در حالت توسعه
    CACHE_TYPE = 'null'
    
    # لاگ دقیق‌تر در توسعه
    LOG_LEVEL = 'DEBUG'


class TestingConfig(Config):
    """پیکربندی تست"""
    
    DEBUG = False
    TESTING = True
    
    # استفاده از پایگاه داده تست
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or 'sqlite:///test_app.db'
    
    # غیرفعال کردن کش در تست
    CACHE_TYPE = 'null'
    
    # محدودیت کمتر برای تست
    MAX_TEXT_LENGTH = 5000


class ProductionConfig(Config):
    """پیکربندی تولید"""
    
    DEBUG = False
    TESTING = False
    
    # استفاده از پایگاه داده تولید
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    
    # تنظیمات امنیتی برای تولید
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # تنظیمات کش برای تولید
    CACHE_TYPE = 'redis'  # نیاز به نصب redis
    CACHE_REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # لاگ در سطح اطلاعات
    LOG_LEVEL = 'INFO'


# دیکشنری پیکربندی‌ها
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """
    دریافت پیکربندی بر اساس نام
    
    Args:
        config_name (str): نام پیکربندی ('development', 'testing', 'production')
    
    Returns:
        Config: کلاس پیکربندی
    """
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG') or 'default'
    
    return config.get(config_name, config['default'])
