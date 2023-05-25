import account from '@/store/modules/account'
import { extendContactWithCalculatedProperties } from '@/store/helpers'

import axios from 'axios'

jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
}))

jest.mock('@/store/helpers', () => ({
  ...(jest.requireActual('@/store/helpers')),
  extendContactWithCalculatedProperties: jest.fn().mockImplementation((data) => data.login),
}))

describe('account.js getters', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('token returns state.token', () => {
    const state = {
      token: '11234',
    }
    expect(account.getters.token(state)).toBe('11234')
  })

  it('isLogin returns true if token is provided', () => {
    const state = {
      token: '11234',
    }
    expect(account.getters.isLogin(state)).toBe(true)
  })

  it('isLogin returns false if token is not provided', () => {
    const state = {
      token: null,
    }
    expect(account.getters.isLogin(state)).toBe(false)
  })

  it('login returns state.info.login if it is provided', () => {
    const state = {
      info: {
        login: '1243',
      },
    }
    expect(account.getters.login(state)).toBe('1243')
  })

  it('login returns undefined if state.info.login is not provided', () => {
    const state = {
      info: null,
    }
    expect(account.getters.login(state)).toBeFalsy()
  })

  it('balance debit success case', () => {
    const state = {
      info: {
        billing_model: 'debit',
        balance: 49.033,
        currency: 'USD',
      },
    }
    expect(account.getters.balance(state)).toBe('49.03 USD')
  })

  it('balance debit fail case', () => {
    const state = {
      info: null,
    }
    expect(account.getters.balance(state)).toBeNull()
  })

  it('balance credit success case', () => {
    const state = {
      info: {
        billing_model: 'credit',
        credit_limit: 23.090,
        currency: 'EUR',
      },
    }
    expect(account.getters.balance(state)).toBe('23.09 EUR')
  })

  it('balance credit fail case', () => {
    const state = {
      info: {
        billing_model: 'credit',
        credit_limit: null,
        currency: 'EUR',
      },
    }
    expect(account.getters.balance(state)).toBeNull()
  })

  it('balance default case', () => {
    const state = {
      info: {
        billing_model: 'other',
        credit_limit: null,
        balance: 0,
        currency: 'EUR',
      },
    }
    expect(account.getters.balance(state)).toBeNull()
  })

  it('info returns null if state.info is not provided', () => {
    const state = {
      info: null,
    }
    expect(account.getters.info(state)).toBeNull()
  })

  it('info calls extendContactWithCalculatedProperties fn if state.info is provided', () => {
    const state = {
      info: {
        login: '3435',
      },
    }
    const res = account.getters.info(state)
    expect(extendContactWithCalculatedProperties).toHaveBeenCalledWith({
      login: '3435',
    })
    expect(res).toBe('3435')
  })
})

describe('account.js mutations', () => {
  it('updateToken sets state.token', () => {
    const state = {}
    account.mutations.updateToken(state, '3445')
    expect(state.token).toBe('3445')
  })

  it('updateInfo sets state.info', () => {
    const state = {}
    account.mutations.updateInfo(state, { login: '3445' })
    expect(state.info).toEqual({ login: '3445' })
  })

  it('setUpdateInterval sets balance interval', () => {
    const state = {
      updateInterval: null,
    }
    account.mutations.setUpdateInterval(state, 'interval')
    expect(state.updateInterval).toBe('interval')
  })

  it('clearUpdateInterval clears balance interval', () => {
    const state = {
      updateInterval: 'interval',
    }
    account.mutations.clearUpdateInterval(state, 'interval')
    expect(state.updateInterval).toBeNull()
  })
})

describe('account.js actions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('tryDemo calls axions.post and returns token', async (done) => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: '656',
      },
    })
    const res = await account.actions.tryDemo({}, '44554')
    setTimeout(() => {
      expect(axios.post).toHaveBeenCalledWith('/session/demo-try', '44554')
      expect(res).toBe('656')
      done()
    }, 0)
  })

  it('requestOtp calls axions.post and returns otpId', async (done) => {
    axios.post.mockResolvedValueOnce({
      data: {
        otpId: '2323',
      },
    })
    const res = await account.actions.requestOtp({}, '445154')
    setTimeout(() => {
      expect(axios.post).toHaveBeenCalledWith('/session/otp-request', '445154')
      expect(res).toBe('2323')
      done()
    }, 0)
  })

  it('verifyOtp calls axions.post and returns token', async (done) => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: '2232',
      },
    })
    const res = await account.actions.verifyOtp({}, '8898')
    setTimeout(() => {
      expect(axios.post).toHaveBeenCalledWith('/session/otp-verify', '8898')
      expect(res).toBe('2232')
      done()
    }, 0)
  })

  it('login commits token', () => {
    const commit = jest.fn()
    const context = {
      commit,
    }
    account.actions.login(context, '5454')
    expect(commit).toHaveBeenCalledWith('updateToken', '5454')
  })

  it('logout calls axios.delete and nullifies token and info', async (done) => {
    const state = {
      updateBalanceInterval: 22,
    }
    const commit = jest.fn()
    account.actions.logout({ state, commit })
    setTimeout(() => {
      expect(commit).toHaveBeenCalledWith('clearBalanceInterval')
      expect(axios.delete).toHaveBeenCalledWith('/session')
      expect(commit).toHaveBeenCalledWith('updateToken', null)
      expect(commit).toHaveBeenCalledWith('updateInfo', null)
      done()
    }, 0)
  })

  it('getInfo gets account info', (done) => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: 'some data',
      },
    })
    const commit = jest.fn()
    const dispatch = jest.fn()
    account.actions.getInfo({ commit, dispatch })
    setTimeout(() => {
      expect(axios.get).toHaveBeenCalledWith('/account/info')
      expect(commit).toHaveBeenCalledWith('updateInfo', 'some data')
      expect(dispatch).toHaveBeenCalledWith('updateBalanceData')
      done()
    }, 0)
  })

  it('editInfo calls axios.patch and updates info', async (done) => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: 'info',
      },
    })
    const commit = jest.fn()
    await account.actions.editInfo({ commit }, 'edit')
    setTimeout(() => {
      expect(axios.patch).toHaveBeenCalledWith('/account/info', 'edit')
      expect(axios.get).toHaveBeenCalledWith('/account/info')
      expect(commit).toHaveBeenCalledWith('updateInfo', 'info')
      done()
    }, 0)
  })

  it(`updateBalanceData calls axios.get and sets balance data if
  updateBalanceInterval already exists`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          balance: 34.343,
        },
      },
    })
    const state = {
      updateBalanceInterval: 2,
    }
    const commit = jest.fn()
    await account.actions.updateBalanceData({ state, commit })
    expect(axios.get).toHaveBeenCalledWith('/account/info')
    expect(commit).toHaveBeenCalledWith('updateBalance', 34.343)
  })

  it(`updateBalanceData sets update balance interval if
  updateBalanceInterval doesn't exist`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          balance: 34.343,
        },
      },
    })
    const state = {
      updateBalanceInterval: null,
    }
    const commit = jest.fn()
    jest.useFakeTimers()
    await account.actions.updateBalanceData({ state, commit })
    expect(commit).toHaveBeenCalledWith('updateBalanceInterval', expect.any(Number))
    jest.useRealTimers()
  })
})
