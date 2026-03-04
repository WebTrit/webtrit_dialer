<template>
  <v-container class="-mb-6">
    <v-row
      class="history-list__items"
      v-if="items && items.length"
    >
      <PanelRowItem
        ref="panelRowItem"
        class="history-list"
        :items="items"
        :link-name="linkName"
      >
        <template #component="scopedSlots">
          <v-col
            class="container__col-first pl-1"
            @click="openCallInfo(scopedSlots.contact)"
          >
            <v-icon
              :title="$options.filters.getDirectionTitle(scopedSlots.contact)"
              :color="$options.filters.getIconColor(scopedSlots.contact)"
            >
              {{ scopedSlots.contact | getDirectionIcon }}
            </v-icon>
          </v-col>

          <v-col
            class="container__col"
            @click="openCallInfo(scopedSlots.contact)"
          >
            <v-row class="container__inner-row">
              <v-col class="container__item-name">
                {{ scopedSlots.contact.contactInfo.name }}
              </v-col>
            </v-row>
            <v-row class="container__inner-row">
              <v-col>
                <span
                  class="history-list__connect-time"
                  :class="[!$vuetify.breakpoint.xs? 'ml-5': 'ml-0']"
                >
                  {{ scopedSlots.contact.connect_time | formatDateTime }}
                </span>
              </v-col>
            </v-row>
            <v-row class="container__inner-row">
              <v-col
                v-if="scopedSlots.contact.duration > 0 && scopedSlots.contact.status === 'accepted'"
                class="text-xs"
              >
                Duration: {{ scopedSlots.contact.duration | formatPrettySeconds }}
              </v-col>
              <v-col
                v-else
                class="text-xs"
              >
                {{ scopedSlots.contact | getDirectionTitle }}
              </v-col>
            </v-row>
          </v-col>

          <v-col class="container__col-last history__dots-col">
            <v-icon
              class="history__dots-icon"
            >
              $three-dots
            </v-icon>
          </v-col>

          <div class="history__action-btns">
            <PlayBtn
              v-if="scopedSlots.contact.recording_id && !isRecordingPlayButtonDisable"
              :call-id="String(scopedSlots.contact.recording_id)"
              :size="28"
            />
            <DownloadBtn
              v-if="scopedSlots.contact.recording_id"
              :call-id="String(scopedSlots.contact.recording_id)"
              :filename="$_calls_getFilename(scopedSlots.contact)"
              :small="true"
            />
            <AudioCallBtn
              :size="28"
              :contact="scopedSlots.contact.contactInfo"
            />
            <VideoCallBtn
              :size="28"
              :contact="scopedSlots.contact.contactInfo"
            />
          </div>
        </template>
      </PanelRowItem>
    </v-row>
    <v-row
      class="history-list__pagination"
      v-if="items && items.length"
      justify="center"
    >
      <v-pagination
        v-model="page"
        color="primary"
        :length="pageLength"
        :total-visible="6"
      />
    </v-row>
    <v-row v-else-if="loading">
      <v-progress-linear
        indeterminate
        color="primary"
      />
    </v-row>
    <EmptyContent
      :title="$t('errors.call_history_empty')"
      v-else-if="!loading"
    />

    <v-dialog
      v-model="callInfoVisible"
      max-width="320"
    >
      <PanelAppBar
        class="call-info__appbar"
        :title="$t('menu.info')"
      >
        <template #close>
          <v-icon
            class="cursor-pointer"
            color="secondary"
            @click.native="closeCallInfo()"
          >
            $close
          </v-icon>
        </template>
      </PanelAppBar>
      <v-row
        class="call-info__body"
        v-if="selectedCall"
      >
        <CallDetails
          :call="selectedCall"
        />
      </v-row>
      <template v-if="selectedCall && (selectedCall.recording_id || selectedCall.call_recording_exist)">
        <PanelAppBar
          class="call-info__appbar"
          :title="$t('menu.call_record')"
        />
        <v-row class="call-info__body">
          <CallRecord
            :call="selectedCall"
            class="call-info__record"
          />
        </v-row>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
import { calls, isRecordingPlayButtonDisable } from '@/mixins'
import PanelRowItem from '@/components/Layout/PanelRowItem.vue'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import DownloadBtn from '@/components/Shared/DownloadBtn.vue'
import PlayBtn from '@/components/Shared/PlayBtn.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'
import CallDetails from '@/components/Home-Recent-Calls-Info/CallDetails.vue'
import CallRecord from '@/components/Home-Recent-Calls-Info/CallRecord.vue'

export default {
  components: {
    PanelRowItem,
    PanelAppBar,
    AudioCallBtn,
    VideoCallBtn,
    DownloadBtn,
    PlayBtn,
    EmptyContent,
    CallDetails,
    CallRecord,
  },
  mixins: [calls, isRecordingPlayButtonDisable],
  props: {
    items: {
      type: Array,
      required: true,
    },
    pageLength: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    linkName: 'CallDetails',
    callInfoVisible: false,
    selectedCall: null,
  }),
  computed: {
    page: {
      get() {
        return this.currentPage
      },
      set(page) {
        this.$emit('update-page', page)
      },
    },
  },
  methods: {
    openCallInfo(call) {
      this.selectedCall = call
      this.callInfoVisible = true
    },
    closeCallInfo() {
      this.callInfoVisible = false
      this.selectedCall = null
      if (this.$refs.panelRowItem) {
        this.$refs.panelRowItem.selectedItem = null
      }
    },
  },
  watch: {
    search() {
      this.$emit('update-page', 1)
    },
  },
}
</script>

<style scoped lang="scss">
.history__dots-icon {
  @apply pl-4;

  &::before,
  &::after {
    @apply bg-transparent;
  }
}

.history__action-btns {
  display: none !important;
  position: absolute !important;
  right: 0;
  top: 0;
  bottom: 0;
  background: inherit;
  align-items: center !important;
  padding: 0 8px !important;
  flex-wrap: nowrap !important;
  max-width: max-content !important;
  flex-direction: row !important;
  z-index: 1;
  gap: 4px;

  & > * {
    margin: 0 !important;
  }

  ::v-deep .audio-player-progress {
    margin: 0 !important;
  }
}

::v-deep .container__row--mobile {
  position: relative;

  &:hover {
    .history__action-btns {
      display: flex !important;
    }

    .history__dots-col {
      visibility: hidden;
    }
  }
}

.history-list {
}

.history-list__pagination {
  @apply my-0;

  ::v-deep .v-pagination__item {
    @apply outline-none;
  }
}

.history-list__items {
  height: calc(100vh - 225px);
  // TODO return this when search field will be added
  // height: calc(100vh - 280px);

  @apply overflow-y-auto my-0;
}

.history-list__connect-time {
  @apply text-light-grey text-xs inline-block;
}

.call-info__appbar {
  @apply p-3 bg-white mb-0 #{!important};
}

.call-info__body {
  @apply m-0;

  ::v-deep > .col {
    @apply p-0;
  }

  ::v-deep .user-info {
    @apply rounded-none;
  }
}

.call-info__record {
  ::v-deep .call-record {
    @apply rounded-none;
  }
}
</style>
