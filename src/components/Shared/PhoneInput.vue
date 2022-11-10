<template>
  <v-text-field
    :label="$t('modal.Phone')"
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
    phoneNumber: {
      get() {
        return this.number
      },
      set(number) {
        this.$emit('update-phone-number', number)
      },
    },
  },
}
</script>
