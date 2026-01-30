<template>
  <PanelAppBar
    :title="$t('menu.contacts')"
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
        {{ $t('menu.all') }}
      </v-tab>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="$emit('filter-favorites')"
      >
        {{ $t('menu.favorites') }}
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
        :placeholder="$t('placeholder.name_or_number')"
        @keyup.enter="emitSearch"
        @click:clear="clearSearch"
      />
      <v-btn
        class="elevation-0 ml-2"
        fab
        dark
        width="46"
        height="46"
        color="secondary"
        @click="emitSearch"
      >
        <v-icon dark>
          $search
        </v-icon>
      </v-btn>
      <v-select
        v-if="!$_breakpoints_desktop"
        v-model="select"
        color="secondary"
        item-text="text"
        item-value="value"
        item-color="secondary"
        :items="options"
        :label="$t('label.sort')"
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
  methods: {
    emitSearch() {
      this.$emit('search-update', this.search && this.search.trim())
    },
    clearSearch() {
      this.search = ''
      this.$emit('search-update', '')
    },
  },
  watch: {
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
