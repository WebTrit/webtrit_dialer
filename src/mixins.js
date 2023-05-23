import { mapMutations, mapActions } from 'vuex'
import i18n from '@/plugins/i18n'

export const breakpoints = {
  computed: {
    $_breakpoints_mobile() {
      return (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm)
    },
    $_breakpoints_desktop() {
      return (this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.xl)
    },
  },
}

export const janusRegistration = {
  computed: {
    $_janusRegistration_registerEnabled: {
      get() {
        return this.$store.getters['settings/isRegisterEnabled']
      },
      set(value) {
        this.$store.dispatch('settings/setRegisterEnabled', value)
      },
    },
  },
}

export const contacts = {
  computed: {
    contacts() {
      return this.$store.getters['contacts/items']
    },
  },
  methods: {
    ...mapMutations('contacts', ['updateLoading', 'updateFetchError']),
    ...mapActions('snackbar', {
      snackbarShow: 'show',
    }),
    ...mapActions('contacts', {
      fetchContactsItems: 'fetchItems',
    }),
    $_contacts_getOneContact(number) {
      const contact = this.contacts.filter((item) => item.number === number)
      if (contact.length > 0) {
        return this.extendContactWithCalculatedProperties(contact[0])
      } else {
        return null
      }
    },
    $_contacts_getOneContactExt(ext) {
      const contact = this.contacts.filter((item) => item.extension_id === ext)
      if (contact.length > 0) {
        return this.extendContactWithCalculatedProperties(contact[0])
      } else {
        return null
      }
    },
    pickOutInitials(name) {
      return name.split(' ').map((n) => (n.length >= 1 ? n[0].toUpperCase() : '?')).join('')
    },
    extendContactWithCalculatedProperties(contact) {
      contact.name = contact.extension_name
        || (`${contact.firstname || ''} ${contact.lastname || ''}`).trim()
        || null
      contact.initials = contact.name && this.pickOutInitials(contact.name)
      return contact
    },
    async $_contacts_getContacts() {
      this.updateLoading(true)
      this.updateFetchError(false)
      try {
        await this.fetchContactsItems({})
      } catch (err) {
        this.updateFetchError(true)
        if (err.response.status !== 401) {
          // 401 handled by error interceptor
          await this.snackbarShow({ message: this.$t(`errors["${err.code}"]`) })
        }
      } finally {
        this.updateLoading(false)
      }
    },
  },
}

export const calls = {
  methods: {
    $_calls_getInterlocutor(item) {
      if (item.direction === 'incoming' || item.direction === 'forwarded') {
        return item.cli
      } else if (item.direction === 'outgoing') {
        return item.cld
      } else {
        return i18n.t('call.Unknown')
      }
    },
    $_calls_getFilename(item) {
      return `${item.connect_time} - ${this.$_calls_getInterlocutor(item)}`
    },
  },
}

export const errors = {
  methods: {
    $_errors_parse(err) {
      let code = ''
      const error = err.response.data
      if (err.response.data.code === 'parameters_validate_issue') {
        error.refining.forEach((item) => {
          code += `${this.$t(`errors.${error.code}.${item.path}.${item.reason}`)}\n`
        })
      } else {
        code = this.$t(`errors.${error.code}`)
      }
      return code
    },
  },
}
