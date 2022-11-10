<template>
  <v-container class="login-slides__slide">
    <v-container class="login-slides__text">
      <v-row>
        {{ $t('slides.How to call') }}
      </v-row>
      <v-row>
        {{ $t('slides.Select contact') }}
      </v-row>
      <v-row>
        {{ $t('slides.Video call') }}
      </v-row>
      <v-row>
        {{ $t('slides.Quick call') }}
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
      return !this.$_breakpoints_mobile ? require('@/assets/Desktop_Slide1.svg') : require('@/assets/Mob_Slider1.svg')
    },
  },
}
</script>
