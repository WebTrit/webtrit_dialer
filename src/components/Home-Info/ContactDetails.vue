<template>
  <ContactDetails
    v-if="contact"
    :contact="contact"
  />
  <v-col v-else>
    <p class="text-red-500">
      {{ $t('errors.contact_not_found') }}
    </p>
  </v-col>
</template>

<script>
import { contacts } from '@/mixins'

import ContactDetails from '@/components/Shared/ContactDetails.vue'

export default {
  components: {
    ContactDetails,
  },
  mixins: [contacts],
  data: () => ({
    number: null,
  }),
  computed: {
    contact() {
      return this.$_contacts_getOneContact(this.number)
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.number = this.$route.params.number
      },
    },
  },
}
</script>
