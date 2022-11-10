<template>
  <div
    class="user-account"
    v-if="info && !$_breakpoints_mobile"
  >
    <PanelAppBar
      :title="$t('menu.Account')"
    />
    <v-row class="user-account__avatar">
      <Avatar
        color="secondary"
        :size="64"
        :initials="info.initials"
        :email="info.email"
      />
    </v-row>
    <InfoList :info="info" />
    <InfoInputs
      :user="user"
      :server-errors="serverErrors"
      @form-valid="updateFormValid($event)"
      @enableActionBtns="enableActionBtns()"
      @updateUserData="updateUserData($event)"
      @show-errors="setServerErrors($event)"
    />
    <ActionBtns
      :action-btns-disabled="actionBtnsDisabled"
      :user="user"
      :form-valid="formValid"
      @prefillInfo="prefillUserInfo()"
      @disableActionBtns="disableActionBtns()"
      @show-errors="setServerErrors($event)"
    />
  </div>
  <v-container
    class="user-account--mobile"
    v-else-if="info && $_breakpoints_mobile"
  >
    <v-row>
      <v-col class="user-account__avatar">
        <Avatar
          color="secondary"
          :size="64"
          :initials="info.initials"
          :email="info.email"
        />
      </v-col>
      <v-col class="flex-grow-0">
        <InfoList :info="info" />
      </v-col>
    </v-row>
    <InfoInputs
      :user="user"
      :server-errors="serverErrors"
      @form-valid="updateFormValid($event)"
      @updateUserData="updateUserData($event)"
      @enableActionBtns="enableActionBtns()"
      @show-errors="setServerErrors($event)"
    />
    <ActionBtns
      :action-btns-disabled="actionBtnsDisabled"
      :user="user"
      :form-valid="formValid"
      @prefillInfo="prefillUserInfo()"
      @disableActionBtns="disableActionBtns()"
      @show-errors="setServerErrors($event)"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints } from '@/mixins'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import ActionBtns from '@/components/Edit-Account/ActionBtns.vue'
import Avatar from '@/components/Shared/Avatar.vue'
import InfoList from '@/components/Edit-Account/InfoList.vue'
import InfoInputs from '@/components/Edit-Account/InfoInputs.vue'

export default {
  components: {
    PanelAppBar,
    Avatar,
    ActionBtns,
    InfoList,
    InfoInputs,
  },
  mixins: [breakpoints],
  data() {
    return {
      user: {
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        company_name: '',
      },
      actionBtnsDisabled: true,
      formValid: false,
      serverErrors: null,
    }
  },
  computed: {
    ...mapGetters('account', ['info']),
  },
  watch: {
    info: {
      handler(info) {
        if (info) {
          this.prefillUserInfo()
        }
      },
      immediate: true,
    },
  },
  methods: {
    enableActionBtns() {
      this.actionBtnsDisabled = false
    },
    disableActionBtns() {
      this.actionBtnsDisabled = true
    },
    prefillUserInfo() {
      const {
        firstname, lastname, mobile, email, company_name,
      } = this.info
      const user = {
        firstname,
        lastname,
        email,
        mobile,
        company_name,
      }
      this.user = user
    },
    updateUserData(data) {
      this.user = data
    },
    updateFormValid(validity) {
      this.formValid = validity
    },
    setServerErrors(errors) {
      this.serverErrors = errors
    },
  },
}
</script>

<style scoped lang="scss">
  .user-account {
    @apply m-0 p-0 w-full h-full;

    ::v-deep .panel__bar {
      height: 26px #{ !important };
    }
  }

  .user-account__avatar {
    @apply m-0 pb-2 flex-grow-0;

    ::v-deep .v-badge__badge {
      width: 24px;
      height: 24px;

      @apply flex justify-center items-center rounded-full;
    }
  }
</style>
