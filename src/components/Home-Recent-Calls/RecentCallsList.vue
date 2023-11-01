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
          <v-col>
            <span class="container__item-name"> {{ getCallerName(scopedSlots.contact.contactInfo) }} </span>
          </v-col>
          <v-col>
            <span
              class="container__item-sub-name"
              v-if="scopedSlots.contact.duration > 0 && scopedSlots.contact.status === 'accepted'"
            >
              {{ $t('call.duration') }}: <span> {{ scopedSlots.contact.duration | formatPrettySeconds }} </span>
            </span>
            <span
              class="container__item-sub-name"
              v-else
            >
              {{ scopedSlots.contact | getDirectionTitle }}
            </span>
          </v-col>
        </v-row>
        <v-row class="container__inner-row">
          <span class="container__item-sub-name"> {{ getCallerNumber(scopedSlots.contact.contactInfo) }} </span>
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
            :disabled="!(isRegistered && (scopedSlots.contact.contactInfo.number.length > 0
              || scopedSlots.contact.contactInfo.number_ext.length > 0))"
            color="accent"
            small
            outlined
            @click.prevent="makeCall(scopedSlots.contact.contactInfo)"
          >
            {{ $t('button.call_back') }}
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
    makeCall(contactInfo) {
      this.call({
        number: contactInfo.number?.length > 0 ? contactInfo.number : contactInfo.number_ext,
        name: contactInfo.name,
        initials: contactInfo.initials,
        video: false,
      })
    },
    getCallerName(caller_contact) {
      if (caller_contact.name) return caller_contact.name
      return caller_contact.number
    },
    getCallerNumber(caller_contact) {
      if (caller_contact.number_ext) {
        if (caller_contact.number) return `${caller_contact.number} (ext: ${caller_contact.number_ext})`
        return `ext: ${caller_contact.number_ext}`
      }
      return caller_contact.number
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
