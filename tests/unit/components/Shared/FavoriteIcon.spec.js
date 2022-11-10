import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import FavoriteIcon from '@/components/Shared/FavoriteIcon.vue'

config.showDeprecationWarnings = false

describe('FavoriteIcon.vue', () => {
  const localVue = createLocalVue()
  const commit = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(FavoriteIcon, {
      localVue,
      data() {
        return {
          savedSwitch: ['2344', '4545', '8989', '7846'],
        }
      },
      propsData: {
        contactNumber: '7846',
      },
      computed: {
        login() {
          return '2344'
        },
        savedFavorites: {
          get() {
            return this.savedSwitch
          },
          set(val) {
            this.savedSwitch = val
          },
        },
      },
      mocks: {
        $store: {
          commit,
        },
      },
      stubs: ['v-icon'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('contactInFavorites returns true if number is in saved favorites', () => {
    expect(wrapper.vm.contactInFavorites).toBe(true)
  })

  it('contactInFavorites returns false if number is not in saved favorites', async () => {
    await wrapper.setProps({
      contactNumber: '1111',
    })
    expect(wrapper.vm.contactInFavorites).toBe(false)
  })

  it('toggleFavorite deletes existing number from favorites', () => {
    wrapper.vm.toggleFavorite()
    expect(commit).toHaveBeenCalledWith('contacts/setFavoriteNumbers', {
      login: '2344',
      nums: ['2344', '4545', '8989'],
    })
  })

  it('toggleFavorite adds new number to favorites', async () => {
    await wrapper.setProps({
      contactNumber: '1111',
    })
    wrapper.vm.toggleFavorite()
    expect(commit).toHaveBeenCalledWith('contacts/setFavoriteNumbers', {
      login: '2344',
      nums: ['2344', '4545', '8989', '7846', '1111'],
    })
  })
})
