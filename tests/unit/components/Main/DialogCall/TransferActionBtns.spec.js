import { shallowMount, createLocalVue } from '@vue/test-utils'
import TransferActionBtns from '@/components/Main/DialogCall/TransferActionBtns.vue'

describe('TransferActionBtns.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TransferActionBtns, {
      localVue,
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-row', 'v-btn'],
    })
  })

  it('return btn emits event on click', () => {
    wrapper.findAll('v-btn-stub').at(0).trigger('click')
    expect(wrapper.emitted()['close-transfer-popup']).toBeTruthy()
  })

  it('transfer btn emits event on click', () => {
    wrapper.findAll('v-btn-stub').at(1).trigger('click')
    expect(wrapper.emitted()['transfer-call']).toBeTruthy()
  })
})
