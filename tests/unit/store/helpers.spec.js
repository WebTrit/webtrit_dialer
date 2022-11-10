import * as helpers from '@/store/helpers'

describe('helpers.js', () => {
  it('pickOutInitials gets initials from name', () => {
    const res = helpers.pickOutInitials('User name')
    expect(res).toBe('UN')
  })

  it('pickOutInitials puts ? if name is empty', () => {
    const res = helpers.pickOutInitials('')
    expect(res).toBe('?')
  })

  it('extendContactWithCalculatedProperties sets name as extension_name', () => {
    const contact = {
      extension_name: 'user',
    }
    const res = helpers.extendContactWithCalculatedProperties(contact)
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
    const res = helpers.extendContactWithCalculatedProperties(contact)
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
    const res = helpers.extendContactWithCalculatedProperties(contact)
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
    const res = helpers.extendContactWithCalculatedProperties(contact)
    expect(res).toEqual({
      extension_name: null,
      name: null,
      initials: null,
    })
  })

  it('getOneContact returns null if contact is not found in contacts array', () => {
    const contacts = [
      { number: '35565' },
      { number: '9849485' },
      { number: '23112' },
    ]
    const res = helpers.getOneContact('89898', contacts)
    expect(res).toBeNull()
  })

  it('getOneContact returns selected contact with extended props', () => {
    const contacts = [
      { number: '35565' },
      { number: '9849485' },
      {
        number: '23112',
        extension_name: null,
        firstname: 'user',
      },
    ]
    const res = helpers.getOneContact('23112', contacts)
    expect(res).toEqual({
      number: '23112',
      extension_name: null,
      firstname: 'user',
      name: 'user',
      initials: 'U',
    })
  })

  it('getOneContactExt returns null if contact is not found in contacts array', () => {
    const contacts = [
      { extension_id: '35565' },
      { extension_id: '9849485' },
      { extension_id: '23112' },
    ]
    const res = helpers.getOneContactExt('89898', contacts)
    expect(res).toBeNull()
  })

  it('getOneContactExt returns selected contact with extended props', () => {
    const contacts = [
      { extension_id: '35565' },
      { extension_id: '9849485' },
      { extension_id: '23112', extension_name: 'user' },
    ]
    const res = helpers.getOneContactExt('23112', contacts)
    expect(res).toEqual({
      extension_name: 'user',
      extension_id: '23112',
      name: 'user',
      initials: 'U',
    })
  })

  it('getInterlocutor returns item.cli if call direction is incoming', () => {
    const item = {
      direction: 'incoming',
      cli: '34343',
      cld: '82928',
    }
    const res = helpers.getInterlocutor(item)
    expect(res).toBe('34343')
  })

  it('getInterlocutor returns item.cld if call direction is outgoing', () => {
    const item = {
      direction: 'outgoing',
      cli: '34343',
      cld: '82928',
    }
    const res = helpers.getInterlocutor(item)
    expect(res).toBe('82928')
  })

  it('getInterlocutor returns unknown if call direction is not provided', () => {
    const item = {
      direction: null,
      cli: '34343',
      cld: '82928',
    }
    const res = helpers.getInterlocutor(item)
    expect(res).toBe('unknown')
  })

  it('getInterlocutorNumber returns null if interlocutor is unknown', () => {
    const res = helpers.getInterlocutorNumber('unknown')
    expect(res).toBeNull()
  })

  it('getInterlocutorNumber - if interlocutor has no spaces case', () => {
    const res = helpers.getInterlocutorNumber('2873283')
    expect(res).toEqual({ type: 'number', number: '2873283' })
  })

  it('getInterlocutorNumber - if interlocutor contains spaces case', () => {
    const res = helpers.getInterlocutorNumber('name 2873283')
    expect(res).toEqual({ type: 'ext', number: '2873283' })
  })

  it('getErrorCode returns 401 if supplied code === 401', () => {
    const res = helpers.getErrorCode(401)
    expect(res).toBe('401')
  })

  it('getErrorCode returns 480 if supplied code === 480', () => {
    const res = helpers.getErrorCode(480)
    expect(res).toBe('480')
  })

  it('getErrorCode returns 486 if supplied code === 486', () => {
    const res = helpers.getErrorCode(486)
    expect(res).toBe('486')
  })

  it('getErrorCode returns 400 if supplied code starts from 4 and has length of 3', () => {
    const res = helpers.getErrorCode(402)
    expect(res).toBe('400')
  })

  it('getErrorCode returns 4000 if supplied code starts from 4 and has length of 4', () => {
    const res = helpers.getErrorCode(4002)
    expect(res).toBe('4000')
  })

  it('getErrorCode returns supplied code in default case', () => {
    const res = helpers.getErrorCode('1010')
    expect(res).toBe('1010')
  })

  it('getContact calls getOneContact if data.type is number', () => {
    const rootGetters = {
      'contacts/items': [{ number: '34343', extension_name: 'ext' }],
    }
    const data = {
      type: 'number',
      number: '34343',
    }
    const res = helpers.getContact(data, rootGetters)
    expect(res).toEqual({
      extension_name: 'ext', initials: 'E', name: 'ext', number: '34343',
    })
  })

  it('getContact calls getOneContactExt if data.type is ext', () => {
    const rootGetters = {
      'contacts/items': [{ extension_id: '34343', extension_name: 'ext' }],
    }
    const data = {
      type: 'ext',
      number: '34343',
    }
    const res = helpers.getContact(data, rootGetters)
    expect(res).toEqual({
      extension_id: '34343',
      extension_name: 'ext',
      name: 'ext',
      initials: 'E',
    })
  })

  it('getContact returns null if data is not provided', () => {
    const rootGetters = {
      'contacts/items': [{ extension_id: '34343', extension_name: 'ext' }],
    }
    const data = null
    const res = helpers.getContact(data, rootGetters)
    expect(res).toBeNull()
  })
})
