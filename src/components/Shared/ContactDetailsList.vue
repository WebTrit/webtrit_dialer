<template>
  <v-simple-table>
    <template #default>
      <thead />
      <tbody>
        <tr
          v-if="about"
          class="user-info__row"
        >
          <td class="user-info__row-title--blue secondary--text">
            {{ $t('user.about') }}
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.ext') }}:
          </td>
          <td class="user-info__row-content">
            <Tooltip
              :text="contact.number_ext || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.number') }}:
          </td>
          <td class="user-info__row-content">
            <Tooltip
              :text="contact.number || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.email') }}:
          </td>
          <td class="user-info__row-content">
            <Tooltip
              :text="contact.email || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.mobile') }}:
          </td>
          <td class="user-info__row-content">
            <Tooltip
              :text="contact.mobile || '-'"
              :activator-width-limit="activatorWidthLimit"
              :disable-tooltips="disableTooltips"
            />
          </td>
        </tr>
        <tr class="user-info__row">
          <td class="user-info__row-title">
            {{ $t('user.company') }}:
          </td>
          <td class="user-info__row-content">
            <Tooltip
              :text="contact.company_name || '-'"
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
import Tooltip from '@/components/Shared/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },
  props: {
    about: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: Object,
      default: () => {},
    },
    disableTooltips: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activatorWidthLimit: 140,
    }
  },
}
</script>

<style lang="scss" scoped>
.user-info__row {
  &:hover {
    @apply bg-transparent #{!important};
  }

  > * {
    height: 24px !important;

    @apply border-0 p-0 #{!important};
  }
}

.user-info__row-title {
  width: 30px !important;
  @apply text-sm text-light-grey;
}

.user-info__row-title--blue {
  @apply text-sm font-bold;
}

.user-info__row-content {
  @apply text-left pl-2 #{!important};
}
</style>
