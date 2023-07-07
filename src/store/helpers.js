import i18n from '@/plugins/i18n'

export function pickOutInitials(name) {
  return name.split(' ', 3).map((n) => (n.length >= 1 ? n[0].toUpperCase() : '?')).join('')
}

export function extendContactWithCalculatedProperties(contact) {
  contact.name = (`${contact.first_name || ''} ${contact.last_name || ''}`).trim()
    || contact.sip?.display_name
    || contact.email
    || i18n.t('user.Unknown')
  contact.initials = pickOutInitials(contact.name)
  return contact
}

export function getInterlocutor(item) {
  if (item.direction === 'incoming' || item.direction === 'forwarded') {
    return item.cli
  } else if (item.direction === 'outgoing') {
    return item.cld
  } else {
    return 'unknown'
  }
}

export function getInterlocutorNumber(interlocutor) {
  if (interlocutor === 'unknown') {
    return null
  }
  if (/\s/.test(interlocutor) === false) {
    return { type: 'number', number: interlocutor }
  } else {
    const number = /(\d+)/.exec(interlocutor)[0]
    return { type: 'ext', number }
  }
}

export function getContact(data, rootGetters) {
  const contacts = rootGetters['contacts/items']
  const contact = contacts.filter((item) => item.number === data.number || item.extension_id === data.number)
  if (contact.length > 0) {
    return contact[0]
  }
  return null
}

export function getErrorCode(code) {
  if (code === 401) {
    return '401'
  } else if (code === 480) {
    return '480'
  } else if (code === 486) {
    return '486'
  } else if (/^4/.test(code) && code.toString().length === 3) {
    return '400'
  } else if (/^4/.test(code) && code.toString().length === 4) {
    return '4000'
  } else {
    return code
  }
}
