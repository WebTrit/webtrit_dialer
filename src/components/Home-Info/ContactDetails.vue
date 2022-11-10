<template>
  <ContactDetails
    v-if="contact"
    :contact="contact"
  />
  <v-col v-else-if="error">
    <p class="text-red-500">
      {{ $t('errors.contact_not_found') }}
    </p>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'
import { contacts } from '@/mixins'

import ContactDetails from '@/components/Shared/ContactDetails.vue'

export default {
  components: {
    ContactDetails,
  },
  mixins: [contacts],
  data: () => ({
    contact: null,
    error: null,
  }),
  methods: {
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    async fetchContactDetails() {
      this.error = false
      this.$emit('loading', true)
      const { number } = this.$route.params
      this.contact = this.$_contacts_getOneContact(number)
      if (!this.contact) {
        this.error = true
        this.snackbarShow({ message: this.$t('errors.contact_not_found') })
      }
      this.$emit('loading', false)
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.fetchContactDetails()
      },
    },
  },
}
</script>
