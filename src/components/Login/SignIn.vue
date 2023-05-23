<template>
  <v-container class="p-0">
    <v-form
      ref="sign-in-form"
      @submit.prevent
    >
      <p
        class="sign-in-form__title mt-9 text-gray-600"
        v-html="$t('login.If exist account')"
      />
      <v-row :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="sign-in-form__input"
            v-model="phoneNumber"
            color="secondary"
            :rules="phoneRules"
            :label="$t('label.Phone')"
            :error-messages="phoneNumberErrorMessages"
            outlined
            dense
            required
            @keyup.enter="providePhoneNumber()"
          />
        </v-col>
        <v-col class="sign-in-form__btn-container">
          <v-btn
            v-if="!otpId"
            class="sign-in-form__btn"
            color="accent"
            :disabled="phoneNumberProcessing || phoneNumber.length < 1"
            :loading="phoneNumberProcessing"
            dark
            height="40"
            @click="providePhoneNumber()"
          >
            {{ $t('button.Proceed') }}
          </v-btn>
          <span
            v-else
            class="sign-in-form__msg"
          > {{ $t('login.Verification message by number') }} </span>
        </v-col>
      </v-row>
      <v-row
        v-if="demoEnabled"
        :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p
            class="sign-in-form__msg"
            v-html="$t('login.OTP will be sent sign in')"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-form
      v-if="otpId"
      ref="verification-form"
      @submit.prevent
    >
      <p class="sign-in-form__title mt-3">
        {{ $t('login.Verification') }}
      </p>
      <v-row :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="sign-in-form__input"
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
        <v-col class="sign-in-form__btn-container">
          <v-btn
            class="sign-in-form__btn"
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
        :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p class="sign-in-form__msg">
            {{ $t('login.Check spam or') }} <span
              class="sign-in-form__resend"
              :class="[ $vuetify.breakpoint.xs ? 'sign-in-form__resend--mobile' : 'sign-in-form__resend']"
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
  data() {
    return {
      phoneNumber: '',
      phoneRules: [
        (v) => !!v || this.$i18n.t('login.Phone required'),
      ],
      otp: '',
      otpId: '',
      otpRules: [
        (v) => !!v || this.$i18n.t('login.Verification required'),
      ],
      phoneNumberProcessing: false,
      otpProcessing: false,
      phoneNumberErrorMessages: null,
      otpErrorMessages: null,
    }
  },
  computed: {
    demoEnabled() {
      return this.$envConfig.isSignupEnabled
    },
  },
  methods: {
    ...mapActions('snackbar', { snackbarShow: 'show' }),
    async providePhoneNumber() {
      if (this.otpId || this.phoneNumberProcessing || this.phoneNumber.length < 1) {
        return
      }
      this.phoneNumberErrorMessages = null
      if (this.$refs['sign-in-form'].validate()) {
        this.phoneNumberProcessing = true
        try {
          const { identifier } = this.$store.state
          this.otpId = await this.$store.dispatch('account/requestOtp', {
            phone: this.phoneNumber,
            type: 'web',
            identifier,
          })
        } catch (e) {
          const code = this.$_errors_parse(e)
          this.phoneNumberErrorMessages = code
        } finally {
          this.phoneNumberProcessing = false
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
          const code = this.$_errors_parse(e)
          this.otpErrorMessages = code
        } finally {
          this.otpProcessing = false
        }
      }
    },
    async resendCode() {
      if (this.phoneNumber.length < 1) {
        return
      }
      this.phoneNumberErrorMessages = null
      if (this.$refs['sign-in-form'].validate()) {
        this.phoneNumberProcessing = true
        try {
          const { identifier } = this.$store.state
          this.otpId = await this.$store.dispatch('account/requestOtp', {
            phone: this.phoneNumber,
            type: 'web',
            identifier,
          })
          this.otp = ''
          await this.snackbarShow({ message: this.$t('login.New code') })
        } catch (e) {
          const code = this.$_errors_parse(e)
          this.phoneNumberErrorMessages = code
        } finally {
          this.phoneNumberProcessing = false
        }
      }
    },
  },
  watch: {
    phoneNumber() {
      this.phoneNumberErrorMessages = null
    },
    otp() {
      this.otpErrorMessages = null
    },
  },
}
</script>

<style scoped lang="scss">
.sign-in-form__title {
  @apply text-sm font-medium;
}

.sign-in-form__btn {
  min-width: 160px #{ !important };

  @apply shadow-none;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: rgba(0, 0, 0, 0.12) !important;

  @apply text-white #{!important};
}

.sign-in-form__input {
  min-width: 250px #{ !important };
}

.sign-in-form__msg {
  min-width: 160px;

  @apply text-gray-400 text-sm block;
}

.sign-in-form__resend {
  @apply m-0 text-gray-600 underline cursor-pointer inline;
}

.sign-in-form__resend--mobile {
  @apply sign-in-form__resend;
  @apply mt-3;
}

.sign-in-form__btn-container {
  @apply flex-grow-0;
}

.sign-in-form__content--mobile {
  @apply flex-col;

  .sign-in-form__btn-container {
    @apply pt-0 -mt-4 #{!important};
  }

  .sign-in-form__btn {
    @apply min-w-full #{!important};
  }
}
</style>
