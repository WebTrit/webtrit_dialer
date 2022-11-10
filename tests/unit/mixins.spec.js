import Vue from 'vue'
import { mount, createLocalVue, config } from '@vue/test-utils'
import {
  breakpoints, janusRegistration, contacts, calls, errors,
} from '@/mixins'

config.showDeprecationWarnings = false

const tmpComponent = Vue.component('TmpComponent', {
  template: '<p></p>',
})

const localVue = createLocalVue()

describe('breakpoints', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(tmpComponent, {
      localVue,
      mixins: [breakpoints],
      mocks: {
        $vuetify: {
          breakpoint: {
            xs: true,
            sm: false,
            lg: false,
            xl: false,
          },
        },
      },
    })
  })

  it('$_breakpoints_mobile returns true if $vuetify.breakpoint.xs', () => {
    expect(wrapper.vm.$_breakpoints_mobile).toBe(true)
  })

  it('$_breakpoints_mobile returns true if $vuetify.breakpoint.sm', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.sm = true
    expect(wrapper.vm.$_breakpoints_mobile).toBe(true)
  })

  it('$_breakpoints_mobile returns false if $vuetify.breakpoint.lg', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.lg = true
    expect(wrapper.vm.$_breakpoints_mobile).toBe(false)
  })

  it('$_breakpoints_mobile returns false if $vuetify.breakpoint.xl', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.xl = true
    expect(wrapper.vm.$_breakpoints_mobile).toBe(false)
  })

  it('$_breakpoints_desktop returns false if $vuetify.breakpoint.xs', () => {
    expect(wrapper.vm.$_breakpoints_desktop).toBe(false)
  })

  it('$_breakpoints_desktop returns false if $vuetify.breakpoint.sm', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.sm = true
    expect(wrapper.vm.$_breakpoints_desktop).toBe(false)
  })

  it('$_breakpoints_desktop returns true if $vuetify.breakpoint.lg', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.lg = true
    expect(wrapper.vm.$_breakpoints_desktop).toBe(true)
  })

  it('$_breakpoints_desktop returns true if $vuetify.breakpoint.xl', () => {
    wrapper.vm.$vuetify.breakpoint.xs = false
    wrapper.vm.$vuetify.breakpoint.xl = true
    expect(wrapper.vm.$_breakpoints_desktop).toBe(true)
  })
})

