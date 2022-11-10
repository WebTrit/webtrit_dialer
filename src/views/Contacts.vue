<template>
  <Container
    :class="{'container--mobile': $_breakpoints_mobile}"
  >
    <template #component>
      <v-col class="container__col">
        <ContactsTable />
      </v-col>
    </template>
  </Container>
</template>

<script>
import { breakpoints } from '@/mixins'
import Container from '@/views/Layout/Container.vue'
import ContactsTable from '@/components/Contacts/ContactsTable.vue'

export default {
  name: 'Contacts',
  mixins: [breakpoints],
  components: {
    Container,
    ContactsTable,
  },
}
</script>
