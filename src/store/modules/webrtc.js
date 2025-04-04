/* eslint-disable no-shadow */
import Vue from 'vue'
import { envConfig } from '@/env-config'
import WebtritSignaling from '@webtrit/webtrit-signaling'
import i18n from '@/plugins/i18n'
import axios from 'axios'
import PeerConnection from './webrtc_pc'

let webtritSignalingClient = null
let peerConnection = null
let eventType = null
let blockPlayRingtone = false

const callStates = {
  NONE: 0,
  INCOMING: 10,
  OUTGOING: 20,
  ACCEPTED: 30,
  PROGRESS: 40,
}

const SLOWLINK_POOR_THRESHOLD = 30
const WS_CLOSE_CODE_WEBSOCKET_CLOSE = 1006
const WS_CLOSE_CODE_SESSION_MISSED = 4201
const WS_CLOSE_CODE_UNREGISTER = 4302
const WS_CLOSE_CODE_CONTROLLER_EXIT = 4402
const WS_CLOSE_CODE_MISSED_CREDENTIALS = 4412
const WS_CLOSE_CODE_WEBRTC_CONNECTION_ERROR = 4420
const WS_CLOSE_CODE_ATTACH_ERROR = 4431
const WS_CLOSE_CODE_UNKNOWN_ERROR = 4600

/**
 * This function takes the user registration status on a SIP server as input and
 * returns the color in which this status will be displayed on the user's avatar.
 * @param status string
 * @returns {string}
 */
export function getRegistrationStatusColor(status) {
  switch (status) {
    case 'unregistered':
    case 'notregistered':
    case 'registration_failed':
      return 'red'
    case 'unregistering':
    case 'registering':
      return 'yellow'
    case 'registered':
      return 'green'
    case 'registration_limit':
      return '#FFA07A'
    default:
      return 'grey'
  }
}

/**
 * This function receives an error code number and generates a textual description
 * @param code number | string
 * @returns {string}
 */
export function getErrorCode(code) {
  if (code === 401) {
    return '401'
  } else if (code === 480) {
    return '480'
  } else if (code === 486) {
    return '486'
  } else if (/^4/.test(code) && code.toString().length === 3) {
    return '400'
  } else if (/^4/.test(code) && code.toString().length === 4) {
    return '4000'
  } else {
    return typeof code === 'string' ? code : code.toString()
  }
}

function webtritCoreSignalingUrl(tenant_id) {
  const CORE_SIGNALING_PREFIX = 'signaling/v1'
  const url = envConfig.webtritCoreApiUrl
  url.protocol = url.protocol.endsWith('s:') ? 'wss:' : 'ws:'
  if (tenant_id) {
    const pattern = new RegExp('(tenant)\\/([^$\\/]*)/?')
    if (pattern.test(url.pathname)) {
      url.pathname = url.pathname.replace(pattern, `$1/${tenant_id}/`)
    } else {
      url.pathname = `${url.pathname.replace(/\/?$/, '/')}tenant/${tenant_id}/`
    }
  } else {
    url.pathname = url.pathname.replace(/\/?$/, '/')
  }
  return `${url}${CORE_SIGNALING_PREFIX}`
}

/**
 * Show badge with message
 * @param dispatch function
 * @param message string
 */
function snackbarShow(dispatch, message) {
  if (message && message.length > 0) {
    dispatch('snackbar/show',
      { message },
      { root: true })
  }
}

