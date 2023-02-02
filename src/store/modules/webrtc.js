/* eslint-disable no-shadow */
import Vue from 'vue'
import { envConfig } from '@/env-config'
import WebtritSignaling from '@webtrit/webtrit-signaling'
import PeerConnection from 'peer-connection'
import i18n from '@/plugins/i18n'
import { getErrorCode } from '@/store/helpers'
import axios from 'axios'

let webtritSignalingClient = null
let peerConnection = null
let eventType = null

const callStates = {
  NONE: 0,
  INCOMING: 10,
  OUTGOING: 20,
  ACCEPTED: 30,
}

const SLOWLINK_POOR_THRESHOLD = 30
const WS_CLOSE_CODE_UNREGISTER = 4302
const WS_CLOSE_CODE_MISSED_CREDENTIALS = 4412
const WS_CLOSE_CODE_ATTACH_ERROR = 4431

function snackbarShow(dispatch, message) {
  dispatch('snackbar/show',
    { message },
    { root: true })
}
/**
 *
 * @param commit
 * @param call_id
 */
function handleCleanEvent({ commit }, call_id) {
  commit('setLocalStream', null)
  commit('setRemoteStream', null)
  commit('setCallInfo', null)
  commit('setCallState', {
    call_state: callStates.NONE,
    call_id,
  })
  commit('setIncomingCallJsep', null)
  commit('setAudioEnabled', true)
  commit('setVideoEnabled', true)
  commit('setCallId', null)
  commit('setLocalCallMediaType', null)
  commit('setRemoteCallMediaType', null)
  if (peerConnection !== null) {
    peerConnection.close()
    peerConnection = null
  }
}

async function initPeerConnection({ commit, dispatch, call_id }) {
  return new PeerConnection({
    iceCandidateCallback: (candidate) => {
      try {
        webtritSignalingClient.execute('ice_trickle', {
          line: 0,
          candidate,
        })
      } catch (e) {
        console.error('Send candidate:', e)
      }
    },
    errorCallback: (error) => {
      console.log('Error callback:', error)
      if (error.fatal) {
        webtritSignalingClient.disconnect(error.code)
        handleCleanEvent({ commit }, call_id)
        commit('setSessionError', `${error.code} - ${error.message}`)
      } else {
        if (![701].includes(error.code)) {
          snackbarShow(dispatch, `${error.code} - ${error.message}`)
        }
      }
    },
    addStreamCallback: (stream, isRemote) => {
      if (isRemote) {
        commit('setRemoteStream', stream)
        console.info('Set remote stream', stream)
      } else {
        commit('setLocalStream', stream)
        console.info('Set local stream', stream)
      }
    },
  })
}

function handleIncomingCall({ commit, dispatch, event }, isCallActive) {
  console.log(event)
  console.log('Active call: ', isCallActive)
  if (isCallActive) {
    webtritSignalingClient.execute('hangup', {
      line: event.line,
      call_id: event.call_id,
    })
  } else {
    const number = event.caller
    const initials = ''
    const displayNameMatch = /^"?(?<name>[^@\n]*?)"?$/.exec(event.caller_display_name || '')
    const { name } = displayNameMatch.groups
    commit('setCallInfo', { number, initials, name })
    if (event.jsep) {
      commit('setIncomingCallJsep', event.jsep)
      commit('setRemoteCallMediaType', event.jsep)
    }
    commit('setCallId', event.call_id)
    commit('setCallState', {
      call_state: callStates.INCOMING,
      call_id: event.call_id,
    })
    dispatch('ringtones/playIncoming', null, { root: true })
  }
}

async function handleAcceptedCall({ commit, dispatch, event }) {
  console.log(event)
  commit('setCallId', event.call_id)
  try {
    if (event.jsep) {
      await peerConnection.setRemoteDescription(event.jsep)
      commit('setRemoteCallMediaType', event.jsep)
    }
    commit('setCallState', {
      call_state: callStates.ACCEPTED,
      call_id: event.call_id,
    })
    dispatch('ringtones/stop', null, { root: true })
  } catch (e) {
    console.error('handleAcceptedCall', e)
    snackbarShow(dispatch, `${(e.code || 'null')} - ${e.description || e.message}`)
    handleCleanEvent({ commit }, event.call_id)
  }
}

