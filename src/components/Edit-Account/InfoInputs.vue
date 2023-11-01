<template>
  <v-form
    class="px-0 pt-6 pb-0"
    ref="edit-form"
    @submit.prevent
  >
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.first_name') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ userData.first_name || "-" }} </span>
      </v-col>
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.last_name') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ userData.last_name || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.email') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ userData.email || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.mobile') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ userData.mobile || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.company') }}:</span>
        <span class="user-account__info-content secondary--text"> {{ userData.company_name || "-" }} </span>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    userData: {
      get() {
        return this.user
      },
    },
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

  .edit-user__row--mobile {
    @apply flex flex-col m-0;

    .user-account__input {
      width: 100%;
      max-width: 450px;

      @apply pt-0 px-3 #{!important};
    }
  }
</style>
