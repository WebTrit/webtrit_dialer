<template>
  <v-col class="container--blue">
    <slot name="component" />
  </v-col>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.container--blue {
  max-width: 345px;

  @apply bg-light-blue;
}
</style>
