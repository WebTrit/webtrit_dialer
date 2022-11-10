<template>
  <v-form
    class="px-0 pt-6 pb-0"
    ref="edit-form"
    @submit.prevent
  >
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__input">
        <v-text-field
          v-model="userData.firstname"
          :label="$t('user.First Name')"
          :rules="nameRules"
          color="secondary"
          counter="120"
          :error-messages="serverErrors && serverErrors.firstname"
          outlined
          dense
          @input="$emit('enableActionBtns');$emit('show-errors', null)"
        />
      </v-col>
      <v-col class="user-account__input pl-0">
        <v-text-field
          v-model="userData.lastname"
          :label="$t('user.Last Name')"
          :rules="nameRules"
          color="secondary"
          counter="120"
          :error-messages="serverErrors && serverErrors.lastname"
          outlined
          dense
          @input="$emit('enableActionBtns');$emit('show-errors', null)"
        />
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__input">
        <v-text-field
          v-model="userData.email"
          :label="$t('user.Email')"
          :rules="emailRules"
          color="secondary"
          counter="128"
          :error-messages="serverErrors && serverErrors.email"
          outlined
          dense
          @input="$emit('enableActionBtns');$emit('show-errors', null)"
        />
      </v-col>
      <v-col class="user-account__input pl-0">
        <v-text-field
          v-model="userData.mobile"
          :label="$t('user.Mobile')"
          :rules="telRules"
          color="secondary"
          counter="21"
          :error-messages="serverErrors && serverErrors.mobile"
          outlined
          dense
          @input="$emit('enableActionBtns');$emit('show-errors', null)"
        />
      </v-col>
    </v-row>
    <v-row :class="{ 'edit-user__row--mobile' : $vuetify.breakpoint.xs}">
      <v-col class="user-account__input">
        <v-text-field
          v-model="userData.company_name"
          :label="$t('user.Company')"
          :rules="companyRules"
          color="secondary"
          counter="100"
          :error-messages="serverErrors && serverErrors.company_name"
          outlined
          dense
          @input="$emit('enableActionBtns');$emit('show-errors', null)"
        />
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
      set(data) {
        this.$emit('updateUserData', data)
      },
    },
    emailRules() {
      return [
        (v) => {
          if (v) {
            const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (v.length > 128) {
              return this.$i18n.t('edit.Email Length')
            }
            return emailRegExp.test(v) || this.$i18n.t('edit.Email Invalid')
          } else {
            return true
          }
        },
      ]
    },
    companyRules() {
      return [
        (v) => {
          if (v) {
            return v.length <= 100 || this.$i18n.t('edit.Company Invalid')
          } else {
            return true
          }
        },
      ]
    },
    nameRules() {
      return [
        (v) => {
          if (v) {
            return v.length <= 120 || this.$i18n.t('edit.Name Invalid')
          } else {
            return true
          }
        },
      ]
    },
    telRules() {
      return [
        (v) => {
          if (v) {
            return v.length <= 21 || this.$i18n.t('edit.Tel Invalid')
          } else {
            return true
          }
        },
      ]
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
  .user-account__input {
    max-width: 50%;

    @apply pb-0;

    ::v-deep .v-label {
      @apply text-light-grey;
    }
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
