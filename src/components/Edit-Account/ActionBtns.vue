<template>
  <v-row
    class="justify-end"
    :class="{'px-3': $vuetify.breakpoint.xs}"
  >
    <v-col class="user-account__btn">
      <v-btn
        outlined
        color="secondary"
        :disabled="actionBtnsDisabled"
        @click="cancel()"
      >
        {{ $t('button.Cancel') }}
      </v-btn>
    </v-col>
    <v-col class="user-account__btn">
      <v-btn
        outlined
        color="secondary"
        :disabled="actionBtnsDisabled"
        @click="apply()"
      >
        {{ $t('button.Apply') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    actionBtnsDisabled: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    formValid: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapActions('account', ['editInfo']),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    cancel() {
      this.$emit('prefillInfo')
      this.$emit('disableActionBtns')
    },
    emptyPropsToNull() {
      const user = { ...this.user }
      Object.keys(user).map((key) => {
        if (user[key] !== null && user[key].length === 0) {
          user[key] = null
        }
        return user
      })
      return user
    },
    async apply() {
      if (!this.formValid) {
        this.snackbarShow({ message: this.$t('edit.Form Invalid') })
      } else {
        try {
          const user = this.emptyPropsToNull()
          await this.editInfo(user)
          this.snackbarShow({ message: this.$t('account.updated') })
          this.$emit('disableActionBtns')
        } catch (err) {
          if (err.response.status !== 422) {
            this.snackbarShow({ message: this.$t(`errors["${err.code}"]`) })
          } else {
            const codes = {}
            const error = err.response.data
            if (err.response.data.code === 'parameters_validate_issue') {
              error.refining.forEach((item) => {
                codes[item.path] = this.$t(`errors.parameters_validate_issue.${item.path}.${item.reason}`)
              })
              this.$emit('show-errors', codes)
            } else {
              this.snackbarShow({ message: this.$t(`errors["${err.code}"]`) })
            }
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .user-account__btn {
    @apply flex-grow-0;

    > button {
      width: 100px;
    }

    ~ .user-account__btn {
      @apply pl-0;
    }
  }
</style>
