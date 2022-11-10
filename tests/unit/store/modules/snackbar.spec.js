import snackbar from '@/store/modules/snackbar'

describe('snackbar.js mutations', () => {
  it('show makes snackbar visible', () => {
    const state = {}
    snackbar.mutations.show(state, 'message')
    expect(state.visible).toBe(true)
    expect(state.message).toBe('message')
  })

  it('hide makes snackbar invisible', () => {
    const state = {}
    snackbar.mutations.hide(state)
    expect(state.visible).toBe(false)
    expect(state.message).toBeNull()
  })
})

describe('snackbar.js actions', () => {
  it('show - triggers show mutation if snackbar is not visible', (done) => {
    const state = {
      visible: false,
    }
    const commit = jest.fn()
    snackbar.actions.show({ state, commit }, { message: 'message' })
    setTimeout(() => {
      expect(commit).toHaveBeenCalledWith('show', 'message')
      done()
    }, 0)
  })

  it('show - triggers hide mutation if snackbar is visible', (done) => {
    const state = {
      visible: true,
    }
    const commit = jest.fn()
    snackbar.actions.show({ state, commit }, { message: 'message' })
    setTimeout(() => {
      expect(commit).toHaveBeenCalledWith('hide')
      done()
    }, 0)
  })

  it('hide - triggers hide mutation if snackbar is visible', () => {
    const state = {
      visible: true,
    }
    const commit = jest.fn()
    snackbar.actions.hide({ state, commit })
    expect(commit).toHaveBeenCalledWith('hide')
  })

  it('hide - doesn\'t trigger hide mutation if snackbar is not visible', () => {
    const state = {
      visible: false,
    }
    const commit = jest.fn()
    snackbar.actions.hide({ state, commit })
    expect(commit).not.toHaveBeenCalled()
  })
})
