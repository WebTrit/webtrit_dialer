<template>
  <v-container class="login-slides__slide">
    <v-container class="login-slides__text">
      <v-row>
        {{ $t('slides.Call record') }}
      </v-row>
      <v-row>
        {{ $t('slides.Info menu') }}
      </v-row>
      <v-row>
        {{ $t('slides.Call history') }}
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
      return !this.$_breakpoints_mobile ? require('@/assets/Desktop_Slide2.svg') : require('@/assets/Mob_Slider2.svg')
    },
  },
}
</script>
