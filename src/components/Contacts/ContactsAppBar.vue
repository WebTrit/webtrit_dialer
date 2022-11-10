<template>
  <PanelAppBar
    :title="$t('menu.Contacts')"
    :class="[!$_breakpoints_desktop?
      'contacts__appbar--mobile': 'contacts__appbar']"
    :has-tabs="true"
    :appbar-extended="true"
  >
    <template #tabs>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="$emit('filter-all')"
      >
        {{ $t('menu.All') }}
      </v-tab>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="$emit('filter-favorites')"
      >
        {{ $t('menu.Favorites') }}
      </v-tab>
    </template>
    <template #search>
      <v-text-field
        class="contacts__search"
        v-model="search"
        color="secondary"
        outlined
        dense
        clearable
        flat
        hide-details
        prepend-inner-icon="$search"
        :placeholder="$t('placeholder.Name or number')"
      />
      <v-select
        v-if="!$_breakpoints_desktop"
        v-model="select"
        color="secondary"
        item-text="text"
        item-value="value"
        item-color="secondary"
        :items="options"
        :label="$t('label.Sort')"
        dense
        outlined
      />
    </template>
  </PanelAppBar>
</template>

<script>
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import { breakpoints } from '@/mixins'

export default {
  components: {
    PanelAppBar,
  },
  mixins: [breakpoints],
  props: {
    headers: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    select: null,
    search: '',
  }),
  computed: {
    options() {
      return this.headers.filter((item) => item.sortable !== false)
    },
  },
  watch: {
    search(val) {
      this.$emit('search-update', val && val.trim())
    },
    select(val) {
      this.$emit('sort-update', val)
    },
  },
}
</script>

<style scoped lang="scss">
.contacts__search {
  max-width: 550px;
}

.contacts__appbar--mobile {
  height: unset !important;

  @apply mb-0;

  ::v-deep .v-toolbar__extension {
    height: unset !important;

    @apply flex-wrap;
  }

  ::v-deep .v-text-field__details {
    @apply h-0 m-0 p-0 min-h-0;
  }

  .contacts__search {
    max-width: unset;

    @apply w-full mb-2;
  }
}
</style>
