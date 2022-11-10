/* eslint-disable vue/one-component-per-file */
import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import '@/directives'

const localVue = createLocalVue()
const tmpComponent = Vue.component('TmpComponent', {
  template: '<div v-tooltip class="parent"><p class="tooltip-activator"></p></div>',
})

describe('derictives.js', () => {
  it('tooltip is rendered if text is longer than container', async () => {
    const wrapper = mount(tmpComponent, {
      localVue,
      data() {
        return {
          activatorWidthLimit: 80,
          disableTooltips: false,
          textTruncated: false,
        }
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 200,
    })
    await wrapper.find('.tooltip-activator').trigger('mouseenter')
    expect(wrapper.vm.textTruncated).toBe(true)
  })

  it('tooltip is not rendered if disableTooltips is true', async () => {
    const wrapper = mount(tmpComponent, {
      localVue,
      data() {
        return {
          activatorWidthLimit: 80,
          disableTooltips: true,
          textTruncated: false,
        }
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 200,
    })
    await wrapper.find('.tooltip-activator').trigger('mouseenter')
    expect(wrapper.vm.textTruncated).toBe(false)
  })

  it('tooltip is not rendered if text fits into container', async () => {
    const wrapper = mount(tmpComponent, {
      localVue,
      data() {
        return {
          activatorWidthLimit: 80,
          disableTooltips: true,
          textTruncated: false,
        }
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 50,
    })
    await wrapper.find('.tooltip-activator').trigger('mouseenter')
    expect(wrapper.vm.textTruncated).toBe(false)
  })
})
