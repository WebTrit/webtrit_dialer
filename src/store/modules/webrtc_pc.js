/**
 * Module to handle Peer Communication between interlocutors
 * @internal
 * @notExported
 */

import * as sdpTransform from 'sdp-transform'

const DTMF_DURATION = 500
const DTMF_TONE_GAP = 50
const EXCLUDED_PAYLOAD_CODECS = ['101']

const UNSUPPORTED_CODEC_PATTERNS = [
  /^g729/i,
  /^g726/i,
  /^g723/i,
]

/**
 * Sanitize SDP by removing unsupported codecs that cause browser errors
 * @param {string} sdp - Original SDP string
 * @returns {string} - Sanitized SDP string
 */
function sanitizeSdp(sdp) {
  const parsed = sdpTransform.parse(sdp)

  parsed.media.forEach((media) => {
    if (media.type !== 'audio' || !media.rtp) return

    const unsupportedPayloads = media.rtp
      .filter((rtp) => UNSUPPORTED_CODEC_PATTERNS.some((pattern) => pattern.test(rtp.codec)))
      .map((rtp) => rtp.payload)

    if (unsupportedPayloads.length === 0) return

    console.log('[PC] Removing unsupported codecs with payloads:', unsupportedPayloads)

    media.rtp = media.rtp.filter((rtp) => !unsupportedPayloads.includes(rtp.payload))

    if (media.fmtp) {
      media.fmtp = media.fmtp.filter((fmtp) => !unsupportedPayloads.includes(fmtp.payload))
    }

    if (media.payloads) {
      const payloadList = String(media.payloads).split(' ').filter((p) => p)
      media.payloads = payloadList
        .filter((p) => !unsupportedPayloads.includes(parseInt(p, 10)))
        .join(' ')
    }
  })

  return sdpTransform.write(parsed)
}

function raiseIfPeerConnectionNull(pc) {
  if (pc == null) {
    throw new Error('PeerConnection was not created')
  }
}

export default class PeerConnection {
  _peerConnection = null

  _isNoErrors = false

  _iceCandidateCallback = null

  _negotiationNeededCallback = null

  _addTrackCallback = null

  _errorCallback = null

  /**
   * Initialise PeerConnection
   * @internal
   * @param iceCandidateCallback
   * @param negotiationNeededCallback
   * @param addTrackCallback
   * @param errorCallback
   */
  constructor({
    iceCandidateCallback,
    negotiationNeededCallback,
    addTrackCallback,
    errorCallback,
  }) {
    this._peerConnection = null
    this._iceCandidateCallback = iceCandidateCallback
    this._negotiationNeededCallback = negotiationNeededCallback
    this._addTrackCallback = addTrackCallback
    this._errorCallback = errorCallback
    this._isNoErrors = true
  }

