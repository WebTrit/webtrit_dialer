import { shallowMount, createLocalVue } from '@vue/test-utils'
import CallInfo from '@/components/Main/DialogCall/CallInfo.vue'

describe('CallInfo.vue', () => {
  const localVue = createLocalVue()

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(CallInfo, {
      localVue,
      propsData: {
        contactInfo: {
          email: 'test@test.com',
          initials: 'U',
          unknown: false,
          number: '989393',
        },
        callDescription: 'interlocutor',
      },
      data() {
        return {
          isCallInitiatingSwitch: false,
          isCallIncomingSwitch: false,
          isCallOutgoingSwitch: false,
          isCallAcceptedSwitch: false,
          callInfoSwitch: {
            initials: 'TU',
          },
        }
      },
      computed: {
        callInfo: {
          get() {
            return this.callInfoSwitch
          },
          set(val) {
            this.callInfoSwitch = val
          },
        },
        remoteStreamHasVideo() {
          return true
        },
        isCallInitiating: {
          get() {
            return this.isCallInitiatingSwitch
          },
          set(val) {
            this.isCallInitiatingSwitch = val
          },
        },
        isCallIncoming: {
          get() {
            return this.isCallIncomingSwitch
          },
          set(val) {
            this.isCallIncomingSwitch = val
          },
        },
        isCallOutgoing: {
          get() {
            return this.isCallOutgoingSwitch
          },
          set(val) {
            this.isCallOutgoingSwitch = val
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
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-row', 'v-col'],
    })
  })

  it('callInitials returns contactInfo initials if they are provided', () => {
    expect(wrapper.vm.callInitials).toBe('U')
  })

  it('callInitials returns callInfo initials if contactInfo is not provided', async () => {
    await wrapper.setProps({
      contactInfo: {
        email: 'test@test.com',
        unknown: true,
        number: '432434',
      },
    })
    expect(wrapper.vm.callInitials).toBe('TU')
  })

  it('callInitials returns empty string if callInfo initials and contactInfo are not provided', async () => {
    await wrapper.setProps({
      contactInfo: {
        email: 'test@test.com',
        unknown: true,
        number: '432434',
      },
    })
    wrapper.vm.callInfo = {}
    expect(wrapper.vm.callInitials).toBe('')
  })

  it('callInitials returns empty string if callInfo and contactInfo are not provided', async () => {
    await wrapper.setProps({
      contactInfo: {
        email: 'test@test.com',
        unknown: true,
        number: '432434',
      },
    })
    wrapper.vm.callInfo = {}
    expect(wrapper.vm.callInitials).toBe('')
  })

  it('callState returns hangup if isCallInitiating === false && isCallAccepted === false ', () => {
    expect(wrapper.vm.callState).toMatch(/hangup/i)
  })

  it('callState returns incoming if isCallInitiating === true && isCallIncoming ==== true', () => {
    wrapper.vm.isCallInitiating = true
    wrapper.vm.isCallIncoming = true
    expect(wrapper.vm.callState).toMatch(/incoming/i)
  })

  it('callState returns calling if isCallInitiating === true and isCallOutgoing ==== true', () => {
    wrapper.vm.isCallInitiating = true
    wrapper.vm.isCallOutgoing = true
    expect(wrapper.vm.callState).toMatch(/calling/i)
  })

  it(`callState returns unknown if isCallInitiating === true and isCallOutgoing ==== false && 
  isCallIncoming === false`, () => {
    wrapper.vm.isCallInitiating = true
    expect(wrapper.vm.callState).toMatch(/unknown/i)
  })

  it('callState returns accepted if isCallAccepted === true', () => {
    wrapper.vm.isCallAccepted = true
    expect(wrapper.vm.callState).toMatch(/accepted/i)
  })
})