/**
 * Set default state an idle mode
 * @param commit function
 * @param call_id string
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

function composeErrorMessage(error) {
  let err_msg = null
  if (error.code) {
    err_msg = `${error.code}`
  }
  if (error.message) {
    err_msg = err_msg ? `${err_msg} - ${error.message}` : `${error.message}`
  }
  return err_msg
}

function initPeerConnection({ commit, dispatch, call_id }) {
  const pc = new PeerConnection({
    iceCandidateCallback: async (candidate) => {
      try {
        await webtritSignalingClient.execute('ice_trickle', {
          line: 0,
          candidate,
        })
      } catch (e) {
        console.error('Send candidate:', e)
      }
    },
    errorCallback: (error) => {
      console.log('[PC] Error event handling:', error)
      const err_msg = composeErrorMessage(error)
      if (err_msg) {
        if (error.fatal) {
          webtritSignalingClient.disconnect(error.code)
          handleCleanEvent({ commit }, call_id)
          commit('setSessionError', err_msg)
        } else {
          if (![701].includes(error.code)) {
            snackbarShow(dispatch, err_msg)
          }
        }
      }
    },
    addTrackCallback: (stream, isRemote) => {
      if (isRemote) {
        commit('setRemoteStream', stream)
        console.info('Set remote stream', stream)
      } else {
        commit('setLocalStream', stream)
        console.info('Set local stream', stream)
      }
    },
  })
  pc.create()
  return pc
}

async function handleIncomingCall({ commit, dispatch, event }, isCallActive) {
  console.log('Event handling in a [handleIncomingCall] function')
  console.log('Active call exist: ', isCallActive)
  if (isCallActive) {
    await webtritSignalingClient.execute('hangup', {
      line: event.line,
      call_id: event.call_id,
    })
  } else {
    const number = event.caller
    const initials = ''
    const name = event.caller_display_name
    dispatch('notifications/displayNotification', { call_id: event.call_id, number, name }, { root: true })
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
    if (!blockPlayRingtone) {
      dispatch('ringtones/playIncoming', null, { root: true })
    }
  }
}

async function handleAcceptedCall({ commit, dispatch, event }) {
  console.log('Event handling in a [handleAcceptedCall] function')
  dispatch('notifications/closeNotification', { call_id: event.call_id }, { root: true })
  commit('setCallId', event.call_id)
  try {
    if (event.jsep) {
      if (event.jsep.type === 'answer') {
        // Handle `answer` SDP
        await peerConnection.setRemoteDescription(event.jsep)
        commit('setRemoteCallMediaType', event.jsep)
      } else {
        console.warn('Expected jsep type `answer` received other type:', event.jsep.type)
      }
    }
    if (event.event === 'accepted') {
      commit('setCallState', {
        call_state: callStates.ACCEPTED,
        call_id: event.call_id,
      })
    } else {
      commit('setCallState', {
        call_state: callStates.PROGRESS,
        call_id: event.call_id,
      })
    }
  } catch (e) {
    console.error('handleAcceptedCall', e)
    snackbarShow(dispatch, `${(e.code || 'null')} - ${e.description || e.message}`)
    handleCleanEvent({ commit }, event.call_id)
  }
}

function handleHangupCall({ commit, dispatch, event }, callId) {
  console.log('Event handling in a [handleHangupCall] function')
  if (callId === event.call_id) {
    dispatch('notifications/closeNotification', { call_id: event.call_id }, { root: true })
    if (event.event === 'hangup') {
      commit('setCallState', {
        call_state: callStates.NONE,
        call_id: event.call_id,
      })
      dispatch('account/initGetAccountInfo', null, { root: true })
      handleCleanEvent({ commit }, event.call_id)
      blockPlayRingtone = false
    }
    if (event.reason) {
      if (event.code) {
        snackbarShow(dispatch, `${event.code} - ${event.reason}`)
      } else {
        snackbarShow(dispatch, `${event.reason}`)
      }
    }
  }
}

function handleOutgoingCall({ dispatch }) {
  console.log('Event handling in a [handleOutgoingCall] function')
  if (!blockPlayRingtone) {
    dispatch('ringtones/playOutgoing', null, { root: true })
  }
}

function handleState({ commit, dispatch, event }) {
  let reg_state
  console.log('Event handling in a [handleState] function')
  switch (event.phrase) {
    case 'authorization_failure':
      reg_state = 'registration_limit'
      break
    default:
      reg_state = event.event
  }
  commit('setRegistrationStatus', reg_state)
  if (event.code) {
    const msg = event.reason || event.description || 'Unknown'
    snackbarShow(dispatch, `${event.code} - ${msg}`)
  }
}

function handleIceEvent({ dispatch, event }) {
  console.log('Event handling in a [handleIceEvent] function')
  let message = ''
  switch (event.event) {
    case 'ice_slowlink':
      if (event.lost > 0 && event.lost <= SLOWLINK_POOR_THRESHOLD) {
        message = i18n.t('errors.ice_slowlink.weak')
      } else if (event.lost > SLOWLINK_POOR_THRESHOLD) {
        message = i18n.t('errors.ice_slowlink.poor')
      }
      if (message.length > 0) {
        snackbarShow(dispatch, message)
      }
      break
    case 'ice_media':
      blockPlayRingtone = true
      dispatch('ringtones/stop', null, { root: true })
      break
    case 'ice_hangup':
      dispatch('ringtones/stop', null, { root: true })
      blockPlayRingtone = false
      break
    default:
  }
}

// eslint-disable-next-line no-unused-vars
async function handleChangeCall({ event }, callId) {
  console.log('Event handling in a [handleChangeCall] function')
  const call_id = callId || event.call_id
  if (event.jsep) {
    try {
      if (event.jsep.type === 'offer') {
        // Remote change call state sending `offer` SDP
        const in_sdp = event.jsep
        await peerConnection.setRemoteDescription(in_sdp)
        await peerConnection.createAnswer()
        const out_sdp = peerConnection.getLocalDescription()
        if (peerConnection.noError()) {
          await webtritSignalingClient.execute('update', {
            line: 0,
            call_id,
            jsep: out_sdp,
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

// eslint-disable-next-line no-unused-vars
function handleNotifyEvent({ dispatch, event }) {
  console.log('Event handling in a [handleNotifyEvent] function')
  const [, code] = event.content.split(' ')
  const message_key = `call.messages.${code}`
  const error_key = `call.errors.${getErrorCode(code)}`
  let message
  if (i18n.te(message_key)) {
    message = i18n.t(message_key)
  } else if (i18n.te(error_key)) {
    message = i18n.t(error_key)
  } else {
    console.warn('Unhandled message', code)
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
  signalingConnected: false,
})

const getters = {
  isSignalingConnected(state) {
    return state.signalingConnected
  },
  isRegistered(state) {
    return state.registrationStatus === 'registered'
  },
  registrationStatus(state) {
    return state.registrationStatus
  },
  registrationStatusColor(state) {
    return getRegistrationStatusColor(state.registrationStatus)
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
  isCallProgress(state) {
    return state.callState[state.callId] === callStates.PROGRESS
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
  getCallExist(state) {
    return state.callId ? !!state.callState[state.callId] : false
  },
  getIncomingCallJsep(state) {
    return state.incomingCallJsep
  },
}

const mutations = {
  setSignalingConnected(state) {
    state.signalingConnected = true
  },
  setSignalingDisconnected(state) {
    state.signalingConnected = false
  },
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
    const token = rootGetters['account/token']
    const tenant_id = rootGetters['account/tenant_id']
    const url = webtritCoreSignalingUrl(tenant_id)
    let promiseResolve
    let promiseReject
    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve
      promiseReject = reject
    })
    if (webtritSignalingClient === null) {
      webtritSignalingClient = new WebtritSignaling({
        eventCallback: async (event) => {
          console.log('Event callback', event)
          switch (event.type) {
            case eventType.IncomingCall:
              await handleIncomingCall({ commit, dispatch, event }, getters.isCallActive)
              break
            case eventType.OutgoingCall:
              handleOutgoingCall({ dispatch })
              break
            case eventType.AcceptedCall:
              await handleAcceptedCall({ commit, dispatch, event })
              break
            case eventType.HangupCall:
              handleHangupCall({ commit, dispatch, event }, getters.getCallId)
              break
            case eventType.Session:
              handleState({ commit, dispatch, event })
              break
            case eventType.Line:
              handleIceEvent({ commit, dispatch, event })
              break
            case eventType.Notify:
              handleNotifyEvent({ commit, dispatch, event })
              break
            case eventType.ChangeCall:
              await handleChangeCall({ commit, dispatch, event }, getters.getCallId)
              break
            default:
              console.warn('Unhandled signaling event:', event)
          }
        },
        handshakeCallback: (event) => {
          console.log('Event handling in callback [handshakeCallback]:', event)
          if (event.registration !== undefined) {
            commit('setRegistrationStatus', event.registration.status)
            if (event.registration.code) {
              const msg = event.registration.reason || 'Unknown'
              snackbarShow(dispatch, `${event.registration.code} - ${msg}`)
            }
          }
        },
        errorCallback: (error) => {
          console.log('Error handling in callback:', error)
          let error_message
          switch (error.code) {
            case WS_CLOSE_CODE_UNKNOWN_ERROR:
              error_message = i18n.t('errors.unknown_error')
              break
            default:
              error_message = composeErrorMessage(error)
          }
          if (error_message) {
            if (error.fatal) {
              webtritSignalingClient.disconnect(error.code)
              handleCleanEvent({ commit }, getters.getCallId)

              commit('setSessionError', error_message)
            } else {
              snackbarShow(dispatch, error_message)
            }
          }
          promiseReject()
        },
        disconnectedCallback: (reason, code) => {
          console.log(`Disconnect handling in callback with code: ${code}; reason: ${reason}`)
          commit('setSignalingDisconnected')
          webtritSignalingClient.disconnect()
          handleCleanEvent({ commit }, getters.getCallId)
          if (![WS_CLOSE_CODE_UNREGISTER, WS_CLOSE_CODE_SESSION_MISSED].includes(code)) {
            let error_message
            switch (code) {
              case WS_CLOSE_CODE_ATTACH_ERROR:
                error_message = i18n.t('errors.already_opened')
                break
              case WS_CLOSE_CODE_WEBSOCKET_CLOSE:
              case WS_CLOSE_CODE_CONTROLLER_EXIT:
              case WS_CLOSE_CODE_WEBRTC_CONNECTION_ERROR:
                error_message = i18n.t('errors.webrtc_controller_error')
                break
              case WS_CLOSE_CODE_MISSED_CREDENTIALS:
                error_message = i18n.t('errors.credentials_missed')
                break
              case WS_CLOSE_CODE_UNKNOWN_ERROR:
                error_message = i18n.t('errors.unknown_error')
                break
              default:
                error_message = reason
            }
            commit('setSessionError', error_message)
          }
        },
        connectedCallback: (event) => {
          if (event.type === 'open') {
            commit('setSignalingConnected')
            promiseResolve()
          } else {
            commit('setSignalingDisconnected')
            promiseReject()
          }
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
    if (getters.isCallActive) {
      snackbarShow(dispatch, 'Error: line busy')
    } else {
      const media = { audio: true, video: !!video }
      const call_id = webtritSignalingClient.generateCallId()
      try {
        peerConnection = initPeerConnection({ commit, dispatch, call_id })
        await peerConnection.setLocalStreams(media)
        await peerConnection.createOffer()
        const sdp = peerConnection.getLocalDescription()
        if (peerConnection.noError()) {
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
      peerConnection = initPeerConnection({ commit, dispatch, call_id })
      await peerConnection.setLocalStreams(media)
      if (in_sdp) {
        await peerConnection.setRemoteDescription(in_sdp)
        await peerConnection.createAnswer()
      } else {
        await peerConnection.createOffer()
      }
      const sdp = peerConnection.getLocalDescription()
      if (peerConnection.noError()) {
        const codecsCompatability = peerConnection.getCodecsCompatibility()
        if (codecsCompatability.audio.compatible) {
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
        } else {
          // TODO: Notify the user with a snackbar about incompatible codecs
          console.warn('Call declined automatically due to incompatible audio codecs')
          await webtritSignalingClient.execute('decline', {
            line: 0,
            call_id: getters.getCallId,
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  },
  async drop({ getters }) {
    if (getters.isCallIncoming && !getters.isCallAccepted) {
      await webtritSignalingClient.execute('decline', {
        line: 0,
        call_id: getters.getCallId,
      })
    } else {
      await webtritSignalingClient.execute('hangup', {
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
  async transfer({ getters }, number) {
    await webtritSignalingClient.execute('transfer', {
      line: 0,
      call_id: getters.getCallId,
      number,
    })
  },
  mute({ commit }, { enabled, video }) {
    if (peerConnection) {
      if (video) {
        peerConnection.mute('video', enabled)
        commit('setVideoEnabled', enabled)
      } else {
        peerConnection.mute('audio', enabled)
        commit('setAudioEnabled', enabled)
      }
    }
  },
  async hold({ getters }, { active }) {
    if (active) {
      await webtritSignalingClient.execute('hold', {
        line: 0,
        call_id: getters.getCallId,
        direction: 'inactive',
      })
    } else {
      await webtritSignalingClient.execute('unhold', {
        line: 0,
        call_id: getters.getCallId,
      })
    }
  },
  disconnect({ commit }) {
    webtritSignalingClient.disconnect()
    handleCleanEvent({ commit }, null)
  },
  async register({ commit }) {
    try {
      const r = await axios.patch('/app/status', {
        register: true,
      })
      if (r === 204) {
        commit('setRegistrationStatus', 'registered')
        window.dispatchEvent(new Event('online'))
      } else {
        commit('setRegistrationStatus', 'unregistered')
        window.dispatchEvent(new Event('offline'))
      }
    } catch (e) {
      if (e) console.error('On "register" webrtc', e)
    }
  },
  async unregister({ commit }) {
    try {
      const r = await axios.patch('/app/status', {
        register: false,
      })
      if (r === 204) {
        commit('setRegistrationStatus', 'unregistered')
        window.dispatchEvent(new Event('offline'))
      } else {
        commit('setRegistrationStatus', 'registered')
        window.dispatchEvent(new Event('online'))
      }
    } catch (e) {
      if (e) console.error('On "unregister" webrtc', e)
    }
  },
  setSessionError({ commit }, reason) {
    commit('setSessionError', reason)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
