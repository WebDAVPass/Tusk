<script>
import JSONFormatter from 'json-formatter-js';
import { isFirefox } from '@/lib/utils';
import { toRaw } from 'vue';
import { themeManager, THEME_AUTO, THEME_LIGHT, THEME_DARK } from '@/lib/themeManager.js';

export default {
  props: {
    settings: Object,
    secureCacheMemory: Object,
  },
  data() {
    return {
      busy: false,
      expireTime: 2,
      hotkeyNavEnabled: false,
      allOriginPermission: false,
      allOriginPerms: {
        origins: ['https://*/*', 'http://*/*'],
      },
      strictMatchEnabled: false,
      notificationsEnabled: ['expiration'],
      selectedLocale: 'en',
      selectedTheme: THEME_AUTO,
      themes: [
        { value: THEME_AUTO, icon: 'fa-adjust', label: this.$t('theme.auto') },
        { value: THEME_LIGHT, icon: 'fa-sun-o', label: this.$t('theme.light') },
        { value: THEME_DARK, icon: 'fa-moon-o', label: this.$t('theme.dark') },
      ],
      jsonState: [
        {
          k: 'databaseUsages', // key
          f: this.settings.getSetDatabaseUsages, // getter
          delete: {
            f: this.settings.destroyLocalStorage, // remover
            arg: 'databaseUsages', // remover args
            op: 'Delete', // remover button name
          },
        },
        {
          k: 'webdavServerList',
          f: this.settings.getSetWebdavServerList,
          delete: {
            f: this.settings.destroyLocalStorage,
            arg: 'webdavServerList',
            op: 'Delete',
          },
        },
        {
          k: 'webdavDirectoryMap',
          f: this.settings.getSetWebdavDirectoryMap,
          delete: {
            f: this.settings.destroyLocalStorage,
            arg: 'webdavDirectoryMap',
            op: 'Delete',
          },
        },
        {
          k: 'selectedDatabase',
          f: this.settings.getCurrentDatabaseChoice,
          delete: {
            f: this.settings.destroyLocalStorage,
            arg: 'selectedDatabase',
            op: 'Delete',
          },
        },
        {
          k: 'keyFiles',
          f: this.settings.getKeyFiles,
          delete: {
            f: this.settings.deleteAllKeyFiles,
            arg: undefined,
            op: 'Delete',
          },
        },
        {
          k: 'forgetTimes',
          f: this.settings.getAllForgetTimes,
        },
        {
          k: 'sharedUrlList',
          f: this.settings.getSharedUrlList,
          delete: {
            f: this.settings.destroyLocalStorage,
            arg: 'sharedUrlList',
            op: 'Delete',
          },
        },
      ],
    };
  },
  watch: {
    expireTime(newval, oldval) {
      this.settings.getSetClipboardExpireInterval(parseInt(newval));
    },
    hotkeyNavEnabled(newval, oldval) {
      this.settings.getSetHotkeyNavEnabled(newval);
    },
    strictMatchEnabled(newval, oldval) {
      this.settings.getSetStrictModeEnabled(newval);
    },
    notificationsEnabled(newval) {
      this.settings.getSetNotificationsEnabled(newval);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    isFirefox: isFirefox,
    toggleOriginPermissions(evt) {
      // Negated because this function will call before the vue model update.
      const rawPerms = toRaw(this.allOriginPerms); // Convert proxy to raw object
      if (!this.allOriginPermission) {
        chrome.permissions.request(rawPerms);
      } else {
        chrome.permissions.remove(rawPerms);
      }
      this.settings.getSetOriginPermissionEnabled(!this.allOriginPermission);
      this.allOriginPermission = !this.allOriginPermission;
    },
    async init() {
      this.settings.getSetClipboardExpireInterval().then((val) => {
        this.expireTime = val;
      });
      this.settings.getSetHotkeyNavEnabled().then((val) => {
        this.hotkeyNavEnabled = val;
      });
      this.settings.getSetNotificationsEnabled().then((val) => {
        this.notificationsEnabled = val;
      });
      this.settings.getSetStrictModeEnabled().then((val) => {
        this.strictMatchEnabled = val;
      });
      this.settings.getSetLocale().then((val) => {
        this.selectedLocale = val || 'en';
      });

      // 加载主题设置
      const savedTheme = await this.settings.getSetTheme();
      this.selectedTheme = savedTheme;
      themeManager.applyTheme(savedTheme);

      if (!isFirefox()) {
        const rawPerms = toRaw(this.allOriginPerms);
        chrome.permissions.contains(rawPerms, (granted) => {
          this.allOriginPermission = !!granted;
        });
      }
      this.jsonState.forEach((blob) => {
        blob.f().then((result) => {
          if (result && Object.keys(result).length) {
            let formatter = new JSONFormatter(result);
            let place = document.getElementById(blob.k);
            while (place.firstChild) place.removeChild(place.firstChild);
            place.appendChild(formatter.render());
          } else {
            document.getElementById(blob.k).parentNode.parentNode.remove();
          }
        });
      });
    },
    changeLocale() {
      this.settings.getSetLocale(this.selectedLocale).then(() => {
        // 刷新页面以应用新语言
        window.location.reload();
      });
    },
    async changeTheme(theme) {
      this.selectedTheme = theme;
      themeManager.applyTheme(theme);
      await this.settings.getSetTheme(theme);
    },
  },
};
</script>

<template>
  <div class="advanced-settings">
    <div class="settings-masonry">
      <!-- 剪贴板过期时间设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.clipboardExpireTime.title') }}</h4>
          <p>{{ $t('advancedSettings.clipboardExpireTime.description') }}</p>
        </div>
        <div class="settings-content">
          <select v-model="expireTime" class="modern-select">
            <option value="1">
              {{ $t('advancedSettings.clipboardExpireTime.minutes1') }}
            </option>
            <option value="2">
              {{ $t('advancedSettings.clipboardExpireTime.minutes2') }}
            </option>
            <option value="3">
              {{ $t('advancedSettings.clipboardExpireTime.minutes3') }}
            </option>
            <option value="5">
              {{ $t('advancedSettings.clipboardExpireTime.minutes5') }}
            </option>
            <option value="8">
              {{ $t('advancedSettings.clipboardExpireTime.minutes8') }}
            </option>
          </select>
        </div>
      </div>

      <!-- 热键导航设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.hotkeyNavigation.title') }}</h4>
          <p>{{ $t('advancedSettings.hotkeyNavigation.description') }}</p>
        </div>
        <div class="settings-content">
          <label class="modern-switch">
            <input v-model="hotkeyNavEnabled" type="checkbox" />
            <span class="modern-switch-slider"></span>
            <span class="modern-switch-label">{{
              $t('advancedSettings.hotkeyNavigation.label')
            }}</span>
          </label>
        </div>
      </div>

      <!-- 所有来源权限设置 -->
      <div v-if="!isFirefox()" class="settings-card warning-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.allOriginPermission.title') }}</h4>
          <p>
            <strong class="warning-text">{{
              $t('advancedSettings.allOriginPermission.warning')
            }}</strong>
            {{ $t('advancedSettings.allOriginPermission.description') }}
          </p>
        </div>
        <div class="settings-content">
          <label class="modern-switch">
            <input v-model="allOriginPermission" type="checkbox" @click="toggleOriginPermissions" />
            <span class="modern-switch-slider"></span>
            <span class="modern-switch-label">{{
              $t('advancedSettings.allOriginPermission.label')
            }}</span>
          </label>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.notifications.title') }}</h4>
          <p>{{ $t('advancedSettings.notifications.description') }}</p>
        </div>
        <div class="settings-content">
          <label class="modern-switch">
            <input v-model="notificationsEnabled" type="checkbox" value="expiration" />
            <span class="modern-switch-slider"></span>
            <span class="modern-switch-label">{{
              $t('advancedSettings.notifications.passwordExpiration')
            }}</span>
          </label>
          <label class="modern-switch">
            <input v-model="notificationsEnabled" type="checkbox" value="clipboard" />
            <span class="modern-switch-slider"></span>
            <span class="modern-switch-label">{{
              $t('advancedSettings.notifications.clipboardEvents')
            }}</span>
          </label>
        </div>
      </div>

      <!-- 严格匹配设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.strictMatching.title') }}</h4>
          <p>{{ $t('advancedSettings.strictMatching.description') }}</p>
        </div>
        <div class="settings-content">
          <label class="modern-switch">
            <input v-model="strictMatchEnabled" type="checkbox" />
            <span class="modern-switch-slider"></span>
            <span class="modern-switch-label">{{ $t('advancedSettings.strictMatching.label') }}</span>
          </label>
        </div>
      </div>

      <!-- 主题设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('theme.title') }}</h4>
          <p>{{ $t('theme.description') }}</p>
        </div>
        <div class="settings-content">
          <div class="theme-segmented">
            <button
              v-for="theme in themes"
              :key="theme.value"
              class="segment-btn"
              :class="{ active: selectedTheme === theme.value }"
              @click="changeTheme(theme.value)"
            >
              <i class="fa" :class="theme.icon"></i>
              <span>{{ theme.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 语言选择 -->
      <div class="settings-card">
        <div class="settings-header">
          <h4>{{ $t('advancedSettings.language.title') }}</h4>
          <p>{{ $t('advancedSettings.language.description') }}</p>
        </div>
        <div class="settings-content">
          <select v-model="selectedLocale" class="modern-select" @change="changeLocale">
            <option value="en">{{ $t('advancedSettings.language.english') }}</option>
            <option value="zh-CN">{{ $t('advancedSettings.language.chinese') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 存储数据 -->
    <div class="settings-card stored-data-card">
      <div class="settings-header">
        <h4>{{ $t('advancedSettings.storedData.title') }}</h4>
        <p>{{ $t('advancedSettings.storedData.description') }}</p>
      </div>
    </div>

    <!-- JSON数据展示 -->
    <div class="json-data-masonry">
      <div v-for="blob in jsonState" :key="blob.k" class="settings-card data-card">
        <div class="settings-content">
          <p class="data-title">{{ blob.k }}</p>
          <div class="between">
            <div :id="blob.k" class="json" />
            <button
              v-if="blob.delete !== undefined"
              class="modern-button danger small"
              @click="
                blob.delete.f(blob.delete.arg);
                init();
              "
            >
              {{ blob.delete.op }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.advanced-settings {
  width: 100%;
  background: var(--bg-primary);
}

.settings-masonry {
  column-count: 3;
  column-gap: 16px;
  width: 100%;

  @media (max-width: 1200px) {
    column-count: 2;
  }

  @media (max-width: 768px) {
    column-count: 1;
  }
}

.json-data-masonry {
  column-count: 3;
  column-gap: 16px;
  width: 100%;
  margin-top: 16px;

  @media (max-width: 1200px) {
    column-count: 2;
  }

  @media (max-width: 768px) {
    column-count: 1;
  }
}

.stored-data-card {
  margin-top: 16px;
  break-inside: avoid;
}

.settings-masonry > *,
.json-data-masonry > * {
  break-inside: avoid;
  margin-bottom: 16px;
}

.settings-card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  margin-bottom: 0;
  overflow: hidden;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-light);
  height: fit-content;
  display: inline-block;
  width: 100%;

  &:hover {
    box-shadow: var(--shadow-lg);
  }

  &.warning-card {
    border: 1px solid rgba(255, 152, 0, 0.3);
    box-shadow:
      var(--shadow-md),
      0 0 0 1px rgba(255, 152, 0, 0.1);

    &:hover {
      box-shadow:
        var(--shadow-lg),
        0 0 0 1px rgba(255, 152, 0, 0.2);
    }
  }

  &.data-card {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-sm);

    &:hover {
      box-shadow: var(--shadow-md);
    }
  }
}

.settings-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .warning-text {
    color: var(--error-color);
    font-weight: 600;
  }
}

.settings-content {
  padding: 20px;

  .modern-switch {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .modern-switch-slider {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
        box-shadow:
          var(--shadow-md),
          inset 0 1px 2px rgba(255, 255, 255, 0.2);

        &::before {
          transform: translateX(20px);
          box-shadow: var(--shadow-md);
        }
      }

      &:focus + .modern-switch-slider {
        box-shadow:
          var(--shadow-md),
          0 0 0 3px rgba(var(--primary-rgb), 0.2);
      }
    }

    .modern-switch-slider {
      position: relative;
      width: 44px;
      height: 24px;
      background: var(--switch-bg-off);
      border-radius: 9999px;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      flex-shrink: 0;

      &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: var(--switch-thumb);
        border-radius: 9999px;
        transition: transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: var(--shadow-sm);
      }
    }

    .modern-switch-label {
      margin-left: 12px;
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }
  }

  .modern-select {
    appearance: none;
    padding: 12px 32px 12px 16px;
    font-size: 14px;
    color: var(--text-primary);
    background: var(--input-bg);
    border: 2px solid var(--input-border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 200px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235f6b7a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    &:hover {
      border-color: var(--primary-light);
    }

    option {
      background: var(--bg-primary);
      color: var(--text-primary);
    }
  }

  .modern-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
    text-decoration: none;
    gap: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    &:focus {
      outline: none;
      box-shadow:
        var(--shadow-md),
        0 0 0 3px rgba(var(--primary-rgb), 0.3);
    }

    &.danger {
      background: linear-gradient(135deg, var(--error-color) 0%, var(--error-light) 100%);

      &:hover {
        box-shadow:
          var(--shadow-lg),
          0 10px 15px -3px rgba(244, 67, 54, 0.3);
      }

      &:focus {
        box-shadow:
          var(--shadow-md),
          0 0 0 3px rgba(244, 67, 54, 0.3);
      }
    }

    &.small {
      padding: 8px 16px;
      font-size: 12px;
    }
  }

  .data-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 12px 0;
  }

  .json {
    font-size: 12px;
    background: var(--bg-primary);
    padding: 12px;
    border-radius: 10px;
    border: 1px solid var(--border-light);
    flex: 1;
    margin-right: 12px;
    overflow-x: auto;
    color: var(--text-primary);
  }

  .between {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  // 主题分段控制器
  .theme-segmented {
    display: inline-flex;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 2px;
    gap: 2px;

    .segment-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: var(--text-primary);
        background: rgba(var(--primary-rgb), 0.05);
      }

      &.active {
        color: var(--primary-color);
        background: var(--bg-primary);
        box-shadow: var(--shadow-sm);
      }

      i {
        font-size: 14px;
      }
    }
  }
}
</style>
