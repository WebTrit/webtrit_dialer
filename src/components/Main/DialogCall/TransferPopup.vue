<template>
  <v-dialog
    v-model="show"
    width="860"
  >
    <v-container class="dialog-transfer__content">
      <v-row>
        <PhoneInput
          class="dialog-transfer__input"
          :number="phoneNumber"
          :phone-number-error-messages="phoneNumberErrorMessages"
          :phone-number-max-length="phoneNumberMaxLength"
          @update-phone-number="phoneNumber = $event"
          @keyup.native.enter="transferCall()"
        />
      </v-row>
      <v-row class="dialog-transfer__keypad">
        <Keypad @keypad-click="keypadClick($event)" />
      </v-row>
      <ActionBtns
        @close-transfer-popup="show = false"
        @transfer-call="transferCall()"
      />
    </v-container>
  </v-dialog>
</template>

<script>

import { mapActions } from 'vuex'
import Keypad from '@/components/Shared/Keypad.vue'
import PhoneInput from '@/components/Shared/PhoneInput.vue'
import ActionBtns from '@/components/Main/DialogCall/TransferActionBtns.vue'

export default {
  components: {
    Keypad,
    PhoneInput,
    ActionBtns,
  },
  props: {
    showTransfer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      phoneNumber: '',
      phoneNumberErrorMessages: null,
      holdActive: false,
    }
  },
  computed: {
    phoneNumberMaxLength() {
      return 64
    },
    show: {
      get() {
        return this.showTransfer
      },
      set() {
        this.$emit('hide-transfer-popup')
      },
    },
  },
  methods: {
    ...mapActions('webrtc', ['transfer', 'hold']),
    keypadClick(key) {
      if (this.phoneNumber.length < this.phoneNumberMaxLength) {
        this.phoneNumber += key
      }
    },
    transferCall() {
      if (this.phoneNumber.length === 0) {
        return
      }
      this.transfer(this.phoneNumber)
      this.$emit('hide-transfer-popup')
    },
  },
  watch: {
    showTransfer() {
      this.holdActive = !this.holdActive
      if (this.holdActive) {
        this.hold({ active: false })
      }
    },
  },
}
</script>

<style scoped lang="scss">
  .dialog-transfer {
    @apply h-full flex items-center;
  }

  .dialog-transfer__content {
    max-width: 380px;

    @apply mx-auto my-4;
  }

  .dialog-transfer__keypad {
    @apply flex justify-center;
  }

  .dialog-transfer__input {
    max-width: 300px;

    @apply mb-4 mt-10 mx-auto;
  }
</style>
