import { mount, createLocalVue } from '@vue/test-utils'
import CallRecord from '@/components/Home-Recent-Calls-Info/CallRecord.vue'
import VueRouter from 'vue-router'

jest.mock('@/mixins', () => ({
  calls: {},
}))

describe('CallRecord.vue', () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter({ mode: 'abstract' })
  localVue.filter('getDateTime', (data) => data)
  localVue.filter('prettySeconds', (data) => data)
  let wrapper

  beforeEach(() => {
    wrapper = mount(CallRecord, {
      localVue,
      router,
      propsData: {
        call: {
          id: 1,
        },
      },
      stubs: ['v-col', 'v-card', 'v-card-text', 'v-row', 'v-progress-linear'],
    })
  })

  it('updatePlayProgress updates play progress', () => {
    wrapper.vm.updatePlayProgress({ percentage: 10 })
    expect(wrapper.vm.playProgress).toBe(10)
  })

  it('$route watcher sets playProgress to 0', async () => {
    await wrapper.setData({
      playProgress: 10,
    })
    await router.push('/another-route')
    expect(wrapper.vm.playProgress).toBe(0)
  })
})
