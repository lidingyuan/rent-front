
// Strings 工具类

/**
 * 是否外部链接
 * @param {String} path 链接地址
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 查询字条串，转换为json数组
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const query = url.split('?')[1]
  if (!query) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(query)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 计算字符串的字节长度，非ascii当作2个字节
 * @param {String} value 输入字符串
 */
export function byteLength (value) {
  let length = 0
  for (let i = 0, n = value.length; i < n; i++) {
    const charCode = value.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      length += 1
    } else {
      length += 2
    }
  }
  return length
}