function handleHangupCall({ commit, dispatch, event }) {
  console.log(event)
  if (event.event === 'hangup') {
    commit('setCallState', {
      call_state: callStates.NONE,
      call_id: event.call_id,
    })
    dispatch('ringtones/stop', null, { root: true })
    dispatch('account/updateBalanceData', null, { root: true })
    handleCleanEvent({ commit }, event.call_id)
  }
  if (event.reason) {
    if (event.code) {
      snackbarShow(dispatch, `${event.code} - ${event.reason}`)
    } else {
      snackbarShow(dispatch, `${event.reason}`)
    }
  }
}

function handleOutgoingCall({ dispatch, event }) {
  console.log(event)
  dispatch('ringtones/playOutgoing', null, { root: true })
}

function handleState({ commit, dispatch, event }) {
  commit('setRegistrationStatus', event.event)
  if (event.code) {
    const msg = event.reason || event.description || 'Unknown'
    snackbarShow(dispatch, `${event.code} - ${msg}`)
  }
}

function handleIceEvent({ dispatch, event }) {
  console.log('handleIceEvent', event)
  let message = ''
  if (event.event === 'ice_slowlink') {
    if (event.lost > 0 && event.lost <= SLOWLINK_POOR_THRESHOLD) {
      message = i18n.t('errors.ice_slowlink.weak')
    } else if (event.lost > SLOWLINK_POOR_THRESHOLD) {
      message = i18n.t('errors.ice_slowlink.poor')
    }
    if (message.length > 0) {
      snackbarShow(dispatch, message)
    }
  }
}

// eslint-disable-next-line no-unused-vars
function handleChangeCall({ commit, dispatch, event }) {
  console.log('handleChangeCall', event)
}

// eslint-disable-next-line no-unused-vars
function handleNotifyEvent({ commit, dispatch, event }) {
  console.log('handleNotifyEvent', event)
  const [, code] = event.content.split(' ')
  let message
  if (i18n.getLocaleMessage(i18n.locale)?.call_msgs
      && i18n.getLocaleMessage(i18n.locale).call_msgs[code]) {
    message = i18n.getLocaleMessage(i18n.locale).call_msgs[code]
  } else if (i18n.getLocaleMessage(i18n.fallbackLocale).call_msgs[code]) {
    message = i18n.getLocaleMessage(i18n.fallbackLocale).call_msgs[code]
  } else {
    message = i18n.t(`call_errors["${getErrorCode(+code)}"]`)
  }
  if (+code !== 100) {
    dispatch('webrtc/hold', { active: false }, { root: true })
  }
  snackbarShow(dispatch, message)
}

const state = () => ({
  sessionError: null,
  registrationStatus: 'unknown',
  callState: {},
  callInfo: null,
  callId: null,
  localCallMediaType: null,
  remoteCallMediaType: null,
  localStream: null,
  remoteStream: null,
  incomingCallJsep: null,
  audioEnabled: true,
  videoEnabled: true,
})

const getters = {
  isRegistered(state) {
    return state.registrationStatus === 'registered'
  },
  registrationStatus(state) {
    return state.registrationStatus
  },
  registrationStatusColor(state) {
    switch (state.registrationStatus) {
      case 'unregistered':
      case 'registration_failed':
        return 'red'
      case 'unregistering':
      case 'registering':
        return 'yellow'
      case 'registered':
        return 'green'
      default:
        return 'grey'
    }
  },
  isCallActive(state) {
    return Object.keys(state.callState).length > 0
  },
  isCallInitiating(state) {
    return state.callState[state.callId] === callStates.INCOMING
        || state.callState[state.callId] === callStates.OUTGOING
  },
  isCallIncoming(state) {
    return state.callState[state.callId] === callStates.INCOMING
  },
  isCallOutgoing(state) {
    return state.callState[state.callId] === callStates.OUTGOING
  },
  isCallAccepted(state) {
    return state.callState[state.callId] === callStates.ACCEPTED
  },
  localStreamHasVideo(state) {
    return state.localStream && state.localStream.getVideoTracks().length > 0
  },
  localStreamHasAudio(state) {
    return state.localStream && state.localStream.getAudioTracks().length > 0
  },
  remoteStreamHasVideo(state) {
    return state.remoteStream && state.remoteStream.getVideoTracks().length > 0
  },
  remoteStreamHasAudio(state) {
    return state.remoteStream && state.remoteStream.getAudioTracks().length > 0
  },
  videoCall(state) {
    if (state.callState[state.callId] === callStates.OUTGOING) {
      return state.localCallMediaType === 'video'
    } else {
      return state.remoteCallMediaType === 'video'
    }
  },
  getCallId(state) {
    return state.callId
  },
  getIncomingCallJsep(state) {
    return state.incomingCallJsep
  },
}

