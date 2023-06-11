<template>
  <v-container
    class="settings-info"
    :class="{'settings-info--mobile': $_breakpoints_mobile}"
  >
    <v-row>
      <PanelAppBar
        :title="$t('menu.Info')"
      />
    </v-row>
    <v-row class="mb-6">
      <v-col class="p-0">
        <span class="text-light-grey text-sm">
          {{ appName }} {{ appSubname }} {{ appVersion }} {{ $t('settings.title') }}
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-simple-table
        class="w-full"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                class="settings-info__header"
                colspan="2"
              >
                process.env
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[key, val] in processEnvEntries"
              :key="key"
              class="settings-info__row"
            >
              <td>{{ key }}</td>
              <td>{{ val }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row>
      <v-simple-table
        class="w-full mt-9"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                class="settings-info__header"
                colspan="2"
              >
                $envConfig
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[key, val] in envConfigEntries"
              :key="key"
              class="settings-info__row"
            >
              <td>{{ key }}</td>
              <td>{{ val }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row>
      <v-simple-table
        class="w-full mt-9"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                class="settings-info__header"
                colspan="2"
              >
                {{ $t('settings.system') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[key, val] in systemInfo"
              :key="key"
              class="settings-info__row"
            >
              <td> {{ $t(`settings.systemInfo.${key}`) }} </td>
              <td> {{ val && val.version }} </td>
            </tr>
            <tr
              v-for="[key, val] in adapterInfo"
              :key="key"
              class="settings-info__row"
            >
              <td> {{ key }} </td>
              <td> {{ val }} </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row class="mt-6">
      <v-col class="settings-info__btn">
        <v-btn
          outlined
          color="secondary"
          @click="copy()"
        >
          {{ $t('button.Copy') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { breakpoints } from '@/mixins'
import PanelAppBar from '@/components/Layout/PanelAppBar.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    PanelAppBar,
  },
  mixins: [breakpoints],
  computed: {
    ...mapGetters('system', {
      info: 'info',
    }),
    processEnvEntries() {
      return [
        ['NODE_ENV', process.env.NODE_ENV],
        ['BASE_URL', process.env.BASE_URL],
      ]
    },
    envConfigEntries() {
      return Object.entries(this.$envConfig)
        .filter((e) => typeof e[1] !== 'function')
        .sort((a, b) => a[0].localeCompare(b[0]))
    },
    appName() {
      return this.$envConfig.webtritAppName
    },
    appSubname() {
      return this.$envConfig.webtritAppSubname
    },
    appVersion() {
      return this.$envConfig.webtritAppVersion
    },
    systemInfo() {
      const systemInfo = this.$store.state.system.info
      return (systemInfo && Object.entries(systemInfo)) || []
    },
    adapterInfo() {
      return (this.info && Object.entries(this.info)) || []
    },
  },
  methods: {
    async copy() {
      const data = {}
      document.querySelectorAll('.settings-info__row').forEach((row, rowIndex) => {
        row.querySelectorAll('td').forEach((item, itemIndex) => {
          const key = (itemIndex + 1) % 2 === 0 ? 'value' : 'key'
          if (data[rowIndex]) {
            data[rowIndex][key] = item.innerHTML
          } else {
            data[rowIndex] = { [key]: item.innerHTML }
          }
        })
      })
      await navigator.clipboard.writeText(JSON.stringify(data))
    },
  },
}
</script>

<style scoped lang="scss">
.settings-info {
  height: calc(100vh - 56px);

  @apply overflow-auto;

  ::v-deep th,
  ::v-deep td {
    @apply pl-0 #{!important};
  }

  ::v-deep td:first-of-type {
    width: 240px;

    @apply text-light-grey;
  }
}

.settings-info__row {
  &:hover {
    @apply bg-transparent #{!important};
  }
}

.settings-info__header {
  @apply text-left text-base text-black #{!important};
}

.settings-info__btn {
  @apply flex flex-row justify-end;
}

.settings-info--mobile {
  height: calc(100vh - 140px);

  ::v-deep {
    tr {
      @apply flex flex-col;
    }
  }

  ::v-deep td:first-of-type {
    border-bottom: none !important;
  }
}
</style>
