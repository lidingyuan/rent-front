<template>
  <div>
    <el-form size="medium" label-width="120px" ref="dataForm" :model="temp" status-icon>
      <el-row>
        <el-col :span="24">
          <el-form-item label="问卷名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.beginTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"
              default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59" :clearable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:none;">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              筛选题目
              <i class="el-icon-question" title="关闭-使用全部配置的题目"></i>
            </span>
            <el-switch v-model="sieveQuestion" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="sieveQuestion">
          <el-form-item prop="itemNum">
            <span slot="label">
              筛选个数
              <i class="el-icon-question" title="从已配置的题库中随机筛选输入值个数题目展示，-1表示使用全部配置的题目"></i>
            </span>
            <el-input-number v-model="temp.itemNum" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="completed" :rules="[{required:true, message:'必须字段'}]">
             <span slot="label">
              完整提交
              <i class="el-icon-question"
                title="开启-用户填写的问卷需要每道题都填写方可提交；关闭-用户填写的问卷可部分题目不填写也能完成提交"></i>
            </span>
            <el-switch v-model="temp.completed" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display:none;">
          <el-form-item prop="open" :rules="[{required:true, message:'必须字段'}]">
            <span slot="label">
              开放填写
              <i class="el-icon-question" title="关闭时，在用户答卷前，数据库中的答卷主表需先创建好记录"></i>
            </span>
            <el-switch v-model="temp.open" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display:none;">
          <el-form-item prop="verify" :rules="[{required:true, message:'必须字段'}]">
            <span slot="label">
              自动校验
              <i class="el-icon-question" title="开启后，设置问题时需要维护参考答案"></i>
            </span>
            <el-switch v-model="temp.verify" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="应用场景" prop="scene">
            <el-select v-model="temp.scene">
              <el-option :value="1" label="一次性问卷(用户仅能回答问卷一次)"></el-option>
              <el-option :value="2" label="随机可重复回答"></el-option>
              <el-option :value="3" label="条件可重复回答"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="temp.scene > 1">
          <el-form-item prop="rewritable" :rules="[{required:true, message:'必须字段'}]">
             <span slot="label">
              更新回答
              <i class="el-icon-question" title="开启-多次提交状态下，新提交的回答数据会覆盖之前的回答数据"></i>
            </span>
            <el-switch v-model="temp.rewritable" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="页面布局" prop="layout">
        <el-select v-model="temp.layout">
          <el-option :value="0" label="一页一道题"></el-option>
          <el-option :value="1" label="一页展示全部题目"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="样式文件路径" prop="cssUrl">
            <el-input v-model="temp.cssUrl" placeholder="请输入问卷样式文件路径"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.status" >
              <el-option :value="0" label="草稿"></el-option>
              <el-option :value="1" label="生效"></el-option>
              <el-option :value="2" label="中止"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="排序码" prop="orderTag" >
            <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
          </el-form-item>
        </el-col> -->
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
import * as ActPaperApi from '@/api/paper/ActPaperApi.js'

export default {
  name: 'EditPaper',
  props: {
  },
  data () {
    return {
      // 是否筛选题目
      sieveQuestion: 0,
      temp: {},
      // 是否可以更改活动; 编辑，流程图时不能更改,在从问卷管理处创建问卷是需要选择活动的
      canChangeAct: false,
      actInfo: null,
      formData: {}
    }
  },
  created () {
    ActPaperApi.listByPage({
      current: 1,
      total: 0,
      size: 1,
      actId: this.$route.query.actId
    }).then(res => {
      this.formData = res.data.records[0]
      this.initUpdate()
    })
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        actId: '',
        code: '',
        name: '',
        beginTime: '',
        endTime: '',
        itemNum: -1,
        completed: 1,
        rewritable: 0,
        open: 1,
        verify: 0,
        status: 1,
        orderTag: 1,
        remarks: '',
        cssUrl: '',
        scene: 1,
        layout: 0
      }
      this.canChangeAct = true
    },
    // 更新初始化，查询活动名称
    initUpdate () {
      this.canChangeAct = false
      this.temp = Object.assign({}, this.formData)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActPaperApi.update(tempData).then(() => {
            this.$emit('refreshIframe')
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

</style>
