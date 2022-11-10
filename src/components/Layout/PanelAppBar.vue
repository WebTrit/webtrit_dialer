<template>
  <v-toolbar
    class="panel__bar"
    color="transparent"
    dense
    flat
  >
    <v-toolbar-title class="panel__title primary--text">
      {{ title }}
    </v-toolbar-title>
    <v-spacer />
    <v-tabs
      v-if="hasTabs"
      class="panel__tabs"
      active-class="white secondary--text"
      v-model="tab"
      align-with-title
      hide-slider
      background-color="transparent"
    >
      <slot name="tabs" />
    </v-tabs>
    <template
      #extension
      v-if="appbarExtended"
    >
      <slot name="search" />
      <slot name="datepicker" />
    </template>
    <slot name="close" />
  </v-toolbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    appbarExtended: {
      type: Boolean,
      default: false,
    },
    hasTabs: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    tab: null,
  }),
}
</script>

<style lang="scss" scoped>
.panel__bar {
  contain: none;

  @apply mb-2 w-full z-10 flex flex-col flex-wrap;

  ::v-deep .v-toolbar__content,
  ::v-deep .v-toolbar__extension {
    @apply p-0;
  }
}

.panel__title {
  @apply text-lg font-bold;
}

.panel__tabs {
  @apply flex-none w-auto;

  ::v-deep .panel__tab {
    @apply normal-case;

    &::before {
      @apply bg-transparent;
    }
  }
}
</style>
