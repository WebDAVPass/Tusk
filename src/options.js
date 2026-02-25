'use strict';

import 'font-awesome/css/font-awesome.css';

// Vue Components
import { createApp } from 'vue';
import Options from './Options.vue';
import VirtualRouter from '@/lib/virtual-router.js';
import './styles/options.scss';
import { createI18nInstance, getLocaleFromSettings } from '@/locales/index.js';
import { Settings } from '$services/settings.js';
import { ProtectedMemory } from '$services/protectedMemory';
import { SecureCacheMemory } from '$services/secureCacheMemory.js';

document.documentElement.setAttribute('theme', 'light');

/**
 * 初始化应用
 */
async function initApp() {
  // 创建设置实例以获取语言设置
  const protectedMemory = new ProtectedMemory();
  const secureCache = new SecureCacheMemory(protectedMemory);
  const settings = new Settings(secureCache);

  // 获取语言设置
  const locale = await getLocaleFromSettings(settings);

  // 创建 i18n 实例
  const i18n = createI18nInstance(locale);

  // 创建应用
  const app = createApp(Options);
  app.config.globalProperties.$router = new VirtualRouter();
  app.use(i18n);
  app.mount('#app');
}

initApp();
