<script>
import { themeManager, THEME_AUTO, THEME_LIGHT, THEME_DARK } from '@/lib/themeManager.js';

export default {
  name: 'ThemeToggle',
  props: {
    settings: Object,
    variant: {
      type: String,
      default: 'button', // 'button', 'dropdown', 'segmented'
    },
  },
  data() {
    return {
      currentTheme: THEME_AUTO,
      effectiveTheme: THEME_LIGHT,
    };
  },
  computed: {
    themes() {
      return [
        { value: THEME_AUTO, icon: 'fa-adjust', label: this.$t('theme.auto') },
        { value: THEME_LIGHT, icon: 'fa-sun-o', label: this.$t('theme.light') },
        { value: THEME_DARK, icon: 'fa-moon-o', label: this.$t('theme.dark') },
      ];
    },
    currentIcon() {
      const theme = this.themes.find((t) => t.value === this.currentTheme);
      return theme ? theme.icon : 'fa-adjust';
    },
    currentLabel() {
      const theme = this.themes.find((t) => t.value === this.currentTheme);
      return theme ? theme.label : this.$t('theme.auto');
    },
  },
  async mounted() {
    // 确保主题管理器初始化
    await themeManager.init();
    
    // 从设置中加载主题
    if (this.settings) {
      const savedTheme = await this.settings.getSetTheme();
      this.currentTheme = savedTheme;
      themeManager.applyTheme(savedTheme);
    } else {
      this.currentTheme = themeManager.getCurrentTheme();
    }

    this.effectiveTheme = themeManager.getEffectiveTheme();

    // 监听主题变化
    themeManager.onChange(this.handleThemeChange);
  },
  beforeUnmount() {
    themeManager.offChange(this.handleThemeChange);
  },
  methods: {
    handleThemeChange(currentTheme, effectiveTheme) {
      this.currentTheme = currentTheme;
      this.effectiveTheme = effectiveTheme;
    },
    async setTheme(theme) {
      // 使用 themeManager.setTheme 进行验证和应用
      await themeManager.setTheme(theme);
      this.currentTheme = themeManager.getCurrentTheme();

      // 如果有 settings，同步保存到设置
      if (this.settings) {
        await this.settings.getSetTheme(theme);
      }
    },
    async toggleTheme() {
      await themeManager.toggleTheme();
      this.currentTheme = themeManager.getCurrentTheme();

      // 如果有 settings，同步保存到设置
      if (this.settings) {
        await this.settings.getSetTheme(this.currentTheme);
      }
    },
  },
};
</script>

<template>
  <!-- 按钮式切换 -->
  <div v-if="variant === 'button'" class="theme-toggle-button">
    <button class="theme-btn" :title="currentLabel" @click="toggleTheme">
      <i class="fa" :class="currentIcon"></i>
      <span class="theme-label">{{ currentLabel }}</span>
    </button>
  </div>

  <!-- 分段控制器 -->
  <div v-else-if="variant === 'segmented'" class="theme-segmented">
    <button
      v-for="theme in themes"
      :key="theme.value"
      class="segment-btn"
      :class="{ active: currentTheme === theme.value }"
      :title="theme.label"
      @click="setTheme(theme.value)"
    >
      <i class="fa" :class="theme.icon"></i>
      <span>{{ theme.label }}</span>
    </button>
  </div>

  <!-- 下拉选择 -->
  <div v-else class="theme-dropdown">
    <select class="modern-select" :value="currentTheme" @change="setTheme($event.target.value)">
      <option v-for="theme in themes" :key="theme.value" :value="theme.value">
        {{ theme.label }}
      </option>
    </select>
  </div>
</template>

<style lang="scss">
@import '../styles/theme-variables.scss';

// 按钮式切换
.theme-toggle-button {
  .theme-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    font-size: 14px;
    font-weight: 500;
    color: $text-secondary;
    background: $bg-secondary;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      background: $bg-tertiary;
      color: $text-primary;
      box-shadow: $shadow-sm;
    }

    &:active {
      transform: scale(0.98);
    }

    i {
      font-size: 16px;
      color: $primary-color;
    }

    .theme-label {
      @media (max-width: 400px) {
        display: none;
      }
    }
  }
}

// 分段控制器
.theme-segmented {
  display: inline-flex;
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 2px;
  gap: 2px;

  .segment-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
    background: transparent;
    border: none;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      color: $text-primary;
      background: rgba(var(--primary-rgb), 0.05);
    }

    &.active {
      color: $primary-color;
      background: $bg-primary;
      box-shadow: $shadow-sm;
    }

    i {
      font-size: 14px;
    }

    span {
      @media (max-width: 480px) {
        display: none;
      }
    }
  }
}

// 下拉选择
.theme-dropdown {
  .modern-select {
    appearance: none;
    padding: $space-2 $space-8 $space-2 $space-3;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    background: $bg-secondary;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;
    min-width: 120px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235f6b7a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right $space-3 center;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    &:hover {
      border-color: $primary-light;
      background: $bg-tertiary;
    }

    option {
      background: $bg-primary;
      color: $text-primary;
    }
  }
}
</style>
