import { mount, createLocalVue } from '@vue/test-utils'
import Info from '@/components/Home-Recent-Calls-Info/Info.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('Info.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(Info, {
      localVue,
      computed: {
        callHistoryItems() {
          return [
            { id: 1 },
            { id: 2 },
            { id: 3 },
          ]
        },
      },
      mocks: {
        $t: (msg) => msg,
        $router: [],
        $route: {
          params: {
            number: '3545',
          },
        },
      },
      stubs: ['v-container', 'v-row', 'v-progress-linear', 'v-icon', 'v-dialog',
        'v-col', 'v-toolbar', 'v-spacer', 'v-toolbar-title'],
    })
  })

  it('close redirects to Home', () => {
    wrapper.vm.close()
    expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
  })

  it('updateLoading updates loading field', () => {
    wrapper.vm.updateLoading(true)
    expect(wrapper.vm.loading).toBe(true)
  })

  it('fetchCallDetails calls findCallInHistoryItems fn', () => {
    const spy_findCallInHistoryItems = jest.spyOn(wrapper.vm, 'findCallInHistoryItems')
    wrapper.vm.fetchCallDetails()
    expect(spy_findCallInHistoryItems).toHaveBeenCalledWith('3545')
  })

  it('findCallInHistoryItems returns item if it\'s found in call items array', () => {
    expect(wrapper.vm.findCallInHistoryItems('1')).toEqual({
      id: 1,
    })
  })

  it('findCallInHistoryItems returns null if item is not found in call items array', () => {
    expect(wrapper.vm.findCallInHistoryItems('10')).toBeNull()
  })
})
