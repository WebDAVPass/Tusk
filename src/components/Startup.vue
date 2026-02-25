<script>
/* beautify preserve:start */
import { Links } from '$services/links.js';
import Spinner from '@/components/Spinner.vue';
/* beautify preserve:end */
export default {
  components: {
    Spinner,
  },
  props: {
    settings: Object,
    passwordFileStoreRegistry: Object,
  },
  data() {
    return {
      links: Links(),
      busy: true,
    };
  },
  mounted: function () {
    this.settings.getCurrentDatabaseChoice().then((info) => {
      //use the last chosen database
      if (info) {
        this.$router.route(
          '/unlock/' + info.providerKey + '/' + encodeURIComponent(info.passwordFile.title)
        );
      } else {
        //user has not yet chosen a database.  Lets see if there are any available to choose...
        var readyPromises = [];
        this.passwordFileStoreRegistry.listFileManagers('listDatabases').forEach((provider) => {
          readyPromises.push(provider.listDatabases());
        });

        return Promise.all(readyPromises).then((filesArrays) => {
          var availableFiles = filesArrays.reduce((prev, curr) => {
            return prev.concat(curr);
          });

          if (availableFiles.length) {
            //choose one of the files
            this.$router.route('/choose');
          } else {
            //no files available - allow the user to link to the options page
            this.busy = false;
          }
        });
      }
    });
  },
};
</script>

<template>
  <div>
    <!-- Busy Spinner -->
    <div v-if="busy" class="box-bar plain spinner">
      <spinner size="large" />
    </div>
    <div v-else>
      <div class="box-bar plain">
        <div class="unlockLogo stack-item">
          <img src="@/assets/icons/exported/128x128.svg" />
          <span>{{ $t('startup.title') }}</span>
        </div>
        <p>{{ $t('startup.description') }}</p>
      </div>
      <div class="stack-item selectable">
        <button class="action-button selectable" @click="links.openOptions">
          {{ $t('startup.addDatabase') }}
        </button>
      </div>
      <div class="box-bar plain">
        <p>{{ $t('startup.returnHint') }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
p {
  width: 100%;
  margin: 10px 0px 0px 0px;
  font-size: 14px;
}
</style>
