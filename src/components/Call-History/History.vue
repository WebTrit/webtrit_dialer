<template>
  <div class="m-0 p-0 w-full h-full">
    <HistoryAppBar
      :headers="headers"
      @get-call-records="updateDate($event)"
      @search-update="updateSearch($event)"
      @sort-update="updateSort($event)"
    />
    <v-data-table
      v-if="!$vuetify.breakpoint.xs"
      class="call-history"
      fixed-header
      :items="callHistoryItems || []"
      :loading="loading"
      :headers="headers"
      :footer-props="dataTableFooterProps"
      :options.sync="dataTableOptions"
      :server-items-length="callHistoryPagination.itemsTotal"
    >
      <template #no-data>
        <p
          v-if="fetchDataError === 405"
          class="error--text mt-2"
        >
          {{ $t("errors.not_allowed_page.description") }}
          <br>
          {{ $t("errors.not_allowed_page.hint") }}
        </p>
        <v-btn
          v-if="fetchDataError"
          class="contacts__refresh-btn"
          color="error"
          outlined
          @click="fetchData()"
        >
          <v-icon left>
            $refresh
          </v-icon>
          {{ $t('button.Refresh') }}
        </v-btn>
        <EmptyContent
          :title="$t('errors.call_history_empty')"
          v-else
        />
      </template>

      <template #no-results>
        <p class="contacts__message">
          {{ $t('data.No results') }}
        </p>
      </template>

      <template #[`item.called_calling`]="{ item }">
        <v-icon
          :title="$options.filters.getDirectionTitle(item)"
          :color="$options.filters.getIconColor(item)"
        >
          {{ item | getDirectionIcon }}
        </v-icon>
        <span class="font-bold ml-4">
          {{ item.contactInfo.name }}
        </span>
      </template>

      <template #[`item.number`]="{ item }">
        <span
          class="call-history__connect-time"
          :class="[!$vuetify.breakpoint.xs? 'ml-5': 'ml-0']"
        >
          {{ item.contactInfo.number || item.contactInfo.number_ext }}
        </span>
      </template>

      <template #[`item.connect_time`]="{ item }">
        <span
          class="call-history__connect-time"
          :class="[!$vuetify.breakpoint.xs? 'ml-5': 'ml-0']"
        >
          {{ item.connect_time | convertToCalendar }}
        </span>
      </template>

      <template #[`item.duration`]="{ item }">
        <span
          class="call-history__duration"
          v-if="item.duration > 0 && item.status === 'accepted'"
        >
          {{ $t('call.Duration') }}: {{ item.duration | formatPrettySeconds }}
        </span>
        <span
          class="call-history__duration"
          v-else
        >
          {{ item | getDirectionTitle }}
        </span>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-progress-linear
          v-if="item.recording_id && !$_breakpoints_mobile"
          :value="playProgress[item.recording_id] || 0"
          class="mr-4"
        />
        <PlayBtn
          v-if="item.recording_id"
          :call-id="item.recording_id"
          @update-progress="updatePlayProgress($event)"
        />
        <DownloadBtn
          v-if="item.recording_id"
          :call-id="item.recording_id"
          :filename="$_calls_getFilename(item)"
        />
        <AudioCallBtn
          class="ml-auto"
          btn-color="transparent"
          icon-color="accent"
          :contact="item.contactInfo"
        />
        <VideoCallBtn
          btn-color="transparent"
          icon-color="accent"
          :contact="item.contactInfo"
        />
      </template>
    </v-data-table>
    <HistoryList
      v-else
      :items="callHistoryItems || []"
      :sort="sort"
      :page-length="pageLength"
      :current-page="dataTableOptions.page"
      :loading="loading"
      @update-page="updatePage($event)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { breakpoints, calls, errors } from '@/mixins'
import DownloadBtn from '@/components/Shared/DownloadBtn.vue'
import PlayBtn from '@/components/Shared/PlayBtn.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import HistoryAppBar from '@/components/Call-History/HistoryAppBar.vue'
import HistoryList from '@/components/Call-History/HistoryList.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'

