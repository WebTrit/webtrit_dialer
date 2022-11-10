<template>
  <v-container
    class="tabs"
    fluid
  >
    <v-tabs
      v-model="tab"
      align-with-title
      hide-slider
      background-color="#eceff1"
      active-class="white secondary--text"
      :height="38"
    >
      <slot name="tabs" />
    </v-tabs>

    <v-tabs-items
      v-model="tab"
      class="tabs-items"
    >
      <slot name="tab-items" />
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
    }
  },
  created() {
    if (this.$route.params.number && this.callsSubRoute()) {
      this.tab = 1
    }
  },
  methods: {
    callsSubRoute() {
      return this.$route.matched.some((route) => route.name === 'CallDetails')
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  @apply px-0 pb-0 pt-3 flex flex-col h-full;

  ::v-deep .v-tab {
    @apply rounded-t-lg;

    &::before {
      @apply bg-transparent;
    }
  }
}

.v-tabs {
  @apply flex-none;
}

.tabs-items {
  @apply flex-auto;
}
</style>
