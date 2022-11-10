/* eslint-disable max-classes-per-file */
import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import DownloadBtn from '@/components/Shared/DownloadBtn.vue'

config.showDeprecationWarnings = false

describe('DownloadBtn.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DownloadBtn, {
      localVue,
      propsData: {
        disabled: false,
        callId: 123,
        filename: 'file',
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-tooltip', 'v-btn', 'v-icon'],
    })
  })

  it('currentIcon returns "$call-history-download" if State.EMPTY', async () => {
    await wrapper.setData({
      state: 0,
    })
    expect(wrapper.vm.currentIcon).toMatch(/download/)
  })

  it('currentIcon returns "$call-history-error" in default case', async () => {
    await wrapper.setData({
      state: 2,
    })
    expect(wrapper.vm.currentIcon).toMatch(/error/)
  })

  it('download loads source audio and plays it', async (done) => {
    const Blob = class {
      constructor([data], { type }) {
        this.data = data
        this.type = type
      }
    }
    global.Blob = Blob
    const createObjectURL = jest.fn().mockImplementation((data) => data)
    const revokeObjectURL = jest.fn()
    global.URL = {
      createObjectURL,
      revokeObjectURL,
    }
    const click = jest.fn()
    const { createElement } = document
    Object.defineProperty(global.document, 'createElement', {
      value: jest.fn().mockImplementation(() => ({
        click,
      })),
      writable: true,
    })
    const getCallRecord = jest.fn().mockImplementation(() => Promise.resolve('file.mp3'))
    wrapper.setMethods({
      getCallRecord,
    })
    await wrapper.vm.download()
    setTimeout(() => {
      expect(getCallRecord).toHaveBeenCalledWith(123)
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith(
        { data: 'file.mp3', type: 'audio/mpeg' },
      )
      expect(wrapper.vm.state).toBe(0)
      Object.defineProperty(global.document, 'createElement', {
        value: createElement,
        writable: true,
      })
      done()
    }, 0)
  })

  it('download loads source failure case', async (done) => {
    const error = {
      response: {
        status: 401,
      },
    }
    const getCallRecord = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.setMethods({
      getCallRecord,
    })
    await wrapper.vm.download()
    setTimeout(() => {
      expect(getCallRecord).toHaveBeenCalledWith(123)
      expect(wrapper.vm.state).toBe(2)
      expect(wrapper.vm.lastErrorMessage.length).toBeGreaterThan(0)
      done()
    }, 0)
  })
})
