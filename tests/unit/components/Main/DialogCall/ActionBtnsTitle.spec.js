import { shallowMount, createLocalVue } from '@vue/test-utils'
import ActionBtnsTitle from '@/components/Main/DialogCall/ActionBtnsTitle.vue'

describe('ActionBtnsTitle.vue', () => {
  const localVue = createLocalVue()

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ActionBtnsTitle, {
      localVue,
      propsData: {
        holdActive: false,
        callDescription: 'interlocutor',
      },
      computed: {
        videoCall() {
          return false
        },
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {
            xs: true,
            sm: false,
          },
        },
      },
      stubs: ['v-col'],
    })
  })

  it('renders timer on small screens', () => {
    expect(wrapper.find('timer-stub').exists()).toBe(true)
  })

  it('renders timer on small screens', async () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.sm = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('timer-stub').exists()).toBe(false)
  })
})
