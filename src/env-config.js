const envConfig = {
  gmtIds: (
    process.env.VUE_APP_GTM && process.env.VUE_APP_GTM.split(',').map((v) => v.trim()).filter((v) => v)
  ) || [],

  updateAccountInfoInterval: (
    parseInt(process.env.VUE_APP_UPDATE_INFO_INTERVAL, 10) > 0
      ? parseInt(process.env.VUE_APP_UPDATE_INFO_INTERVAL, 10) : false
  ) || 60000,

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
    return new URL(this.webtritCoreUrl)
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
