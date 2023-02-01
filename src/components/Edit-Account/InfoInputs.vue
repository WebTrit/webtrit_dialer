<template>
  <v-form
    class="px-0 pt-6 pb-0"
    ref="edit-form"
    @submit.prevent
  >
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.First Name') }}:</span>
        <span class="user-account__info-content"> {{ userData.firstname || "'" }} </span>
      </v-col>
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Last Name') }}:</span>
        <span class="user-account__info-content"> {{ userData.lastname || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Email') }}:</span>
        <span class="user-account__info-content"> {{ userData.email || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Mobile') }}:</span>
        <span class="user-account__info-content"> {{ userData.mobile || "-" }} </span>
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__info">
        <span class="user-account__info-title">{{ $t('user.Company') }}:</span>
        <span class="user-account__info-content"> {{ userData.company_name || "-" }} </span>
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
    serverErrors: {
      type: Object,
      default: null,
    },
  },
  computed: {
    userData: {
      get() {
        return this.user
      },
    },
  },
  watch: {
    user: {
      deep: true,
      handler() {
        if (this.$refs['edit-form'].validate()) {
          this.$emit('form-valid', true)
        } else {
          this.$emit('form-valid', false)
        }
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
