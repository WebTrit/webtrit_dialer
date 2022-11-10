import ringtones from '@/store/modules/ringtones'

describe('ringtones.js getters', () => {
  it('currentAudio returns state.currentAudio', () => {
    const state = {
      currentAudio: 'audio.mp3',
    }
    expect(ringtones.getters.currentAudio(state)).toBe('audio.mp3')
  })

  it('isPreparingToPlay returns boolean based on state.preparingPlayCounter', () => {
    const state = {
      preparingPlayCounter: 0,
    }
    expect(ringtones.getters.isPreparingToPlay(state)).toBe(false)
  })

  it('isNeedToStop returns boolean based on state.needToStopCounter', () => {
    const state = {
      needToStopCounter: 1,
    }
    expect(ringtones.getters.isNeedToStop(state)).toBe(true)
  })
})

describe('ringtones.js mutations', () => {
  it('updateCurrentAudio sets currentAudio', () => {
    const state = {}
    ringtones.mutations.updateCurrentAudio(state, 'new audio')
    expect(state.currentAudio).toBe('new audio')
  })

  it('incPreparingToPlay increases preparingPlayCounter', () => {
    const state = {
      preparingPlayCounter: 2,
    }
    ringtones.mutations.incPreparingToPlay(state)
    expect(state.preparingPlayCounter).toBe(3)
  })

  it('decPreparingToPlay decreases preparingPlayCounter', () => {
    const state = {
      preparingPlayCounter: 2,
    }
    ringtones.mutations.decPreparingToPlay(state)
    expect(state.preparingPlayCounter).toBe(1)
  })

  it('incNeedToStop increases needToStopCounter', () => {
    const state = {
      needToStopCounter: 2,
    }
    ringtones.mutations.incNeedToStop(state)
    expect(state.needToStopCounter).toBe(3)
  })

  it('decNeedToStop increases needToStopCounter', () => {
    const state = {
      needToStopCounter: 2,
    }
    ringtones.mutations.decNeedToStop(state)
    expect(state.needToStopCounter).toBe(1)
  })
})

describe('ringtones.js actions', () => {
  it('playIncoming dispatches play action', (done) => {
    const dispatch = jest.fn()
    const context = {
      dispatch,
    }
    ringtones.actions.playIncoming(context)
    setTimeout(() => {
      expect(dispatch).toHaveBeenCalledWith('play', expect.anything())
      done()
    }, 0)
  })

  it('playOutgoing dispatches play action', (done) => {
    const dispatch = jest.fn()
    const context = {
      dispatch,
    }
    ringtones.actions.playOutgoing(context)
    setTimeout(() => {
      expect(dispatch).toHaveBeenCalledWith('play', expect.anything())
      done()
    }, 0)
  })

  it('stop - if current audio is playing stops it and commits updateCurrentAudio mutation', (done) => {
    const pause = jest.fn()
    const commit = jest.fn()
    const context = {
      getters: {
        currentAudio: {
          pause,
        },
      },
      commit,
    }
    ringtones.actions.stop(context)
    setTimeout(() => {
      expect(pause).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('updateCurrentAudio', null)
      done()
    }, 0)
  })

  it('stop - if current audio is preparing to play commits incNeedToStop mutation', (done) => {
    const commit = jest.fn()
    const context = {
      getters: {
        currentAudio: null,
        isPreparingToPlay: true,
      },
      commit,
    }
    ringtones.actions.stop(context)
    setTimeout(() => {
      expect(commit).toHaveBeenCalledWith('incNeedToStop')
      done()
    }, 0)
  })

  it('stop - if current audio is not preparing to play or playing doesn\'t commit anything', (done) => {
    const commit = jest.fn()
    const context = {
      getters: {
        currentAudio: null,
        isPreparingToPlay: false,
      },
      commit,
    }
    ringtones.actions.stop(context)
    setTimeout(() => {
      expect(commit).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('play doesn\'t do anything if sound is disabled', (done) => {
    const commit = jest.fn()
    const context = {
      rootGetters: {
        'settings/isSoundEnabled': false,
      },
      commit,
    }
    const newAudio = {
      loop: false,
    }
    ringtones.actions.play(context, newAudio)
    setTimeout(() => {
      expect(newAudio.loop).toBe(false)
      expect(commit).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('play - isNeedToStop === true case', (done) => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const context = {
      getters: {
        isNeedToStop: true,
      },
      rootGetters: {
        'settings/isSoundEnabled': true,
      },
      commit,
      dispatch,
    }
    const play = jest.fn()
    const pause = jest.fn()
    const newAudio = {
      loop: false,
      play,
      pause,
    }
    ringtones.actions.play(context, newAudio)
    setTimeout(() => {
      expect(newAudio.loop).toBe(true)
      expect(commit).toHaveBeenCalledWith('incPreparingToPlay')
      expect(play).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('decPreparingToPlay')
      expect(pause).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('decNeedToStop')
      expect(dispatch).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('play - isNeedToStop === false case', (done) => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const context = {
      getters: {
        isNeedToStop: false,
      },
      rootGetters: {
        'settings/isSoundEnabled': true,
      },
      commit,
      dispatch,
    }
    const play = jest.fn()
    const pause = jest.fn()
    const newAudio = {
      loop: false,
      play,
      pause,
    }
    ringtones.actions.play(context, newAudio)
    setTimeout(() => {
      expect(newAudio.loop).toBe(true)
      expect(commit).toHaveBeenCalledWith('incPreparingToPlay')
      expect(play).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('decPreparingToPlay')
      expect(pause).not.toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('stop')
      expect(commit).toHaveBeenCalledWith('updateCurrentAudio', newAudio)
      done()
    }, 0)
  })
})
