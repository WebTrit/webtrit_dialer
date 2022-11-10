<template>
  <ActionBtn
    v-if="!holdActive"
    icon="$hold"
    :text="$t('modal.hold')"
    @click.native="holdCall()"
  />
  <ActionBtn
    v-else
    icon="$audio"
    :text="$t('modal.resume call')"
    @click.native="holdCall()"
  />
</template>

<script>
import { mapActions } from 'vuex'
import ActionBtn from '@/components/Main/DialogCall/ActionBtn.vue'

export default {
  components: {
    ActionBtn,
  },
  props: {
    holdActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapActions('webrtc', ['hold']),
    holdCall() {
      this.hold({ active: !this.holdActive })
      this.$emit('update-hold-active', !this.holdActive)
    },
  },
}
</script>
