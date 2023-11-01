<template>
  <v-list
    class="sidebar__list"
  >
    <v-list-item
      class="sidebar_list-item"
      v-for="(item, i) in navigationItems"
      :key="i"
      :to="item.to"
    >
      <v-list-item-action class="sidebar_list-item-icon">
        <v-icon color="white">
          {{ item.icon }}
        </v-icon>
      </v-list-item-action>
      <v-list-item-content class="sidebar_list-item-text">
        <v-list-item-title
          class="sidebar_list-item-title"
          v-text="item.title"
        />
      </v-list-item-content>
    </v-list-item>
    <LogoutBtn />
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints } from '@/mixins'
import LogoutBtn from '@/components/Main/SideNavigation/LogoutBtn.vue'

export default {
  mixins: [breakpoints],
  components: {
    LogoutBtn,
  },
  computed: {
    ...mapGetters('system', [
      'isSupportedCallHistory',
      'isSupportedContacts',
    ]),
    navigationItems() {
      const items = [
        {
          title: `${this.$t('menu.home')}`,
          to: { name: 'Home' },
          icon: '$home',
          show: true,
        },
        {
          title: `${this.$t('menu.call_history')}`,
          to: { name: 'CallHistory' },
          icon: '$call-history',
          show: this.isSupportedCallHistory,
        },
        {
          title: `${this.$t('menu.contacts')}`,
          to: { name: 'Contacts' },
          icon: '$user',
          show: this.isSupportedContacts,
        },
        {
          title: `${this.$t('menu.settings')}`,
          to: { name: 'Settings' },
          icon: '$settings',
          show: true,
        },
      ]
      return items.filter((item) => item.show)
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar__list {
  @apply flex-grow flex flex-col;

  > * {
    @apply flex-none;
  }
}

.sidebar_list-item {
  min-width: calc(80px - 2rem);

  @apply mx-4 p-3 min-h-0 opacity-60;
  @apply text-white #{!important};

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
