<template>
  <v-row
    class="dialog-call__btns"
  >
    <ActionBtnsTitle
      :hold-active="holdActive"
      v-bind="$props"
    />
    <v-row
      v-if="isCallAccepted"
      class="dialog-call__btns-row"
      align="start"
    >
      <ActionBtn
        key="keypad"
        icon="$call-keypad"
        :text="$t('modal.keypad')"
        @click.native="toggleKeypad()"
      />
      <TransferBtn
        key="transfer"
        @open-transfer-popup="showTransfer = true"
      />
      <TransferPopup
        :show-transfer="showTransfer"
        @hide-transfer-popup="showTransfer = false"
      />
      <HoldBtn
        key="hold"
        :hold-active="holdActive"
        @update-hold-active="holdActive = $event"
      />
      <ToggleAudioBtn key="toggle-audio" />
      <ToggleVideoBtn
        key="toggle-video"
        v-if="localStreamHasVideo"
      />
      <TimerBtn
        v-if="!$vuetify.breakpoint.xs"
        :recording="recording"
      />
      <ActionBtn
        key="drop"
        icon-color="white"
        icon="$drop"
        color="red"
        :text="$t('modal.end_call')"
        @click.native="drop()"
      />
    </v-row>
    <v-row
      v-else-if="isCallIncoming"
      class="dialog-call__btns-row"
      justify="center"
      align="start"
    >
      <ActionBtn
        v-if="!videoCall"
        key="accept"
        icon="$audio"
        color="green"
        icon-color="white"
        :text="$t('modal.accept')"
        @click.native="answer({ video: false })"
      />
      <ActionBtn
        v-else
        key="accept"
        icon="$video"
        color="green"
        icon-color="white"
        :text="$t('modal.accept')"
        @click.native="answer({ video: true })"
      />
      <ActionBtn
        key="drop"
        icon-color="white"
        icon="$drop"
        color="red"
        :text="$t('modal.decline')"
        @click.native="drop()"
      />
    </v-row>
    <v-row
      v-else
      class="dialog-call__btns-row"
      justify="center"
      align="start"
    >
      <ActionBtn
        key="drop"
        icon-color="white"
        icon="$drop"
        color="red"
        :text="$t('modal.end_call')"
        @click.native="drop()"
      />
    </v-row>
  </v-row>
</template>

<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex'
import ToggleVideoBtn from '@/components/Main/DialogCall/ToggleVideoBtn.vue'
import ToggleAudioBtn from '@/components/Main/DialogCall/ToggleAudioBtn.vue'
import ActionBtn from '@/components/Main/DialogCall/ActionBtn.vue'
import TimerBtn from '@/components/Main/DialogCall/TimerBtn.vue'
import HoldBtn from '@/components/Main/DialogCall/HoldBtn.vue'
import ActionBtnsTitle from '@/components/Main/DialogCall/ActionBtnsTitle.vue'
import TransferBtn from '@/components/Main/DialogCall/TransferBtn.vue'
import TransferPopup from '@/components/Main/DialogCall/TransferPopup.vue'

export default {
  components: {
    ToggleVideoBtn,
    ToggleAudioBtn,
    ActionBtn,
    TimerBtn,
    HoldBtn,
    ActionBtnsTitle,
    TransferBtn,
    TransferPopup,
  },
  props: {
    callDescription: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      keypad: false,
      recording: false,
      holdActive: false,
      showTransfer: false,
    }
  },
  computed: {
    ...mapState('webrtc', ['callState']),
    ...mapGetters('webrtc', [
      'localStreamHasVideo',
      'videoCall',
      'isCallIncoming',
      'isCallAccepted',
    ]),
  },
  methods: {
    ...mapActions('callDuration', ['startCallDuration', 'stopCallDuration']),
    ...mapActions('webrtc', ['answer', 'drop']),
    toggleKeypad() {
      this.keypad = !this.keypad
      this.$emit('toggle-keypad', this.keypad)
    },
  },
  watch: {
    isCallAccepted(active) {
      if (active) {
        this.startCallDuration()
      } else {
        Object.assign(this.$data, this.$options.data())
        this.stopCallDuration()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-call__btns {
  bottom: 30px;

  @apply absolute bg-white rounded-xl px-5 z-20 flex flex-col;

  > .col {
    @apply px-2;
  }

  ::v-deep button {
    @apply rounded-lg shadow-none;
  }

  ::v-deep i {
    @apply text-xl #{ !important };
  }
}

.dialog-call__btns-row {
  @apply flex-nowrap my-0 mx-auto;

  .col {
    width: fit-content;

    @apply px-2 flex-grow-0;
  }
}
</style>
