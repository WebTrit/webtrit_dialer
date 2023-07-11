<template>
  <div class="m-0 p-0 w-full h-full">
    <ContactsAppBar
      :headers="headers"
      @search-update="updateSearch($event)"
      @sort-update="updateSort($event)"
      @filter-all="filterContacts('all')"
      @filter-favorites="filterContacts('favorites')"
    />
    <v-data-table
      class="contacts"
      v-if="$_breakpoints_desktop"
      fixed-header
      :search="search"
      :items="items || []"
      :loading="loading"
      :headers="headers"
      :footer-props="dataTableFooterProps"
      :options.sync="dataTableOptions"
    >
      <template #no-data>
        <v-btn
          v-if="fetchDataError"
          class="contacts__refresh-btn"
          color="error"
          outlined
          @click="$_contacts_getContacts()"
        >
          <v-icon left>
            $refresh
          </v-icon>
          {{ $t('button.Refresh') }}
        </v-btn>
        <EmptyContent
          :title="$t('errors.contacts_empty')"
          v-else
        />
      </template>

      <template #no-results>
        <p class="contacts__message">
          {{ $t('data.No results') }}
        </p>
      </template>

      <template
        #[`item.name`]="{ item }"
      >
        <Avatar
          class="mr-2"
          :initials="item.initials"
          :email="item.email"
          :size="40"
          color="secondary"
        />
        <Tooltip
          v-if="item.name"
          :text="item.name"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
        <span
          class="font-bold text-gray-400"
          v-else
        >
          {{ $t('user.Unknown') }}
        </span>
      </template>

      <template
        #[`item.number_ext`]="{ item }"
      >
        <Tooltip
          :text="item.number_ext"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
      </template>

      <template
        #[`item.number`]="{ item }"
      >
        <Tooltip
          :text="item.number"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
      </template>

      <template
        #[`item.email`]="{ item }"
      >
        <Tooltip
          :text="item.email"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
      </template>

      <template
        #[`item.mobile`]="{ item }"
      >
        <Tooltip
          :text="item.mobile"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
      </template>

      <template
        #[`item.company_name`]="{ item }"
      >
        <Tooltip
          :text="item.company_name"
          :disable-tooltips="false"
          :activator-width-limit="activatorWidthLimit"
        />
      </template>

      <template #[`item.actions`]="{ item }">
        <AudioCallBtn
          class="ml-auto"
          btn-color="transparent"
          icon-color="accent"
          :contact="item"
        />
        <VideoCallBtn
          btn-color="transparent"
          icon-color="accent"
          :contact="item"
        />
      </template>
    </v-data-table>
    <ContactsList
      v-else
      :items="items || []"
      :search="search"
      :sort="sort"
      :current-page="dataTableOptions.page"
      :items-per-page="dataTableOptions.itemsPerPage"
      :loading="loading"
      @update-page="updatePage($event)"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { breakpoints, contacts } from '@/mixins'
import ContactsAppBar from '@/components/Contacts/ContactsAppBar.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import Avatar from '@/components/Shared/Avatar.vue'
import ContactsList from '@/components/Contacts/ContactsList.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'
import Tooltip from '@/components/Shared/Tooltip.vue'

export default {
  components: {
    ContactsAppBar,
    AudioCallBtn,
    VideoCallBtn,
    Avatar,
    ContactsList,
    EmptyContent,
    Tooltip,
  },
  mixins: [breakpoints, contacts],
  data() {
    const itemsPerPageOptions = [25, 50, 100]
    return {
      search: '',
      sort: '',
      filter: 'all',
      dataTableFooterProps: {
        showCurrentPage: true,
        showFirstLastPage: true,
        itemsPerPageOptions,
      },
      dataTableOptions: {
        page: 1,
        itemsPerPage: itemsPerPageOptions[0],
      },
      activatorWidthLimit: 140,
    }
  },
  computed: {
    ...mapState('contacts', {
      loading: 'loading',
      fetchDataError: 'fetchError',
    }),
    ...mapGetters('account', {
      accountInfo: 'info',
    }),
    ...mapGetters('contacts', {
      contactsItems: 'items',
      favoriteItems: 'favoriteItems',
    }),
    filteredContactsItems() {
      return this.contactsItems && this.accountInfo && this.contactsItems.filter(
        (contact) => contact.number !== this.accountInfo.number,
      )
    },
    items() {
      return this.filter === 'all' ? this.filteredContactsItems : this.favoriteItems
    },
    headers() {
      return [
        {
          text: this.$t('user.Name'),
          value: 'name',
          width: '20%',
        },
        {
          text: this.$t('user.Extension'),
          value: 'number_ext',
          width: '10%',
        },
        {
          text: this.$t('user.Number'),
          value: 'number',
          width: '15%',
        },
        {
          text: this.$t('user.Email'),
          value: 'email',
          width: '15%',
        },
        {
          text: this.$t('user.Mobile'),
          value: 'mobile',
          width: '15%',
        },
        {
          text: this.$t('user.Company'),
          value: 'company_name',
          width: '15%',
        },
        {
          text: this.$t('user.Actions'),
          value: 'actions',
          align: 'end',
          sortable: false,
          width: '10%',
        },
      ]
    },
  },
  methods: {
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    updateSearch(val) {
      this.search = val
    },
    updatePage(val) {
      this.tmpDataTableOptions = { ...this.dataTableOptions, page: val }
      this.dataTableOptions = this.tmpDataTableOptions
    },
    updateSort(val) {
      this.sort = val
    },
    filterContacts(filter) {
      this.filter = filter
    },
  },
}
</script>

<style scoped lang="scss">
.contacts {
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

  ::v-deep tbody > tr > td:first-child {
    @apply font-bold;
  }

  ::v-deep tbody > tr > td:last-child {
    @apply flex items-center;
  }

  ::v-deep tbody > tr > td {
    max-width: 140px;

    @apply p-2 #{!important};
    @apply truncate;
  }

  ::v-deep .v-data-footer {
    @apply pt-1 mr-0;
  }

  ::v-deep .v-data-footer__select > .v-select {
    @apply my-0;
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

  ::v-deep table {
    table-layout: fixed;

    @apply overflow-hidden w-full;
  }
}

.contacts__refresh-btn {
  @apply flex mx-auto;
}

.contacts__message {
  @apply text-sm text-light-grey pl-1;
}

@media screen and (min-width: 600px) and (max-width: 959px) {
  ::v-deep .v-data-table__wrapper {
    height: calc(100vh - 225px) !important;
  }
}
</style>
