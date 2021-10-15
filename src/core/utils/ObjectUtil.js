
// object 工具类

/**
 * 拷贝source的属性至target中，前提是target本身包含同一属性
 * @param {Object} source
 * @param {Object} target
 */
export function copyProperties (source = {}, target) {
  for (const key of Object.keys(target)) {
    if (source.key !== undefined) {
      target[key] = source[key]
    }
  }
}

// -----------------------------------------------------------------------------
/**
 * 判断对象是否 type 类型
 * @param {Object | Array} obj 对象
 * @param {String} type 对象类型，如：Number、Object、Array等
 */
export function is (obj, type) {
  return Object.prototype.toString.call(obj) === `[object ${type}]`
}

/**
 * 判断对象是否 Number 类型
 * @param {Object} obj 对象
 */
export function isNumber (obj) {
  return is(obj, 'Number')
}

/**
 * 判断对象是否 String 类型
 * @param {Object} obj 对象
 */
export function isArray (obj) {
  return is(obj, 'Array')
}

/**
 * 判断对象是否 String 类型
 * @param {Object} obj 对象
 */
export function isString (obj) {
  return is(obj, 'String')
}

/**
 * 判断对象是否 Object 类型
 * @param {Object} obj 对象
 */
export function isObject (obj) {
  return is(obj, 'Object')
}

/**
 * 判断对象是否 Date 类型
 * @param {Object} obj 对象
 */
export function isDate (obj) {
  return is(obj, 'Date')
}

/**
 * 判断对象是否是 clazz
 * @param {QueryParam} obj 对象
 * @param {Class} clazz 对象类型，如：QueryParam等
 */
export function isClass (obj, clazz) {
  return obj.constructor.name === clazz.name
}
