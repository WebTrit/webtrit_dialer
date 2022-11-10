import { shallowMount, createLocalVue } from '@vue/test-utils'
import SideNavigation from '@/components/Main/SideNavigation/SideNavigation.vue'

const breakpoints = {
  data() {
    return {
      breakpointSwitch: true,
    }
  },
  computed: {
    $_breakpoints_mobile: {
      get() {
        return this.breakpointSwitch
      },
      set(val) {
        this.breakpointSwitch = val
      },
    },
  },
}

describe('SideNavigation.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SideNavigation, {
      localVue,
      mixins: [breakpoints],
      propsData: {
        open: true,
      },
      mocks: {
        $envConfig: {
          webtritCompanyName: 'demo company',
        },
        $route: {
          meta: {
            hiddenFeatures: {
              navigationDrawer: undefined,
            },
          },
        },
      },
      directives: {
        'click-outside': jest.fn(),
      },
      stubs: ['v-navigation-drawer', 'v-icon', 'v-divider'],
    })
  })

  it('isHidden returns false if $route.meta.hiddenFeatures.navigationDrawer is not defined', () => {
    expect(wrapper.vm.isHidden).toBeFalsy()
  })

  it('isHidden returns true if $route.meta.hiddenFeatures.navigationDrawer is defined', async () => {
    wrapper.vm.$route.meta.hiddenFeatures.navigationDrawer = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isHidden).toBeTruthy()
  })

  it('sidebarWidth returns 230 if miniVariant is false', () => {
    expect(wrapper.vm.sidebarWidth).toBe('230')
  })

  it('sidebarWidth returns 80 if miniVariant is true', async () => {
    await wrapper.setData({
      miniVariant: true,
    })
    expect(wrapper.vm.sidebarWidth).toBe('80')
  })

  it('companyName returns $envConfig.webtritCompanyName', () => {
    expect(wrapper.vm.companyName).toBe('demo company')
  })

  it('toggleMiniVariant toggles miniVariant variable', async () => {
    await wrapper.setData({
      miniVariant: false,
    })
    wrapper.vm.toggleMiniVariant()
    expect(wrapper.vm.miniVariant).toBe(true)
  })

  it('onClickOutside emits event to parent', () => {
    wrapper.vm.onClickOutside()
    expect(wrapper.emitted()['close-sidebar']).toBeTruthy()
  })

  it('$_breakpoints_mobile watcher changes miniVariant', async (done) => {
    await wrapper.setData({
      miniVariant: true,
    })
    wrapper.vm.$_breakpoints_mobile = false
    setTimeout(() => {
      expect(wrapper.vm.miniVariant).toBe(false)
      done()
    }, 0)
  })
})
