<script>
export default {
  props: {
    providerManager: Object,
    busy: Boolean,
    databases: Array,
    error: String,
    loggedIn: Boolean,
    toggleLogin: Function,
    removeable: Boolean,
    removeFunction: Function,
  },
  computed: {
    providerTitle() {
      if (!this.providerManager) return '';
      // 根据 provider key 返回对应的 i18n 翻译键
      const keyMap = {
        sample: 'providers.sampleDatabase.title',
        dropbox: 'providers.dropbox.title',
        gdrive: 'providers.googleDrive.title',
        onedrive: 'providers.oneDrive.title',
        'shared-url': 'providers.sharedLink.title',
        webdav: 'providers.webdav.title',
        local: 'providers.localFile.title',
      };
      const i18nKey = keyMap[this.providerManager.key];
      if (i18nKey && this.$te(i18nKey)) {
        return this.$t(i18nKey);
      }
      // 如果没有找到翻译，返回原始的英文标题
      return this.providerManager.chooseTitle || '';
    },
    providerDescription() {
      if (!this.providerManager) return '';
      // 根据 provider key 返回对应的 i18n 翻译键
      const keyMap = {
        sample: 'providers.sampleDatabase.description',
        dropbox: 'providers.dropbox.description',
        gdrive: 'providers.googleDrive.description',
        onedrive: 'providers.oneDrive.description',
        'shared-url': 'providers.sharedLink.description',
        webdav: 'providers.webdav.description',
        local: 'providers.localFile.description',
      };
      const i18nKey = keyMap[this.providerManager.key];
      if (i18nKey && this.$te(i18nKey)) {
        return this.$t(i18nKey);
      }
      // 如果没有找到翻译，返回原始的英文描述
      return this.providerManager.chooseDescription || '';
    },
    providerIcon() {
      if (!this.providerManager || !this.providerManager.icon) return '';
      return this.providerManager.icon;
    },
  },
};
</script>

<template>
  <div class="provider-card">
    <div class="provider-header">
      <div class="provider-title">
        <span class="title-content">
          <svg class="provider-icon" viewBox="0 0 1 1">
            <use v-if="providerIcon" v-bind="{ 'xlink:href': '#' + providerIcon }" />
          </svg>
          <span class="title-text">{{ providerTitle }}</span>
        </span>
        <span v-show="error.length" class="error-badge">{{ error }}</span>
      </div>
      <div class="provider-switch">
        <label class="modern-switch">
          <input :disabled="busy" type="checkbox" :checked="loggedIn" @click="toggleLogin" />
          <span class="modern-switch-slider"></span>
        </label>
      </div>
    </div>

    <div class="provider-databases">
      <span v-for="(db, index) in databases" :key="index" class="modern-chip">
        {{ db.title }}
        <i
          v-if="removeable"
          class="fa fa-times-circle chip-remove"
          aria-hidden="true"
          @click="removeFunction(index)"
        />
      </span>
    </div>

    <div class="provider-description">
      {{ providerDescription }}
    </div>

    <slot></slot>
  </div>
</template>

<style lang="scss">
.provider-card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 20px;
  margin-bottom: 0;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-light);
  height: fit-content;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
}

.provider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.provider-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  .title-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .provider-icon {
    width: 24px;
    height: 24px;
    fill: var(--primary-color);
  }

  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .error-badge {
    background: linear-gradient(135deg, var(--error-color) 0%, var(--error-light) 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }
}

.provider-switch {
  .modern-switch {
    display: flex;
    align-items: center;
    cursor: pointer;

    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .modern-switch-slider {
        background: linear-gradient(135deg, var(--success-color) 0%, var(--success-light) 100%);
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
          0 0 0 3px rgba(var(--success-rgb, 76, 175, 80), 0.2);
      }

      &:disabled + .modern-switch-slider {
        opacity: 0.5;
        cursor: not-allowed;
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
  }
}

.provider-databases {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;

  .modern-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--bg-secondary);
    border-radius: 9999px;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    gap: 4px;
    border: 1px solid var(--border-light);

    &:hover {
      background: var(--bg-tertiary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .chip-remove {
      cursor: pointer;
      color: var(--text-muted);
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 14px;

      &:hover {
        color: var(--error-color);
        transform: scale(1.1);
      }
    }
  }
}

.provider-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--border-light);
  display: block;
  visibility: visible;
}
</style>
