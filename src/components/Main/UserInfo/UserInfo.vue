<template>
  <v-card
    class="user-info"
    elevation="0"
  >
    <router-link
      class="user-info__edit-icon"
      :to="{ name: 'EditUser' }"
    >
      <v-icon
        color="secondary"
        small
      >
        $edit
      </v-icon>
    </router-link>
    <v-card-text v-if="info">
      <v-row class="m-0">
        <v-col class="user-info__avatar">
          <AvatarBadge
            :initials="info.initials"
            :email="info.email"
            :status="registrationStatusColor"
          />
        </v-col>
        <v-col class="user-info__name secondary--text">
          <Tooltip
            :text="info.name"
            :activator-width-limit="activatorWidthLimit"
            :disable-tooltips="false"
            :bottom="true"
          />
        </v-col>
      </v-row>
      <UserInfoList :info="info" />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import AvatarBadge from '@/components/Shared/AvatarBadge.vue'
import UserInfoList from '@/components/Shared/UserInfoList.vue'
import Tooltip from '@/components/Shared/Tooltip.vue'

export default {
  components: {
    AvatarBadge,
    UserInfoList,
    Tooltip,
  },
  data() {
    return {
      activatorWidthLimit: 88,
    }
  },
  computed: {
    ...mapGetters('account', ['info']),
    ...mapGetters('webrtc', ['registrationStatusColor']),
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  min-width: 198px;

  @apply mx-4 my-2;
}

.user-info__edit-icon {
  @apply absolute top-1.5 right-1.5 cursor-pointer px-2 no-underline;
}

.user-info__avatar {
  max-width: 50%;

  @apply p-0 flex-grow-0;
}

.user-info__name {
  max-width: 88px;

  @apply text-xs font-bold p-0 truncate pt-4;
}
</style>
