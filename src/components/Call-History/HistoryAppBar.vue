<template>
  <PanelAppBar
    :title="$t('menu.Call History')"
    :class="[$vuetify.breakpoint.xs?
      'history__appbar--mobile': 'history__appbar']"
    :has-tabs="true"
    :appbar-extended="true"
  >
    <template #tabs>
      <v-tab
        class="panel__tab cursor-default"
        :ripple="false"
      >
        {{ $t('menu.All') }}
      </v-tab>
    </template>
    <template #datepicker>
      <TimePicker
        :title="$t('label.Date from')"
        @update-date="updateFromDate($event)"
      />
      <TimePicker
        :title="$t('label.Date to')"
        @update-date="updateToDate($event)"
      />
    </template>
  </PanelAppBar>
</template>

<script>
import { mapActions } from 'vuex'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import TimePicker from '@/components/Call-History/TimePicker.vue'

export default {
  components: {
    PanelAppBar,
    TimePicker,
  },
  data: () => ({
    search: '',
    date: {
      dateFrom: null,
      dateTo: null,
    },
  }),
  methods: {
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    updateFromDate(from_date) {
      if (from_date) {
        const date = new Date(from_date)
        date.setHours(0, 0, 0, 0)
        this.date.dateFrom = date.toISOString()
      } else {
        this.date.dateFrom = null
      }
    },
    updateToDate(to_date) {
      if (to_date) {
        const date = new Date(to_date)
        date.setHours(23, 59, 59, 999)
        this.date.dateTo = date.toISOString()
      } else {
        this.date.dateTo = null
      }
    },
    checkDateValidity(date) {
      if (date.dateFrom && date.dateTo) {
        if (date.dateFrom < date.dateTo) {
          return true
        } else {
          this.snackbarShow({ message: this.$t('errors.date') })
          return false
        }
      }
      return true
    },
  },
  computed: {
    options() {
      return this.headers.filter((item) => item.sortable !== false)
    },
  },
  watch: {
    search(val) {
      this.$emit('search-update', val)
    },
    select(val) {
      this.$emit('sort-update', val)
    },
    date: {
      handler(date) {
        this.checkDateValidity(date) && this.$emit('get-call-records', date)
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="scss">
.history__search {
  max-width: 550px;

  @apply mr-8;
}

.history__appbar {
  ::v-deep .date-picker {
    max-width: 165px;

    @apply ml-auto;

    ~ .date-picker {
      @apply ml-3.5;
    }
  }
}

@media screen and (max-width: 700px) {
  .history__appbar {
    ::v-deep .date-picker {
      max-width: 145px;
    }
  }
}

.history__appbar--mobile {
  height: unset !important;

  ::v-deep .v-toolbar__extension {
    height: unset !important;

    @apply flex-wrap;
  }

  .history__search {
    max-width: unset;

    @apply w-full mb-4 mr-0;
  }

  ::v-deep .date-picker {
    $margin: 1rem;

    max-width: calc(50% - #{$margin / 2});

    ~ .date-picker {
      margin-left: $margin;
    }
  }
}
</style>
