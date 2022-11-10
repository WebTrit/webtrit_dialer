<template>
  <v-list
    :style="$_breakpoints_mobile ? 'margin-top: 35%' : ''"
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
import { breakpoints } from '@/mixins'
import LogoutBtn from '@/components/Main/SideNavigation/LogoutBtn.vue'

export default {
  mixins: [breakpoints],
  components: {
    LogoutBtn,
  },
  computed: {
    navigationItems() {
      return [
        {
          title: `${this.$t('menu.Home')}`,
          to: { name: 'Home' },
          icon: '$home',
        },
        {
          title: `${this.$t('menu.Call History')}`,
          to: { name: 'CallHistory' },
          icon: '$call-history',
        },
        {
          title: `${this.$t('menu.Contacts')}`,
          to: { name: 'Contacts' },
          icon: '$user',
        },
        {
          title: `${this.$t('menu.Settings')}`,
          to: { name: 'Settings' },
          icon: '$settings',
        },
      ]
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
