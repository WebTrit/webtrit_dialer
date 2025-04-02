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
      async set(value) {
        await this.$store.dispatch('settings/setRegisterEnabled', value)
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
      const contact = this.contacts.filter((item) => item.number === number || item.number_ext === number)
      if (contact.length > 0) {
        return contact[0]
      }
      return null
    },
    async $_contacts_getContacts() {
      this.updateLoading(true)
      this.updateFetchError(false)
      try {
        await this.fetchContactsItems({})
      } catch (e) {
        this.updateFetchError(true)
        if (e) console.error('On "$_contacts_getContacts" contacts', e)
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
        return item.caller
      } else if (item.direction === 'outgoing') {
        return item.callee
      } else {
        return i18n.t('call.unknown')
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
      if (!err) return ''
      let error_message = ''
      const error = err.response?.data
      if (error) {
        if (error.code === 'parameters_validate_issue') {
          const details = error.refining || error.details || []
          details.forEach((item) => {
            error_message += `${this.$t(`errors.parameters_validate_issue.${item.path}.${item.reason}`)}\n`
          })
        } else {
          error_message = err.status === 404 || err.status === 422
            ? this.$t('errors.user_not_found')
            : this.$t(`errors.${error.code}`)
        }
      }
      return error_message
    },
  },
}

export const isRecordingPlayButtonDisable = {
  computed: {
    isRecordingPlayButtonDisable() {
      return this.$envConfig.webtritRecordingPlayButtonDisable
    },
  },
}
