/* eslint-disable max-classes-per-file */
import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import PlayBtn from '@/components/Shared/PlayBtn.vue'

config.showDeprecationWarnings = false

const breakpoints = {
  data() {
    return {
      breakpointSwitch: true,
    }
  },
  computed: {
    $_breakpoints_mobile: {
      get() {
        return this.breakpointSwitch
      },
      set(val) {
        this.breakpointSwitch = val
      },
    },
  },
}

describe('PlayBtn.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PlayBtn, {
      localVue,
      mixins: [breakpoints],
      propsData: {
        disabled: false,
        callId: 123,
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-tooltip', 'v-progress-circular', 'v-btn', 'v-icon'],
    })
  })

  it('currentIcon returns "$call-history-play" if State.EMPTY', async () => {
    await wrapper.setData({
      state: 0,
    })
    expect(wrapper.vm.currentIcon).toMatch(/play/)
  })

  it('currentIcon returns "$call-history-play" if State.PAUSED', async () => {
    await wrapper.setData({
      state: 2,
    })
    expect(wrapper.vm.currentIcon).toMatch(/play/)
  })

  it('currentIcon returns "$call-history-pause" if State.PLAYING', async () => {
    await wrapper.setData({
      state: 3,
    })
    expect(wrapper.vm.currentIcon).toMatch(/pause/)
  })

  it('currentIcon returns "$call-history-error" in default case', async () => {
    await wrapper.setData({
      state: 4,
    })
    expect(wrapper.vm.currentIcon).toMatch(/error/)
  })

  it('_handleEnded sets state to paused and percentage to 0', async () => {
    jest.useFakeTimers()
    await wrapper.setData({
      percentage: 20,
    })
    wrapper.vm._handleEnded()
    expect(wrapper.vm.state).toBe(2)
    jest.runAllTimers()
    expect(wrapper.vm.percentage).toBe(0)
    jest.useRealTimers()
  })

  it(`_handleEnded sets state to paused and doesn't affect percentage
  if breakpoint is not mobile`, async () => {
    wrapper.vm.$_breakpoints_mobile = false
    jest.useFakeTimers()
    await wrapper.setData({
      percentage: 20,
    })
    wrapper.vm._handleEnded()
    expect(wrapper.vm.state).toBe(2)
    jest.runAllTimers()
    expect(wrapper.vm.percentage).toBe(20)
    jest.useRealTimers()
  })

  it('_handlePlay sets state to playing', () => {
    wrapper.vm._handlePlay()
    expect(wrapper.vm.state).toBe(3)
  })

  it('_handlePaused sets state to paused', () => {
    wrapper.vm._handlePause()
    expect(wrapper.vm.state).toBe(2)
  })

  it('updateLocalProgress updates percentage', () => {
    wrapper.vm.updateLocalProgress(15)
    expect(wrapper.vm.percentage).toBe(15)
  })

  it('updateParentProgress emits event to parent', () => {
    wrapper.vm.updateParentProgress(15)
    expect(wrapper.emitted()['update-progress'][0]).toEqual([15])
  })

  it('updateProgress calls updateParentProgress if alwaysUpdParentProgress is set to true', async () => {
    await wrapper.setProps({
      alwaysUpdParentProgress: true,
    })
    const updateParentProgress = jest.fn()
    const updateLocalProgress = jest.fn()
    wrapper.setMethods({
      updateParentProgress,
      updateLocalProgress,
    })
    wrapper.vm.updateProgress(25)
    expect(updateParentProgress).toHaveBeenCalledWith({
      percentage: 25,
      id: 123,
    })
    expect(updateLocalProgress).not.toHaveBeenCalled()
  })

  it('updateProgress calls updateLocalProgress if breakpoint is mobile', async () => {
    await wrapper.setProps({
      alwaysUpdParentProgress: false,
    })
    const updateParentProgress = jest.fn()
    const updateLocalProgress = jest.fn()
    wrapper.setMethods({
      updateParentProgress,
      updateLocalProgress,
    })
    wrapper.vm.updateProgress(25)
    expect(updateParentProgress).not.toHaveBeenCalled()
    expect(updateLocalProgress).toHaveBeenCalledWith(25)
  })

  it(`updateProgress calls updateParentProgress if breakpoint is not mobile
  and alwaysUpdParentProgress is set to false`, async () => {
    await wrapper.setProps({
      alwaysUpdParentProgress: false,
    })
    wrapper.vm.$_breakpoints_mobile = false
    const updateParentProgress = jest.fn()
    const updateLocalProgress = jest.fn()
    wrapper.setMethods({
      updateParentProgress,
      updateLocalProgress,
    })
    wrapper.vm.updateProgress(25)
    expect(updateParentProgress).toHaveBeenCalledWith({
      percentage: 25,
      id: 123,
    })
    expect(updateLocalProgress).not.toHaveBeenCalled()
  })

  it('_handleTimeupdate calls updateProgress if player duration is set', () => {
    wrapper.vm.$refs = {
      audioPlayer: {
        duration: 20,
        currentTime: 5,
      },
    }
    const updateProgress = jest.fn()
    wrapper.setMethods({
      updateProgress,
    })
    wrapper.vm._handleTimeupdate()
    expect(updateProgress).toHaveBeenCalledWith(25)
  })

  it('_handleTimeupdate doesn\'t call updateProgress if player duration is not set', () => {
    wrapper.vm.$refs = {
      audioPlayer: {
        duration: NaN,
        currentTime: NaN,
      },
    }
    const updateProgress = jest.fn()
    wrapper.setMethods({
      updateProgress,
    })
    wrapper.vm._handleTimeupdate()
    expect(updateProgress).not.toHaveBeenCalled()
  })

  it('downloadPlayPause calls play if player is paused', () => {
    const play = jest.fn()
    const pause = jest.fn()
    wrapper.vm.$refs = {
      audioPlayer: {
        src: 'file.mp3',
        paused: true,
        play,
        pause,
      },
    }
    wrapper.vm.downloadPlayPause()
    expect(play).toHaveBeenCalled()
    expect(pause).not.toHaveBeenCalled()
  })

  it('downloadPlayPause calls pause if player is playing', () => {
    const play = jest.fn()
    const pause = jest.fn()
    wrapper.vm.$refs = {
      audioPlayer: {
        src: 'file.mp3',
        paused: false,
        play,
        pause,
      },
    }
    wrapper.vm.downloadPlayPause()
    expect(pause).toHaveBeenCalled()
    expect(play).not.toHaveBeenCalled()
  })

  it('downloadPlayPause loads source audio and attaches listeners to it', async (done) => {
    const play = jest.fn()
    const pause = jest.fn()
    const addEventListener = jest.fn()
    wrapper.vm.$refs = {
      audioPlayer: {
        src: undefined,
        paused: false,
        play,
        pause,
        addEventListener,
      },
    }
    const Blob = class {
      constructor([data], { type }) {
        this.data = data
        this.type = type
      }
    }
    global.Blob = Blob
    const createObjectURL = jest.fn().mockImplementation((data) => data)
    global.URL = {
      createObjectURL,
    }
    const getCallRecord = jest.fn().mockImplementation(() => Promise.resolve('file.mp3'))
    wrapper.setMethods({
      getCallRecord,
    })
    await wrapper.vm.downloadPlayPause()
    setTimeout(() => {
      expect(getCallRecord).toHaveBeenCalledWith(123)
      expect(wrapper.vm.$refs.audioPlayer.src).toEqual(
        { data: 'file.mp3', type: 'audio/mpeg' },
      )
      expect(addEventListener).toHaveBeenCalledWith('timeupdate', expect.any(Function))
      expect(addEventListener).toHaveBeenCalledWith('pause', expect.any(Function))
      expect(addEventListener).toHaveBeenCalledWith('play', expect.any(Function))
      expect(addEventListener).toHaveBeenCalledWith('ended', expect.any(Function))
      expect(wrapper.vm.state).toBe(2)
      done()
    }, 0)
  })

  it('downloadPlayPause loads source failure case', async (done) => {
    const play = jest.fn()
    const pause = jest.fn()
    wrapper.vm.$refs = {
      audioPlayer: {
        src: undefined,
        paused: false,
        play,
        pause,
      },
    }
    const error = {
      response: {
        status: 401,
      },
    }
    const getCallRecord = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.setMethods({
      getCallRecord,
    })
    await wrapper.vm.downloadPlayPause()
    setTimeout(() => {
      expect(getCallRecord).toHaveBeenCalledWith(123)
      expect(wrapper.vm.state).toBe(4)
      expect(wrapper.vm.lastErrorMessage.length).toBeGreaterThan(0)
      done()
    }, 0)
  })

  it('beforeDestroy hook removes eventListeners from audioPlayer', () => {
    const removeEventListener = jest.fn()
    wrapper.vm.$refs = {
      audioPlayer: {
        removeEventListener,
      },
    }
    PlayBtn.beforeDestroy.call(wrapper.vm)
    expect(removeEventListener).toHaveBeenCalledWith('timeupdate', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith('pause', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith('play', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith('ended', expect.any(Function))
  })
})
