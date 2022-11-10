import Vue from 'vue'

Vue.directive('tooltip', {
  bind(el, binding, vnode) {
    if (vnode.context.disableTooltips === true) {
      return
    }
    function toggleTooltip() {
      const textIsTruncated = this.offsetWidth > vnode.context.activatorWidthLimit
      if (textIsTruncated) {
        vnode.context.textTruncated = true
      } else {
        vnode.context.textTruncated = false
      }
    }
    const tooltipActivator = el.querySelector('.tooltip-activator')
    tooltipActivator.addEventListener('mouseenter', toggleTooltip)
  },
})
