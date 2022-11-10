<template>
  <v-icon
    color="white"
    v-if="!$_breakpoints_mobile && navigationDrawerMinimizing"
    class="sidebar__back-arrow"
    @click.native="$emit('toggle-mini-variant')"
  >
    $back-arrow
  </v-icon>
</template>

<script>
import { breakpoints } from '@/mixins'

export default {
  mixins: [breakpoints],
  computed: {
    navigationDrawerMinimizing() {
      return this.$envConfig.webtritNavigationDrawerMinimizing && !this.$store.getters['settings/isMstMode']
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar__back-arrow {
  @apply cursor-pointer mr-4;
}

.mini {
  .sidebar__back-arrow {
    transform: rotate(180deg);
    transition: all 0.3s ease;

    @apply mr-2;
  }
}
</style>
