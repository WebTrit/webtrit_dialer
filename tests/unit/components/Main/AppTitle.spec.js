import { shallowMount, createLocalVue } from '@vue/test-utils'
import AppTitle from '@/components/Main/AppTitle.vue'

describe('AppTitle.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppTitle, {
      localVue,
      mocks: {
        $envConfig: {
          webtritAppName: 'demo company',
          webtritAppSubname: 'dialer',
          webtritCompanyLogoImgSrc: '/logo.png',
        },
      },
      stubs: ['router-link'],
    })
  })

  it('appName returns $envConfig.webtritAppName', () => {
    expect(wrapper.vm.appName).toBe('demo company')
  })

  it('appSubname returns $envConfig.webtritAppSubname', () => {
    expect(wrapper.vm.appSubname).toBe('dialer')
  })

  it('companyLogoImgSrc returns $envConfig.companyLogoImgSrc', () => {
    expect(wrapper.vm.companyLogoImgSrc).toBe('/logo.png')
  })

  it('toggle-mini-variant event triggers emitting event to parent component', () => {
    wrapper.find('backarrow-stub').vm.$emit('toggle-mini-variant')
    expect(wrapper.emitted()['toggle-mini-variant']).toBeTruthy()
  })
})