describe('janusRegistration', () => {
  let wrapper
  const dispatch = jest.fn().mockImplementation(() => Promise.resolve())

  beforeEach(() => {
    wrapper = mount(tmpComponent, {
      localVue,
      mixins: [janusRegistration],
      mocks: {
        $store: {
          getters: {
            'settings/isRegisterEnabled': true,
          },
          dispatch,
        },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('$_janusRegistration_registerEnabled getter returns isRegisterEnabled from getters', () => {
    expect(wrapper.vm.$_janusRegistration_registerEnabled).toBe(true)
  })

  it('$_janusRegistration_registerEnabled setter dispatches action to store', async () => {
    wrapper.vm.$_janusRegistration_registerEnabled = false
    await wrapper.vm.$nextTick()
    expect(dispatch).toHaveBeenCalledWith('settings/setRegisterEnabled', false)
  })
})

describe('contacts', () => {
  let wrapper
  const updateLoading = jest.fn()
  const updateFetchError = jest.fn()
  const snackbarShow = jest.fn()

  beforeEach(() => {
    wrapper = mount(tmpComponent, {
      localVue,
      mixins: [contacts],
      methods: {
        updateLoading,
        updateFetchError,
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
        $store: {
          getters: {
            'contacts/items': [
              { id: 1, number: '43434', extension_id: '232' },
              { id: 2, number: '98229', extension_id: '223' },
              { id: 3, number: '28559', extension_id: '145' },
            ],
          },
        },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('$_contacts_getOneContact finds contact by contact number', () => {
    jest.spyOn(wrapper.vm, 'extendContactWithCalculatedProperties').mockImplementation((data) => data)
    expect(wrapper.vm.$_contacts_getOneContact('98229')).toEqual({ id: 2, number: '98229', extension_id: '223' })
  })

  it('$_contacts_getOneContact returns null if contact is not found', () => {
    jest.spyOn(wrapper.vm, 'extendContactWithCalculatedProperties').mockImplementation((data) => data)
    expect(wrapper.vm.$_contacts_getOneContact('454545')).toBeNull()
  })

  it('$_contacts_getOneContactExt finds contact by contact extension', () => {
    jest.spyOn(wrapper.vm, 'extendContactWithCalculatedProperties').mockImplementation((data) => data)
    expect(wrapper.vm.$_contacts_getOneContactExt('145')).toEqual({ id: 3, number: '28559', extension_id: '145' })
  })

  it('$_contacts_getOneContactExt returns null if contact is not found', () => {
    jest.spyOn(wrapper.vm, 'extendContactWithCalculatedProperties').mockImplementation((data) => data)
    expect(wrapper.vm.$_contacts_getOneContactExt('111')).toBeNull()
  })

  it('pickOutInitials picks initials from name', () => {
    expect(wrapper.vm.pickOutInitials('Test user')).toBe('TU')
  })

  it('pickOutInitials picks initials from name and puts ? if name is not provided', () => {
    expect(wrapper.vm.pickOutInitials('')).toBe('?')
  })

  it('$_contacts_getContacts success case', (done) => {
    const fetchContactsItems = jest.fn().mockImplementation(() => Promise.resolve())
    wrapper.setMethods({
      fetchContactsItems,
    })
    wrapper.vm.$_contacts_getContacts()
    setTimeout(() => {
      expect(updateLoading).toHaveBeenCalledWith(true)
      expect(updateFetchError).toHaveBeenCalledWith(false)
      expect(fetchContactsItems).toHaveBeenCalled()
      expect(updateFetchError).not.toHaveBeenCalledWith(true)
      expect(updateLoading).toHaveBeenCalledWith(false)
      done()
    }, 0)
  })

  it('$_contacts_getContacts fail case', (done) => {
    const error = {
      response: {
        status: 405,
        code: 'err code',
      },
    }
    const fetchContactsItems = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.setMethods({
      fetchContactsItems,
    })
    wrapper.vm.$_contacts_getContacts()
    setTimeout(() => {
      expect(updateLoading).toHaveBeenCalledWith(true)
      expect(updateFetchError).toHaveBeenCalledWith(false)
      expect(fetchContactsItems).toHaveBeenCalled()
      expect(updateFetchError).toHaveBeenCalledWith(true)
      expect(updateLoading).toHaveBeenCalledWith(false)
      expect(snackbarShow).toHaveBeenCalled()
      done()
    }, 0)
  })

  it('$_contacts_getContacts fail case 401 error', (done) => {
    const error = {
      response: {
        status: 401,
        code: 'err code',
      },
    }
    const fetchContactsItems = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.setMethods({
      fetchContactsItems,
    })
    wrapper.vm.$_contacts_getContacts()
    setTimeout(() => {
      expect(updateLoading).toHaveBeenCalledWith(true)
      expect(updateFetchError).toHaveBeenCalledWith(false)
      expect(fetchContactsItems).toHaveBeenCalled()
      expect(updateFetchError).toHaveBeenCalledWith(true)
      expect(updateLoading).toHaveBeenCalledWith(false)
      expect(snackbarShow).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('extendContactWithCalculatedProperties sets name as extension_name', () => {
    const contact = {
      extension_name: 'user',
    }
    const res = wrapper.vm.extendContactWithCalculatedProperties(contact)
    expect(res).toEqual({
      extension_name: 'user',
      name: 'user',
      initials: 'U',
    })
  })

  it('extendContactWithCalculatedProperties sets name as firstname', () => {
    const contact = {
      extension_name: null,
      firstname: 'user',
    }
    const res = wrapper.vm.extendContactWithCalculatedProperties(contact)
    expect(res).toEqual({
      extension_name: null,
      firstname: 'user',
      name: 'user',
      initials: 'U',
    })
  })

  it('extendContactWithCalculatedProperties sets name as firstname and lastname', () => {
    const contact = {
      extension_name: null,
      firstname: 'user',
      lastname: 'name',
    }
    const res = wrapper.vm.extendContactWithCalculatedProperties(contact)
    expect(res).toEqual({
      extension_name: null,
      firstname: 'user',
      lastname: 'name',
      name: 'user name',
      initials: 'UN',
    })
  })

  it('extendContactWithCalculatedProperties sets name as null', () => {
    const contact = {
      extension_name: null,
    }
    const res = wrapper.vm.extendContactWithCalculatedProperties(contact)
    expect(res).toEqual({
      extension_name: null,
      name: null,
      initials: null,
    })
  })
})

describe('calls', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(tmpComponent, {
      localVue,
      mixins: [calls],
    })
  })

  it('$_calls_getInterlocutor returns item.cli if call is incoming', () => {
    const item = {
      direction: 'incoming',
      cli: '23233',
      cld: '99484',
    }
    expect(wrapper.vm.$_calls_getInterlocutor(item)).toBe('23233')
  })

  it('$_calls_getInterlocutor returns item.cld if call is outgoing', () => {
    const item = {
      direction: 'outgoing',
      cli: '23233',
      cld: '99484',
    }
    expect(wrapper.vm.$_calls_getInterlocutor(item)).toBe('99484')
  })

  it('$_calls_getInterlocutor returns unknown if call is not incoming or outgoing', () => {
    const item = {
      direction: null,
      cli: '23233',
      cld: '99484',
    }
    expect(wrapper.vm.$_calls_getInterlocutor(item)).toMatch(/unknown/i)
  })

  it('$_calls_getFilename constructs filename', () => {
    jest.spyOn(wrapper.vm, '$_calls_getInterlocutor').mockImplementation(() => '99484')
    const item = {
      direction: 'incoming',
      cli: '23233',
      cld: '99484',
      connect_time: '2012-10-09',
    }
    expect(wrapper.vm.$_calls_getFilename(item)).toBe('2012-10-09 - 99484')
  })
})

describe('errors', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(tmpComponent, {
      localVue,
      mixins: [errors],
      mocks: {
        $t: (msg) => msg,
      },
    })
  })

  it('$_errors_parse returns error code', () => {
    const error = {
      response: {
        data: {
          code: 'err code',
        },
      },
    }
    expect(wrapper.vm.$_errors_parse(error)).toMatch(/err code/i)
  })

  it('$_errors_parse returns parsed error if code is parameters_validate_issue', () => {
    const error = {
      response: {
        data: {
          code: 'parameters_validate_issue',
          refining: [{
            path: '1',
            reason: 'r1',
          }, {
            path: '2',
            reason: 'r2',
          }],
        },
      },
    }
    expect(wrapper.vm.$_errors_parse(error)).toMatch(/parameters_validate_issue.1.r1/i)
    expect(wrapper.vm.$_errors_parse(error)).toMatch(/parameters_validate_issue.2.r2/i)
  })
})
