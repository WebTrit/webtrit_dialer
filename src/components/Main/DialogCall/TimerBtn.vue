<template>
  <v-col>
    <v-row class="m-0 p-0">
      <v-btn
        class="dialog-call__recording"
        fab
        small
        :ripple="false"
        color="white"
      >
        <v-icon
          color="red"
          v-show="recording"
        >
          $circle
        </v-icon>
        <Timer />
      </v-btn>
    </v-row>
    <v-row class="p-0 m-0">
      <p class="dialog-call__btn-text">
        {{ $t("modal.time") }}
      </p>
    </v-row>
  </v-col>
</template>

<script>
import Timer from '@/components/Shared/Timer.vue'

export default {
  components: {
    Timer,
  },
  props: {
    recording: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-call__recording {
  width: 98px;
  border: 1px solid #e0effa !important;

  @apply px-2 cursor-default;

  &::before {
    @apply bg-white #{!important};
  }

  ::v-deep .v-btn__content {
    @apply flex flex-row justify-center items-center;
  }
}

.dialog-call__btn-text {
  @apply text-xs text-gray-400 whitespace-nowrap pt-0.5;
  @apply my-0 mx-auto #{!important};
}
</style>
