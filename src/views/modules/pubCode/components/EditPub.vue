<template>
  <!-- 活动规则编辑表单,编辑的状态下不允许更换表单类型 -->
  <div class="page">
    <div v-if="!showForm">
      <div class="title">请选择您活动规则配置类型</div>
      <el-radio-group v-model="selectedFormType">
        <el-radio v-for="item in formTypeList" :key="item.code" :label="item.code">{{item.name}}</el-radio>
        <br>
        <el-radio label="custom:text">自定义文本</el-radio>
        <br>
        <!-- <el-radio label="custom:form">自定表单</el-radio> -->
        <!-- <br> -->
      </el-radio-group>
      <div style="text-align:center">
        <el-button :disabled="!selectedFormType" type="primary" @click="handleCheck()">我选好了</el-button>
      </div>
    </div>

    <!-- 表单名称 -->
    <div v-if="showForm" class="form-title">{{formName}}</div>

    <!-- 表单 -->
    <!-- 扫码抽奖活动规则 -->
    <el-form v-if="showForm && selectedFormType==='act:lucky:rule'" :model="scanRuleForm" size="medium" ref="dataForm" status-icon label-width="120px">
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
    </el-form>

    <!-- 扫码抽奖地址提示 -->
    <el-form v-if="showForm && selectedFormType==='act:lucky:address'" :model="scanAddressForm" size="medium" ref="dataForm" status-icon label-width="120px">
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
      </el-form>

    <!-- 集盒活动规则 -->
    <el-form v-if="showForm && selectedFormType==='act:boxcollect:rule'" :model="collectBoxForm" size="medium" ref="dataForm" status-icon label-width="120px">
       <div v-if="isOldRule">
        <el-alert :closable="false">旧格式的活动规则，请尽快使用下面表单形式重新设置活动规则</el-alert>
        <el-input type="textarea" :rows="8" v-model="oldContent" readonly></el-input>
      </div>
      <el-form-item label="活动时间" :rules="[{required:true, message:'必须字段'}]">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(collectBoxForm.time)">新增</el-button>
        <div v-for="(item, index) in collectBoxForm.time" :key="`time${index}`" style="margin-top: 3px;width:100%;">
          <el-input type="textarea" :rows="2" v-model="collectBoxForm.time[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(collectBoxForm.time, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="活动规格" :rules="[{required:true, message:'必须字段'}]">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(collectBoxForm.tobacco)">新增</el-button>
        <div v-for="(item, index) in collectBoxForm.tobacco" :key="`tobacco${index}`" style="margin-top: 3px;width:100%;">
          <el-input type="textarea" :rows="2" v-model="collectBoxForm.tobacco[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(collectBoxForm.tobacco, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="活动对象" :rules="[{required:true, message:'必须字段'}]">
        <el-input type="textarea" v-model="collectBoxForm.people"></el-input>
      </el-form-item>
      <el-form-item label="活动地市" :rules="[{required:true, message:'必须字段'}]">
        <el-input type="textarea" v-model="collectBoxForm.area"></el-input>
      </el-form-item>
      <el-form-item label="活动规则">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(collectBoxForm.explain)">新增</el-button>
        <div v-for="(item, index) in collectBoxForm.explain" :key="`explain${index}`" style="margin-top: 3px;width:100%;">
          <el-input type="textarea" :rows="4" v-model="collectBoxForm.explain[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(collectBoxForm.explain, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="参与方式">
        <el-button type="success" size="mini" @click.prevent="handleAddItemContent(collectBoxForm.ways)">新增</el-button>
        <div v-for="(itemWay, index) in collectBoxForm.ways" :key="`way${index}`" style="margin-top: 3px;width:100%;">
          <el-input type="textarea" :rows="4" v-model="collectBoxForm.ways[index]" style="width: 85%;"></el-input>
          <el-button type="danger" size="mini" @click.prevent="handleDelItemContent(collectBoxForm.ways, index)" style="margin-left:10px;">删除</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 自定义表单·暂不支持 -->
    <!-- <div v-if="showForm && selectedFormType==='custom:form'">
      <el-button type="success" v-show="showAddFormItem" @click="handleAddItemContent()">新增表单项</el-button>
      <el-form v-if="selectedFormType==='act:boxcollect:rule'" :model="customForm" size="medium" ref="dataForm" status-icon label-width="120px">
        <el-form-item v-for="(formItem, index) in customForm.dynamic" :key="formItem.id" :label="`自定义表单项${index+1}`">
          <el-input v-model="formItem.key" placeholder="key值" style="width:200px;"></el-input>
          <el-button type="danger" size="small" @click.prevent="handleDelItemContent(formItem)" style="margin-left:10px;">删除</el-button>
          <br>
          <el-input v-model="formItem.content" placeholder="请输入表单项内容" style="margin-top:3px;width:100%;"></el-input>
        </el-form-item>
      </el-form>
    </div> -->

    <!-- 自定义文本 -->
    <div v-if="showForm && selectedFormType==='custom:text'">
      <el-form :model="textForm" size="medium" ref="dataForm" status-icon label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码code" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="textForm.code" :readonly="!!formData.id" placeholder="编码code，如：act:boxcollect:rule"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码名称" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="textForm.name" :readonly="!!formData.id" placeholder="信息名称，如：扫码抽奖活动规则"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置内容域" :rules="[{required:true, message:'必须字段'}]">
          <el-input type="textarea" v-model="textForm.content" :rows="10" placeholder="请输入内容..."></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表单通用项 备注，排序 -->
    <el-form v-if="showForm" size="medium" status-icon label-width="120px">
      <el-form-item label="排序">
        <el-input-number v-model="baseForm.orderTag" placeholder=""></el-input-number>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="baseForm.remarks" placeholder=""></el-input>
      </el-form-item>
    </el-form>

    <!-- 操作 -->
    <div v-show="showForm" style="text-align:right;">
      <el-button type="primary" @click="submitData()">提交</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script>
