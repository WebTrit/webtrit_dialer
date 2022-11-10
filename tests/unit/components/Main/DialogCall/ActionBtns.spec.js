import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import ActionBtns from '@/components/Main/DialogCall/ActionBtns.vue'

config.showDeprecationWarnings = false

describe('ActionBtns.vue', () => {
  const localVue = createLocalVue()
  const startCallDuration = jest.fn()
  const stopCallDuration = jest.fn()
  const answer = jest.fn()
  const drop = jest.fn()

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ActionBtns, {
      localVue,
      data() {
        return {
          callStateSwitch: 'ringing',
          localStreamHasVideoSwitch: false,
          isCallAcceptedSwitch: false,
          videoCallSwitch: false,
        }
      },
      computed: {
        callState: {
          get() {
            return this.callStateSwitch
          },
          set(val) {
            this.callStateSwitch = val
          },
        },
        localStreamHasVideo: {
          get() {
            return this.localStreamHasVideoSwitch
          },
          set(val) {
            this.localStreamHasVideoSwitch = val
          },
        },
        isCallAccepted: {
          get() {
            return this.isCallAcceptedSwitch
          },
          set(val) {
            this.isCallAcceptedSwitch = val
          },
        },
        videoCall: {
          get() {
            return this.videoCallSwitch
          },
          set(val) {
            this.videoCallSwitch = val
          },
        },
      },
      methods: {
        startCallDuration,
        stopCallDuration,
        answer,
        drop,
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {
            xs: false,
            sm: true,
          },
        },
      },
      stubs: ['v-row'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('outgoingCall returns true if callState is ringing', () => {
    wrapper.vm.callState = 'ringing'
    expect(wrapper.vm.outgoingCall).toBe(true)
  })

  it('outgoingCall returns true if callState is proceeding', () => {
    wrapper.vm.callState = 'proceeding'
    expect(wrapper.vm.outgoingCall).toBe(true)
  })

  it('outgoingCall returns true if callState is calling', () => {
    wrapper.vm.callState = 'calling'
    expect(wrapper.vm.outgoingCall).toBe(true)
  })

  it('outgoingCall returns true if callState is outgoingcall', () => {
    wrapper.vm.callState = 'outgoingcall'
    expect(wrapper.vm.outgoingCall).toBe(true)
  })

  it('outgoingCall returns false if callState is accepted', () => {
    wrapper.vm.callState = 'accepted'
    expect(wrapper.vm.outgoingCall).toBe(false)
  })

  it('acceptedCall returns true if callState is accepted', () => {
    wrapper.vm.callState = 'accepted'
    expect(wrapper.vm.acceptedCall).toBe(true)
  })

  it('acceptedCall returns true if callState is answered', () => {
    wrapper.vm.callState = 'answered'
    expect(wrapper.vm.acceptedCall).toBe(true)
  })

  it('acceptedCall returns false if callState is calling', () => {
    wrapper.vm.callState = 'calling'
    expect(wrapper.vm.acceptedCall).toBe(false)
  })

  it('toggleKeypad toggles keypad variable and emits event to parent', () => {
    wrapper.vm.toggleKeypad()
    expect(wrapper.vm.keypad).toBe(true)
    expect(wrapper.emitted()['toggle-keypad'][0]).toEqual([true])
  })

  it('toggleKeypad toggles keypad variable and emits event to parent', () => {
    wrapper.vm.toggleKeypad()
    expect(wrapper.vm.keypad).toBe(true)
    expect(wrapper.emitted()['toggle-keypad'][0]).toEqual([true])
  })

  it('isCallAccepted watcher calls startCallDuration when call gets accepted', async () => {
    wrapper.vm.isCallAccepted = true
    await wrapper.vm.$nextTick()
    expect(startCallDuration).toHaveBeenCalled()
  })

  it('isCallAccepted watcher calls stopCallDuration when call gets ended', async () => {
    wrapper.vm.isCallAccepted = true
    await wrapper.vm.$nextTick()
    wrapper.vm.isCallAccepted = false
    await wrapper.vm.$nextTick()
    expect(stopCallDuration).toHaveBeenCalled()
  })

  it('isCallAccepted watcher resets data when call gets ended', async () => {
    wrapper.vm.keypad = true
    wrapper.vm.isCallAccepted = true
    await wrapper.vm.$nextTick()
    wrapper.vm.isCallAccepted = false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.keypad).toBe(false)
  })

  it('renders block for incoming audio call', async () => {
    wrapper.vm.callState = 'incomingcall'
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('actionbtn-stub').at(0).attributes().icon).toBe('$audio')
    expect(wrapper.findAll('actionbtn-stub').at(1).attributes().icon).toBe('$drop')
  })

  it('renders block for incoming video call', async () => {
    wrapper.vm.callState = 'incomingcall'
    wrapper.vm.videoCall = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('actionbtn-stub').at(0).attributes().icon).toBe('$video')
    expect(wrapper.findAll('actionbtn-stub').at(1).attributes().icon).toBe('$drop')
  })

  it('renders block for outgoing call', async () => {
    wrapper.vm.callState = 'calling'
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('actionbtn-stub').at(0).attributes().icon).toBe('$drop')
  })

  it('renders block for accepted audio call', async () => {
    wrapper.vm.callState = 'accepted'
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('actionbtn-stub').at(0).attributes().icon).toBe('$call-keypad')
    expect(wrapper.find('transferbtn-stub').exists()).toBe(true)
    expect(wrapper.find('transferpopup-stub').exists()).toBe(true)
    expect(wrapper.find('holdbtn-stub').exists()).toBe(true)
    expect(wrapper.find('toggleaudiobtn-stub').exists()).toBe(true)
    expect(wrapper.find('togglevideobtn-stub').exists()).toBe(false)
    expect(wrapper.find('timerbtn-stub').exists()).toBe(true)
    expect(wrapper.findAll('actionbtn-stub').at(1).attributes().icon).toBe('$drop')
  })

  it('renders block for accepted video call', async () => {
    wrapper.vm.callState = 'accepted'
    wrapper.vm.localStreamHasVideo = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('actionbtn-stub').at(0).attributes().icon).toBe('$call-keypad')
    expect(wrapper.find('transferbtn-stub').exists()).toBe(true)
    expect(wrapper.find('transferpopup-stub').exists()).toBe(true)
    expect(wrapper.find('holdbtn-stub').exists()).toBe(true)
    expect(wrapper.find('toggleaudiobtn-stub').exists()).toBe(true)
    expect(wrapper.find('togglevideobtn-stub').exists()).toBe(true)
    expect(wrapper.find('timerbtn-stub').exists()).toBe(true)
    expect(wrapper.findAll('actionbtn-stub').at(1).attributes().icon).toBe('$drop')
  })

  it('timer is not rendered on small screens', async () => {
    wrapper.vm.$vuetify.breakpoint.xs = true
    wrapper.vm.$vuetify.breakpoint.sm = false
    wrapper.vm.callState = 'accepted'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('timerbtn-stub').exists()).toBe(false)
  })
})
