<template>
  <div>
    <v-row class="user-account__info-row">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Extension') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ user.number_ext }} </span>
      </v-col>
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Number') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ user.number }} </span>
      </v-col>
    </v-row>
    <v-row
      class="user-account__info-row"
      v-if="balance"
    >
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Balance') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ balance.sum }} </span>
      </v-col>
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Balance type') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ balance.type }} </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('account', ['balance']),
  },
}
</script>

<style lang="scss" scoped>
  .user-account__info {
    flex: 0 0 0 !important;

    @apply flex flex-col;

    ~ .user-account__info {
      @apply ml-2;
    }
  }

  .user-account__info-title {
    @apply text-sm text-light-grey whitespace-nowrap;
  }

  .user-account__info-content {
    @apply text-sm font-bold whitespace-nowrap;
  }

  .user-account__info-row {
    @apply pb-3;
  }

  .user-account--mobile {
    .user-account__info-row {
      @apply flex flex-col pl-3;
    }

    .user-account__info {
      flex: 0 0 auto !important;

      @apply ml-0 pb-0 pt-2;
    }
  }
</style>
