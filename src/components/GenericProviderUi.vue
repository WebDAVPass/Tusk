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
      return this.providerManager.chooseTitle;
    },
    providerDescription() {
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
      return this.providerManager.chooseDescription;
    },
  },
};
</script>

<template>
  <div>
    <div class="between">
      <div class="title" style="display: flex; align-items: center">
        <span>
          <svg class="icon" viewBox="0 0 1 1">
            <use v-bind="{ 'xlink:href': '#' + providerManager.icon }" />
          </svg>
          {{ providerTitle }}
        </span>
        <span v-show="error.length" class="error pill">{{ error }}</span>
      </div>
      <div>
        <div class="switch">
          <label>
            <input :disabled="busy" type="checkbox" :checked="loggedIn" @click="toggleLogin" />
            <span class="lever" />
          </label>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap">
      <span v-for="(db, index) in databases" class="chip" style="margin-bottom: 5px">
        {{ db.title }}
        <i
          v-if="removeable"
          class="fa fa-times-circle selectable"
          aria-hidden="true"
          @click="removeFunction(index)"
        />
      </span>
    </div>
    <div class="description">
      {{ providerDescription }}
    </div>
  </div>
</template>
