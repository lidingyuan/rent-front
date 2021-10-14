<template>
  <div>
    <el-alert type="error" style="margin-bottom:10px;" :closable="false">提示：抽奖创建完成后请添加 '[通用][前置]同步HTTP请求约束' 参与约束，否则不会出奖</el-alert>
    <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择活动" prop="actId" :rules="[{required:true, message:'必须字段'}]">
            <!-- 已有活动id不允许修改活动 -->
            <el-input v-model="temp.actName" disabled v-if="!canChangeAct"></el-input>
            <!-- 活动选择组件 -->
            <act-select v-else :actId.sync="temp.actId" :actName.sync="temp.actName" :actInfo.sync="actInfo"></act-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="抽奖游戏名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="beginTime" :rules="[{required:true, validator: validateBeginEnd}]">
            <el-date-picker v-model="temp.beginTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime" :rules="[{required:true, validator: validateBeginEnd}]">
            <el-date-picker v-model="temp.endTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="奖池结余处理" prop="refreshPoolPre" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.refreshPoolPre" placeholder="">
              <el-option :value="1" label="延续至下期"></el-option>
              <el-option :value="0" label="不延续至下期"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.status" placeholder="">
              <el-option :value="0" label="草稿"></el-option>
              <el-option :value="1" label="启用"></el-option>
              <el-option :value="2" label="停用"></el-option>
            </el-select>
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

    <div style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="editStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActLuckyApi from '@/api/lucky/ActLuckyApi.js'
import ActSelect from '@/views/modules/components/ActSelect'
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'

export default {
  name: 'EditLucky',
  components: { ActSelect },
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
      // 是否可以更改活动; 编辑，流程图时不能更改,从抽奖管理处点击新增时选择活动
      canChangeAct: false,
      // 选中的活动完整信息
      actInfo: null
    }
  },
  created () {
    if (this.editStatus === 'create') {
      this.initCreate()
    } else {
      this.initUpdate()
    }
  },
  watch: {
    'actInfo.id' (newVal) {
      if (this.actData && this.actData.id) return
      if (newVal) {
        this.temp.beginTime = this.actInfo.beginTime
        this.temp.endTime = this.actInfo.endTime
      } else {
        this.temp.beginTime = ''
        this.temp.endTime = ''
      }
    }
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        actId: '',
        actName: '',
        code: '',
        name: '',
        beginTime: '',
        endTime: '',
        refreshPoolPre: 0,
        refreshPoolFirst: 100,
        status: 1,
        orderTag: 1,
        remarks: ''
      }
      if (this.actData && this.actData.id) {
        this.canChangeAct = false
        this.temp.actId = this.actData.id
        this.temp.actName = this.actData.name
        this.temp.name = this.formData.name || ''
        this.temp.beginTime = this.actData.beginTime
        this.temp.endTime = this.actData.endTime
      } else {
        this.canChangeAct = true
      }
    },
    // 关闭面板
    closeDialog (luckyId) {
      this.$emit('closeDialog', luckyId || this.temp.id)
    },
    // 新增初始化
    initCreate () {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新初始化，查询活动名称
    initUpdate () {
      this.temp = Object.assign({}, this.formData)
      if (!this.actData || !this.actData.actName) {
        ActConfigApi.detail(this.temp.actId).then(res => {
          this.$set(this.temp, 'actName', res.data.name)
        })
      } else {
        this.$set(this.temp, 'actName', this.actData.actName)
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          ActLuckyApi.save(this.temp).then(res => {
            this.closeDialog(res.data)
            this.$message.success('创建成功')
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActLuckyApi.update(tempData).then(() => {
            this.closeDialog()
            this.$message.success('更新成功')
          })
        }
      })
    },
    // ---表单验证
    validateBeginEnd (rule, value, callback) {
      if (this.temp.endTime !== '' && this.temp.beginTime >= this.temp.endTime) {
        callback(new Error('开始时间必须早于截止时间'))
      } else if (this.temp.endTime !== '' && new Date(this.temp.endTime) < new Date()) {
        callback(new Error('截止时间必须晚于当前时间'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tip-phase {
  line-height: 40px;
  padding-left: 25px;
}
</style>
