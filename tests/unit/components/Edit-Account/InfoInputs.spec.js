import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import InfoInputs from '@/components/Edit-Account/InfoInputs.vue'

config.showDeprecationWarnings = false

describe('InfoInputs.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InfoInputs, {
      localVue,
      propsData: {
        user: {
          email: 'test@test.com',
          initials: 'AA',
          firstname: 'Name',
          lastname: 'Surname',
          company_name: '',
          mobile: '',
        },
        serverErrors: {
          firstname: 'err',
          lastname: 'err',
        },
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {},
        },
      },
      stubs: ['v-form', 'v-row', 'v-col', 'v-text-field'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('userData returns user prop', () => {
    expect(wrapper.vm.userData).toEqual({
      email: 'test@test.com',
      initials: 'AA',
      firstname: 'Name',
      lastname: 'Surname',
      company_name: '',
      mobile: '',
    })
  })

  it('userData setter emits event', () => {
    wrapper.vm.userData = {
      email: 'newtest@test.com',
      initials: 'newAA',
      firstname: 'Name',
      lastname: 'Surname',
      company_name: '',
      mobile: '',
    }
    expect(wrapper.emitted().updateUserData).toBeTruthy()
  })

  it('user watcher emits form-valid event if form validation passes', async () => {
    const validate = jest.fn().mockImplementation(() => true)
    wrapper.vm.$refs = {
      'edit-form': {
        validate,
      },
    }
    await wrapper.setProps({
      user: {
        email: 'newtest@test.com',
        initials: 'newAA',
        firstname: 'Name',
        lastname: 'Surname',
        company_name: '',
        mobile: '',
      },
    })
    expect(wrapper.emitted()['form-valid'][0]).toEqual([true])
  })

  it('user watcher emits form-valid event if form validation passes', async () => {
    const validate = jest.fn().mockImplementation(() => false)
    wrapper.vm.$refs = {
      'edit-form': {
        validate,
      },
    }
    await wrapper.setProps({
      user: {
        email: 'newtest@test.com',
        initials: 'newAA',
        firstname: 'Name',
        lastname: 'Surname',
        company_name: '',
        mobile: '',
      },
    })
    expect(wrapper.emitted()['form-valid'][0]).toEqual([false])
  })
})
