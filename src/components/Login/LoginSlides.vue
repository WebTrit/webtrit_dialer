<template>
  <v-col class="login-slides primary">
    <v-carousel
      hide-delimiter-background
      :show-arrows="!$_breakpoints_mobile"
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
      >
        <v-sheet
          color="primary"
          height="100%"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div class="login-slides__img display-3">
              <span
                class="login-slides__number"
                v-if="!$_breakpoints_mobile"
              > {{ i+1 }}. </span>
              <component :is="slide" />
            </div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-col>
</template>

<script>
import { breakpoints } from '@/mixins'

import Slide_1 from '@/components/Login/Slide_1.vue'
import Slide_2 from '@/components/Login/Slide_2.vue'
import Slide_3 from '@/components/Login/Slide_3.vue'

export default {
  components: {
    Slide_1,
    Slide_2,
    Slide_3,
  },
  mixins: [breakpoints],
  computed: {
    slides() {
      return [
        Slide_1, Slide_2, Slide_3,
      ]
    },
  },
}
</script>

<style scoped lang="scss">
.login-slides {
  max-width: 50%;

  @apply flex justify-center items-center p-0;

  .v-carousel,
  ::v-deep .v-image {
    @apply h-screen #{!important};
  }

  ::v-deep img {
    max-height: calc(100vh - 200px);
    max-width: 40vw;

    @apply w-screen h-screen;
  }

  ::v-deep .login-slides__text {
    top: 7vh;
    left: 3vw;

    @apply absolute;

    .row {
      width: 50%;

      @apply font-bold m-0 pb-4 text-lg;

      ~ .row {
        @apply font-normal pb-0 text-base;
      }
    }
  }
}

.login-slides__number {
  right: 5vw;
  top: 7vh;

  @apply font-bold text-8xl absolute;
}

.login-slides__img {
  margin-top: 18vh;
}

.login__row--mobile {
  .login-slides {
    max-height: 300px !important;

    @apply max-w-full order-1;

    .v-carousel,
    ::v-deep .v-image {
      height: 300px !important;
    }

    .login-slides__img {
      @apply m-0 w-screen flex flex-row flex-nowrap justify-center h-full;
    }

    ::v-deep img {
      height: 250px;
      width: 50%;
      max-width: unset;

      @apply mt-4 ml-2;
    }

    .login-slides__slide {
      @apply flex flex-row justify-center flex-nowrap;
    }

    ::v-deep .login-slides__text {
      top: 50px;
      max-width: 350px;
      width: 50%;

      @apply relative py-0 px-0 ml-0 mr-2;

      .row {
        @apply text-sm w-full;
      }
    }
  }
}
</style>
