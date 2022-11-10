import { shallowMount, createLocalVue } from '@vue/test-utils'
import Demo from '@/components/Login/Demo.vue'

const getContacts = jest.fn()

const contacts = {
  methods: {
    $_contacts_getContacts() {
      getContacts()
    },
  },
}

describe('Demo.vue', () => {
  const localVue = createLocalVue()
  const dispatch = jest.fn().mockImplementation(() => '2323')
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Demo, {
      localVue,
      mixins: [contacts],
      propsData: {
        demoEmail: null,
      },
      mocks: {
        $envConfig: {
          isDemoBehaviourEnabled: true,
          webtritCompanyName: 'comp name',
        },
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
      },
      stubs: ['v-col', 'v-container', 'v-row', 'v-form', 'v-text-field', 'v-btn'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('email returns demoEmail prop', async () => {
    expect(wrapper.vm.email).toBe('')
  })

  it('mounted hook calls tryDemo', async () => {
    await wrapper.setProps({
      demoEmail: 'test@test.com',
    })
    const spy_tryDemo = jest.spyOn(wrapper.vm, 'tryDemo')
    Demo.mounted.call(wrapper.vm)
    expect(spy_tryDemo).toHaveBeenCalled()
  })

  it('email watcher sets errorMessages to null', async () => {
    await wrapper.setData({
      emailErrorMessages: ['error'],
    })
    wrapper.vm.email = 'another@test.com'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.emailErrorMessages).toBeNull()
  })

  it('tryDemo is not executing if emailProcessing === true', async (done) => {
    await wrapper.setData({
      emailProcessing: true,
      emailErrorMessages: ['error'],
    })
    wrapper.vm.tryDemo()
    setTimeout(() => {
      expect(wrapper.vm.emailErrorMessages).toEqual(['error'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('tryDemo is not executing if email is empty', async (done) => {
    await wrapper.setData({
      emailProcessing: false,
      email: '',
      emailErrorMessages: ['error'],
    })
    wrapper.vm.tryDemo()
    setTimeout(() => {
      expect(wrapper.vm.emailErrorMessages).toEqual(['error'])
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('tryDemo is not executing if validation doesn\'t pass', async (done) => {
    await wrapper.setData({
      emailProcessing: false,
      email: 'test@test.com',
      emailErrorMessages: ['error'],
    })
    wrapper.vm.$refs = {
      'demo-form': {
        validate: () => false,
      },
    }
    wrapper.vm.tryDemo()
    setTimeout(() => {
      expect(wrapper.vm.emailErrorMessages).toBeNull()
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('tryDemo success case', async (done) => {
    await wrapper.setData({
      emailProcessing: false,
      email: 'test@test.com',
      emailErrorMessages: ['error'],
    })
    wrapper.vm.$refs = {
      'demo-form': {
        validate: () => true,
      },
    }
    wrapper.vm.tryDemo()
    setTimeout(() => {
      expect(wrapper.vm.emailErrorMessages).toBeNull()
      expect(dispatch).toHaveBeenCalledWith('account/tryDemo', {
        email: 'test@test.com',
        type: 'web',
        identifier: '',
      })
      expect(dispatch).toHaveBeenCalledWith('account/login', '2323')
      expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
      expect(getContacts).toHaveBeenCalled()
      expect(wrapper.vm.emailProcessing).toBe(false)
      done()
    }, 0)
  })

  it('tryDemo fail case', async (done) => {
    await wrapper.setData({
      emailProcessing: false,
      email: 'test@test.com',
      emailErrorMessages: ['error'],
    })
    wrapper.vm.$refs = {
      'demo-form': {
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
    wrapper.vm.tryDemo()
    setTimeout(() => {
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('account/tryDemo', {
        email: 'test@test.com',
        type: 'web',
        identifier: '',
      })
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalledWith('account/login', expect.any(String))
      expect(wrapper.vm.emailErrorMessages).not.toBeNull()
      expect(wrapper.vm.$router).toEqual([])
      expect(getContacts).not.toHaveBeenCalled()
      expect(wrapper.vm.emailProcessing).toBe(false)
      done()
    }, 0)
  })
})
