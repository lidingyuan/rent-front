import {
  format as formatFn,
  parse as parseFn,
  subYears as subYearsFn,
  subMonths as subMonthsFn,
  subWeeks as subWeeksFn,
  subDays as subDaysFn,
  addDays,
  lastDayOfMonth as lastDayOfMonthFn
} from 'date-fns'
import { isNumber, isString, isDate } from './ObjectUtil'
/**
 * date-fns 使用
 */
const DATE_FNS_FORMAT_OPTIONS = {
  weekStartsOn: 1,
  firstWeekContainsDate: 4,
  useAdditionalWeekYearTokens: true,
  useAdditionalDayOfYearTokens: true
}

export const DURATION_IN_MILLISECONDS = {
  // 一周毫秒数
  week: 7 * 24 * 60 * 60 * 1000,
  // 一天毫秒数
  day: 24 * 60 * 60 * 1000,
  // 一小时毫秒数
  hour: 60 * 60 * 1000,
  // 一分钟毫秒数
  minute: 60 * 1000
}

// -----------------------------------------------------------------------------
/**
 * 日期计算，减少年
 * @param {Date | String} value
 * @param {Integer} cnt
 * @returns Date
 */
export const subYears = (value, cnt) => {
  if (isDate(value)) {
    return subYearsFn(value, cnt)
  }
  if (isString(value)) {
    return subYearsFn(parse(value), cnt)
  }
}
/**
 * 日期计算，减少月
 * @param {Date | String} value
 * @param {Integer} cnt
 * @returns Date
 */
export const subMonths = (value, cnt) => {
  if (isDate(value)) {
    return subMonthsFn(value, cnt)
  }
  if (isString(value)) {
    return subMonthsFn(parse(value), cnt)
  }
}
/**
 * 日期计算，减少周
 * @param {Date | String} value
 * @param {Integer} cnt
 * @returns Date
 */
export const subWeeks = (value, cnt) => {
  if (isDate(value)) {
    return subWeeksFn(value, cnt)
  }
  if (isString(value)) {
    return subWeeksFn(parse(value), cnt)
  }
}
/**
 * 日期计算，减少日
 * @param {Date | String} value
 * @param {Integer} cnt
 * @returns Date
 */
export const subDays = (value, cnt) => {
  if (isDate(value)) {
    return subDaysFn(value, cnt)
  }
  if (isString(value)) {
    return subDaysFn(parse(value), cnt)
  }
}

/**
 * 日期计算，月最后一天
 * @param {Date | String} value
 * @returns Date
 */
export const lastDayOfMonth = (value) => {
  if (isDate(value)) {
    return lastDayOfMonthFn(value)
  }
  if (isString(value)) {
    return lastDayOfMonthFn(parse(value))
  }
}

// -----------------------------------------------------------------------------

/**
 * 日期格式化格式
 */
export const FORMAT_DATE = 'yyyy-MM-dd'
export const FORMAT_TIME = 'hh:mm:ss'
export const FORMAT_DATE_TIME = 'yyyy-MM-dd hh:mm:ss'
export const FORMAT_WEEK = 'YYYYww'
export const FORMAT_MONTH = 'yyyyMM'

/**
 * 日期（毫秒值）格式化，默认格式 yyyy-mm-dd hh:mm:ss
 * @param {Date | Long} value 参数，Date对象，或时间戳
 * @param {String} formatStr 格式
 */
export const format = (value, formatStr = FORMAT_DATE) => {
  if (!value) {
    return ''
  }
  if (isDate(value)) {
    return formatFn(value, formatStr, DATE_FNS_FORMAT_OPTIONS)
  }
  if (isNumber(value)) {
    return formatFn(new Date(value), formatStr, DATE_FNS_FORMAT_OPTIONS)
  }
  return ''
}

/**
 * 日期反序列化格式
 */
export const PARSE_DATE = 'yyyy-MM-dd'
export const PARSE_TIME = 'hh:mm:ss'
export const PARSE_DATE_TIME = 'yyyy-MM-dd hh:mm:ss'
export const PARSE_WEEK = 'RRRRII'
export const PARSE_MONTH = 'yyyyMM'

/**
 * 日期字符串转Date，默认格式 yyyy-mm-dd
 * @param {String} value 日期（时间）字符串
 * @param {String} formatStr 格式
 * @returns Date
 */
export const parse = (value, formatStr = PARSE_DATE) => {
  return parseFn(value, formatStr, new Date('1970/01/01'), DATE_FNS_FORMAT_OPTIONS)
}

// -----------------------------------------------------------------------------

/**
 * 字符串是否日期格式 yyyy-MM-dd
 * @param {String} dateStr
 */
