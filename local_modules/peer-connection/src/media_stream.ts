/**
   * Module to control MediaStreams of interlocutors
   * @internal
   * @notExported
   */
class Stream {
  private localStream: null | MediaStream
  private remoteStream: null | MediaStream

  constructor() {
    this.localStream = null
    this.remoteStream = null
  }

  /**
   * Gets local MediaStream from user's device
   * @internal
   *
   * @param media - MediaConstraints e.g. \{ audio: true, video: false \}
   * @returns local MediaStream
   */
  async assignLocalMediaStream(media: MediaStreamConstraints) {
    const stream = await navigator.mediaDevices.getUserMedia(media)
    this.localStream = stream
    return stream
  }

  getRemoteMediaStream(): MediaStream | null {
    if (this.remoteStream === null) return null
    return this.remoteStream
  }

  setRemoteMediaStream(stream: MediaStream) {
    this.remoteStream = stream
  }

  /**
   * Mutes audio track on local MediaStream
   * @internal
   */
  muteAudio(mute: boolean) {
    if (!this.localStream) {
      return
    }
    this.localStream.getAudioTracks()[0].enabled = mute
  }

  /**
   * Mutes video track on local MediaStream
   * @internal
   */
  muteVideo(mute: boolean) {
    if (this.localStream === null) {
      return
    }
    this.localStream.getVideoTracks()[0].enabled = mute
  }

  /**
   * Deletes local MediaStream and its tracks after call ended
   * @internal
   */
  delete() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }
}

const mediaStream = new Stream()
export default mediaStream
