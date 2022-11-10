import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import ActionBtns from '@/components/Edit-Account/ActionBtns.vue'

config.showDeprecationWarnings = false

describe('ActionBtns.vue', () => {
  const localVue = createLocalVue()
  const snackbarShow = jest.fn()
  let wrapper

  const userWithNullProps = {
    email: 'test@test.com',
    initials: 'AA',
    firstname: 'Name',
    lastname: 'Surname',
    company_name: null,
    mobile: null,
  }

  beforeEach(() => {
    wrapper = shallowMount(ActionBtns, {
      localVue,
      propsData: {
        actionBtnsDisabled: false,
        formValid: true,
        user: {
          email: 'test@test.com',
          initials: 'AA',
          firstname: 'Name',
          lastname: 'Surname',
          company_name: '',
          mobile: '',
        },
      },
      methods: {
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {},
        },
      },
      stubs: ['v-btn', 'v-row', 'v-col'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('cancel emits events to parent component', () => {
    wrapper.vm.cancel()
    expect(wrapper.emitted().prefillInfo).toBeTruthy()
    expect(wrapper.emitted().disableActionBtns).toBeTruthy()
  })

  it('emptyPropsToNull swaps empty strings in user object with null', () => {
    const res = wrapper.vm.emptyPropsToNull()
    expect(res).toEqual(userWithNullProps)
  })

  it('apply shows snackbar with error if form validation doesn\'t pass', async () => {
    await wrapper.setProps({
      formValid: false,
    })
    const spy_emptyPropsToNull = jest.spyOn(wrapper.vm, 'emptyPropsToNull')
    const editInfo = jest.fn().mockImplementation(() => Promise.resolve())
    wrapper.setMethods({
      editInfo,
    })
    wrapper.vm.apply()
    setTimeout((done) => {
      expect(snackbarShow).toHaveBeenCalled()
      expect(spy_emptyPropsToNull).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('apply success case', () => {
    const spy_emptyPropsToNull = jest.spyOn(wrapper.vm, 'emptyPropsToNull')
    const editInfo = jest.fn().mockImplementation(() => Promise.resolve())
    wrapper.setMethods({
      editInfo,
    })
    wrapper.vm.apply()
    setTimeout((done) => {
      expect(spy_emptyPropsToNull).toHaveBeenCalled()
      expect(editInfo).toHaveBeenCalledWith(userWithNullProps)
      expect(wrapper.emitted().disableActionBtns).toBeTruthy()
      expect(snackbarShow).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted()['show-errors']).toBeFalsy()
      done()
    }, 0)
  })

  it('apply failure case with error 422', () => {
    const spy_emptyPropsToNull = jest.spyOn(wrapper.vm, 'emptyPropsToNull')
    const err = {
      response: {
        status: 422,
      },
    }
    const editInfo = jest.fn().mockImplementation(() => Promise.reject(err))
    wrapper.setMethods({
      editInfo,
    })
    wrapper.vm.apply()
    setTimeout((done) => {
      expect(spy_emptyPropsToNull).toHaveBeenCalled()
      expect(editInfo).toHaveBeenCalledWith(userWithNullProps)
      expect(wrapper.emitted().disableActionBtns).toBeFalsy()
      expect(snackbarShow).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted()['show-errors']).toBeFalsy()
      done()
    }, 0)
  })

  it('apply failure case with error 404 & error data !== "parameters_validate_issue"', () => {
    const spy_emptyPropsToNull = jest.spyOn(wrapper.vm, 'emptyPropsToNull')
    const err = {
      response: {
        status: 404,
        data: {
          code: 'some_err',
        },
      },
    }
    const editInfo = jest.fn().mockImplementation(() => Promise.reject(err))
    wrapper.setMethods({
      editInfo,
    })
    wrapper.vm.apply()
    setTimeout((done) => {
      expect(spy_emptyPropsToNull).toHaveBeenCalled()
      expect(editInfo).toHaveBeenCalledWith(userWithNullProps)
      expect(wrapper.emitted().disableActionBtns).toBeFalsy()
      expect(snackbarShow).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted()['show-errors']).toBeFalsy()
      done()
    }, 0)
  })

  it('apply failure case with error 404 & error data === "parameters_validate_issue"', () => {
    const spy_emptyPropsToNull = jest.spyOn(wrapper.vm, 'emptyPropsToNull')
    const err = {
      response: {
        status: 404,
        data: {
          code: 'parameters_validate_issue',
        },
      },
    }
    const editInfo = jest.fn().mockImplementation(() => Promise.reject(err))
    wrapper.setMethods({
      editInfo,
    })
    wrapper.vm.apply()
    setTimeout((done) => {
      expect(spy_emptyPropsToNull).toHaveBeenCalled()
      expect(editInfo).toHaveBeenCalledWith(userWithNullProps)
      expect(wrapper.emitted().disableActionBtns).toBeFalsy()
      expect(snackbarShow).not.toHaveBeenCalled()
      expect(wrapper.emitted()['show-errors']).toBeTruthy()
      done()
    }, 0)
  })
})
