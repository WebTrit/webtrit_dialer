<template>
  <PanelRowItemLink
    :items="items"
    :link-name="linkName"
    :class="[!$_breakpoints_mobile? 'recent-calls__list' : 'recent-calls__list--mobile']"
  >
    <template #component="scopedSlots">
      <v-col class="container__col-first">
        <v-icon
          :title="$options.filters.getDirectionTitle(scopedSlots.contact)"
          :color="$options.filters.getIconColor(scopedSlots.contact)"
        >
          {{ scopedSlots.contact | getDirectionIcon }}
        </v-icon>
      </v-col>

      <v-col class="container__col">
        <v-row class="container__inner-row">
          <span class="container__item-name"> {{ $_calls_getInterlocutor(scopedSlots.contact) }} </span>
        </v-row>
        <v-row class="container__inner-row">
          <span
            class="container__item-sub-name"
            v-if="$options.filters.formatPrettySeconds(scopedSlots.contact.duration)"
          > {{ $t('call.Duration') }}:
            <span>
              {{ scopedSlots.contact.duration | formatPrettySeconds }}
            </span>
          </span>
          <span
            v-else
            class="recent-calls__failed"
          >
            {{ getFailMessage(scopedSlots.contact) }}
          </span>
        </v-row>
      </v-col>

      <v-col class="recent-calls__col-last">
        <v-row class="container__inner-row">
          <span class="recent-calls__time">
            {{ scopedSlots.contact.connect_time | formatDate }}
            {{ scopedSlots.contact.connect_time | formatTime }}
          </span>
        </v-row>
        <v-row class="container__inner-row justify-end">
          <v-btn
            class="recent-calls-callback-btn elevation-0"
            :disabled="!isRegistered"
            color="accent"
            small
            outlined
            @click.prevent="makeCall(scopedSlots.contact.contactInfo)"
          >
            {{ $t('button.Call back') }}
          </v-btn>
        </v-row>
      </v-col>
    </template>
  </PanelRowItemLink>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { breakpoints, calls } from '@/mixins'
import PanelRowItemLink from '@/components/Layout/PanelRowItemLink.vue'

export default {
  components: {
    PanelRowItemLink,
  },
  mixins: [breakpoints, calls],
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    linkName: 'CallDetails',
  }),
  computed: {
    ...mapGetters('webrtc', ['isRegistered']),
  },
  methods: {
    ...mapActions('webrtc', ['call']),
    getFailMessage(item) {
      if (item.direction === 'incoming') {
        return item.failed ? 'You missed the call' : ''
      } else if (item.direction === 'outgoing') {
        return item.failed ? 'Your call wasn\'t answered' : ''
      } else {
        return 'The call didn\'t succeed'
      }
    },
    makeCall(contactInfo) {
      const { number, initials = '', name = '' } = contactInfo
      this.call({
        number,
        name,
        initials,
        video: false,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.recent-calls__row {
  &:first-child {
    > * {
      @apply pt-0;
    }
  }
}

.recent-calls__col-last {
  @apply max-w-max pr-2 py-2;
}

.recent-calls__time {
  @apply text-light-grey text-xs lowercase ml-auto mb-1 whitespace-nowrap;
}

.recent-calls__failed {
  @apply text-red-500 text-xs #{!important};
}

.recent-calls-callback-btn {
  height: 24px !important;
}
</style>
