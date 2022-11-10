<template>
  <v-badge
    bottom
    dot
    bordered
    offset-x="20"
    offset-y="10"
    overlap
    :color="status"
  >
    <Avatar
      class="mr-2"
      :color="avatarColor"
      :size="size"
      :initials="initials"
      :email="email"
    />
  </v-badge>
</template>

<script>
import Avatar from '@/components/Shared/Avatar.vue'

export default {
  components: {
    Avatar,
  },
  props: {
    initials: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    avatarColor: {
      type: String,
      default: 'secondary',
    },
    size: {
      type: Number,
      default: 48,
    },
  },
}
</script>
