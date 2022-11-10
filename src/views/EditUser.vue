<template>
  <Container
    v-if="!$_breakpoints_mobile"
    :class="{'container--tablet': this.$vuetify.breakpoint.md}"
  >
    <template #component>
      <v-col class="container__col">
        <Account />
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
          <Account />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          flat
        >
          <Info />
        </v-card>
      </v-tab-item>
    </template>
  </Tabs>
</template>

<script>
import { breakpoints } from '@/mixins'
import Container from '@/views/Layout/Container.vue'
import Tabs from '@/views/Layout/Tabs.vue'
import Info from '@/components/Edit-Info/Info.vue'
import Account from '@/components/Edit-Account/Account.vue'

export default {
  name: 'EditUser',
  components: {
    Container,
    Tabs,
    Info,
    Account,
  },
  mixins: [breakpoints],
  data() {
    return {
      tabs: [`${this.$t('menu.Account')}`, `${this.$t('menu.Info')}`],
    }
  },
}
</script>
