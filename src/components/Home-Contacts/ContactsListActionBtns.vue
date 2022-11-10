<template>
  <v-col>
    <v-col class="flex-grow-0">
      <FavoriteIcon
        v-if="!$route.params.number"
        class="mr-6"
        :contact-number="contact.number"
        :style="hoveredItem === contact.number ? 'display: inline-flex' : 'display: none'"
      />
    </v-col>
    <AudioCallBtn
      v-if="!$route.params.number"
      class="hidden"
      :contact="contact"
      :class="{ 'visible': hoveredItem === contact.number }"
    />
    <VideoCallBtn
      v-if="!$route.params.number"
      class="hidden"
      :class="{ 'visible': hoveredItem === contact.number }"
      :contact="contact"
    />
    <v-icon
      class="pl-4"
      :class="{ 'secondary--text' : contact.number === selectedItem }"
    >
      $three-dots
    </v-icon>
  </v-col>
</template>

<script>
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import FavoriteIcon from '@/components/Shared/FavoriteIcon.vue'

export default {
  components: {
    AudioCallBtn,
    VideoCallBtn,
    FavoriteIcon,
  },
  props: {
    contact: {
      type: Object,
      required: true,
    },
    hoveredItem: {
      type: String,
      default: null,
    },
    selectedItem: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped lang="scss">
.visible {
  @apply flex #{!important};
}
</style>
