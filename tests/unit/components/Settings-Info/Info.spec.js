import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import Info from '@/components/Settings-Info/Info.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('Info.vue', () => {
  const localVue = createLocalVue()
  const dispatch = jest.fn().mockImplementation(() => null)
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Info, {
      localVue,
      mocks: {
        $t: (msg) => msg,
        $store: {
          dispatch,
        },
        $envConfig: {
          webtritAppName: 'demo company',
          webtritAppSubname: 'dialer',
          webtritCoreUrl: 'https://demo.company.com',
          isDemoBehaviourEnabled: false,
          webtritCompanyLogoImgSrc: '/logo.png',
        },
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-simple-table', 'v-btn'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('appName returns $envConfig.webtritAppName', () => {
    expect(wrapper.vm.appName).toBe('demo company')
  })

  it('appSubname returns $envConfig.webtritAppSubname', () => {
    expect(wrapper.vm.appSubname).toBe('dialer')
  })

  it('envConfigEntries returns sorted envConfig entries', () => {
    expect(wrapper.vm.envConfigEntries).toEqual(
      [
        ['isDemoBehaviourEnabled', false],
        ['webtritAppName', 'demo company'],
        ['webtritAppSubname', 'dialer'],
        ['webtritCompanyLogoImgSrc', '/logo.png'],
        ['webtritCoreUrl', 'https://demo.company.com'],
      ],
    )
  })
})
