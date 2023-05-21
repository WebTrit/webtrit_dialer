import Vue from 'vue'
import { format, utcToZonedTime } from 'date-fns-tz'
import { enGB, it } from 'date-fns/locale'
import i18n from '@/plugins/i18n'
import store from '@/store'

function getLocale() {
  switch (i18n.locale) {
    case 'en':
      return enGB
    case 'it':
      return it
    default:
      return enGB
  }
}

function getDateTime(item) {
  const datePart = item.connect_time.match(/(\d+-\d+-\d+)/)[0]
  const timePart = item.connect_time.match(/(\d+:\d+:\d+)/)[0]
  const date = new Date(`${datePart}T${timePart}Z`)
  const timeZone = store.state.account.info.time_zone
  const zonedDate = utcToZonedTime(date, timeZone)
  const locale = getLocale()
  return {
    zonedDate,
    timeZone,
    locale,
  }
}

function getCalendarFormatter(date) {
  const diff = Math.round(((new Date()).getTime() - date.getTime()) / (24 * 60 * 60 * 1000))
  switch (true) {
    case diff < -1:
      return i18n.t('datetime.lastWeek')
    case diff < 0:
      return i18n.t('datetime.lastDay')
    case diff < 1:
      return i18n.t('datetime.sameDay')
    case diff < 2:
      return i18n.t('datetime.nextDay')
    case diff < 7:
      return i18n.t('datetime.nextWeek')
    default:
      return i18n.t('datetime.oldDay')
  }
}

function replaceValues(str, replacements) {
  Object.keys(replacements).forEach((key) => {
    str = str.replace(new RegExp(key, 'g'), replacements[key])
  })
  return str
}

Vue.filter('prettySeconds', (item) => {
  const sec = item.duration
  function pad(num, size) {
    return num.toString().padStart(size, '0')
  }

  const hoursPart = Math.floor(sec / 60 / 60)
  const hours = hoursPart === 0 ? '' : `${(pad(hoursPart, 2))} h`
  const minutesPart = Math.floor(sec / 60) % 60
  const minutes = minutesPart === 0 ? '' : `${(pad(minutesPart, 2))} min`
  const secondsPart = Math.floor(sec % 60)
  const seconds = secondsPart === 0 ? '' : `${(pad(secondsPart, 2))} sec`
  if (hours || minutes || seconds) {
    return `${hours} ${minutes} ${seconds}`
  } else {
    return ''
  }
})

Vue.filter('getTime', (item) => {
  const pattern = store.state.account.info?.out_time_format
  if (pattern) {
    const { zonedDate, timeZone, locale } = getDateTime(item)
    return format(zonedDate, pattern, { timeZone, locale })
  } else {
    return ''
  }
})

Vue.filter('getDate', (item) => {
  const pattern = store.state.account.info?.out_date_format
  if (pattern) {
    const { zonedDate, timeZone, locale } = getDateTime(item)
    return format(zonedDate, pattern, { timeZone, locale })
  } else {
    return ''
  }
})

Vue.filter('getDateTime', (item) => {
  const pattern = store.state.account.info?.out_datetime_format
  if (pattern) {
    const { zonedDate, timeZone, locale } = getDateTime(item)
    return format(zonedDate, pattern, { timeZone, locale })
  } else {
    return ''
  }
})

Vue.filter('convertToDay', (item) => {
  const today = new Date().toISOString().substring(0, 10)
  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday = yesterday.toISOString().substring(0, 10)
  if (item.date === today) {
    return i18n.t('datetime.Today')
  } else if (item.date === yesterday) {
    return i18n.t('datetime.Yesterday')
  } else {
    const pattern = store.state.account.info?.out_date_format
    if (pattern) {
      const { zonedDate, timeZone, locale } = getDateTime(item)
      return format(zonedDate, pattern, { timeZone, locale })
    } else {
      return ''
    }
  }
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

Vue.filter('formatTime', (seconds) => {
  function pad(num, size) {
    return num.toString().padStart(size, '0')
  }

  const hoursPart = Math.floor(seconds / 60 / 60)
  const minutesPart = Math.floor(seconds / 60) % 60
  const secondsPart = Math.floor(seconds % 60)

  return `${pad(hoursPart, 2)}:${pad(minutesPart, 2)}:${pad(secondsPart, 2)}`
})

Vue.filter('getCalendar', (dateTime) => {
  console.log(i18n.locale)
  const date = new Date(dateTime)
  const replacements = {
    '%LT%': date.toLocaleTimeString(i18n.locale),
    '%L%': date.toLocaleDateString(i18n.locale),
    '%D%': date.toLocaleString(i18n.locale, { weekday: 'long' }),
  }

  const str = getCalendarFormatter(date)
  console.log(str)
  return replaceValues(str, replacements)
})
