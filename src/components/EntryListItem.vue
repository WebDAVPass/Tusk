<script>
import { parseUrl } from '@/lib/utils.js';
import { getIconClass } from '@/lib/keepassIcons.js';
export default {
  props: {
    entry: Object,
    unlockedState: Object,
  },
  computed: {
    header: function () {
      if (this.entry.title.length > 0) return this.entry.title;
      return this.entry.url;
    },
    entryIcon() {
      if (this.entry.isCustomIcon && this.entry.icon) {
        return { type: 'custom', data: this.entry.icon };
      } else if (this.entry.iconId !== undefined) {
        return { type: 'standard', class: getIconClass(this.entry.iconId) };
      }
      return { type: 'default', class: 'key' };
    },
  },
  watch: {
    // When the element becomes active, scroll it into view.
    'entry.view_is_active': function (val) {
      if (val)
        this.$el.scrollIntoView({
          block: 'end',
          inline: 'nearest',
          behavior: 'smooth',
        });
    },
  },
  methods: {
    details(e) {
      this.$router.route('/entry-details/' + this.entry.id);
    },
    autofill(e) {
      e.stopPropagation();
      console.debug('autofill');
      this.unlockedState.autofill(this.entry);
    },
    copy(e) {
      e.stopPropagation();
      console.debug('copy');
      this.unlockedState.copyPassword(this.entry);
    },
  },
};
</script>

<template>
  <div
    class="entry-list-item selectable between flair"
    :class="{ active: entry.view_is_active }"
    @click="details"
  >
    <div class="entry-icon">
      <img
        v-if="entryIcon.type === 'custom'"
        :src="entryIcon.data"
        class="custom-icon"
        :alt="entry.iconName || 'icon'"
      />
      <i v-else :class="'fa fa-' + entryIcon.class" class="standard-icon" />
    </div>
    <div class="text-info" :class="{ strike: entry.is_expired }">
      <span class="header">{{ header }}</span>
      <br />
      <span class="user">
        {{ entry.userName || $t('entryListItem.emptyUsername') }}
      </span>
    </div>
    <div class="buttons">
      <span class="fa-stack copy" @click="copy">
        <i class="fa fa-circle fa-stack-2x" />
        <i class="fa fa-clipboard fa-stack-1x fa-inverse" />
      </span>
      <span class="fa-stack autofill" @click="autofill">
        <i class="fa fa-circle fa-stack-2x" />
        <i class="fa fa-magic fa-stack-1x fa-inverse" />
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
.entry-list-item {
  transition: all 0.3s ease;
  width: 100%;
  padding: 10px $wall-padding;
  box-sizing: border-box;
  border-bottom: 1px solid $light-gray;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  .entry-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    .custom-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }
    .standard-icon {
      font-size: 18px;
      color: var(--primary-color);
    }
  }
  .text-info {
    flex: 1;
    min-width: 0;
  }
  .header {
    font-size: 16px;
  }
  .user {
    font-size: 12px;
  }
  .buttons {
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    min-width: 80px;
  }
  .copy,
  .autofill {
    opacity: 0.2;
  }
  .copy:hover,
  .autofill:hover {
    opacity: 0.8;
  }
  &.active {
    background-color: $highlighted;
    padding-left: 20px;
  }
}

.strike {
  text-decoration: line-through;
}
</style>
