const envConfig = {
  gmtIds: (
    process.env.VUE_APP_GTM && process.env.VUE_APP_GTM.split(',').map((v) => v.trim()).filter((v) => v)
  ) || [],

  isDemoBehaviourEnabled: (
    process.env.VUE_APP_DEMO_BEHAVIOUR
      && ['true', 'enable', 'mix', 'both'].includes(process.env.VUE_APP_DEMO_BEHAVIOUR.toLowerCase())
  ) || false,

  isSigninBehaviourEnabled: (
    !process.env.VUE_APP_DEMO_BEHAVIOUR
      || ['false', 'disable', 'mix', 'both'].includes(process.env.VUE_APP_DEMO_BEHAVIOUR.toLowerCase())
  ) || false,

  webtritAppName: process.env.VUE_APP_WEBTRIT_APP_NAME,
  webtritAppSubname: process.env.VUE_APP_WEBTRIT_APP_SUBNAME,
  webtritAppVersion: process.env.VUE_APP_WEBTRIT_APP_VERSION,
  webtritCompanyName: process.env.VUE_APP_WEBTRIT_COMPANY_NAME,
  webtritCompanyUrl: process.env.VUE_APP_WEBTRIT_COMPANY_URL,
  webtritCompanyLogoImgSrc: process.env.VUE_APP_WEBTRIT_COMPANY_LOGO_IMG_SRC,

  webtritCoreUrl: process.env.VUE_APP_WEBTRIT_CORE_URL,

  webtritNavigationDrawerMinimizing: !(
    process.env.VUE_APP_WEBTRIT_NAVIGATION_DRAWER_MINIMIZING
      && ['false', 'disable'].includes(process.env.VUE_APP_WEBTRIT_NAVIGATION_DRAWER_MINIMIZING.toLowerCase())
  ),

  get webtritCoreApiUrl() {
    const url = new URL(this.webtritCoreUrl)
    return `${url}api/v1`
  },

  get webtritCoreSignalingUrl() {
    const url = new URL(this.webtritCoreUrl)
    url.protocol = url.protocol.endsWith('s:') ? 'wss:' : 'ws:'
    return `${url}signaling/v1`
  },
}

export {
  envConfig,
}

const EnvConfigPlugin = {
  install(Vue) {
    Vue.prototype.$envConfig = envConfig
  },
}

export default EnvConfigPlugin
