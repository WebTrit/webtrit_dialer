<template>
  <v-row class="transfer-btns">
    <v-btn
      color="blue-grey"
      dark
      @click.native="$emit('close-transfer-popup')"
    >
      {{ $t('button.Return') }}
    </v-btn>
    <v-btn
      color="success"
      @click.native="$emit('transfer-call')"
    >
      {{ $t('button.Transfer') }}
    </v-btn>
  </v-row>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
.transfer-btns {
  @apply justify-center my-6;

  button {
    min-width: 112px !important;

    @apply m-2;
  }
}
</style>
