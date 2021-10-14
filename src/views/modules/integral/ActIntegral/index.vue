<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">积分管理</div>
      <template slot="operates">
        <date-picke v-model="exCheckDate3" @changeDate="changeDate($event)"></date-picke>
        <el-select size="small" v-model="homeSelect.status" placeholder="请选择" style="width: 120px">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="获取" :value="1"></el-option>
          <el-option label="扣减" :value="2"></el-option>
        </el-select>
        <el-input ref="customerInput" clearable class="home_name_seach" size="small" v-model="homeSelect.phone" placeholder="请输入会员手机号" style="width: 150px"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button plain type="primary" size="small" @click.native="handleOperation('give')">赠送</el-button>
        <el-button plain type="danger" size="small" @click.native="handleOperation('deduction')">扣除</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe ref="table" empty-text = "请输入手机号进行下一步操作">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column width="150" label="微信昵称" align="left">{{homeSelect.nickname}}
        </el-table-column>
        <el-table-column width="80" label="微信头像" align="center">
          <template>
            <img :src="homeSelect.img" alt="头像" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column width="150" label="会员手机号" align="center">{{homeSelect.phone}}</el-table-column>
        <el-table-column prop="point" width="80" label="积分" show-overflow-tooltip align="right">
          <template slot-scope="scope">
            <span :class="scope.row.point < 0 ? 'green' : 'red'">{{scope.row.point}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceId" width="150" label="来源ID" align="left"></el-table-column>
        <el-table-column prop="sourceName" width="250" label="来源说明" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sourceType" width="150" label="来源类型"></el-table-column>
        <el-table-column prop="effectTime" width="250" label="生效时间" align="center"></el-table-column>
        <el-table-column prop="remarks" width="250" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 弹框 -->
    <el-dialog :title="integralTypeTitle + '积分'" @close='closeDialog' :visible.sync="showOperation" :close-on-click-modal="false" width="600px">
      <div class="operation_top">
        <img :src="homeSelect.img" alt="头像">
        <div>
          会员昵称：{{dialog.name}}<br>
          手&nbsp;&nbsp;机&nbsp;&nbsp;号：{{dialog.phone}}<br>
          可用积分：<span style="color:#FF0000;font-size:22px;font-weight:600;"> {{dialog.num}} </span>
        </div>
      </div>
      <div class="operation_bottom">
      <el-form size="medium" label-width="100px" ref="dataForm" :model="dialogSearchKey">
          <el-form-item :label="integralTypeTitle + '积分'" prop="num" :rules="[{required:true, message:'必须字段'}]">
            <el-input-number v-model="dialogSearchKey.num" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item :label="resultTips" prop="status" :rules="[{required:true, message:'必须字段'}]">
            <el-input maxlength="10" v-model="dialogSearchKey.status"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" :rules="[{required:true, message:'必须字段'}]">
            <el-input show-word-limit maxlength="50" v-model="dialogSearchKey.remarks" resize="none" type="textarea" :rows="6" placeholder="例如：谁什么时间要求谁增加、减少积分的操作"></el-input>
          </el-form-item>
           <el-form-item align="right">
             <el-button size="medium" type="primary" class="operation_sure_btn" :disabled="notDown" @click="handleSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as IntegralApi from '@/api/integral/Integral.js'
import TableWrapper from '@/components/TableWrapper'
import DatePicke from './components/DataPicker.vue'

export default {
  name: 'ActIntegral',
  components: { TableWrapper, DatePicke },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 100
      },
      // ---数据
      dataList: [],
      // 查询条件
      homeSelect: {
        name: '',
        phone: '',
        status: 0,
        img: '',
        nickname: ''
      },
      // 日期时间
      exCheckDate: [],
      exCheckDate3: [],
      // 开始时间
      beginTime: '',
      // 结束时间
      endTime: '',
      // 弹框显示
      showOperation: false,
      // 弹框标题
      integralTypeTitle: '',
      // 弹框修改条件
      dialogSearchKey: {
        num: '',
        status: '',
        remarks: ''
      },
      // 弹框下拉框选择禁止状态
      // 赠送
      integralSelectGive: false,
      // 扣减
      integralSelectDeduction: false,
      // 弹框信息
      dialog: {
        // 弹框姓名
        name: '',
        // 弹框电话
        phone: '',
        // 弹框数量
        num: ''
      },
      notDown: false,
      // 选择原因
      resultTips: ''
    }
  },
  created () {
    this.$nextTick(function () {
      this.$refs.customerInput.$el.querySelector('input').focus()
    })
  },
  watch: {
    exCheckDate3 (newVal, oldVal) {
      this.beginTime = newVal[0]
      this.endTime = newVal[1]
    }
  },
  methods: {
    // 时间
    changeDate (val) {
      this.beginTime = val[0]
      this.endTime = val[1]
      this.exCheckDate3 = val
    },
    // ---查询列表
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    // 获取列表
    doSearch () {
      this.$nextTick(function () {
        this.$refs.customerInput.$el.querySelector('input').focus()
      })
      if (this.homeSelect.phone === '') {
        this.$message.warning('请填写手机号~')
        return
      }
      // 手机号正则
      const regPhone = /^1[3-9]\d{9}$/
      // 手机号
      if (!regPhone.test(this.homeSelect.phone)) {
        this.$message.warning('手机号格式不对，请检查！')
        return
      }

      IntegralApi.integraPhone(this.homeSelect.phone).then(res => {
        if (res.data === null) {
          this.$message.warning('没有查到该用户信息哦~')
        } else {
          this.homeSelect.name = res.data.id
          this.homeSelect.img = res.data.headImgUrl
          this.homeSelect.nickname = res.data.nickname
          this.dialog.name = res.data.nickname
          this.dialog.phone = res.data.phone
          this.dialog.phone = res.data.phone
          let options = {
            total: this.page.total,
            size: this.page.size,
            current: this.page.current,
            type: this.homeSelect.status === 0 ? '' : this.homeSelect.status,
            userId: this.homeSelect.name,
            breakTimeBegin: this.beginTime,
            breakTimeEnd: this.endTime
          }
          IntegralApi.integralRecord(options).then(res => {
            this.$objects.copyProperties(res.data, this.page)
            this.dataList = res.data.records
            IntegralApi.integralList(this.homeSelect.name).then(res => {
              this.dialog.num = res.data.balancePoint
            })
          })
        }
      })
    },
    // 点击增删按钮操作
    handleOperation (type) {
      if (this.homeSelect.phone === '') {
        this.$message.warning('请输入会员手机号~')
        return
      }
      // 弹框显示
      this.showOperation = true
      this.doSearch()
      // 类型判断
      if (type === 'give') {
        this.integralTypeTitle = '赠送'
        this.dialogSearchKey.status = '系统增加'
        this.integralSelectDeduction = true
        this.resultTips = '增加原因'
      } else {
        this.integralSelectGive = true
        this.dialogSearchKey.status = '系统扣减'
        this.resultTips = '扣减原因'
        this.integralTypeTitle = '扣除'
      }
    },
    // 增删积分提交
    handleSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.notDown = true
          let source = Date.now() + ''
          let options = {
            sourceId: source,
            sourceType: 'MANAGER',
            sourceName: this.dialogSearchKey.status,
            remarks: this.dialogSearchKey.remarks,
            point: this.dialogSearchKey.num * 1,
            userId: this.homeSelect.name
          }
          let saveOrUpdateApi = this.integralTypeTitle === '扣除' ? IntegralApi.integralReduce : IntegralApi.integrlAdd
          saveOrUpdateApi(options).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMsg)
            } else {
              this.$message.warning(res.data.errorMsg)
            }
            this.notDown = false
            this.showOperation = false
            this.dialog.num = res.data.balancePoint
            this.getdataList()
          })
        }
      })
    },
    getdataList () {
      let options = {
        total: 0,
        size: this.page.size,
        current: this.page.current,
        type: '',
        userId: this.homeSelect.name,
        breakTimeBegin: this.beginTime,
        breakTimeEnd: this.endTime
      }
      IntegralApi.integralRecord(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // --------------------表格格式化输出
    // 关闭弹窗
    closeDialog () {
      this.integralSelectGive = false
      this.integralSelectDeduction = false
      this.dialogSearchKey.status = ''
      this.dialogSearchKey.num = ''
      this.dialogSearchKey.remarks = ''
      this.resultTips = ''
    }
  }
}
</script>
<style lang="scss" scope>
.red{
  color: #FF6633;
}
.green{
  color: #008000;
}
.li{
  line-height: 1.6em;
  font-size: 1.15em;
}
.cascader_districtCode{
  width: 100%;
  max-height: 15vh;
  overflow-y: auto;
}
.Give_Deduction{
  display: flex;
}
.el-dialog__body{
  padding: 50px 74px 50px 50px;
}
// 弹框
.operation_top{
  width: 100%;
  height: 75px;
  margin-bottom: 20px;
  display: flex;
  font-size: 14px;
  padding-left: 24px;
  box-sizing: border-box;
  line-height: 25px;
  img{
    width: 75px;
    height: 100%;
    border-radius: 50%;
    margin-right: 20px;
  }
}
.operation_bottom{
  position: relative;
  width: 100%;
  height: 300px;
  font-size: 14px;
  line-height: 30px;
  white-space: nowrap;
  .operation_bottom_content{
    display: flex;
    margin-bottom: 10px;
    .operation_textarea{
      height: 70px;
    }
    span{
      margin-right: 10px;
    }
  }
}
</style>
