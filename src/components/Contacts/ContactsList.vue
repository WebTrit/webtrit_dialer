<template>
  <v-container class="-mb-6">
    <v-row
      class="contacts-list__items"
      v-if="items && items.length"
    >
      <PanelRowItem
        class="contacts-list__row"
        :items="sortedItems"
        :link-name="linkName"
      >
        <template #component="scopedSlots">
          <v-col class="container__col-first pl-1">
            <Avatar
              class="mr-0"
              :initials="scopedSlots.contact.initials"
              :email="scopedSlots.contact.email"
              :size="40"
              color="secondary"
            />
          </v-col>

          <v-col class="container__col middle-col">
            <v-row class="container__inner-row">
              <v-col
                class="container__item-name mb-2"
                v-if="scopedSlots.contact.name"
              >
                {{ scopedSlots.contact.name }}
              </v-col>
              <v-col
                class="container__item-name mb-2 text-gray-400"
                v-else
              >
                {{ $t('user.unknown') }}
              </v-col>
            </v-row>
            <v-row class="container__inner-row">
              <v-sheet
                width="100%"
                color="transparent"
              >
                <ContactDetailsList
                  class="contacts-list__details"
                  :contact="scopedSlots.contact"
                  :contact-info="scopedSlots.contact"
                  :disable-tooltips="true"
                />
              </v-sheet>
            </v-row>
          </v-col>

          <v-col
            v-if="scopedSlots.selectedItem !== scopedSlots.contact.number"
            class="container__col-last"
          >
            <v-icon
              class="contacts-list__dots-icon"
            >
              $three-dots
            </v-icon>
          </v-col>

          <v-col
            v-else
            align-self="center"
          >
            <v-row
              justify="end"
              class="contacts-list__action-btns"
            >
              <AudioCallBtn
                :size="28"
                :contact="scopedSlots.contact"
              />
            </v-row>
            <v-row
              justify="end"
              class="contacts-list__action-btns"
            >
              <VideoCallBtn
                :size="28"
                :contact="scopedSlots.contact"
              />
            </v-row>
          </v-col>
        </template>
      </PanelRowItem>
    </v-row>
    <v-row
      class="contacts-list__pagination"
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
      v-else-if="!items || items.length === 0"
      :title="$t('errors.contacts_empty')"
    />
  </v-container>
</template>

<script>
import PanelRowItem from '@/components/Layout/PanelRowItem.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import Avatar from '@/components/Shared/Avatar.vue'
import ContactDetailsList from '@/components/Shared/ContactDetailsList.vue'
import EmptyContent from '@/components/Shared/EmptyContent.vue'

export default {
  components: {
    PanelRowItem,
    AudioCallBtn,
    VideoCallBtn,
    Avatar,
    ContactDetailsList,
    EmptyContent,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    search: {
      type: String,
      default: '',
    },
    currentPage: {
      type: Number,
      required: true,
    },
    sort: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    linkName: 'ContactDetails',
  }),
  computed: {
    trimmedSearch() {
      return this.search && this.search.trim() || ''
    },
    filteredItems() {
      if (!this.trimmedSearch || this.trimmedSearch.length === 0) {
        return this.items
      } else {
        const search = new RegExp(this.trimmedSearch.toLowerCase())
        return this.items.reduce((memo, item) => {
          Object.values(item).map((val) => {
            if (val && search.test(val.toString().toLowerCase()) === true) {
              memo.push(item)
            }
            return false
          })
          return [...new Set(memo)]
        }, [])
      }
    },
    sortedItems() {
      const start = this.page * this.itemsPerPage - this.itemsPerPage
      const end = this.page * this.itemsPerPage
      if (!this.sort || this.sort.length === 0) {
        return this.filteredItems.slice(start, end)
      } else {
        const items = this.filteredItems.slice()
        items.sort((a, b) => {
          a = a[this.sort] && a[this.sort].toLowerCase()
          b = b[this.sort] && b[this.sort].toLowerCase()
          if (a < b) { return -1 }
          if (a > b) { return 1 }
          return 0
        })
        return items.slice(start, end)
      }
    },
    page: {
      get() {
        return this.currentPage
      },
      set(page) {
        this.$emit('update-page', page)
      },
    },
    pageLength() {
      if (this.filteredItems && this.filteredItems.length) {
        return Math.ceil(this.filteredItems.length / this.itemsPerPage)
      } else {
        return 1
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
.contacts-list__dots-icon {
  @apply pl-0;

  &::before,
  &::after {
    @apply bg-transparent;
  }
}

.contacts-list__pagination {
  @apply my-0;

  ::v-deep .v-pagination__item {
    @apply outline-none;
  }
}

.contacts-list__items {
  height: calc(100vh - 266px);

  @apply overflow-y-auto my-0;

  ::v-deep .v-data-table__wrapper {
    height: unset !important;

    @apply truncate
  }
}

.contacts-list__row {
  @apply h-full;

  ::v-deep .row {
    @apply flex-nowrap #{!important};
  }
}

.contacts-list__details {
  @apply bg-transparent #{!important};

  ::v-deep .user-info__row {
    > * {
      height: 18px !important;

      @apply text-sm;
    }
  }
}

.contacts-list__action-btns {
  @apply pr-2 py-2;
}

.middle-col {
  max-width: calc(100% - 92px);
}
</style>
