import i18n from '@/plugins/i18n'
import { getRegistrationStatusColor } from '@/store/modules/webrtc'

function replaceEmptyObjectsWithNull(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceEmptyObjectsWithNull(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        obj[key] = null
      }
    }
  })
}

export function pickOutInitials(name) {
  return name.split(' ', 3).map((n) => (n.length >= 1 ? n[0].toUpperCase() : '?')).join('')
}

export function extendContactWithCalculatedProperties(contact) {
  replaceEmptyObjectsWithNull(contact)
  contact.number = contact.numbers?.main || i18n.t('user.unknown')
  contact.number_ext = contact.numbers?.ext
  contact.name = (`${contact.first_name || ''} ${contact.last_name || ''}`).trim()
    || contact.alias_name
    || contact.number
    || contact.number_ext
    || contact.email
    || i18n.t('user.unknown')
  contact.initials = pickOutInitials(contact.name)
  contact.mobile = contact.numbers?.additional && contact.numbers?.additional.length > 0
    ? contact.numbers?.additional.join(', ') : null
  contact.registration_color = getRegistrationStatusColor(contact.sip_status)
  return contact
}

export function getInterlocutor(item) {
  function getInterlocutorNumber(interlocutor) {
    const parsedInterlocutor = /^(?<number>\d+)? ?\(?(?<display_name>[^)]*)/.exec(interlocutor)
    if (parsedInterlocutor) {
      return parsedInterlocutor.groups
    }
    return null
  }
  if (item.direction === 'incoming' || item.direction === 'forwarded') {
    return getInterlocutorNumber(item.caller)
  } else if (item.direction === 'outgoing') {
    return getInterlocutorNumber(item.callee)
  } else {
    return null
  }
}

export function getContact(data, rootGetters) {
  const contacts = rootGetters['contacts/items']
  const contact = contacts.filter((item) => item.number === data.number || item.number_ext === data.number)
  if (contact.length > 0) {
    return contact[0]
  }
  return null
}

export function getReverseLocalHost() {
  return window.location.host.split('').reverse().join('')
}
