/* eslint-disable func-names */
import webrtc from '@/store/modules/webrtc'
import { webtritSignaling } from '@/store/helpers'
import { handleCleanEvent, handleEvent } from '@/store/modules/webrtcEvents'

jest.mock('@/env-config', () => ({
  envConfig: {
    webtritCoreSignalingUrl: 'https://some-address',
  },
}))

jest.mock('@/store/helpers', () => ({
  webtritSignaling: {
    webtritSignalingClient: {
      init: jest.fn().mockImplementation(({ gotSuccess }) => gotSuccess()),
      close: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
      call: jest.fn(),
      answer: jest.fn(),
      decline: jest.fn(),
      hangUp: jest.fn(),
      sendDtmf: jest.fn(),
      transfer: jest.fn(),
      mute: jest.fn(),
      hold: jest.fn(),
      deinit: jest.fn(),
    },
    // eslint-disable-next-line object-shorthand
    getClient: function () { return this.webtritSignalingClient },
  },
}))

jest.mock('@/store/modules/webrtcEvents', () => ({
  handleEvent: jest.fn(),
  handleCleanEvent: jest.fn(),
}))

describe('webrtc.js getters', () => {
  it('isRegistered returns boolean based on state.registrationEvent.event', () => {
    const state = {
      registrationEvent: {
        event: 'registered',
      },
    }
    expect(webrtc.getters.isRegistered(state)).toBe(true)
  })

  it('registrationStatus returns state.registrationEvent.event', () => {
    const state = {
      registrationEvent: {
        event: 'registered',
      },
    }
    expect(webrtc.getters.registrationStatus(state)).toBe('registered')
  })

  it('registrationStatusColor returns grey if status is unregistered', () => {
    const getters = {
      registrationStatus: 'unregistered',
    }
    expect(webrtc.getters.registrationStatusColor({}, getters)).toBe('grey')
  })

  it('registrationStatusColor returns yellow if status is unregistering', () => {
    const getters = {
      registrationStatus: 'unregistering',
    }
    expect(webrtc.getters.registrationStatusColor({}, getters)).toBe('yellow')
  })

  it('registrationStatusColor returns yellow if status is registering', () => {
    const getters = {
      registrationStatus: 'registering',
    }
    expect(webrtc.getters.registrationStatusColor({}, getters)).toBe('yellow')
  })

  it('registrationStatusColor returns green if status is registered', () => {
    const getters = {
      registrationStatus: 'registered',
    }
    expect(webrtc.getters.registrationStatusColor({}, getters)).toBe('green')
  })

  it('registrationStatusColor returns red in default case', () => {
    const getters = {
      registrationStatus: null,
    }
    expect(webrtc.getters.registrationStatusColor({}, getters)).toBe('red')
  })

  it('isCallActive returns boolean based on state.callType', () => {
    const state = {
      callType: 'incoming',
    }
    expect(webrtc.getters.isCallActive(state)).toBe(true)
  })

  it('isCallInitiating returns boolean based on state.callState', () => {
    const state = {
      callState: 'incomingcall',
    }
    expect(webrtc.getters.isCallInitiating(state)).toBe(true)
  })

  it('isCallIncoming returns true if state.callType === "incoming"', () => {
    const state = {
      callType: 'incoming',
    }
    expect(webrtc.getters.isCallIncoming(state)).toBe(true)
  })

  it('isCallIncoming returns false if state.callType !== "incoming"', () => {
    const state = {
      callType: 'outgoing',
    }
    expect(webrtc.getters.isCallIncoming(state)).toBe(false)
  })

  it('isCallOutgoing returns true if state.callType === "outgoing"', () => {
    const state = {
      callType: 'outgoing',
    }
    expect(webrtc.getters.isCallOutgoing(state)).toBe(true)
  })

  it('isCallOutgoing returns false if state.callType !== "outgoing"', () => {
    const state = {
      callType: 'incoming',
    }
    expect(webrtc.getters.isCallOutgoing(state)).toBe(false)
  })

  it('isCallAccepted returns true if state.callType === "accepted"', () => {
    const state = {
      callState: 'accepted',
    }
    expect(webrtc.getters.isCallAccepted(state)).toBe(true)
  })

  it('isCallAccepted returns true if state.callType === "answered"', () => {
    const state = {
      callState: 'answered',
    }
    expect(webrtc.getters.isCallAccepted(state)).toBe(true)
  })

  it('isCallAccepted returns false if state.callType !== "answered" || "accepted"', () => {
    const state = {
      callState: 'ringing',
    }
    expect(webrtc.getters.isCallAccepted(state)).toBe(false)
  })

  it('localStreamHasVideo returns true if localStream has video tracks', () => {
    const state = {
      localStream: {
        getVideoTracks: () => ['video track'],
      },
    }
    expect(webrtc.getters.localStreamHasVideo(state)).toBe(true)
  })

  it('localStreamHasVideo returns false if localStream has no video tracks', () => {
    const state = {
      localStream: {
        getVideoTracks: () => [],
      },
    }
    expect(webrtc.getters.localStreamHasVideo(state)).toBe(false)
  })

  it('localStreamHasVideo returns false if localStream doesn\'t exist', () => {
    const state = {
      localStream: null,
    }
    expect(webrtc.getters.localStreamHasVideo(state)).toBeFalsy()
  })

  it('localStreamHasAudio returns true if localStream has audio tracks', () => {
    const state = {
      localStream: {
        getAudioTracks: () => ['audio track'],
      },
    }
    expect(webrtc.getters.localStreamHasAudio(state)).toBe(true)
  })

  it('localStreamHasAudio returns false if localStream has no audio tracks', () => {
    const state = {
      localStream: {
        getAudioTracks: () => [],
      },
    }
    expect(webrtc.getters.localStreamHasAudio(state)).toBe(false)
  })

  it('localStreamHasAudio returns false if localStream doesn\'t exist', () => {
    const state = {
      localStream: null,
    }
    expect(webrtc.getters.localStreamHasAudio(state)).toBeFalsy()
  })

  it('remoteStreamHasVideo returns true if remoteStream has video tracks', () => {
    const state = {
      remoteStream: {
        getVideoTracks: () => ['video track'],
      },
    }
    expect(webrtc.getters.remoteStreamHasVideo(state)).toBe(true)
  })

  it('remoteStreamHasVideo returns false if remoteStream has no video tracks', () => {
    const state = {
      remoteStream: {
        getVideoTracks: () => [],
      },
    }
    expect(webrtc.getters.remoteStreamHasVideo(state)).toBe(false)
  })

  it('remoteStreamHasVideo returns false if remoteStream doesn\'t exist', () => {
    const state = {
      remoteStream: null,
    }
    expect(webrtc.getters.remoteStreamHasVideo(state)).toBeFalsy()
  })

  it('remoteStreamHasAudio returns true if remoteStream has audio tracks', () => {
    const state = {
      remoteStream: {
        getAudioTracks: () => ['audio track'],
      },
    }
    expect(webrtc.getters.remoteStreamHasAudio(state)).toBe(true)
  })

  it('remoteStreamHasAudio returns false if remoteStream has no audio tracks', () => {
    const state = {
      remoteStream: {
        getAudioTracks: () => [],
      },
    }
    expect(webrtc.getters.remoteStreamHasAudio(state)).toBe(false)
  })

  it('remoteStreamHasAudio returns false if remoteStream doesn\'t exist', () => {
    const state = {
      remoteStream: null,
    }
    expect(webrtc.getters.remoteStreamHasAudio(state)).toBeFalsy()
  })

  it('videoCall returns boolean based on localCallMediaType if state.callType === "outgoing"', () => {
    const state = {
      callType: 'outgoing',
      localCallMediaType: 'audio',
    }
    expect(webrtc.getters.videoCall(state)).toBe(false)
  })

  it('videoCall returns boolean based on remoteCallMediaType if state.callType !== "outgoing"', () => {
    const state = {
      incoming: 'outgoing',
      remoteCallMediaType: 'video',
    }
    expect(webrtc.getters.videoCall(state)).toBe(true)
  })
})

