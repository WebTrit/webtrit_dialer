<template>
  <v-tooltip
    v-tooltip
    :top="!bottom"
    :bottom="bottom"
    :disabled="!textTruncated"
  >
    <template #activator="{ on, attrs }">
      <span
        v-bind="attrs"
        v-on="on"
        class="tooltip-activator"
      >{{ text }}</span>
    </template>
    <span class="simple-text">{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    activatorWidthLimit: {
      type: Number,
      required: true,
    },
    disableTooltips: {
      type: Boolean,
      required: true,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      textTruncated: this.disableTooltips,
    }
  },
}
</script>

<style lang="scss" scoped>
.simple-text {
  @apply truncate;
}
</style>
