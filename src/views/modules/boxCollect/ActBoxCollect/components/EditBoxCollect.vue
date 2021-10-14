<template>
  <div>
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
        <el-col :span="24">
          <el-form-item label="规则名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="参与对象" prop="target" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.target">
              <el-option label="零售户" value="01"></el-option>
              <el-option label="消费者" value="02"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达标数量" prop="collectNum" :rules="[{required:true, message:'必须字段'}]">
            <el-input-number v-model.number="temp.collectNum" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动卷烟" prop="tobaId" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.tobaId" style="width: 100%" filterable placeholder="请选择卷烟,支持输入快速查询">
              <el-option v-for="(tobacco, index) in tobaList" :key="index" :label="tobacco | tobaType"
                :value="tobacco.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="enable" :rules="[{required:true, message:'必须字段'}]">
            <el-switch v-model="temp.enable" :inactive-value="0" :active-value="1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="temp.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-divider content-position="center">用户奖励</el-divider>
        <el-col :span="12">
          <el-form-item label="用户独享积分" prop="rewardsPointSolo" >
            <el-input-number v-model.number="temp.rewardsPointSolo" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户共享积分" prop="rewardsPointShare" >
            <el-input-number v-model.number="temp.rewardsPointShare" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="集盒模板消息" prop="collectMessage">
            <el-button size="mini" type="primary" @click="dialogCollectFormVisible = true" >设置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="奖励模板消息" prop="rewardsMessage">
            <el-button size="mini" type="primary" @click="dialogRewardsFormVisible = true" >设置</el-button>
          </el-form-item>
        </el-col>
        <!-- 集盒模板消息 -->
        <el-dialog title="设置模板消息" v-if="dialogCollectFormVisible" :visible.sync="dialogCollectFormVisible" :modal="false" width="868px">
          <template-message-box v-model="temp.collectMessage"></template-message-box>
          <div style="text-align:right">
            <el-button type="primary" @click="dialogCollectFormVisible = false">关闭</el-button>
          </div>
        </el-dialog>
        <!-- 奖励模板消息 -->
        <el-dialog title="设置模板消息" v-if="dialogRewardsFormVisible" :visible.sync="dialogRewardsFormVisible" :modal="false" width="868px">
          <template-message-box v-model="temp.rewardsMessage"></template-message-box>
          <div style="text-align:right">
            <el-button type="primary" @click="dialogRewardsFormVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </el-row>

      <el-row>
        <el-divider content-position="center">关注的人奖励</el-divider>
        <el-col :span="12">
          <el-form-item label="奖励积分" prop="followPoint" >
            <el-input-number v-model.number="temp.followPoint" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制区域" prop="followAreaStrict" >
            <el-switch v-model="temp.followAreaStrict" :inactive-value="0" :active-value="1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制类型" prop="followType" >
            <el-select v-model="temp.followType">
              <el-option label="零售户" value="01"></el-option>
              <el-option label="消费者" value="02"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板消息" prop="followMessage">
            <el-button size="mini" type="primary" @click="dialogFollowFormVisible = true" >设置</el-button>
          </el-form-item>
        </el-col>
        <!-- 编辑框 -->
        <el-dialog title="设置模板消息" v-if="dialogFollowFormVisible" :visible.sync="dialogFollowFormVisible" :modal="false" width="868px">
          <template-message-box v-model="temp.followMessage"></template-message-box>
          <div style="text-align:right">
            <el-button type="primary" @click="dialogFollowFormVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </el-row>

    </el-form>

    <div style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="editStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActBoxCollectApi from '@/api/boxCollect/ActBoxCollectApi.js'
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'

import ActSelect from '@/views/modules/components/ActSelect'
import TemplateMessageBox from '@/views/modules/components/TemplateMessageBox'

export default {
  name: 'EditTuike',
  components: { ActSelect, TemplateMessageBox },
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
      actInfo: null,
      // 配置模板消息
      dialogCollectFormVisible: false,
      dialogRewardsFormVisible: false,
      dialogFollowFormVisible: false
    }
  },
  computed: {
    // 卷烟列表
    tobaList () {
      return this.$store.getters['baseData/tobaList']
    }
  },
  created () {
    if (this.editStatus === 'create') {
      this.initCreate()
    } else {
      this.initUpdate()
    }
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        actId: '',
        actName: '',
        name: '',
        tobaId: '',
        target: '02',
        collectNum: 1,
        rewardsPointSolo: 0,
        collectMessage: {},
        rewardsMessage: {},
        followPoint: 0,
        followMessage: {},
        followAreaStrict: 1,
        followType: '01',
        enable: 1,
        orderTag: 1,
        remarks: ''
      }
      if (this.actData && this.actData.id) {
        this.canChangeAct = false
        this.temp.actId = this.actData.id
        this.temp.actName = this.actData.name
        this.temp.name = this.formData.name || ''
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
      this.temp.collectMessage = this._parseMessage(this.temp.collectMessage)
      this.temp.rewardsMessage = this._parseMessage(this.temp.rewardsMessage)
      this.temp.followMessage = this._parseMessage(this.temp.followMessage)
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
          const tempData = Object.assign({}, this.temp)
          tempData.collectMessage = this._serializeMessage(this.temp.collectMessage)
          tempData.rewardsMessage = this._serializeMessage(this.temp.rewardsMessage)
          tempData.followMessage = this._serializeMessage(this.temp.followMessage)
          ActBoxCollectApi.save(tempData).then(res => {
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
          tempData.collectMessage = this._serializeMessage(this.temp.collectMessage)
          tempData.rewardsMessage = this._serializeMessage(this.temp.rewardsMessage)
          tempData.followMessage = this._serializeMessage(this.temp.followMessage)
          ActBoxCollectApi.update(tempData).then(() => {
            this.closeDialog()
            this.$message.success('更新成功')
          })
        }
      })
    },
    // ---
    _parseMessage (messageStr) {
      try {
        if (messageStr) {
          return JSON.parse(messageStr)
        }
      } catch (error) {
      }
      return {}
    },
    _serializeMessage (messageObj) {
      if (!messageObj.content) {
        return null
      }
      if (Object.getOwnPropertyNames(messageObj.content).length > 0) {
        messageObj['toUser'] = '#{#toUser}'
        return JSON.stringify(messageObj)
      }
      return null
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
