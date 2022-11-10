<template>
  <v-container
    class="main-container"
    fluid
  >
    <v-row
      class="container__row"
    >
      <slot name="component" />
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
$margin: 1rem;

.main-container {
  margin: $margin;
  width: calc(100% - #{$margin} * 2);
  height: calc(100% - #{$margin} * 2);

  @apply p-0;
}

.container--mobile {
  @apply m-0 rounded-none w-full h-full #{!important};
}

.container--tablet {
  .container__col {
    @apply flex-auto;

    + .container__col {
      @apply ml-0 mt-4;
    }
  }
}

.container__row {
  @apply h-full m-0;
}

.container__col {
  @apply bg-white rounded-lg flex flex-row overflow-hidden;

  + .container__col {
    @apply ml-4;
  }
}

.container__inner-col {
  @apply w-6/12;
}
</style>
