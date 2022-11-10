import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import SignIn from '@/components/Login/SignIn.vue'

config.showDeprecationWarnings = false

const getContacts = jest.fn()

const contacts = {
  methods: {
    $_contacts_getContacts() {
      getContacts()
    },
  },
}

const errors = {
  methods: {
    $_errors_parse() {
      return '404'
    },
  },
}

describe('SignIn.vue', () => {
  const localVue = createLocalVue()
  const dispatch = jest.fn().mockImplementation(() => '2323')
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SignIn, {
      localVue,
      mixins: [contacts, errors],
      methods: {
        snackbarShow,
      },
      mocks: {
        $vuetify: {
          breakpoint: {},
        },
        $t: (msg) => msg,
        $i18n: {
          t: (msg) => msg,
        },
        $store: {
          dispatch,
        },
        $router: [],
        $envConfig: {
          isDemoBehaviourEnabled: false,
        },
      },
      stubs: ['v-col', 'v-container', 'v-row', 'v-form', 'v-text-field', 'v-btn'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('phone watcher sets errorMessages to null', async () => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    await wrapper.setData({
      phoneNumber: '1234',
    })
    expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
  })

  it('otp watcher sets errorMessages to null', async () => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      otpErrorMessages: ['errors'],
    })
    await wrapper.setData({
      otp: '2334',
    })
    expect(wrapper.vm.otpErrorMessages).toBeNull()
  })

  it('providePhoneNumber doesn\'t execute if otpId is set', async (done) => {
    await wrapper.setData({
      otpId: '2334',
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('providePhoneNumber doesn\'t execute if phoneNumberProcessing === true', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      phoneNumber: '1234',
    })
    await wrapper.setData({
      phoneNumberProcessing: true,
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('providePhoneNumber doesn\'t execute if phoneNumber is empty', async (done) => {
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('providePhoneNumber doesn\'t execute if validation doesn\'t pass', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      phoneNumber: '1234',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => false,
      },
    }
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('providePhoneNumber success case', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      phoneNumber: '1234',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => true,
      },
    }
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
      expect(dispatch).toHaveBeenCalledWith('account/requestOtp', {
        phone: '1234',
        type: 'web',
        identifier: '',
      })
      expect(wrapper.vm.otpId).toBe('2323')
      expect(wrapper.vm.phoneNumberProcessing).toBe(false)
      done()
    }, 0)
  })

  it('providePhoneNumber fail case', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      phoneNumber: '1234',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => true,
      },
    }
    const error = {
      response: {
        data: {
          code: 401,
        },
      },
    }
    wrapper.vm.$store.dispatch = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.vm.providePhoneNumber()
    setTimeout(() => {
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('account/requestOtp', {
        phone: '1234',
        type: 'web',
        identifier: '',
      })
      expect(wrapper.vm.otpId).toBe('')
      expect(wrapper.vm.phoneNumberErrorMessages).not.toBeNull()
      expect(wrapper.vm.phoneNumberProcessing).toBe(false)
      done()
    }, 0)
  })

  it('verifyReceivedOtp doesn\'t execute if otpProcessing === true', async (done) => {
    await wrapper.setData({
      otpProcessing: true,
      otpErrorMessages: ['errors'],
    })
    wrapper.vm.verifyReceivedOtp()
    setTimeout(() => {
      expect(wrapper.vm.otpErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('verifyReceivedOtp doesn\'t execute if otp is empty', async (done) => {
    await wrapper.setData({
      otpErrorMessages: ['errors'],
    })
    wrapper.vm.verifyReceivedOtp()
    setTimeout(() => {
      expect(wrapper.vm.otpErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('verifyReceivedOtp doesn\'t execute if validation doesn\'t pass', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      otp: '1234',
    })
    await wrapper.setData({
      otpErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'verification-form': {
        validate: () => false,
      },
    }
    wrapper.vm.verifyReceivedOtp()
    setTimeout(() => {
      expect(wrapper.vm.otpErrorMessages).toBeNull()
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('verifyReceivedOtp success case', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      otp: '1234',
      otpId: '2434',
    })
    await wrapper.setData({
      otpErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'verification-form': {
        validate: () => true,
      },
    }
    wrapper.vm.verifyReceivedOtp()
    setTimeout(() => {
      expect(wrapper.vm.otpErrorMessages).toBeNull()
      expect(dispatch).toHaveBeenCalledWith('account/verifyOtp', {
        otpId: '2434',
        code: '1234',
      })
      expect(dispatch).toHaveBeenCalledWith('account/login', '2323')
      expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
      expect(getContacts).toHaveBeenCalled()
      expect(wrapper.vm.otpProcessing).toBe(false)
      done()
    }, 0)
  })

  it('verifyReceivedOtp fail case', async (done) => {
    // Data is set twice to override watcher behavior
    await wrapper.setData({
      otp: '1234',
      otpId: '2434',
    })
    await wrapper.setData({
      otpErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'verification-form': {
        validate: () => true,
      },
    }
    const error = {
      response: {
        data: {
          code: 401,
        },
      },
    }
    wrapper.vm.$store.dispatch = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.vm.verifyReceivedOtp()
    setTimeout(() => {
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('account/verifyOtp', {
        otpId: '2434',
        code: '1234',
      })
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('account/login', expect.any(String))
      expect(wrapper.vm.$router).toEqual([])
      expect(wrapper.vm.otpErrorMessages).not.toBeNull()
      expect(getContacts).not.toHaveBeenCalled()
      expect(wrapper.vm.otpProcessing).toBe(false)
      done()
    }, 0)
  })

  it('resendCode success case', async (done) => {
    await wrapper.setData({
      phoneNumber: '1234',
      otp: '4546566',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => true,
      },
    }
    wrapper.vm.resendCode()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
      expect(dispatch).toHaveBeenCalledWith('account/requestOtp', {
        phone: '1234',
        type: 'web',
        identifier: '',
      })
      expect(wrapper.vm.otp).toBe('')
      expect(snackbarShow).toHaveBeenCalled()
      expect(wrapper.vm.phoneNumberProcessing).toBe(false)
      done()
    }, 0)
  })

  it('resendCode fail case', async (done) => {
    await wrapper.setData({
      phoneNumber: '1234',
      otp: '4546566',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => true,
      },
    }
    const error = {
      response: {
        data: {
          code: 401,
        },
      },
    }
    wrapper.vm.$store.dispatch = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.vm.resendCode()
    setTimeout(() => {
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('account/requestOtp', {
        phone: '1234',
        type: 'web',
        identifier: '',
      })
      expect(wrapper.vm.otp).toBe('4546566')
      expect(snackbarShow).not.toHaveBeenCalled()
      expect(wrapper.vm.phoneNumberErrorMessages).not.toBeNull()
      expect(wrapper.vm.phoneNumberProcessing).toBe(false)
      done()
    }, 0)
  })

  it('resendCode doesn\'t execute if phoneNumber is empty', async (done) => {
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.resendCode()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toEqual(['errors'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('resendCode doesn\'t execute if validation doesn\'t pass', async (done) => {
    await wrapper.setData({
      phoneNumber: '1234',
      otp: '4546566',
    })
    await wrapper.setData({
      phoneNumberErrorMessages: ['errors'],
    })
    wrapper.vm.$refs = {
      'signin-form': {
        validate: () => false,
      },
    }
    wrapper.vm.resendCode()
    setTimeout(() => {
      expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })
})
