/**
 * 国际化配置文件
 * 配置 vue-i18n 并导出 i18n 实例
 */

import { createI18n } from 'vue-i18n';
import en from './en.js';
import zhCN from './zh-CN.js';

/**
 * 获取浏览器默认语言
 * @returns {string} 语言代码
 */
function getBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en';
}

/**
 * 简单的消息格式化函数，支持 {variable} 插值
 * 避免使用 new Function()
 * @param {string} message - 消息模板
 * @param {Object} values - 要插入的值
 * @returns {string} 格式化后的消息
 */
function simpleFormat(message, values = {}) {
  if (typeof message !== 'string') return message;
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return values.hasOwnProperty(key) ? values[key] : match;
  });
}

/**
 * 创建 i18n 实例
 * @param {string} locale - 默认语言
 * @returns {Object} i18n 实例
 */
export function createI18nInstance(locale = 'en') {
  const i18n = createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: 'en',
    messages: {
      en,
      'zh-CN': zhCN,
    },
    // 使用自定义消息编译器，避免使用 new Function()
    messageCompiler: (message) => {
      return (ctx) => {
        // 支持 {key} 格式的变量插值
        if (typeof message === 'string') {
          return simpleFormat(message, ctx.values || {});
        }
        return message;
      };
    },
  });

  return i18n;
}

/**
 * 从设置中获取语言
 * @param {Object} settings - 设置对象
 * @returns {Promise<string>} 语言代码
 */
export async function getLocaleFromSettings(settings) {
  if (settings && settings.getSetLocale) {
    const savedLocale = await settings.getSetLocale();
    if (savedLocale) {
      return savedLocale;
    }
  }
  return getBrowserLocale();
}

export { en, zhCN };
