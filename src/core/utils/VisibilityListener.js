
let hidden = ''
let visibilityChange = ''
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}
const bubbleEventList = []
const captureEventList = []
let captureListening = false
let bubbleListening = false
function handleVisibilityChangeAtBubble () {
  bubbleEventList.forEach(event => {
    event.event(!document[hidden])
    if (event.opts.once) {
      removeVisibilityListener(event.event)
    }
  })
}
function handleVisibilityChangeAtCapture () {
  captureEventList.forEach(event => {
    event.event(!document[hidden])
    if (event.opts.once) {
      removeVisibilityListener(event.event)
    }
  })
}

/**
 * 监听页面是否可见，切换标签，最小化浏览器，切换应用等
 * @param {Function} event 入参(event,hidden:Boolean)
 * @param {Object|Boolean} options|useCapture
 */
export function addVisibilityListener (event, options) {
  let opts = null
  if (typeof options === 'boolean') {
    opts = {
      capture: options
    }
  } else {
    opts = options || {}
  }
  if (opts.capture) {
    if (!captureListening) {
      document.addEventListener(visibilityChange, handleVisibilityChangeAtCapture, true)
      captureListening = true
    }
    captureEventList.push({ event, opts })
  } else {
    if (!bubbleListening) {
      document.addEventListener(visibilityChange, handleVisibilityChangeAtBubble, false)
      bubbleListening = true
    }
    bubbleEventList.push({ event, opts })
  }
}

/**
 * 移除监听页面是否可见
 * @param {Object | Array} obj 对象
 * @param {String} type 对象类型，如：Number、Object、Array等
 */
export function removeVisibilityListener (event) {
  let index = bubbleEventList.findIndex(e => e.event === event)
  if (index > -1) {
    bubbleEventList.splice(index, 1)
    if (!bubbleEventList.length && bubbleListening) {
      document.removeEventListener(visibilityChange, handleVisibilityChangeAtBubble)
      bubbleListening = false
    }
  }

  index = captureEventList.findIndex(e => e.event === event)
  if (index > -1) {
    captureEventList.splice(index, 1)
    if (!captureEventList.length && captureListening) {
      document.removeEventListener(visibilityChange, handleVisibilityChangeAtCapture)
      captureListening = false
    }
  }
}
