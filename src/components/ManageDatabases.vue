<script>
import OauthProvider from '@/components/OauthProvider.vue';
import SharedLinkProvider from '@/components/SharedLinkProvider.vue';
import LocalPasswordFileProvider from '@/components/LocalPasswordFileProvider.vue';
import WebdavProvider from '@/components/WebdavProvider.vue';
import VirtualRouter from '@/lib/virtual-router.js';
import GooglePicker from '@/components/GooglePicker.vue';
export default {
  components: {
    OauthProvider,
    GooglePicker,
    SharedLinkProvider,
    LocalPasswordFileProvider,
    WebdavProvider,
  },
  props: {
    dropboxFileManager: Object,
    googleDriveManager: Object,
    localFileManager: Object,
    onedriveManager: Object,
    pCloudFileManager: Object,
    sampleManager: Object,
    webdavManager: Object,
    sharedUrlManager: Object,
    settings: Object,
  },
  data() {
    return {
      show: {
        help: {
          visible: false,
        },
        newUser: {
          visible: false,
        },
        none: {
          visible: true,
        },
      },
      tabRouter: new VirtualRouter(),
      providerStates: {},
    };
  },
  computed: {
    sortedProviders() {
      const providers = [
        { key: 'sample', manager: this.sampleManager, component: 'oauth-provider' },
        { key: 'dropbox', manager: this.dropboxFileManager, component: 'oauth-provider' },
        {
          key: 'gdrive',
          manager: this.googleDriveManager,
          component: 'oauth-provider',
          hasSlot: true,
        },
        { key: 'onedrive', manager: this.onedriveManager, component: 'oauth-provider' },
        { key: 'shared-url', manager: this.sharedUrlManager, component: 'shared-link-provider' },
        { key: 'webdav', manager: this.webdavManager, component: 'webdav-provider' },
        { key: 'local', manager: this.localFileManager, component: 'local-password-file-provider' },
      ];

      return providers.sort((a, b) => {
        const aLoggedIn = this.providerStates[a.key] || false;
        const bLoggedIn = this.providerStates[b.key] || false;
        return bLoggedIn - aLoggedIn;
      });
    },
  },
  mounted() {
    this.tabRouter.registerRoutes([
      {
        route: '/help/me/choose',
        var: this.show.help,
      },
      {
        route: '/new/user',
        var: this.show.newUser,
      },
      {
        route: '/',
        var: this.show.none,
      },
    ]);
    this.checkAllProvidersStatus();
  },
  methods: {
    async checkAllProvidersStatus() {
      const managers = [
        { key: 'sample', manager: this.sampleManager },
        { key: 'dropbox', manager: this.dropboxFileManager },
        { key: 'gdrive', manager: this.googleDriveManager },
        { key: 'onedrive', manager: this.onedriveManager },
        { key: 'shared-url', manager: this.sharedUrlManager },
        { key: 'webdav', manager: this.webdavManager },
        { key: 'local', manager: this.localFileManager },
      ];

      for (const { key, manager } of managers) {
        if (manager && manager.isLoggedIn) {
          try {
            const loggedIn = await manager.isLoggedIn();
            this.providerStates[key] = loggedIn;
          } catch {
            this.providerStates[key] = false;
          }
        }
      }
    },
    onProviderLogin(key) {
      this.providerStates[key] = true;
    },
    onProviderLogout(key) {
      this.providerStates[key] = false;
    },
  },
};
</script>

<template>
  <div class="manage-databases-container">
    <div class="box-bar about roomy">
      <p>
        {{ $t('manageDatabases.description') }}
      </p>

      <a class="waves-effect waves-light btn mr-10" @click="tabRouter.route('/help/me/choose')">{{
        $t('manageDatabases.helpMeChoose')
      }}</a>
      <a class="waves-effect waves-light btn" @click="tabRouter.route('/new/user')">{{
        $t('manageDatabases.newUser')
      }}</a>

      <p v-show="show.help.visible" id="/help/me/choose">
        {{ $t('manageDatabases.helpText') }}
      </p>

      <p v-show="show.newUser.visible" id="/new/user">
        {{ $t('manageDatabases.newUserText') }}
      </p>
    </div>
    <div class="providers-masonry">
      <template v-for="provider in sortedProviders" :key="provider.key">
        <oauth-provider
          v-if="provider.component === 'oauth-provider' && !provider.hasSlot"
          :provider-manager="provider.manager"
          :settings="settings"
          @login="onProviderLogin(provider.key)"
          @logout="onProviderLogout(provider.key)"
        />
        <oauth-provider
          v-else-if="provider.component === 'oauth-provider' && provider.hasSlot"
          :provider-manager="provider.manager"
          :settings="settings"
          @login="onProviderLogin(provider.key)"
          @logout="onProviderLogout(provider.key)"
        >
          <google-picker v-if="provider.key === 'gdrive'" v-bind="{ googleDriveManager, settings }" />
        </oauth-provider>
        <shared-link-provider
          v-else-if="provider.component === 'shared-link-provider'"
          :provider-manager="provider.manager"
          :settings="settings"
          @login="onProviderLogin(provider.key)"
          @logout="onProviderLogout(provider.key)"
        />
        <webdav-provider
          v-else-if="provider.component === 'webdav-provider'"
          :provider-manager="provider.manager"
          :settings="settings"
          @login="onProviderLogin(provider.key)"
          @logout="onProviderLogout(provider.key)"
        />
        <local-password-file-provider
          v-else-if="provider.component === 'local-password-file-provider'"
          :provider-manager="provider.manager"
          :settings="settings"
          @login="onProviderLogin(provider.key)"
          @logout="onProviderLogout(provider.key)"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/settings.scss';

.manage-databases-container {
  width: 100%;
}

.providers-masonry {
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

.providers-masonry > * {
  break-inside: avoid;
  margin-bottom: 16px;
}
</style>
