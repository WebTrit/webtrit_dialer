import Vue from 'vue'
import i18n from '@/plugins/i18n'

/**
 * @param {Date} datetime
 * @returns {number}
 */
function getDiffOnDaysFromNow(datetime) {
  const midnight = new Date()
  datetime.setHours(0, 0, 0, 0)
  midnight.setHours(0, 0, 0, 0)
  return Math.round(((midnight.getTime()) - datetime.getTime()) / (24 * 60 * 60 * 1000))
}

/**
 * @param {string} str
 * @param {Object} replacements
 * @returns {string}
 */
function replaceValues(str, replacements) {
  Object.keys(replacements).forEach((key) => {
    str = str.replace(new RegExp(key, 'g'), replacements[key])
  })
  return str
}

Vue.filter('formatPrettySeconds', (seconds) => {
  const date = new Date(seconds * 1000)
  const utc_h = date.getUTCHours()
  const utc_m = date.getUTCMinutes()
  const utc_s = date.getUTCSeconds()

  let ret = ''
  if (utc_h > 0) ret = `${utc_h}${i18n.t('datetime.hour')}`
  if (utc_m > 0) ret = `${ret} ${utc_m}${i18n.t('datetime.minute')}`
  if (utc_s > 0) ret = `${ret} ${utc_s}${i18n.t('datetime.second')}`
  if (ret === '') {
    return '-'
  }
  return ret.trim()
})

Vue.filter('formatTime', (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleTimeString(i18n.locale)
})

Vue.filter('formatTimer', (interval) => {
  const date = new Date(interval * 1000)
  const utc_h = date.getUTCHours()
  const utc_m = date.getUTCMinutes()
  const utc_s = date.getUTCSeconds()
  function pad(num) {
    return num.toString().padStart(2, '0')
  }
  return `${pad(utc_h)}:${pad(utc_m)}:${pad(utc_s)}`
})

Vue.filter('formatDate', (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleDateString(i18n.locale)
})

Vue.filter('formatDateTime', (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleString(i18n.locale)
})

Vue.filter('getDirectionTitle', (item) => {
  if (!item) return ''
  switch (item.direction) {
    case 'incoming':
      switch (item.status) {
        case 'accepted':
          return i18n.t('call.Incoming')
        case 'declined':
          return i18n.t('call.Incoming declined')
        case 'missed':
          return i18n.t('call.Incoming missed')
        default:
          return i18n.t('call.Incoming failed')
      }
    case 'outgoing':
      switch (item.status) {
        case 'accepted':
          return i18n.t('call.Outgoing')
        case 'declined':
          return i18n.t('call.Outgoing declined')
        case 'missed':
          return i18n.t('call.Outgoing missed')
        default:
          return i18n.t('call.Outgoing failed')
      }
    case 'forwarded':
      switch (item.status) {
        case 'accepted':
          return i18n.t('call.Forwarded')
        case 'declined':
          return i18n.t('call.Forwarded declined')
        case 'missed':
          return i18n.t('call.Forwarded missed')
        default:
          return i18n.t('call.Forwarded failed')
      }
    default:
      return i18n.t('call.Unknown')
  }
})

Vue.filter('getDirectionIcon', (item) => {
  if (!item) return ''
  switch (item.direction) {
    case 'incoming':
      switch (item.status) {
        case 'accepted':
          return '$call-history-accepted-incoming'
        case 'declined':
          return '$call-history-declined'
        case 'missed':
          return '$call-history-missed'
        default:
          return '$call-history-failed'
      }
    case 'outgoing':
      switch (item.status) {
        case 'accepted':
          return '$call-history-accepted-outgoing'
        case 'declined':
          return '$call-history-declined'
        case 'missed':
          return '$call-history-missed'
        default:
          return '$call-history-failed'
      }
    case 'forwarded':
      switch (item.status) {
        case 'accepted':
          return '$call-history-accepted-forward'
        case 'declined':
          return '$call-history-declined'
        case 'missed':
          return '$call-history-missed'
        default:
          return '$call-history-failed'
      }
    default:
      return '$call-history-failed'
  }
})

Vue.filter('getIconColor', (item) => {
  if (!item) return ''
  switch (item.status) {
    case 'declined':
    case 'accepted':
      switch (item.direction) {
        case 'incoming':
          return '#1976D2'
        case 'outgoing':
          return '#43A047'
        default:
          return 'gray'
      }
    default:
      return 'red'
  }
})

Vue.filter('convertToCalendar', (dateTime) => {
  const date = new Date(dateTime)
  const replacements = {
    '%LT%': date.toLocaleTimeString(i18n.locale),
    '%L%': date.toLocaleDateString(i18n.locale),
    '%D%': date.toLocaleString(i18n.locale, { weekday: 'long' }),
  }
  const diff = getDiffOnDaysFromNow(date)
  let str
  switch (true) {
    case diff === 0:
      str = i18n.t('datetime.sameDay')
      break
    case diff === 1:
      str = i18n.t('datetime.lastDay')
      break
    case diff < 7:
      str = i18n.t('datetime.lastWeek')
      break
    default:
      str = i18n.t('datetime.oldDay')
  }
  return replaceValues(str, replacements)
})

Vue.filter('convertToCalendarDay', (datetime) => {
  const date = new Date(datetime)
  const diff = getDiffOnDaysFromNow(date)
  switch (true) {
    case diff === 0:
      return i18n.t('datetime.Today')
    case diff === 1:
      return i18n.t('datetime.Yesterday')
    default:
      return date.toLocaleDateString(i18n.locale)
  }
})
