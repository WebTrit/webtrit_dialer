import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactsList from '@/components/Contacts/ContactsList.vue'

describe('ContactsList.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactsList, {
      localVue,
      propsData: {
        items: [
          { id: '1', title: 'abc', name: '2' },
          { id: '2', title: 'bcd', name: 'abc' },
          { id: '3', title: 'efg', name: '222' },
        ],
        search: '',
        currentPage: 1,
        sort: 'name',
        loading: false,
        itemsPerPage: 25,
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-icon', 'v-pagination', 'v-progress-linear'],
    })
  })

  it('trimmedSearch returns empty string if search not provided', async () => {
    await wrapper.setProps({
      search: '',
    })
    expect(wrapper.vm.trimmedSearch).toBe('')
  })

  it('trimmedSearch returns trimmed search', async () => {
    await wrapper.setProps({
      search: '  text',
    })
    expect(wrapper.vm.trimmedSearch).toBe('text')
  })

  it('filteredItems returns items if search is not provided', async () => {
    await wrapper.setProps({
      search: '',
    })
    expect(wrapper.vm.filteredItems).toEqual([
      { id: '1', title: 'abc', name: '2' },
      { id: '2', title: 'bcd', name: 'abc' },
      { id: '3', title: 'efg', name: '222' },
    ])
  })

  it('filteredItems returns items that contain case-insensitive searched word', async () => {
    await wrapper.setProps({
      search: 'ABC',
    })
    expect(wrapper.vm.filteredItems).toEqual([
      { id: '1', title: 'abc', name: '2' },
      { id: '2', title: 'bcd', name: 'abc' },
    ])
  })

  it(`sortedItems shows items according to itemsPerPage number if sort filter
  is not provided`, async () => {
    await wrapper.setProps({
      search: '',
      sort: '',
      currentPage: 1,
      itemsPerPage: 2,
    })
    expect(wrapper.vm.sortedItems).toEqual([
      { id: '1', title: 'abc', name: '2' },
      { id: '2', title: 'bcd', name: 'abc' },
    ])
  })

  it(`sortedItems shows sorted items according to itemsPerPage number if sort filter
  is provided`, async () => {
    await wrapper.setProps({
      search: '',
      sort: 'name',
      currentPage: 1,
      itemsPerPage: 2,
    })
    expect(wrapper.vm.sortedItems).toEqual([
      { id: '1', title: 'abc', name: '2' },
      { id: '3', title: 'efg', name: '222' },
    ])
  })

  it('page returns currenPage', async () => {
    await wrapper.setProps({
      currentPage: 2,
    })
    expect(wrapper.vm.page).toBe(2)
  })

  it('page setter emits event', async () => {
    await wrapper.setData({
      page: 3,
    })
    expect(wrapper.emitted()['update-page']).toBeTruthy()
  })

  it('pageLength returns 1 if items are empty', async () => {
    await wrapper.setProps({
      items: [],
    })
    expect(wrapper.vm.pageLength).toBe(1)
  })

  it('pageLength returns page count for items', async () => {
    await wrapper.setProps({
      search: '',
      items: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      itemsPerPage: 2,
    })
    expect(wrapper.vm.pageLength).toBe(3)
  })

  it('search watcher emits event wehen search field changes', async () => {
    await wrapper.setProps({
      search: 'new search',
    })
    expect(wrapper.emitted()['update-page']).toBeTruthy()
  })

  it('renders items and pagination blocks if items are not empty', () => {
    expect(wrapper.find('.contacts-list__items').exists()).toBe(true)
    expect(wrapper.find('.contacts-list__pagination').exists()).toBe(true)
    expect(wrapper.find('emptycontent-stub').exists()).toBe(false)
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(false)
  })

  it('renders progress bar during loading', async () => {
    await wrapper.setProps({
      loading: true,
      items: [],
    })
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(true)
    expect(wrapper.find('.contacts-list__items').exists()).toBe(false)
    expect(wrapper.find('.contacts-list__pagination').exists()).toBe(false)
    expect(wrapper.find('emptycontent-stub').exists()).toBe(false)
  })

  it('renders empty content image', async () => {
    await wrapper.setProps({
      loading: false,
      items: [],
    })
    expect(wrapper.find('emptycontent-stub').exists()).toBe(true)
    expect(wrapper.find('v-progress-linear-stub').exists()).toBe(false)
    expect(wrapper.find('.contacts-list__items').exists()).toBe(false)
    expect(wrapper.find('.contacts-list__pagination').exists()).toBe(false)
  })
})
