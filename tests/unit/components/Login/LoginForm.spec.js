import { shallowMount, createLocalVue } from '@vue/test-utils'
import LoginForm from '@/components/Login/LoginForm.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
  contacts: {},
  errors: {},
}))

describe('LoginForm.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(LoginForm, {
      localVue,
      mocks: {
        $envConfig: {
          isDemoBehaviourEnabled: true,
          webtritAppName: 'app name',
          webtritAppSubname: 'dialer',
          webtritCompanyName: 'comp name',
          webtritCompanyUrl: 'comp url',
        },
        $vuetify: {
          breakpoint: {},
        },
        $t: (msg) => msg,
      },
      stubs: ['v-col', 'v-container', 'v-row', 'v-tabs', 'v-tab', 'v-tabs-items', 'v-tab-item'],
    })
  })

  it('tab returns 0 if demoEmail is null', () => {
    expect(wrapper.vm.tab).toBe(0)
  })

  it('demoEnabled returns isDemoBehaviourEnabled from envConfig', () => {
    expect(wrapper.vm.demoEnabled).toBe(true)
  })

  it('appName returns $envConfig.webtritAppName', () => {
    expect(wrapper.vm.appName).toBe('app name')
  })

  it('appSubname returns $envConfig.webtritAppSubname', () => {
    expect(wrapper.vm.appSubname).toBe('dialer')
  })

  it('companyName returns $envConfig.webtritCompanyName', () => {
    expect(wrapper.vm.companyName).toBe('comp name')
  })

  it('companyUrl returns $envConfig.webtritCompanyUrl', () => {
    expect(wrapper.vm.companyUrl).toBe('comp url')
  })
})
