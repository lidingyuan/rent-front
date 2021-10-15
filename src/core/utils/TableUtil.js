// import XEUtils from 'XEUtils'
/**
 * Vxetable 使用工具类
 */

const COL_BG_COLOR = ['#084F2F', '#A85022', '#EFBB4E', '#6CC0D8', '#3C0F09']

/**
 * 表头分组，返回分组后的表头数组
 * 注意：
 *  1. 不对原数据进行任何修改
 *  2. 不进行排序，使用传入数据的顺序
 * @param {Array} columns 表头数组，其中，title为Array类型
 */
export const handleTableColumns = (columns) => {
  const result = []

  for (let i = 0, n = columns.length; i < n; i++) {
    const columnTemp = { ...columns[i], idx: i }
    const title = columnTemp.title
    // title不存在，一般是序号列
    if (!title) {
      result.push(columnTemp)
      continue
    }
    if (title.length <= 1) {
      columnTemp.title = columnTemp.title[0] || ''
      result.push(columnTemp)
      continue
    }

    // 构造树形结构
    for (let j = 0; j < title.length; j++) {
      if (result.length === 0) {
        result.push({ title: title[j], children: [], idx: i })
      } else {
        let parent = result
        let lastCol = result[result.length - 1]
        for (let k = 0; k < j; k++) {
          parent = lastCol.children
          lastCol = parent.length > 0 ? parent[parent.length - 1] : {}
        }

        while (lastCol.title === title[j] && j < title.length - 1) {
          parent = lastCol.children
          lastCol = parent.length > 0 ? parent[parent.length - 1] : {}
          j++
        }

        // 最后一级标题，填入完整列配置
        if (j === title.length - 1) {
          parent.push(Object.assign({}, columnTemp, { title: title[j], idx: i }))
        } else {
          parent.push({ title: title[j], children: [], idx: i })
        }
      }
    }
  }

  return result
}

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
    if (resultSet[0].vertical === undefined) {
      console.warn('结果集未包含 {} 列！', vertical)
      return []
    }
  })

  // 2 结果集深拷贝，防止改变原结果集
  resultSet = JSON.parse(JSON.stringify(resultSet))

  // 3. 转置
  const transformKeys = []
  const result = []

  for (const row of resultSet) {
    const key = horizons.map(column => row[column]).join('--')

    let idx = transformKeys.indexOf(key)
    if (idx < 0) {
      const newRow = {}
      horizons.forEach(column => {
        newRow[column] = row[column]
      })
      idx = transformKeys.push(key) - 1
      result[idx] = newRow
    }
    contents.forEach(column => {
      // let newColumn = row[vertical].toUpperCase() + column
      const newColumn = verticals.reduce((accumulator, vertical) => accumulator + row[vertical] + '.', '') + column
      if (row[column] !== undefined) {
        result[idx][newColumn] = row[column]
      }
    })
  }

  return result
}

/**
 * 表格原始列配置数据添加背景色
 * @param {Array} columns 列配置原始数据
 * @returns {Array} 添加background后的columns
 *
 * @version 2020-06-01
 * @author lcx
 */
export const handleAddColumnsBg = (columns) => {
  // 添加样式
  let colIndex = 0
  const colBgArrLen = COL_BG_COLOR.length
  const columnsLen = columns.length
  for (let i = 0; i < columnsLen; i++) {
    const col = columns[i]
    // 1 不可视列,不配置
    if (col.visible !== undefined && !col.visible) {
      continue
    }
    // 2 添加style
    const style = { color: '', backgroundColor: COL_BG_COLOR[colIndex % colBgArrLen] }
    if (i > 0 && columns[i - 1].style && col.title[0] === columns[i - 1].title[0]) {
      // 当前列需要合并，且非合并中的第一列，取合并中上一列style
      col.style = columns[i - 1].style
    } else {
      // 取新的style
      col.style = col.style ? col.style : style
      col.style.backgroundColor = col.style.backgroundColor ? col.style.backgroundColor : style.backgroundColor
      colIndex++
    }
  }
  return columns
}

/**
 * 表格列配置数据父级表头添加背景色
 * @param {Array} columns 列配置数据，已经被转换过
 * @returns {Array} 添加background后的columns
 *
 * @version 2020-06-01
 * @author lcx
 */
export const handleAddParentColumnsBg = (columns) => {
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i]
    if (col.children && col.children.length > 1) {
      col.style = col.children[0].style
    }
  }
  return columns
}

/**
 * 表格单元格设置背景色
 * @param {Object} column 当前所在的列
 * @param {Array} tableColumn 表格列配置数据
 * @returns Object | '' 样式对象，仅限于设置背景色
 *
 * @version 2020-06-01
 * @author lcx
 */
export function defaultCellStyle ({ column }, tableColumn) {
  // // 固定列，不可见列不作处理
  if (column.fixed || !column.visible) {
    if (!column.visible) return ''
  }
  // 非固定列
  let backgroundColor = ''
  let color = ''
  const title = column.title
  const field = column.property
  // 是否找到当前的上style
  let flag = false
  for (let i = 0; i < tableColumn.length; i++) {
    const col = tableColumn[i]
    // 固定列，不可见列，跳过，下一个循环
    if (col.fixed || col.visible === false) continue
    // 1.表格头匹配title，因为生成的父级表格头没有field，只有title
    if (!field && col.title[0] === title) flag = true
    // 2.表格数据匹配field
    if (field && field === col.field) flag = true
    // 3.赋值
    if (flag) {
      backgroundColor = col.style.backgroundColor || ''
      color = col.style.color || ''
      break
    }
  }
  return { backgroundColor: backgroundColor, color: color }
}

