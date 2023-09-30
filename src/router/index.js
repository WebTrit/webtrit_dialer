import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Contacts from '@/views/Contacts.vue'
import ContactDetails from '@/components/Home-Info/Info.vue'
import CallDetails from '@/components/Home-Recent-Calls-Info/Info.vue'
import CallHistory from '@/views/CallHistory.vue'
import Settings from '@/views/Settings.vue'
import EditUser from '@/views/EditUser.vue'
import Login from '@/views/Login.vue'
import store from '@/store'

Vue.use(VueRouter)

function loginQueryToProps(route) {
  let tenant = null
  if (route.query.tenant) {
    tenant = route.query.tenant
  }
  return { tenant }
}

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: () => ({ name: 'Login' }),
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: loginQueryToProps,
    meta: {
      hiddenFeatures: {
        navigationDrawer: true,
        appBar: true,
      },
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: ':number',
        name: 'ContactDetails',
        components: {
          ContactDetails,
          CallDetails,
        },
      },
      {
        path: 'calls/:number?',
        name: 'CallDetails',
        components: {
          ContactDetails,
          CallDetails,
        },
      },
    ],
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
  },
  {
    path: '/call-history',
    name: 'CallHistory',
    component: CallHistory,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/edit',
    name: 'EditUser',
    component: EditUser,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// must be before is login redirect
router.beforeEach((to, from, next) => {
  if (to.query.mode !== undefined) {
    if (to.query.mode === '') {
      store.commit('settings/setMode', null)
    } else {
      store.commit('settings/setMode', to.query.mode)
    }
  }
  next()
})

router.beforeEach((to, from, next) => {
  const isLogin = store.getters['account/isLogin']
  if (store.state.got401error) {
    next()
    store.commit('set401error', false)
  } else if (to.name === 'Login') {
    if (isLogin) {
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    if (isLogin) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
})

export default router
