<template>
  <v-col>
    <v-row class="m-0 p-0">
      <v-btn
        class="dialog-call__btn"
        fab
        small
        :color="color"
        :dark="dark"
      >
        <v-icon
          :color="iconColor"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
    </v-row>
    <v-row class="p-0 m-0">
      <p class="dialog-call__btn-text">
        {{ text }}
      </p>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#E3F2FD',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
      default: '#1976d2',
    },
    text: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  .dialog-call__btn {
    @apply m-auto;

    &:focus::before {
      @apply opacity-0;
    }
  }

  .dialog-call__btn-text {
    @apply text-xs text-gray-400 whitespace-nowrap pt-0.5 tracking-tight;
    @apply my-0 mx-auto #{!important};
  }
</style>
