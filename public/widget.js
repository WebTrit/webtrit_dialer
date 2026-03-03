(function () {
  const WIDGET_ID = 'webtrit-dialer-widget'
  const WIDGET_IFRAME_ID = 'webtrit-dialer-iframe'
  const WIDGET_CLASS = 'webtrit-widget'

  const eventListeners = {
    message: null,
    click: null,
    contextmenu: null,
    contextMenuClick: null,
    iconClick: null,
    popstate: null,
    urlChange: null,
  }

  let widgetConfig = null

  function getWidgetScriptElement() {
    const scripts = document.getElementsByTagName('script')
    for (const script of scripts) {
      if (script.src && script.src.includes('widget.js')) {
        return script
      }
    }
    return null
  }

  function getWidgetHost() {
    const script = getWidgetScriptElement()
    if (script && script.src) {
      const url = new URL(script.src)
      return url.origin
    }
    return window.location.origin
  }

  const WIDGET_HOST = getWidgetHost()

  function cleanup() {
    const widget = document.getElementById(WIDGET_ID)
    if (widget) {
      if (eventListeners.iconClick) {
        widget.removeEventListener('click', eventListeners.iconClick)
        eventListeners.iconClick = null
      }
      widget.remove()
    }

    const contextMenu = document.querySelector('.webtrit-context-menu')
    if (contextMenu) {
      if (eventListeners.contextMenuClick) {
        contextMenu.removeEventListener('click', eventListeners.contextMenuClick)
        eventListeners.contextMenuClick = null
      }
      contextMenu.remove()
    }

    if (eventListeners.message) {
      window.removeEventListener('message', eventListeners.message)
      eventListeners.message = null
    }
    if (eventListeners.click) {
      document.removeEventListener('click', eventListeners.click)
      eventListeners.click = null
    }
    if (eventListeners.contextmenu) {
      document.removeEventListener('contextmenu', eventListeners.contextmenu)
      eventListeners.contextmenu = null
    }
    if (eventListeners.popstate) {
      window.removeEventListener('popstate', eventListeners.popstate)
      eventListeners.popstate = null
    }
  }

  window.webtritWidgetCleanup = cleanup

  function getScriptDataAttributes() {
    const script = getWidgetScriptElement()
    if (!script) return {}

    const dataAttrs = {}
    const { attributes } = script

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      if (attr.name.startsWith('data-')) {
        const camelCaseName = attr.name
          .replace(/^data-/, '')
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase())

        let { value } = attr
        if (value === 'true') value = true
        else if (value === 'false') value = false
        else if (!isNaN(value) && value !== '') value = Number(value)

        dataAttrs[camelCaseName] = value
      }
    }
    return dataAttrs
  }

  const defaultConfig = {
    position: 'bottom-right',
    expandedWidth: '380px',
    expandedHeight: '600px',
    collapsedSize: '60px',
    margin: '20px',
    hideOnPaths: [],
    enableClickToDial: true,
  }

  async function loadConfig() {
    let config = { ...defaultConfig }

    try {
      const response = await fetch(`${WIDGET_HOST}/widget.config.json`)
      if (response.ok) {
        const jsonConfig = await response.json()
        config = { ...config, ...jsonConfig }
      }
    } catch (error) {
      console.error('[WebTrit Widget] Failed to load widget.config.json:', error)
    }

    const scriptDataAttrs = getScriptDataAttributes()
    config = { ...config, ...scriptDataAttrs }

    return config
  }

  function shouldHideWidget(config) {
    const currentPath = window.location.pathname
    if (config.hideOnPaths && config.hideOnPaths.length > 0) {
      return config.hideOnPaths.some((pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(currentPath)
      })
    }
    return false
  }

  function updateWidgetVisibility() {
    const widget = document.getElementById(WIDGET_ID)
    if (!widget || !widgetConfig) return

    const shouldHide = shouldHideWidget(widgetConfig)

    if (shouldHide) {
      widget.style.setProperty('display', 'none', 'important')
    } else {
      widget.style.removeProperty('display')
    }
  }

  function createStyles(config) {
    const style = document.createElement('style')
    style.textContent = `
      .${WIDGET_CLASS} {
        position: fixed !important;
        ${config.position.includes('bottom') ? 'bottom' : 'top'}: ${config.margin} !important;
        ${config.position.includes('right') ? 'right' : 'left'}: ${config.margin} !important;
        z-index: 2147483647 !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        background: white !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .${WIDGET_CLASS}.collapsed {
        width: ${config.collapsedSize} !important;
        height: ${config.collapsedSize} !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-direction: column !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .${WIDGET_CLASS}.expanded {
        width: ${config.expandedWidth} !important;
        height: ${config.expandedHeight} !important;
        max-height: calc(100vh - 2 * ${config.margin}) !important;
      }

      .${WIDGET_CLASS} iframe {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }

      .${WIDGET_CLASS}.collapsed .widget-icon {
        width: 40px !important;
        height: 40px !important;
        background: #75B943 !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        position: relative !important;
        flex-shrink: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .${WIDGET_CLASS}.collapsed .widget-icon svg {
        display: block !important;
        margin: 0 auto !important;
      }

      .${WIDGET_CLASS}.collapsed iframe {
        display: none !important;
      }

      .${WIDGET_CLASS}.expanded .widget-icon {
        display: none !important;
      }

      .webtrit-context-menu {
        position: fixed;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px 0;
        margin-top: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 2147483648;
        display: none;
      }

      .webtrit-context-menu-item {
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        color: #333;
      }

      .webtrit-context-menu-item:hover {
        background-color: #f0f0f0;
      }

      .webtrit-context-menu-item svg {
        width: 16px;
        height: 16px;
      }

    `
    document.head.appendChild(style)
  }

  function createWidget() {
    const widget = document.createElement('div')
    widget.id = WIDGET_ID
    widget.className = `${WIDGET_CLASS} collapsed`

    const icon = document.createElement('div')
    icon.className = 'widget-icon'
    icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    `
    widget.appendChild(icon)

    const iframe = document.createElement('iframe')
    iframe.id = WIDGET_IFRAME_ID
    iframe.src = `${WIDGET_HOST}/widget`
    iframe.allow = 'microphone; camera; autoplay'

    widget.appendChild(iframe)

    return widget
  }

  function toggleWidget(widget) {
    const isCollapsed = widget.classList.contains('collapsed')
    if (isCollapsed) {
      widget.classList.remove('collapsed')
      widget.classList.add('expanded')
    } else {
      widget.classList.remove('expanded')
      widget.classList.add('collapsed')
    }
  }

  function setupMessageHandling(widget, config) {
    eventListeners.message = (event) => {
      if (event.origin !== WIDGET_HOST) return

      const { type } = event.data

      switch (type) {
        case 'WIDGET_READY': {
          const iframe = widget.querySelector('iframe')
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'WIDGET_CONFIG',
              config,
            }, WIDGET_HOST)
          }
          break
        }
        case 'MINIMIZE_WIDGET':
          widget.classList.remove('expanded')
          widget.classList.add('collapsed')
          break

        case 'INCOMING_CALL':
          if (widget.classList.contains('collapsed')) {
            toggleWidget(widget)
          }
          break

        case 'EXPAND_WIDGET':
          if (widget.classList.contains('collapsed')) {
            toggleWidget(widget)
          }
          break
      }
    }

    window.addEventListener('message', eventListeners.message)
  }

  function isPhoneNumber(text, config) {
    const relaxedMode = config?.relaxedPhoneValidation === true
    const trimmed = text.trim()

    if (relaxedMode) {
      if (!/^[+]?[a-zA-Z0-9]+$/.test(trimmed)) {
        console.log('[WebTrit Widget] Invalid format for relaxed mode:', trimmed)
        return false
      }
      if (trimmed.length < 1 || trimmed.length > 64) {
        console.log('[WebTrit Widget] Invalid length:', trimmed.length)
        return false
      }
      console.log('[WebTrit Widget] Valid phone number detected (relaxed mode)')
      return true
    } else {
      if (/[a-zA-Z]/.test(trimmed)) {
        console.log('[WebTrit Widget] Letters not allowed in strict mode:', trimmed)
        return false
      }
      if (!/^[\d +\-().]+$/.test(trimmed)) {
        console.log('[WebTrit Widget] Contains invalid characters:', trimmed)
        return false
      }
      const digitCount = (trimmed.match(/\d/g) || []).length
      if (digitCount > 16) {
        console.log('[WebTrit Widget] Phone number too long (digits only):', digitCount)
        return false
      }
      if (digitCount < 3) {
        console.log('[WebTrit Widget] Not enough digits:', { text: trimmed, digitCount })
        return false
      }
      console.log('[WebTrit Widget] Valid phone number detected (strict mode)')
      return true
    }
  }

  function createContextMenu() {
    const menu = document.createElement('div')
    menu.className = 'webtrit-context-menu'
    menu.innerHTML = `
      <div class="webtrit-context-menu-item" data-action="audio-call">
        <svg viewBox="0 0 24 24" fill="#75B943">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        <span>Audio Call</span>
      </div>
      <div class="webtrit-context-menu-item" data-action="video-call">
        <svg viewBox="0 0 24 24" fill="#75B943">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        <span>Video Call</span>
      </div>
    `
    document.body.appendChild(menu)
    return menu
  }

  function setupClickToDial(widget, config) {
    if (!config.enableClickToDial) {
      return
    }

    const contextMenu = createContextMenu()
    let selectedPhoneNumber = null

    eventListeners.click = () => {
      contextMenu.style.display = 'none'
    }
    document.addEventListener('click', eventListeners.click)

    eventListeners.contextmenu = (e) => {
      const selection = window.getSelection()
      const selectedText = selection.toString().trim()

      if (selectedText) {
        if (isPhoneNumber(selectedText, config)) {
          selectedPhoneNumber = selectedText
          e.preventDefault()

          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          const menuWidth = 150
          const menuHeight = 80

          let left = e.clientX
          let top = e.clientY

          if (left + menuWidth > viewportWidth) {
            left = viewportWidth - menuWidth - 10
          }
          if (top + menuHeight > viewportHeight) {
            top = viewportHeight - menuHeight - 10
          }

          contextMenu.style.left = `${left}px`
          contextMenu.style.top = `${top}px`
          contextMenu.style.display = 'block'
        }
      }
    }
    document.addEventListener('contextmenu', eventListeners.contextmenu)

    eventListeners.contextMenuClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const menuItem = e.target.closest('.webtrit-context-menu-item')
      if (!menuItem || !selectedPhoneNumber) return

      const action = menuItem.getAttribute('data-action')
      const isVideoCall = action === 'video-call'

      if (widget.classList.contains('collapsed')) {
        toggleWidget(widget)
      }

      setTimeout(() => {
        const iframe = widget.querySelector('iframe')
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'DIAL_NUMBER',
            data: {
              phoneNumber: selectedPhoneNumber,
              video: isVideoCall,
            },
          }, WIDGET_HOST)
        }
      }, 300)

      contextMenu.style.display = 'none'
    }
    contextMenu.addEventListener('click', eventListeners.contextMenuClick)
  }

  function setupUrlChangeDetection() {
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      updateWidgetVisibility()
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      updateWidgetVisibility()
    }
  }

  async function initWidget() {
    if (document.getElementById(WIDGET_ID)) {
      cleanup()
    }

    const config = await loadConfig()
    widgetConfig = config

    createStyles(config)
    const widget = createWidget(config)

    if (shouldHideWidget(config)) {
      widget.style.setProperty('display', 'none', 'important')
    }

    eventListeners.iconClick = (e) => {
      if (widget.classList.contains('collapsed')) {
        e.stopPropagation()
        toggleWidget(widget)
      }
    }
    widget.addEventListener('click', eventListeners.iconClick)

    setupMessageHandling(widget, config)
    setupClickToDial(widget, config)
    setupUrlChangeDetection()

    document.body.appendChild(widget)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget)
  } else {
    initWidget()
  }
}())
