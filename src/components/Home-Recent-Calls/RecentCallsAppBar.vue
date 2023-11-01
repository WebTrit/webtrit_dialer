<template>
  <PanelAppBar
    :title="!$_breakpoints_mobile? $t('menu.recent_calls') : ''"
    :has-tabs="true"
  >
    <template #tabs>
      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="filter('filter-all')"
      >
        {{ $t('menu.all') }}
      </v-tab>

      <v-tab
        class="panel__tab"
        :ripple="false"
        @click.native="filter('filter-missed')"
      >
        {{ $t('menu.missed') }}
      </v-tab>
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
  methods: {
    filter(event) {
      this.$emit(event)
      if (this.$route.name !== 'Home') {
        this.$router.push({ name: 'Home' })
      }
    },
  },
}
</script>
