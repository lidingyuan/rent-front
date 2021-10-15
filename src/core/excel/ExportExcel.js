import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import * as DefaultStyleConfig from './DefaultStyleConfig'

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

/**
 * 设置工作表样式，包括 标题样式、描述样式、表头样式、数据样式
 * @param {Object} ws 工作表
 * @param {*} isTitle 是否包含Title
 * @param {*} isDesc 是否包含Description
 * @param {*} headerRowCnt 表头行数
 */
function defaultStyleFunc (ws, {
  isTitle = true,
  descRowCnt = 0,
  headerRowCnt = 1,
  dataRowCnt = 1,
  columns = []
} = {}) {
  let rowBegin = 1

  // 标题单元格样式
  if (isTitle) {
    ws.getRow(rowBegin).height = 42.5
    Object.assign(ws.getCell('A1'), DefaultStyleConfig.titleStyle)
    rowBegin++
  }
  // 描述单元格样式
  if (descRowCnt > 0) {
    for (let i = 0; i < descRowCnt; i++) {
      Object.assign(ws.getCell('A' + rowBegin), DefaultStyleConfig.descStyle)
      rowBegin++
    }
  }
  // 表头单元格样式
  if (headerRowCnt > 0) {
    for (let i = 0; i < headerRowCnt; i++) {
      const row = ws.getRow(rowBegin++)
      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        Object.assign(cell, DefaultStyleConfig.headerStyle, { vertical: 'middle', horizontal: 'center' })
      })
    }
  }
  // 数据样式
  if (dataRowCnt > 0) {
    for (let i = 0; i <= dataRowCnt; i++) {
      const row = ws.getRow(rowBegin++)
      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        // 目前列配置未设置style
        // let style = columns[colIndex - 1].style
        // let numFmt = columns[colIndex - 1].format
        // if (typeof style === 'function') {
        //   Object.assign(cell, DefaultStyleConfig.cellStyle, { numFmt }, style(cell, colIndex - 1))
        // } else if (typeof style === 'object') {
        //   Object.assign(cell, DefaultStyleConfig.cellStyle, { numFmt }, style)
        // } else {
        //   Object.assign(cell, DefaultStyleConfig.cellStyle, { numFmt })
        // }
        // 使用列配置的对齐方式，数据上带有style(一般是工品规缩进)
        const cellStyle = Object.assign({}, ws.getColumn(colIndex).style)
        // let column = columns.find(item => item.field === cell._column._key)
        // TODO数据红升绿降:目前作用错误
        // if (column && column.isCompare) {
        //   cellStyle.font.color = cell.value === 0 ? { argb: 'fffffffff' }
        //     : (cell.value < 0 ? { argb: 'ff00f40d' } : { argb: 'fff80008' })
        // }
        // TODO工品规缩进，特征是数据(data)上带有style
        Object.assign(cell, { style: DefaultStyleConfig.cellStyle }, { style: cellStyle })
      })
    }
  }
}

/**
 * 合并单元格，包括 标题合并、描述合并、表头横向合并、数据纵向合并
 * API: worksheet.mergeCells(startRow, startCol, endRow, endCol)
 *
 * @param {Object} ws 工作表
 * @param {boolean} isTitle 是否包含Title
 * @param {integer} descRowCnt 描述信息行数
 * @param {Array} header 表头数组
 * @param {boolean} mergeColCnt 固定列数目
 * @param {Array} aoa 表数据数组
 */
function defaultMergeFunc (ws, {
  isTitle = true,
  descRowCnt = 0,
  header = [],
  mergeColCnt = 0,
  aoa = []
} = {}) {
  const colCnt = ws.columnCount
  let rowBegin = 1
  const colBegin = 1

  // 1. 标题
  if (isTitle) {
    ws.mergeCells(0, 0, 0, colCnt)
    rowBegin++
  }
  // 2. 描述
  for (let i = 0; i < descRowCnt; i++) {
    ws.mergeCells(rowBegin, 0, rowBegin, colCnt)
    rowBegin++
  }
  // 3. 表头，计算横向合并，和纵向合并
  const headerRowCnt = header.length
  if (headerRowCnt > 0) {
    // 初始化控制数组
    const control = []
    for (let i = 0; i < headerRowCnt; i++) { // 行
      if (!control[i]) {
        control[i] = []
      }
      for (let j = 0; j < colCnt; j++) {
        control[i][j] = 0
      }
    }
    // 计算合并
    for (let i = 0; i < headerRowCnt; i++) { // 行
      for (let j = 0; j < colCnt; j++) { // 列
        if (control[i][j] === 1) {
          continue
        }
        // 计算横向合并
        let colSpan = 0
        for (let k = j + 1; k < colCnt; k++) {
          if (header[i][j] === header[i][k] &&
              // 如果是第0行，或者上一行合并，则本行才能横向合并
              (i === 0 || header[i - 1][j] === header[i - 1][k])) {
            colSpan += 1
            control[i][k] = 1
            continue
          }
          break
        }
        // 处理横向合并
        if (colSpan > 0) {
          control[i][j] = 1
          ws.mergeCells(rowBegin + i, colBegin + j, rowBegin + i, colBegin + j + colSpan)
          continue
        }

        // 如果横向不合并，计算是否纵向合并
        let rowSpan = 0
        for (let k = i + 1; k < headerRowCnt; k++) {
          if (header[i][j] === header[k][j]) {
            control[k][j] = 1
            rowSpan += 1
            continue
          }
          break
        }
        // 处理纵向合并
        if (rowSpan > 0) {
          control[i][j] = 1
          ws.mergeCells(rowBegin + i, colBegin + j, rowBegin + i + rowSpan, colBegin + j)
        }
      }
    }
    rowBegin += headerRowCnt
  }

  // 4. 数据，固定部分，只计算纵向合并
  const dataRowCnt = aoa.length
  if (mergeColCnt > 0 && dataRowCnt > 0) {
    // 初始化控制数组
    const control = []
    for (let i = 0; i < mergeColCnt; i++) {
      if (!control[i]) {
        control[i] = []
      }
      for (let j = 0; j < dataRowCnt; j++) {
        control[i][j] = 0
      }
    }
    // 计算纵向合并
    for (let i = 0; i < mergeColCnt; i++) { // 列
      for (let j = 0; j < dataRowCnt; j++) { // 行
        if (control[i][j] === 1) {
          continue
        }
        let rowSpan = 0
        for (let k = j + 1; k < dataRowCnt; k++) {
          if (aoa[j][i] === aoa[k][i] &&
              // 如果是第0列，或者前一列合并，则此列才能合并
              (i === 0 || aoa[j][i - 1] === aoa[k][i - 1])) {
            control[i][k] = 1
            rowSpan += 1
            continue
          }
          break
        }
        if (rowSpan > 0) {
          control[i][j] = 1
          ws.mergeCells(rowBegin + j, colBegin + i, rowBegin + j + rowSpan, colBegin + i)
        }
      }
    }
  }
}

