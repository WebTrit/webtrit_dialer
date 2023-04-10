<template>
  <v-app>
    <AppBar
      v-if="$_breakpoints_mobile"
      @toggle-side-navigation="toggleSideNavigation()"
      @open-user-info="openUserNavigation()"
    />
    <SideNavigation
      :open="sideNavigationVisible"
      @close-sidebar="closeSideNavigation()"
    />
    <UserInfoNavigation
      :open="userNavigationVisible"
      @close-user-navigation="closeUserNavigation()"
    />
    <DialogNumber />

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="snackbarShowing"
      :timeout="snackbarTimeout"
    >
      {{ snackbarMessage }}
    </v-snackbar>

    <DialogCall />

    <v-overlay
      :value="sessionError"
    >
      <div
        class="d-flex flex-column align-center"
      >
        <p
          class="text-h5"
        >
          {{ sessionError }}
        </p>
        <v-btn
          color="error"
          @click="documentReload()"
        >
          <v-icon left>
            $refresh
          </v-icon>
          Reload
        </v-btn>
      </div>
    </v-overlay>
  </v-app>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex'
import { janusRegistration, breakpoints, contacts } from '@/mixins'
import DialogCall from '@/components/Main/DialogCall/DialogCall.vue'
import SideNavigation from '@/components/Main/SideNavigation/SideNavigation.vue'
import AppBar from '@/components/Main/AppBar.vue'
import UserInfoNavigation from '@/components/Main/UserInfo/UserInfoNavigation.vue'
import DialogNumber from '@/components/Home-Contacts/DialogNumber.vue'

export default {
  name: 'App',

  components: {
    DialogCall,
    SideNavigation,
    AppBar,
    UserInfoNavigation,
    DialogNumber,
  },
  mixins: [janusRegistration, breakpoints, contacts],
  data() {
    return {
      sideNavigationVisible: false,
      userNavigationVisible: false,
    }
  },
  computed: {
    ...mapState('snackbar', {
      snackbarVisible: 'visible',
      snackbarMessage: 'message',
      snackbarTimeout: 'timeout',
    }),
    ...mapGetters('account', [
      'isLogin',
      'info',
    ]),
    ...mapState('webrtc', ['sessionError']),
    ...mapGetters('webrtc', ['isRegistered']),
    snackbarShowing: {
      get() {
        return this.snackbarVisible
      },
      set(value) {
        if (!value) {
          this.snackbarHide()
        }
      },
    },
  },

  created() {
    this.setLanguage()
    this.watchConnection()
  },

  async mounted() {
    this.isLogin && await this.$_contacts_getContacts()
  },

  methods: {
    ...mapMutations('webrtc', ['setRegistrationStatus']),
    ...mapActions('account', ['getInfo']),
    ...mapActions('webrtc', ['connect', 'disconnect', 'register', 'unregister']),
    ...mapActions('snackbar', {
      snackbarHide: 'hide',
      snackbarShow: 'show',
    }),
    documentReload() {
      document.location.reload()
    },
    toggleSideNavigation() {
      this.sideNavigationVisible = !this.sideNavigationVisible
    },
    closeSideNavigation() {
      this.sideNavigationVisible = false
    },
    openUserNavigation() {
      this.userNavigationVisible = true
    },
    closeUserNavigation() {
      this.userNavigationVisible = false
    },
    setLanguage() {
      const defaultLang = String(navigator.language).substring(0, 2)
      const supportedLangs = ['en', 'it']
      const selectedLang = supportedLangs.includes(defaultLang) ? defaultLang : this.$i18n.fallbackLocale
      this.$root.$i18n.locale = selectedLang
      this.$vuetify.lang.current = selectedLang
      document.documentElement.setAttribute('lang', selectedLang)
    },
    watchConnection() {
      window.addEventListener('offline', () => { this.closeConnection() })
      window.addEventListener('online', () => { this.restartConnection() })
    },
    closeConnection() {
      if (this.isLogin) {
        this.setRegistrationStatus('unregistered')
        this.disconnect()
        this.snackbarShow({ message: this.$t('connection.lost') })
      }
    },
    restartConnection() {
      if (this.isLogin) {
        this.connect()
        this.snackbarShow({ message: this.$t('connection.restored') })
      }
    },
  },

  watch: {
    $route: [
      {
        async handler() {
          if (this.isLogin && !this.info) {
            try {
              await this.getInfo()
              await this.connect()
            } catch (error) {
              console.error('Connection error:', error)
            }
          }
        },
        immediate: true,
      },
    ],
    async $_janusRegistration_registerEnabled(value) {
      if (value) {
        await this.register()
      } else {
        await this.unregister()
      }
    },
    $_breakpoints_mobile: {
      handler(val) {
        this.sideNavigationVisible = !val
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss">
  html {
    @apply overflow-y-scroll;
  }

  .v-overlay {
    @apply z-30 #{!important};
  }

  .v-main__wrap {
    @apply bg-grey;
  }

  .v-toolbar__title a {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  .v-badge--inline.ml-0 .v-badge__wrapper {
    margin-left: 0;
  }

  .absolute {
    position: absolute;
  }

  .v-dialog {
    @apply rounded-xl bg-white;
  }

  @media screen and (max-width: 600px) {
    .v-dialog {
      @apply w-full max-w-full h-full max-h-full m-0 rounded-none #{!important};
    }
  }
</style>
