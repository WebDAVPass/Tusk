<!-- 
	SharedLinkProvider:
	Simple http provider that can also handle Dropbox Shared Links
-->
<script>
import * as Base64 from 'base64-arraybuffer';
import { ChromePromiseApi } from '@/lib/chrome-api-promise.js';
import GenericProviderUi from '@/components/GenericProviderUi.vue';
const chromePromise = ChromePromiseApi();

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
      webdav: {
        username: '',
        url: '',
        password: '',
      },
      serverList: [],
      serverListMeta: {},
    };
  },
  mounted() {
    if (this.providerManager && this.providerManager.isLoggedIn) {
      this.providerManager.isLoggedIn().then((loggedIn) => {
        this.loggedIn = loggedIn;
        if (loggedIn) this.onLogin();
      });
    }
  },
  methods: {
    addServer() {
      chromePromise.permissions
        .request({
          origins: [this.webdav.url],
        })
        .then(() => {
          this.providerManager
            .addServer(this.webdav.url, this.webdav.username, this.webdav.password)
            .then((serverInfo) => {
              return this.updateServerList().then(() => {
                this.scan(serverInfo.serverId);
              });
            })
            .catch((err) => {
              console.error(err);
              this.messages.error = err.toString();
            });
        })
        .catch((err) => {
          console.error(err);
          this.messages.error = err.toString();
        });
    },
    setBusy(serverId, busy) {
      let serverListItem = this.serverList.filter((elem) => {
        return elem.serverId === serverId;
      })[0];
      serverListItem.scanBusy = busy;
    },
    scan(serverId) {
      this.setBusy(serverId, true);
      return this.providerManager
        .searchServer(serverId)
        .then((dirMap) => {
          this.providerManager.listDatabases().then((databases) => {
            this.databases = databases;
          });
        })
        .catch((err) => {
          this.messages.error = err.toString();
        })
        .then(() => {
          this.setBusy(serverId, false);
        });
    },
    remove(serverId) {
      return this.providerManager.removeServer(serverId).then(this.updateServerList);
    },
    updateServerList() {
      return this.providerManager.listServers().then((servers) => {
        this.serverList = servers;
      });
    },
    toggleLogin() {
      if (!this.providerManager) {
        console.error('WebDAV providerManager is undefined');
        this.messages.error = 'WebDAV providerManager not available';
        return;
      }
      if (this.loggedIn) {
        this.settings.disableDatabaseProvider(this.providerManager);
        this.providerManager
          .logout()
          .then(() => {
            this.loggedIn = false;
            this.$emit('logout');
          })
          .catch((err) => {
            console.error('WebDAV 登出失败:', err);
            this.messages.error = err.toString();
          });
      } else {
        this.providerManager
          .login()
          .then(() => {
            this.loggedIn = true;
            this.$emit('login');
            this.onLogin();
          })
          .catch((err) => {
            console.error('WebDAV 登录失败:', err);
            this.messages.error = err.toString();
            this.loggedIn = false;
          });
      }
    },
    onLogin() {
      this.providerManager.listDatabases().then((databases) => {
        this.databases = databases;
      });
      this.updateServerList();
    },
  },
};
</script>

<template>
  <div class="webdav-provider-wrapper">
    <generic-provider-ui
      :busy="busy"
      :databases="databases"
      :logged-in="loggedIn"
      :error="messages.error"
      :provider-manager="providerManager"
      :toggle-login="toggleLogin"
      :removeable="false"
    >
      <div v-if="loggedIn" class="webdav-config-section">
        <div class="warn pill">
          <p>
            {{ $t('providers.webdav.warning') }}
          </p>
        </div>
        <div class="webdav-description">
          <p>
            {{ $t('providers.webdav.descriptionDetail') }}
          </p>
        </div>
        <table v-if="serverList.length" class="webdav-server-table">
          <thead>
            <tr>
              <th>{{ $t('providers.webdav.table.user') }}</th>
              <th>{{ $t('providers.webdav.table.url') }}</th>
              <th>{{ $t('providers.webdav.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(server, index) in serverList" :key="server.serverId || index">
              <td>{{ server.username }}</td>
              <td>{{ server.url }}</td>
              <td>
                <a v-show="!server.scanBusy" class="selectable" @click="scan(server.serverId)">
                  <i class="fa fa-search" /> {{ $t('providers.webdav.scan') }}</a
                >
                <a v-show="server.scanBusy"
                  ><i class="fa fa-spinner fa-pulse" /> {{ $t('providers.webdav.scanning') }}</a
                >
              </td>
              <td>
                <a class="selectable" @click="remove(server.serverId)">
                  <i class="fa fa-times-circle selectable" /> {{ $t('providers.webdav.remove') }}</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <div class="webdav-add-server">
          <p>
            <b>{{ $t('providers.webdav.addNewServer') }}</b>
          </p>
          <div class="webdav-server-input-box">
            <input
              id="webdav-server"
              v-model="webdav.url"
              type="text"
              :placeholder="$t('providers.webdav.form.urlPlaceholder')"
            />
            <input
              id="webdav-username"
              v-model="webdav.username"
              type="text"
              :placeholder="$t('providers.webdav.form.usernamePlaceholder')"
            />
            <input
              id="webdav-password"
              v-model="webdav.password"
              type="password"
              :placeholder="$t('providers.webdav.form.passwordPlaceholder')"
            />
          </div>
          <a class="waves-effect waves-light btn" @click="addServer">{{
            $t('providers.webdav.form.addButton')
          }}</a>
        </div>
      </div>
    </generic-provider-ui>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/settings.scss';

.webdav-provider-wrapper {
  margin-bottom: 0;
  height: fit-content;
  display: inline-block;
  width: 100%;
}

.webdav-config-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.webdav-description {
  margin: 12px 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 13px;
}

.webdav-server-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 12px;
  display: block;
  overflow-x: auto;

  th {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 600;
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--border-light);
    color: var(--text-primary);
    vertical-align: middle;
  }

  tr:hover {
    background-color: var(--bg-secondary);
  }

  td:nth-child(1) {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:nth-child(2) {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:nth-child(3),
  td:nth-child(4) {
    white-space: nowrap;
  }
}

.webdav-add-server {
  margin-top: 16px;

  p {
    margin-bottom: 12px;
    color: var(--text-primary);
  }
}

.webdav-server-input-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  input {
    padding: 8px 12px;
    border: 1px solid var(--input-border);
    border-radius: 6px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 13px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--input-border-focus);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    &#webdav-server {
      width: 100%;
      flex-basis: 100%;
    }

    &#webdav-username,
    &#webdav-password {
      flex: 1;
      min-width: 150px;
    }
  }
}

.warn {
  background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-light) 100%);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 12px;

  p {
    margin: 0;
    font-weight: 500;
    font-size: 13px;
  }
}

.selectable {
  cursor: pointer;
  color: var(--primary-color);
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-dark);
  }
}
</style>
