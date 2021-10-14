<template>
  <div>
    <table-wrapper :filterable="false" :excel="false" :expand="expand">
      <!-- 标题 -->
      <div slot="title">
        <span v-if="isPhaseRule">{{phaseInfo.phaseName}}-环节约束列表</span>
        <span v-else>{{actInfo.actName}}-活动约束列表</span>
      </div>
      <template slot="operates">
        <el-button v-if="$auth('activity:activity:phase_rule:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <rule-explain-dialog></rule-explain-dialog>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeName" width="200" label="约束名称"></el-table-column>
        <el-table-column prop="enabled" width="80" label="是否启用">
          <template slot-scope="scope">
            {{scope.row.enabled | singleIntegerToChinese}}
          </template>
        </el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="300" label="备注" show-overflow-tooltip=""></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:activity:phase_rule:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:activity:phase_rule:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" append-to-body
      :destroy-on-close="true" :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="isPhaseRule" label="环节名称">
              <el-input v-model="phaseInfo.phaseName" disabled></el-input>
            </el-form-item>
            <el-form-item v-else label="活动名称">
              <el-input v-model="actInfo.actName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 约束器选择 -->
          <el-col :span="24">
            <rule-type-select v-if="dialogFormVisible" :ruleValue.sync="ruleValue" :phaseId="phaseInfo.phaseId" :phaseType="phaseInfo.phaseType"></rule-type-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序码" prop="orderTag" >
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled" :rules="[{required:true, message:'必须字段'}]">
              <el-switch v-model="temp.enabled" :inactive-value="0" :active-value="1"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="temp.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as ActPhaseRuleApi from '@/api/activityInfo/ActPhaseRuleApi.js'

import TableWrapper from '@/components/TableWrapper'
import RuleTypeSelect from '../RuleTypeSelect'
import RuleExplainDialog from '@/views/modules/activityInfo/components/RuleExplainDialog'

export default {
  name: 'ActPhaseRule',
  components: { TableWrapper, RuleTypeSelect, RuleExplainDialog },
  props: {
    // 活动信息
    actData: {
      type: Object
    },
    // 环节信息
    phaseData: {
      type: Object
    }
  },
  data () {
    return {
      // 是否显示最大化,作为弹窗不出现
      expand: true,
      actInfo: {},
      phaseInfo: {},
      // 是否是环节约束
      isPhaseRule: true,
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        actId: '',
        phaseId: '',
        typeId: '',
        param: '',
        enabled: 1,
        orderTag: 1,
        remarks: ''
      },
      // 传递给约束选择组件的值
      ruleValue: {},
      // 处理器列表
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
        this.actInfo.actId = this.$route.query.actId
        this.actInfo.actName = this.$route.query.actName
        // 活动约束，phaseId为0
        this.phaseInfo.phaseId = this.$route.query.phaseId || '0'
        this.phaseInfo.phaseName = this.$route.query.phaseName || ''
        this.phaseInfo.phaseType = this.$route.query.phaseType || 'normal'
        this.expand = true
      } else {
        // 作为弹窗打开,已是有prop传递
        this.actInfo = this.actData
        this.phaseInfo = this.phaseData
        this.expand = false
      }
      if (this.phaseInfo.phaseId === '0') {
        this.isPhaseRule = false
      }
    },
    // ---查询列表
    handleSearch () {
      this.doSearch()
    },
    doSearch () {
      let options = {
        phaseId: this.phaseInfo.phaseId,
        actId: this.actInfo.actId
      }
      ActPhaseRuleApi.listByPage(options).then(res => {
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
          ActPhaseRuleApi.save(tempData).then(res => {
            this.dialogFormVisible = false
            this.$message.success('创建成功')
            this.handleSearch()
          })
        }
      })
    },
    // ---修改
    handleUpdate (row) {
      this.resetTemp()
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
          ActPhaseRuleApi.update(tempData).then(() => {
            this.dialogFormVisible = false
            this.handleSearch()
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此环节约束?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActPhaseRuleApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    // ---------------------结束编辑
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actInfo.actId,
        phaseId: this.phaseInfo.phaseId,
        typeId: '',
        param: '',
        enabled: 1,
        orderTag: 1,
        remarks: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>
</style>
