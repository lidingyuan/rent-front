// import request from '@/core/utils/request'

export function getTableData () {
  // return request({
  //   url: '/logout',
  //   method: 'post'
  // })
  return Promise.resolve([
    { id: '@@1011', orderId: '102300123', compName: '厦门', type: '提前移库', agreementId: '100023012', demandId: '58035179', arriveDate: '2021-12-28至2021-12-29', industryName: '厦烟', orderNumber: '300', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1012', orderId: '', compName: '厦门', type: '日常调拨', agreementId: '100023012', demandId: 'DASQ20210608002', arriveDate: '2021-06-09至2021-06-09', industryName: '厦烟', orderNumber: '850', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1013', orderId: '', compName: '龙岩', type: '零点行动', agreementId: '100023015', demandId: 'ZDSQ20210608003', arriveDate: '2022-01-02至2022-01-02', industryName: '龙烟', orderNumber: '200', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1014', orderId: '102300124', compName: '北京', type: '日常调拨', agreementId: '100023098', demandId: 'DASQ20210608004', arriveDate: '2021-06-10至2021-06-12', industryName: '鞍山', orderNumber: '800', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1015', orderId: '102300127', compName: '泉州', type: '日常调拨', agreementId: '100023020', demandId: 'DASQ20210608005', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '500', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1016', orderId: '', compName: '福州', type: '日常调拨', agreementId: '100023025', demandId: 'DASQ20210608006', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '400', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1017', orderId: '1023001239', compName: '漳州', type: '日常调拨', agreementId: '100023034', demandId: 'DASQ20210608007', arriveDate: '2021-06-10至2021-06-12', industryName: '厦烟', orderNumber: '1250', status: '预下单', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1016', orderId: '', compName: '福州', type: '日常调拨', agreementId: '100023025', demandId: 'DASQ20210608006', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '400', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1017', orderId: '1023001239', compName: '漳州', type: '日常调拨', agreementId: '100023034', demandId: 'DASQ20210608007', arriveDate: '2021-06-10至2021-06-12', industryName: '厦烟', orderNumber: '1250', status: '预下单', createUser: '用户a', createTime: '2021-06-08 12:30:14' }
  ])
}

