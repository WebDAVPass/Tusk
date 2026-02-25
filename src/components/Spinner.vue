<template>
  <div class="spinner-container">
    <div class="spinner" :style="spinnerStyle"></div>
    <div v-if="message" class="spinner-text" :style="textStyle">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    size: {
      type: [String, Number],
      default: 32,
    },
    lineSize: {
      type: Number,
      default: 3,
    },
    lineBgColor: {
      type: String,
      default: '#eee',
    },
    lineFgColor: {
      type: String,
      default: '#2196f3',
    },
    speed: {
      type: Number,
      default: 0.8,
    },
    message: {
      type: String,
      default: '',
    },
    fontSize: {
      type: Number,
      default: 13,
    },
    textFgColor: {
      type: String,
      default: '#555',
    },
  },
  computed: {
    sizePx() {
      const sizeMap = {
        tiny: 12,
        small: 16,
        medium: 32,
        large: 48,
        big: 64,
        huge: 96,
        massive: 128,
      };
      if (typeof this.size === 'string' && sizeMap[this.size]) {
        return sizeMap[this.size];
      }
      return typeof this.size === 'number' ? this.size : 32;
    },
    lineSizePx() {
      const lineSizeMap = {
        tiny: 1,
        small: 2,
        medium: 3,
        large: 3,
        big: 4,
        huge: 4,
        massive: 5,
      };
      if (typeof this.size === 'string' && lineSizeMap[this.size]) {
        return lineSizeMap[this.size];
      }
      return typeof this.lineSize === 'number' ? this.lineSize : 3;
    },
    spinnerStyle() {
      return {
        margin: '0 auto',
        borderRadius: '100%',
        border: `${this.lineSizePx}px solid ${this.lineBgColor}`,
        borderTop: `${this.lineSizePx}px solid ${this.lineFgColor}`,
        width: `${this.sizePx}px`,
        height: `${this.sizePx}px`,
        animation: `spinner-spin ${this.speed}s linear infinite`,
      };
    },
    textStyle() {
      const textMarginTop = Math.min(Math.max(Math.ceil(this.sizePx / 8), 3), 12);
      const textFontSize = Math.min(Math.max(Math.ceil(this.sizePx * 0.4), 11), 32);
      return {
        marginTop: `${textMarginTop}px`,
        color: this.textFgColor,
        fontSize: `${this.fontSize || textFontSize}px`,
        textAlign: 'center',
      };
    },
  },
};
</script>

<style scoped>
.spinner-container {
  display: inline-block;
}

@keyframes spinner-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
