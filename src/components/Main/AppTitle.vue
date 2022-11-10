<template>
  <div class="app-title_wrapper">
    <router-link
      class="app-title"
      :to="{ name: 'Root' }"
    >
      <img
        class="mr-2"
        height="25"
        width="25"
        :alt="`${appName} ${appSubname} logo`"
        :src="companyLogoImgSrc"
      >
      <div class="app-title__text">
        <span class="font-weight-bold">{{ appName }}</span> {{ appSubname }}
      </div>
    </router-link>
    <BackArrow @toggle-mini-variant="$emit('toggle-mini-variant')" />
  </div>
</template>

<script>
import BackArrow from '@/components/Main/SideNavigation/SideNavigationBackArrow.vue'

export default {
  components: {
    BackArrow,
  },
  computed: {
    appName() {
      return this.$envConfig.webtritAppName
    },
    appSubname() {
      return this.$envConfig.webtritAppSubname
    },
    companyLogoImgSrc() {
      return this.$envConfig.webtritCompanyLogoImgSrc || require('@/assets/logo.svg')
    },
  },
}
</script>

<style lang="scss" scoped>
.app-title_wrapper {
  @apply flex flex-nowrap;
}

.app-title {
  @apply flex justify-center items-center my-5 w-max mx-auto;
  @apply text-white no-underline #{!important};
}

.mini {
  .app-title {
    @apply mr-0;
  }

  .app-title__text {
    @apply hidden;
  }
}
</style>
