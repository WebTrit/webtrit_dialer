<template>
  <Container
    :class="{'container--mobile': $_breakpoints_mobile}"
  >
    <template #component>
      <v-col class="container__col">
        <History />
      </v-col>
    </template>
  </Container>
</template>

<script>
import { breakpoints } from '@/mixins'
import Container from '@/views/Layout/Container.vue'
import History from '@/components/Call-History/History.vue'

export default {
  name: 'CallHistory',
  mixins: [breakpoints],
  components: {
    Container,
    History,
  },
}
</script>
