<template>
  <v-container class="p-0">
    <v-form
      ref="signup-form"
      @submit.prevent
    >
      <p
        class="signup-form__title mt-9 text-gray-600"
        v-html="$t('login.If no account')"
      />
      <v-row :class="{ 'signup-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="signup-form__input"
            v-model="email"
            color="secondary"
            :rules="emailRules"
            :label="$t('label.Email')"
            :error-messages="emailErrorMessages"
            outlined
            dense
            required
            @keyup.enter="provideEmail()"
          />
        </v-col>
        <v-col class="signup-form__btn-container">
          <v-btn
            v-if="!otpId"
            class="signup-form__btn"
            color="accent"
            :disabled="emailProcessing || email.length < 1"
            :loading="emailProcessing"
            dark
            height="40"
            @click="provideEmail()"
          >
            {{ $t('button.Proceed') }}
          </v-btn>
          <span
            v-else
            class="signup-form__msg"
          > {{ $t('login.Verification message by email') }} </span>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'signup-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p
            class="signup-form__msg"
            v-html="$t('login.OTP will be sent signup')"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-form
      v-if="otpId"
      ref="verification-form"
      @submit.prevent
    >
      <v-row :class="{ 'signup-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="signup-form__input"
            v-model="otp"
            color="secondary"
            :rules="otpRules"
            :label="$t('label.Verification')"
            :error-messages="otpErrorMessages"
            outlined
            dense
            required
            @keyup.enter="verifyReceivedOtp()"
          />
        </v-col>
        <v-col class="signup-form__btn-container">
          <v-btn
            class="signup-form__btn"
            color="accent"
            :disabled="otpProcessing || otp.length < 1"
            :loading="otpProcessing"
            dark
            height="40"
            @click="verifyReceivedOtp()"
          >
            {{ $t('button.Verify') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'signup-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p class="signup-form__msg">
            {{ $t('login.Check spam or') }} <span
              class="signup-form__resend"
              :class="[ $vuetify.breakpoint.xs ? 'signup-form__resend--mobile' : 'signup-form__resend']"
              @click="resendCode()"
            >
              {{ $t('button.Resend') }}
            </span>.
          </p>
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
  props: {
    signupEmail: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      email: this.signupEmail || '',
      emailProcessing: false,
      emailErrorMessages: null,
      otp: '',
      otpId: '',
      otpRules: [
        (v) => !!v || this.$i18n.t('login.Verification required'),
      ],
      otpProcessing: false,
      otpErrorMessages: null,
    }
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$i18n.t('login.Email required'),
        (v) => {
          if (v) {
            const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return emailRegExp.test(v) || this.$i18n.t('login.E-mail valid')
          } else {
            return true
          }
        },
      ]
    },
  },
  methods: {
    ...mapActions('snackbar', { snackbarShow: 'show' }),
    async provideEmail() {
      if (this.otpId || this.emailProcessing || this.email.length < 1) {
        return
      }
      this.emailErrorMessages = null
      if (this.$refs['signup-form'].validate()) {
        this.emailProcessing = true
        try {
          const { identifier } = this.$store.state
          this.otpId = await this.$store.dispatch('account/requestDemoOtp', {
            email: this.email,
            type: 'web',
            identifier,
          })
        } catch (e) {
          this.emailErrorMessages = this.$_errors_parse(e)
        } finally {
          this.emailProcessing = false
        }
      }
    },
    async verifyReceivedOtp() {
      if (this.otpProcessing || this.otp.length < 1) {
        return
      }
      this.otpErrorMessages = null
      if (this.$refs['verification-form'].validate()) {
        this.otpProcessing = true
        try {
          const token = await this.$store.dispatch('account/verifyOtp', {
            otp_id: this.otpId,
            code: this.otp,
          })
          await this.$store.dispatch('account/storeToken', token)
          await this.$router.push({ name: 'Home' })
          await this.$_contacts_getContacts()
        } catch (e) {
          this.otpErrorMessages = this.$_errors_parse(e)
        } finally {
          this.otpProcessing = false
        }
      }
    },
    async resendCode() {
      if (this.email.length < 1) {
        return
      }
      this.emailErrorMessages = null
      if (this.$refs['signup-form'].validate()) {
        this.emailProcessing = true
        try {
          const { identifier } = this.$store.state
          this.otpId = await this.$store.dispatch('account/requestDemoOtp', {
            email: this.email,
            type: 'web',
            identifier,
          })
          this.otp = ''
          await this.snackbarShow({ message: this.$t('login.New code') })
        } catch (e) {
          this.emailErrorMessages = this.$_errors_parse(e)
        } finally {
          this.emailProcessing = false
        }
      }
    },
  },
  watch: {
    email() {
      this.emailErrorMessages = null
    },
    otp() {
      this.otpErrorMessages = null
    },
  },
}
</script>

<style scoped lang="scss">
.signup-form__title {
  @apply text-sm font-medium;
}

.signup-form__btn {
  min-width: 160px #{ !important };

  @apply shadow-none;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: rgba(0, 0, 0, 0.12) !important;

  @apply text-white #{!important};
}

.signup-form__input {
  min-width: 250px #{ !important };
}

.signup-form__msg {
  min-width: 160px;

  @apply text-gray-500 text-sm block;
}

.signup-form__resend {
  @apply m-0 text-gray-600 underline cursor-pointer inline;
}

.signup-form__btn-container {
  @apply flex-grow-0;
}

.signup-form__content--mobile {
  @apply flex-col;

  .signup-form__btn-container {
    @apply pt-0 -mt-4 #{!important};
  }
}

.login__row--mobile {
  .signup-form__btn {
    @apply min-w-full #{!important};
  }
}
</style>