/**
 * 通过json渲染导出表格
 * @param title 标题
 * @param desc 描述，可以有多行
 * @param columns 列配置
 * @param data 表格数据，json 类型
 * @param mergeColCnt 固定列数目
 * @param mergeFun 合并单元格函数
 * @param styleFun 样式函数
 */
export const exportJsonToExcel = ({
  title = '',
  desc = [],
  columns = [],
  data = [],
  mergeFun = defaultMergeFunc,
  styleFun = defaultStyleFunc
} = {}) => {
  // 1. 参数验证
  // 标题
  if (!title) {
    // eslint-disable-next-line no-console
    console.error('标题不能为空')
    return
  }
  // 列配置
  if (!Array.isArray(columns)) {
    // eslint-disable-next-line no-console
    console.error('列配置不是数组类型，请检查')
    return
  }
  // 表数据
  if (!Array.isArray(data)) {
    // eslint-disable-next-line no-console
    console.error('表数据不是数组类型，请检查')
    return
  }

  // 2. 参数解析
  const isTitle = !!title
  const descRowCnt = Array.isArray(desc) ? desc.length : 0
  const headerRowCnt = columns.map(item => item.title.length).reduce((accumulator, current) => Math.max(accumulator, current))
  const fixedColumns = columns.filter(item => item.fixed === 1)
  const dataColumns = columns.filter(item => item.fixed !== 1)
  columns = [...fixedColumns, ...dataColumns]
  const mergeColCnt = fixedColumns.length
  const header = []
  columns.forEach((item, index) => {
    const title = item.title
    for (let i = 0; i < headerRowCnt; i++) {
      if (!header[i]) header[i] = []
      header[i][index] = title[i] || title[title.length - 1]
    }
  })
  const aoa = []
  data.forEach(item => {
    const row = []
    columns.forEach(col => {
      if (!isNaN(Number(item[col.field]))) {
        item[col.field] = Number(item[col.field])
      }
      row.push(item[col.field] || null)
    })
    aoa.push(row)
  })

  // 3. 创建工作簿
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'zoomlgd'
  workbook.lastModifiedBy = 'zoomlgd'
  workbook.created = new Date()
  workbook.modified = new Date()

  // 4. 创建工作表对象
  const ws = workbook.addWorksheet('Sheet1', {
    views: [
      { state: 'frozen', xSplit: mergeColCnt, ySplit: (1 + descRowCnt + headerRowCnt), activeCell: 'A1' }
    ],
    properties: { defaultColWidth: 10, defaultRowHeight: 15 },
    verticalCentered: true
  })

  // 5. 列默认配置
  // 说明：处理列宽、字体、对齐方式、列格式化，边框和颜色填充由 styleFun 处理
  let columnWidth = 12
  ws.columns = columns.map(item => {
    // 列宽计算
    columnWidth = 12
    // if (item.width) {
    //   columnWidth = item.width.replace(/(.*)px$/, '$1')
    // }
    columnWidth = parseInt(item.width) || columnWidth
    return {
      key: item.field,
      width: Number(columnWidth) / 6,
      style: {
        alignment: { vertical: 'middle', horizontal: item.align },
        font: {
          name: '宋体',
          size: 12
        },
        numFmt: item.format
      }
    }
  })

  // 6. 插入数据
  let rowBegin = 1
  // 6.1 标题
  ws.getRow(rowBegin++).values = [title]
  // 6.2 描述
  desc.forEach(item => {
    ws.getRow(rowBegin++).values = item
  })
  // 6.3 表头
  header.forEach(item => {
    ws.getRow(rowBegin++).values = item
  })
  // 6.4 数据
  ws.addRows(data)

  // 5. 合并单元格
  try {
    mergeFun(ws, { isTitle, descRowCnt, header, mergeColCnt, aoa })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }

  // 6. 工作表样式
  try {
    const dataRowCnt = data.length
    styleFun(ws, { isTitle, descRowCnt, headerRowCnt, dataRowCnt, columns })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }

  // 导出
  workbook.xlsx.writeBuffer().then((buf) => {
    const blob = new Blob([buf], { type: 'application/octet-stream' })
    saveAs(blob, `${title}.xlsx`)
  })
}
