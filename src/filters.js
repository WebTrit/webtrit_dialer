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
  if (!item) {
    return ''
  } else if (item.direction === 'incoming') {
    return item.failed ? 'Incoming failed' : 'Incoming'
  } else if (item.direction === 'outgoing') {
    return item.failed ? 'Outgoing failed' : 'Outgoing'
  } else {
    return 'Unknown'
  }
})

Vue.filter('getDirectionIcon', (item) => {
  if (!item) {
    return ''
  } else if (item.direction === 'incoming') {
    return item.failed ? '$call-history-incoming-failed' : '$call-history-incoming'
  } else if (item.direction === 'outgoing') {
    return item.failed ? '$call-history-outgoing-failed' : '$call-history-outgoing'
  } else {
    return '$call-history-unknown'
  }
})

Vue.filter('getIconColor', (item) => {
  if (!item) {
    return ''
  } else if (item.direction === 'incoming') {
    return item.failed ? 'red' : '#1976D2'
  } else if (item.direction === 'outgoing') {
    return item.failed ? 'red' : '#43A047'
  } else {
    return '#eceff1'
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
