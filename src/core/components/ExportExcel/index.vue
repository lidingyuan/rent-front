<template>
  <div class="export-excel">
    <div
      style="display: flex;justify-content: center;align-items: center;cursor:pointer;"
      @click="handleShowForm()"
    >
      <el-button size="small">
        导出
      </el-button>
    </div>

    <!-- 表格信息描述表单 -->
    <el-dialog
      title="表格描述信息填写"
      :visible.sync="showExcelForm"
      :close-on-click-modal="false"
      width="500px"
      style="line-height:50px;"
      append-to-body
    >
      <el-form
        ref="excelForm"
        :model="excelInfo"
        label-width="100px"
        size="medium"
        status-icon
      >
        <el-form-item
          label="文件标题"
          prop="title"
          :rules="[{required: true, message: '请输入表格标题', trigger: 'blur'}]"
        >
          <el-input
            v-model="excelInfo.title"
            placeholder="请输入待导出表格标题"
          />
        </el-form-item>
        <el-form-item
          label="文件描述信息"
          prop="desc"
        >
          <el-input
            v-model="excelInfo.desc"
            type="textarea"
            placeholder="请输入待导出表格的描述信息"
          />
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="showExcelForm = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleExportExcel()"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { exportJsonToExcel } from '@/core/excel/ExportExcel.js'

export default {
  name: 'ExportExcel',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#107B0F'
    }
  },
  data () {
    return {
      // 正在导出
      exporting: false,
      // 表格描述及描述信息
      excelInfo: {
        title: this.title,
        desc: ''
      },
      showExcelForm: false,
      // 导出的列
      exportColumns: [],
      // 导出的数据
      exportData: []
    }
  },
  created () {
  },
  methods: {
    // 显示表单
    handleShowForm () {
      if (this.tableData.length < 1) {
        this.$message.info('当前无表格数据可供导出')
        return
      }

      if (this.exporting) return

      this.showExcelForm = true
      this.dealExcelData()
    },
    // 显示输入表格标题弹窗，提前处理表格数据
    dealExcelData () {
      // 处理列
      this.exportColumns = this.changeColums(this.columns)
      // 处理表格数据，保证导出的表格数据和渲染的数据保持一致,含格式化数据，红升绿降
      let field = ''
      let temp = {}
      this.exportData = this.tableData.map(row => {
        temp = Object.assign({}, row)
        this.exportColumns.forEach(column => {
          if (typeof column.formatter === 'function') {
            field = column.field
            temp[field] = column.formatter({ cellValue: row[field] })
          }
        })
        return temp
      })
    },
    // 表格列转换，多级表头转为以及表头，title为数据
    changeColums (columns) {
      const newColumns = []
      let title = ''
      let childItemTitle = ''
      columns.forEach(item => {
        if (item.title) {
          title = item.title.replace(/<br>/, '\n')
        }
        // 有二级标题，需要转换
        if (item.children) {
          item.children.forEach(childItem => {
            if (childItem.title) {
              childItemTitle = childItem.title.replace(/<br>/, '\n')
            }
            newColumns.push({ ...childItem, title: [title, childItemTitle] })
          })
        } else {
          newColumns.push({ ...item, title: [title] })
        }
      })
      return newColumns
    },
    // 导出数据
    handleExportExcel () {
      this.$refs.excelForm.validate((valid) => {
        if (valid) {
          this.exporting = true
          setTimeout(() => {
            this.exporting = false
          }, 4000)

          exportJsonToExcel({
            title: this.excelInfo.title,
            desc: [this.excelInfo.desc.trim()],
            columns: this.exportColumns,
            data: this.exportData
          })
          this.showExcelForm = false
        } else {
          // 表单数据不完整，不处理
          console.log('验证失败')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.export-excel{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  .export-excel-icon{
    width: 20px;
    height: 20px;
  }
  ::v-deep .el-dialog {
    overflow: hidden;
    border-radius: 10px;
  }
  ::v-deep .el-dialog__header {
    padding: 0px 10px;
    border-radius: 10px 10px 0 0;
    background: #409EFF;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__close {
      color: #FFFFFF;
    }
  }
}
</style>
