const functionMap = new WeakMap()

/**
 * 防抖
 * @param {Function} fun 执行的函数
 * @param {Number} timeout 延时时间
 */
export function debounce (fun, timeout) {
  clearTimeout(functionMap[fun])
  if (timeout) {
    functionMap[fun] = setTimeout(() => {
      delete functionMap[fun]
      fun()
    }, timeout)
  }
}

/**
 * 节流
 * @param {Function} fun 执行的函数
 * @param {Number} timeout 延时时间
 */
export function throttle (fun, timeout) {
  if (!functionMap[fun]) {
    fun()
  }
  if (timeout) {
    functionMap[fun] = setTimeout(() => {
      delete functionMap[fun]
    }, timeout)
  } else {
    functionMap[fun] = 0
  }
}

/**
 * 清除节流
 * @param {Function} fun 执行的函数
 */
export function resetThrottle (fun) {
  clearTimeout(functionMap[fun])
  delete functionMap[fun]
}
