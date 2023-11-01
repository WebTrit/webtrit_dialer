<template>
  <v-container class="login-slides__slide">
    <v-container class="login-slides__text">
      <v-row>
        {{ $t('slides.missed_call') }}
      </v-row>
      <v-row>
        {{ $t('slides.recent_calls') }}
      </v-row>
    </v-container>
    <img :src="img">
  </v-container>
</template>

<script>
import { breakpoints } from '@/mixins'

export default {
  mixins: [breakpoints],
  computed: {
    img() {
      return !this.$_breakpoints_mobile ? require('@/assets/Desktop_Slide3.svg') : require('@/assets/Mob_Slider3.svg')
    },
  },
}
</script>
