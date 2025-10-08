<template>
  <v-dialog
    v-model="isCallActive"
    eager
    persistent
    width="860"
  >
    <v-container
      :class="[!$vuetify.breakpoint.xs? 'dialog-call' : 'dialog-call--mobile']"
    >
      <DialogCallInfo
        :initials="contactInfo.initials"
        :email="contactInfo.email"
        :name="contactInfo.name || contactInfo.number_ext || ''"
      />
      <div
        v-show="remoteStreamHasVideo"
        class="dialog-call__remote-video"
      >
        <video
          ref="remoteStream"
          autoplay
          playsinline
        />
      </div>
      <div
        class="dialog-call__local-video"
        :class="[isCallAccepted ? 'visible' : 'invisible']"
      >
        <video
          ref="localStream"
          autoplay
          playsinline
          muted
        />
      </div>

      <v-row
        v-if="keypad"
        :class="[$vuetify.breakpoint.xs?
          'dialog-call__keypad--mobile': 'dialog-call__keypad']"
      >
        <Keypad
          @keypad-click="keypadClick"
        />
      </v-row>
      <DialogCallActionBtns
        @toggle-keypad="keypad = $event"
        :call-description="contactInfo.number || contactInfo.number_ext || '-'"
      />
    </v-container>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { contacts } from '@/mixins'

import Keypad from '@/components/Shared/Keypad.vue'
import DialogCallActionBtns from '@/components/Main/DialogCall/ActionBtns.vue'
import DialogCallInfo from '@/components/Main/DialogCall/CallInfo.vue'
import { pickOutInitials } from '@/store/helpers'
import { PhoneTonePlayer } from 'play-dtmf'

const DTMF_DURATION = 0.2

const audioContext = new AudioContext()
const phoneTonePlayer = new PhoneTonePlayer(audioContext)

export default {
  name: 'DialogCall',
  components: {
    Keypad,
    DialogCallActionBtns,
    DialogCallInfo,
  },
  mixins: [contacts],
  data: () => ({
    contactInfo: {},
    keypad: false,
  }),
  computed: {
    ...mapState('webrtc', ['localStream', 'remoteStream', 'callInfo']),
    ...mapGetters('webrtc', ['remoteStreamHasVideo', 'isCallAccepted', 'isCallActive']),
  },
  methods: {
    keypadClick(key) {
      this.$store.dispatch('webrtc/sendDtmf', key)

      const tone = phoneTonePlayer.playDtmf(key)
      tone.stop(DTMF_DURATION)
    },
    updateContactInfo(contact) {
      this.contactInfo.number = contact.number || null
      this.contactInfo.number_ext = contact.number_ext || null
      this.contactInfo.name = contact.name || null
      if (contact.initials) {
        this.contactInfo.initials = contact.initials
      } else {
        this.contactInfo.initials = this.contactInfo.name && pickOutInitials(this.contactInfo.name)
      }
      this.contactInfo.email = contact.email || null
    },
  },
  watch: {
    localStream(stream) {
      this.$refs.localStream.srcObject = stream
    },
    remoteStream(stream) {
      const media = this.$refs.remoteStream
      if (!media || !stream) return

      const currentSrc = media.srcObject
      if (currentSrc && currentSrc.getTracks().length > 0) {
        const mergedStream = new MediaStream()
        const newAudio = stream.getAudioTracks()
        const newVideo = stream.getVideoTracks()

        const audio = newAudio.length > 0 ? newAudio : currentSrc.getAudioTracks()
        const video = newVideo.length > 0 ? newVideo : currentSrc.getVideoTracks()

        audio.forEach((t) => mergedStream.addTrack(t))
        video.forEach((t) => mergedStream.addTrack(t))

        media.srcObject = mergedStream
      } else {
        media.srcObject = stream
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    },
    isCallAccepted(value) {
      if (!value) {
        this.keypad = false
      }
    },
    async callInfo(callInfo) {
      if (callInfo) {
        const contact = this.$_contacts_getOneContact(callInfo.number)
        if (contact) {
          this.updateContactInfo(contact)
        } else {
          this.updateContactInfo(callInfo)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-call {
  background: #eceff1;
  min-height: 530px;

  @apply flex flex-col justify-center items-center relative p-0 h-full overflow-hidden;
}

.dialog-call__keypad {
  bottom: 155px;

  @apply absolute bg-white rounded-xl p-4 z-20;
}

.dialog-call__keypad--mobile {
  bottom: 175px;

  @apply absolute bg-white rounded-xl p-4 z-20;
}

.dialog-call__local-video {
  width: 200px;
  height: 144px;
  top: 20px;
  right: 20px;
  transform: scaleX(-1);

  @apply absolute rounded-xl z-20 overflow-hidden;

  video {
    @apply w-full h-full;
  }
}

.dialog-call__remote-video {
  max-height: 530px;

  @apply relative z-10 h-auto flex w-full;

  video {
    max-height: 530px;

    @apply w-full h-auto;
  }
}

.dialog-call--mobile {
  @apply dialog-call;

  .dialog-call__local-video {
    width: 170px;
    height: 123px;
  }

  .dialog-call__remote-video {
    @apply h-full w-full;

    video {
      transform: translateX(-23%);

      @apply h-full w-auto;
    }
  }
}
</style>
