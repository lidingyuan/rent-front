/**
 * 表单验证通用规则
 */

export default {
  /**
   * 正整数
   */
  positive: [
    { type: 'integer', pattern: /^[1-9][0-9]*$/, trigger: 'change', message: '请填入正整数' }
  ],
  /**
   * 1-100000
   */
  sceneId: [
    { type: 'integer', pattern: /^[1-9]\d{0,5}$/, trigger: 'change', message: '请填入100000以下的正整数', required: true }
  ],
  /**
   * 电话号码
   */
  phone: [
    { type: 'integer', pattern: /^1[34578]\d{9}$/, trigger: 'change', message: '目前只支持中国大陆的手机号码' }
  ],
  /**
   * 字母或数字
   */
  character: [
    { type: 'integer', pattern: /^[A-Za-z0-9]+$/, trigger: 'change', message: '请填入字母或数字' }
  ]
}
