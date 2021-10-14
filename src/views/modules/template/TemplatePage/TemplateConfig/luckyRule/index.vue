<template>
  <div class="">
    <!-- 扫码抽奖活动规则 -->
    <el-form :model="scanRuleForm" size="medium" ref="dataForm" status-icon label-width="120px">
      <el-alert title='需要标红的文字设置样例：<span class="txt-red">确定</span>，"确定"二字将会在展示时标红'
        type="error" :closable="false"></el-alert>
      <el-form-item label="活动时间">
        <el-input v-model="scanRuleForm.time" placeholder="为空则使用活动的起止时间"></el-input>
      </el-form-item>
      <el-form-item label="活动卷烟">
        <el-input v-model="scanRuleForm.tobacco" placeholder="为空则使用卷烟管理中卷烟名称，如：泰山(望岳)"></el-input>
      </el-form-item>
      <el-form-item label="参与对象">
        <el-input v-model="scanRuleForm.people" placeholder="如：扫码消费者"></el-input>
      </el-form-item>
      <el-form-item label="参与方式">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(scanRuleForm.ways)">新增</el-button>
        <div v-for="(itemWay, index) in scanRuleForm.ways" :key="`way${index}`" style="margin-top: 3px;width:100%;">
          <el-input type="textarea" :rows="3" v-model="scanRuleForm.ways[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(scanRuleForm.ways, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="奖品设置">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(scanRuleForm.prizeList)">新增</el-button>
        <i class="el-icon-info">为空则使用抽奖配置的奖项名称</i>
        <div v-for="(prize, index) in scanRuleForm.prizeList" :key="`prize${index}`" style="margin-top: 3px;">
          <el-input  v-model="scanRuleForm.prizeList[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(scanRuleForm.prizeList, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="配送提示">
        <el-input type="textarea" v-model="scanRuleForm.prizeTip"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="baseForm.orderTag" placeholder=""></el-input-number>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="baseForm.remarks" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="submitData()">提交</el-button>
    </div>
  </div>
</template>

<script>
import * as functionUtil from '@/utils/functionUtil'
import * as PubCodeApi from '@/api/pubCode/PubCodeApi'
export default {
  name: '',
  data () {
    return {
      //
      actId: this.$route.query.actId,
      // 选中的表单类型
      selectedFormType: 'act:lucky:rule',
      scanRuleForm: {
        time: '',
        tobacco: '',
        people: '',
        ways: [],
        prizeList: [],
        prizeTip: ''
      },
      baseForm: {
        orderTag: '',
        remarks: ''
      }
    }
  },
  created () {
    //
    this.initFormData()
  },
  methods: {
    //
    initFormData () {
      PubCodeApi.listByActId(this.actId).then(res => {
        this.formData = res.data.find(item => item.code === this.selectedFormType) || {}
        if (this.formData.id) {
          this.scanRuleForm = JSON.parse(this.formData.content)
        } else {
          this.scanRuleForm = {
            time: '',
            tobacco: '',
            people: '泰山家园会员',
            ways: [
              '扫描活动规格产品二维码，首次验证成功后，可获取一次抽奖机会',
              '活动期间，每个活动规格产品二维码仅有一次抽奖机会，重复扫码验证不会获得额外抽奖机会。',
              '会员户泰山币直接到账，非会员户在当天24点前关注、注册会员成功后泰山币自动到账，否则视为放弃。'
            ],
            prizeList: [],
            prizeTip: '如有活动相关事宜，可致电0531-58709726'
          }
        }
      })
    },
    submitData () {
      functionUtil.throttle(this.saveData)
    },
    saveData () {
      let content = this.scanRuleForm
      let contentStr = ''
      Object.keys(content).map(key => {
        if (Object.prototype.toString.call(content[key]) === '[object Array]' && content[key].length > 0) {
          content[key] = content[key].filter(value => value && value.trim())
        }
      })
      contentStr = JSON.stringify(content)

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            // 编辑
            this.updateData(contentStr)
          } else {
            // 新增
            this.createData(contentStr)
          }
        } else {
          functionUtil.resetThrottle(this.saveData)
        }
      })
    },
    createData (content) {
      let options = {
        code: this.selectedFormType,
        actId: this.actId,
        orderTag: this.baseForm.orderTag,
        remarks: this.baseForm.remarks,
        content
      }
      // 自定义的类型
      options['name'] = '扫码抽奖活动规则'

      PubCodeApi.save(options).then(res => {
        this.$message.success('创建成功')
      }).finally(() => {
        this.$emit('refreshIframe')
        functionUtil.resetThrottle(this.saveData)
      })
    },
    updateData (content) {
      let options = { ...this.formData, content }
      PubCodeApi.update(options).then(res => {
        this.$message.success('更新成功')
      }).finally(() => {
        this.$emit('refreshIframe')
        functionUtil.resetThrottle(this.saveData)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.title {
  line-height: 45px;
  font-size: 1.2em;
  font-weight: bold;
}
.form-title {
  text-align:center;
  color:#67C23A;
  font-weight: bold;
  font-size: 1.2em;
  line-height: 40px;
}
.el-radio {
  line-height: 35px;
  margin-left: 2em;
  margin-right: 10px;
}
</style>
