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
        v-model="queryParam['qp-name-like']"
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
        :align="align"
      />
      <el-table-column
        prop="remarks"
        width="200"
        label="备注"
        show-overflow-tooltip
      />
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
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-dropdown :hide-on-click="true">
            <el-button
              size="mini"
              type="primary"
            >
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                @click.native="handleUpdate(scope.row)"
              >
                编辑
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                style="color:#F56C6C;"
                @click.native="handleDelete(scope.row)"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
          label="编码"
          prop="code"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="关键字"
          prop="key"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.key" />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item
          label="排序码"
          prop="orderTag"
        >
          <el-input-number
            v-model.number="temp.orderTag"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            v-model="temp.remarks"
            type="textarea"
          />
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
  </ZlQueryContainer>
</template>

<script>
import * as MaterialApi from '@/api/MaterialApi.js'

export default {
  name: 'Material',
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      queryParam: {
        'qp-name-like': ''
      },
      dataList: [],
      // ---编辑弹窗
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        code: '',
        name: '',
        key: '',
        type: '',
        orderTag: 1,
        remarks: ''
      },
      columns: [
        {
          field: 'id',
          title: 'ID',
          width: 80
        },
        {
          field: 'code',
          title: '编码',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'name',
          title: '名称',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'key',
          title: '关键字',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'type',
          title: '类型',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'orderTag',
          title: '排序(整型)',
          width: 80,
          align: 'right'
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
    this.handleSearch()
  },
  methods: {
    // ---查询
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    doSearch () {
      const options = { ...this.page, ...this.queryParam }
      MaterialApi.page(options).then(res => {
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
          MaterialApi.save(this.temp).then(res => {
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
          const tempData = { ...this.temp }
          MaterialApi.update(tempData).then(() => {
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
        MaterialApi.del(row.id).then(res => {
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
        code: '',
        name: '',
        key: '',
        type: '',
        orderTag: 1,
        remarks: ''
      }
    }
    // ---其它
  }
}
</script>

<style lang="scss" scope>

</style>
