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
    dragMouseDown: null,
    dragMouseMove: null,
    dragMouseUp: null,
    dragTouchStart: null,
    dragTouchMove: null,
    dragTouchEnd: null,
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

    if (eventListeners.dragMouseMove) {
      document.removeEventListener('mousemove', eventListeners.dragMouseMove)
      eventListeners.dragMouseMove = null
    }
    if (eventListeners.dragMouseUp) {
      document.removeEventListener('mouseup', eventListeners.dragMouseUp)
      eventListeners.dragMouseUp = null
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
    draggable: true,
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

      .${WIDGET_CLASS} .widget-drag-handle {
        display: none !important;
      }

      .${WIDGET_CLASS}.expanded .widget-drag-handle {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 24px !important;
        cursor: grab !important;
        background: #f5f5f5 !important;
        border-bottom: 1px solid #e0e0e0 !important;
        position: relative !important;
        z-index: 10 !important;
        flex-shrink: 0 !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }

      .${WIDGET_CLASS}.expanded .widget-drag-handle:active {
        cursor: grabbing !important;
      }

      .${WIDGET_CLASS}.expanded .widget-drag-handle::after {
        content: '' !important;
        width: 32px !important;
        height: 4px !important;
        background: #bdbdbd !important;
        border-radius: 2px !important;
      }

      .${WIDGET_CLASS} .widget-minimize-btn {
        position: absolute !important;
        right: 4px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 20px !important;
        height: 20px !important;
        border: none !important;
        background: transparent !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        padding: 0 !important;
      }

      .${WIDGET_CLASS} .widget-minimize-btn:hover {
        background: #e0e0e0 !important;
      }

      .${WIDGET_CLASS}.expanded iframe {
        top: 24px !important;
        height: calc(100% - 24px) !important;
      }

      .${WIDGET_CLASS}.dragging {
        transition: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
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

    const dragHandle = document.createElement('div')
    dragHandle.className = 'widget-drag-handle'

    const minimizeBtn = document.createElement('button')
    minimizeBtn.className = 'widget-minimize-btn'
    minimizeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#757575">
        <path d="M19 13H5v-2h14v2z"/>
      </svg>
    `
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      resetWidgetPosition(widget)
      widget.classList.remove('expanded')
      widget.classList.add('collapsed')
    })
    dragHandle.appendChild(minimizeBtn)

    widget.appendChild(dragHandle)

    const iframe = document.createElement('iframe')
    iframe.id = WIDGET_IFRAME_ID
    iframe.src = `${WIDGET_HOST}/widget`
    iframe.allow = 'microphone; camera; autoplay'

    widget.appendChild(iframe)

    return widget
  }

  function resetWidgetPosition(widget) {
    widget.style.removeProperty('top')
    widget.style.removeProperty('left')
    widget.style.removeProperty('bottom')
    widget.style.removeProperty('right')
    widget.style.removeProperty('transition')
  }

  function toggleWidget(widget) {
    const isCollapsed = widget.classList.contains('collapsed')
    if (isCollapsed) {
      widget.classList.remove('collapsed')
      widget.classList.add('expanded')
    } else {
      resetWidgetPosition(widget)
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
          resetWidgetPosition(widget)
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

  function setupDragAndDrop(widget, config) {
    if (config.draggable === false) return

    const handle = widget.querySelector('.widget-drag-handle')
    if (!handle) return

    let isDragging = false
    let startX = 0
    let startY = 0
    let initialLeft = 0
    let initialTop = 0
    const DRAG_THRESHOLD = 5
    let hasMoved = false

    function getWidgetPosition() {
      const rect = widget.getBoundingClientRect()
      return { left: rect.left, top: rect.top }
    }

    function constrainPosition(left, top) {
      const rect = widget.getBoundingClientRect()
      const maxLeft = window.innerWidth - rect.width
      const maxTop = window.innerHeight - rect.height
      return {
        left: Math.max(0, Math.min(left, maxLeft)),
        top: Math.max(0, Math.min(top, maxTop)),
      }
    }

    function switchToAbsolutePosition() {
      const pos = getWidgetPosition()
      widget.style.setProperty('top', pos.top + 'px', 'important')
      widget.style.setProperty('left', pos.left + 'px', 'important')
      widget.style.removeProperty('bottom')
      widget.style.removeProperty('right')
    }

    function onDragStart(clientX, clientY) {
      if (!widget.classList.contains('expanded')) return

      isDragging = true
      hasMoved = false
      switchToAbsolutePosition()

      const pos = getWidgetPosition()
      startX = clientX
      startY = clientY
      initialLeft = pos.left
      initialTop = pos.top
    }

    function onDragMove(clientX, clientY) {
      if (!isDragging) return

      const dx = clientX - startX
      const dy = clientY - startY

      if (!hasMoved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
        return
      }

      if (!hasMoved) {
        hasMoved = true
        widget.classList.add('dragging')
      }

      const newLeft = initialLeft + dx
      const newTop = initialTop + dy
      const constrained = constrainPosition(newLeft, newTop)

      widget.style.setProperty('left', constrained.left + 'px', 'important')
      widget.style.setProperty('top', constrained.top + 'px', 'important')
    }

    function onDragEnd() {
      if (!isDragging) return
      isDragging = false
      widget.classList.remove('dragging')
    }

    // Mouse events
    eventListeners.dragMouseDown = (e) => {
      e.preventDefault()
      onDragStart(e.clientX, e.clientY)
    }
    handle.addEventListener('mousedown', eventListeners.dragMouseDown)

    eventListeners.dragMouseMove = (e) => {
      if (isDragging && e.buttons === 0) {
        onDragEnd()
        return
      }
      onDragMove(e.clientX, e.clientY)
    }
    document.addEventListener('mousemove', eventListeners.dragMouseMove)

    eventListeners.dragMouseUp = () => {
      onDragEnd()
    }
    document.addEventListener('mouseup', eventListeners.dragMouseUp)

    // Touch events
    eventListeners.dragTouchStart = (e) => {
      const touch = e.touches[0]
      onDragStart(touch.clientX, touch.clientY)
    }
    handle.addEventListener('touchstart', eventListeners.dragTouchStart, { passive: true })

    eventListeners.dragTouchMove = (e) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      onDragMove(touch.clientX, touch.clientY)
    }
    handle.addEventListener('touchmove', eventListeners.dragTouchMove, { passive: false })

    eventListeners.dragTouchEnd = () => {
      onDragEnd()
    }
    handle.addEventListener('touchend', eventListeners.dragTouchEnd)
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
    setupDragAndDrop(widget, config)
    setupUrlChangeDetection()

    document.body.appendChild(widget)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget)
  } else {
    initWidget()
  }
}())
