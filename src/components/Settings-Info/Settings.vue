<template>
  <v-container
    class="settings"
    :class="{'settings--mobile': $_breakpoints_mobile}"
  >
    <v-row>
      <PanelAppBar
        :title="$t('menu.Settings')"
      />
    </v-row>
    <v-row>
      <v-col class="settings__title">
        {{ $t('settings.Notifications') }}:
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__checkbox">
        <v-checkbox
          v-model="notificationsEnabled"
          :label="$t('settings.Notification enable')"
          color="secondary"
          @change="actionBtnsDisabled = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__checkbox">
        <v-checkbox
          class="mt-0"
          v-model="soundEnabled"
          :label="$t('settings.Sound enable')"
          color="secondary"
          @change="actionBtnsDisabled = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__title pt-5">
        {{ $t('settings.Language') }}:
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__lang">
        <v-select
          v-model="selectedLang"
          color="secondary"
          :items="languages"
          item-text="lang"
          item-value="locale"
          item-color="secondary"
          return-object
          outlined
          dense
          @change="actionBtnsDisabled = false"
        />
      </v-col>
    </v-row>
    <v-row
      class="justify-end"
    >
      <v-col class="settings__btn">
        <v-btn
          outlined
          color="secondary"
          :disabled="actionBtnsDisabled"
          @click="cancel()"
        >
          {{ $t('button.Cancel') }}
        </v-btn>
      </v-col>
      <v-col class="settings__btn">
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
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import { breakpoints } from '@/mixins'

export default {
  components: {
    PanelAppBar,
  },
  mixins: [breakpoints],
  data() {
    return {
      notificationsEnabled: undefined,
      soundEnabled: undefined,
      actionBtnsDisabled: true,
      languages: [{ lang: `${this.$t('settings.languages.English')}`, locale: 'en' },
        { lang: `${this.$t('settings.languages.Italian')}`, locale: 'it' }],
      selectedLang: {},
    }
  },
  computed: {
    ...mapGetters('settings', [
      'isNotificationsEnabled',
      'isSoundEnabled',
    ]),
    currentLocale() {
      return this.$i18n.locale
    },
  },
  mounted() {
    this.applyLang()
  },
  methods: {
    ...mapActions('settings', [
      'setNotificationsEnabled',
      'setSoundEnabled',
    ]),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    apply() {
      this.setNotificationsEnabled(this.notificationsEnabled)
      this.setSoundEnabled(this.soundEnabled)
      this.$root.$i18n.locale = this.selectedLang.locale
      this.$vuetify.lang.current = this.selectedLang.locale
      this.applyLang()
      this.snackbarShow({ message: this.$t('settings.snackbar.applied') })
      this.actionBtnsDisabled = true
    },
    cancel() {
      this.notificationsEnabled = this.isNotificationsEnabled
      this.soundEnabled = this.isSoundEnabled
      this.applyLang()
      this.actionBtnsDisabled = true
    },
    applyLang() {
      switch (this.currentLocale) {
        case 'it':
          this.selectedLang = { lang: this.$t('settings.languages.Italian'), locale: 'it' }
          break
        case 'en':
          this.selectedLang = { lang: this.$t('settings.languages.English'), locale: 'en' }
          break
        default:
          this.selectedLang = { lang: this.$t('settings.languages.English'), locale: 'en' }
      }
    },
  },
  watch: {
    isNotificationsEnabled: {
      handler(val) {
        this.notificationsEnabled = val
      },
      immediate: true,
    },
    isSoundEnabled: {
      handler(val) {
        this.soundEnabled = val
      },
      immediate: true,
    },
  },
}
</script>

<style scoped lang="scss">
.settings--mobile {
  height: calc(100vh - 140px);

  @apply overflow-auto;
}

.settings__checkbox {
  @apply p-0;

  ::v-deep .v-label {
    @apply text-sm;
  }
}

.settings__title {
  @apply font-bold p-0;
}

.settings__btn {
  @apply flex-grow-0;

  > button {
    width: 100px;
  }

  ~ .settings__btn {
    @apply pl-0;
  }
}

.settings__lang {
  max-width: 250px;

  @apply px-0 pt-5;
}
</style>
