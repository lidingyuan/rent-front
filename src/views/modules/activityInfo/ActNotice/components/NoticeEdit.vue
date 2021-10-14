<template>
  <!-- 公告编辑 -->
  <div>
    <!-- 表单编辑 -->
    <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
      <el-form-item label="活动ID" prop="actId" :rules="[{required:true, message:'必须字段'}]">
        <el-input v-model="temp.actId" disabled></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公告编号" prop="code" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告标题" prop="title" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="temp.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="公告内容" prop="content" :rules="[{required:true, message:'必须字段'}]">
            <el-input type="textarea" v-model="temp.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.beginTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
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

    <!-- 按钮操作 -->
    <div class="footer">
      <el-button @click="handleNext()" v-if="source === 'activity'">跳过</el-button>
      <el-button @click="handleClose()">
        {{source === 'activity' ? '关闭' : '取消'}}
      </el-button>
      <el-button type="primary" @click="status === 'create' ? createData() : updateData()">
        {{source === 'activity' ? '下一步' : '确定'}}
      </el-button>
    </div>
  </div>
</template>

<script>
import * as ActNoticeApi from '@/api/activityInfo/ActNoticeApi.js'

export default {
  name: 'NoticeEdit',
  /**
   * source为activity时表示是创建活动时一步一步过来的，具有跳过，下一步的按钮
   * status: create-新增，update-修改
   */
  props: ['noticeTemp', 'step', 'source', 'status'],
  components: {},
  data () {
    return {
      temp: null
    }
  },
  watch: {},
  created () {
    this.temp = Object.assign({}, this.noticeTemp)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  },
  methods: {
    // 下一步按钮事件，提交当前表单
    handleSubmit () {
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          ActNoticeApi.save(this.temp).then(res => {
            if (this.source === 'activity') {
              // 进入下一步，约束
              this.$emit('update:step', 3)
            } else {
              // 关闭弹窗
              this.$emit('handleCloseEdit', false)
              this.$message.success('创建成功')
            }
          })
        }
      })
    },
    // 修改保存。
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActNoticeApi.update(tempData).then(() => {
            this.$emit('handleCloseEdit', false)
            this.$message.success('更新成功')
          })
        }
      })
    },
    // 跳过当前表单，直接到下一步
    handleNext () {
      // 进入约束新增
      this.$emit('update:step', 3)
    },
    // 关闭弹出层
    handleClose () {
      // 判断是否在活动创建时进入的该表单，是则关闭活动页面的弹框，否则关闭公告列表页面的弹框
      if (this.source === 'activity') {
        this.$emit('update:step', 0)
      } else {
        this.$emit('handleCloseEdit', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  text-align: right;
  margin-top: 20px;
}
</style>