import * as PubCodeApi from '@/api/pubCode/PubCodeApi'
import { copyProperties } from '@/utils/objects'

export default {
  name: 'EditPub',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => { return { id: '' } }
    }
  },
  data () {
    return {
      // 选中的表单类型
      selectedFormType: '',
      // 表单类型支持列表
      formTypeList: require('../components/constant.json')['type'],
      // 表单公共填写部分
      baseForm: {
        orderTag: '',
        remarks: ''
      },
      // 显示表单
      showForm: false,
      // 表单名称，和formTypeList中的name一致
      formName: '',
      // 扫码抽奖活动内容,为content内容
      scanRuleForm: {
        time: '',
        tobacco: '',
        people: '',
        ways: [],
        prizeList: [],
        prizeTip: ''
      },
      // 扫码抽奖地址提示表单内容
      scanAddressForm: {
        goods: '',
        addressNoVip: '',
        addressVip: '',
        addressToast: ''
      },
      // 集盒活动规则表单内容
      collectBoxForm: {
        time: [],
        tobacco: [],
        people: '',
        area: '',
        explain: [],
        ways: []
      },
      // 是否为旧活动规则，和现有表单形式不符
      isOldRule: false,
      // 旧的活动规则内容
      oldContent: '',
      // 自定义文本
      textForm: {
        code: '',
        name: '',
        content: ''
      },
      // 自定义表单
      customForm: {}
    }
  },
  created () {
    this.init()
  },
  watch: {
    // 仅在新增或者初始化状态下会有此变更
    selectedFormType (newVal) {
      let formObj = this.formTypeList.find(item => item.code === this.selectedFormType)
      if (formObj) {
        this.formName = formObj.name
      } else {
        this.formName = '自定义类型规则'
      }
    }
  },
  methods: {
    init () {
      // 新增，初始化各个表单数据
      if (!this.formData.id) {
      // 扫码抽奖活动规则
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
        // 扫码抽奖地址
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
        this.collectBoxForm = {
          time: [],
          tobacco: [],
          people: '',
          area: '',
          explain: [],
          ways: [
            '泰山家园会员朋友，在活动地市（XX）通过“扫描二维码、输入验证码”参与活动，每验证成功一次，' +
          '视为集盒一个。已注册为“泰山家园”会员的零售户、消费者，' +
          '系统会自动记录扫码次数，每次验证后提示该规格已集盒数量，并推送消息告知。',
            '会员朋友也可在“个人/商户中心-集盒有奖”查看已集盒数量。'
          ]
        }
        this.showForm = false
      }
      // 编辑
      // 扫码抽奖活动规则
      if (this.formData.id) {
        copyProperties(this.formData, this.baseForm)
        if (this.formData.code === 'act:lucky:rule') {
          this.scanRuleForm = JSON.parse(this.formData.content)
          this.selectedFormType = 'act:lucky:rule'
        } else if (this.formData.code === 'act:lucky:address') {
          this.scanAddressForm = JSON.parse(this.formData.content)
          this.selectedFormType = 'act:lucky:address'
        } else if (this.formData.code === 'act:boxcollect:rule') {
          if (this.formData.content.includes('{')) {
            let ruleInfoContent = JSON.parse(this.formData.content)
            // 老旧非表单形式的
            if (ruleInfoContent.ruleInfo) {
              this.isOldRule = true
              this.oldContent = ruleInfoContent.ruleInfo
            } else {
              this.collectBoxForm = JSON.parse(this.formData.content)
            }
          }
          this.selectedFormType = 'act:boxcollect:rule'
        } else {
          this.textForm = this.formData
          this.selectedFormType = 'custom:text'
        }
        this.showForm = true
      }
    },
    handleCheck () {
      if (!this.selectedFormType) {
        this.$message.info('您当前未选择任何类型')
      }
      this.showForm = true
    },
    // ---新增数据
    submitData () {
      if (this.fUpdateing) return

      let content = {}
      let contentStr = ''
      let isForm = false
      if (this.selectedFormType === 'act:lucky:rule') {
        content = this.scanRuleForm
        isForm = true
      } else if (this.selectedFormType === 'act:lucky:address') {
        content = this.scanAddressForm
        isForm = true
      } else if (this.selectedFormType === 'act:boxcollect:rule') {
        content = this.collectBoxForm
        isForm = true
      } else {
        contentStr = this.textForm.content
        isForm = false
      }
      // 处理表单项为数组时，删除为空的项
      if (isForm) {
        Object.keys(content).map(key => {
          if (Object.prototype.toString.call(content[key]) === '[object Array]' && content[key].length > 0) {
            content[key] = content[key].filter(value => value && value.trim())
          }
        })
        contentStr = JSON.stringify(content)
      }

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.fUpdateing = true
          if (this.formData.id) {
            // 编辑
            this.updateData(contentStr)
          } else {
            // 新增
            this.createData(contentStr)
          }
        } else {
          this.fUpdateing = false
        }
      })
    },
    createData (content) {
      let options = {
        code: this.selectedFormType,
        actId: this.formData.actId,
        orderTag: this.baseForm.orderTag,
        remarks: this.baseForm.remarks,
        content
      }
      // 自定义的类型
      let formObj = this.formTypeList.find(item => item.code === this.selectedFormType)
      if (formObj) {
        options['name'] = formObj.name
      } else {
        options['name'] = this.textForm.name
        options['code'] = this.textForm.code
      }

      PubCodeApi.save(options).then(res => {
        this.$message.success('创建成功')
        this.$emit('closeDialog', true)
      }).finally(() => {
        this.fUpdateing = false
      })
    },
    updateData (content) {
      let options = { ...this.formData, content, ...this.baseForm }
      PubCodeApi.update(options).then(res => {
        this.$message.success('更新成功')
        this.$emit('closeDialog', true)
      }).finally(() => {
        this.fUpdateing = false
      })
    },
    // 关闭当前弹窗
    closeDialog (flag = false) {
      this.$emit('closeDialog', flag)
    },
    // 新增数组一条空数据
    handleAddItemContent (arr) {
      arr.push('')
    },
    // 删除表单项
    handleDelItemContent (arr, index) {
      arr.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.page {
  max-height: 70vh;
  overflow-y: auto;
}
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
