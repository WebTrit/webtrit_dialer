import { shallowMount, createLocalVue } from '@vue/test-utils'
import PanelRowItemLink from '@/components/Layout/PanelRowItemLink.vue'
import VueRouter from 'vue-router'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('PanelRowItemLink.vue mocked Router', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PanelRowItemLink, {
      localVue,
      propsData: {
        items: [
          { number: '234', id: '2' },
          { number: '8595', id: '1' },
          { number: '387447', id: '5' },
        ],
        linkName: 'ContactDetails',
      },
      mocks: {
        $route: {
          params: {
            number: '8595',
          },
        },
      },
      stubs: ['v-container', 'v-row', 'router-link'],
    })
  })

  it('selectItem sets selectedItem', () => {
    wrapper.vm.selectItem({ number: '8595', id: '1' })
    expect(wrapper.vm.selectedItem).toEqual({ number: '8595', id: '1' })
  })

  it('hoverItem sets hoveredItem', () => {
    wrapper.vm.hoverItem({ number: '8595', id: '1' })
    expect(wrapper.vm.hoveredItem).toEqual({ number: '8595', id: '1' })
  })

  it('unhoverItem sets hoveredItem to null', async () => {
    await wrapper.setData({
      hoveredItem: {
        number: '8595', id: '1',
      },
    })
    wrapper.vm.unhoverItem()
    expect(wrapper.vm.hoveredItem).toBeNull()
  })

  it('getContactId returns contact.number if linkName === "ContactDetails"', () => {
    expect(wrapper.vm.getContactId({ number: '234', id: '2' })).toBe('234')
  })

  it('getContactId returns contact.id if linkName !== "ContactDetails"', async () => {
    await wrapper.setProps({
      linkName: 'CallDetails',
    })
    expect(wrapper.vm.getContactId({ number: '234', id: '2' })).toBe('2')
  })

  it('mounted hook sets selectedItem if $route.params.number exists', () => {
    expect(wrapper.vm.selectedItem).toBe('8595')
  })
})

describe('PanelRowItemLink.vue real Router', () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = new VueRouter({ mode: 'abstract' })
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PanelRowItemLink, {
      localVue,
      router,
      propsData: {
        items: [
          { number: '234', id: '2' },
          { number: '8595', id: '1' },
          { number: '387447', id: '5' },
        ],
        linkName: 'ContactDetails',
      },
      stubs: ['v-container', 'v-row', 'router-link'],
    })
  })

  it('$route watcher sets selectedItem to null if there is no number in route params', async () => {
    await wrapper.setData({
      selectedItem: '34994',
    })
    await router.push('/another-route')
    expect(wrapper.vm.selectedItem).toBeNull()
  })

  it(`$route watcher doesn't set selectedItem to null if there number is passed
  in route params`, async () => {
    await wrapper.setData({
      selectedItem: '34994',
    })
    await router.push({ params: { number: '34343' } })
    expect(wrapper.vm.selectedItem).toBe('34994')
  })
})
