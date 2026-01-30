<template>
  <v-data-iterator
    class="contacts"
    :items="items || []"
    :loading="loading"
    :items-per-page="itemsPerPage"
    :page.sync="page"
    :server-items-length="serverItemsLength"
  >
    <template #header>
      <ContactsAppBar
        @search-update="updateSearch($event)"
        @filter-all="filterContacts('all')"
        @filter-favorites="filterContacts('favorites')"
      />
    </template>

    <template
      #loading
    >
      <div
        :class="[!$_breakpoints_mobile? 'contacts__loading' : 'contacts__loading--mobile']"
      >
        <v-progress-linear
          indeterminate
          color="primary"
        />
      </div>
    </template>

    <template #no-data>
      <div :class="[!$_breakpoints_mobile? 'contacts__no-data' : 'contacts__no-data--mobile']">
        <v-btn
          v-if="fetchDataError"
          class="contacts__refresh-btn"
          color="error"
          outlined
          @click="fetchContactsPage()"
        >
          <v-icon left>
            $refresh
          </v-icon>
          {{ $t('button.refresh') }}
        </v-btn>
        <EmptyContent
          :title="supported ? $t('errors.contacts_empty') : $t('errors.not_supported_by_bss')"
          v-else
        />
      </div>
    </template>

    <template #no-results>
      <div :class="[!$_breakpoints_mobile? 'contacts__no-data' : 'contacts__no-data--mobile']">
        <p class="contacts__message">
          {{ $t('data.no_results') }}
        </p>
      </div>
    </template>

    <template
      #default="{ items }"
    >
      <div class="contacts__list-wrapper">
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="contacts__search-loading"
        />
        <ContactsList :items="items" />
      </div>
    </template>
  </v-data-iterator>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { contacts, breakpoints } from '@/mixins'
import { DEFAULT_HOMEPAGE_CONTACTS_PER_PAGE } from '@/store/modules/contacts'
import ContactsAppBar from '@/components/Home-Contacts/ContactsAppBar.vue'
import ContactsList from '@/components/Home-Contacts/ContactsList.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'

export default {
  components: {
    ContactsAppBar,
    ContactsList,
    EmptyContent,
  },
  mixins: [contacts, breakpoints],
  props: {
    supported: Boolean,
  },
  data: () => ({
    search: '',
    filter: 'all',
    page: 1,
    itemsPerPage: DEFAULT_HOMEPAGE_CONTACTS_PER_PAGE,
  }),
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
      contactsPagination: 'pagination',
    }),
    filteredContactsItems() {
      if (!this.contactsItems) return []
      if (!this.accountInfo) return this.contactsItems
      return this.contactsItems.filter(
        (contact) => contact.number !== this.accountInfo.number,
      )
    },
    items() {
      return this.filter === 'all' ? this.filteredContactsItems : this.favoriteItems
    },
    serverItemsLength() {
      return this.filter === 'all' ? (this.contactsPagination.itemsTotal || 0) : this.favoriteItems.length
    },
  },
  watch: {
    page(newVal, oldVal) {
      if (newVal !== oldVal && this.filter === 'all') {
        this.fetchContactsPage()
      }
    },
  },
  mounted() {
    if (this.filter === 'all') {
      this.fetchContactsPage()
    }
  },
  methods: {
    updateSearch(val) {
      this.search = val
      this.page = 1
      this.fetchContactsPage()
    },
    filterContacts(filter) {
      this.filter = filter
      if (filter === 'all') {
        this.page = 1
        this.fetchContactsPage()
      }
    },
    fetchContactsPage() {
      this.$_contacts_getContacts({
        page: this.page,
        items_per_page: this.itemsPerPage,
        search: this.search || undefined,
      })
    },
  },
}
</script>

<style scoped lang="scss">
$contacts-list-height: calc(100vh - 200px);
$contacts-list--mobile-height: calc(100vh - 274px);

.contacts {
  ::v-deep .v-data-footer {
    @apply p-0 flex-nowrap mt-1;
  }

  ::v-deep .v-data-footer__select {
    @apply mr-0;

    > .v-input {
      @apply my-0 #{!important};
    }
  }

  ::v-deep .v-data-footer__select .v-select {
    @apply ml-3 #{!important};
  }

  ::v-deep .v-data-footer__pagination {
    @apply mx-3;
  }

  .contacts-list,
  .contacts__no-data {
    max-width: unset;
    height: $contacts-list-height;
  }

  .contacts-list--mobile,
  .contacts__no-data--mobile {
    max-width: unset;
    height: $contacts-list--mobile-height;
  }
}

.contacts__refresh-btn {
  @apply flex mx-auto;
}

.contacts__message {
  @apply text-sm text-light-grey pl-1;
}

.contacts__loading {
  min-height: $contacts-list-height;
}

.contacts__loading--mobile {
  min-height: $contacts-list--mobile-height;
}

.contacts__list-wrapper {
  position: relative;
}

.contacts__search-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
