<template>
  <v-tooltip
    left
    color="error"
    :disabled="state !== State.ERROR"
  >
    <template
      #activator="{ attrs, on }"
    >
      <v-progress-circular
        class="mr-1 audio-player-progress"
        rotate="-90"
        :size="size"
        :value="percentage"
        width="2"
        v-bind="attrs"
        v-on="on"
      >
        <v-btn
          :disabled="disabled"
          :loading="state === State.DOWNLOADING"
          :small="size < 40"
          icon
          @mousedown.stop
          @touchstart.native.stop
          @click="downloadPlayPause()"
        >
          <v-icon
            v-text="currentIcon"
            :small="size < 40"
          />
        </v-btn>
        <audio ref="audioPlayer" />
      </v-progress-circular>
    </template>
    <span>{{ lastErrorMessage }}</span>
  </v-tooltip>
</template>
<script>
import { mapActions } from 'vuex'

import { breakpoints } from '@/mixins'

const State = Object.freeze({
  EMPTY: 0,
  DOWNLOADING: 1,
  PAUSED: 2,
  PLAYING: 3,
  ERROR: 4,
})

export default {
  name: 'PlayBtn',
  mixins: [breakpoints],
  props: {
    disabled: Boolean,
    callId: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 40,
    },
    alwaysUpdParentProgress: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      State,
      state: State.EMPTY,
      lastErrorMessage: '',
      percentage: 0,
    }
  },

  computed: {
    currentIcon() {
      switch (this.state) {
        case State.EMPTY:
        case State.PAUSED:
          return '$call-history-play'
        case State.PLAYING:
          return '$call-history-pause'
        default:
          return '$call-history-error'
      }
    },
  },

  beforeDestroy() {
    const { audioPlayer } = this.$refs

    this.getEventHandlers().forEach(({ event, handler }) => {
      audioPlayer.removeEventListener(event, handler)
    })
  },

  methods: {
    ...mapActions('callHistory', [
      'getCallRecord',
    ]),
    getEventHandlers() {
      return [
        { event: 'timeupdate', handler: this._handleTimeupdate },
        { event: 'pause', handler: this._handlePause },
        { event: 'play', handler: this._handlePlay },
        { event: 'ended', handler: this._handleEnded },
      ]
    },
    async downloadPlayPause() {
      const { audioPlayer } = this.$refs

      if (!audioPlayer.src) {
        this.state = State.DOWNLOADING
        try {
          const data = await this.getCallRecord(this.callId)
          if (['audio/mpeg', 'audio/wav'].includes(data.type)) {
            const blob = new Blob([data], { type: data.type })
            audioPlayer.src = URL.createObjectURL(blob)

            this.getEventHandlers().forEach(({ event, handler }) => {
              audioPlayer.addEventListener(event, handler)
            })
          } else {
            this.state = State.ERROR
            this.lastErrorMessage = this.$i18n.t('errors.unsupported_audio_type')
          }
        } catch (err) {
          this.state = State.ERROR
          if (err.response?.status === 405) {
            this.lastErrorMessage = this.$i18n.t('errors.not_allowed_data')
          } else {
            this.lastErrorMessage = err ? this.$i18n.t(`errors.${err.code}`) : ''
          }
          return
        }
        this.state = State.PAUSED
      }

      if (audioPlayer.paused) {
        try {
          await audioPlayer.play()
        } catch (err) {
          this.state = State.ERROR
          console.warn('Failed to play audio', err)
        }
      } else {
        audioPlayer.pause()
      }
    },
    _handleTimeupdate() {
      const { audioPlayer } = this.$refs

      if (Number.isNaN(audioPlayer.duration)) {
        return
      }
      const percentage = audioPlayer.currentTime / audioPlayer.duration * 100
      this.updateProgress(percentage)
    },
    updateProgress(percentage) {
      if (this.alwaysUpdParentProgress) {
        this.updateParentProgress({ percentage, id: this.callId })
      } else if (this.$_breakpoints_mobile) {
        this.updateLocalProgress(percentage)
      } else {
        this.updateParentProgress({ percentage, id: this.callId })
      }
    },
    updateParentProgress(data) {
      this.$emit('update-progress', data)
    },
    updateLocalProgress(percentage) {
      this.percentage = percentage
    },
    _handlePause() {
      this.state = State.PAUSED
    },
    _handlePlay() {
      this.state = State.PLAYING
    },
    _handleEnded() {
      this.state = State.PAUSED
      if (this.$_breakpoints_mobile) {
        this.percentage = 100
        setTimeout(() => {
          if (this.percentage === 100) {
            this.percentage = 0
          }
        }, 100) // timeout must be greater then transition-duration
      }
    },
  },
}
</script>

<style scoped>
  .audio-player-progress >>> .v-progress-circular__overlay {
    transition-duration: 0.05s;
    transition-timing-function: linear;
  }
</style>
