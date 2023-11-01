/* eslint-disable no-shadow */
const state = () => ({
  currentAudio: null,
  preparingPlayCounter: 0,
  needToStopCounter: 0,
  played: false,
})

const getters = {
  currentAudio(state) {
    return state.currentAudio
  },
  isPreparingToPlay(state) {
    return state.preparingPlayCounter !== 0
  },
  isNeedToStop(state) {
    return state.needToStopCounter !== 0
  },
  isPlayed(state) {
    return state.played
  },
}

const mutations = {
  updateCurrentAudio(state, newAudio) {
    state.currentAudio = newAudio
  },
  incPreparingToPlay(state) {
    state.preparingPlayCounter += 1
  },
  decPreparingToPlay(state) {
    state.preparingPlayCounter -= 1
  },
  incNeedToStop(state) {
    state.needToStopCounter += 1
  },
  decNeedToStop(state) {
    state.needToStopCounter -= 1
  },
  startPlayRingtone(state) {
    state.played = true
  },
  stopPlayRingtone(state) {
    state.played = false
  },
}

const actions = {
  async playIncoming(context) {
    await context.dispatch('play', new Audio(require('@/assets/ringtones/incoming-call-1.mp3')))
  },
  async playOutgoing(context) {
    await context.dispatch('play', new Audio(require('@/assets/ringtones/outgoing-call-1.mp3')))
  },
  async play(context, newAudio) {
    // Check ringtone disable on settings
    if (!context.rootGetters['settings/isSoundEnabled']) return
    const { isPlayed } = context.getters
    // Check ringtone already played
    if (isPlayed) return

    newAudio.loop = true
    context.commit('incPreparingToPlay')
    try {
      context.commit('startPlayRingtone')
      await newAudio.play()
    } catch (e) {
      console.warn('Autoplay was prevented', e)
    }
    context.commit('decPreparingToPlay')

    if (context.getters.isNeedToStop) {
      newAudio.pause()
      context.commit('stopPlayRingtone')
      context.commit('decNeedToStop')
    } else {
      await context.dispatch('stop') // stop currentAudio if any
      context.commit('updateCurrentAudio', newAudio)
    }
  },
  async stop(context) {
    const { currentAudio } = context.getters
    if (currentAudio) {
      currentAudio.pause()
      context.commit('stopPlayRingtone')
      context.commit('updateCurrentAudio', null)
    } else if (context.getters.isPreparingToPlay) {
      context.commit('incNeedToStop')
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
