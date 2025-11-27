<template>
  <v-container class="p-0">
    <v-form
      ref="sign-in-form"
      @submit.prevent
    >
      <p
        class="sign-in-form__title mt-9 text-gray-600"
        v-html="$t('login.if_exist_account')"
      />
      <v-row :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="sign-in-form__input"
            v-model="phoneNumber"
            v-model.trim="phoneNumber"
            color="secondary"
            :rules="phoneNumberRules"
            :label="$t('label.phone')"
            :error-messages="phoneNumberErrorMessages"
            ref="firstField"
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
            {{ $t('button.proceed') }}
          </v-btn>
          <span
            v-else
            class="sign-in-form__msg"
          > {{ $t('login.verification_message') }} </span>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p
            class="sign-in-form__msg"
            v-html="$t('login.otp_sent_sign_in')"
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
        {{ $t('login.verification') }}
      </p>
      <v-row :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }">
        <v-col>
          <v-text-field
            class="sign-in-form__input"
            v-model="otp"
            v-model.trim="otp"
            color="secondary"
            :rules="otpRules"
            :label="$t('label.verification')"
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
            {{ $t('button.verify') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        :class="{ 'sign-in-form__content--mobile' : $vuetify.breakpoint.xs }"
      >
        <v-col>
          <p class="sign-in-form__msg">
            {{ $t('login.check_spam_or', { from: deliveryFromString()}) }} <span
              class="sign-in-form__resend"
              :class="[ $vuetify.breakpoint.xs ? 'sign-in-form__resend--mobile' : 'sign-in-form__resend']"
              @click="resendCode()"
            >
              {{ $t('button.resend') }}
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
    autoSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      phoneNumber: '',
      otp: '',
      otpId: '',
      deliveryFrom: '',
      phoneNumberProcessing: false,
      otpProcessing: false,
      phoneNumberErrorMessages: null,
      otpErrorMessages: null,
    }
  },
  computed: {
    phoneNumberRules() {
      return [
        (v) => !!v || this.$i18n.t('login.phone_required'),
        (v) => /^\+?[a-zA-Z0-9@._-]{1,64}$/.test(v) || this.$i18n.t('login.from_to_contain', { field: this.$i18n.t('login.phone'), from: 1, to: 64 }),
      ]
    },
    otpRules() {
      return [
        (v) => !!v || this.$i18n.t('login.verification_required'),
      ]
    },
  },
  methods: {
    ...mapActions('snackbar', { snackbarShow: 'show' }),
    async executeRequest() {
      const { identifier } = this.$store.state
      const r = await this.$store.dispatch('account/requestOtpSignIn', {
        user_ref: this.phoneNumber,
        type: 'web',
        identifier,
      })
      this.otpId = r.otp_id
      this.deliveryFrom = r.delivery_from || ''
    },
    async providePhoneNumber() {
      if (this.otpId || this.phoneNumberProcessing || this.phoneNumber.length < 1) {
        return
      }
      this.phoneNumberErrorMessages = null
      if (this.$refs['sign-in-form'].validate()) {
        this.phoneNumberProcessing = true
        try {
          await this.executeRequest()
        } catch (e) {
          this.phoneNumberErrorMessages = this.$_errors_parse(e)
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
          const data = await this.$store.dispatch('account/requestOtpVerify', {
            otp_id: this.otpId,
            code: this.otp,
          })
          await this.$store.dispatch('account/storeAccessCredentials', data)
          await this.$router.push({ name: 'Home' })
          await this.$_contacts_getContacts()
          this.$store.dispatch(
            'settings/setNotificationsEnabled',
            this.$store.getters['settings/isNotificationsEnabled'],
          )
        } catch (e) {
          this.otpErrorMessages = this.$_errors_parse(e)
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
          await this.executeRequest()
          this.otp = ''
          await this.snackbarShow({ message: this.$t('login.new_code') })
        } catch (e) {
          this.phoneNumberErrorMessages = this.$_errors_parse(e)
        } finally {
          this.phoneNumberProcessing = false
        }
      }
    },
    deliveryFromString() {
      if (this.deliveryFrom.length === 0) return ''
      return [this.$i18n.t('login.from'), ' <', this.deliveryFrom, '>'].join('')
    },
    focusOnFirstInput() {
      this.$refs.firstField.$refs.input.focus()
    },
  },
  created() {
    const params = new URLSearchParams(document.location.search)
    const email = params.get('email')
    if (email) {
      this.phoneNumber = email
      if (this.autoSubmit) {
        this.$nextTick(this.providePhoneNumber)
      }
    }
  },
  mounted() {
    this.$nextTick(this.focusOnFirstInput)
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
