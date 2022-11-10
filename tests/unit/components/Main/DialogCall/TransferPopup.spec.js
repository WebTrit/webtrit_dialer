import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import TransferPopup from '@/components/Main/DialogCall/TransferPopup.vue'

config.showDeprecationWarnings = false

describe('TransferPopup.vue', () => {
  const localVue = createLocalVue()
  const transfer = jest.fn()
  const hold = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TransferPopup, {
      localVue,
      propsData: {
        showTransfer: true,
      },
      data() {
        return {
          phoneNumber: '123',
          holdActive: false,
        }
      },
      computed: {
        phoneNumberMaxLength() {
          return 11
        },
      },
      methods: {
        transfer,
        hold,
      },
      stubs: ['v-dialog', 'v-container', 'v-row'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('show returns showTransfer prop', () => {
    expect(wrapper.vm.show).toBe(true)
  })

  it('show setter emits event to parent', () => {
    wrapper.vm.show = false
    expect(wrapper.emitted()['hide-transfer-popup']).toBeTruthy()
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

  it('transferCall transfers call', () => {
    wrapper.vm.transferCall()
    expect(transfer).toHaveBeenCalledWith('123')
    expect(wrapper.emitted()['hide-transfer-popup']).toBeTruthy()
  })

  it('transferCall doesn\'t transfer call if phone number is empty', async () => {
    await wrapper.setData({
      phoneNumber: '',
    })
    wrapper.vm.transferCall()
    expect(transfer).not.toHaveBeenCalled()
    expect(wrapper.emitted()['hide-transfer-popup']).toBeFalsy()
  })

  it('showTransfer watcher calls hold action', async () => {
    await wrapper.setProps({
      showTransfer: false,
    })
    expect(hold).toHaveBeenCalledWith({ active: false })
    expect(wrapper.vm.holdActive).toBe(true)
  })

  it('update-phone-number event updates phoneNumber', () => {
    wrapper.find('phoneinput-stub').vm.$emit('update-phone-number', '456')
    expect(wrapper.vm.phoneNumber).toBe('456')
  })

  it('calls transferCall on Enter pressed', () => {
    const spy_transferCall = jest.spyOn(wrapper.vm, 'transferCall')
    wrapper.find('phoneinput-stub').trigger('keyup.enter')
    expect(spy_transferCall).toHaveBeenCalled()
  })

  it('keypad-click event calls keypadClick fn', () => {
    const spy_keypadClick = jest.spyOn(wrapper.vm, 'keypadClick')
    wrapper.find('keypad-stub').vm.$emit('keypad-click', '6')
    expect(spy_keypadClick).toHaveBeenCalled()
  })

  it('close-transfer-popup event sets show variable', () => {
    wrapper.find('actionbtns-stub').vm.$emit('close-transfer-popup')
    expect(wrapper.emitted()['hide-transfer-popup']).toBeTruthy()
  })

  it('transfer-call event calls transferCall', () => {
    const spy_transferCall = jest.spyOn(wrapper.vm, 'transferCall')
    wrapper.find('actionbtns-stub').vm.$emit('transfer-call')
    expect(spy_transferCall).toHaveBeenCalled()
  })
})
