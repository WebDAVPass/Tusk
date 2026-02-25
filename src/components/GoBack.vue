<script>
export default {
  props: {
    message: String,
  },
};
</script>

<template>
  <div class="box-bar selectable" @click="$router.goBack">
    <span>
      <i class="fa fa-long-arrow-left" aria-hidden="true" />
      {{ message || $t('goBack.defaultMessage') }}
    </span>
  </div>
</template>

<style lang="scss">
@import '../styles/settings.scss';
</style>