const mutations = {
  setRegistrationStatus(state, status) {
    state.registrationStatus = status
  },
  setSessionId(state, id) {
    state.sessionId = id
  },
  setSessionError(state, error) {
    state.sessionError = error
  },
  setCallState(state, payload) {
    if (payload.call_id !== null) {
      if (payload.call_state === callStates.NONE) {
        Vue.delete(state.callState, payload.call_id)
      } else {
        Vue.set(state.callState, payload.call_id, payload.call_state)
      }
    }
  },
  setCallInfo(state, callInfo) {
    state.callInfo = callInfo
  },
  setCallId(state, id) {
    state.callId = id
  },
  setLocalStream(state, stream) {
    state.localStream = stream
  },
  setRemoteStream(state, stream) {
    state.remoteStream = stream
  },
  setIncomingCallJsep(state, jsep) {
    state.incomingCallJsep = jsep
  },
  setAudioEnabled(state, enabled) {
    state.audioEnabled = enabled
  },
  setVideoEnabled(state, enabled) {
    state.videoEnabled = enabled
  },
  setLocalCallMediaType(state, video) {
    if (video !== null) {
      state.localCallMediaType = video ? 'video' : 'audio'
    } else {
      state.localCallMediaType = null
    }
  },
  setRemoteCallMediaType(state, jsep) {
    if (jsep !== null) {
      state.remoteCallMediaType = /m=video/.test(jsep.sdp) ? 'video' : 'audio'
    } else {
      state.remoteCallMediaType = null
    }
  },
}

