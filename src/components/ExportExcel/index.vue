<template>
    <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
</template>
<script>
export default {
  data () {
    return {
      myCompanyId: ''
    }
  },
  created () {
    let userInfo = JSON.parse(window.sessionStorage.getItem('access-user'))
    this.myCompanyId = userInfo.companyId
  },
  methods: {
    exportExcel () {
      // 按需要可加上无数据不导出的判断（略）
      if (this.myCompanyId !== '') {
        // API.exportExcel({
        //   companyId: this.myCompanyId
        // }).then(res => {
        //   var blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        //   var downloadElement = document.createElement('a')
        //   var href = window.URL.createObjectURL(blob) // 创建下载的链接
        //   downloadElement.href = href
        //   downloadElement.download = '导出文件.xls' // 下载后文件名
        //   document.body.appendChild(downloadElement)
        //   downloadElement.click() // 点击下载
        //   document.body.removeChild(downloadElement) // 下载完成移除元素
        //   window.URL.revokeObjectURL(href) // 释放掉blob对象
        // })
      } else {
        this.$message.error('操作异常')
      }
    }
  }
}
</script>
