<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="text-gray-400 text-center">
          {{ title }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <img
        :src="require('@/assets/empty-content.svg')"
        alt="empty-content"
        class="m-auto"
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
