<template>
  <v-tooltip
    left
    color="error"
    :disabled="state !== State.ERROR"
  >
    1
    <template #activator="{ attrs, on }">
      <v-btn
        class="download-btn"
        :disabled="disabled"
        :loading="state === State.DOWNLOADING"
        icon
        @mousedown.stop
        @touchstart.native.stop
        @click="download()"
        v-bind="attrs"
        v-on="on"
        :small="small"
      >
        <v-icon
          v-text="currentIcon"
          :small="small"
        />
      </v-btn>
    </template>
    <span>{{ lastErrorMessage }}</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex'

const State = Object.freeze({
  EMPTY: 0,
  DOWNLOADING: 1,
  ERROR: 2,
})

const MimeTypeToExtension = Object.freeze({
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/vnd.dts': 'wav',
  'application/zip': 'zip',
})

export default {
  name: 'DownloadBtn',

  props: {
    disabled: Boolean,
    callId: {
      type: Number,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      State,
      state: State.EMPTY,
      lastErrorMessage: '',
    }
  },

  computed: {
    currentIcon() {
      switch (this.state) {
        case State.EMPTY:
        case State.PLAYING:
          return '$call-history-download'
        default:
          return '$call-history-error'
      }
    },
  },

  methods: {
    ...mapActions('callHistory', [
      'getCallRecord',
    ]),
    async download() {
      function download_link(filename, blob) {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
      }
      this.state = State.DOWNLOADING
      try {
        const data = await this.getCallRecord(this.callId)
        const extension = MimeTypeToExtension[data.type]
        if (extension) {
          download_link(`${this.filename}.${extension}`, new Blob([data], { type: data.type }))
        } else {
          console.warn('Unsupported file type', data)
        }
      } catch (err) {
        this.state = State.ERROR
        this.lastErrorMessage = err ? this.$i18n.t(`errors.${err.code}`) : ''
        return
      }
      this.state = State.EMPTY
    },
  },
}
</script>
