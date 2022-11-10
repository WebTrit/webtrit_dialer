import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import App from '@/App.vue'

config.showDeprecationWarnings = false

const breakpoints = {
  data() {
    return {
      breakpointSwitch: true,
    }
  },
  computed: {
    $_breakpoints_mobile: {
      get() {
        return this.breakpointSwitch
      },
      set(val) {
        this.breakpointSwitch = val
      },
    },
  },
}

const janusRegistration = {
  data() {
    return {
      registerEnabledSwitch: true,
    }
  },
  computed: {
    $_janusRegistration_registerEnabled: {
      get() {
        return this.registerEnabledSwitch
      },
      set(val) {
        this.registerEnabledSwitch = val
      },
    },
  },
}

describe('App.vue', () => {
  const localVue = createLocalVue()
  const setRegistrationEvent = jest.fn()
  const getInfo = jest.fn()
  const init = jest.fn().mockImplementation(() => Promise.resolve())
  const deinit = jest.fn()
  const register = jest.fn()
  const unregister = jest.fn()
  const snackbarHide = jest.fn()
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
      mixins: [breakpoints, janusRegistration],
      data() {
        return {
          isLoginSwitch: false,
          infoSwitch: false,
          isRegisteredSwitch: false,
        }
      },
      computed: {
        snackbarVisible() {
          return false
        },
        snackbarMessage() {
          return 'some msg'
        },
        snackbarTimeout() {
          return 1000
        },
        sessionError() {
          return null
        },
        isLogin: {
          get() {
            return this.isLoginSwitch
          },
          set(val) {
            this.isLoginSwitch = val
          },
        },
        info: {
          get() {
            return this.infoSwitch
          },
          set(val) {
            this.infoSwitch = val
          },
        },
        isRegistered: {
          get() {
            return this.isRegisteredSwitch
          },
          set(val) {
            this.isRegisteredSwitch = val
          },
        },
      },
      methods: {
        setRegistrationEvent,
        getInfo,
        init,
        deinit,
        register,
        unregister,
        snackbarHide,
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          lang: {
            current: 'es',
          },
        },
        $root: {
          $i18n: {
            locale: 'es',
          },
        },
        $i18n: {
          fallbackLocale: 'en',
        },
      },
      stubs: ['v-app', 'v-main', 'v-snackbar', 'v-overlay', 'v-btn', 'v-icon', 'router-view'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('snackbarShowing getter returns snackbarVisible', () => {
    expect(wrapper.vm.snackbarShowing).toBe(false)
  })

  it('snackbarShowing setter calls snackbarHide if snackbarShowing is set to false', () => {
    wrapper.vm.snackbarShowing = true
    wrapper.vm.snackbarShowing = false
    expect(snackbarHide).toHaveBeenCalled()
  })

  it('snackbarShowing setter doesn\'t call snackbarHide if snackbarShowing is set to true', () => {
    wrapper.vm.snackbarShowing = true
    expect(snackbarHide).not.toHaveBeenCalled()
  })

  it('toggleSideNavigation toggles sideNavigationVisible variable', () => {
    wrapper.vm.toggleSideNavigation()
    expect(wrapper.vm.sideNavigationVisible).toBe(true)
  })

  it('closeSideNavigation sets sideNavigationVisible to false', async () => {
    await wrapper.setData({
      sideNavigationVisible: true,
    })
    wrapper.vm.toggleSideNavigation()
    expect(wrapper.vm.sideNavigationVisible).toBe(false)
  })

  it('openUserNavigation sets userNavigationVisible to true', () => {
    wrapper.vm.openUserNavigation()
    expect(wrapper.vm.userNavigationVisible).toBe(true)
  })

  it('closeUserNavigation sets userNavigationVisible to false', async () => {
    await wrapper.setData({
      userNavigationVisible: true,
    })
    wrapper.vm.closeUserNavigation()
    expect(wrapper.vm.userNavigationVisible).toBe(false)
  })

  it('setLanguage sets language returned by navigator.language', () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValueOnce('it')
    const setAttribute = jest.fn()
    Object.defineProperty(global.document, 'documentElement', {
      value: {
        setAttribute,
      },
      writable: true,
    })
    wrapper.vm.setLanguage()
    expect(wrapper.vm.$root.$i18n.locale).toBe('it')
    expect(wrapper.vm.$vuetify.lang.current).toBe('it')
    expect(setAttribute).toHaveBeenCalledWith('lang', 'it')
  })

  it('setLanguage sets fallback language if navigator.language is not supported', () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValueOnce('pt')
    const setAttribute = jest.fn()
    Object.defineProperty(global.document, 'documentElement', {
      value: {
        setAttribute,
      },
      writable: true,
    })
    wrapper.vm.setLanguage()
    expect(wrapper.vm.$root.$i18n.locale).toBe('en')
    expect(wrapper.vm.$vuetify.lang.current).toBe('en')
    expect(setAttribute).toHaveBeenCalledWith('lang', 'en')
  })

  it('closeConnection unregisters user and shows error snackbar if user is logged', () => {
    wrapper.vm.isLogin = true
    wrapper.vm.closeConnection()
    expect(unregister).toHaveBeenCalled()
    expect(setRegistrationEvent).toHaveBeenCalledWith({ event: 'unregistered' })
    expect(deinit).toHaveBeenCalled()
    expect(snackbarShow).toHaveBeenCalled()
  })

  it('closeConnection doesn\'t perform unregistering if user is not logged', () => {
    wrapper.vm.closeConnection()
    expect(unregister).not.toHaveBeenCalled()
    expect(setRegistrationEvent).not.toHaveBeenCalled()
    expect(deinit).not.toHaveBeenCalled()
    expect(snackbarShow).not.toHaveBeenCalled()
  })

  it('restartConnection re-inits connection if user is logged', (done) => {
    jest.clearAllMocks()
    wrapper.vm.isLogin = true
    wrapper.vm.$_janusRegistration_registerEnabled = false
    wrapper.vm.restartConnection()
    setTimeout(() => {
      expect(init).toHaveBeenCalled()
      expect(register).not.toHaveBeenCalled()
      expect(snackbarShow).toHaveBeenCalled()
      done()
    }, 0)
  })

  it('restartConnection re-inits connection and re-registers user if he is logged', (done) => {
    jest.clearAllMocks()
    wrapper.vm.isLogin = true
    wrapper.vm.$_janusRegistration_registerEnabled = true
    wrapper.vm.restartConnection()
    setTimeout(() => {
      expect(init).toHaveBeenCalled()
      expect(register).toHaveBeenCalled()
      expect(snackbarShow).toHaveBeenCalled()
      done()
    }, 0)
  })

  it('watchConnection attaches online/offline listeners', () => {
    const addEventListener = jest.fn()
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener,
      },
      writable: true,
    })
    wrapper.vm.watchConnection()
    expect(addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('isLogin watcher unregisters user when he logs out', async () => {
    wrapper.vm.isRegistered = true
    wrapper.vm.isLogin = true
    await wrapper.vm.$nextTick()
    wrapper.vm.isLogin = false
    await wrapper.vm.$nextTick()
    expect(unregister).toHaveBeenCalled()
  })

  it('isLogin watcher doesn\'t unregister user when he logs out if he\'s not registered', async () => {
    wrapper.vm.isRegistered = false
    wrapper.vm.isLogin = true
    await wrapper.vm.$nextTick()
    wrapper.vm.isLogin = false
    await wrapper.vm.$nextTick()
    expect(unregister).not.toHaveBeenCalled()
  })

  it('isLogin watcher doesn\'t unregister user when he log in', async () => {
    wrapper.vm.isRegistered = true
    wrapper.vm.isLogin = true
    await wrapper.vm.$nextTick()
    expect(unregister).not.toHaveBeenCalled()
  })

  it('$_janusRegistration_registerEnabled calls register when set to true', async () => {
    wrapper.vm.$_janusRegistration_registerEnabled = false
    await wrapper.vm.$nextTick()
    unregister.mockClear()
    wrapper.vm.$_janusRegistration_registerEnabled = true
    await wrapper.vm.$nextTick()
    expect(register).toHaveBeenCalled()
    expect(unregister).not.toHaveBeenCalled()
  })

  it('$_janusRegistration_registerEnabled calls unregister when set to false', async () => {
    wrapper.vm.$_janusRegistration_registerEnabled = false
    await wrapper.vm.$nextTick()
    expect(unregister).toHaveBeenCalled()
    expect(register).not.toHaveBeenCalled()
  })

  it('$_breakpoints_mobile watcher hides side nav panel on small screens', async () => {
    wrapper.vm.$_breakpoints_mobile = false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.sideNavigationVisible).toBe(true)
    wrapper.vm.$_breakpoints_mobile = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.sideNavigationVisible).toBe(false)
  })
})
