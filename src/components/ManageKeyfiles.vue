<script>
export default {
  props: {
    settings: Object,
    keyFileParser: Object,
  },
  data() {
    return {
      keyFiles: [],
      errorMessage: '',
    };
  },
  mounted() {
    this.loadKeyFiles();
  },
  methods: {
    loadKeyFiles() {
      this.settings.getKeyFiles().then((keyFiles) => {
        this.keyFiles = keyFiles;
      });
    },
    removeKeyFile(index) {
      if (index >= 0 && index < this.keyFiles.length) {
        let kf = this.keyFiles[index];
        this.settings.deleteKeyFile(kf.name).then((nil) => {
          this.loadKeyFiles();
        });
      }
    },
    selectFileInput() {
      document.getElementById('file').click();
    },
    handleAdd(event) {
      let files = event.target.files;
      this.errorMessage = '';
      for (var i = 0; i < files.length; i++) {
        let reader = new FileReader();
        let fp = files[i];
        reader.onload = (e) => {
          this.keyFileParser
            .getKeyFromFile(e.target.result)
            .then((key) => {
              this.settings.addKeyFile(fp.name, key).then(this.loadKeyFiles);
            })
            .catch((err) => {
              this.errorMessage = err.message;
            });
        };
        reader.readAsArrayBuffer(fp);
      }
    },
  },
};
</script>

<template>
  <div id="key-file-manager">
    <div class="box-bar about roomy">
      <p>
        {{ $t('manageKeyfiles.description') }}
        <a href="http://keepass.info/help/base/keys.html#keyfiles" target="_blank">
          KeePass site
        </a>
      </p>
      <p>
        {{ $t('manageKeyfiles.warning') }}
      </p>
      <input id="file" multiple type="file" style="display: none" name="file" @change="handleAdd" />
      <a class="waves-effect waves-light btn" @click="selectFileInput">{{ $t('manageKeyfiles.addKeyFile') }}</a>
      <p v-if="errorMessage" class="box-bar error white-text">
        {{ errorMessage }}
      </p>
    </div>
    <div v-for="(file, file_index) in keyFiles" class="box-bar roomy small lighter">
      <span
        >{{ file.name }}
        <i
          class="fa fa-times-circle selectable"
          aria-hidden="true"
          @click="removeKeyFile(file_index)"
        />
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
#key-file-manager {
  span {
    font-weight: 500;
  }
}
</style>
