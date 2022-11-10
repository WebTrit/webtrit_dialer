<template>
  <v-row
    justify="end"
    class="flex-grow-0"
  >
    <AudioCallBtn
      :size="size"
      :tel="tel"
      @phone-error="$emit('phone-error', $event)"
    />
    <VideoCallBtn
      :size="size"
      :tel="tel"
      @phone-error="$emit('phone-error', $event)"
    />
  </v-row>
</template>

<script>
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'

export default {
  components: {
    AudioCallBtn,
    VideoCallBtn,
  },
  props: {
    tel: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: 40,
    },
  },
}
</script>
