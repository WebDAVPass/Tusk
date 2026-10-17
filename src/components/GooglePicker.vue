<script>
import { ChromePromiseApi } from '@/lib/chrome-api-promise.js';
import { oauthConfig } from '../../services/oauthConfig.js';
const chromePromise = ChromePromiseApi();

export default {
  props: {
    settings: Object,
    googleDriveManager: Object,
  },
  data() {
    return {
      pickerOpen: false,
    };
  },
  mounted() {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.m === 'pickerResult') {
          console.info('Picker result', event);
          this.$parent.populate();
          this.pickerOpen = false;
        }
      },
      false
    );
  },
  methods: {
    showPicker() {
      this.pickerOpen = true;
      const APP_ID = oauthConfig[this.googleDriveManager.key].client_id;
      this.googleDriveManager.getToken().then((accessToken) => {
        const iframe = document.getElementById('pickerFrame').contentWindow;
        iframe.postMessage(
          {
            m: 'showPicker',
            accessToken: accessToken,
            appId: APP_ID,
          },
          '*'
        );
      });
    },
  },
};
</script>

<template>
  <div>
    <div class="warn pill">
      <p>
        <b>{{ $t('providers.google.updateNotice') }}</b>
        <br />{{ $t('providers.google.troubleshooting') }}
      </p>
    </div>
    <div v-show="!pickerOpen" style="margin-top: 10px">
      <a class="btn" @click="showPicker"> {{ $t('providers.google.chooseButton') }} </a>
    </div>
    <iframe
      v-show="pickerOpen"
      id="pickerFrame"
      style="width: 100%; height: 480px; border: 4px solid gray"
      src="https://subdavis.com/Tusk/sandbox-picker.html"
    />
  </div>
</template>
