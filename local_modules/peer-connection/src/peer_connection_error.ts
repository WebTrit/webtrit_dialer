// eslint-disable-next-line no-shadow
export enum ErrorCode {
  PEER_CONNECTION_MEDIA_DEVICE_BUSY = 4900,
}

export class PeerConnectionError extends Error {
  public readonly code: number;
  public readonly fatal: boolean;

  constructor(code: number, description: string, fatal: boolean) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)
    this.code = code
    this.fatal = fatal
  }

  static IceCandidateError = (code: number, error: string): PeerConnectionError => new PeerConnectionError(code, error, false)
  static MediaDeviceBusy = (error: string): PeerConnectionError => new PeerConnectionError(ErrorCode.PEER_CONNECTION_MEDIA_DEVICE_BUSY, `Media devices busy: ${error}`, false)
}
