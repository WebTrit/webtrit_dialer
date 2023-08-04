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
        :initials="user.initials"
        :email="user.email"
      />
    </v-row>
    <InfoList :user="user" />
    <InfoInputs :user="user" />
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
          :initials="user.initials"
          :email="user.email"
        />
      </v-col>
      <v-col class="flex-grow-0">
        <InfoList :user="user" />
      </v-col>
    </v-row>
    <InfoInputs :user="user" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints } from '@/mixins'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import Avatar from '@/components/Shared/Avatar.vue'
import InfoList from '@/components/Edit-Account/InfoList.vue'
import InfoInputs from '@/components/Edit-Account/InfoInputs.vue'

export default {
  components: {
    PanelAppBar,
    Avatar,
    InfoList,
    InfoInputs,
  },
  mixins: [breakpoints],
  data() {
    return {
      user: {
        number: '',
        number_ext: '',
        first_name: '',
        last_name: '',
        alias_name: '',
        email: '',
        mobile: '',
        company_name: '',
        initials: '',
      },
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
    prefillUserInfo() {
      this.user = {
        number: this.info.number || '-',
        number_ext: this.info.number_ext || '-',
        first_name: this.info.first_name || '-',
        last_name: this.info.last_name || '-',
        alias_name: this.info.alias_name || '-',
        email: this.info.email || '-',
        mobile: this.mobile || '-',
        company_name: this.info.company_name || '-',
        initials: this.info.initials,
      }
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
