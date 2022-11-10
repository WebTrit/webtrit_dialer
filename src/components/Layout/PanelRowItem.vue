<template>
  <v-container class="main-container">
    <v-row
      v-for="(contact, index) in items"
      :key="index"
      class="container__row--mobile"
      :class="{ 'bg-light-blue':
        getContactId(contact) === selectedItem }"
      @click="selectItem(getContactId(contact))"
    >
      <slot
        name="component"
        :contact="contact"
        :selectedItem="selectedItem"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
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
  }),
  methods: {
    selectItem(num) {
      this.selectedItem = num
    },
    getContactId(contact) {
      return this.linkName === 'ContactDetails' ? contact.number : contact.id
    },
  },
}
</script>

<style scoped lang="scss">
.container__row--mobile {
  flex: 1 0 auto !important;

  @apply py-0 pl-0 pr-0 cursor-pointer mx-0 mt-0 rounded-lg mb-0;

  &::before {
    @apply bg-transparent;
  }
}

.main-container {
  @apply overflow-y-auto flex flex-col p-0;

  ::v-deep .container__col-first {
    @apply max-w-max px-0 py-2;
  }

  ::v-deep .container__col-last {
    @apply py-2 flex flex-row justify-end max-w-max;
  }

  ::v-deep .container__col {
    @apply py-2;
  }

  ::v-deep .container__inner-row {
    @apply m-0 overflow-hidden;

    > .col {
      @apply p-0;
    }
  }

  ::v-deep .container__item-name {
    @apply text-sm font-bold;
  }
}
</style>
