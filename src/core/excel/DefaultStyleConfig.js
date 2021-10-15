/**
 * 默认边框
 */
const DEFAULT_BORDER_STYLE = {
  top: { style: 'thin', color: { argb: 'FF000000' } },
  left: { style: 'thin', color: { argb: 'FF000000' } },
  bottom: { style: 'thin', color: { argb: 'FF000000' } },
  right: { style: 'thin', color: { argb: 'FF000000' } }
}
/**
 * 默认字体
 */
const DEFAULT_FONT_STYLE = { name: '宋体', size: 12 }

/**
 * 标题样式
 */
export const titleStyle = {
  alignment: { vertical: 'middle', horizontal: 'center' },
  border: DEFAULT_BORDER_STYLE,
  font: Object.assign({}, DEFAULT_FONT_STYLE, { bold: true, size: 20 })
}

/**
 * 描述样式
 */
export const descStyle = {
  alignment: { vertical: 'middle', horizontal: 'left' },
  border: DEFAULT_BORDER_STYLE,
  font: Object.assign({}, DEFAULT_FONT_STYLE, { size: 14 })
}

/**
 * 表头样式
 */
export const headerStyle = {
  alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
  border: DEFAULT_BORDER_STYLE,
  font: Object.assign({}, DEFAULT_FONT_STYLE, { bold: true, size: 12 })
}

/**
 * 数据样式
 */
export const cellStyle = {
  alignment: { vertical: 'middle', horizontal: 'left' },
  border: DEFAULT_BORDER_STYLE,
  font: Object.assign({}, DEFAULT_FONT_STYLE, { bold: true, size: 12 }),
  fill: {},
  numFmt: null
}
