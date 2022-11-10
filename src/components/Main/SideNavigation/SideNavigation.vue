<template>
  <v-navigation-drawer
    v-if="!isHidden && open"
    v-click-outside="{
      handler: onClickOutside,
      include: $_breakpoints_mobile ? include : false,
    }"
    class="sidebar surface"
    :class="{'mini' : this.miniVariant}"
    :width="sidebarWidth"
    :app="!$_breakpoints_mobile"
    :temporary="$_breakpoints_mobile"
    :absolute="$_breakpoints_mobile"
    permanent
  >
    <appTitle
      v-if="!$_breakpoints_mobile"
      @toggle-mini-variant="toggleMiniVariant()"
    />
    <v-icon
      v-if="$_breakpoints_mobile"
      class="sidebar__close-icon"
      color="white"
      @click.native="$emit('close-sidebar')"
    >
      $close
    </v-icon>
    <userInfo v-if="!this.miniVariant && !$_breakpoints_mobile" />
    <userInfoMini v-else-if="this.miniVariant && !$_breakpoints_mobile" />
    <sideNavigationMenu />
    <template #append>
      <v-divider />
      <p
        class="sidebar__signature"
      >
        by
        <span
          v-if="!companyUrl"
          class="font-bold"
        > {{ companyName }} </span>
        <a
          v-else
          class="sidebar__signature-link"
          :href="companyUrl"
          target="_blank"
        > {{ companyName }} </a>
      </p>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { breakpoints } from '@/mixins'
import userInfo from '@/components/Main/UserInfo/UserInfo.vue'
import userInfoMini from '@/components/Main/UserInfo/UserInfoMini.vue'
import appTitle from '@/components/Main/AppTitle.vue'
import sideNavigationMenu from '@/components/Main/SideNavigation/SideNavigationMenu.vue'

export default {
  components: {
    userInfo,
    userInfoMini,
    appTitle,
    sideNavigationMenu,
  },
  mixins: [breakpoints],
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      miniVariant: false,
    }
  },
  computed: {
    isHidden() {
      return this.$route.meta?.hiddenFeatures?.navigationDrawer
    },
    sidebarWidth() {
      return this.miniVariant ? '80' : '230'
    },
    companyName() {
      return this.$envConfig.webtritCompanyName
    },
    companyUrl() {
      return this.$envConfig.webtritCompanyUrl
    },
  },
  methods: {
    toggleMiniVariant() {
      this.miniVariant = !this.miniVariant
    },
    onClickOutside() {
      this.$_breakpoints_mobile && this.$emit('close-sidebar')
    },
    include() {
      return [document.querySelector('.v-app-bar')]
    },
  },
  watch: {
    $_breakpoints_mobile() {
      this.miniVariant = false
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  @apply z-30 fixed h-screen;

  ::v-deep .v-navigation-drawer__content {
    @apply flex flex-col;
  }
}

.sidebar__close-icon {
  top: 20px;
  left: 20px;

  @apply absolute;
}

.sidebar__signature {
  @apply text-black text-sm m-0 p-3 text-center cursor-default;
}

.sidebar__signature-link {
  @apply font-bold no-underline text-black #{!important};
}
</style>
