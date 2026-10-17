<!-- 
	OauthProvider:
	Database Provider for database managers that implement the oauth interface:
		/* The providerManager implements the following methods that return promises:
		 * isLoggedIn()
		 * login()
		 * logout()
		 * listDatabases()
		 */
	If new providers are added, prefer that they are oauth providers.
-->
<script>
import GenericProviderUi from '@/components/GenericProviderUi.vue';

export default {
  components: {
    GenericProviderUi,
  },
  emits: ['login', 'logout'],
  props: {
    providerManager: Object,
    settings: Object,
  },
  data() {
    return {
      busy: false,
      databases: [],
      loggedIn: false,
      messages: {
        error: '',
      },
    };
  },
  mounted() {
    this.populate();
  },
  methods: {
    populate() {
      if (!this.providerManager) {
        this.busy = false;
        return;
      }
      this.busy = true;
      this.messages.error = '';
      this.providerManager
        .listDatabases()
        .then((databases) => {
          this.databases = databases;
          if (this.providerManager && this.providerManager.isLoggedIn) {
            this.providerManager.isLoggedIn().then((loggedIn) => {
              this.loggedIn = loggedIn;
              this.busy = false;
            });
          } else {
            this.busy = false;
          }
        })
        .catch((err) => {
          console.error(
            'Error while connecting to database backend for',
            this.providerManager ? this.providerManager.title : 'unknown provider'
          );
          this.messages.error = err.toString();
          this.databases = [];
          console.error(err);
          this.busy = false;
        });
    },
    toggleLogin(event) {
      if (!this.busy) {
        if (this.loggedIn) {
          this.providerManager
            .logout()
            .then((nil) => {
              this.settings.disableDatabaseProvider(this.providerManager);
              this.$emit('logout');
              this.populate();
            })
            .catch((err) => {
              this.settings.disableDatabaseProvider(this.providerManager);
              this.messages.error = err.toString();
            });
        } else {
          this.providerManager
            .login()
            .then((nil) => {
              this.$emit('login');
              this.populate();
            })
            .catch((err) => {
              this.loggedIn = false;
              this.messages.error = err.toString();
            });
        }
      } else {
        console.error('Wait for toggle state to settle before changing enable/disable');
      }
    },
  },
};
</script>

<template>
  <div class="box-bar roomy database-manager oauth-provider-card">
    <generic-provider-ui
      :busy="busy"
      :databases="databases"
      :logged-in="loggedIn"
      :error="messages.error"
      :provider-manager="providerManager"
      :toggle-login="toggleLogin"
      :removeable="false"
      :remove-function="undefined"
    />
    <template v-if="loggedIn">
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/settings.scss';

.oauth-provider-card {
  margin-bottom: 0;
  height: fit-content;
  display: inline-block;
  width: 100%;
}
</style>
