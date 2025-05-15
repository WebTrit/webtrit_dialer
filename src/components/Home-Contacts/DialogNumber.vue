<template>
  <v-dialog
    v-model="dialogNumberVisibility"
    persistent
    max-width="500px"
  >
    <v-container
      class="dialog-number"
      v-if="info"
    >
      <v-row>
        <v-col class="dialog-number__close">
          <v-icon
            class="cursor-pointer"
            color="secondary"
            @click.native="closeDialog()"
          >
            $close
          </v-icon>
        </v-col>
      </v-row>
      <v-container class="dialog-number__content">
        <v-row v-if="$vuetify.breakpoint.xs && balance?.sum !== '-'">
          <v-col class="dialog-number__balance">
            <span> {{ $t('modal.balance') }}: </span>
            <span class="secondary--text font-bold pl-3"> {{ balance.sum }} </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col :class="{'flex justify-center': $vuetify.breakpoint.xs }">
            <PhoneInput
              class="dialog-number__input"
              :number="phoneNumber"
              :phone-number-error-messages="phoneNumberErrorMessages"
              :phone-number-max-length="phoneNumberMaxLength"
              @update-phone-number="phoneNumber = $event"
            />
          </v-col>
          <v-col
            class="dialog-number__btns"
            v-if="!$vuetify.breakpoint.xs"
          >
            <ActionBtns
              :tel="phoneNumber"
              @phone-error="showError($event)"
            />
          </v-col>
        </v-row>
        <v-row class="dialog-number__keypad">
          <Keypad @keypad-click="keypadClick($event)" />
        </v-row>
        <v-row v-if="!$vuetify.breakpoint.xs && balance?.sum !== '-'">
          <v-col class="dialog-number__balance my-9">
            <span> {{ $t('modal.balance') }}: </span>
            <span class="secondary--text font-bold pl-3"> {{ balance.sum }} </span>
          </v-col>
        </v-row>
        <v-row
          justify="center"
          v-if="$vuetify.breakpoint.xs"
        >
          <v-col
            class="dialog-number__btns mt-9"
          >
            <ActionBtns
              :size="56"
              :tel="phoneNumber"
              @phone-error="showError($event)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import ActionBtns from '@/components/Home-Contacts/ActionBtns.vue'
import Keypad from '@/components/Shared/Keypad.vue'
import PhoneInput from '@/components/Shared/PhoneInput.vue'

export default {
  components: {
    ActionBtns,
    Keypad,
    PhoneInput,
  },
  data() {
    return {
      phoneNumber: '',
      phoneNumberErrorMessages: null,
    }
  },
  computed: {
    ...mapGetters('account', ['info', 'balance']),
    dialogNumberVisibility() {
      return this.$store.state.dialogNumberVisibility
    },
    phoneNumberMaxLength() {
      return 64
    },
  },
  methods: {
    closeDialog() {
      this.phoneNumber = ''
      this.$store.commit('toggleDialogNumberVisibility', false)
    },
    keypadClick(key) {
      if (this.phoneNumber.length < this.phoneNumberMaxLength) {
        this.phoneNumber += key
      }
    },
    showError(error) {
      this.phoneNumberErrorMessages = error
    },
  },
  watch: {
    phoneNumber() {
      this.phoneNumberErrorMessages = null
    },
  },
}
</script>

<style scoped lang="scss">
.dialog-number {
  @apply bg-white h-full overflow-y-auto;
}

.dialog-number__input {
  max-width: 300px;

  @apply mt-4;
}

.dialog-number__close {
  @apply flex justify-end;
}

.dialog-number__btns {
  @apply flex items-center max-w-max;
}

.dialog-number__balance {
  @apply flex justify-center;
}

.dialog-number__content {
  max-width: 380px;
}

.dialog-number__keypad {
  @apply flex justify-center;
}
</style>
