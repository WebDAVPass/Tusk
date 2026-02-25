<script>
export default {
  props: {},
};
</script>

<template>
  <div>
    <div class="box-bar roomy">
      <div class="unlockLogo stack-item optionsheader">
        <img src="@/assets/icons/exported/128x128.svg" width="256px" height="256px" />
        <span>{{ $t('optionsStartup.title') }}</span>
      </div>

      <p>{{ $t('optionsStartup.description') }}</p>

      <a class="waves-effect waves-light btn" @click="$router.route('/manage/databases')">{{
        $t('optionsStartup.step1')
      }}</a>

      <p>{{ $t('optionsStartup.step2Description') }}</p>

      <a class="waves-effect waves-light btn" @click="$router.route('/manage/keyfiles')">{{
        $t('optionsStartup.step2')
      }}</a>

      <p>{{ $t('optionsStartup.step3Description') }}</p>

      <p>{{ $t('optionsStartup.newUserDescription') }}</p>
    </div>

    <div class="box-bar roomy lighter">
      <h4>{{ $t('optionsStartup.supportTitle') }}</h4>
      <p>
        {{ $t('optionsStartup.supportDescription') }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
.optionsheader {
  text-align: left;
  font-size: 28px;
}
</style>
