
/**
  * 结果集转置工具类
  * @param {Array} result [{},{}] 被转置结果集
  * @param {Array} horizons ['', ''] 水平非转置列
  * @param {Array} contents ['', ''] 转置列
  * @param {Array} verticals 转置轴
  * @returns Array
  *
  * @version 2020-05-21
  * @author zzj
  */
export const handleArrayTransform = (resultSet = [], horizons = [], contents = [], verticals = []) => {
  // 1. 校验
  if (resultSet.length === 0) {
    return []
  }

  if (contents.length === 0) {
    console.warn('contents为空，未提供转置列数组！')
    return []
  }

  if (verticals.length === 0) {
    console.warn('verticals 值不能为空！')
    return []
  }

  verticals.forEach(vertical => {
    if (!resultSet[0].hasOwnProperty(vertical)) {
      console.warn('结果集未包含 {} 列！', vertical)
      return []
    }
  })

  // 2 结果集深拷贝，防止改变原结果集
  resultSet = JSON.parse(JSON.stringify(resultSet))

  // 3. 转置
  let transformKeys = []
  let result = []

  for (let row of resultSet) {
    let key = horizons.map(column => row[column]).join('--')

    let idx = transformKeys.indexOf(key)
    if (idx < 0) {
      let newRow = {}
      horizons.forEach(column => {
        newRow[column] = row[column]
      })
      idx = transformKeys.push(key) - 1
      result[idx] = newRow
    }
    contents.forEach(column => {
      // let newColumn = row[vertical].toUpperCase() + column
      let newColumn = verticals.reduce((accumulator, vertical) => accumulator + row[vertical] + '##', '') + column
      if (row[column] !== undefined) {
        result[idx][newColumn] = row[column]
      }
    })
  }

  return result
}
