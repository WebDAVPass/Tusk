<script>
import { parseUrl, getValidTokens } from '@/lib/utils.js';

import InfoCluster from '@/components/InfoCluster.vue';
import EntryList from '@/components/EntryList.vue';
import Spinner from '@/components/Spinner.vue';
import Messenger from '@/components/Messenger.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    InfoCluster,
    EntryList,
    Spinner,
    Messenger,
  },
  props: {
    /* Service dependeicies */
    unlockedState: Object,
    secureCache: Object,
    settings: Object,
    keepassService: Object,
    links: Object,
  },
  data() {
    return {
      /* UI state data */
      unlockedMessages: {
        warn: '',
        error: '',
      },
      generalMessages: {
        warn: '',
        error: '',
        success: '',
      },
      busy: false,
      isUnlocked: false,
      masterPassword: '',
      isMasterPasswordInputVisible: false,
      keyFiles: [], // list of all available
      selectedKeyFile: undefined, // chosen keyfile object
      rememberPeriod: 0, // in minutes. default: do not remember
      rememberPeriodText: '',
      databaseFileName: '',
      keyFilePicker: false,
      appVersion: chrome.runtime.getManifest().version,
      slider_int: 0,
    };
  },
  computed: {
    rememberPassword: function () {
      return this.rememberPeriod !== 0;
    },
    selectedKeyFileName: function () {
      if (this.selectedKeyFile !== undefined) return this.selectedKeyFile.name;
      return this.$t('unlock.noKeyfileSelected');
    },
    slider_options: function () {
      return [
        {
          time: 0,
          text: this.$t('unlock.rememberPeriod.doNotRemember'),
        },
        {
          time: 30,
          text: this.$t('unlock.rememberPeriod.minutes30'),
        },
        {
          time: 120,
          text: this.$t('unlock.rememberPeriod.hours2'),
        },
        {
          time: 240,
          text: this.$t('unlock.rememberPeriod.hours4'),
        },
        {
          time: 480,
          text: this.$t('unlock.rememberPeriod.hours8'),
        },
        {
          time: 1440,
          text: this.$t('unlock.rememberPeriod.hours24'),
        },
        {
          time: -1,
          text: this.$t('unlock.rememberPeriod.untilExit'),
        },
      ];
    },
  },
  watch: {
    unlockedMessages: {
      handler(newval) {
        this.unlockedState.cacheSet('unlockedMessages', newval);
      },
      deep: true,
    },
  },
  async mounted() {
    // modify unlockedState internal state
    await this.unlockedState.getTabDetails();

    if (!this.isUnlocked) {
      let try_autounlock = () => {
        this.busy = true;
        this.settings
          .getKeyFiles()
          .then((keyFiles) => {
            this.keyFiles = keyFiles;
            return this.settings.getSetDefaultRememberPeriod();
          })
          .then((rememberPeriod) => {
            this.setRememberPeriod(rememberPeriod);
            return this.settings.getCurrentDatabaseUsage();
          })
          .then((usage) => {
            // tweak UI based on what we know about the db file
            this.hidePassword = usage.requiresPassword === false;
            this.hideKeyFile = usage.requiresKeyfile === false;
            this.rememberedPassword = usage.passwordKey !== undefined;
            this.setRememberPeriod(usage.rememberPeriod);

            if (usage.passwordKey !== undefined && usage.requiresKeyfile === false) {
              this.unlock(usage.passwordKey); // Autologin if no keyfile
            } else if (usage.keyFileName !== undefined) {
              let matches = this.keyFiles.filter((kf) => {
                return kf.name === usage.keyFileName;
              });
              if (matches.length > 0) {
                this.selectedKeyFile = matches[0];
                if (this.hidePassword === true || usage.passwordKey !== undefined)
                  this.unlock(usage.passwordKey);
              }
            }
          })
          .catch((err) => {
            console.error('Auto-unlock error:', err);
          })
          .finally(() => {
            this.busy = false;
          });
      };

      let focus = () => {
        this.$nextTick(() => {
          let mp = this.$refs.masterPassword;
          if (mp !== undefined) mp.focus();
        });
      };

      this.busy = true;
      try {
        let entries = await this.secureCache.get('secureCache.entries');
        if (entries !== undefined && entries.length > 0) {
          this.showResults(entries, true);
        } else {
          try_autounlock();
        }
      } catch (err) {
        console.error(err);
        //this is fine - it just means the cache expired.  Clear the cache to be sure.
        this.secureCache.clear('secureCache.entries');
        try_autounlock();
      }
      this.busy = false;
      focus();
    }
    if (this.unlockedState.sitePermission) {
      this.generalMessages.success = this.$t('unlock.warnings.permissionGranted', {
        origin: this.unlockedState.origin,
      });
    } else {
      this.generalMessages.warn = this.$t('unlock.warnings.newSite');
    }
    //set knowlege from the URL
    this.databaseFileName = decodeURIComponent(this.$router.getRoute().title);
  },
  methods: {
    setRememberPeriod(time_int) {
      /* Args: optional time_int
       * if time_int is given, derive slider_int
       * else assume slider_int is alread set.
       */
      let slider_option_index;
      if (time_int !== undefined) {
        this.slider_int = ((t) => {
          for (let i = 0; i < this.slider_options.length; i++) {
            if (this.slider_options[i].time === t) return i;
          }
          return 0;
        })(time_int);
        slider_option_index = this.slider_int;
      } else {
        slider_option_index = parseInt(this.slider_int);
      }
      if (slider_option_index < this.slider_options.length) {
        this.rememberPeriod = this.slider_options[slider_option_index].time;
        this.rememberPeriodText = this.slider_options[slider_option_index].text;
      }
    },
    closeWindow(event) {
      window.close();
    },
    chooseKeyFile(index) {
      if (index !== undefined)
        if (index >= 0) this.selectedKeyFile = this.keyFiles[index];
        else this.selectedKeyFile = undefined;
      this.keyFilePicker = false;
    },
    chooseAnotherFile() {
      this.unlockedState.clearBackgroundState();
      this.secureCache.clear('secureCache.entries');
      this.$router.route('/choose');
    },
    forgetPassword() {
      this.settings.getCurrentMasterPasswordCacheKey().then((key) => {
        if (key !== null) this.secureCache.clear(key);
        this.secureCache.clear('secureCache.entries');
        this.unlockedState.clearClipboardState();
        this.unlockedState.clearCache(); // new
        this.isUnlocked = false;
      });
    },
    showResults(entries, fromCache) {
      let getMatchesForThreshold = (threshold, entries, requireEmptyURL = false) => {
        return entries.filter((e) => e.matchRank >= threshold && (requireEmptyURL ? !e.URL : true));
      };
      this.settings.getSetStrictModeEnabled().then((strictMode) => {
        let siteUrl = parseUrl(this.unlockedState.url);
        let title = this.unlockedState.title;
        let siteTokens = getValidTokens(siteUrl.hostname + '.' + this.unlockedState.title);
        this.keepassService.rankEntries(entries, siteUrl, title, siteTokens); // in-place

        let allEntries = entries;
        let priorityEntries = getMatchesForThreshold(100, entries);

        if (priorityEntries.length == 0) {
          priorityEntries = getMatchesForThreshold(10, entries);

          // in strict mode, good matches are considered partial matches.
          if (strictMode && priorityEntries.length) {
            this.unlockedMessages['warn'] = this.$t('entryList.noPerfectMatches', {
              count: priorityEntries.length,
            });
          }
        }
        if (!strictMode && priorityEntries.length == 0) {
          priorityEntries = getMatchesForThreshold(0.8, entries, true);
        }
        if (!strictMode && priorityEntries.length == 0) {
          priorityEntries = getMatchesForThreshold(0.4, entries);

          if (priorityEntries.length) {
            this.unlockedMessages.warn = this.$t('entryList.noCloseMatches', {
              count: priorityEntries.length,
            });
          }
        }
        if (priorityEntries.length == 0) {
          this.unlockedMessages.warn = this.$t('entryList.noMatches');
        }

        // Cache in memory
        this.unlockedState.cacheSet('allEntries', allEntries);
        this.unlockedState.cacheSet('priorityEntries', priorityEntries);

        //save longer term (in encrypted storage)
        if (!fromCache) {
          // Don't bother saving if we're just reading from the cache.
          this.secureCache.save('secureCache.entries', entries);
        }
        this.busy = false;
        this.isUnlocked = true;
      });
    },
    clickUnlock(event) {
      event.preventDefault();
      this.unlock();
    },
    unlock(passwordKey) {
      this.busy = true;
      this.generalMessages.error = '';
      let passwordKeyPromise;
      let bufferPromise = this.keepassService.getChosenDatabaseFile();
      if (passwordKey === undefined)
        passwordKeyPromise = this.keepassService.getMasterKey(
          bufferPromise,
          this.masterPassword,
          this.selectedKeyFile
        );
      else passwordKeyPromise = Promise.resolve(passwordKey);

      let keyFileName = this.selectedKeyFile !== undefined ? this.selectedKeyFile.name : undefined;
      passwordKeyPromise
        .then((passwordKey) => {
          return this.keepassService
            .getDecryptedData(bufferPromise, passwordKey)
            .then((decryptedData) => {
              let entries = decryptedData.entries;
              let version = decryptedData.version;
              let dbUsage = {
                requiresPassword: passwordKey.passwordHash === null ? false : true,
                requiresKeyfile: passwordKey.keyFileHash === null ? false : true,
                passwordKey: undefined,
                version: version,
                keyFileName: keyFileName,
                rememberPeriod: this.rememberPeriod,
              };
              if (this.rememberPeriod !== 0) {
                let check_time = 60000 * this.rememberPeriod; // milliseconds / min
                // Save the password in memory independently.
                this.settings.cacheMasterPassword(passwordKey, {
                  forgetTime: check_time > 0 ? Date.now() + check_time : check_time,
                });
              } else {
                this.settings.getCurrentMasterPasswordCacheKey().then(this.secureCache.clear);
              }
              this.settings.saveCurrentDatabaseUsage(dbUsage);
              this.settings.getSetDefaultRememberPeriod(this.rememberPeriod);
              this.showResults(entries);
              this.busy = false;
              this.masterPassword = '';
            });
        })
        .catch((err) => {
          console.error(err);
          this.generalMessages['error'] =
            err.message || this.$t('unlock.errors.invalidKeyfileOrDatabase');
          this.busy = false;
          throw err;
        });
    },
  },
});
</script>

