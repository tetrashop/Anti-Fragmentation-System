// اسکریپت‌های عمومی سامانه ضد چندپارگی

document.addEventListener('DOMContentLoaded', function() {
    // مقداردهی اولیه توستر (اگر نیاز باشد)
    initializeToasts();
    
    // مدیریت فرم‌ها
    initializeForms();
    
    // نمایش انیمیشن‌ها
    initializeAnimations();
    
    // مدیریت وضعیت سامانه
    checkSystemStatus();
});

// تابع برای مقداردهی توسترها
function initializeToasts() {
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    const toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl);
    });
}

// تابع برای مدیریت فرم‌ها
function initializeForms() {
    // پاک کردن خودکار پیام‌های خطا هنگام تایپ
    const textareas = document.querySelectorAll('textarea.form-control');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const errorDiv = this.closest('.card-body').querySelector('.alert-danger');
            if (errorDiv && !errorDiv.classList.contains('d-none')) {
                errorDiv.classList.add('d-none');
            }
        });
    });
}

// تابع برای انیمیشن‌ها
function initializeAnimations() {
    // افزودن کلاس fade-in به عناصر اصلی
    const elementsToAnimate = document.querySelectorAll('.card, .navbar, footer');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
}

// تابع برای بررسی وضعیت سامانه
function checkSystemStatus() {
    // این تابع می‌تواند وضعیت سامانه را به صورت دوره‌ای چک کند
    setInterval(() => {
        const statusIndicators = document.querySelectorAll('.status-indicator');
        statusIndicators.forEach(indicator => {
            indicator.classList.toggle('pulse');
        });
    }, 3000);
}

// تابع برای نمایش نوتیفیکیشن
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        createNotificationContainer();
    }
    
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const notificationId = 'notification-' + Date.now();
    const notificationHTML = `
        <div id="${notificationId}" class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    notificationContainer.innerHTML += notificationHTML;
    
    // حذف خودکار نوتیفیکیشن بعد از 5 ثانیه
    setTimeout(() => {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.remove();
        }
    }, 5000);
}

// تابع برای ایجاد کانتینر نوتیفیکیشن
function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
}

// تابع برای مدیریت آپلود فایل
function handleFileUpload(inputElement, callback) {
    const file = inputElement.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result, file.name);
    };
    reader.readAsText(file, 'UTF-8');
}

// تابع برای دانلود نتیجه
function downloadResult(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// تابع برای کپی متن به کلیپ‌بورد
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('متن با موفقیت کپی شد', 'success');
    }).catch(err => {
        showNotification('خطا در کپی کردن متن', 'error');
    });
}

// تابع برای تحلیل متن
function analyzeText(text, endpoint) {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('خطا در پاسخ سرور');
        }
        return response.json();
    });
}

// تابع برای مدیریت خطاها
function handleError(error, errorElement) {
    console.error('Error:', error);
    errorElement.textContent = error.message || 'خطای ناشناخته رخ داده است';
    errorElement.classList.remove('d-none');
}

// پلاگین jQuery برای انیمیشن‌های سفارشی (اگر jQuery موجود باشد)
if (typeof jQuery !== 'undefined') {
    (function($) {
        $.fn.fadeInUp = function(duration = 600) {
            return this.each(function() {
                $(this).css({
                    'opacity': '0',
                    'transform': 'translateY(20px)'
                });
                $(this).animate({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                }, duration);
            });
        };
        
        $.fn.pulse = function() {
            return this.each(function() {
                $(this).fadeTo(300, 0.5).fadeTo(300, 1);
            });
        };
    })(jQuery);
}

// کلاس برای مدیریت وضعیت سامانه
class SystemStatus {
    constructor() {
        this.isOnline = true;
        this.lastCheck = null;
    }
    
    async checkStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            this.isOnline = data.modules_loaded;
            this.lastCheck = new Date();
            return this.isOnline;
        } catch (error) {
            this.isOnline = false;
            this.lastCheck = new Date();
            return false;
        }
    }
    
    getStatusMessage() {
        if (!this.lastCheck) {
            return 'در حال بررسی وضعیت...';
        }
        
        return this.isOnline ? 
            'سامانه در دسترس است' : 
            'مشکل در اتصال به سامانه';
    }
}

// ایجاد نمونه از کلاس وضعیت سامانه
const systemStatus = new SystemStatus();

// صادر کردن توابع برای استفاده در ماژول‌های دیگر
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        handleFileUpload,
        downloadResult,
        copyToClipboard,
        analyzeText,
        handleError,
        systemStatus
    };
}
