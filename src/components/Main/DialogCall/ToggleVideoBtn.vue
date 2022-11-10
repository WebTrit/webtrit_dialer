<template>
  <ActionBtn
    v-if="videoEnabled"
    icon="$video"
    :text="$t('modal.stop video')"
    @click.native="mute({ enabled: false, video: true })"
  />
  <ActionBtn
    v-else
    icon="$video-off"
    :text="$t('modal.start video')"
    @click.native="mute({ enabled: true, video: true })"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ActionBtn from '@/components/Main/DialogCall/ActionBtn.vue'

export default {
  components: {
    ActionBtn,
  },
  computed: {
    ...mapState('webrtc', ['videoEnabled']),
  },
  methods: {
    ...mapActions('webrtc', ['mute']),
  },
}
</script>
