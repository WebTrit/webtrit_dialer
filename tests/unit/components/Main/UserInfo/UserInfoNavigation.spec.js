import { shallowMount, createLocalVue } from '@vue/test-utils'
import UserInfoNavigation from '@/components/Main/UserInfo/UserInfoNavigation.vue'

describe('UserInfoNavigation.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(UserInfoNavigation, {
      localVue,
      propsData: {
        open: true,
      },
      computed: {
        info() {
          return {
            initials: 'AA',
            email: 'test@test.com',
          }
        },
      },
      directives: {
        'click-outside': jest.fn(),
      },
      stubs: ['v-navigation-drawer', 'v-container', 'v-row', 'v-col', 'v-icon', 'router-link'],
    })
  })

  it('onClickOutside emits event to parent component', () => {
    wrapper.vm.onClickOutside()
    expect(wrapper.emitted()['close-user-navigation']).toBeTruthy()
  })

  it('renders navigation drawer if open prop === true', () => {
    expect(wrapper.find('v-navigation-drawer-stub').exists()).toBe(true)
  })

  it('doesn\'t render navigation drawer if open prop === false', async () => {
    await wrapper.setProps({
      open: false,
    })
    expect(wrapper.find('v-navigation-drawer-stub').exists()).toBe(false)
  })

  it('close icon emits event on click', () => {
    wrapper.find('v-icon-stub').trigger('click')
    expect(wrapper.emitted()['close-user-navigation']).toBeTruthy()
  })

  it('router link emits event on click', () => {
    wrapper.find('router-link-stub').trigger('click')
    expect(wrapper.emitted()['close-user-navigation']).toBeTruthy()
  })
})