export function getCascaderTableData () {
  // return request({
  //   url: '/logout',
  //   method: 'post'
  // })
  return Promise.resolve([
    {
      id: '@@1011',
      orderId: '102300123',
      compName: '厦门',
      type: '提前移库',
      agreementId: '100023012',
      demandId: '58035179',
      arriveDate: '2021-12-28至2021-12-29',
      industryName: '厦烟',
      orderNumber: '300',
      status: '已上传',
      createUser: '用户a',
      createTime: '2021-06-08 12:30:14',
      children: [
        { id: '@@1011', orderId: '102300123', compName: 'child1', type: 'child1', agreementId: '100023012', demandId: '58035179', arriveDate: '2021-12-28至2021-12-29', industryName: '厦烟', orderNumber: '300', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
        { id: '@@1011', orderId: '102300123', compName: 'child2', type: 'child2', agreementId: '100023012', demandId: '58035179', arriveDate: '2021-12-28至2021-12-29', industryName: '厦烟', orderNumber: '300', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
        { id: '@@1011', orderId: '102300123', compName: 'child3', type: 'child3', agreementId: '100023012', demandId: '58035179', arriveDate: '2021-12-28至2021-12-29', industryName: '厦烟', orderNumber: '300', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
        { id: '@@1011', orderId: '102300123', compName: 'child4', type: 'child4', agreementId: '100023012', demandId: '58035179', arriveDate: '2021-12-28至2021-12-29', industryName: '厦烟', orderNumber: '300', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' }

      ]
    },
    {
      id: '@@1012',
      orderId: '',
      compName: '厦门',
      type: '日常调拨',
      agreementId: '100023012',
      demandId: 'DASQ20210608002',
      arriveDate: '2021-06-09至2021-06-09',
      industryName: '厦烟',
      orderNumber: '850',
      status: '已上传',
      createUser: '用户a',
      createTime: '2021-06-08 12:30:14',
      children: [
        { id: '@@1012', orderId: '', compName: 'child1', type: 'child1', agreementId: '100023012', demandId: 'DASQ20210608002', arriveDate: '2021-06-09至2021-06-09', industryName: '厦烟', orderNumber: '850', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
        { id: '@@1012', orderId: '', compName: 'child2', type: 'child2', agreementId: '100023012', demandId: 'DASQ20210608002', arriveDate: '2021-06-09至2021-06-09', industryName: '厦烟', orderNumber: '850', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
        { id: '@@1012', orderId: '', compName: 'child3', type: 'child3', agreementId: '100023012', demandId: 'DASQ20210608002', arriveDate: '2021-06-09至2021-06-09', industryName: '厦烟', orderNumber: '850', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' }

      ]
    },
    {
      id: '@@1013',
      orderId: '',
      compName: '龙岩',
      type: '零点行动',
      agreementId: '100023015',
      demandId: 'ZDSQ20210608003',
      arriveDate: '2022-01-02至2022-01-02',
      industryName: '龙烟',
      orderNumber: '200',
      status: '未上传',
      createUser: '用户a',
      createTime: '2021-06-08 12:30:14',
      children: [
        { id: '@@1013', orderId: '', compName: 'child1', type: 'child1', agreementId: '100023015', demandId: 'ZDSQ20210608003', arriveDate: '2022-01-02至2022-01-02', industryName: '龙烟', orderNumber: '200', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' }

      ]
    },
    { id: '@@1014', orderId: '102300124', compName: '北京', type: '日常调拨', agreementId: '100023098', demandId: 'DASQ20210608004', arriveDate: '2021-06-10至2021-06-12', industryName: '鞍山', orderNumber: '800', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1015', orderId: '102300127', compName: '泉州', type: '日常调拨', agreementId: '100023020', demandId: 'DASQ20210608005', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '500', status: '已上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1016', orderId: '', compName: '福州', type: '日常调拨', agreementId: '100023025', demandId: 'DASQ20210608006', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '400', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1017', orderId: '1023001239', compName: '漳州', type: '日常调拨', agreementId: '100023034', demandId: 'DASQ20210608007', arriveDate: '2021-06-10至2021-06-12', industryName: '厦烟', orderNumber: '1250', status: '预下单', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1016', orderId: '', compName: '福州', type: '日常调拨', agreementId: '100023025', demandId: 'DASQ20210608006', arriveDate: '2021-06-10至2021-06-12', industryName: '龙烟', orderNumber: '400', status: '未上传', createUser: '用户a', createTime: '2021-06-08 12:30:14' },
    { id: '@@1017', orderId: '1023001239', compName: '漳州', type: '日常调拨', agreementId: '100023034', demandId: 'DASQ20210608007', arriveDate: '2021-06-10至2021-06-12', industryName: '厦烟', orderNumber: '1250', status: '预下单', createUser: '用户a', createTime: '2021-06-08 12:30:14' }
  ])
}

export function getOptions () {
  // return request({
  //   url: '/logout',
  //   method: 'post'
  // })
  return Promise.resolve([{
    value: 'zhinan',
    label: '指南',
    children: [{
      value: 'shejiyuanze',
      label: '设计原则',
      children: [{
        value: 'yizhi',
        label: '一致'
      }, {
        value: 'fankui',
        label: '反馈'
      }, {
        value: 'xiaolv',
        label: '效率'
      }, {
        value: 'kekong',
        label: '可控'
      }]
    }, {
      value: 'daohang',
      label: '导航',
      children: [{
        value: 'cexiangdaohang',
        label: '侧向导航'
      }, {
        value: 'dingbudaohang',
        label: '顶部导航'
      }]
    }]
  }, {
    value: 'zujian',
    label: '组件',
    children: [{
      value: 'basic',
      label: 'Basic',
      children: [{
        value: 'layout',
        label: 'Layout 布局'
      }, {
        value: 'color',
        label: 'Color 色彩'
      }, {
        value: 'typography',
        label: 'Typography 字体'
      }, {
        value: 'icon',
        label: 'Icon 图标'
      }, {
        value: 'button',
        label: 'Button 按钮'
      }]
    }, {
      value: 'form',
      label: 'Form',
      children: [{
        value: 'radio',
        label: 'Radio 单选框'
      }, {
        value: 'checkbox',
        label: 'Checkbox 多选框'
      }, {
        value: 'input',
        label: 'Input 输入框'
      }, {
        value: 'input-number',
        label: 'InputNumber 计数器'
      }, {
        value: 'select',
        label: 'Select 选择器'
      }, {
        value: 'cascader',
        label: 'Cascader 级联选择器'
      }, {
        value: 'switch',
        label: 'Switch 开关'
      }, {
        value: 'slider',
        label: 'Slider 滑块'
      }, {
        value: 'time-picker',
        label: 'TimePicker 时间选择器'
      }, {
        value: 'date-picker',
        label: 'DatePicker 日期选择器'
      }, {
        value: 'datetime-picker',
        label: 'DateTimePicker 日期时间选择器'
      }, {
        value: 'upload',
        label: 'Upload 上传'
      }, {
        value: 'rate',
        label: 'Rate 评分'
      }, {
        value: 'form',
        label: 'Form 表单'
      }]
    }, {
      value: 'data',
      label: 'Data',
      children: [{
        value: 'table',
        label: 'Table 表格'
      }, {
        value: 'tag',
        label: 'Tag 标签'
      }, {
        value: 'progress',
        label: 'Progress 进度条'
      }, {
        value: 'tree',
        label: 'Tree 树形控件'
      }, {
        value: 'pagination',
        label: 'Pagination 分页'
      }, {
        value: 'badge',
        label: 'Badge 标记'
      }]
    }, {
      value: 'notice',
      label: 'Notice',
      children: [{
        value: 'alert',
        label: 'Alert 警告'
      }, {
        value: 'loading',
        label: 'Loading 加载'
      }, {
        value: 'message',
        label: 'Message 消息提示'
      }, {
        value: 'message-box',
        label: 'MessageBox 弹框'
      }, {
        value: 'notification',
        label: 'Notification 通知'
      }]
    }, {
      value: 'navigation',
      label: 'Navigation',
      children: [{
        value: 'menu',
        label: 'NavMenu 导航菜单'
      }, {
        value: 'tabs',
        label: 'Tabs 标签页'
      }, {
        value: 'breadcrumb',
        label: 'Breadcrumb 面包屑'
      }, {
        value: 'dropdown',
        label: 'Dropdown 下拉菜单'
      }, {
        value: 'steps',
        label: 'Steps 步骤条'
      }]
    }, {
      value: 'others',
      label: 'Others',
      children: [{
        value: 'dialog',
        label: 'Dialog 对话框'
      }, {
        value: 'tooltip',
        label: 'Tooltip 文字提示'
      }, {
        value: 'popover',
        label: 'Popover 弹出框'
      }, {
        value: 'card',
        label: 'Card 卡片'
      }, {
        value: 'carousel',
        label: 'Carousel 走马灯'
      }, {
        value: 'collapse',
        label: 'Collapse 折叠面板'
      }]
    }]
  }, {
    value: 'ziyuan',
    label: '资源',
    children: [{
      value: 'axure',
      label: 'Axure Components'
    }, {
      value: 'sketch',
      label: 'Sketch Templates'
    }, {
      value: 'jiaohu',
      label: '组件交互文档'
    }]
  }])
}
