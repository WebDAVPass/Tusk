/**
 * 主题管理器
 * 管理自动/手动深浅色主题切换
 */

const THEME_KEY = 'themePreference';
const THEME_AUTO = 'auto';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

class ThemeManager {
  constructor() {
    this.currentTheme = THEME_AUTO;
    this.mediaQuery = null;
    this.callbacks = [];
    
    // 初始化媒体查询监听器
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }

  /**
   * 初始化主题
   * 从存储中读取用户偏好并应用
   */
  async init() {
    const savedTheme = await this.getSavedTheme();
    this.applyTheme(savedTheme);
  }

  /**
   * 获取保存的主题设置
   */
  async getSavedTheme() {
    try {
      const result = await chrome.storage.local.get([THEME_KEY]);
      return result[THEME_KEY] || THEME_AUTO;
    } catch (e) {
      console.warn('Failed to get theme preference:', e);
      return THEME_AUTO;
    }
  }

  /**
   * 保存主题设置
   */
  async saveTheme(theme) {
    try {
      await chrome.storage.local.set({ [THEME_KEY]: theme });
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }

  /**
   * 应用主题
   * @param {string} theme - 'auto', 'light', 'dark'
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    
    const root = document.documentElement;
    
    // 移除所有主题属性
    root.removeAttribute('data-theme');
    
    if (theme === THEME_AUTO) {
      // 自动模式：使用媒体查询
      root.setAttribute('data-theme', 'auto');
    } else if (theme === THEME_DARK) {
      // 强制深色模式
      root.setAttribute('data-theme', 'dark');
    } else {
      // 强制浅色模式（默认）
      root.setAttribute('data-theme', 'light');
    }

    // 触发回调
    this.notifyCallbacks();
  }

  /**
   * 设置主题
   * @param {string} theme - 'auto', 'light', 'dark'
   */
  async setTheme(theme) {
    if (![THEME_AUTO, THEME_LIGHT, THEME_DARK].includes(theme)) {
      console.warn('Invalid theme:', theme);
      return;
    }
    
    await this.saveTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题模式
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 获取实际生效的主题（考虑自动模式）
   * @returns {string} 'light' 或 'dark'
   */
  getEffectiveTheme() {
    if (this.currentTheme === THEME_AUTO) {
      return this.getSystemTheme();
    }
    return this.currentTheme;
  }

  /**
   * 获取系统主题偏好
   * @returns {string} 'light' 或 'dark'
   */
  getSystemTheme() {
    if (this.mediaQuery) {
      return this.mediaQuery.matches ? THEME_DARK : THEME_LIGHT;
    }
    return THEME_LIGHT;
  }

  /**
   * 处理系统主题变化
   */
  handleSystemThemeChange() {
    if (this.currentTheme === THEME_AUTO) {
      this.notifyCallbacks();
    }
  }

  /**
   * 订阅主题变化
   * @param {Function} callback - 回调函数
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * 取消订阅
   * @param {Function} callback - 回调函数
   */
  offChange(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * 通知所有回调
   */
  notifyCallbacks() {
    const effectiveTheme = this.getEffectiveTheme();
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentTheme, effectiveTheme);
      } catch (e) {
        console.error('Theme change callback error:', e);
      }
    });
  }

  /**
   * 切换主题（循环：auto -> light -> dark -> auto）
   */
  async toggleTheme() {
    const themes = [THEME_AUTO, THEME_LIGHT, THEME_DARK];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    await this.setTheme(themes[nextIndex]);
  }

  /**
   * 获取主题图标
   * @param {string} theme - 主题名称
   * @returns {string} Font Awesome 图标类名
   */
  getThemeIcon(theme = this.currentTheme) {
    switch (theme) {
      case THEME_AUTO:
        return 'fa-adjust';
      case THEME_DARK:
        return 'fa-moon-o';
      case THEME_LIGHT:
      default:
        return 'fa-sun-o';
    }
  }

  /**
   * 获取主题显示文本
   * @param {string} theme - 主题名称
   * @returns {string} 本地化文本键
   */
  getThemeTextKey(theme = this.currentTheme) {
    switch (theme) {
      case THEME_AUTO:
        return 'theme.auto';
      case THEME_DARK:
        return 'theme.dark';
      case THEME_LIGHT:
      default:
        return 'theme.light';
    }
  }
}

// 创建单例实例
const themeManager = new ThemeManager();

export { themeManager, ThemeManager, THEME_AUTO, THEME_LIGHT, THEME_DARK };