const actions = {
  async connect({
    rootGetters, getters, commit, dispatch,
  }) {
    const url = envConfig.webtritCoreSignalingUrl
    const token = rootGetters['account/token']
    let promiseResolve
    let promiseReject
    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve
      promiseReject = reject
    })
    if (webtritSignalingClient === null) {
      webtritSignalingClient = new WebtritSignaling({
        eventCallback: (event) => {
          console.log('Event callback', event)
          switch (event.type) {
            case eventType.IncomingCall:
              handleIncomingCall({ commit, dispatch, event }, getters.isCallActive)
              break
            case eventType.OutgoingCall:
              handleOutgoingCall({ dispatch, event })
              break
            case eventType.AcceptedCall:
              handleAcceptedCall({ commit, dispatch, event })
              break
            case eventType.HangupCall:
              handleHangupCall({ commit, dispatch, event })
              break
            case eventType.Session:
              handleState({ commit, event })
              break
            case eventType.Line:
              handleIceEvent({ commit, dispatch, event })
              break
            case eventType.Notify:
              handleNotifyEvent({ commit, dispatch, event })
              break
            case eventType.ChangeCall:
              handleChangeCall({ commit, dispatch, event })
              break
            default:
              console.warn('Unhandled signaling event:', event)
          }
        },
        handshakeCallback: (event) => {
          console.log('Handshake callback', event)
          if (event.registration !== undefined) {
            commit('setRegistrationStatus', event.registration.status)
            if (event.registration.code) {
              const msg = event.registration.reason || 'Unknown'
              snackbarShow(dispatch, `${event.registration.code} - ${msg}`)
            }
          }
        },
        errorCallback: (error) => {
          console.log('Error callback:', error)
          if (error.fatal) {
            webtritSignalingClient.disconnect(error.code)
            handleCleanEvent({ commit }, getters.getCallId)
            commit('setSessionError', error.message)
          } else {
            snackbarShow(dispatch, error.message)
          }
          promiseReject()
        },
        disconnectedCallback: (reason, code) => {
          console.log(`Disconnect callback code: ${code}; reason: ${reason}`)
          webtritSignalingClient.disconnect()
          handleCleanEvent({ commit }, getters.getCallId)
          if (code !== WS_CLOSE_CODE_UNREGISTER) {
            if (code === WS_CLOSE_CODE_ATTACH_ERROR) {
              reason = 'active connection has already been made on another tab'
            } else if (code === WS_CLOSE_CODE_MISSED_CREDENTIALS) {
              reason = 'billing account credentials missed <br> please contact your administrator to solve the issue'
            }
            commit('setSessionError', reason)
          }
        },
        connectedCallback: (event) => {
          event.type === 'open' ? promiseResolve() : promiseReject()
        },
      })
      eventType = webtritSignalingClient.getEventTypes()
    }
    webtritSignalingClient.connect({
      url,
      token,
    })
    await promise
  },
  async call({ getters, commit, dispatch }, {
    number, name, initials, video,
  }) {
    console.log('Active call: ', getters.isCallActive)
    if (getters.isCallActive) {
      snackbarShow(dispatch, 'Error: line busy')
    } else {
      const media = { audio: true, video: !!video }
      const call_id = webtritSignalingClient.generateCallId()
      try {
        peerConnection = await initPeerConnection({ commit, dispatch, call_id })
        await peerConnection.create()
        await peerConnection.setLocalStreams(media)
        await peerConnection.createOffer()
        const sdp = peerConnection.getLocalDescription()
        if (peerConnection.isNoErrors) {
          await webtritSignalingClient.execute('outgoing_call', {
            line: 0,
            call_id,
            number,
            jsep: sdp,
          })
          commit('setCallId', call_id)
          commit('setCallState', {
            call_state: callStates.OUTGOING,
            call_id,
          })
          commit('setCallInfo', { number, initials, name })
          commit('setLocalCallMediaType', !!video)
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  async answer({
    getters, commit, dispatch,
  }, { video }) {
    const media = { audio: true, video: !!video }
    const call_id = getters.getCallId
    const in_sdp = getters.getIncomingCallJsep
    try {
      peerConnection = await initPeerConnection({ commit, dispatch, call_id })
      await peerConnection.create()
      await peerConnection.setLocalStreams(media)
      if (in_sdp) {
        await peerConnection.setRemoteDescription(in_sdp)
        await peerConnection.createAnswer()
      } else {
        await peerConnection.createOffer()
      }
      const sdp = await peerConnection.getLocalDescription()
      if (peerConnection.isNoErrors) {
        await webtritSignalingClient.execute('accept', {
          line: 0,
          call_id,
          jsep: sdp,
        })
        commit('setCallState', {
          call_state: callStates.ACCEPTED,
          call_id,
        })
        commit('setLocalCallMediaType', !!video)
        dispatch('ringtones/stop', null, { root: true })
      }
    } catch (e) {
      console.error(e)
    }
  },
  drop({ getters }) {
    if (getters.isCallIncoming && !getters.isCallAccepted) {
      webtritSignalingClient.execute('decline', {
        line: 0,
        call_id: getters.getCallId,
      })
    } else {
      webtritSignalingClient.execute('hangup', {
        line: 0,
        call_id: getters.getCallId,
      })
    }
  },
  sendDtmf(context, tones) {
    if (peerConnection) {
      peerConnection.sendDtmf(tones)
    }
  },
  transfer({ getters }, number) {
    webtritSignalingClient.execute('transfer', {
      line: 0,
      call_id: getters.getCallId,
      number,
    })
  },
  mute({ commit }, { enabled, video }) {
    if (peerConnection) {
      if (video) {
        peerConnection.muteVideo(enabled)
        commit('setVideoEnabled', enabled)
      } else {
        peerConnection.muteAudio(enabled)
        commit('setAudioEnabled', enabled)
      }
    }
  },
  hold({ getters }, { active }) {
    if (active) {
      webtritSignalingClient.execute('hold', {
        line: 0,
        call_id: getters.getCallId,
        direction: 'inactive',
      })
    } else {
      webtritSignalingClient.execute('unhold', {
        line: 0,
        call_id: getters.getCallId,
      })
    }
  },
  disconnect({ commit }) {
    webtritSignalingClient.disconnect()
    handleCleanEvent({ commit }, null)
  },
  async register({ commit, dispatch }) {
    const r = await axios.patch('/app/status', {
      register: true,
    })
    if (r.status === 204) {
      commit('setRegistrationStatus', 'registered')
      dispatch('webrtc/connect', null, { root: true })
    } else {
      commit('setRegistrationStatus', 'unregistered')
    }
  },
  async unregister({ commit, dispatch }) {
    const r = await axios.patch('/app/status', {
      register: false,
    })
    if (r.status === 204) {
      commit('setRegistrationStatus', 'unregistered')
    } else {
      commit('setRegistrationStatus', 'registered')
      dispatch('webrtc/connect', null, { root: true })
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
