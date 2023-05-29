<template>
  <v-container class="p-0">
    <v-form
      ref="login-sign-in-form"
      @submit.prevent
    >
      <p
        class="login-sign-in-form__title mt-9 text-gray-600"
        v-html="$t('login.If exist account')"
      />
      <v-row :class="{ 'login-sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="login-sign-in-form__input"
            v-model="login"
            color="secondary"
            :rules="loginRules"
            :label="$t('label.Login')"
            :error-messages="loginErrorMessages"
            outlined
            dense
            required
          />
        </v-col>
      </v-row>
      <v-row :class="{ 'login-sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="login-sign-in-form__input"
            v-model="password"
            color="secondary"
            :label="$t('label.Password')"
            :error-messages="passwordErrorMessages"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            outlined
            dense
            required
            @keyup.enter="provideLoginPassword()"
            @click:append="show = !show"
          />
        </v-col>
      </v-row>
      <v-row :class="{ 'login-sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <br>
        </v-col>
        <v-col class="login-sign-in-form__btn-container">
          <v-btn
            class="login-sign-in-form__btn"
            color="accent"
            :disabled="login.length < 1"
            :loading="loginProcessing"
            dark
            height="40"
            @click="provideLoginPassword()"
          >
            {{ $t('button.Apply') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { contacts, errors } from '@/mixins'

export default {
  mixins: [contacts, errors],
  data() {
    return {
      show: false,
      login: '',
      loginRules: [
        (v) => !!v || this.$i18n.t('login.Login required'),
      ],
      password: '',
      loginProcessing: false,
      loginErrorMessages: null,
      passwordErrorMessages: null,
    }
  },
  methods: {
    ...mapActions('snackbar', { snackbarShow: 'show' }),
    async provideLoginPassword() {
      if (this.loginProcessing || this.login.length < 1) {
        return
      }
      this.loginErrorMessages = null
      this.passwordErrorMessages = null
      if (this.$refs['login-sign-in-form'].validate()) {
        this.loginProcessing = true
        try {
          const { identifier } = this.$store.state
          const token = await this.$store.dispatch('account/requestLogin', {
            login: this.login,
            password: this.password,
            type: 'web',
            identifier,
          })
          await this.$store.dispatch('account/storeToken', token)
          await this.$router.push({ name: 'Home' })
          await this.$_contacts_getContacts()
        } catch (e) {
          this.loginErrorMessages = this.$_errors_parse(e)
        } finally {
          this.loginProcessing = false
        }
      }
    },
  },
  watch: {
    login() {
      this.loginErrorMessages = null
    },
    password() {
      this.passwordErrorMessages = null
    },
  },
}
</script>

<style scoped lang="scss">
.login-sign-in-form__title {
  @apply text-sm font-medium;
}

.login-sign-in-form__btn {
  min-width: 160px #{ !important };

  @apply shadow-none;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: rgba(0, 0, 0, 0.12) !important;

  @apply text-white #{!important};
}

.login-sign-in-form__input {
  min-width: 250px #{ !important };
}

.login-sign-in-form__msg {
  min-width: 160px;

  @apply text-gray-400 text-sm block;
}

.login-sign-in-form__btn-container {
  @apply flex-grow-0 right-0;
}

.login-sign-in-form__content--mobile {
  @apply flex-col;

  .login-sign-in-form__btn-container {
    @apply pt-0 #{!important};
  }

  .login-sign-in-form__btn {
    @apply min-w-full #{!important};
  }
}
</style>
