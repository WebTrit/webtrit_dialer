import { shallowMount, createLocalVue } from '@vue/test-utils'
import Avatar from '@/components/Shared/Avatar.vue'

describe('Avatar.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Avatar, {
      localVue,
      propsData: {
        color: 'red',
        size: 40,
      },
      stubs: ['v-avatar', 'v-gravatar'],
    })
  })

  it('gravatar component is not rendered if email is not provided', () => {
    expect(wrapper.find('v-gravatar-stub').exists()).toBeFalsy()
  })

  it('gravatar component is rendered if email is provided', async () => {
    await wrapper.setProps({
      email: 'test@test.com',
    })
    expect(wrapper.find('v-gravatar-stub').exists()).toBeTruthy()
  })
})
