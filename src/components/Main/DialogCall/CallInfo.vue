<template>
  <v-row
    class="dialog-call__info"
    v-show="!remoteStreamHasVideo"
  >
    <v-col>
      <Avatar
        color="secondary"
        :size="160"
        :initials="initials"
        :email="email"
      />
    </v-col>
    <v-col class="dialog-call__name-col">
      <p
        class="dialog-call__name"
      >
        {{ name }}
      </p>
    </v-col>
    <v-col>
      <p class="dialog-call__state">
        {{ callState }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/Shared/Avatar.vue'

export default {
  components: {
    Avatar,
  },
  props: {
    initials: {
      type: String,
      default: '',
      required: true,
    },
    email: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    ...mapGetters('webrtc', [
      'remoteStreamHasVideo',
      'isCallInitiating',
      'isCallIncoming',
      'isCallOutgoing',
      'isCallAccepted',
      'isCallProgress',
    ]),
    callState() {
      if (this.isCallInitiating) {
        if (this.isCallIncoming) {
          return this.$t('modal.incoming')
        } else if (this.isCallOutgoing) {
          return this.$t('modal.calling')
        } else {
          return this.$t('modal.unknown')
        }
      } else if (this.isCallAccepted) {
        return this.$t('modal.accepted')
      } else if (this.isCallProgress) {
        return this.$t('modal.progress')
      } else {
        return this.$t('modal.hangup')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-call__info {
  @apply flex flex-col m-0 justify-center z-20;

  > .col {
    @apply p-0 flex justify-center flex-grow-0;
  }
}

.dialog-call__name-col {
  max-height: 84px;
  flex-basis: auto;

  /* autoprefixer: off */
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  -moz-line-clamp: 3;
  -ms-line-clamp: 3;
  -o-line-clamp: 3;

  @apply my-3 mx-0 overflow-hidden overflow-ellipsis;
}

.dialog-call__name {
  @apply text-lg font-bold m-0 px-5 text-center break-all;
}

.dialog-call__state {
  @apply text-sm text-blue;
}
</style>
