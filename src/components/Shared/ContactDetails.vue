<template>
  <v-col>
    <v-card
      class="user-info"
      elevation="0"
    >
      <v-row class="user-info__title">
        <v-col>
          <AvatarBadge
            :initials="contact.initials"
            :email="contact.email"
            :status="sipStatusColor(contact.sip_status)"
            :size="64"
          />
        </v-col>
        <v-col class="user-info__name-col">
          <p class="user-info__name">
            {{ contact.name }}
          </p>
        </v-col>
        <v-col>
          <FavoriteIcon
            v-if="contact && contact.number"
            :contact-number="contact.number"
          />
        </v-col>
      </v-row>
      <v-card-actions class="user-info-btns">
        <AudioCallBtn :contact="contact" />
        <VideoCallBtn :contact="contact" />
      </v-card-actions>
      <v-card-text>
        <ContactDetailsList
          v-if="contact"
          :contact="contact"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import AvatarBadge from '@/components/Shared/AvatarBadge.vue'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'
import VideoCallBtn from '@/components/Shared/VideoCallBtn.vue'
import ContactDetailsList from '@/components/Shared/ContactDetailsList.vue'
import FavoriteIcon from '@/components/Shared/FavoriteIcon.vue'

export default {
  components: {
    AvatarBadge,
    AudioCallBtn,
    VideoCallBtn,
    ContactDetailsList,
    FavoriteIcon,
  },
  props: {
    contact: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    sipStatusColor(sipStatus) {
      return sipStatus === 1 ? 'green' : 'grey'
    },
  },
}
</script>

<style scoped lang="scss">
.user-info {
  ::v-deep .user-info__row-content {
    max-width: 200px;

    @apply pl-5 truncate #{!important};
  }
}

.user-info__title {
  @apply m-0 p-4 #{!important};

  > * {
    @apply p-0 flex-grow-0 flex items-center;
  }
}

.user-info__name-col {
  flex-basis: calc(100% - 100px);
}

.user-info__name {
  @apply text-base font-bold m-0 px-4;
}

.user-info-btns {
  @apply flex flex-row justify-start items-center;

  > * {
    &:first-child {
      margin-left: calc(64px + 1rem);
    }
  }
}
</style>