describe('webrtc.js mutations', () => {
  it('setRegistrationEvent sets registrationEvent', () => {
    const state = {}
    webrtc.mutations.setRegistrationEvent(state, { event: 'registered' })
    expect(state.registrationEvent).toEqual({ event: 'registered' })
  })

  it('setSessionId sets sessionId', () => {
    const state = {}
    webrtc.mutations.setSessionId(state, '3749348398')
    expect(state.sessionId).toBe('3749348398')
  })

  it('setSessionError sets sessionError', () => {
    const state = {}
    webrtc.mutations.setSessionError(state, '401')
    expect(state.sessionError).toBe('401')
  })

  it('setCallType sets callType', () => {
    const state = {}
    webrtc.mutations.setCallType(state, 'outgoing')
    expect(state.callType).toBe('outgoing')
  })

  it('setCallState sets callState', () => {
    const state = {}
    webrtc.mutations.setCallState(state, 'ringing')
    expect(state.callState).toBe('ringing')
  })

  it('setCallInfo sets callInfo', () => {
    const state = {}
    webrtc.mutations.setCallInfo(state, { number: 'erer' })
    expect(state.callInfo).toEqual({ number: 'erer' })
  })

  it('setCallId sets callId', () => {
    const state = {}
    webrtc.mutations.setCallId(state, '3434')
    expect(state.callId).toBe('3434')
  })

  it('setLocalStream sets localStream', () => {
    const state = {}
    webrtc.mutations.setLocalStream(state, 'stream')
    expect(state.localStream).toBe('stream')
  })

  it('setRemoteStream sets remoteStream', () => {
    const state = {}
    webrtc.mutations.setRemoteStream(state, 'stream')
    expect(state.remoteStream).toBe('stream')
  })

  it('setIncomingCallJsep sets incomingCallJsep', () => {
    const state = {}
    webrtc.mutations.setIncomingCallJsep(state, 'jsep')
    expect(state.incomingCallJsep).toBe('jsep')
  })

  it('setAudioEnabled sets audioEnabled', () => {
    const state = {}
    webrtc.mutations.setAudioEnabled(state, true)
    expect(state.audioEnabled).toBe(true)
  })

  it('setVideoEnabled sets videoEnabled', () => {
    const state = {}
    webrtc.mutations.setVideoEnabled(state, true)
    expect(state.videoEnabled).toBe(true)
  })

  it('setLocalCallMediaType sets localCallMediaType to null if video param is null', () => {
    const state = {}
    webrtc.mutations.setLocalCallMediaType(state, null)
    expect(state.localCallMediaType).toBeNull()
  })

  it('setLocalCallMediaType sets localCallMediaType to video if video param is true', () => {
    const state = {}
    webrtc.mutations.setLocalCallMediaType(state, true)
    expect(state.localCallMediaType).toBe('video')
  })

  it('setLocalCallMediaType sets localCallMediaType to audio if video param is false', () => {
    const state = {}
    webrtc.mutations.setLocalCallMediaType(state, false)
    expect(state.localCallMediaType).toBe('audio')
  })

  it('setRemoteCallMediaType sets remoteCallMediaType to null if jsep param is null', () => {
    const state = {}
    webrtc.mutations.setRemoteCallMediaType(state, null)
    expect(state.remoteCallMediaType).toBeNull()
  })

  it('setRemoteCallMediaType sets remoteCallMediaType to video if jsep param contains video', () => {
    const state = {}
    webrtc.mutations.setRemoteCallMediaType(state, { sdp: 'params m=video UDP' })
    expect(state.remoteCallMediaType).toBe('video')
  })

  it('setRemoteCallMediaType sets remoteCallMediaType to audio if jsep param contains no video', () => {
    const state = {}
    webrtc.mutations.setRemoteCallMediaType(state, { sdp: 'params m=audio UDP' })
    expect(state.remoteCallMediaType).toBe('audio')
  })
})

