import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function page (options) {
  return request({
    url: BASE_URL + '/core/baseCompany/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {Integer} compId 必须：
 *        {String} compName 必须：公司全称
 *        {String} shortname 必须：公司简称
 *        {Integer} compType 必须：公司类型1:商业省公司2商业市公司3商业县公司4：工业公司5：生产厂家
 *        {String} compCode 必须：公司编码
 *        {String} etpCode 必须：内部编码
 *        {String} areaCode 必须：所属区域编码
 *        {String} address 必须：公司地址
 *        {String} fax 必须：传真
 *        {String} contactTel 必须：联系电话
 *        {String} contactPerson 必须：联系人
 *        {String} bank 必须：银行账号
 *        {String} tax 必须：税务登记号
 *        {String} legal 必须：法人代表
 *        {Integer} isactive 必须：0停用1启用
 *        {String} ordertag 必须：排序码
 *        {Integer} parentId 必须：上级单位
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/baseCompany/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {Integer} compId 必须：
 *        {String} compName 必须：公司全称
 *        {String} shortname 必须：公司简称
 *        {Integer} compType 必须：公司类型1:商业省公司2商业市公司3商业县公司4：工业公司5：生产厂家
 *        {String} compCode 必须：公司编码
 *        {String} etpCode 必须：内部编码
 *        {String} areaCode 必须：所属区域编码
 *        {String} address 必须：公司地址
 *        {String} fax 必须：传真
 *        {String} contactTel 必须：联系电话
 *        {String} contactPerson 必须：联系人
 *        {String} bank 必须：银行账号
 *        {String} tax 必须：税务登记号
 *        {String} legal 必须：法人代表
 *        {Integer} isactive 必须：0停用1启用
 *        {String} ordertag 必须：排序码
 *        {Integer} parentId 必须：上级单位
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/baseCompany/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：标签id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/core/baseCompany/remove/' + id,
    method: 'delete'
  })
}
