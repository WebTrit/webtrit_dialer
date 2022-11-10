import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import Settings from '@/components/Settings-Info/Settings.vue'

config.showDeprecationWarnings = false

const breakpoints = {
  computed: {
    $_breakpoints_mobile() {
      return false
    },
  },
}

describe('Settings.vue', () => {
  const localVue = createLocalVue()
  const setNotificationsEnabled = jest.fn()
  const setSoundEnabled = jest.fn()
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Settings, {
      localVue,
      mixins: [breakpoints],
      data() {
        return {
          notificationsSwitch: false,
          soundSwitch: false,
        }
      },
      computed: {
        isNotificationsEnabled: {
          get() {
            return this.notificationsSwitch
          },
          set(val) {
            this.notificationsSwitch = val
          },
        },
        isSoundEnabled: {
          get() {
            return this.soundSwitch
          },
          set(val) {
            this.soundSwitch = val
          },
        },
      },
      methods: {
        setNotificationsEnabled,
        setSoundEnabled,
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
        $root: {
          $i18n: {
            locale: 'ru',
          },
        },
        $i18n: {
          locale: 'ru',
        },
        $vuetify: {
          lang: {
            current: 'ru',
          },
        },
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-checkbox', 'v-select', 'v-btn'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('currentLocale return currently selected locale', () => {
    expect(wrapper.vm.currentLocale).toBe('ru')
  })

  it('applyLang is called during mounted stage', () => {
    const spy_applyLang = jest.spyOn(wrapper.vm, 'applyLang')
    Settings.mounted.call(wrapper.vm)
    expect(spy_applyLang).toHaveBeenCalled()
  })

  it('apply saves settings', async () => {
    await wrapper.setData({
      selectedLang: {
        locale: 'en',
      },
      notificationsEnabled: true,
      soundEnabled: true,
    })
    const spy_applyLang = jest.spyOn(wrapper.vm, 'applyLang')
    wrapper.vm.apply()
    expect(setNotificationsEnabled).toHaveBeenCalledWith(true)
    expect(setSoundEnabled).toHaveBeenCalledWith(true)
    expect(wrapper.vm.$root.$i18n.locale).toBe('en')
    expect(wrapper.vm.$vuetify.lang.current).toBe('en')
    expect(spy_applyLang).toHaveBeenCalled()
    expect(snackbarShow).toHaveBeenCalled()
    expect(wrapper.vm.actionBtnsDisabled).toBe(true)
  })

  it('cancel cancels applied settings', async () => {
    await wrapper.setData({
      notificationsEnabled: true,
      soundEnabled: true,
    })
    wrapper.vm.isNotificationsEnabled = false
    wrapper.vm.isSoundEnabled = false
    const spy_applyLang = jest.spyOn(wrapper.vm, 'applyLang')
    wrapper.vm.cancel()
    expect(wrapper.vm.notificationsEnabled).toBe(false)
    expect(wrapper.vm.soundEnabled).toBe(false)
    expect(spy_applyLang).toHaveBeenCalled()
    expect(wrapper.vm.actionBtnsDisabled).toBe(true)
  })

  it('applyLang sets selectedLang', () => {
    wrapper.vm.$i18n.locale = 'it'
    wrapper.vm.applyLang()
    expect(wrapper.vm.selectedLang.locale).toBe('it')
  })

  it('applyLang sets default selectedLang', () => {
    wrapper.vm.$i18n.locale = 'ru'
    wrapper.vm.applyLang()
    expect(wrapper.vm.selectedLang.locale).toBe('en')
  })

  it('isNotificationsEnabled watcher sets notificationEnabled', async () => {
    wrapper.vm.isNotificationsEnabled = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.notificationsEnabled).toBe(true)
  })

  it('isSoundEnabled watcher sets soundEnabled', async () => {
    wrapper.vm.isSoundEnabled = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.soundEnabled).toBe(true)
  })
})
