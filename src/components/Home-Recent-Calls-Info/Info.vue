<template>
  <PanelBlueContainer v-if="!$_breakpoints_mobile">
    <template #component>
      <v-container>
        <v-row>
          <PanelAppBar
            :title="$t('menu.Info')"
          >
            <template #close>
              <v-icon
                class="cursor-pointer"
                color="secondary"
                @click.native="close()"
              >
                $close
              </v-icon>
            </template>
          </PanelAppBar>
          <v-row
            class="w-full"
            v-show="!loading"
          >
            <CallDetails
              v-if="call"
              @loading="updateLoading($event)"
              :call="call"
            />
            <v-col v-else>
              <p class="text-red-500">
                {{ $t('errors.contact_not_found') }}
              </p>
            </v-col>
          </v-row>
          <v-progress-linear
            v-show="loading"
            indeterminate
            color="primary"
          />
        </v-row>
        <v-row
          class="mt-5"
          v-if="call && call.call_recording_exist"
        >
          <PanelAppBar
            :title="$t('menu.Call Record')"
          />
          <v-row>
            <CallRecord
              v-if="call"
              v-show="!loading"
              :call="call"
            />
            <v-col v-else>
              <p class="text-red-500">
                {{ $t('errors.record_not_found') }}
              </p>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </template>
  </PanelBlueContainer>

  <v-dialog
    v-else
    persistent
    v-model="dialog"
    max-width="320"
  >
    <PanelAppBar
      class="contact__dialog-appbar"
      :title="$t('menu.Info')"
    >
      <template #close>
        <v-icon
          class="cursor-pointer"
          color="secondary"
          @click.native="close()"
        >
          $close
        </v-icon>
      </template>
    </PanelAppBar>
    <v-row
      class="contact__dialog"
      v-show="!loading"
    >
      <CallDetails
        v-if="call"
        @loading="updateLoading($event)"
        :call="call"
      />
      <v-col v-else>
        <p class="text-red-500">
          {{ $t('errors.contact_not_found') }}
        </p>
      </v-col>
    </v-row>
    <PanelAppBar
      class="contact__dialog-appbar"
      :title="$t('menu.Call Record')"
      v-if="call && call.call_recording_exist"
    />
    <v-row
      class="contact__dialog"
      v-show="!loading"
      v-if="call && call.call_recording_exist"
    >
      <CallRecord
        v-if="call"
        class="contact__record"
        :call="call"
      />
      <v-col v-else>
        <p class="text-red-500">
          {{ $t('errors.record_not_found') }}
        </p>
      </v-col>
    </v-row>
    <v-row
      class="contact__progress"
      v-if="loading"
    >
      <v-progress-linear
        indeterminate
        color="primary"
      />
    </v-row>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints } from '@/mixins'
import CallRecord from '@/components/Home-Recent-Calls-Info/CallRecord.vue'
import PanelBlueContainer from '@/components/Layout/PanelBlueContainer.vue'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import CallDetails from '@/components/Home-Recent-Calls-Info/CallDetails.vue'

export default {
  components: {
    CallDetails,
    CallRecord,
    PanelBlueContainer,
    PanelAppBar,
  },
  mixins: [breakpoints],
  data: () => ({
    loading: false,
    dialog: true,
    call: null,
  }),
  computed: {
    ...mapGetters('callHistory', {
      callHistoryItems: 'items',
    }),
  },
  methods: {
    close() {
      this.$router.push({ name: 'Home' })
    },
    updateLoading(state) {
      this.loading = state
    },
    fetchCallDetails() {
      const { number: callId } = this.$route.params
      this.call = this.findCallInHistoryItems(callId)
    },
    findCallInHistoryItems(callId) {
      const call = this.callHistoryItems.filter((item) => item.id === +callId)
      return call.length > 0 ? call[0] : null
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.fetchCallDetails()
      },
    },
  },
}
</script>

<style scoped lang="scss">
.contact__dialog {
  @apply m-0;

  ::v-deep > .col {
    @apply p-0;
  }

  ::v-deep .user-info {
    @apply rounded-none;
  }
}

.contact__dialog-appbar {
  @apply p-3 bg-white mb-0 #{!important};
}

.contact__progress {
  min-height: 100px;

  @apply bg-white m-0;
}

.contact__record {
  ::v-deep .call-record {
    @apply rounded-none;
  }
}
</style>
