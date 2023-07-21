import i18n from '@/plugins/i18n'
import { getRegistrationStatusColor } from '@/store/modules/webrtc'

export function pickOutInitials(name) {
  return name.split(' ', 3).map((n) => (n.length >= 1 ? n[0].toUpperCase() : '?')).join('')
}

export function extendContactWithCalculatedProperties(contact) {
  contact.name = (`${contact.first_name || ''} ${contact.last_name || ''}`).trim()
    || contact.sip?.display_name
    || contact.email
    || i18n.t('user.Unknown')
  contact.initials = pickOutInitials(contact.name)
  contact.number = contact.numbers?.main || contact.sip?.login
  contact.number_ext = contact.numbers?.ext
  contact.mobile = contact.numbers?.additional && contact.numbers?.additional.length > 0
    ? contact.numbers?.additional.join(', ') : null
  contact.registration_color = contact.sip?.status ? getRegistrationStatusColor(contact.sip.status) : 'green'
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
