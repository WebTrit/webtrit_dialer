<template>
  <v-col
    class="login-form"
  >
    <v-container
      :class="[ $_breakpoints_mobile? 'login-form__inner--mobile' : 'login-form__inner']"
    >
      <v-row class="login-form__inner-row">
        <v-col
          class="login-form__inner-col"
          :class="[ $vuetify.breakpoint.xs? 'login-form__title--mobile' : 'login-form__title']"
        >
          <span class="font-bold"> {{ $t('login.get_started') }} </span>
          <span class="secondary--text font-bold"> {{ appName }} </span>
          <span class="secondary--text"> {{ appSubname }} </span>
        </v-col>
      </v-row>
      <v-row class="login-form__inner-row flex-grow-1">
        <v-col
          :class="[ $vuetify.breakpoint.xs? 'login-form__inner-col--mobile' : 'login-form__inner-col']"
        >
          <v-tabs
            v-model="activeTab"
            align-with-title
            grow
            active-class="secondary--text"
            background-color="transparent"
            slider-color="secondary"
          >
            <v-tab
              v-for="(tab, index) in getTabs"
              :key="index"
            >
              {{ tab.title }}
            </v-tab>

            <v-tabs-items v-model="activeTab">
              <v-tab-item
                v-for="(tab, index) in getTabs"
                :key="index"
              >
                <component
                  :is="tab.component"
                  ref="components"
                  :key="index"
                  v-bind="$props"
                  :auto-submit="isSingleLoginMethod"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row class="login-form__inner-row">
        <v-col
          class="login-form__inner-col p-0"
        >
          <p
            class="login-form__signature"
            :class="{ 'left-0': !$_breakpoints_desktop }"
          >
            by
            <span
              v-if="!companyUrl"
              class="font-bold"
            > {{ companyName }} </span>
            <a
              v-else
              :href="companyUrl"
              class="font-bold no-underline"
              target="_blank"
            > {{ companyName }} </a>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { breakpoints } from '@/mixins'
import SignIn from '@/components/Login/SignIn.vue'
import Signup from '@/components/Login/Signup.vue'
import LoginSignIn from '@/components/Login/LoginSignIn.vue'
import { mapGetters } from 'vuex'

export default {
  mixins: [breakpoints],
  data() {
    return {
      activeTab: 0,
      tabs: [
        {
          title: this.$i18n.t('login.demo'),
          component: Signup,
          support: 'signup',
        },
        {
          title: this.$i18n.t('login.otp_sign_in'),
          component: SignIn,
          support: 'otpSignin',
        },
        {
          title: this.$i18n.t('login.sign_in'),
          component: LoginSignIn,
          support: 'passwordSignin',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('system', { system_info: 'info' }),
    isSupported() {
      return (item) => !!(this.system_info && this.system_info.adapter?.supported?.includes(item.support))
    },
    isSingleLoginMethod() {
      return this.getTabs.length === 1
    },
    getTabs() {
      return this.tabs.filter(this.isSupported)
    },
    appName() {
      return this.$envConfig.webtritAppName
    },
    appSubname() {
      return this.$envConfig.webtritAppSubname
    },
    companyName() {
      return this.$envConfig.webtritCompanyName
    },
    companyUrl() {
      return this.$envConfig.webtritCompanyUrl
    },
  },
  methods: {
    callFocusFunction() {
      const component = this.$refs.components.at(this.activeTab)
      if (component) {
        component.focusOnFirstInput()
      }
    },
  },
  watch: {
    activeTab() {
      this.$nextTick(this.callFocusFunction)
    },
  },
}
</script>

<style scoped lang="scss">
.login-form {
  max-width: 50%;

  @apply bg-white flex items-start;
}

.login-form__inner {
  max-width: 600px;
  height: calc(100vh - 24px);

  @apply flex flex-col;
}

.login-form__inner--mobile {
  @apply login-form__inner;
  @apply p-0 h-full;
}

.login-form__inner-row {
  @apply m-0 w-full flex-none;
}

.login-form__inner-col {
  @apply flex justify-center;

  ::v-deep .v-tabs-items {
    min-height: 138px;
  }
}

.login-form__inner-col--mobile {
  @apply login-form__inner-col;

  ::v-deep .v-tabs-bar {
    height: 40px;
  }
}

.login-form__title {
  @apply flex-wrap;

  > span {
    @apply text-3xl pr-2 whitespace-nowrap;
  }
}

.login-form__title--mobile {
  @apply flex-wrap;

  > span {
    @apply text-2xl pr-2 whitespace-nowrap;
  }
}

.login-form__tab {
  @apply ml-0 #{!important};
}

.login-form__tab--no-hover {
  @apply cursor-default;

  &:hover,
  &::before {
    @apply bg-transparent;
  }
}

.login-form__signature {
  @apply text-sm m-0 text-gray-400;
}

.login__row--mobile {
  .login-form {
    max-height: calc(100vh - 300px);

    @apply max-w-full order-2;
  }

  .login-form__inner {
    @apply p-0;
  }

  .login-form__inner-col {
    ::v-deep .v-tabs-items {
      min-height: 175px;
    }
  }
}
</style>
