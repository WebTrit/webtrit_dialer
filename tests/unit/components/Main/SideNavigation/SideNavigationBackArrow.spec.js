import { shallowMount, createLocalVue } from '@vue/test-utils'
import SideNavigationBackArrow from '@/components/Main/SideNavigation/SideNavigationBackArrow.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('SideNavigationBackArrow.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SideNavigationBackArrow, {
      localVue,
      stubs: ['v-icon'],
    })
  })

  it('component emits event on click', () => {
    wrapper.find('v-icon-stub').trigger('click')
    expect(wrapper.emitted()['toggle-mini-variant']).toBeTruthy()
  })
})
