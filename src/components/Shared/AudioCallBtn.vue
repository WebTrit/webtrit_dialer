<template>
  <v-btn
    class="call-btn"
    :color="btnColor"
    :disabled="!isRegistered"
    fab
    dark
    :width="size"
    :height="size"
    @click.native.stop.prevent="callContact()"
  >
    <v-icon
      :color="iconColor"
      :small="size < 40"
    >
      $contacts-call-audio
    </v-icon>
  </v-btn>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    contact: {
      type: Object,
      default: null,
    },
    tel: {
      type: String,
      default: null,
    },
    btnColor: {
      type: String,
      default: 'accent',
    },
    iconColor: {
      type: String,
      default: 'white',
    },
    size: {
      type: Number,
      default: 40,
    },
  },
  computed: {
    ...mapGetters('webrtc', ['isRegistered']),
  },
  methods: {
    ...mapActions('webrtc', ['call']),
    callContact() {
      if (this.contact) {
        this.call({
          number: this.contact.number,
          name: this.contact.name,
          initials: this.contact.initials,
          video: false,
        })
      } else {
        this.callFromKeypad()
      }
    },
    callFromKeypad() {
      if (this.tel.length === 0) {
        return
      }
      this.call({
        number: this.tel,
        video: false,
      })
        .catch((e) => {
          const error = this.$t(`errors["${e.code}"]`)
          this.$emit('phone-error', error)
        })
    },
  },
}
</script>

<style scoped lang="scss">
.call-btn {
  @apply shadow-none rounded-lg;

  &.theme--dark.v-btn.v-btn--disabled {
    @apply bg-gray-300 #{!important};
  }

  &.theme--dark.v-btn.v-btn--disabled .v-icon {
    @apply text-white #{!important};
  }
}
</style>
