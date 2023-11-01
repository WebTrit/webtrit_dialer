<template>
  <Container
    v-if="!$_breakpoints_mobile"
    :class="{'container--tablet': this.$vuetify.breakpoint.md}"
  >
    <template #component>
      <v-col class="container__col">
        <SettingsInfo />
      </v-col>
      <v-col class="container__col">
        <Info />
      </v-col>
    </template>
  </Container>
  <Tabs
    v-else
  >
    <template #tabs>
      <v-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :ripple="false"
      >
        {{ tab }}
      </v-tab>
    </template>
    <template #tab-items>
      <v-tab-item>
        <v-card
          flat
        >
          <v-card-text>
            <SettingsInfo />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          flat
        >
          <v-card-text>
            <Info />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </template>
  </Tabs>
</template>

<script>
import { breakpoints } from '@/mixins'
import Container from '@/views/Layout/Container.vue'
import Tabs from '@/views/Layout/Tabs.vue'
import Info from '@/components/Settings-Info/Info.vue'
import SettingsInfo from '@/components/Settings-Info/Settings.vue'

export default {
  name: 'Settings',
  components: {
    Container,
    Tabs,
    Info,
    SettingsInfo,
  },
  mixins: [breakpoints],
  data() {
    return {
      tabs: [`${this.$t('menu.settings')}`, `${this.$t('menu.info')}`],
    }
  },
}
</script>
