import { shallowMount, createLocalVue } from '@vue/test-utils'
import AppBar from '@/components/Main/AppBar.vue'

describe('AppBar.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppBar, {
      localVue,
      computed: {
        info() {
          return {
            initials: 'AA',
            email: 'test@test.com',
          }
        },
      },
      mocks: {
        $route: {
          meta: {
            hiddenFeatures: {
              appBar: undefined,
            },
          },
        },
      },
      stubs: ['v-app-bar', 'v-app-bar-nav-icon', 'v-toolbar-title', 'v-spacer'],
    })
  })

  it('isHidden returns false if $route.meta.hiddenFeatures.appBar is not defined', () => {
    expect(wrapper.vm.isHidden).toBeFalsy()
  })

  it('isHidden returns true if $route.meta.hiddenFeatures.appBar is defined', async () => {
    wrapper.vm.$route.meta.hiddenFeatures.appBar = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isHidden).toBeTruthy()
  })

  it('component is rendered if isHidden is falsy', async () => {
    wrapper.vm.$route.meta.hiddenFeatures.appBar = undefined
    await wrapper.vm.$nextTick()
    expect(wrapper.find('v-app-bar-stub').exists()).toBe(true)
  })

  it('component is not rendered if isHidden is truthy', async () => {
    wrapper.vm.$route.meta.hiddenFeatures.appBar = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('v-app-bar-stub').exists()).toBe(false)
  })

  it('avatar component emits event on click', () => {
    wrapper.find('avatar-stub').trigger('click')
    expect(wrapper.emitted()['open-user-info']).toBeTruthy()
  })
})
