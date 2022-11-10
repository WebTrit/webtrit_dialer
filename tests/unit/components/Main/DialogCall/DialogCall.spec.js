import { shallowMount, createLocalVue } from '@vue/test-utils'
import DialogCall from '@/components/Main/DialogCall/DialogCall.vue'

const contacts = {
  methods: {
    $_contacts_getOneContactExt() {
      return {
        initials: 'AA',
        email: 'test@test.com',
        sip_status: 0,
        number: '2345',
      }
    },
    $_contacts_getOneContact() {
      return {
        initials: 'QW',
        email: 'test@test.com',
        sip_status: 0,
        number: '879',
      }
    },
  },
}

describe('DialogCall.vue', () => {
  const localVue = createLocalVue()
  const dispatch = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DialogCall, {
      localVue,
      mixins: [contacts],
      data() {
        return {
          callInfoSwitch:
            {
              name: 'BB',
              number: '2345',
            },
          callStateSwitch: 'calling',
          localStreamSwitch: null,
          remoteStreamSwitch: null,
          callAcceptedSwitch: true,
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
        localStream: {
          get() {
            return this.localStreamSwitch
          },
          set(val) {
            this.localStreamSwitch = val
          },
        },
        remoteStream: {
          get() {
            return this.remoteStreamSwitch
          },
          set(val) {
            this.remoteStreamSwitch = val
          },
        },
        callInfo: {
          get() {
            return this.callInfoSwitch
          },
          set(val) {
            this.callInfoSwitch = val
          },
        },
        remoteStreamHasVideo() {
          return false
        },
        isCallAccepted: {
          get() {
            return this.callAcceptedSwitch
          },
          set(val) {
            this.callAcceptedSwitch = val
          },
        },
      },
      mocks: {
        $vuetify: {
          breakpoint: {},
        },
        $store: {
          dispatch,
        },
      },
      stubs: ['v-dialog', 'v-container', 'v-row'],
    })
  })

  it('callDescription returns contactInfo.name if it\'s present', async () => {
    await wrapper.setData({
      contactInfo: {
        name: 'AA',
      },
    })
    expect(wrapper.vm.callDescription).toBe('AA')
  })

  it('callDescription returns callInfo.name if contactInfo is not provided', async () => {
    expect(wrapper.vm.callDescription).toBe('BB')
  })

  it('callDescription returns callInfo.number if contactInfo and callInfo.name are not provided', async () => {
    wrapper.vm.callInfo = {
      number: '23445',
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.callDescription).toBe('23445')
  })

  it('isCallActive returns true if callState is not in hangup phase', () => {
    expect(wrapper.vm.isCallActive).toBe(true)
  })

  it('isCallActive returns false if callState is in hangingup phase', async () => {
    await wrapper.setData({
      callStateSwitch: 'hangingup',
    })
    expect(wrapper.vm.isCallActive).toBe(false)
  })

  it('isCallActive returns false if callState is in hangup phase', async () => {
    await wrapper.setData({
      callStateSwitch: 'hangup',
    })
    expect(wrapper.vm.isCallActive).toBe(false)
  })

  it('isCallActive returns false if callState is null', async () => {
    await wrapper.setData({
      callStateSwitch: null,
    })
    expect(wrapper.vm.isCallActive).toBe(false)
  })

  it('keypadClick calls store action', () => {
    wrapper.vm.keypadClick('2')
    expect(dispatch).toHaveBeenCalledWith('webrtc/sendDtmf', '2')
  })

  it('updateContactInfo updates contact based on number', () => {
    const contact = {
      name: 'CC',
      number: '2345',
    }
    wrapper.vm.updateContactInfo({
      contact,
      type: 'number',
    })
    expect(wrapper.vm.contactInfo).toEqual(contact)
  })

  it('updateContactInfo updates contact based on extension', () => {
    const contact = {
      name: 'CC',
      extension_id: '2345',
    }
    wrapper.vm.updateContactInfo({
      contact,
      type: 'ext',
    })
    expect(wrapper.vm.contactInfo).toEqual(contact)
  })

  it('getExtension updates contact if it\'s present in contacts array', () => {
    const spy_updateContactInfo = jest.spyOn(wrapper.vm, 'updateContactInfo')
    wrapper.vm.getExtension('123')
    expect(spy_updateContactInfo).toHaveBeenCalledWith({
      contact: {
        initials: 'AA',
        email: 'test@test.com',
        sip_status: 0,
        number: '2345',
      },
      type: 'ext',
    })
  })

  it('getExtension sets contactInfo to null if contact is not found in contacts array', () => {
    wrapper.vm.$_contacts_getOneContactExt = jest.fn().mockImplementation(() => null)
    const spy_updateContactInfo = jest.spyOn(wrapper.vm, 'updateContactInfo')
    wrapper.vm.getExtension('123')
    expect(spy_updateContactInfo).not.toHaveBeenCalled()
    expect(wrapper.vm.contactInfo).toBeNull()
    expect(wrapper.vm.unknownInterlocutor).toEqual({
      number: '123',
      unknown: true,
    })
  })

  it('localStream watcher sets localStream to video tag', async () => {
    wrapper.vm.$refs = {
      localStream: {
        srcObject: null,
      },
    }
    wrapper.vm.localStream = 'new stream'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$refs.localStream.srcObject).toBe('new stream')
  })

  it('remoteStream watcher sets localStream to video tag', async () => {
    wrapper.vm.$refs = {
      remoteStream: {
        srcObject: null,
      },
    }
    wrapper.vm.remoteStream = 'new stream'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$refs.remoteStream.srcObject).toBe('new stream')
  })

  it('isCallAccepted watcher resets keypad on call end', async () => {
    await wrapper.setData({
      keypad: true,
    })
    wrapper.vm.isCallAccepted = false
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.keypad).toBe(false)
  })

  it(`callInfo watcher calls updateContactInfo if callInfo changes and contact is
  found in contacts array by number`, async () => {
    const spy_updateContactInfo = jest.spyOn(wrapper.vm, 'updateContactInfo')
    wrapper.vm.callInfo = {
      number: '879',
    }
    await wrapper.vm.$nextTick()
    expect(spy_updateContactInfo).toHaveBeenCalledWith({
      contact: {
        initials: 'QW',
        email: 'test@test.com',
        sip_status: 0,
        number: '879',
      },
      type: 'number',
    })
  })

  it(`callInfo watcher calls getExtension if callInfo changes and contact is
  not found in contacts array by number`, async () => {
    wrapper.vm.$_contacts_getOneContact = jest.fn().mockImplementation(() => null)
    const spy_getExtension = jest.spyOn(wrapper.vm, 'getExtension')
    wrapper.vm.callInfo = {
      number: '1879',
    }
    await wrapper.vm.$nextTick()
    expect(spy_getExtension).toHaveBeenCalledWith('1879')
  })
})
