<template>
  <!-- 约束列表及编辑 -->
  <div style="padding-left: 1em;">
    <!-- 已添加的约束 -->
    <div class="rule-used-box">
      <div v-for="(item) in usedList" :key="item.id" class="item-rule">
        <el-tag :title="`备注:${item.remarks}`" class="tag-base" type="success">{{item.typeName}}</el-tag>
        <i class="el-icon-delete icon-operate" style="color: #F56C6C;" title="删除"
          @click="handleDelRule(item)"></i>
        <i class="el-icon-edit icon-operate" style="color: #409EFF;" title="编辑"
          @click="handleEditRule(item)"></i>
      </div>
      <div class="no-data" v-show="usedList.length === 0">暂未设置</div>
    </div>
    <!-- 添加按钮 -->
    <div class="item-rule">
      <el-tag class="el-icon-plus icon-operate-add" @click="handleAddRule()">新增</el-tag>
    </div>

    <!-- 弹窗·约束内容编辑 -->
    <el-dialog title="限制条件内容编辑" :visible="dialogFormVisible" :close-on-click-modal="false" append-to-body width="700px">
       <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
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
import * as ActPhaseRuleApi from '@/api/activityInfo/ActPhaseRuleApi'
import RuleTypeSelect from '@/views/modules/activityInfo/RuleTypeSelect'

export default {
  name: 'RuleEditV2',
  components: { RuleTypeSelect },
  props: {
    phaseInfo: {
      type: Object
    },
    // 所有列表
    ruleList: {
      type: Array,
      default: () => { return [] }
    },
    // 已添加的列表(更新后，要更新父组件的该值)
    usedList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      actData: null,
      // 表单内容
      temp: {},
      // 约束内容编辑
      dialogFormVisible: false,
      // 正在执行操作，防止重复
      fUpdating: false,
      ruleValue: { typeId: '', ruleParam: '' },
      dialogStatus: 'create'
    }
  },
  computed: {
    // 约束已配置数组，0-未配置，1-已配置
    ruleFlagArr () {
      let arr = []
      this.ruleList.forEach(rule => {
        let index = this.usedList.findIndex(actRule => actRule.typeId === rule.id)
        arr.push(index > -1 ? 1 : 0)
      })
      return arr
    }
  },
  created () {
    this.actData = { actId: this.$route.query.actId, actName: this.$route.query.actName }
  },
  methods: {
    // 删除活动参与某个约束
    handleDelRule (item) {
      if (this.fUpdating) return

      this.fUpdating = true
      this.$confirm(`确认删除此限制：${item.typeName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActPhaseRuleApi.del(item.id).then(res => {
          this.$message.success('删除成功')
          this.$emit('updateRule')
        })
      }).catch(() => {
        // do nothing
      }).finally(() => {
        this.fUpdating = false
      })
    },
    // 添加活动某个参与约束
    handleAddRule () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 编辑当前参与约束
    handleEditRule (item) {
      if (this.ifConfig(item)) {
        this.temp = Object.assign({}, item)
        this.ruleValue.typeId = this.temp.typeId
        this.ruleValue.ruleParam = this.temp.param
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      } else {
        this.$message.info('当前约束无需编辑配置')
      }
    },
    // 新增保存
    createData () {
      if (this.fUpdating) return

      this.fUpdating = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActPhaseRuleApi.save(tempData).then(res => {
            this.dialogFormVisible = false
            this.$message.success('添加参与限制成功')
            this.$emit('updateRule')
          }).finally(() => { this.fUpdating = false })
        }
      })
    },
    // 修改保存
    updateData () {
      if (this.fUpdating) return

      this.fUpdating = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActPhaseRuleApi.update(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('updateRule')
            this.$message.success('更新成功')
          }).finally(() => { this.fUpdating = false })
        }
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actData.actId,
        phaseId: this.phaseInfo.phaseId,
        typeId: '',
        param: '',
        enabled: 1,
        orderTag: 1,
        remarks: ''
      }
      this.ruleValue.typeId = ''
      this.ruleValue.ruleParam = ''
    },
    // 判断是否需要配置参数
    ifConfig (rule) {
      let flag = true
      if (!rule.paramExample) flag = false
      return flag
    }
  }
}
</script>

<style lang='scss' scoped>
.icon-operate {
  margin-left: 12px;
  font-size: 24px;
}
.item-rule {
  display: flex;
  margin-bottom: 7px;
  align-items: center;
}
.tag-base {
  width: 250px;
  overflow: hidden;
}
.icon-operate-add {
  width: 90%;
  text-align: center;
}
.rule-used-box {
  width: 90%;
  margin: 10px 0 10px 0;
  padding: 8px 0 1px 5px;
  .no-data {
    line-height: 30px;
    text-align: center;
  }
}
</style>
