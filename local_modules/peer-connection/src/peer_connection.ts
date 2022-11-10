import mediaStream from './media_stream'
import { PeerConnectionError } from './peer_connection_error'

const DTMF_DURATION = 500
const DTMF_TONE_GAP = 50

type t_iceCandidateCallback = (candidate: RTCIceCandidate | null) => void
type t_errorCallback = (error: PeerConnectionError) => void
type t_addStreamsCallback = (stream: MediaStream, isRemote? : boolean) => void
type t_removeStreamCallback = (stream: MediaStream, isRemote? : boolean) => void
type t_changeCallback = (event: Event) => void

export declare interface initPeerConnection {
  iceCandidateCallback: t_iceCandidateCallback
  errorCallback: t_errorCallback
  addStreamCallback: t_addStreamsCallback
  removeStreamCallback: t_removeStreamCallback
  changeCallback: t_changeCallback
}

/**
 * Module to handle Peer Communication between interlocutors
 * @internal
 * @notExported
 */
export default class PeerConnection {
  readonly iceCandidateCallback: t_iceCandidateCallback
  readonly errorCallback: t_errorCallback
  readonly addStreamCallback: t_addStreamsCallback
  readonly removeStreamCallback: t_removeStreamCallback
  readonly changeCallback: t_changeCallback

  private _peerConnection: RTCPeerConnection | null
  private _dtmfSender: RTCDTMFSender | null
  public isNoErrors: boolean

  constructor({
    iceCandidateCallback,
    errorCallback,
    addStreamCallback,
    removeStreamCallback,
    changeCallback,
  }: initPeerConnection) {
    this._peerConnection = null
    this._dtmfSender = null
    this.iceCandidateCallback = iceCandidateCallback || this.nullable
    this.errorCallback = errorCallback || this.nullable
    this.addStreamCallback = addStreamCallback || this.nullable
    this.removeStreamCallback = removeStreamCallback || this.nullable
    this.changeCallback = changeCallback || this.nullable
    this.isNoErrors = true
  }

