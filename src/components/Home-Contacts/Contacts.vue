<template>
  <v-data-iterator
    class="contacts"
    :items="items || []"
    :search="search"
    :loading="loading"
    :items-per-page="10"
    :page.sync="page"
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
          @click="$_contacts_getContacts()"
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
      <ContactsList :items="items" />
    </template>
  </v-data-iterator>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { contacts, breakpoints } from '@/mixins'
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
    }),
    filteredContactsItems() {
      return this.contactsItems && this.accountInfo && this.contactsItems.filter(
        (contact) => contact.number !== this.accountInfo.number,
      )
    },
    sortedContactsItems() {
      const items = this.filteredContactsItems && this.filteredContactsItems.slice() || []
      return items.sort((a, b) => {
        a = a.name && a.name.toLowerCase()
        b = b.name && b.name.toLowerCase()
        if (a < b) { return -1 }
        if (a > b) { return 1 }
        return 0
      })
    },
    items() {
      return this.filter === 'all' ? this.sortedContactsItems : this.favoriteItems
    },
  },
  methods: {
    updateSearch(val) {
      this.search = val
    },
    filterContacts(filter) {
      this.filter = filter
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
</style>
