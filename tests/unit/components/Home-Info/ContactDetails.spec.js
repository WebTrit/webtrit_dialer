import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import ContactDetails from '@/components/Home-Info/ContactDetails.vue'

config.showDeprecationWarnings = false

const contacts = {
  methods: {
    $_contacts_getOneContact() {
      return {
        initials: 'AA',
        email: 'test@test.com',
        sip_status: 0,
        number: '2345',
      }
    },
  },
}

describe('ContactDetails.vue', () => {
  const localVue = createLocalVue()
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactDetails, {
      localVue,
      mixins: [contacts],
      data() {
        return {
          contact: {
            initials: 'BB',
            email: 'testb@test.com',
            sip_status: 1,
            number: '1234',
          },
        }
      },
      methods: {
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
        $route: {
          params: {
            number: '1234',
          },
        },
        $router: [],
      },
      stubs: ['v-container', 'v-row', 'v-progress-linear', 'v-icon', 'v-dialog',
        'v-col', 'v-toolbar', 'v-spacer', 'v-toolbar-title'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetchContactDetails success case', async () => {
    await wrapper.vm.fetchContactDetails()
    expect(wrapper.emitted().loading[0]).toEqual([true])
    expect(wrapper.vm.contact).toEqual({
      initials: 'AA',
      email: 'test@test.com',
      sip_status: 0,
      number: '2345',
    })
    expect(wrapper.vm.error).toBe(false)
    expect(snackbarShow).not.toHaveBeenCalled()
    expect(wrapper.emitted().loading[1]).toEqual([false])
  })

  it('fetchContactDetails fail case', async () => {
    wrapper.vm.$_contacts_getOneContact = jest.fn().mockImplementation(() => null)
    await wrapper.vm.$nextTick()
    await wrapper.vm.fetchContactDetails()
    expect(wrapper.emitted().loading[0]).toEqual([true])
    expect(wrapper.vm.contact).toBeNull()
    expect(wrapper.vm.error).toBe(true)
    expect(snackbarShow).toHaveBeenCalled()
    expect(wrapper.emitted().loading[1]).toEqual([false])
  })
})
