<template>
  <div>
    <el-form :model="temp" size="medium" label-width="150px" ref="dataForm" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动名称">
            <el-input v-model="actData.actName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环节类型" prop="phaseType">
            <el-select v-model="temp.phaseType" placeholder="请选择环节类型，支持输入" default-first-option >
              <el-option v-for="(phaseType, index) in phaseTypeList" :key="phaseType.value + index"
                :label="phaseType.label" :value="phaseType.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环节ID" prop="phaseId">
            <el-input v-model="temp.phaseId" placeholder="请输入环节ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环节名称" prop="phaseName" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.phaseName" placeholder="请输入环节名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="环节入口地址" prop="entryUrl" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.entryUrl" placeholder="请输入环节入口地址"></el-input>
            <br><span style="color: #F56C6C;">
              <i class="el-icon-info"></i>
              建议去除http协议部分，如：//{{hostName}}/front/weixin-act-paper/
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序码" prop="orderTag" :rules="[{required:true, message:'必须字段'}]">
            <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            <i class="el-icon-info">排序码决定环节顺序，请认真填写</i>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="temp.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="editStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi.js'

export default {
  name: 'EditPhase',
  props: {
    // 编辑状态
    editStatus: {
      type: String,
      default: 'create'
    },
    actData: {
      type: Object
    },
    // 原始数据，更新时传递
    formData: {
      type: Object
    }
  },
  data () {
    return {
      temp: null,
      // 当前域名
      hostName: location.hostname
    }
  },
  computed: {
    phaseTypeList () {
      return this.$store.getters['baseData/phaseTypeList']
    }
  },
  created () {
    this.editStatus === 'create' ? this.initCreate() : this.initUpdate()
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actData.actId,
        phaseId: '',
        phaseName: '',
        phaseType: '',
        entryUrl: '',
        orderTag: 1,
        remarks: ''
      }
    },
    // 关闭面板
    closeDialog (flag = false) {
      this.$emit('closeDialog', flag)
    },
    // 新增初始化
    initCreate () {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新初始化
    initUpdate () {
      this.temp = Object.assign({}, this.formData)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = { actId: this.actId, ...this.temp }
          ActPhaseApi.save(tempData).then(res => {
            this.closeDialog(res.data)
            this.$message.success('创建成功')
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = { actId: this.actId, ...this.temp }
          ActPhaseApi.update(tempData).then(() => {
            this.closeDialog(true)
            this.$message.success('更新成功')
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