export default {
  components: {
    DownloadBtn,
    PlayBtn,
    AudioCallBtn,
    VideoCallBtn,
    HistoryAppBar,
    HistoryList,
    EmptyContent,
  },
  mixins: [breakpoints, calls, errors],
  data() {
    const itemsPerPageOptions = [25, 50, 100]
    return {
      playProgress: {},
      search: null,
      fetchDataError: false,
      loading: false,
      dataTableOptions: {
        page: 1,
        itemsPerPage: itemsPerPageOptions[0],
      },
      dataTableFooterProps: {
        showCurrentPage: true,
        showFirstLastPage: true,
        itemsPerPageOptions,
      },
      date: null,
      sort: '',
    }
  },
  computed: {
    ...mapGetters('callHistory', {
      callHistoryItems: 'items',
      callHistoryPagination: 'pagination',
    }),
    ...mapGetters('webrtc', ['isCallActive']),
    headers() {
      return [
        {
          text: this.$t('user.Name'),
          value: 'called_calling',
          width: this.$_breakpoints_mobile ? '30%' : '20%',
        },
        {
          text: this.$t('user.Number'),
          value: 'number',
          width: this.$_breakpoints_mobile ? '5%' : '5%',
        },
        {
          text: this.$t('call.Connect Time'),
          value: 'connect_time',
          width: this.$_breakpoints_mobile ? '20%' : '20%',
        },
        {
          text: this.$t('call.Status'),
          value: 'duration',
          width: '15%',
        },
        {
          text: this.$t('call.Actions'),
          value: 'actions',
          align: 'end',
          width: this.$_breakpoints_mobile ? '25%' : '30%',
          sortable: false,
        },
      ]
    },
    pageLength() {
      return Math.ceil(this.callHistoryPagination.itemsTotal / this.callHistoryPagination.itemsPerPage)
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions('callHistory', {
      fetchCallHistoryItems: 'fetchItems',
    }),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    async fetchData() {
      this.loading = true
      try {
        this.fetchDataError = false
        await this.fetchCallHistoryItems(this.getParams())
        this.createPlayProgress()
      } catch (err) {
        this.fetchDataError = err.response.status
        if (err.response.status !== 405 && err.response.status !== 401) {
          // 401 handled by error interceptor
          const code = this.$_errors_parse(err)
          await this.snackbarShow({
            message: code,
          })
        }
      } finally {
        this.loading = false
      }
    },
    getParams() {
      return {
        time_to: this.date?.dateTo,
        time_from: this.date?.dateFrom,
        page: this.dataTableOptions.page,
        items_per_page: this.dataTableOptions.itemsPerPage,
      }
    },
    updateSearch(val) {
      this.search = val
      this.fetchData()
    },
    updateDate(date) {
      this.date = date
      this.dataTableOptions.page = 1
      this.fetchData()
    },
    updateSort(val) {
      this.sort = val
    },
    updatePage(val) {
      this.tmpDataTableOptions = { ...this.dataTableOptions, page: val }
      this.dataTableOptions = this.tmpDataTableOptions
    },
    createPlayProgress() {
      this.callHistoryItems.forEach((item) => {
        this.playProgress[item.recording_id] = 0
      })
    },
    updatePlayProgress({ percentage, id }) {
      this.tmpPlayProgress = { ...this.playProgress, [id]: percentage }
      this.playProgress = this.tmpPlayProgress
    },
  },
  watch: {
    dataTableOptions: {
      handler(val, oldVal) {
        if (val.page !== oldVal.page || val.itemsPerPage !== oldVal.itemsPerPage) {
          this.fetchData()
        }
      },
      deep: true,
    },
    isCallActive(val) {
      if (val === false) {
        this.fetchData()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.call-history {
  @apply w-full;

  ::v-deep .v-data-table__wrapper {
    height: calc(100vh - 197px);
  }

  ::v-deep .v-data-table-header th {
    @apply text-light-grey font-light text-sm;

    &:first-child {
      @apply pl-14;
    }
  }

  ::v-deep .v-data-table-header th.sortable:hover,
  ::v-deep .v-data-table-header th.sortable.active {
    color: var(--v-secondary-base);
  }

  ::v-deep tbody > tr:hover {
    @apply bg-light-blue #{!important};
  }

  ::v-deep tbody > tr:not(:last-child) > td {
    border-bottom: none !important;
  }

  ::v-deep tbody > tr > td:last-child {
    @apply flex items-center;
  }

  ::v-deep tbody > tr > td {
    @apply p-2 #{!important};
  }

  ::v-deep .v-data-footer {
    @apply pt-1;
  }

  ::v-deep .v-data-footer__select > .v-select {
    @apply my-0;
  }

  ::v-deep .download-btn {
    @apply mr-7;
  }

  ::v-deep .v-data-table__empty-wrapper {
    @apply bg-transparent #{!important};

    &:hover {
      @apply bg-transparent #{!important};
    }

    td {
      display: table-cell #{ !important };
    }
  }
}

.contacts__refresh-btn {
  @apply flex mx-auto;
}

.contacts__message {
  @apply text-sm text-light-grey pl-1;
}

.call-history__connect-time {
  @apply text-light-grey inline-block;
}

.call-history__duration {
  @apply text-light-grey;
}

@media screen and (min-width: 600px) and (max-width: 959px) {
  ::v-deep .v-data-table__wrapper {
    height: calc(100vh - 225px) !important;
  }
}
</style>
