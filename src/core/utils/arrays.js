// Arrays工具类

/**
 * 一维数组转变为树形结构
 *
 * @param {Array} options data
 * @param {Object} props {key: 'key', parentKey: 'parentKey', children: 'children'}
 */
export function arrayToTree (options, props) {
  // deep copy
  const items = JSON.parse(JSON.stringify(options))
  // 构造对象，方便查找
  const keyData = {}
  items.forEach(item => {
    keyData[item[props.key]] = item
  })
  // 构造树
  const tree = []
  const parentKey = props.parentKey
  const childrenKey = props.children
  for (const item of items) {
    const parentId = item[parentKey]
    if (parentId !== item[props.key] && // 元素的key不能与自身的parentKey相等
      Object.prototype.hasOwnProperty.call(keyData, parentId)) {
      if (keyData[parentId][childrenKey]) {
        keyData[parentId][childrenKey].push(item)
      } else {
        keyData[parentId][childrenKey] = [item]
      }
    } else {
      tree.push(item)
    }
  }
  return tree
}
