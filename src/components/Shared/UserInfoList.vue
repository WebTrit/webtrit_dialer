<template>
  <v-simple-table class="user-info-list">
    <template
      #default
    >
      <thead />
      <tbody>
        <tr class="user-info__row">
          <td class="user-info__row-title py-4">
            {{ $t('user.status') }}:
          </td>
          <td class="user-info__row-content--status py-4 secondary--text">
            <Tooltip
              :text="$t(`status.registration.${registrationStatus}`)"
              :disable-tooltips="disableTooltips"
              :activator-width-limit="activatorWidthLimit"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title pb-1">
            {{ $t('user.extension') }}:
          </td>
          <td class="user-info__row-content pb-1 font-bold secondary--text">
            <Tooltip
              :text="info.number_ext || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.number') }}:
          </td>
          <td class="user-info__row-content font-bold secondary--text">
            <Tooltip
              :text="info.number || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr
          class="user-info__row"
          v-if="balance?.sum !== balanceHidden"
        >
          <td class="user-info__row-title pt-4">
            {{ $t('user.balance') }}:
          </td>
          <td class="user-info__row-content--blue pt-4 secondary--text">
            <Tooltip
              :text="balance.sum"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { mapGetters } from 'vuex'
import Tooltip from '@/components/Shared/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
    disableTooltips: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activatorWidthLimit: 90,
      balanceHidden: '-',
    }
  },
  computed: {
    ...mapGetters('account', ['balance']),
    ...mapGetters('webrtc', ['registrationStatus']),
  },
}
</script>

<style lang="scss" scoped>
.user-info-list {
  ::v-deep .registration-switch {
    @apply flex-wrap;

    > span {
      @apply w-full pl-1;
    }

    > div {
      @apply mt-3 ml-0;
    }
  }
}

.user-info__row {
  &:hover {
    @apply bg-transparent #{!important};
  }

  > * {
    height: 0.875rem !important;

    @apply border-0 #{!important};
  }
}

.user-info__row:not(:first-child) {
  > td:not(:first-child) {
    max-width: 103px;

    @apply truncate;
  }
}

.user-info__row-title {
  width: 62px;

  @apply text-light-grey opacity-70;
  @apply px-0 text-xs #{!important};
}

.user-info__row-content--status {
  max-width: 90px;

  @apply user-info__row-content;
  @apply truncate;

  ::v-deep .tooltip-activator {
    @apply font-bold;
  }
}

.user-info__row-content {
  @apply pr-0 pl-1.5 text-xs #{!important};
}

.user-info__row-content--blue {
  @apply user-info__row-content;
  @apply font-bold;
}
</style>
