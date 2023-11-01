<template>
  <div
    class="edit-user"
    v-if="!$_breakpoints_mobile"
  >
    <PanelAppBar
      :title="$t('menu.info')"
    />
    <v-row>
      <v-col class="text-sm text-light-grey">
        {{ $t('user.registration_status') }}:
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <RegistrationSwitch />
      </v-col>
    </v-row>
  </div>
  <div
    class="edit-user--mobile"
    v-else
  >
    <v-row class="edit-user__row">
      <v-col class="edit-user__col--title">
        {{ $t('user.registration_status') }}:
      </v-col>
      <v-col class="edit-user__col--content">
        <RegistrationSwitch class="edit-user__switch" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { breakpoints } from '@/mixins'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import RegistrationSwitch from '@/components/Shared/RegistrationSwitch.vue'

export default {
  components: {
    PanelAppBar,
    RegistrationSwitch,
  },
  mixins: [breakpoints],
}
</script>

<style scoped lang="scss">
  .edit-user {
    @apply m-0 p-0 w-full h-full;

    ::v-deep .panel__bar {
      height: 26px #{ !important };
    }
  }

  .edit-user--mobile {
    .edit-user__row {
      @apply mx-0 my-2;
    }

    .edit-user__col--title {
      @apply text-sm text-light-grey flex items-center flex-grow-0 whitespace-nowrap;
    }

    .edit-user__col--content {
      @apply flex-grow-0 whitespace-nowrap;
    }

    .edit-user__switch {
      margin-top: 3px;
    }
  }
</style>
