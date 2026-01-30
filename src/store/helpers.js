import i18n from '@/plugins/i18n'
import { getRegistrationStatusColor } from '@/store/modules/webrtc'

function replaceEmptyObjectsWithNull(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      const newValue = replaceEmptyObjectsWithNull(value)
      acc[key] = (typeof newValue === 'object' && newValue !== null && Object.keys(newValue).length === 0)
        ? null
        : newValue
    } else {
      acc[key] = value
    }
    return acc
  }, Array.isArray(obj) ? [] : {})
}

export function pickOutInitials(name) {
  return name.split(' ', 3).map((n) => (n.length >= 1 ? n[0].toUpperCase() : '?')).join('')
}

export function extendContactWithCalculatedProperties(rawContact) {
  const contact = replaceEmptyObjectsWithNull(rawContact)
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

export function getInterlocutor(item, info) {
  function getInterlocutorNumber(interlocutor) {
    const parsedInterlocutor = /^(?<number>\S+)?(\s+\((?<display_name>\S+)\))?/.exec(interlocutor)
    if (parsedInterlocutor) {
      return parsedInterlocutor.groups
    }
    return null
  }
  if (item.direction === 'incoming' || item.direction === 'forwarded') {
    return [getInterlocutorNumber(item.caller), null]
  } else if (item.direction === 'outgoing') {
    return [getInterlocutorNumber(item.callee), null]
  } else {
    const caller = getInterlocutorNumber(item.caller)
    const callee = getInterlocutorNumber(item.callee)
    if (caller && caller.number && [info.number, info.number_ext].includes(caller.number)) {
      return [callee, 'outgoing']
    }
    if (callee && callee.number && [info.number, info.number_ext].includes(callee.number)) {
      return [caller, 'incoming']
    }
    return [null, null]
  }
}

export function getContact(data, rootGetters) {
  const lookupContact = rootGetters['contacts/lookupContact']
  if (lookupContact) {
    const cachedContact = lookupContact(data.number)
    if (cachedContact) {
      return cachedContact
    }
  }

  const contacts = rootGetters['contacts/items'] || []
  const found = contacts.find(
    (item) => item.number === data.number || item.number_ext === data.number,
  )
  return found || null
}

export function getReverseLocalHost() {
  return window.location.host.split('').reverse().join('')
}