<template>
  <div>
    <!-- Busy Spinner -->
    <div v-if="busy" class="spinner">
      <spinner size="medium" :message="$t('unlock.unlocking', { name: databaseFileName })" />
    </div>

    <!-- Entry List -->
    <EntryList
      v-if="!busy && isUnlocked"
      :messages="unlockedMessages"
      :unlocked-state="unlockedState"
      :settings="settings"
    />

    <!-- General Messenger -->
    <messenger v-show="!busy" :messages="generalMessages" />

    <!-- Unlock input group -->
    <div v-if="!busy && !isUnlocked" id="masterPasswordGroup">
      <div class="unlockLogo stack-item">
        <img src="/assets/icons/exported/128x128.svg" width="256px" height="256px" />
        <span>{{ $t('unlock.title') }}</span>
      </div>

      <form @submit="clickUnlock">
        <div class="small selectable databaseChoose" @click="$router.route('/choose')">
          <b>{{ databaseFileName }}</b>
          <span class="muted-color">{{ $t('unlock.changeDatabase') }}</span>
        </div>

        <div class="stack-item masterPasswordInput">
          <input
            id="masterPassword"
            ref="masterPassword"
            v-model="masterPassword"
            :type="isMasterPasswordInputVisible ? 'text' : 'password'"
            :placeholder="$t('unlock.masterPasswordPlaceholder')"
            autocomplete="off"
          />
          <i
            :class="['fa', isMasterPasswordInputVisible ? 'fa-eye-slash' : 'fa-eye', 'fa-fw']"
            aria-hidden="true"
            @click="isMasterPasswordInputVisible = !isMasterPasswordInputVisible"
          />
        </div>

        <div class="stack-item">
          <div
            id="select-keyfile"
            class="selectable"
            @click="
              selectedKeyFile = undefined;
              keyFilePicker = !keyFilePicker;
            "
          >
            <i class="fa fa-key" aria-hidden="true" /> {{ selectedKeyFileName }}
          </div>
        </div>

        <div v-if="keyFilePicker" class="stack-item keyfile-picker">
          <transition name="keyfile-picker">
            <div>
              <span
                v-for="(kf, kf_index) in keyFiles"
                class="selectable"
                :keyfile-index="kf_index"
                @click="chooseKeyFile(kf_index)"
              >
                <i class="fa fa-file fa-fw" aria-hidden="true" /> {{ kf.name }}
              </span>
              <span class="selectable" @click="links.openOptionsKeyfiles">
                <i class="fa fa-wrench fa-fw" aria-hidden="true" />
                {{ $t('unlock.manageKeyfiles') }}</span
              >
            </div>
          </transition>
        </div>

        <div class="box-bar small plain remember-period-picker">
          <span>
            <label for="rememberPeriodLength">
              <span>{{ rememberPeriodText }} {{ $t('unlock.rememberPeriodHint') }}</span>
            </label>
            <input
              id="rememberPeriodLength"
              v-model="slider_int"
              type="range"
              min="0"
              :max="slider_options.length - 1"
              step="1"
              @input="setRememberPeriod(undefined)"
            />
          </span>
        </div>

        <div class="stack-item">
          <button class="action-button selectable" @click="clickUnlock">
            {{ $t('unlock.unlockDatabase') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <div v-show="!busy" class="box-bar medium between footer">
      <span class="selectable" @click="links.openOptions">
        <i class="fa fa-cog" aria-hidden="true" /> {{ $t('common.settings') }}</span
      >
      <span v-if="isUnlocked" class="selectable" @click="forgetPassword">
        <i class="fa fa-lock" aria-hidden="true" /> {{ $t('unlock.lockDatabase') }}</span
      >
      <span v-else class="selectable" @click="closeWindow">
        <i class="fa fa-times-circle" aria-hidden="true" /> {{ $t('unlock.closeWindow') }}</span
      >
      <span class="selectable" @click="links.openHomepage">
        <i class="fa fa-info-circle" aria-hidden="true" /> v{{ appVersion }}</span
      >
    </div>
  </div>
</template>

<style lang="scss">
// 使用CSS变量以支持深色模式
#masterPasswordGroup {
  padding: 16px;
  background: var(--bg-primary);

  .keyfile-picker {
    background-color: var(--bg-secondary);
    box-sizing: border-box;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 200px;
    overflow-y: auto;
    opacity: 1;
    border-radius: 10px;
    border: 1px solid var(--border-light);
    padding: 12px;
    margin: 12px 0;
    box-shadow: var(--shadow-sm);

    &.keyfile-picker-enter,
    &.keyfile-picker-leave-to {
      max-height: 0px;
      opacity: 0;
    }

    span {
      display: block;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 4px;
      color: var(--text-primary);

      &:hover {
        background: var(--bg-tertiary);
        padding-left: 16px;
        box-shadow: var(--shadow-sm);
      }
    }
  }

  #select-keyfile {
    padding: 12px 16px;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    border: 1px solid var(--border-light);
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    color: var(--text-primary);

    i {
      font-size: 14px;
      margin-right: 8px;
      color: var(--primary-color);
    }

    &:hover {
      background: var(--bg-tertiary);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
  }

  #rememberPeriodLength {
    width: 100%;
    margin-top: 12px;
  }

  .masterPasswordInput {
    position: relative;
    margin: 12px 0;

    input {
      padding-right: 40px;
    }

    i {
      position: absolute;
      font-size: 16px;
      top: 50%;
      transform: translateY(-50%);
      right: 16px;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      padding: 8px;
      border-radius: 6px;

      &:hover {
        color: var(--primary-color);
        background: rgba(var(--primary-rgb), 0.1);
      }
    }
  }

  input[type='text'],
  input[type='password'] {
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    padding: 16px;
    border: 2px solid var(--input-border);
    border-radius: 10px;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--input-bg);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }

    &::placeholder {
      color: var(--input-placeholder);
    }
  }

  .remember-period-picker {
    margin: 16px 0;
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 10px;
    border: 1px solid var(--border-light);

    label {
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 13px;
    }

    input[type='range'] {
      margin-top: 12px;
    }
  }
}