export const isDateFormat = (dateStr) => {
  return typeof dateStr === 'string' && !!dateStr.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)
}

// -----------------------------------------------------------------------------

/**
 * 根据日期字符串，返回周次
 * @param {Date | String} value 如：'2020-05-06'
 * @returns Integer
 */
export const getYearWeek = (value) => {
  if (isDate(value)) {
    return Number.parseInt(format(value, FORMAT_WEEK))
  }
  if (isString(value)) {
    const date = parse(value, PARSE_DATE)
    return Number.parseInt(format(date, FORMAT_WEEK))
  }
  return NaN
}

/**
 * 返回周次序列
 * @param {Integer} endWeek 截止周次，如：202033
 * @param {Integer} size 序列长度 最大值 48
 * @returns Array[Integer]
 */
export const getYearWeekList = (endWeek, size = 16) => {
  const result = []

  // size最大不超过48（限制1年内）
  size = Math.min(size, 48)

  const cnt = endWeek % 100
  // 本年周数足够
  if (cnt >= size) {
    for (let i = 0; i < size; i++) {
      result.push(endWeek - i)
    }
    return result.reverse()
  }

  // 本年周数不够
  for (let i = 0; i < cnt; i++) {
    result.push(endWeek - i)
  }
  // 计算上年最后一周
  const lastYear = (endWeek - cnt) / 100 - 1
  let lastYearLastWeek = getYearWeek(new Date(lastYear, 11, 31))
  if (result.indexOf(lastYearLastWeek)) {
    lastYearLastWeek = getYearWeek(new Date(lastYear, 11, 24))
  }
  for (let i = 0, n = size - cnt; i < n; i++) {
    result.push(lastYearLastWeek - i)
  }

  return result.reverse()
}

/**
 * 返回周次序列
 * @param {Integer} endWeek 截止周次，如：202033
 * @param {Integer} size 序列长度 最大值 48
 * @returns Array[Object] [{week (Integer), beginDate (Date), endDate (Date)}]
 */
export const getYearWeekDateList = (endWeek, size = 16) => {
  const result = []

  let date = parse(endWeek, PARSE_WEEK)
  for (let i = 0; i < size; i++) {
    result.push({ week: getYearWeek(date), beginDate: date, endDate: addDays(date, 6) })
    date = subDays(date, 7)
  }

  return result.reverse()
}

/**
 * 根据周次取周一
 * @param {Integer} week 周次，如：202033
 * @returns Date
 */
export const getWeekMonday = (week) => {
  const weekObj = getYearWeekDateList(week, 1)[0]
  return weekObj.beginDate
}

// -----------------------------------------------------------------------------

/**
 * 根据日期字符串，返回周次
 * @param {Date | String} value 如：'2020-05-06'
 * @returns Integer
 */
export const getYearMonth = (value) => {
  if (isDate(value)) {
    return Number.parseInt(format(value, FORMAT_MONTH))
  }
  if (isString(value)) {
    return Number.parseInt(value.substr(0, 4) + value.substr(5, 2))
  }
  return NaN
}

/**
 * 返回月份序列
 * @param {Integer} endWeek 截止周次，如：202033
 * @param {Integer} size 序列长度 最大值 48
 * @returns Array[Integer]
 */
export const getYearMonthList = (endMonth, size = 16) => {
  const result = []

  // size最大不超过48（限制1年内）
  size = Math.min(size, 48)

  let _month = endMonth
  for (let i = 0; i < size; i++) {
    result.push(_month)
    if (_month % 100 > 1) {
      _month -= 1
    } else {
      _month -= 89
    }
  }

  return result.reverse()
}

// -----------------------------------------------------------------------------

/**
 * 获取同期日期
 * @param {String} dateStr 日期（2020-01-01）
 */
export function getDateTq (dateStr) {
  if (!dateStr) {
    return ''
  }

  const yearTq = Number.parseInt(dateStr.substr(0, 4)) - 1

  // 单独处理闰年问题
  if (dateStr.substr(5) === '02-29') {
    return yearTq + '-02-28'
  }
  if (dateStr.substr(5) === '02-28') {
    const date = new Date(yearTq, 1, 29).getDate()
    if (date === 29) {
      return yearTq + '-02-29'
    }
  }
  return yearTq + dateStr.substr(4)
}

/**
 * 获取同期周次
 * @param {Integer} week 周次 202033
 */
export function getWeekTq (week) {
  if (week % 100 < 53) {
    return week - 100
  } else {
    const weekTq = getYearWeekList(parseInt(week / 100) * 100 + 1, 2)[0]
    return weekTq
  }
}

/**
 * 获取同期月份
 * @param {Integer} month 月份 202005
 */
export function getMonthTq (month) {
  return month - 100
}
