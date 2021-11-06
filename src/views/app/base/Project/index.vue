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
          v-if="column.field === 'customerId'"
          #default="{row}"
        >
          {{ findCustomerName(row.customerId) }}
        </template>
      </el-table-column>
      <el-table-column
        width="300"
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
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
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
          label="项目名称"
          prop="name"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="客户"
          prop="customerId"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-select
            v-model="temp.customerId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="租金"
          prop="priceList"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-button @click="projectPriceVisible = true">
            设置
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
    <ProjectPrice
      :visible.sync="projectPriceVisible"
      :price-list.sync="temp.priceList"
    />
  </ZlQueryContainer>
</template>

<script>
import * as ProjectApi from '@/api/ProjectApi.js'
import * as CustomerApi from '@/api/CustomerApi.js'
import ProjectPrice from './components/ProjectPrice.vue'
import { mapActions } from 'vuex'

export default {
  name: 'Project',
  components: { ProjectPrice },
  data () {
    return {
      projectPriceVisible: false,
      customerList: [],
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      queryParam: {
      },
      dataList: [],
      // ---编辑弹窗
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        name: '',
        customerId: '',
        priceList: []
      },
      columns: [
        {
          field: 'id',
          title: 'ID',
          width: 80
        },
        {
          field: 'name',
          title: '项目名称',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'customerId',
          title: '客户',
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
    this.getCustomerList()
    this.handleSearch()
  },
  methods: {
    ...mapActions('project', ['updateProjectList']),
    findCustomerName (id) {
      const customer = this.customerList.find(c => c.id === id)
      return customer.name
    },
    getCustomerList () {
      CustomerApi.list().then(res => {
        this.customerList = res.data
      })
    },
    // ---查询
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    doSearch () {
      const options = { ...this.page, ...this.queryParam }
      ProjectApi.page(options).then(res => {
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
          ProjectApi.save(this.temp).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.updateProjectList()
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
      if (!row.priceList) {
        ProjectApi.projectPriceList({ projectId: row.id }).then(res => {
          row.priceList = res.data
          this.temp = Object.assign({}, row)
        })
      } else {
        this.temp = Object.assign({}, row)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    updateData () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = { ...this.temp }
          ProjectApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.updateProjectList()
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
        ProjectApi.del(row.id).then(res => {
          this.updateProjectList()
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
        name: '',
        customerId: '',
        priceList: []
      }
    }
    // ---其它
  }
}
</script>

<style lang="scss" scoped>

</style>
