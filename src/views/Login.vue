<template>
  <v-container
    class="login"
  >
    <v-row
      :class="[!$_breakpoints_mobile?
        'login__row' : 'login__row--mobile']"
    >
      <LoginForm v-bind="$props" />
      <LoginSlides />
    </v-row>
  </v-container>
</template>

<script>
import { breakpoints } from '@/mixins'
import LoginForm from '@/components/Login/LoginForm.vue'
import LoginSlides from '@/components/Login/LoginSlides.vue'

export default {
  components: {
    LoginForm,
    LoginSlides,
  },
  mixins: [breakpoints],
  props: {
    tenant: {
      type: String,
      default: null,
    },
  },

  async created() {
    await this.$store.dispatch('account/storeTenantId', this.tenant)
  },
}
</script>

<style scoped lang="scss">
  .login {
    @apply w-full h-full max-w-full max-h-full;
  }

  .login__row {
    @apply h-screen;
  }

  .login__row--mobile {
    @apply flex flex-col h-screen;
  }
</style>
