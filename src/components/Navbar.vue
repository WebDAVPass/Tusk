<!--
  Navbar:
  requires a lib/VirtualRouter, and the routes object used to initialize the virtualrouter.
  Active tab changes automatically based on visible route.
-->
<script>
export default {
  name: 'AppNavbar',
  props: {
    routes: Array,
    initialTab: String,
  },
  methods: {
    /**
     * 获取路由的本地化名称
     * @param {Object} route - 路由对象
     * @returns {string} 本地化的路由名称
     */
    getRouteName(route) {
      const routeNameMap = {
        gettingStarted: this.$t('navbar.gettingStarted'),
        manageDatabases: this.$t('navbar.manageDatabases'),
        manageKeyfiles: this.$t('navbar.manageKeyfiles'),
        advanced: this.$t('navbar.advanced'),
        reauthorize: this.$t('navbar.reauthorize'),
      };
      const key = route.name ? route.name.replace(/\s+/g, '').toLowerCase() : '';
      return routeNameMap[key] || route.name;
    },
  },
};
</script>

<template>
  <nav class="nav-extended">
    <div class="nav-content">
      <ul class="tabs tabs-transparent">
        <!-- set class like /advanced-active-listener so the router can set -->
        <template v-for="route in routes" :key="route.name">
          <li v-if="!route.hidden_from_navbar" class="tab" :class="{ active: route.var.visible }">
            <a @click="$router.route(route.route)">{{ getRouteName(route) }}</a>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss">
@import '../styles/settings.scss';

nav {
  position: fixed;
  top: 0px;
  z-index: 100;

  .nav-content {
    width: $options-width;
    margin: 0px auto;

    li.active {
      border-bottom: 3px solid $background-color;
    }
  }
}
</style>