  /**
   * Creates PeerConnection
   * @internal
   */
  async create() {
    this._peerConnection = await new RTCPeerConnection({
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302',
      }],
    })
    this._peerConnection!.onconnectionstatechange = (event: Event) => this.handleConnectionStateChange(event)
    this._peerConnection!.ondatachannel = (event: RTCDataChannelEvent) => this.handleDataChannel(event)
    this._peerConnection!.onicecandidate = (event: RTCPeerConnectionIceEvent) => this.handleIceCandidate(event)
    this._peerConnection!.onicecandidateerror = (event: Event) => this.handleIceCandidateError(event)
    this._peerConnection!.oniceconnectionstatechange = (event: Event) => this.handleIceConnectionStateChange(event)
    this._peerConnection!.onicegatheringstatechange = (event: Event) => this.handleIceGatheringStateChange(event)
    this._peerConnection!.onnegotiationneeded = (event: Event) => this.handleNegotiationNeeded(event)
    this._peerConnection!.onsignalingstatechange = (event: Event) => this.handleSignalingStateChange(event)
    this._peerConnection!.ontrack = (event: RTCTrackEvent) => this.handleTrack(event)
    this.isNoErrors = true
  }

  /**
   * Deletes PeerConnection after call ended
   * @internal
   */
  close() {
    if (this._peerConnection) {
      this._peerConnection.close()
      this._peerConnection.onconnectionstatechange = null
      this._peerConnection.ondatachannel = null
      this._peerConnection.onicecandidate = null
      this._peerConnection.onicecandidateerror = null
      this._peerConnection.oniceconnectionstatechange = null
      this._peerConnection.onicegatheringstatechange = null
      this._peerConnection.onnegotiationneeded = null
      this._peerConnection.onsignalingstatechange = null
      this._peerConnection.ontrack = null
      this._peerConnection = null
    }
    if (this._dtmfSender) {
      this._dtmfSender = null
    }
    mediaStream.delete()
  }

  /**
   * Attaches local MediaStream to current PeerConnection
   * @internal
   *
   * @param stream - local MediaStream
   */
  addTracks(stream: MediaStream) {
    for (let i = 0; i < stream.getTracks().length; i += 1) {
      const track = stream.getTracks()[i]
      this._peerConnection!.addTrack(track, stream)
    }
  }

  /**
   * Creates RTCSessionDescription as offer for outgoing call
   * @internal
   */
  async createOffer() {
    const offer = await this._peerConnection!.createOffer()
    await this._peerConnection!.setLocalDescription(offer)
  }

  /**
   * Creates RTCSessionDescription as answer for incoming call
   * @internal
   */
  async createAnswer() {
    const answer = await this._peerConnection!.createAnswer()
    await this._peerConnection!.setLocalDescription(answer)
  }

  /**
   * @returns local RTCSessionDescription on current PeerConnection
   * @internal
   */
  getLocalDescription() {
    return this._peerConnection!.localDescription
  }

  /**
   * Sets remote RTCSessionDescription on current PeerConnection
   * @internal
   *
   * @param jsep - remote RTCSessionDescription
   */
  async setRemoteDescription(jsep: RTCSessionDescription) {
    const remoteDescription = new RTCSessionDescription(jsep)
    await this._peerConnection!.setRemoteDescription(remoteDescription)
  }

  async setLocalStreams(media: MediaStreamConstraints) {
    try {
      const stream = await mediaStream.assignLocalMediaStream(media)
      this.addTracks(stream)
      this.addStreamCallback(stream, false)
    } catch (e: any) {
      this.isNoErrors = false
      this.errorCallback(PeerConnectionError.MediaDeviceBusy(e.message))
    }
  }

  muteAudio(mute: boolean) {
    mediaStream.muteAudio(mute)
  }

  muteVideo(mute: boolean) {
    mediaStream.muteVideo(mute)
  }

  /**
   * Sends DTMF
   * @internal
   *
   * @param tones - digit to send
   */
  sendDtmf(tones: string) {
    if (!this._dtmfSender) {
      this._dtmfSender = this._peerConnection!.getSenders()[0].dtmf
    }
    this._dtmfSender!.insertDTMF(tones, DTMF_DURATION, DTMF_TONE_GAP)
  }

  /**
   * RTCPeerConnection handle
   */

  handleIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log('[PC] handle IceCandidate event:', event)
    this.iceCandidateCallback(event.candidate)
  }

  handleIceCandidateError(event: Event) {
    console.log('[PC] handle IceCandidateError event:', event)
    const rtc_error = event as RTCPeerConnectionIceErrorEvent
    this.isNoErrors = false
    this.errorCallback(PeerConnectionError.IceCandidateError(rtc_error.errorCode, rtc_error.errorText))
  }

  handleIceGatheringStateChange(event: Event) {
    console.log('[PC] handle IceGatheringStateChange event:', event)
    if (this._peerConnection?.iceGatheringState === 'complete') {
      this.iceCandidateCallback(null)
    }
  }

  handleTrack(event: RTCTrackEvent) {
    console.log('[PC] handle Track event:', event)
    if (event.streams !== null && event.streams.length > 0) {
      mediaStream.setRemoteMediaStream(event.streams[0])
      this.addStreamCallback(event.streams[0], true)
    }
  }

  handleConnectionStateChange(event: Event) {
    console.log('[PC] handle ConnectionStateChange event:', event)
    this.changeCallback(event)
  }

  handleDataChannel(event: RTCDataChannelEvent) {
    console.log('[PC] handle DataChannel event:', event)
  }

  handleIceConnectionStateChange(event: Event) {
    console.log('[PC] handle IceConnectionStateChange event:', event)
    this.changeCallback(event)
  }

  handleNegotiationNeeded(event: Event) {
    console.log('[PC] handle NegotiationNeeded event:', event)
    this.changeCallback(event)
  }

  handleSignalingStateChange(event: Event) {
    console.log('[PC] handle SignalingStateChange event:', event)
    this.changeCallback(event)
  }

  nullable(event: Event): void {
    console.log('[PC] skip event:', event)
  }
}
