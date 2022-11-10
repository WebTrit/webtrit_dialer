<template>
  <PanelRowItemLink
    :class="[!$_breakpoints_mobile? 'contacts-list' : 'contacts-list--mobile']"
    :items="items"
    :link-name="linkName"
  >
    <template #component="scopedSlots">
      <v-col class="container__col-first py-2">
        <AvatarBadge
          :initials="scopedSlots.contact.initials"
          :email="scopedSlots.contact.email"
          :status="sipStatusColor(scopedSlots.contact.sip_status)"
          avatar-color="secondary"
        />
      </v-col>

      <v-col class="container__col">
        <v-row class="container__inner-row">
          <v-col
            class="container__item-name"
            v-if="scopedSlots.contact.name"
          >
            {{ scopedSlots.contact.name }}
          </v-col>
          <v-col
            class="container__item-name text-gray-400"
            v-else
          >
            {{ $t('user.Unknown') }}
          </v-col>
        </v-row>
        <v-row class="container__inner-row">
          <v-col class="container__item-sub-name contacts__list-ext">
            {{ $t('user.Ext') }}: <span> {{ scopedSlots.contact.extension_id }} </span>
          </v-col>
          <v-col class="container__item-sub-name">
            {{ scopedSlots.contact.number }}
          </v-col>
        </v-row>
      </v-col>

      <ContactsListActionBtns
        v-if="accountInfo.login !== scopedSlots.contact.number
          && !$_breakpoints_mobile"
        class="contacts-list__col--last"
        :contact="scopedSlots.contact"
        :hovered-item="scopedSlots.hoveredItem"
        :selected-item="scopedSlots.selectedItem"
      />
      <v-icon
        v-else
        class="pl-0"
        :class="{ 'secondary--text' : scopedSlots.contact.number === scopedSlots.selectedItem }"
      >
        $three-dots
      </v-icon>
    </template>
  </PanelRowItemLink>
</template>

<script>
import { mapGetters } from 'vuex'

import { breakpoints } from '@/mixins'
import PanelRowItemLink from '@/components/Layout/PanelRowItemLink.vue'
import AvatarBadge from '@/components/Shared/AvatarBadge.vue'
import ContactsListActionBtns from '@/components/Home-Contacts/ContactsListActionBtns.vue'

export default {
  components: {
    AvatarBadge,
    PanelRowItemLink,
    ContactsListActionBtns,
  },
  mixins: [breakpoints],
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    linkName: 'ContactDetails',
  }),
  computed: {
    ...mapGetters('account', {
      accountInfo: 'info',
    }),
  },
  methods: {
    sipStatusColor(sipStatus) {
      return sipStatus === 1 ? 'green' : 'grey'
    },
  },
}
</script>

<style scoped lang="scss">
.contacts-list__col--last {
  @apply py-2 flex flex-row justify-end;
}

.contacts__list-ext {
  max-width: 80px;
}
</style>
