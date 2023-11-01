<template>
  <v-col
    class="dialog-call__name"
  >
    <span v-if="videoCall"> {{ $t('modal.video_call') }} </span>
    <span v-else> {{ $t('modal.audio_call') }} </span>
    <span class="font-bold"> {{ callDescription }} </span>
    <span
      v-if="holdActive"
      class="text-red-500"
    > {{ $t('modal.on_hold') }} </span>
    <Timer
      v-if="$vuetify.breakpoint.xs"
    />
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import Timer from '@/components/Shared/Timer.vue'

export default {
  components: {
    Timer,
  },
  props: {
    holdActive: {
      type: Boolean,
      required: true,
    },
    callDescription: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters('webrtc', ['videoCall']),
  },
}
</script>

<style lang="scss" scoped>
.dialog-call__name {
  @apply pb-0.5 -mb-2 text-light-grey text-center;
}
</style>
