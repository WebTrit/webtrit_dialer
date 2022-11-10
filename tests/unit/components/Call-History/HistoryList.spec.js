import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import HistoryList from '@/components/Call-History/HistoryList.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  calls: {
    $_calls_getInterlocutor: jest.fn(),
    $_calls_getFilename: jest.fn(),
  },
}))

describe('HistoryList.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(HistoryList, {
      localVue,
      propsData: {
        pageLength: 5,
        currentPage: 1,
        loading: false,
        items: [{}],
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-icon', 'v-pagination', 'v-progress-linear'],
    })
  })

  it('page equals to currentPage prop', () => {
    expect(wrapper.vm.page).toBe(1)
  })

  it('setting page emits event', () => {
    wrapper.setData({
      page: 2,
    })
    expect(wrapper.emitted()['update-page']).toBeTruthy()
  })

  it('renders items and pagination blocks if items are not empty', () => {
    expect(wrapper.find('.history-list__items').exists()).toBe(true)
    expect(wrapper.find('.history-list__pagination').exists()).toBe(true)
    expect(wrapper.find('emptycontent-stub').exists()).toBe(false)
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(false)
  })

  it('renders progress bar during loading', async () => {
    await wrapper.setProps({
      loading: true,
      items: [],
    })
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(true)
    expect(wrapper.find('.history-list__items').exists()).toBe(false)
    expect(wrapper.find('.history-list__pagination').exists()).toBe(false)
    expect(wrapper.find('emptycontent-stub').exists()).toBe(false)
  })

  it('renders empty content image', async () => {
    await wrapper.setProps({
      loading: false,
      items: [],
    })
    expect(wrapper.find('emptycontent-stub').exists()).toBe(true)
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(false)
    expect(wrapper.find('.history-list__items').exists()).toBe(false)
    expect(wrapper.find('.history-list__pagination').exists()).toBe(false)
  })
})
