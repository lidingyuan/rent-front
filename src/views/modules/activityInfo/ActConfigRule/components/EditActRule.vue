<template>
  <!--  -->
  <div>
    <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动名称">
            <el-input v-model="actInfo.name" disabled></el-input>
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

    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="editStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActRuleApi from '@/api/activityInfo/ActRuleApi.js'
import RuleTypeSelect from '../../RuleTypeSelect'

export default {
  name: 'EditActRule',
  components: { RuleTypeSelect },
  props: {
    // 编辑状态
    editStatus: {
      type: String,
      default: 'create'
    },
    // 原始数据，更新时传递
    formData: {
      type: Object
    },
    // 活动信息，包含name，id
    actInfo: {
      type: Object
    }
  },
  data () {
    return {
      temp: null,
      // 传递给约束选择组件的值
      ruleValue: { typeId: '', ruleParam: '' }
    }
  },
  created () {
    this.editStatus === 'create' ? this.initCreate() : this.initUpdate()
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actInfo.id,
        typeId: '',
        param: '',
        orderTag: 1,
        remarks: ''
      }
    },
    // 关闭面板
    closeDialog () {
      this.$emit('closeDialog')
    },
    // 新增初始化
    initCreate () {
      this.resetTemp()
      this.ruleValue.typeId = ''
      this.ruleValue.ruleParam = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 更新初始化
    initUpdate () {
      this.temp = Object.assign({}, this.formData)
      this.ruleValue.typeId = this.temp.typeId
      this.ruleValue.ruleParam = this.temp.param
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增活动请求
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActRuleApi.save(tempData).then(res => {
            this.closeDialog()
            this.$message.success('新增成功')
          })
        }
      })
    },
    // 更新活动请求
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData.typeId = this.ruleValue.typeId
          tempData.param = this.ruleValue.ruleParam
          ActRuleApi.update(tempData).then(() => {
            this.closeDialog()
            this.$message.success('更新成功')
          })
        }
      })
    }
  },
  watch: {
    editStatus (newVal) {
      newVal === 'create' ? this.initCreate() : this.initUpdate()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
