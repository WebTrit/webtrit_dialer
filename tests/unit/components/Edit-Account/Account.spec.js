import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import Account from '@/components/Edit-Account/Account.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('Account.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Account, {
      localVue,
      data() {
        return {
          infoSwitch: {
            email: 'test@test.com',
            initials: 'AA',
            firstname: 'Name',
            lastname: 'Surname',
            company_name: 'Company',
            mobile: '1234',
          },
        }
      },
      computed: {
        info: {
          get() {
            return this.infoSwitch
          },
          set(val) {
            this.infoSwitch = val
          },
        },
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-container', 'v-row', 'v-col'],
    })
  })

  it('enableActionBtns makes buttons clickable', () => {
    wrapper.vm.enableActionBtns()
    expect(wrapper.vm.actionBtnsDisabled).toBe(false)
  })

  it('disableActionBtns makes buttons not clickable', async () => {
    await wrapper.setData({
      actionBtnsDisabled: false,
    })
    wrapper.vm.disableActionBtns()
    expect(wrapper.vm.actionBtnsDisabled).toBe(true)
  })

  it('prefillUserInfo takes data from info getter and assigns it to user', () => {
    wrapper.vm.prefillUserInfo()
    expect(wrapper.vm.user).toEqual({
      firstname: 'Name',
      lastname: 'Surname',
      email: 'test@test.com',
      mobile: '1234',
      company_name: 'Company',
    })
  })

  it('updateUserData updates user with provided data', () => {
    const newData = {
      firstname: 'new Name',
      lastname: 'new Surname',
      email: 'newtest@test.com',
      mobile: '121234',
      company_name: 'new Company',
    }
    wrapper.vm.updateUserData(newData)
    expect(wrapper.vm.user).toEqual(newData)
  })

  it('updateFormValid updates form validity flag', () => {
    wrapper.vm.updateFormValid(true)
    expect(wrapper.vm.formValid).toBe(true)
  })

  it('setServerErrors sets errors array', () => {
    const errs = { firstname: 'err', lastname: 'err' }
    wrapper.vm.setServerErrors(errs)
    expect(wrapper.vm.serverErrors).toEqual(errs)
  })

  it('info watcher calls prefillUserInfo method', async () => {
    const spy_prefillUserInfo = jest.spyOn(wrapper.vm, 'prefillUserInfo')
    const newData = {
      firstname: 'new Name',
      lastname: 'new Surname',
      email: 'newtest@test.com',
      mobile: '121234',
      company_name: 'new Company',
    }
    wrapper.vm.info = newData
    await wrapper.vm.$nextTick()
    expect(spy_prefillUserInfo).toHaveBeenCalled()
  })
})
