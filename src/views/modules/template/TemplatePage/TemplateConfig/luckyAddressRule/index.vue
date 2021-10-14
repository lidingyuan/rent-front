<template>
  <div class="">
    <!-- 扫码抽奖地址提示 -->
    <el-form :model="scanAddressForm" size="medium" ref="dataForm" status-icon label-width="120px">
      <el-alert title='需要标红的文字设置样例：<span class="txt-red">确定</span>，"确定"二字将会在展示时标红'
        type="error" :closable="false"></el-alert>
      <el-form-item label="奖品提示">
          <el-input type="textarea" :rows="4" v-model="scanAddressForm.goods" placeholder="请输入中奖弹窗上奖品提示语"></el-input>
      </el-form-item>
      <el-form-item label="二维码提示">
        <el-input v-model="scanAddressForm.qrcode" placeholder="请输入中奖弹窗上二维码提示语"></el-input>
      </el-form-item>
      <el-form-item label="会员地址提示">
        <el-input type="textarea" :rows="4" v-model="scanAddressForm.addressVip"></el-input>
      </el-form-item>
      <el-form-item label="非会员地址提示">
        <el-input type="textarea" :rows="5" v-model="scanAddressForm.addressNoVip"></el-input>
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
      selectedFormType: 'act:lucky:address',
      // 扫码抽奖地址提示表单内容
      scanAddressForm: {
        goods: '',
        addressNoVip: '',
        addressVip: '',
        addressToast: ''
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
          this.scanAddressForm = JSON.parse(this.formData.content)
        } else {
          this.scanAddressForm = {
            goods: '请务必在中奖当天24点前兑换礼品，并完成提交收货地址<span class="txt-red">确认</span>，' +
          '否则按活动规则视为自动放弃本次领奖。' +
          '您可在“泰山家园-个人/商户中心-活动订单”查看您中奖礼品的物流信息。',
            qrcode: '长按识别或扫描上方二维码关注泰山家园',
            addressNoVip: '您非泰山家园会员，请务必在中奖当天24点前注册成为泰山家园会员,并在中奖当天24点前重新扫中奖烟盒上的二维码完成礼品兑换与地址提交<span class="txt-red">确认</span>，' +
          '方便您尽快收到您的中奖礼品。未在中奖当天24点前完成提交收货地址<span class="txt-red">确认</span>的，' +
          '按活动规则视为自动放弃本次领奖。',
            addressVip: '请务必在中奖当天24点前兑换礼品，并完成提交收货地址<span class="txt-red">确认</span>，否则按活动规则视为自动放弃本次领奖。' +
          '您可在“泰山家园-个人/商户中心-活动订单”查看您中奖礼品的物流信息。',
            addressToast: '您的中奖礼品正在发货处理中，我们将为您提供免费邮寄，请耐心等待，感谢您的参与！如有活动相关事宜咨询，可致电0531-58709726；' +
          '如有物流配送相关事宜咨询，可致电400-851-6516。'
          }
        }
      })
    },
    submitData () {
      functionUtil.throttle(this.saveData)
    },
    saveData () {
      let content = this.scanAddressForm
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
      options['name'] = '扫码抽奖地址填写提示'

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
