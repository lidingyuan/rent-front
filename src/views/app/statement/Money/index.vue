<template>
  <ZlQueryContainer
    ref="tableWrapper"
    title="列表"
    :pagination.sync="page"
    :table-data="dataList"
    :columns="columns"
  >
    <template #queryParam>
      项目：
      <el-select
        v-model="queryParam.projectId"
        clearable
        size="small"
        placeholder="请选择"
      >
        <el-option
          v-for="project in projectList"
          :key="project.id"
          :label="project.name"
          :value="project.id"
        />
      </el-select>
      状态：
      <el-select
        v-model="queryParam.state"
        multiple
        collapse-tags
        size="small"
        placeholder="请选择"
      >
        <el-option
          v-for="(state,index) in stateMap"
          :key="index"
          :label="state"
          :value="index"
        />
      </el-select>
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
        <template
          v-else-if="column.field === 'state'"
          #default="{row}"
        >
          {{ stateMap[row.state] }}
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state === 1 || scope.row.state === 4"
            type="primary"
            size="mini"
            @click="handleUpdateState(scope.row)"
          >
            单据确认
          </el-button>
          <el-button
            v-if="scope.row.state === 0"
            type="danger"
            size="mini"
            @click="handleWithdraw(scope.row)"
          >
            撤销
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            编辑
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
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-radio
            v-model="temp.type"
            :label="1"
          >
            支出
          </el-radio>
          <el-radio
            v-model="temp.type"
            :label="2"
          >
            收入
          </el-radio>
        </el-form-item>
        <el-form-item
          label="金额"
          prop="money"
          :rules="[{required:true, message:'必须字段'}]"
        >
          <el-input v-model="temp.money" />
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
import * as MoneyApi from '@/api/MoneyApi.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Money',
  data () {
    return {
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
        projectId: '',
        date: '',
        type: '',
        userCompId: '',
        money: ''
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
        },
        {
          field: 'money',
          title: '金额',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'state',
          title: '状态',
          width: 100,
          'show-overflow-tooltip': true
        }
      ],
      stateMap: ['完成', '待确认', '待对方确认', '撤销', '待撤销', '待对方确认撤销']
    }
  },
  computed: {
    ...mapGetters('project', ['projectList'])
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
      MoneyApi.page(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
        this.page.current = res.data.current
        this.page.total = res.data.total
        this.page.size = res.data.size
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
          MoneyApi.save(this.temp).then(res => {
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
          MoneyApi.update(tempData).then(() => {
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
        MoneyApi.del(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleSearch()
        })
      })
    },

    // ---其它
    handleUpdateState (row) {
      this.$confirm('确认结算单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        MoneyApi.completeState({ id: row.id, type: this.queryParam.type }).then(res => {
          this.$message({
            message: '结算单状态已改变',
            type: 'success',
            duration: 2000
          })
          this.handleSearch()
        })
      })
    },
    handleWithdraw (row) {
      this.$confirm('撤销结算单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        MoneyApi.withdraw({ id: row.id, type: this.queryParam.type }).then(res => {
          this.$message({
            message: '结算单状态已改变',
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
        date: '',
        type: '',
        userCompId: '',
        money: ''
      }
    }
    // ---其它
  }
}
</script>

<style lang="scss" scope>

</style>
