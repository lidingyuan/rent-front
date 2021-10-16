<template>
  <ZlQueryContainer
    ref="tableWrapper"
    title="列表"
    :pagination.sync="page"
    :table-data="dataList"
    :columns="columns"
  >
    <template #queryParam>
      <el-input
        size="small"
        placeholder="输入名称"
        style="width: 200px"
      />
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        查询
      </el-button>
      <el-button
        size="small"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
      </el-button>
    </template>

    <!-- 列表 -->
    <el-table
      ref="table"
      size="mini"
      :data="dataList"
      height="100%"
      border
      stripe
    >
      <el-table-column
        type="index"
        :index="page | listIndexFilter"
        width="50"
        align="center"
        label="#"
      />
      <el-table-column
        v-for="column in columns"
        :key="column.field"
        :prop="column.field"
        :label="column.title"
        :type="column.type"
        :fixed="column.fixed"
        :width="column.width"
        :sortable="column.sortable"
        :show-overflow-tooltip="column['show-overflow-tooltip']"
      >
        <template
          v-if="column.field === 'projectId'"
          #default="{row}"
        >
          {{ findProjectName(row.projectId) }}
        </template>
      </el-table-column>
      <el-table-column
        width="350"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="temp = {...scope.row};orderDetailVisible = true"
          >
            详细信息
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="temp = {...scope.row};printVisible = true"
          >
            打印
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑框 -->
    <el-dialog
      :title="dialogStatus | dialogTitleFilter"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="768px"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="ID"
          prop="id"
        >
          <el-input
            v-model="temp.id"
            readonly
            placeholder="系统自动生成"
          />
        </el-form-item>
        <el-form-item
          label="项目"
          prop="projectId"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-select
            v-model="temp.projectId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="日期"
          prop="date"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-date-picker
            v-model="temp.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item
          label="详细信息"
          prop="detail"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-button @click="orderDetailVisible = true">
            详细信息
          </el-button>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <OrderDetail
      :visible.sync="orderDetailVisible"
      :data.sync="temp.detail"
    />
    <OrderPrint
      v-model="printVisible"
      :data="temp"
      :find-project-name="findProjectName"
    />
  </ZlQueryContainer>
</template>

<script>
import * as OrderApi from '@/api/OrderApi.js'
import * as ProjectApi from '@/api/ProjectApi.js'
import OrderDetail from '../components/OrderDetail.vue'
import OrderPrint from '../components/OrderPrint.vue'
import * as DateUtil from '@/core/utils/DateUtil'

export default {
  name: 'Output',
  components: { OrderDetail, OrderPrint },
  data () {
    return {
      projectList: [],
      orderDetailVisible: false,
      printVisible: false,
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      queryParam: {
        type: '入库单'
      },
      dataList: [],
      // ---编辑弹窗
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        projectId: '',
        date: new Date(),
        type: '入库单',
        detail: ''
      },
      columns: [
        {
          field: 'id',
          title: 'ID',
          width: 80
        },
        {
          field: 'projectId',
          title: '项目',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'date',
          title: '日期',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'type',
          title: '类型',
          width: 100,
          'show-overflow-tooltip': true
        }
      ]
    }
  },
  watch: {
    page () {
      this.$refs.table.bodyWrapper.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      this.doSearch()
    }
  },
  created () {
    this.getProjectList()
    this.handleSearch()
  },
  methods: {
    getProjectList () {
      ProjectApi.list().then(res => {
        this.projectList = res.data
      })
    },
    findProjectName (id) {
      return this.projectList.find(project => project.id === id)?.name
    },
    // ---查询
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    doSearch () {
      const options = { ...this.page, ...this.queryParam }
      OrderApi.page(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // ---新增
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    createData () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = {
            ...this.temp,
            date: DateUtil.format(this.temp.date) || this.temp.date
          }
          OrderApi.save(tempData).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // ---修改
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    updateData () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = {
            ...this.temp,
            date: DateUtil.format(this.temp.date) || this.temp.date
          }
          OrderApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // ---删除
    handleDelete (row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OrderApi.del(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        projectId: '',
        date: new Date(),
        type: '入库单',
        detail: ''
      }
    }
    // ---其它
  }
}
</script>

<style lang="scss" scope>

</style>