describe('webrtc.js actions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deinit calls deinit fn and performs clean event', () => {
    const commit = jest.fn()
    webrtc.actions.deinit({ commit })
    expect(webtritSignaling.webtritSignalingClient.deinit).toHaveBeenCalled()
    expect(handleCleanEvent).toHaveBeenCalledWith({ commit })
  })

  it('hold calls hold fn', () => {
    webrtc.actions.hold({}, { active: true })
    expect(webtritSignaling.webtritSignalingClient.hold).toHaveBeenCalledWith(true)
  })

  it('mute calls mute fn', () => {
    webrtc.actions.mute({}, { enabled: true, video: true })
    expect(webtritSignaling.webtritSignalingClient.mute).toHaveBeenCalledWith({
      enabled: true,
      video: true,
      gotMuted: expect.any(Function),
    })
  })

  it('mute calls commit triggered by callback with video === true', () => {
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.mute = jest.fn().mockImplementation(({ gotMuted }) => gotMuted())
    webrtc.actions.mute({ commit }, { enabled: true, video: true })
    expect(commit).toHaveBeenCalledWith('setVideoEnabled', true)
    webtritSignaling.webtritSignalingClient.mute.mockClear()
  })

  it('mute calls commit triggered by callback with video === false', () => {
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.mute = jest.fn().mockImplementation(({ gotMuted }) => gotMuted())
    webrtc.actions.mute({ commit }, { enabled: true, video: false })
    expect(commit).toHaveBeenCalledWith('setAudioEnabled', true)
    webtritSignaling.webtritSignalingClient.mute.mockClear()
  })

  it('transfer calls transfer fn', () => {
    webrtc.actions.transfer({}, '84954957')
    expect(webtritSignaling.webtritSignalingClient.transfer).toHaveBeenCalledWith('84954957')
  })

  it('sendDtmf calls sendDtmf fn', () => {
    webrtc.actions.sendDtmf({}, '3')
    expect(webtritSignaling.webtritSignalingClient.sendDtmf).toHaveBeenCalledWith('3')
  })

  it('drop calls decline fn if call is incoming', () => {
    const getters = {
      isCallIncoming: true,
      isCallAccepted: false,
    }
    webrtc.actions.drop({ getters })
    expect(webtritSignaling.webtritSignalingClient.decline).toHaveBeenCalled()
  })

  it('drop calls hangUp fn if call is accepted', () => {
    const getters = {
      isCallIncoming: true,
      isCallAccepted: true,
    }
    webrtc.actions.drop({ getters })
    expect(webtritSignaling.webtritSignalingClient.hangUp).toHaveBeenCalled()
  })

  it('answer calls answer fn', () => {
    const state = {
      incomingCallJsep: { sdp: 'oskdosidosi' },
    }
    webrtc.actions.answer({ state }, { video: true })
    expect(webtritSignaling.webtritSignalingClient.answer).toHaveBeenCalledWith({
      jsep: { sdp: 'oskdosidosi' },
      media: { audio: true, video: true },
      gotLocalStream: expect.any(Function),
      gotRemoteStream: expect.any(Function),
      gotError: expect.any(Function),
    })
  })

  it('answer gotLocalStream callback triggers commit', () => {
    const state = {
      incomingCallJsep: { sdp: 'oskdosidosi' },
    }
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.answer = jest.fn()
      .mockImplementation(({ gotLocalStream }) => gotLocalStream('stream'))
    webrtc.actions.answer({ state, commit }, { video: true })
    expect(commit).toHaveBeenCalledWith('setLocalStream', 'stream')
    webtritSignaling.webtritSignalingClient.answer.mockClear()
  })

  it('answer gotRemoteStream callback triggers commit', () => {
    const state = {
      incomingCallJsep: { sdp: 'oskdosidosi' },
    }
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.answer = jest.fn()
      .mockImplementation(({ gotRemoteStream }) => gotRemoteStream('stream'))
    webrtc.actions.answer({ state, commit }, { video: true })
    expect(commit).toHaveBeenCalledWith('setRemoteStream', 'stream')
    webtritSignaling.webtritSignalingClient.answer.mockClear()
  })

  it('answer error callback triggers dispatch and clean event', () => {
    const state = {
      incomingCallJsep: { sdp: 'oskdosidosi' },
    }
    const dispatch = jest.fn()
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.answer = jest.fn()
      .mockImplementation(({ gotError }) => gotError({ message: 'error' }))
    webrtc.actions.answer({ state, commit, dispatch }, { video: true })
    expect(dispatch).toHaveBeenCalledWith('snackbar/show',
      { message: 'error' },
      { root: true })
    expect(handleCleanEvent).toHaveBeenCalledWith({ commit })
    webtritSignaling.webtritSignalingClient.answer.mockClear()
  })

  it('call calls call fn', () => {
    const commit = jest.fn()
    webrtc.actions.call({ commit }, { number: '3439894', video: true })
    expect(commit).toHaveBeenCalledWith('setLocalCallMediaType', true)
    expect(webtritSignaling.webtritSignalingClient.call).toHaveBeenCalledWith({
      media: { audio: true, video: true },
      number: '3439894',
      gotSuccess: expect.any(Function),
      gotLocalStream: expect.any(Function),
      gotRemoteStream: expect.any(Function),
      gotError: expect.any(Function),
    })
  })

  it('call success callback triggers commit', () => {
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.call = jest.fn().mockImplementation(({ gotSuccess }) => gotSuccess())
    webrtc.actions.call({ commit }, {
      number: '3439894', video: true, initials: 'AA', name: 'user',
    })
    expect(commit).toHaveBeenCalledWith('setLocalCallMediaType', true)
    expect(commit).toHaveBeenCalledWith('setCallState', 'outgoingcall')
    expect(commit).toHaveBeenCalledWith('setCallInfo', { number: '3439894', initials: 'AA', name: 'user' })
    expect(commit).toHaveBeenCalledWith('setCallType', 'outgoing')
    expect(commit).toHaveBeenCalledTimes(4)
    webtritSignaling.webtritSignalingClient.call.mockClear()
  })

  it('call gotLocalStream callback triggers commit', () => {
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.call = jest.fn()
      .mockImplementation(({ gotLocalStream }) => gotLocalStream('stream'))
    webrtc.actions.call({ commit }, {
      number: '3439894', video: true,
    })
    expect(commit).toHaveBeenCalledWith('setLocalCallMediaType', true)
    expect(commit).toHaveBeenCalledWith('setLocalStream', 'stream')
    expect(commit).toHaveBeenCalledTimes(2)
    webtritSignaling.webtritSignalingClient.call.mockClear()
  })

  it('call gotRemoteStream callback triggers commit', () => {
    const commit = jest.fn()
    webtritSignaling.webtritSignalingClient.call = jest.fn()
      .mockImplementation(({ gotRemoteStream }) => gotRemoteStream('stream'))
    webrtc.actions.call({ commit }, {
      number: '3439894', video: true,
    })
    expect(commit).toHaveBeenCalledWith('setLocalCallMediaType', true)
    expect(commit).toHaveBeenCalledWith('setRemoteStream', 'stream')
    expect(commit).toHaveBeenCalledTimes(2)
    webtritSignaling.webtritSignalingClient.call.mockClear()
  })

  it('call error callback triggers commit', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    webtritSignaling.webtritSignalingClient.call = jest.fn()
      .mockImplementation(({ gotError }) => gotError({ message: 'error' }))
    webrtc.actions.call({ commit, dispatch }, {
      number: '3439894', video: true,
    })
    expect(commit).toHaveBeenCalledWith('setLocalCallMediaType', true)
    expect(dispatch).toHaveBeenCalledWith('snackbar/show',
      { message: 'error' },
      { root: true })
    expect(handleCleanEvent).toHaveBeenCalledWith({ commit })
    webtritSignaling.webtritSignalingClient.call.mockClear()
  })

  it('unregister calls unregister fn', () => {
    webrtc.actions.unregister()
    expect(webtritSignaling.webtritSignalingClient.unregister).toHaveBeenCalled()
  })

  it('register calls register fn', () => {
    const rootGetters = {
      'account/info': {
        name: 'user',
      },
    }
    webrtc.actions.register({ rootGetters })
    expect(webtritSignaling.webtritSignalingClient.register).toHaveBeenCalledWith({
      name: 'user',
    })
  })

  it('init calls init fn', (done) => {
    const rootGetters = {
      'account/token': '334343',
    }
    webrtc.actions.init({ rootGetters })
    setTimeout(() => {
      expect(webtritSignaling.webtritSignalingClient.init).toHaveBeenCalledWith({
        server: 'https://some-address',
        token: '334343',
        gotSuccess: expect.any(Function),
        gotError: expect.any(Function),
        gotDestroyed: expect.any(Function),
        gotMessage: expect.any(Function),
      })
      done()
    }, 0)
  })

  it('init - message callback calls handleEvent', (done) => {
    const rootGetters = {
      'account/token': '334343',
    }
    webtritSignaling.webtritSignalingClient.init = jest.fn().mockImplementation(({ gotSuccess, gotMessage }) => {
      gotMessage({ event: 'some event' })
      return gotSuccess()
    })
    webrtc.actions.init({ rootGetters })
    setTimeout(() => {
      expect(handleEvent).toHaveBeenCalled()
      done()
    }, 0)
  })

  it('init - destroyed callback rejects promise', () => {
    const rootGetters = {
      'account/token': '334343',
    }
    const commit = jest.fn()
    const dispatch = jest.fn()
    webtritSignaling.webtritSignalingClient.init = jest.fn()
      .mockImplementation(({ gotDestroyed }) => gotDestroyed('some error'))
    webrtc.actions.init({ rootGetters, commit, dispatch }).catch(() => {
      expect(webtritSignaling.webtritSignalingClient.close).toHaveBeenCalled()
      expect(handleCleanEvent).toHaveBeenCalledWith({ commit })
      expect(commit).toHaveBeenCalledWith('setSessionError', 'some error')
      expect(dispatch).toHaveBeenCalledWith('snackbar/show',
        { message: 'some error' },
        { root: true })
    })
  })

  it('init - error callback rejects promise', () => {
    const rootGetters = {
      'account/token': '334343',
    }
    const commit = jest.fn()
    const dispatch = jest.fn()
    webtritSignaling.webtritSignalingClient.init = jest.fn()
      .mockImplementation(({ gotError }) => gotError('some error'))
    webrtc.actions.init({ rootGetters, commit, dispatch }).catch(() => {
      expect(webtritSignaling.webtritSignalingClient.close).toHaveBeenCalled()
      expect(handleCleanEvent).toHaveBeenCalledWith({ commit })
      expect(dispatch).toHaveBeenCalledWith('snackbar/show',
        { message: 'some error' },
        { root: true })
    })
  })
})
