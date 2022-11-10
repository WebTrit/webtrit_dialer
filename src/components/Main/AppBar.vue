<template>
  <div v-if="!isHidden">
    <v-app-bar
      class="main__appbar"
      color="surface"
      app
      clipped-left
      clipped-right
      dark
    >
      <v-app-bar-nav-icon @click.native="$emit('toggle-side-navigation')" />
      <v-toolbar-title>
        <AppTitle />
      </v-toolbar-title>
      <v-spacer />
      <Avatar
        v-if="info"
        :initials="info.initials"
        :email="info.email"
        :size="40"
        color="surface lighten-1"
        @click.native="$emit('open-user-info')"
      />
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppTitle from '@/components/Main/AppTitle.vue'
import Avatar from '@/components/Shared/Avatar.vue'

export default {
  components: {
    AppTitle,
    Avatar,
  },
  computed: {
    ...mapGetters('account', ['info']),
    isHidden() {
      return this.$route.meta?.hiddenFeatures?.appBar
    },
  },
}
</script>

<style scoped lang="scss">
.main__appbar {
  @apply z-20 #{!important};
}
</style>
