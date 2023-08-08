<template>
  <v-list
    class="user-info"
    v-if="info"
  >
    <v-list-item>
      <AvatarBadge
        :initials="info.initials"
        :email="info.email"
        :status="registrationStatusColor"
      />
    </v-list-item>
    <v-list-item
      v-if="balance.sum"
      class="user-info__balance"
      style="color: white !important"
    >
      {{ balance.sum || '' }}
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import AvatarBadge from '@/components/Shared/AvatarBadge.vue'

export default {
  components: {
    AvatarBadge,
  },
  computed: {
    ...mapGetters('account', ['info', 'balance']),
    ...mapGetters('webrtc', ['registrationStatusColor']),
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  @apply flex flex-col items-center;
}

.user-info__balance {
  margin-bottom: 30%;

  @apply flex flex-col items-center min-h-0;
  @apply text-xs font-bold #{!important};
}

.v-list-item {
  @apply text-center;
}

.user-info__switch {
  @apply ml-1;

  ::v-deep .v-input--switch__track {
    @apply text-white #{!important};
  }
}
</style>
