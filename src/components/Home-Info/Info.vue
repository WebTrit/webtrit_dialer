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
            <ContactDetails
              v-if="contactsItems"
              @loading="updateLoading($event)"
            />
          </v-row>
          <v-progress-linear
            v-show="loading"
            indeterminate
            color="primary"
          />
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
      <ContactDetails
        v-if="contactsItems"
        @loading="updateLoading($event)"
      />
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
import PanelBlueContainer from '@/components/Layout/PanelBlueContainer.vue'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import ContactDetails from '@/components/Home-Info/ContactDetails.vue'

export default {
  components: {
    ContactDetails,
    PanelBlueContainer,
    PanelAppBar,
  },
  mixins: [breakpoints],
  data: () => ({
    loading: false,
    dialog: true,
  }),
  computed: {
    ...mapGetters('contacts', {
      contactsItems: 'items',
    }),
  },
  methods: {
    close() {
      this.$router.push({ name: 'Home' })
    },
    updateLoading(state) {
      this.loading = state
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
</style>