  /**
   * Creates PeerConnection
   * @internal
   */
  create() {
    const pc = new RTCPeerConnection({
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302',
      }],
    })
    pc.onicecandidate = (event) => {
      console.log('[PC] handle IceCandidate event:', event)
      const fn = this._iceCandidateCallback
      if (fn != null && typeof fn === 'function') {
        fn(event.candidate)
      }
    }
    pc.onnegotiationneeded = (event) => {
      console.log('[PC] handle NegotiationNeeded event:', event)
      const fn = this._negotiationNeededCallback
      if (fn != null && typeof fn === 'function') {
        fn(event)
      }
    }
    pc.ontrack = (event) => {
      console.log('[PC] handle Track event:', event)
      if (event.streams != null && event.streams.length > 0) {
        const fn = this._addTrackCallback
        if (fn != null && typeof fn === 'function') {
          fn(event.streams[0], true)
        }
      }
    }
    pc.onicecandidateerror = (event) => {
      console.warn('[PC] handle IceCandidateError event:', event)
      const fn = this._errorCallback
      if (fn != null && typeof fn === 'function') {
        fn(event)
      }
    }
    pc.onconnectionstatechange = (event) => {
      console.log('[PC] handle ConnectionStateChange event:', event)
    }
    pc.oniceconnectionstatechange = (event) => {
      console.log('[PC] handle IceConnectionStateChange event:', event)
    }
    pc.onicegatheringstatechange = (event) => {
      console.log('[PC] handle IceGatheringStateChange event:', event)
    }
    pc.onicegatheringstatechange = (event) => {
      console.log('[PC] handle IceGatheringStateChange event:', event)
    }
    pc.onsignalingstatechange = (event) => {
      console.log('[PC] handle SignalingStateChange event:', event)
    }
    this._peerConnection = pc
    this._isNoErrors = true
  }

  /**
   * Deletes PeerConnection after call ended
   * @internal
   */
  close() {
    if (this._peerConnection) {
      this._peerConnection.getSenders()
        .forEach((sender) => {
          sender.track.stop()
          this._peerConnection.removeTrack(sender)
        })
      this._peerConnection.close()
      this._peerConnection.onicecandidate = null
      this._peerConnection.onnegotiationneeded = null
      this._peerConnection.ontrack = null
      this._peerConnection = null
    }
  }

  /**
   * Creates RTCSessionDescription as offer for outgoing call
   * @internal
   * @returns {Promise<void>}
   */
  async createOffer() {
    raiseIfPeerConnectionNull(this._peerConnection)
    const offer = await this._peerConnection.createOffer()
    await this._peerConnection.setLocalDescription(offer)
  }

  /**
   * Creates RTCSessionDescription as answer for incoming call
   * @internal
   * @returns {Promise<void>}
   */
  async createAnswer() {
    raiseIfPeerConnectionNull(this._peerConnection)
    const answer = await this._peerConnection.createAnswer()
    await this._peerConnection.setLocalDescription(answer)
  }

  /**
   * @returns local RTCSessionDescription on current PeerConnection
   * @internal
   * @returns {RTCSessionDescription}
   */
  getLocalDescription() {
    raiseIfPeerConnectionNull(this._peerConnection)
    return this._peerConnection.localDescription
  }

  /**
   * Sets remote RTCSessionDescription on current PeerConnection
   * Sanitizes SDP to remove unsupported codecs before setting
   * @internal
   *
   * @param jsep - remote RTCSessionDescription
   * @returns {Promise<void>}
   */
  async setRemoteDescription(jsep) {
    raiseIfPeerConnectionNull(this._peerConnection)
    const sanitizedSdp = sanitizeSdp(jsep.sdp)
    const remoteDescription = new RTCSessionDescription({
      type: jsep.type,
      sdp: sanitizedSdp,
    })
    await this._peerConnection.setRemoteDescription(remoteDescription)
  }

  /**
   * @param media
   * @returns {Promise<void>}
   */
  async setLocalStreams(media) {
    raiseIfPeerConnectionNull(this._peerConnection)
    try {
      const stream = await navigator.mediaDevices.getUserMedia(media)
      stream.getTracks()
        .forEach((track) => {
          this._peerConnection.addTrack(track, stream)
        })
      const fn = this._addTrackCallback
      if (fn != null && typeof fn === 'function') {
        fn(stream, false)
      }
    } catch (e) {
      this._isNoErrors = false
      const fn = this._errorCallback
      if (fn != null && typeof fn === 'function') {
        fn(e)
      }
    }
  }

  /**
   * Sends DTMF
   * @internal
   *
   * @param tones - digit to send
   */
  sendDtmf(tones) {
    raiseIfPeerConnectionNull(this._peerConnection)
    this._peerConnection.getSenders()[0].dtmf.insertDTMF(tones, DTMF_DURATION, DTMF_TONE_GAP)
  }

  mute(kind, state) {
    this._peerConnection.getSenders()
      .forEach((sender) => {
        if (sender.track.kind === kind) {
          sender.track.enabled = state
        }
      })
  }

  /**
   * Checks if local and remote SDPs have compatible media codecs
   * @returns {Object} Compatibility status for audio and video codecs
   */
  getCodecsCompatibility() {
    raiseIfPeerConnectionNull(this._peerConnection)

    const compatibility = {
      audio: {
        compatible: false,
        sharedCodecs: [],
      },
      video: {
        compatible: false,
        sharedCodecs: [],
      },
    }

    if (!this._peerConnection.localDescription || !this._peerConnection.remoteDescription) {
      console.warn('Both local and remote RTC descriptions must be set to check codecs compatibility')
      return compatibility
    }

    const localSDP = sdpTransform.parse(this._peerConnection.localDescription.sdp)
    const remoteSDP = sdpTransform.parse(this._peerConnection.remoteDescription.sdp)

    const mediaTypes = ['audio', 'video']
    mediaTypes.forEach((mediaType) => {
      const localMediaSections = localSDP.media.filter((m) => m.type === mediaType)
      const remoteMediaSections = remoteSDP.media.filter((m) => m.type === mediaType)

      if (localMediaSections.length > 0 && remoteMediaSections.length > 0) {
        const localSection = localMediaSections[0]
        const remoteSection = remoteMediaSections[0]

        const localPayloads = String(localSection.payloads || '').split(' ').filter((v) => v)
        const remotePayloads = String(remoteSection.payloads || '').split(' ').filter((v) => v)

        const sharedCodecs = localPayloads
          .filter((pt) => remotePayloads.includes(pt))
          .filter((pt) => !EXCLUDED_PAYLOAD_CODECS.includes(pt))

        compatibility[mediaType].sharedCodecs = sharedCodecs
        compatibility[mediaType].compatible = sharedCodecs.length > 0
      }
    })

    console.log('[PC] Codecs compatibility:', compatibility)
    return compatibility
  }

  noError() {
    return this._isNoErrors
  }
}
