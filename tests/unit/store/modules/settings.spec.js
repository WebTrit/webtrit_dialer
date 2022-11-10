import settings from '@/store/modules/settings'

describe('settings.js getters', () => {
  it('isNotificationsEnabled returns state.isNotificationsEnabled', () => {
    const state = {
      notificationsEnabled: true,
    }
    expect(settings.getters.isNotificationsEnabled(state)).toBe(true)
  })

  it('isSoundEnabled returns state.isSoundEnabled', () => {
    const state = {
      soundEnabled: true,
    }
    expect(settings.getters.isSoundEnabled(state)).toBe(true)
  })

  it('isRegisterEnabled returns state.isRegisterEnabled', () => {
    const state = {
      registerEnabled: true,
    }
    expect(settings.getters.isRegisterEnabled(state)).toBe(true)
  })
})

describe('settings.js mutations', () => {
  it('setNotificationsEnabled sets notifications enabled', () => {
    const state = {}
    settings.mutations.setNotificationsEnabled(state, false)
    expect(state.notificationsEnabled).toBe(false)
  })

  it('setSoundEnabled sets sound enabled', () => {
    const state = {}
    settings.mutations.setSoundEnabled(state, false)
    expect(state.soundEnabled).toBe(false)
  })

  it('setRegisterEnabled sets register enabled', () => {
    const state = {}
    settings.mutations.setRegisterEnabled(state, false)
    expect(state.registerEnabled).toBe(false)
  })
})

describe('settings.js actions', () => {
  it('setNotificationsEnabled commits notifications enabled', () => {
    const commit = jest.fn()
    const context = {
      commit,
    }
    settings.actions.setNotificationsEnabled(context, true)
    expect(commit).toHaveBeenCalledWith('setNotificationsEnabled', true)
  })

  it('setSoundEnabled commits sound enabled', () => {
    const commit = jest.fn()
    const context = {
      commit,
    }
    settings.actions.setSoundEnabled(context, true)
    expect(commit).toHaveBeenCalledWith('setSoundEnabled', true)
  })

  it('setRegisterEnabled commits register enabled', () => {
    const commit = jest.fn()
    const context = {
      commit,
    }
    settings.actions.setRegisterEnabled(context, true)
    expect(commit).toHaveBeenCalledWith('setRegisterEnabled', true)
  })
})
