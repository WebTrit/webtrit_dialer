<template>
  <v-col>
    <v-card
      class="call-record"
      elevation="0"
    >
      <v-card-text>
        <v-row>
          <v-col class="call-record__subtitle">
            {{ ($options.filters.formatPrettySeconds(call.duration)) || '00 sec' }}
          </v-col>
          <v-col class="call-record__subtitle">
            {{ call.connect_time | formatDateTime }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="flex items-center">
            <v-progress-linear
              v-if="call.recording_id"
              :value="playProgress"
            />
          </v-col>
          <v-col class="max-w-max">
            <PlayBtn
              v-if="call.recording_id"
              :call-id="call.recording_id"
              @update-progress="updatePlayProgress($event)"
              :always-upd-parent-progress="true"
            />
          </v-col>
          <v-col class="max-w-max pl-0 flex items-center">
            <DownloadBtn
              v-if="call.recording_id"
              :call-id="call.recording_id"
              :filename="$_calls_getFilename(call)"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { calls } from '@/mixins'
import DownloadBtn from '@/components/Shared/DownloadBtn.vue'
import PlayBtn from '@/components/Shared/PlayBtn.vue'

export default {
  components: {
    DownloadBtn,
    PlayBtn,
  },
  mixins: [calls],
  props: {
    call: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      playProgress: 0,
    }
  },
  methods: {
    updatePlayProgress({ percentage }) {
      this.playProgress = percentage
    },
  },
  watch: {
    $route() {
      this.playProgress = 0
    },
  },
}
</script>

<style scoped lang="scss">
.call-record__subtitle {
  @apply text-xs text-light-grey;

  + .call-record__subtitle {
    @apply flex justify-end;
  }
}

.call-record__play {
  i {
    @apply text-sm #{!important};
  }
}
</style>
