<template>
  <v-list-item
    class="sidebar_list-item"
    @click.native="logoutUser()"
  >
    <v-list-item-action class="sidebar_list-item-icon">
      <v-icon color="white">
        $logout
      </v-icon>
    </v-list-item-action>
    <v-list-item-content class="sidebar_list-item-text">
      <v-list-item-title
        class="sidebar_list-item-title"
      >
        {{ $t('menu.logout') }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('account', [
      'logout',
    ]),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    async logoutUser() {
      await this.logout()
      await this.$router.push({ name: 'Login' })
    },
  },
}
</script>

<style scoped lang="scss">
.sidebar_list-item {
  min-width: calc(80px - 2rem);

  @apply mx-4 p-3 min-h-0 opacity-60 cursor-pointer;
  @apply text-white mt-auto mb-0 #{!important};

  &::before {
    @apply rounded-md;
  }

  + .sidebar_list-item {
    @apply mt-2;
  }
}

.sidebar_list-item-icon {
  @apply my-0;
  @apply mr-3 #{!important};
}

.sidebar_list-item-text {
  @apply p-0 text-white;
}

.sidebar_list-item-title {
  @apply text-sm;
}

.v-list-item--active {
  @apply opacity-100;
}

.mini {
  .sidebar_list-item-text {
    @apply hidden;
  }

  .sidebar_list-item-icon {
    min-width: unset;

    @apply mx-auto #{!important};
  }
}
</style>
