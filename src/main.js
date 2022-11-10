import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import Gravatar from 'vue-gravatar'
import VueGtm from 'vue-gtm'
import EnvConfigPlugin, { envConfig } from './env-config'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import './styles/index.css'
import './filters'
import './directives'

Vue.use(VueCompositionApi)
Vue.use(EnvConfigPlugin)
Vue.use(VueGtm, {
  id: envConfig.gmtIds,
})

Vue.component('VGravatar', Gravatar)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
