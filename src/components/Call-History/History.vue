<template>
  <div class="m-0 p-0 w-full h-full">
    <HistoryAppBar
      @search-update="updateSearch($event)"
      @get-call-records="updateDate($event)"
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
          {{ $_calls_getInterlocutor(item) }}
        </span>
      </template>

      <template #[`item.connect_time`]="{ item }">
        <span
          class="call-history__connect-time"
          :class="[!$vuetify.breakpoint.xs? 'ml-5': 'ml-0']"
        >
          {{ item.connect_time | getCalendar }}
        </span>
      </template>

      <template #[`item.duration`]="{ item }">
        {{ item | prettySeconds }}
      </template>

      <template #[`item.actions`]="{ item }">
        <v-progress-linear
          v-if="item.call_recording_exist && !$_breakpoints_mobile"
          :value="playProgress[item.id] || 0"
          class="mr-4"
        />
        <PlayBtn
          v-if="item.call_recording_exist"
          :call-id="item.id"
          @update-progress="updatePlayProgress($event)"
        />
        <DownloadBtn
          v-if="item.call_recording_exist"
          :call-id="item.id"
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
          text: this.$t('call.Name'),
          value: 'called_calling',
          width: !this.$_breakpoints_mobile ? '25%' : '35%',
        },
        {
          text: this.$t('call.Connect Time'),
          value: 'connect_time',
          width: !this.$_breakpoints_mobile ? '20%' : '30%',
        },
        {
          text: this.$t('call.Duration'),
          value: 'duration',
          width: '10%',
        },
        {
          text: this.$t('call.Actions'),
          value: 'actions',
          align: 'end',
          width: !this.$_breakpoints_mobile ? '35%' : '15%',
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
        const params = this.getParams()
        await this.fetchCallHistoryItems(params)
        this.createPlayProgress()
      } catch (err) {
        this.fetchDataError = err.response.status
        if (err.response.status !== 405 && err.response.status !== 401) {
          // 401 handled by error interceptor
          const code = this.$_errors_parse(err)
          this.snackbarShow({
            message: code,
          })
        }
      } finally {
        this.loading = false
      }
    },
    getParams() {
      return {
        dateTo: this.date?.dateTo,
        dateFrom: this.date?.dateFrom,
        page: this.dataTableOptions.page,
        itemsPerPage: this.dataTableOptions.itemsPerPage,
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
    updatePage(val) {
      this.tmpDataTableOptions = { ...this.dataTableOptions, page: val }
      this.dataTableOptions = this.tmpDataTableOptions
    },
    createPlayProgress() {
      this.callHistoryItems.forEach((item) => {
        this.playProgress[item.id] = 0
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

@media screen and (min-width: 600px) and (max-width: 959px) {
  ::v-deep .v-data-table__wrapper {
    height: calc(100vh - 225px) !important;
  }
}
</style>
