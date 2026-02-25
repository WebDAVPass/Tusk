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
    };
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
      }, // Use this to hide others, since no id=none element exists.
    ]);
  },
};
</script>

<template>
  <div>
    <div class="box-bar about roomy">
      <p>
        {{ $t('manageDatabases.description') }}
      </p>

      <a class="waves-effect waves-light btn mr-10" @click="tabRouter.route('/help/me/choose')"
        >{{ $t('manageDatabases.helpMeChoose') }}</a
      >
      <a class="waves-effect waves-light btn" @click="tabRouter.route('/new/user')"
        >{{ $t('manageDatabases.newUser') }}</a
      >

      <p v-show="show.help.visible" id="/help/me/choose">
        {{ $t('manageDatabases.helpText') }}
      </p>

      <p v-show="show.newUser.visible" id="/new/user">
        {{ $t('manageDatabases.newUserText') }}
      </p>
    </div>
    <oauth-provider :provider-manager="sampleManager" :settings="settings" />
    <oauth-provider :provider-manager="dropboxFileManager" :settings="settings" />
    <oauth-provider :provider-manager="googleDriveManager" :settings="settings">
      <google-picker v-bind="{ googleDriveManager, settings }" />
    </oauth-provider>
    <oauth-provider :provider-manager="onedriveManager" :settings="settings" />
    <!-- <oauth-provider :provider-manager="pCloudFileManager" :settings="settings"></oauth-provider> -->
    <shared-link-provider :provider-manager="sharedUrlManager" :settings="settings" />
    <webdav-provider :provider-manager="webdavManager" :settings="settings" />
    <local-password-file-provider :provider-manager="localFileManager" :settings="settings" />
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
</style>
