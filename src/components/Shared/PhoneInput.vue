<template>
  <v-text-field
    :label="$t('modal.phone')"
    color="secondary"
    v-model="phoneNumber"
    autocomplete="off"
    autofocus
    :error-messages="phoneNumberErrorMessages"
    type="text"
    :maxlength="phoneNumberMaxLength"
    :counter="phoneNumberMaxLength"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    number: {
      type: String,
      default: '',
    },
    phoneNumberErrorMessages: {
      type: String,
      default: null,
    },
    phoneNumberMaxLength: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('settings', [
      'isNumbersNormalizationEnabled',
    ]),
    phoneNumber: {
      get() {
        return this.number
      },
      set(number) {
        const normalizedNumber = this.isNumbersNormalizationEnabled ? this.normalizePhoneNumber(number) : number
        this.$emit('update-phone-number', normalizedNumber)
      },
    },
  },
  methods: {
    normalizePhoneNumber(number) {
      return number.replace(/(?!^\+)[^a-zA-Z0-9]/g, '').trim()
    },
  },
}
</script>
