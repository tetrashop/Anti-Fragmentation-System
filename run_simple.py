from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return '''
    <html dir="rtl">
    <head><title>سامانه ضد چندپارگی</title></head>
    <body>
        <h1>🚀 سامانه ضد چندپارگی فعال شد!</h1>
        <p>این یک صفحه تست ساده است.</p>
        <ul>
            <li><a href="/health">وضعیت سرویس</a></li>
            <li><a href="/nataq">نطق مصطلح</a></li>
        </ul>
    </body>
    </html>
    '''

@app.route('/health')
def health():
    return {'status': 'active', 'message': 'سرویس کار می‌کند'}

if __name__ == '__main__':
    print("🌐 اجرای برنامه روی پورت 8000...")
    app.run(host='0.0.0.0', port=8000, debug=True)
