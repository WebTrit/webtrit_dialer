<template>
  <ContactDetails
    v-if="call"
    :contact="call.contactInfo"
  />
  <v-col v-else-if="error">
    <p class="text-red-500">
      {{ $t('errors.contact_not_found') }}
    </p>
  </v-col>
</template>

<script>
import ContactDetails from '@/components/Shared/ContactDetails.vue'

export default {
  components: {
    ContactDetails,
  },
  props: {
    call: {
      type: Object,
      required: true,
    },
  },
}
</script>
