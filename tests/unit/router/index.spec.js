import router from '@/router'
import store from '@/store'

jest.mock('@/store', () => ({
  state: {
    got401error: true,
  },
  getters: {
    'account/isLogin': false,
  },
  commit: jest.fn(),
}))

describe('router', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('beforeEach hook - got401error case', (done) => {
    const next = jest.fn()
    const to = {}
    const from = {}
    router.beforeHooks[0](to, from, next)
    setTimeout(() => {
      expect(store.commit).toHaveBeenCalledWith('set401error', false)
      expect(next).toHaveBeenCalledWith()
      done()
    }, 0)
  })

  it('beforeEach hook - on Login component route and isLogin === true', (done) => {
    store.state.got401error = false
    store.getters['account/isLogin'] = true
    const next = jest.fn()
    const to = { name: 'Login' }
    const from = {}
    router.beforeHooks[0](to, from, next)
    setTimeout(() => {
      expect(store.commit).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith({ name: 'Home' })
      done()
    }, 0)
  })

  it('beforeEach hook - on Login component route and isLogin === false', (done) => {
    store.state.got401error = false
    store.getters['account/isLogin'] = false
    const next = jest.fn()
    const to = { name: 'Login' }
    const from = {}
    router.beforeHooks[0](to, from, next)
    setTimeout(() => {
      expect(store.commit).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith()
      done()
    }, 0)
  })

  it('beforeEach hook - not on Login component route and isLogin === true', (done) => {
    store.state.got401error = false
    store.getters['account/isLogin'] = true
    const next = jest.fn()
    const to = { name: 'Home' }
    const from = {}
    router.beforeHooks[0](to, from, next)
    setTimeout(() => {
      expect(store.commit).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith()
      done()
    }, 0)
  })

  it('beforeEach hook - not on Login component route and isLogin === false', (done) => {
    store.state.got401error = false
    store.getters['account/isLogin'] = false
    const next = jest.fn()
    const to = { name: 'Home' }
    const from = {}
    router.beforeHooks[0](to, from, next)
    setTimeout(() => {
      expect(store.commit).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith({ name: 'Login' })
      done()
    }, 0)
  })
})
