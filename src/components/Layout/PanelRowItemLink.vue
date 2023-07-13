<template>
  <v-container class="main-container">
    <router-link
      class="container__link"
      v-for="(contact, index) in items"
      :key="index"
      :to="{ name: linkName, params: { number: getContactId(contact) }}"
    >
      <v-row
        class="container__row"
        :class="{ 'bg-light-blue':
                    getContactId(contact) === selectedItem ||
                    getContactId(contact) === hoveredItem,
                  'container__row--mobile': $_breakpoints_mobile }"
        @mouseenter="hoverItem(getContactId(contact))"
        @mouseleave="unhoverItem()"
        @click="selectItem(getContactId(contact))"
      >
        <slot
          name="component"
          :contact="contact"
          :hoveredItem="hoveredItem"
          :selectedItem="selectedItem"
        />
      </v-row>
    </router-link>
  </v-container>
</template>

<script>
import { breakpoints } from '@/mixins'

export default {
  mixins: [breakpoints],
  props: {
    items: {
      type: Array,
      required: true,
    },
    linkName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedItem: null,
    hoveredItem: null,
  }),
  mounted() {
    if (this.$route.params.number) {
      this.selectedItem = this.$route.params.number
    }
  },
  methods: {
    selectItem(num) {
      this.selectedItem = num
    },
    hoverItem(num) {
      this.hoveredItem = num
    },
    unhoverItem() {
      this.hoveredItem = null
    },
    getContactId(contact) {
      if (this.linkName === 'ContactDetails') {
        return contact.number
      }
      return contact.index
    },
  },
  watch: {
    $route() {
      if (!this.$route.params.number) {
        this.selectedItem = null
      }
    },
  },
}
</script>

<style scoped lang="scss">
.container__link {
  color: unset;

  @apply no-underline;
}

.container__row {
  @apply py-0 pl-1 pr-0 cursor-pointer m-0 rounded-lg;

  &::before {
    @apply bg-transparent;
  }
}

.main-container {
  @apply overflow-y-auto flex flex-col p-0;

  ::v-deep .container__col-first {
    @apply max-w-max px-0 py-2;
  }

  ::v-deep .container__col {
    @apply py-2;
  }

  ::v-deep .container__inner-row {
    @apply m-0;

    > .col {
      @apply p-0;
    }
  }

  ::v-deep .container__item-name {
    @apply text-sm font-bold;
  }

  ::v-deep .container__item-sub-name {
    @apply text-xs ;
    @apply text-light-grey #{!important};

    > span {
      @apply font-bold;
    }
  }
}

.container__row--mobile {
  @apply mb-0 overflow-hidden;
}

</style>
