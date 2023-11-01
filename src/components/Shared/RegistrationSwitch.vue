<template>
  <div class="registration-switch">
    <span :class="{ 'text-green': isRegistered }">
      {{ userOnline }}
    </span>
    <v-switch
      v-model="$_janusRegistration_registerEnabled"
      :color="isRegistered? 'green' : 'white'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { janusRegistration } from '@/mixins'

export default {
  mixins: [janusRegistration],
  computed: {
    ...mapGetters('webrtc', ['isRegistered']),
    userOnline() {
      return this.isRegistered
        ? this.$t('label.online')
        : this.$t('label.offline')
    },
  },
}
</script>

<style scoped lang="scss">
  .registration-switch {
    @apply text-xs flex justify-start items-center;
  }

  .v-input--selection-controls {
    @apply mt-0 pl-1;

    ::v-deep .v-input--switch__track {
      @apply text-grey #{!important};
    }

    ::v-deep .v-messages {
      @apply hidden;
    }

    ::v-deep .v-input__slot {
      @apply mb-0;
    }

    @apply pt-0 ml-3;
  }
</style>
