<template>
  <v-container
    class="settings"
    :class="{'settings--mobile': $_breakpoints_mobile}"
  >
    <v-row>
      <PanelAppBar
        :title="$t('menu.settings')"
      />
    </v-row>
    <v-row>
      <v-col class="settings__title">
        {{ $t('settings.notifications') }}:
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__checkbox">
        <v-checkbox
          v-model="notificationsEnabled"
          :label="$t('settings.notification_enable')"
          :disabled="!isNotificationsSupported"
          color="secondary"
          @change="actionBtnsDisabled = false"
        >
          <template v-if="isNotificationsDenied" #append>
            <v-icon
              color="red"
            >
              mdi-alert
            </v-icon>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__checkbox">
        <v-checkbox
          class="mt-0"
          v-model="soundEnabled"
          :label="$t('settings.sound_enable')"
          color="secondary"
          @change="actionBtnsDisabled = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__title">
        {{ $t('settings.calls') }}:
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__checkbox">
        <v-checkbox
          class="mt-0"
          v-model="numbersNormalizationEnabled"
          :label="$t('settings.calls.numbers_normalization_enable')"
          color="secondary"
          @change="actionBtnsDisabled = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="settings__title pt-5">
        {{ $t('settings.language') }}:
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
          {{ $t('button.cancel') }}
        </v-btn>
      </v-col>
      <v-col class="settings__btn">
        <v-btn
          outlined
          color="secondary"
          :disabled="actionBtnsDisabled"
          @click="apply()"
        >
          {{ $t('button.apply') }}
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
      numbersNormalizationEnabled: undefined,
      actionBtnsDisabled: true,
      languages: [
        { lang: `${this.$t('settings.languages.english')}`, locale: 'en' },
        { lang: `${this.$t('settings.languages.italian')}`, locale: 'it' },
        { lang: `${this.$t('settings.languages.spanish')}`, locale: 'es' },
        { lang: `${this.$t('settings.languages.russian')}`, locale: 'ru' },
        { lang: `${this.$t('settings.languages.ukrainian')}`, locale: 'ua' },
      ],
      selectedLang: {},
    }
  },
  computed: {
    ...mapGetters('settings', [
      'isNotificationsSupported',
      'isNotificationsDenied',
      'isNotificationsEnabled',
      'isSoundEnabled',
      'isNumbersNormalizationEnabled',
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
      'setNumbersNormalizationEnabled',
    ]),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    apply() {
      this.setNotificationsEnabled(this.notificationsEnabled)
      this.setSoundEnabled(this.soundEnabled)
      this.setNumbersNormalizationEnabled(this.numbersNormalizationEnabled)
      this.$root.$i18n.locale = this.selectedLang.locale
      this.$vuetify.lang.current = this.selectedLang.locale
      this.applyLang()
      this.snackbarShow({ message: this.$t('settings.snackbar.applied') })
      this.actionBtnsDisabled = true
    },
    cancel() {
      this.notificationsEnabled = this.isNotificationsEnabled
      this.soundEnabled = this.isSoundEnabled
      this.numbersNormalizationEnabled = this.isNumbersNormalizationEnabled
      this.applyLang()
      this.actionBtnsDisabled = true
    },
    applyLang() {
      switch (this.currentLocale) {
        case 'it':
          this.selectedLang = { lang: this.$t('settings.languages.italian'), locale: 'it' }
          break
        case 'en':
          this.selectedLang = { lang: this.$t('settings.languages.english'), locale: 'en' }
          break
        case 'es':
          this.selectedLang = { lang: this.$t('settings.languages.spanish'), locale: 'es' }
          break
        case 'ru':
          this.selectedLang = { lang: this.$t('settings.languages.russian'), locale: 'ru' }
          break
        case 'ua':
          this.selectedLang = { lang: this.$t('settings.languages.ukrainian'), locale: 'ua' }
          break
        default:
          this.selectedLang = { lang: this.$t('settings.languages.english'), locale: 'en' }
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
    isNumbersNormalizationEnabled: {
      handler(val) {
        this.numbersNormalizationEnabled = val
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
