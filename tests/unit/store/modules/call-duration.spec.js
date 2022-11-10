import callDuration from '@/store/modules/call-duration'

jest.useFakeTimers()

Date.now = jest.fn(() => 1487076708000)

describe('callDuration.js mutations', () => {
  it('setCallDurationTimerStart sets callDurationTimerStart', () => {
    const state = {}
    const now = Date.now()
    callDuration.mutations.setCallDurationTimerStart(state, now)
    expect(state.callDurationTimerStart).toBe(now)
  })

  it('setCallDurationInSec sets callDurationInSec', () => {
    const state = {}
    callDuration.mutations.setCallDurationInSec(state, 3343434)
    expect(state.callDurationInSec).toBe(3343434)
  })

  it('setCallDurationTimer sets callDurationTimer', () => {
    const state = {}
    callDuration.mutations.setCallDurationTimer(state, 'timer')
    expect(state.callDurationTimer).toBe('timer')
  })
})

describe('callDuration.js actions', () => {
  it('startCallDuration - triggers mutations to start call duration timer', () => {
    const state = {}
    const commit = jest.fn()
    callDuration.actions.startCallDuration({ state, commit })
    expect(commit).toHaveBeenCalledWith('setCallDurationTimerStart', 1487076708000)
    expect(commit).toHaveBeenCalledWith('setCallDurationTimer', expect.any(Number))
    expect(setInterval).toHaveBeenCalledTimes(1)
  })

  it('stopCallDuration - triggers mutations to stop call duration timer', () => {
    const state = {}
    const commit = jest.fn()
    callDuration.actions.stopCallDuration({ state, commit })
    expect(clearInterval).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setCallDurationTimer', null)
    expect(commit).toHaveBeenCalledWith('setCallDurationTimerStart', null)
    expect(commit).toHaveBeenCalledWith('setCallDurationInSec', null)
  })
})
