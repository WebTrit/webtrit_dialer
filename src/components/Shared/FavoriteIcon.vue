<template>
  <v-icon
    :color="contactInFavorites? '#f4a259' : '#C6CFD3'"
    class="cursor-pointer"
    @click.stop.prevent="toggleFavorite()"
  >
    $star
  </v-icon>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    contactNumber: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('account', ['login']),
    ...mapGetters('contacts', {
      savedFavorites: 'favoriteNumbers',
    }),
    contactInFavorites() {
      return this.savedFavorites.includes(this.contactNumber)
    },
  },
  methods: {
    toggleFavorite() {
      let favoriteNums
      if (!this.contactInFavorites) {
        favoriteNums = this.savedFavorites.slice()
        favoriteNums.push(this.contactNumber)
      } else {
        favoriteNums = this.savedFavorites.filter((item) => item !== this.contactNumber)
      }
      this.$store.commit('contacts/setFavoriteNumbers', { nums: favoriteNums, login: this.login })
    },
  },
}
</script>
