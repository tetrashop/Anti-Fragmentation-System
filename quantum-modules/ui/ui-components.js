/**
 * 🎨 کوانتوم کامپوننت‌های UI
 * سیستم کامپوننت‌های ماژولار رابط کاربری
 */

export class UIComponentsQuantum {
  constructor() {
    this.components = new Map();
    this.themes = new Map();
    this.initializeThemes();
    this.initializeComponents();
  }

  initializeThemes() {
    // تم اصلی
    this.themes.set('default', {
      colors: {
        primary: '#3498db',
        secondary: '#2c3e50',
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        light: '#ecf0f1',
        dark: '#2c3e50'
      },
      typography: {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.6'
      },
      spacing: {
        xs: '5px',
        sm: '10px',
        md: '15px',
        lg: '20px',
        xl: '30px'
      },
      borderRadius: '8px',
      shadow: '0 2px 10px rgba(0,0,0,0.1)'
    });

    // تم تیره
    this.themes.set('dark', {
      colors: {
        primary: '#3498db',
        secondary: '#34495e',
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        light: '#bdc3c7',
        dark: '#ecf0f1'
      },
      typography: {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.6'
      },
      spacing: {
        xs: '5px',
        sm: '10px',
        md: '15px',
        lg: '20px',
        xl: '30px'
      },
      borderRadius: '8px',
      shadow: '0 2px 10px rgba(0,0,0,0.3)'
    });
  }

  initializeComponents() {
    this.registerComponent('button', this.buttonComponent);
    this.registerComponent('card', this.cardComponent);
    this.registerComponent('input', this.inputComponent);
    this.registerComponent('stat', this.statComponent);
    this.registerComponent('progress', this.progressComponent);
    this.registerComponent('alert', this.alertComponent);
  }

  registerComponent(name, componentFn) {
    this.components.set(name, componentFn);
  }

