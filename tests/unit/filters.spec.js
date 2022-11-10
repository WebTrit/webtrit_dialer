/* eslint-disable vue/one-component-per-file */
import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import '@/filters'

jest.mock('@/plugins/i18n', () => ({
  t: (msg) => msg,
  locale: 'en',
}))

jest.mock('@/store', () => ({
  state: {
    account: {
      info: {
        out_date_format: 'yyyy-LL-dd',
        out_time_format: 'HH:mm:ss',
        time_zone: 'Europe/Prague',
        out_datetime_format: 'yyyy-LL-dd HH:mm:ss',
      },
    },
  },
}))

describe('filters.js', () => {
  const localVue = createLocalVue()

  it('prettySeconds transforms seconds to hours minutes seconds format', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { duration: 11300 },
        }
      },
      template: '<p> {{ this.item | prettySeconds }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 03 h 08 min 20 sec </p>')
  })

  it('getDirectionTitle returns \'incoming\' for successful incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: false },
        }
      },
      template: '<p> {{ this.item | getDirectionTitle }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/incoming/i)
    expect(wrapper.html()).not.toMatch(/failed/i)
  })

  it('getDirectionTitle returns \'incoming failed\' for failed incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionTitle }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/incoming failed/i)
  })

  it('getDirectionTitle returns \'outgoing\' for successful outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: false },
        }
      },
      template: '<p> {{ this.item | getDirectionTitle }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/outgoing/i)
    expect(wrapper.html()).not.toMatch(/failed/i)
  })

  it('getDirectionTitle returns \'outgoing failed\' for failed outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionTitle }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/outgoing failed/i)
  })

  it('getDirectionTitle returns \'unknown\' if call is not incoming or outgoing', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: null, failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionTitle }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/unknown/i)
  })

  it('getDirectionIcon returns \'incoming\' for successful incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: false },
        }
      },
      template: '<p> {{ this.item | getDirectionIcon }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/incoming/i)
    expect(wrapper.html()).not.toMatch(/failed/i)
  })

  it('getDirectionIcon returns \'incoming-failed\' for failed incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionIcon }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/incoming-failed/i)
  })

  it('getDirectionIcon returns \'outgoing\' for successful outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: false },
        }
      },
      template: '<p> {{ this.item | getDirectionIcon }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/outgoing/i)
    expect(wrapper.html()).not.toMatch(/failed/i)
  })

  it('getDirectionIcon returns \'outgoing-failed\' for failed outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionIcon }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/outgoing-failed/i)
  })

  it('getDirectionIcon returns \'unknown\' if call is not incoming or outgoing', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: null, failed: true },
        }
      },
      template: '<p> {{ this.item | getDirectionIcon }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/unknown/i)
  })

  it('getIconColor returns \'#1976D2\' for successful incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: false },
        }
      },
      template: '<p> {{ this.item | getIconColor }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/#1976D2/i)
  })

  it('getIconColor returns \'red\' for failed incoming call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'incoming', failed: true },
        }
      },
      template: '<p> {{ this.item | getIconColor }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/red/i)
  })

  it('getIconColor returns \'#43A047\' for successful outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: false },
        }
      },
      template: '<p> {{ this.item | getIconColor }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/#43A047/i)
  })

  it('getIconColor returns \'red\' for failed outgoing call', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: 'outgoing', failed: true },
        }
      },
      template: '<p> {{ this.item | getIconColor }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/red/i)
  })

  it('getIconColor returns \'#eceff1\' if call is not incoming or outgoing', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: { direction: null, failed: false },
        }
      },
      template: '<p> {{ this.item | getIconColor }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/#eceff1/i)
  })

  it('formatTime transforms seconds to h:m:s format', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          seconds: 11300,
        }
      },
      template: '<p> {{ this.seconds | formatTime }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 03:08:20 </p>')
  })

  it('convertToDay returns \'today\' if provided date is today', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            date: new Date().toISOString().substr(0, 10),
          },
        }
      },
      template: '<p> {{ this.item | convertToDay }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/today/i)
  })

  it('convertToDay returns \'yesterday\' if provided date is yesterday', () => {
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday = yesterday.toISOString().substr(0, 10)
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            date: yesterday,
          },
        }
      },
      template: '<p> {{ this.item | convertToDay }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toMatch(/yesterday/i)
  })

  it(`convertToDay returns formatted date according to time zone if provided date
  is not today or yesterday`, () => {
    let beforeYesterday = new Date()
    beforeYesterday.setDate(beforeYesterday.getDate() - 2)
    beforeYesterday = beforeYesterday.toISOString().substr(0, 10)
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            date: beforeYesterday,
            connect_time: '2021-12-10 04:02:11',
          },
        }
      },
      template: '<p> {{ this.item | convertToDay }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 2021-12-10 </p>')
  })

  it('getDateTime returns formatted date and time according to time zone', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            connect_time: '2021-12-10 04:02:11',
          },
        }
      },
      template: '<p> {{ this.item | getDateTime }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 2021-12-10 05:02:11 </p>')
  })

  it('getDate returns formatted date according to time zone', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            connect_time: '2021-11-10 04:02:11',
          },
        }
      },
      template: '<p> {{ this.item | getDate }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 2021-11-10 </p>')
  })

  it('getTime returns formatted time according to time zone', () => {
    const tmpComponent = Vue.component('TmpComponent', {
      data() {
        return {
          item: {
            connect_time: '2021-11-10 04:02:11',
          },
        }
      },
      template: '<p> {{ this.item | getTime }} </p>',
    })
    const wrapper = mount(tmpComponent, {
      localVue,
    })
    expect(wrapper.html()).toBe('<p> 05:02:11 </p>')
  })
})
