import NumberFormat from 'number-format.js'
import store from '../store'

/**
 * 首字母大写
 * @param {String} value 参数
 */
const capitalizeFilter = value => {
  if (!value) {
    return ''
  }
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 状态：1启用，2停用
 * @param {Integer} value 参数
 */
const isActiveFilter = value => {
  if (value === 1 || value === '1') {
    return '启用'
  } else {
    return '停用'
  }
}

/**
 * 性别：1男，2女
 * @param {Integer} value 参数
 */
const sexFilter = value => {
  if (value === 1) {
    return '男'
  }
  if (value === 2) {
    return '女'
  }
  return '未知'
}

/**
 * 性别：1男，2女
 * @param {Integer} value 参数
 */
const sexIconFilter = value => {
  if (value === 1) {
    return 'sexmale'
  }
  if (value === 2) {
    return 'sexfemale'
  }
  return 'sexno'
}

/**
 * 毫秒值格式化，默认yyyy-mm-dd hh:mm:ss
 * @param {Long} value 参数
 * @param {String} format 格式
 */
const millisFormatFilter = (value, format) => {
  if (!value) {
    return ''
  }
  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss'
  }
  let date = new Date(value)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

/**
 * 秒值格式化，默认yyyy-mm-dd hh:mm:ss
 * @param {Long} value 参数
 * @param {String} format 格式
 */
const secondsFormatFilter = (value, format) => {
  return millisFormatFilter(value * 1000, format)
}

/**
 * 时长转换为天
 */
const secondsToDayFilter = (value) => {
  let sub = !value ? 0 : Math.ceil((new Date().getTime() - value * 1000) / (1000 * 3600 * 24))
  return !sub ? '暂无' : sub + '天'
}

/**
 * 数值格式化
 * eg：format( "#,##0.####", 1234567.890 )  // output: "1,234,567.89"
 * @param {Double} value 浮点数
 * @param {String} format 格式
 */
const numberFormatFilter = (value, format) => {
  return NumberFormat(format, value)
}

/**
 * 根据对话框状态，显示对话框标题，[新增,修改]
 * eg：format( "#,##0.####", 1234567.890 )  // output: "1,234,567.89"
 * @param {Double} value 浮点数
 * @param {String} format 格式
 */
const dialogTitleFilter = (value) => {
  if (value === 'create') {
    return '新增'
  }
  if (value === 'update') {
    return '修改'
  }
  return ''
}

/**
 * 翻页更新索引起始值
 * @param {String} page {current：页码，size：页码大小}
 */
const listIndexFilter = (page) => {
  return (page.current - 1) * page.size + 1
}

const stringToCommaDelimitedArrayFilter = (value) => {
  if (!value) {
    return []
  }
  return value.split(',')
}

const arrayToCommaDelimitedStringFilter = (value) => {
  if (!value) {
    return ''
  }
  return value.join(',')
}

/**
 * 0和1值显示转换，0为否，1为是，null为未知
 */
const singleIntegerToChinese = (value) => {
  if (value === '1' || value === 1) {
    return '是'
  } else if (value === '0' || value === 0) {
    return '否'
  } else {
    return ''
  }
}

/**
 * 计算数组长度，显示在table中
 */
const calArrLen = (value) => {
  return value.length
}

// 卷烟名称+类型，如果tobaList，则value是tobaId，否则value是toba对象
const tobaType = (value, tobaList) => {
  // 包码：01,2
  // 条码：02,1
  let toba = {}
  if (tobaList) {
    toba = tobaList.find(toba => toba.id === value)
  } else {
    toba = value
  }
  let typeName = ''
  if (toba.type === '01' || toba.type === '2') {
    typeName = '包码'
  } else if (toba.type === '02' || toba.type === '1') {
    typeName = '条码'
  } else {
    typeName = '件码'
  }
  return toba.name + '[' + typeName + ']'
}

// 省份转换：code得到name
const prov2Name = (code) => {
  const provList = store.getters['baseData/provList']
  let prov = provList.find(prov => prov.provCode === code)
  return prov ? prov.provName : code
}

// 城市转换, code得到name；level:级别，1-只显示城市，2-显示省份/城市
const city2Name = (code, level = 2) => {
  if (code === '000000') return '全国'
  const cityList = store.getters['baseData/areaList']
  let city = cityList.find(city => city.cityCode === code)
  return city ? (level === 2 ? `${city.provName}/${city.cityName}` : city.cityName) : code
}

export default {
  capitalizeFilter,
  isActiveFilter,
  sexFilter,
  sexIconFilter,
  millisFormatFilter,
  secondsFormatFilter,
  numberFormatFilter,
  dialogTitleFilter,
  listIndexFilter,
  secondsToDayFilter,
  stringToCommaDelimitedArrayFilter,
  arrayToCommaDelimitedStringFilter,
  singleIntegerToChinese,
  calArrLen,
  tobaType,
  prov2Name,
  city2Name
}
