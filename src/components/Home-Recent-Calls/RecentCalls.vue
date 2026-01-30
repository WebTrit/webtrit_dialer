<template>
  <v-data-table
    class="calls"
    :class="[$_breakpoints_mobile? 'calls--mobile' : '']"
    :items="historyItems || []"
    :loading="loading || !contactsReady"
    :items-per-page="10"
    hide-default-footer
    group-by="date"
    :group-desc="true"
  >
    <template #top>
      <RecentCallsAppBar
        @filter-all="filterHistory('all')"
        @filter-missed="filterHistory('missed')"
      />
    </template>

    <template #loading>
      <div
        :class="[!$_breakpoints_mobile? 'calls__loading' : 'calls__loading--mobile']"
      >
        <v-progress-linear
          indeterminate
          color="primary"
        />
      </div>
    </template>

    <template #no-data>
      <v-container v-if="fetchDataError === 405">
        <p
          class="error--text mt-2"
        >
          {{ $t("errors.not_allowed_page.description") }}
          <br>
          {{ $t("errors.not_allowed_page.hint") }}
        </p>
        <v-btn
          v-if="fetchDataError"
          class="calls__refresh-btn"
          color="error"
          outlined
          @click="fetchData()"
        >
          <v-icon left>
            $refresh
          </v-icon>
          {{ $t('button.refresh') }}
        </v-btn>
      </v-container>
      <EmptyContent
        :title="supported ? $t('errors.call_history_empty') : $t('errors.not_supported_by_bss')"
        v-else
      />
    </template>

    <template #no-results>
      <p class="calls__message">
        {{ $t('data.no_results') }}
      </p>
    </template>

    <template #[`group.header`]="{ items }">
      <hr class="calls__divider">
      <span class="calls__date secondary--text"> {{ items[0].date | convertToCalendarDay }} </span>
    </template>

    <template #item="{ item }">
      <RecentCallsList :items="[item]" />
    </template>

    <template
      #footer
      v-if="supported"
    >
      <p class="calls__footer">
        {{ $t('call.last') }}
      </p>
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { breakpoints } from '@/mixins'
import RecentCallsAppBar from '@/components/Home-Recent-Calls/RecentCallsAppBar.vue'
import RecentCallsList from '@/components/Home-Recent-Calls/RecentCallsList.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'

export default {
  components: {
    RecentCallsAppBar,
    RecentCallsList,
    EmptyContent,
  },
  mixins: [breakpoints],
  props: {
    supported: Boolean,
  },
  data() {
    return {
      filter: 'all',
      loading: false,
      fetchDateError: false,
    }
  },
  computed: {
    ...mapGetters('callHistory', {
      callHistoryItems: 'items',
      missedItems: 'missedItems',
    }),
    ...mapGetters('contacts', {
      contactsItems: 'items',
      contactsInitialized: 'initialized',
    }),
    contactsReady() {
      return this.contactsInitialized
    },
    historyItems() {
      if (!this.contactsReady) {
        return []
      }
      return this.filter === 'all' ? this.callHistoryItems.slice(0, 10) : this.missedItems
    },
  },
  created() {
    if (this.supported) {
      this.fetchData()
    } else {
      this.fetchDataError = false
    }
  },
  methods: {
    ...mapActions('callHistory', {
      fetchCallHistoryItems: 'fetchItems',
    }),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    filterHistory(filter) {
      this.filter = filter
    },
    async fetchData() {
      this.loading = true
      try {
        this.fetchDataError = false
        await this.fetchCallHistoryItems({
          page: 1,
          items_per_page: 100,
        })
      } catch (err) {
        if (err) {
          this.fetchDataError = err.response.status
          await this.snackbarShow({
            message: this.$_errors_parse(err),
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
$calls-list-height: calc(100vh - 136px);
$calls-list--mobile-height: calc(100vh - 220px);

.calls {
  ::v-deep .v-data-table__wrapper {
    height: $calls-list-height;

    @apply overflow-y-auto;
  }

  ::v-deep .v-row-group__header {
    @apply bg-white flex flex-row flex-nowrap items-center;

    &:hover {
      @apply bg-white #{!important};
    }
  }

  ::v-deep .v-data-table-header-mobile {
    @apply hidden;
  }
}

.calls--mobile {
  ::v-deep .v-data-table__wrapper {
    height: $calls-list--mobile-height;
  }
}

.calls__divider {
  border-top: 1px solid #eceff1;
  margin-left: 10px;

  @apply flex-auto w-full border-b-0;
}

.calls__date {
  flex: 1 0 auto;
  padding-right: 6px;

  @apply text-sm pl-4;
}

.calls__loading {
  min-height: $calls-list-height;
}

.calls__loading--mobile {
  min-height: $calls-list--mobile-height;
}

.calls__footer {
  @apply m-0 pl-2 text-sm text-light-grey pt-1;
}

.calls__refresh-btn {
  @apply flex mx-auto;
}
</style>
