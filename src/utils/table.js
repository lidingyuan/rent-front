/**
 * @description: 表格方法
 * @author: LCX
 * @date: 2020-11-16 17:44:32
 * @version: V1.0.0
*/

import Vue from 'vue'

/**
 * @description: 表格翻页后自动滚动到数据第一行，建议放在handleCurrentChange调用且位于search方法前
 * @param {Object} tableDom 必须：表DOM
 * @author: LCX
 * @date: 2020-11-16 17:47:53
 * @version: V1.0.0
*/
export function scrollTopAfterPage (tableDom) {
  Vue.nextTick(() => {
    tableDom.bodyWrapper.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}