/**
 * 表格按行设置背景色
 * @param {Number} rowIndex 当前行索引
 * @param {Array} rowSpanArr 合并行数据
 * @param {Array} bgColorArr 背景色数组
 * @returns Object | '' 样式对象，仅限于设置背景色
 *
 * @version 2020-07-01
 * @author lcx
 */
export function defaultRowStyle ({ rowIndex }, rowSpanArr, bgColorArr) {
  const colorArrLen = bgColorArr.length
  // 当前单元格位于合并数据的索引
  const index = rowSpanArr.findIndex(item => item.indexOf(rowIndex) > -1)
  // 当前单元格背景色取值
  const backgroundColor = bgColorArr[index % colorArrLen]
  return { backgroundColor: backgroundColor }
}

/**
 * 计算行数合并数组（以左侧第一列固定列，且type为未定义，为基础计算）
 * @param {Array} columns 表格列配置（经过TableUtil.handleTableColumns转换后的列配置数据）
 * @param {Array} data 表格数据
 * @return {Array} 按照左侧起第一个固定且type未定义列的合并行数据数组
 */
export function handleCalcRowSpanArr (columns = [], tableData = []) {
  const rowSpanArr = []

  // 1.找出最左侧的固定列
  const column = columns.find(column => column.fixed && column.type === undefined)
  if (columns.length === 0 || !column) return rowSpanArr

  // 2.寻找固定列
  const field = column.field
  const obj = {}
  tableData.forEach((element, index) => {
    const value = element[field]
    // obj最后一个key值
    const objKeys = Object.keys(obj)
    if (objKeys.length > 0 && objKeys[objKeys.length - 1].substr(1) === value) {
      obj[objKeys[objKeys.length - 1]].push(index)
    } else {
      // obj新增的key值，不直接使用value，解决value有相同，例如['a', 'b', 'a']情况
      const newKey = index + value
      obj[newKey] = []
      obj[newKey].push(index)
    }
  })

  for (const k in obj) {
    if (obj[k].length > 0) {
      rowSpanArr.push(obj[k])
    }
  }
  return rowSpanArr
}

/**
 * 鼠标进入单元格事件-后显示背景色
 * @param {Number} rowIndex 行索引
 * @param {Array} hoverRowArr 合并行数据
 */
export function defaultCellMouseEnterShowBg ({ rowIndex }, rowSpanArr = []) {
  let element = []
  for (let i = 0; i < rowSpanArr.length; i++) {
    if (rowSpanArr[i].indexOf(rowIndex) >= 0) {
      element = rowSpanArr[i]
      break
    }
  }
  console.log(element)
  return element
}
/**
 * 鼠标离开单元格事件-清除背景色
 */
export function defaultCellMouseLeaveClearBg () {
  return []
}

/**
 * 鼠标经过行（当前所在的最大合并行）高亮，配合defaultCellMouseLeaveClearBg，defaultCellMouseEnterShowBg使用
 * @param {Number} rowIndex 行索引
 * @param {String} styleName 样式名称
 * @param {Array} hoverRowArr 当前位于的合并行数组数据
 */
export function defaultShowRowSpanBg ({ rowIndex }, styleName = '', hoverRowArr = []) {
  let tempStyleName = ''
  var arr = hoverRowArr
  for (var i = 0; i < arr.length; i++) {
    if (rowIndex === arr[i]) {
      tempStyleName = styleName
      break
    }
  }
  return tempStyleName
}

/**
 * 表格合并单元格，仅对固定列生效
 * @param {Object} column 当前所在的列
 * @param {Object} row 当前所在的行
 * @param {Array} data 表格数据
 * @param {Number} $rowIndex 当前所在的行索引
 * @returns Object 待合并的行，列单元格对象
 *
 * @version 2020-06-01
 * @author lcx
 */

export function defaultSpanMethod ({ row, $rowIndex, column, data }) {
  // 特定的column.type，如序号，单选，复选
  const columnTypes = ['checkbox', 'seq', 'radio', 'expand', 'html']
  let rowspan = 1
  if (column.fixed && !columnTypes.includes(column.type) && row) {
    const property = column.property
    const lable = row[property]
    // if (!label) return { rowspan: 1, colspan: 1 }
    rowspan = _getRowspan(property, lable, data, $rowIndex)
    return { rowspan: rowspan, colspan: Math.min(1, rowspan) }
  }
  return { rowspan: 1, colspan: 1 }
}

/**
 * 计算合并单元格格数
 * @param {String} property 列属性
 * @param {String} label 列标题
 * @param {Array} data 表格数据
 * @param {Number} startIndex 当前所在的行索引
 * @returns Number 待合并的单元格数量
 *
 * @version 2020-06-01
 * @author lcx
 */
function _getRowspan (property, label, data, startIndex) {
  // 1. 已被合并:和前一个值相同且后一个不相同（或者没有之后的元素）
  if (data[startIndex - 1] && data[startIndex - 1][property] === label) {
    return 0
  }
  // 2.1 最后一行数据，无需合并
  if (!data[startIndex + 1]) return 1

  // 2.2 寻找待合并的数据
  let nextRow = data[startIndex + 1]
  let countRowspan = 1
  // eslint-disable-next-line no-undef
  while (nextRow && XEUtils.get(nextRow, property) === label) {
    nextRow = data[++countRowspan + startIndex]
  }
  return countRowspan
}
