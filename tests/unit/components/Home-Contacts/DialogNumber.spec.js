import { shallowMount, createLocalVue } from '@vue/test-utils'
import DialogNumber from '@/components/Home-Contacts/DialogNumber.vue'

describe('DialogNumber.vue', () => {
  const localVue = createLocalVue()
  const commit = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DialogNumber, {
      localVue,
      data() {
        return {
          phoneNumber: '123',
        }
      },
      computed: {
        info() {
          return {
            initials: 'AA',
            email: 'test@test.com',
          }
        },
        balance() {
          return 20
        },
        dialogNumberVisibility() {
          return true
        },
        phoneNumberMaxLength() {
          return 11
        },
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {},
        },
        $store: {
          commit,
        },
      },
      stubs: ['v-dialog', 'v-container', 'v-row', 'v-col', 'v-icon'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('closeDialog closes dialog and calls mutation', () => {
    wrapper.vm.closeDialog()
    expect(wrapper.vm.phoneNumber).toBe('')
    expect(commit).toHaveBeenCalledWith('toggleDialogNumberVisibility', false)
  })

  it('keypadClick adds digit to phoneNumber field', () => {
    wrapper.vm.keypadClick(5)
    expect(wrapper.vm.phoneNumber).toBe('1235')
  })

  it(`keypadClick doesn'\t add digit to phoneNumber field if
  phoneNumberMaxLength is exceeded`, async () => {
    await wrapper.setData({
      phoneNumber: '12345678910',
    })
    wrapper.vm.keypadClick(5)
    expect(wrapper.vm.phoneNumber).toBe('12345678910')
  })

  it('showError sets error message', () => {
    wrapper.vm.showError('some err')
    expect(wrapper.vm.phoneNumberErrorMessages).toBe('some err')
  })

  it('phoneNumber watcher sets error field to null when phoneNumber changes', async () => {
    await wrapper.setData({
      phoneNumberErrorMessages: 'some err',
    })
    wrapper.vm.phoneNumber = '555'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.phoneNumberErrorMessages).toBeNull()
  })

  it('phone-error event calls showEorror fn', () => {
    const spy_showError = jest.spyOn(wrapper.vm, 'showError')
    wrapper.find('actionbtns-stub').vm.$emit('phone-error')
    expect(spy_showError).toHaveBeenCalled()
  })

  it('keypad-click event calls keypadClick fn', () => {
    const spy_keypadClick = jest.spyOn(wrapper.vm, 'keypadClick')
    wrapper.find('keypad-stub').vm.$emit('keypad-click')
    expect(spy_keypadClick).toHaveBeenCalled()
  })

  it('update-phone-number sets phoneNumber', () => {
    wrapper.find('phoneinput-stub').vm.$emit('update-phone-number', '234')
    expect(wrapper.vm.phoneNumber).toBe('234')
  })
})
