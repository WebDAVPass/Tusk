<script>
import JSONFormatter from 'json-formatter-js';
import { isFirefox } from '@/lib/utils';
import { toRaw } from 'vue';

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
    init() {
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
  },
};
</script>

<template>
  <div>
    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.clipboardExpireTime.title') }}</h4>
      <p>{{ $t('advancedSettings.clipboardExpireTime.description') }}</p>
    </div>
    <div class="box-bar roomy lighter">
      <select v-model="expireTime" style="display: inline-block">
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

    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.hotkeyNavigation.title') }}</h4>
      <p>{{ $t('advancedSettings.hotkeyNavigation.description') }}</p>
    </div>
    <div class="box-bar roomy lighter">
      <div>
        <div class="switch">
          <label>
            <input v-model="hotkeyNavEnabled" type="checkbox" />
            <span class="lever" />
            {{ $t('advancedSettings.hotkeyNavigation.label') }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="!isFirefox()" class="box-bar roomy">
      <h4>{{ $t('advancedSettings.allOriginPermission.title') }}</h4>
      <p>
        <strong style="color: #d9534f">{{
          $t('advancedSettings.allOriginPermission.warning')
        }}</strong>
        {{ $t('advancedSettings.allOriginPermission.description') }}
      </p>
    </div>
    <div v-if="!isFirefox()" class="box-bar roomy lighter">
      <div>
        <div class="switch">
          <label @click="toggleOriginPermissions">
            <input v-model="allOriginPermission" type="checkbox" />
            <span class="lever" @click.prevent />
            {{ $t('advancedSettings.allOriginPermission.label') }}
          </label>
        </div>
      </div>
    </div>

    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.notifications.title') }}</h4>
      <p>{{ $t('advancedSettings.notifications.description') }}</p>
    </div>
    <div class="box-bar roomy lighter">
      <div>
        <div class="switch">
          <label>
            <input v-model="notificationsEnabled" type="checkbox" value="expiration" />
            <span class="lever" />
            {{ $t('advancedSettings.notifications.passwordExpiration') }}
          </label>
        </div>
        <div class="switch">
          <label>
            <input v-model="notificationsEnabled" type="checkbox" value="clipboard" />
            <span class="lever" />
            {{ $t('advancedSettings.notifications.clipboardEvents') }}
          </label>
        </div>
      </div>
    </div>

    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.strictMatching.title') }}</h4>
      <p>
        {{ $t('advancedSettings.strictMatching.description') }}
      </p>
    </div>
    <div class="box-bar roomy lighter">
      <div>
        <div class="switch">
          <label>
            <input v-model="strictMatchEnabled" type="checkbox" />
            <span class="lever" />
            {{ $t('advancedSettings.strictMatching.label') }}
          </label>
        </div>
      </div>
    </div>

    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.storedData.title') }}</h4>
      <p>{{ $t('advancedSettings.storedData.description') }}</p>
    </div>

    <!-- Language Selection -->
    <div class="box-bar roomy">
      <h4>{{ $t('advancedSettings.language.title') }}</h4>
      <p>{{ $t('advancedSettings.language.description') }}</p>
    </div>
    <div class="box-bar roomy lighter">
      <select v-model="selectedLocale" style="display: inline-block" @change="changeLocale">
        <option value="en">{{ $t('advancedSettings.language.english') }}</option>
        <option value="zh-CN">{{ $t('advancedSettings.language.chinese') }}</option>
      </select>
    </div>

    <div v-for="blob in jsonState" class="box-bar lighter roomy">
      <p>{{ blob.k }}</p>
      <div class="between">
        <div :id="blob.k" class="json" />
        <a
          v-if="blob.delete !== undefined"
          class="waves-effect waves-light btn"
          @click="
            blob.delete.f(blob.delete.arg);
            init();
          "
          >{{ blob.delete.op }}</a
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';

.json {
  font-size: 12px;
}

h4 {
  font-size: 24px;
}
</style>
