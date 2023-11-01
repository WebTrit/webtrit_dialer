<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        class="date-picker"
        v-model="savedDate"
        color="secondary"
        :label="title"
        readonly
        outlined
        dense
        clearable
        @click:clear="clear()"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
      header-color="secondary"
      color="secondary"
      ref="picker"
      scrollable
      min="2000-01-01"
      :max="currentDate()"
      :locale="currentLocale"
    >
      <v-spacer />
      <v-btn
        text
        color="secondary"
        @click="close()"
      >
        {{ $t('button.cancel') }}
      </v-btn>
      <v-btn
        text
        color="secondary"
        @click="save()"
      >
        {{ $t('button.ok') }}
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    date: new Date().toISOString().substring(0, 10),
    modal: false,
    savedDate: '',
  }),
  computed: {
    currentLocale() {
      return this.$i18n.locale
    },
  },
  methods: {
    save() {
      this.savedDate = this.date
      this.$refs.dialog.save(this.date)
      this.$emit('update-date', this.savedDate)
      this.setDate()
    },
    close() {
      this.modal = false
      this.setDate()
    },
    setDate() {
      const [year, month, day] = this.date.split('-')
      this.$refs.picker.inputDay = +day
      this.$refs.picker.inputMonth = +month
      this.$refs.picker.inputYear = +year
      this.$refs.picker.tableDate = `${year}-${month}`
      this.$refs.picker.activePicker = 'DATE'
    },
    currentDate() {
      const date = new Date().toISOString()
      return date.match(/(.*)T/)[1]
    },
    clear() {
      this.date = new Date().toISOString().substring(0, 10)
      this.savedDate = undefined
      this.$refs.dialog.save(this.date)
      this.$emit('update-date', this.savedDate)
    },
  },
}
</script>

<style scoped lang="scss">
.date-picker {
  max-width: 200px;
  max-height: 40px;
}
</style>
