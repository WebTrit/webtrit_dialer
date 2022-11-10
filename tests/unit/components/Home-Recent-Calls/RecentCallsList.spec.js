import { mount, createLocalVue, config } from '@vue/test-utils'
import RecentCallsList from '@/components/Home-Recent-Calls/RecentCallsList.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  breakpoints: {},
  calls: {},
}))

describe('RecentCallsList.vue', () => {
  const localVue = createLocalVue()
  localVue.filter('getDirectionIcon', (data) => data)
  localVue.filter('getDirectionTitle', (data) => data)
  localVue.filter('getDate', (data) => data)
  localVue.filter('getTime', (data) => data)
  localVue.filter('prettySeconds', (data) => data)
  localVue.filter('getIconColor', (data) => data)
  const call = jest.fn()
  const $_calls_getInterlocutor = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = mount(RecentCallsList, {
      localVue,
      propsData: {
        items: [{
          initials: 'AA',
          number: '1234',
          id: '1',
          direction: 'incoming',
        }],
      },
      computed: {
        isRegistered() {
          return true
        },
      },
      methods: {
        call,
        $_calls_getInterlocutor,
      },
      mocks: {
        $t: (msg) => msg,
        $route: {
          params: {},
        },
      },
      stubs: ['v-col', 'v-icon', 'v-container', 'v-row', 'v-btn', 'router-link'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('makeCall executes call fn', () => {
    wrapper.vm.makeCall({ number: '545' })
    expect(call).toHaveBeenCalledWith({
      number: '545',
      name: '',
      initials: '',
      video: false,
    })
  })
})