.spinner {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: var(--bg-primary);
}

.footer {
  padding: 16px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
  border-radius: 0 0 10px 10px;

  span {
    padding: 8px 12px;
    border-radius: 10px;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 13px;
    color: var(--text-secondary);

    &:hover {
      background-color: var(--bg-tertiary);
      color: var(--primary-color);
      box-shadow: var(--shadow-sm);
    }

    i {
      margin-right: 4px;
    }
  }
}

.databaseChoose {
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.1) 100%);
  border-radius: 10px;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  margin-bottom: 12px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--primary-rgb), 0.15) 100%);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }

  b {
    color: var(--primary-color);
    font-weight: 600;
  }

  .muted-color {
    color: var(--text-muted);
    font-size: 12px;
    margin-left: 8px;
  }
}

.unlockLogo {
  font-weight: 700;
  font-size: 22px;
  text-align: center;
  padding: 24px 0px;
  color: var(--text-primary);

  img {
    width: 56px;
    height: 56px;
    vertical-align: middle;
    margin-right: 12px;
    filter: drop-shadow(var(--shadow-md));
  }
}

// 滑块样式
input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 9999px;
  outline: none;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--switch-thumb);
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid var(--primary-color);

    &:hover {
      transform: scale(1.15);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    &:active {
      transform: scale(0.95);
      box-shadow: var(--shadow-sm);
    }
  }

  &::-webkit-slider-runnable-track {
    height: 6px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-light) 100%);
    border-radius: 9999px;
  }

  &:focus::-webkit-slider-thumb {
    box-shadow: var(--shadow-lg), 0 0 0 4px rgba(var(--primary-rgb), 0.2);
  }
}

// 按钮样式
button.action-button {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  border: none;
  border-radius: 10px;
  margin: 0px;
  padding: 14px 20px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  &:focus {
    outline: none;
    box-shadow: var(--shadow-md), 0 0 0 3px rgba(var(--primary-rgb), 0.3);
  }
}
</style>