  // کامپوننت دکمه
  buttonComponent(text, options = {}) {
    const theme = this.getCurrentTheme();
    const {
      variant = 'primary',
      size = 'medium',
      disabled = false,
      onClick = null,
      icon = null,
      fullWidth = false
    } = options;

    const baseStyles = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: ${theme.spacing.sm};
      padding: ${this.getButtonPadding(size)};
      border: none;
      border-radius: ${theme.borderRadius};
      font-family: ${theme.typography.fontFamily};
      font-size: ${theme.typography.fontSize};
      font-weight: bold;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      transition: all 0.3s ease;
      text-decoration: none;
      opacity: ${disabled ? 0.6 : 1};
      width: ${fullWidth ? '100%' : 'auto'};
      ${this.getButtonVariantStyles(variant, theme)}
    `;

    return `
      <button 
        style="${baseStyles}" 
        ${disabled ? 'disabled' : ''}
        ${onClick ? `onclick="${onClick}"` : ''}
      >
        ${icon ? `<span style="font-size: 1.2em;">${icon}</span>` : ''}
        ${text}
      </button>
    `;
  }

  getButtonPadding(size) {
    const sizes = {
      small: '8px 16px',
      medium: '12px 24px',
      large: '16px 32px'
    };
    return sizes[size] || sizes.medium;
  }

  getButtonVariantStyles(variant, theme) {
    const variants = {
      primary: `
        background: ${theme.colors.primary};
        color: white;
        &:hover { background: #2980b9; transform: translateY(-2px); }
      `,
      secondary: `
        background: ${theme.colors.secondary};
        color: white;
        &:hover { background: #34495e; transform: translateY(-2px); }
      `,
      success: `
        background: ${theme.colors.success};
        color: white;
        &:hover { background: #229954; transform: translateY(-2px); }
      `,
      warning: `
        background: ${theme.colors.warning};
        color: white;
        &:hover { background: #e67e22; transform: translateY(-2px); }
      `,
      danger: `
        background: ${theme.colors.danger};
        color: white;
        &:hover { background: #c0392b; transform: translateY(-2px); }
      `,
      outline: `
        background: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        &:hover { background: ${theme.colors.primary}; color: white; }
      `
    };
    return variants[variant] || variants.primary;
  }

  // کامپوننت کارت
  cardComponent(content, options = {}) {
    const theme = this.getCurrentTheme();
    const {
      title = null,
      footer = null,
      padding = 'medium',
      shadow = true,
      border = true
    } = options;

    const cardStyles = `
      background: white;
      border-radius: ${theme.borderRadius};
      ${shadow ? `box-shadow: ${theme.shadow};` : ''}
      ${border ? `border: 1px solid #e9ecef;` : ''}
      overflow: hidden;
      transition: all 0.3s ease;
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    `;

    const paddingSizes = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg
    };

    const contentPadding = paddingSizes[padding] || paddingSizes.medium;

    return `
      <div style="${cardStyles}">
        ${title ? `
          <div style="
            padding: ${contentPadding};
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
            font-weight: bold;
            color: ${theme.colors.secondary};
          ">
            ${title}
          </div>
        ` : ''}
        
        <div style="padding: ${contentPadding};">
          ${content}
        </div>
        
        ${footer ? `
          <div style="
            padding: ${contentPadding};
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
            color: #6c757d;
          ">
            ${footer}
          </div>
        ` : ''}
      </div>
    `;
  }

  // کامپوننت ورودی
  inputComponent(options = {}) {
    const theme = this.getCurrentTheme();
    const {
      type = 'text',
      placeholder = '',
      value = '',
      name = '',
      id = '',
      required = false,
      disabled = false,
      label = null,
      error = null
    } = options;

    const inputStyles = `
      width: 100%;
      padding: 12px;
      border: 2px solid ${error ? theme.colors.danger : '#e9ecef'};
      border-radius: ${theme.borderRadius};
      font-family: ${theme.typography.fontFamily};
      font-size: ${theme.typography.fontSize};
      transition: all 0.3s ease;
      background: ${disabled ? '#f8f9fa' : 'white'};
      
      &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
      }
      
      &:disabled {
        background: #f8f9fa;
        color: #6c757d;
        cursor: not-allowed;
      }
    `;

    return `
      <div style="margin-bottom: ${theme.spacing.md};">
        ${label ? `
          <label 
            for="${id}" 
            style="
              display: block;
              margin-bottom: ${theme.spacing.sm};
              font-weight: bold;
              color: ${theme.colors.secondary};
            "
          >
            ${label} ${required ? '<span style="color: #e74c3c;">*</span>' : ''}
          </label>
        ` : ''}
        
        <input
          type="${type}"
          placeholder="${placeholder}"
          value="${value}"
          name="${name}"
          id="${id}"
          style="${inputStyles}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
        >
        
        ${error ? `
          <div style="
            color: ${theme.colors.danger};
            font-size: 0.875em;
            margin-top: ${theme.spacing.xs};
          ">
            ${error}
          </div>
        ` : ''}
      </div>
    `;
  }

  // کامپوننت آمار
  statComponent(value, label, options = {}) {
    const theme = this.getCurrentTheme();
    const {
      icon = null,
      trend = null,
      size = 'medium',
      color = 'primary'
    } = options;

    const sizeStyles = {
      small: { value: '1.5rem', label: '0.875rem' },
      medium: { value: '2rem', label: '1rem' },
      large: { value: '2.5rem', label: '1.125rem' }
    };

    const selectedSize = sizeStyles[size] || sizeStyles.medium;

    const colorValue = theme.colors[color] || theme.colors.primary;

    return `
      <div style="
        text-align: center;
        padding: ${theme.spacing.lg};
        background: white;
        border-radius: ${theme.borderRadius};
        box-shadow: ${theme.shadow};
      ">
        ${icon ? `
          <div style="
            font-size: 2em;
            color: ${colorValue};
            margin-bottom: ${theme.spacing.sm};
          ">
            ${icon}
          </div>
        ` : ''}
        
        <div style="
          font-size: ${selectedSize.value};
          font-weight: bold;
          color: ${theme.colors.secondary};
          margin-bottom: ${theme.spacing.xs};
        ">
          ${value}
        </div>
        
        <div style="
          font-size: ${selectedSize.label};
          color: #6c757d;
          margin-bottom: ${theme.spacing.sm};
        ">
          ${label}
        </div>
        
        ${trend ? `
          <div style="
            font-size: 0.875em;
            color: ${trend.startsWith('+') ? theme.colors.success : theme.colors.danger};
          ">
            ${trend}
          </div>
        ` : ''}
      </div>
    `;
  }

  // کامپوننت پیشرفت
  progressComponent(value, max = 100, options = {}) {
    const theme = this.getCurrentTheme();
    const {
      label = null,
      showValue = true,
      size = 'medium',
      color = 'primary'
    } = options;

    const sizeStyles = {
      small: { height: '8px', fontSize: '0.75rem' },
      medium: { height: '12px', fontSize: '0.875rem' },
      large: { height: '16px', fontSize: '1rem' }
    };

    const selectedSize = sizeStyles[size] || sizeStyles.medium;
    const percentage = Math.min((value / max) * 100, 100);
    const colorValue = theme.colors[color] || theme.colors.primary;

    return `
      <div style="margin-bottom: ${theme.spacing.md};">
        ${label ? `
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${theme.spacing.sm};
          ">
            <span style="font-weight: bold; color: ${theme.colors.secondary};">${label}</span>
            ${showValue ? `
              <span style="font-size: 0.875em; color: #6c757d;">
                ${value}/${max} (${percentage.toFixed(1)}%)
              </span>
            ` : ''}
          </div>
        ` : ''}
        
        <div style="
          width: 100%;
          height: ${selectedSize.height};
          background: #e9ecef;
          border-radius: ${theme.borderRadius};
          overflow: hidden;
        ">
          <div style="
            width: ${percentage}%;
            height: 100%;
            background: ${colorValue};
            border-radius: ${theme.borderRadius};
            transition: width 0.3s ease;
            position: relative;
          "></div>
        </div>
      </div>
    `;
  }

  // کامپوننت هشدار
  alertComponent(message, options = {}) {
    const theme = this.getCurrentTheme();
    const {
      type = 'info',
      title = null,
      dismissible = false,
      icon = null
    } = options;

    const typeConfig = {
      info: { color: theme.colors.primary, icon: icon || 'ℹ️' },
      success: { color: theme.colors.success, icon: icon || '✅' },
      warning: { color: theme.colors.warning, icon: icon || '⚠️' },
      danger: { color: theme.colors.danger, icon: icon || '❌' }
    };

    const config = typeConfig[type] || typeConfig.info;

    return `
      <div style="
        padding: ${theme.spacing.md};
        background: ${config.color}15;
        border: 1px solid ${config.color}30;
        border-radius: ${theme.borderRadius};
        margin-bottom: ${theme.spacing.md};
      ">
        <div style="
          display: flex;
          align-items: flex-start;
          gap: ${theme.spacing.sm};
        ">
          <span style="font-size: 1.2em; flex-shrink: 0;">${config.icon}</span>
          
          <div style="flex: 1;">
            ${title ? `
              <div style="
                font-weight: bold;
                color: ${config.color};
                margin-bottom: ${theme.spacing.xs};
              ">
                ${title}
              </div>
            ` : ''}
            
            <div style="color: ${theme.colors.secondary};">
              ${message}
            </div>
          </div>
          
          ${dismissible ? `
            <button 
              style="
                background: none;
                border: none;
                font-size: 1.2em;
                cursor: pointer;
                color: #6c757d;
                flex-shrink: 0;
              "
              onclick="this.parentElement.parentElement.style.display='none'"
            >
              ×
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // utility methods
  getCurrentTheme() {
    return this.themes.get('default');
  }

  setTheme(themeName) {
    if (this.themes.has(themeName)) {
      this.currentTheme = themeName;
    }
  }

  // generate CSS styles
  generateGlobalStyles() {
    const theme = this.getCurrentTheme();
    
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: ${theme.typography.fontFamily};
          font-size: ${theme.typography.fontSize};
          line-height: ${theme.typography.lineHeight};
          color: ${theme.colors.dark};
          background: #f8f9fa;
          direction: rtl;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 ${theme.spacing.md};
        }
        
        .grid {
          display: grid;
          gap: ${theme.spacing.md};
        }
        
        .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        
        .mb-1 { margin-bottom: ${theme.spacing.xs}; }
        .mb-2 { margin-bottom: ${theme.spacing.sm}; }
        .mb-3 { margin-bottom: ${theme.spacing.md}; }
        .mb-4 { margin-bottom: ${theme.spacing.lg}; }
        .mb-5 { margin-bottom: ${theme.spacing.xl}; }
        
        .mt-1 { margin-top: ${theme.spacing.xs}; }
        .mt-2 { margin-top: ${theme.spacing.sm}; }
        .mt-3 { margin-top: ${theme.spacing.md}; }
        .mt-4 { margin-top: ${theme.spacing.lg}; }
        .mt-5 { margin-top: ${theme.spacing.xl}; }
      </style>
    `;
  }
}

export default new UIComponentsQuantum();
