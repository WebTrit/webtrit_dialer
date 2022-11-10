<template>
  <v-container class="-mb-6">
    <v-row
      class="history-list__items"
      v-if="items && items.length"
    >
      <PanelRowItem
        class="history-list"
        :items="items"
        :link-name="linkName"
      >
        <template #component="scopedSlots">
          <v-col class="container__col-first pl-1">
            <v-icon
              :title="$options.filters.getDirectionTitle(scopedSlots.contact)"
              :color="$options.filters.getIconColor(scopedSlots.contact)"
            >
              {{ scopedSlots.contact | getDirectionIcon }}
            </v-icon>
          </v-col>

          <v-col class="container__col">
            <v-row class="container__inner-row">
              <v-col class="container__item-name">
                {{ $_calls_getInterlocutor(scopedSlots.contact) }}
              </v-col>
            </v-row>
            <v-row class="container__inner-row">
              <v-col>
                <span
                  class="history-list__connect-time"
                  :class="[!$vuetify.breakpoint.xs? 'ml-5': 'ml-0']"
                >
                  {{ scopedSlots.contact | getDateTime }}
                </span>
              </v-col>
            </v-row>
            <v-row class="container__inner-row">
              <v-col
                v-if="$options.filters.prettySeconds(scopedSlots.contact)"
                class="text-xs"
              >
                Duration: {{ scopedSlots.contact | prettySeconds }}
              </v-col>
            </v-row>
          </v-col>

          <v-col
            v-if="scopedSlots.selectedItem !== scopedSlots.contact.id"
            class="container__col-last"
          >
            <v-icon
              class="history__dots-icon"
            >
              $three-dots
            </v-icon>
          </v-col>

          <v-col
            v-else
            class="history__action-btns"
            align-self="center"
          >
            <v-row
              class="container__inner-row"
              justify="end"
            >
              <AudioCallBtn
                :size="28"
                :contact="scopedSlots.contact.contactInfo"
              />
              <VideoCallBtn
                :size="28"
                :contact="scopedSlots.contact.contactInfo"
              />
            </v-row>
            <v-row
              v-if="scopedSlots.contact.call_recording_exist"
              class="container__inner-row mt-2"
              justify="end"
            >
              <PlayBtn
                :call-id="scopedSlots.contact.id"
                :size="28"
              />
              <DownloadBtn
                class="ml-2"
                :call-id="scopedSlots.contact.id"
                :filename="$_calls_getFilename(scopedSlots.contact)"
                :small="true"
              />
            </v-row>
          </v-col>
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
  </v-container>
</template>

<script>
import { calls } from '@/mixins'
import PanelRowItem from '@/components/Layout/PanelRowItem.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import DownloadBtn from '@/components/Shared/DownloadBtn.vue'
import PlayBtn from '@/components/Shared/PlayBtn.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'

export default {
  components: {
    PanelRowItem,
    AudioCallBtn,
    VideoCallBtn,
    DownloadBtn,
    PlayBtn,
    EmptyContent,
  },
  mixins: [calls],
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

.history-list {
  ::v-deep .download-btn {
    @apply ml-1;
  }
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
</style>
