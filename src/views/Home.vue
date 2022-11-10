<template>
  <Container
    v-if="!$_breakpoints_mobile"
    :class="{'container--tablet': this.$vuetify.breakpoint.md}"
  >
    <template #component>
      <v-col
        class="container__col"
        :style="(threeColumns() && callsSubRoute()) ? 'max-width: 35%;' : ''"
      >
        <v-row>
          <v-col class="container__inner-col">
            <Contacts />
          </v-col>
          <router-view
            v-if="!callsSubRoute()"
            class="container__inner-col"
            name="ContactDetails"
          />
        </v-row>
      </v-col>
      <v-col
        class="container__col"
        :style="( threeColumns() && !callsSubRoute()) ? 'max-width: 35%;' : ''"
      >
        <v-row>
          <v-col class="container__inner-col">
            <RecentCalls />
          </v-col>
          <router-view
            v-if="callsSubRoute() && itemsLoaded"
            class="container__inner-col"
            name="CallDetails"
          />
        </v-row>
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
            <Contacts />
            <router-view
              v-if="!callsSubRoute()"
              class="container__inner-col"
              name="ContactDetails"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          flat
        >
          <v-card-text>
            <RecentCalls />
            <router-view
              v-if="callsSubRoute() && itemsLoaded"
              class="container__inner-col"
              name="CallDetails"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </template>
  </Tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints } from '@/mixins'
import Container from '@/views/Layout/Container.vue'
import Tabs from '@/views/Layout/Tabs.vue'
import Contacts from '@/components/Home-Contacts/Contacts.vue'
import RecentCalls from '@/components/Home-Recent-Calls/RecentCalls.vue'

export default {
  name: 'Home',
  components: {
    Container,
    Tabs,
    Contacts,
    RecentCalls,
  },
  mixins: [breakpoints],
  data() {
    return {
      tabs: [`${this.$t('menu.Contacts')}`, `${this.$t('menu.Recent Calls')}`],
    }
  },
  computed: {
    ...mapGetters('callHistory', {
      callHistoryItems: 'items',
    }),
    ...mapGetters('contacts', {
      contactsItems: 'items',
    }),
    itemsLoaded() {
      return this.callHistoryItems && this.callHistoryItems.length > 0
      && this.contactsItems && this.contactsItems.length > 0
    },
  },
  methods: {
    threeColumns() {
      return this.$route.params.number
      && this.$_breakpoints_desktop
    },
    callsSubRoute() {
      return this.$route.matched.some((route) => route.name === 'CallDetails')
    },
  },
}
</script>
