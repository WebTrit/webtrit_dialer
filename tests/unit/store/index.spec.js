import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/store/index'

jest.mock('@/plugins/i18n', () => ({}))
jest.mock('@/store/modules/account', () => ({}))
jest.mock('@/store/modules/call-history', () => ({}))
jest.mock('@/store/modules/contacts', () => ({}))
jest.mock('@/store/modules/ringtones', () => ({}))
jest.mock('@/store/modules/settings', () => ({}))
jest.mock('@/store/modules/snackbar', () => ({}))
jest.mock('@/store/modules/webrtc', () => ({}))

describe('index.js mutations', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  it('toggleDialogNumberVisibility mutation toggles modal window visibility', () => {
    store.commit('toggleDialogNumberVisibility', true)
    expect(store.state.dialogNumberVisibility).toBe(true)
  })

  it('set401error mutation sets got401error', () => {
    store.commit('set401error', true)
    expect(store.state.got401error).toBe(true)
  })
})
