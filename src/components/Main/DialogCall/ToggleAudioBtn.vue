<template>
  <ActionBtn
    v-if="audioEnabled"
    icon="$microphone"
    :text="$t('modal.mute')"
    @click.native="mute({ enabled: false, video: false })"
  />
  <ActionBtn
    v-else
    icon="$microphone-off"
    :text="$t('modal.unmute')"
    @click.native="mute({ enabled: true, video: false })"
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
    ...mapState('webrtc', ['audioEnabled']),
  },
  methods: {
    ...mapActions('webrtc', ['mute']),
  },
}
</script>
