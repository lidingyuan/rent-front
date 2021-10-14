<template>
  <div class="lucky-form">
    <el-form size="medium" label-width="150px" ref="dataForm" :model="temp" status-icon>
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
      <el-button type="primary" @click="updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActLuckyApi from '@/api/lucky/ActLuckyApi.js'

export default {
  name: 'EditLucky',
  props: {
    phaseId: {
      type: String
    }
  },
  data () {
    return {
      temp: {},
      // 是否可以更改活动; 编辑，流程图时不能更改,从抽奖管理处点击新增时选择活动
      canChangeAct: false,
      // 选中的活动完整信息
      actInfo: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      ActLuckyApi.detail(this.phaseId).then(res => {
        this.temp = res.data
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActLuckyApi.update(tempData).then(() => {
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
