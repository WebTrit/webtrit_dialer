<template>
  <PanelAppBar
    class="home__appbar"
    :title="(!$_breakpoints_mobile)? $t('menu.Contacts') : ''"
    :appbar-extended="true"
    :has-tabs="true"
  >
    <template #tabs>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="filter('filter-all')"
      >
        {{ $t('menu.All') }}
      </v-tab>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="filter('filter-favorites')"
      >
        {{ $t('menu.Favorites') }}
      </v-tab>
    </template>
    <template #search>
      <v-text-field
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
      <v-btn
        class="elevation-0"
        :class="[$_breakpoints_mobile?
          'contacts__keypad--mobile': 'contacts__keypad']"
        fab
        dark
        width="46"
        height="46"
        color="accent"
        @click="openKeypad()"
      >
        <v-icon dark>
          $call-keypad
        </v-icon>
      </v-btn>
    </template>
  </PanelAppBar>
</template>

<script>
import { breakpoints } from '@/mixins'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'

export default {
  components: {
    PanelAppBar,
  },
  mixins: [breakpoints],
  data: () => ({
    search: '',
  }),
  methods: {
    openKeypad() {
      this.$store.commit('toggleDialogNumberVisibility', true)
    },
    filter(event) {
      this.$emit(event)
      if (this.$route.name !== 'Home') {
        this.$router.push({ name: 'Home' })
      }
    },
  },
  watch: {
    search(val) {
      this.$emit('search-update', val && val.trim())
    },
  },
}
</script>

<style scoped lang="scss">

.contacts__keypad {
  @apply ml-4;
}

.contacts__keypad--mobile {
  right: 20px;
  bottom: 15%;

  @apply fixed;
}

@media screen and (max-width: 960px) {
  .home__appbar {
    @apply mb-0;

    ::v-deep .v-toolbar__content {
      @apply order-2;
    }

    ::v-deep .v-toolbar__extension {
      @apply order-1;
    }
  }
}
</style>
