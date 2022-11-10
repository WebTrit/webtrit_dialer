import { shallowMount, createLocalVue } from '@vue/test-utils'
import Settings from '@/views/Settings.vue'

describe('Settings.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Settings, {
      localVue,
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {},
        },
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-tabs', 'v-tabs-items', 'v-tab', 'v-card',
        'v-card-text', 'v-tabs-item'],
    })
  })

  it('tabs returns 2 tabs', () => {
    expect(wrapper.vm.tabs[0]).toMatch(/Settings/i)
    expect(wrapper.vm.tabs[1]).toMatch(/Info/i)
    expect(wrapper.vm.tabs).toHaveLength(2)
  })
})
