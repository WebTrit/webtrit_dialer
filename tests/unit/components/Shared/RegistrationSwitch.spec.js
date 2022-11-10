import { shallowMount, createLocalVue } from '@vue/test-utils'
import RegistrationSwitch from '@/components/Shared/RegistrationSwitch.vue'

jest.mock('@/mixins', () => ({
  janusRegistration: {},
}))

describe('RegistrationSwitch.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RegistrationSwitch, {
      localVue,
      data() {
        return {
          registrationSwitch: true,
        }
      },
      computed: {
        isRegistered: {
          get() {
            return this.registrationSwitch
          },
          set(val) {
            this.registrationSwitch = val
          },
        },
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-switch'],
    })
  })

  it('userOnline returns online text if user is registered', () => {
    expect(wrapper.vm.userOnline).toMatch(/online/i)
  })

  it('userOnline returns offline text if user is not registered', async () => {
    wrapper.vm.isRegistered = false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.userOnline).toMatch(/offline/i)
  })

  it('class "text-green" is applied if user is registered', () => {
    expect(wrapper.find('span').classes()).toContain('text-green')
  })

  it('class "text-green" is not applied if user is not registered', async () => {
    wrapper.vm.isRegistered = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('span').classes()).not.toContain('text-green')
  })
})
