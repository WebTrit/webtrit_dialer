import { shallowMount, createLocalVue } from '@vue/test-utils'
import Tabs from '@/views/Layout/Tabs.vue'

describe('Tabs.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Tabs, {
      localVue,
      mocks: {
        $route: {
          params: {
            number: '243443',
          },
          matched: [
            { name: 'CallDetails' },
          ],
        },
      },
      stubs: ['v-container', 'v-tabs', 'v-tabs-items'],
    })
  })

  it(`created hook sets tab to 1 if $route.params.number is provided and current nested route is
  CallDetails`, async () => {
    await wrapper.setData({
      tab: null,
    })
    Tabs.created.call(wrapper.vm)
    expect(wrapper.vm.tab).toBe(1)
  })

  it('created hook doesn\'t set tab to 1 if $route.params.number is not provided', async () => {
    wrapper.vm.$route.params.number = undefined
    await wrapper.setData({
      tab: null,
    })
    Tabs.created.call(wrapper.vm)
    expect(wrapper.vm.tab).toBeNull()
  })

  it('created hook doesn\'t set tab to 1 if callsSubRoute returns false', async () => {
    wrapper.vm.$route.matched = [
      { name: 'ContactDetails' },
    ]
    await wrapper.setData({
      tab: null,
    })
    Tabs.created.call(wrapper.vm)
    expect(wrapper.vm.tab).toBeNull()
  })

  it('callsSubRoute returns true if app is on callsDetails component route', () => {
    expect(wrapper.vm.callsSubRoute()).toBe(true)
  })

  it('callsSubRoute returns false if app is not on callsDetails component route', () => {
    wrapper.vm.$route.matched = [
      { name: 'ContactDetails' },
    ]
    expect(wrapper.vm.callsSubRoute()).toBe(false)
  })
})
