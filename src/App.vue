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

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbarShowing = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <DialogCall />

    <v-overlay
      :value="sessionError"
    >
      <div
        class="d-flex flex-column align-center"
      >
        <p
          class="text-h5 whitespace-pre-line text-center"
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
import { getMainLocale } from '@/plugins/i18n'

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
      'isActive',
    ]),
    ...mapState('webrtc', ['sessionError']),
    ...mapGetters('webrtc', ['isSignalingConnected', 'isRegistered']),
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
    await this.$store.dispatch('system/getInfo')
      .then(
        async () => {
          if (this.isLogin) {
            await this.$_contacts_getContacts()
          }
        },
        async (error) => {
          await this.$store.dispatch('webrtc/setSessionError', this.$t(`errors.code.${error.code}`))
        },
      )
  },

  methods: {
    ...mapMutations('webrtc', ['setRegistrationStatus']),
    ...mapActions('account', ['initGetAccountInfo', 'logout']),
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
      const defaultLocale = getMainLocale()
      this.$root.$i18n.locale = defaultLocale
      this.$vuetify.lang.current = defaultLocale
      document.documentElement.setAttribute('lang', defaultLocale)
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
    async restartConnection() {
      if (this.isLogin) {
        await this.connect()
          .then(
            () => {
              console.log('Successfully connected to signaling socket')
            },
            (error) => {
              console.error('Error connected to signaling socket', error)
            },
          )
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
              await this.$store.dispatch('account/initGetAccountInfo')
              if (!this.isSignalingConnected) {
                await this.connect()
                  .then(
                    () => {
                      console.log('Successfully connected to signaling socket')
                    },
                    (error) => {
                      console.error('Error connected to signaling socket', error)
                    },
                  )
              }
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
    async isActive(value) {
      if (value) {
        this.snackbarShow({ message: this.$t('status.account.limit_removed') })
      } else {
        if (this.info) {
          if (this.info.status === 'blocked') {
            await this.logout({ force: false })
            await this.$router.push({ name: 'Login' })
            this.snackbarShow({ message: this.$t('status.account.blocked') })
          } else if (this.info.status === 'limited') {
            this.snackbarShow({ message: this.$t('status.account.limited') })
          }
        }
      }
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
