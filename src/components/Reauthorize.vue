<script>
export default {
  props: {
    settings: Object,
    providers: Array,
  },
  data() {
    return {
      provider: {},
      done: false,
      fail: false,
    };
  },
  mounted() {
    let provider_key = this.$router.getRoute().provider;
    this.providers.forEach((p) => {
      if (p.key === provider_key) this.provider = p;
    });
  },
  methods: {
    launchAuth() {
      this.provider
        .login()
        .then((nil) => {
          this.done = true;
        })
        .catch((err) => {
          this.fail = true;
        });
    },
  },
};
</script>

<template>
  <div>
    <div class="box-bar roomy">
      <h4>{{ $t('reauthorize.title', { provider: provider.title }) }}</h4>
      <p>
        {{ $t('reauthorize.description', { provider: provider.title }) }}
      </p>
    </div>
    <div class="box-bar roomy lighter">
      <a class="waves-effect waves-light btn" @click="launchAuth">{{
        $t('reauthorize.authorizeButton', { provider: provider.title })
      }}</a>
    </div>
    <div v-if="done" class="box-bar roomy plain">
      <h4><i class="fa fa-check" aria-hidden="true" /> {{ $t('reauthorize.success.title') }}</h4>
      <p>
        {{ $t('reauthorize.success.message') }}
      </p>
    </div>
    <div v-if="fail && !done" class="box-bar roomy plain">
      <h4><i class="fa fa-times" aria-hidden="true" /> {{ $t('reauthorize.error.title') }}</h4>
      <p>
        {{ $t('reauthorize.error.message') }}
      </p>
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
