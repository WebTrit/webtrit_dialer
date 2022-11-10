import { shallowMount, createLocalVue } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      localVue,
      data() {
        return {
          callHistoryItemsSwitch: [],
          contactsItemsSwitch: [],
          breakpointSwitch: false,
        }
      },
      computed: {
        callHistoryItems: {
          get() {
            return this.callHistoryItemsSwitch
          },
          set(val) {
            this.callHistoryItemsSwitch = val
          },
        },
        contactsItems: {
          get() {
            return this.contactsItemsSwitch
          },
          set(val) {
            this.contactsItemsSwitch = val
          },
        },
        $_breakpoints_desktop: {
          get() {
            return this.breakpointSwitch
          },
          set(val) {
            this.breakpointSwitch = val
          },
        },
      },
      mocks: {
        $t: (msg) => msg,
        $vuetify: {
          breakpoint: {},
        },
        $route: {
          params: {
            number: '3434',
          },
          matched: [{
            name: 'CallDetails',
          }],
        },
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-tabs', 'v-tabs-items', 'v-tab', 'v-card',
        'v-card-text', 'v-tabs-item', 'router-view'],
    })
  })

  it('tabs returns 2 tabs', () => {
    expect(wrapper.vm.tabs[0]).toMatch(/Contacts/i)
    expect(wrapper.vm.tabs[1]).toMatch(/Recent Calls/i)
    expect(wrapper.vm.tabs).toHaveLength(2)
  })

  it('itemsLoaded is false if callHistoryItems is empty', () => {
    wrapper.vm.contactsItems = [
      { id: '1' },
    ]
    expect(wrapper.vm.itemsLoaded).toBe(false)
  })

  it('itemsLoaded is false if contactsItems is empty', () => {
    wrapper.vm.callHistoryItems = [
      { id: '1' },
    ]
    expect(wrapper.vm.itemsLoaded).toBe(false)
  })

  it('itemsLoaded is true if callHistoryItems & contactsItems are not empty', () => {
    wrapper.vm.callHistoryItems = [
      { id: '1' },
    ]
    wrapper.vm.contactsItems = [
      { id: '1' },
    ]
    expect(wrapper.vm.itemsLoaded).toBe(true)
  })

  it('threeColumns returns false if no $route.params.number provided', () => {
    wrapper.vm.$route.params.number = undefined
    expect(wrapper.vm.threeColumns()).toBeFalsy()
  })

  it('threeColumns returns false if $_breakpoints_desktop is false', () => {
    wrapper.vm.$_breakpoints_desktop = false
    expect(wrapper.vm.threeColumns()).toBeFalsy()
  })

  it('threeColumns returns false if $route.params.number is set & $_breakpoints_desktop is true', () => {
    wrapper.vm.$_breakpoints_desktop = true
    expect(wrapper.vm.threeColumns()).toBe(true)
  })

  it('callsSubRoute returns true if $route is on CallDetails nested route', () => {
    expect(wrapper.vm.callsSubRoute()).toBe(true)
  })

  it('callsSubRoute returns false if $route is not on CallDetails nested route', () => {
    wrapper.vm.$route.matched = [{
      name: 'ContactDetails',
    }]
    expect(wrapper.vm.callsSubRoute()).toBe(false)
  })
})
