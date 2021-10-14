<template>
  <!-- 活动约束 -->
  <div>
    <table-wrapper :filterable="false" :excel="false" :expand="expand">
      <!-- 标题 -->
      <div slot="title">{{actName}} - 活动可见约束列表</div>
      <template slot="operates">
        <el-button v-if="$auth('activity:activity:visible_rule:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <rule-explain-dialog></rule-explain-dialog>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="typeName" width="200" label="约束名称"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="300" label="备注" ></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:activity:visible_rule:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:activity:visible_rule:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" append-to-body
      :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动名称">
              <el-input v-model="actName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- 约束器选择 -->
            <rule-type-select v-if="dialogFormVisible" :ruleValue.sync="ruleValue" phaseId="0" phaseType="visible"></rule-type-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序码" prop="orderTag" >
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="temp.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作按钮 -->
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as ActRuleApi from '@/api/activityInfo/ActRuleApi.js'

import TableWrapper from '@/components/TableWrapper'
import RuleTypeSelect from '../RuleTypeSelect'
import RuleExplainDialog from '@/views/modules/activityInfo/components/RuleExplainDialog'

export default {
  name: 'ActConfigRule',
  components: { TableWrapper, RuleTypeSelect, RuleExplainDialog },
  props: {
    actData: {
      type: Object
    }
  },
  data () {
    return {
      // 是否显示最大化,作为弹窗不出现
      expand: true,
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        actId: '',
        typeId: '',
        param: '',
        orderTag: 1,
        remarks: ''
      },
      // 活动id
      actId: '',
      actName: '',
      // 传递给约束选择组件的值
      ruleValue: {},
      // 约束列表
      ruleTypeList: []
    }
  },
  created () {
    this.initQueryParams()
    this.handleSearch()
  },
  methods: {
    // 初始化路由参数
    initQueryParams () {
      // 作为页签打开
      if (this.$route && this.$route.query.actId) {
        this.actId = this.$route.query.actId
        this.actName = this.$route.query.actName
        this.expand = true
      } else {
        // 作为弹窗打开,已是有prop传递
        this.actId = this.actData.actId
        this.actName = this.actData.actName
        this.expand = false
      }
      this.temp.actId = this.actId
    },
    // ---查询列表
    handleSearch () {
      this.doSearch()
    },
    doSearch () {
      let options = {
        actId: this.actId
      }
      ActRuleApi.listByPage(options).then(res => {
        this.dataList = res.data
      })
    },
    // ---编辑
    handleCreate () {
      this.resetTemp()
      this.ruleValue.typeId = ''
      this.ruleValue.ruleParam = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActRuleApi.save(tempData).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('新增成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      this.ruleValue.typeId = this.temp.typeId
      this.ruleValue.ruleParam = this.temp.param
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActRuleApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此约束?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActRuleApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actId,
        typeId: '',
        param: '',
        orderTag: 1,
        remarks: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>

</style>
