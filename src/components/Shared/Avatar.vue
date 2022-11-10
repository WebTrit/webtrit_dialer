<template>
  <v-avatar
    :color="color"
    :size="size"
  >
    <span class="white--text">
      {{ initials || '' }}
    </span>
    <v-gravatar
      v-if="email"
      :email="email"
      :size="size"
      :default-img="this.initials? 'blank' : 'mp'"
      class="absolute"
    />
  </v-avatar>
</template>

<script>
export default {
  props: {
    initials: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
}
</script>
