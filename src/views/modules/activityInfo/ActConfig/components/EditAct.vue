<template>
  <div>
    <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
      <el-form-item label="活动名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
        <el-input v-model="temp.name"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预热时间" prop="advanceTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.advanceTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.beginTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="beginTimeOptions" default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="endTimeOptions" default-time="23:59:59"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效时间" prop="expiredTime" :rules="[{required:true, message:'必须字段'}]">
            <el-date-picker v-model="temp.expiredTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="expiredTimeOptions" default-time="23:59:59"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="活动卷烟" prop="tobaId">
        <el-select v-model="temp.tobaId" style="width: 100%" multiple collapse-tags filterable placeholder="请选择卷烟,支持输入快速查询">
          <el-option v-for="(tobacco, index) in tobaList" :key="index" :label="tobacco | tobaType"
            :value="tobacco.id"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="参与对象" prop="target" :rules="[{required:true, message:'必须字段'}]">
            <el-radio-group v-model="temp.target">
              <el-radio label="01">零售户</el-radio>
              <el-radio label="02">消费者</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 地理位置 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="120px" prop="scope" :rules="[{required:true, message:'必须字段'}]">
            <span slot="label" >
              是否定位<i class="el-icon-info" title="是否收集用户的地理位置"></i>
            </span>
            <el-switch v-model="temp.location" :inactive-value="0" :active-value="1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="temp.location">
          <el-form-item label="定位类型" prop="districtType">
            <el-select v-model="temp.districtType" placeholder="">
              <el-option :value="1" label="零售户归属地"></el-option>
              <el-option :value="2" label="实时定位区域"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="活动区域" v-if="temp.location">
        <el-radio-group v-model="districtAll">
          <el-radio :label="true">不限制</el-radio>
          <el-radio :label="false">具体地市</el-radio>
        </el-radio-group>
        <!-- 地市选择框 -->
        <div v-if="!districtAll">
          <el-cascader v-model="temp.districtCode" :options="areaTree" clearable collapse-tags
            :props="{multiple: true, emitPath: false}" style="width: 100%;"></el-cascader>
        </div>
      </el-form-item>
      <el-form-item label="活动类型" prop="type" :rules="[{required:true, message:'必须字段'}]">
        <el-select v-model="temp.type" multiple collapse-tags style="width:100%">
          <el-option v-for="item in actTypeList" :key="item.id" :value="item.code" :label="`${item.name}(code编码值: ${item.code})`"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" :rules="[{required:true, message:'必须字段'}]">
            <el-select v-model="temp.status">
              <el-option label="草稿" :value="0"></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 暂时无用，注释 -->
        <el-col :span="12">
          <el-form-item label="排序码" prop="orderTag" >
            <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户授权" prop="scope" :rules="[{required:true, message:'必须字段'}]">
        <el-select v-model="temp.scope" style="width:100%">
          <el-option label="不弹出授权页面，仅获取用户openId" value="snsapi_base"></el-option>
          <el-option label="弹出授权页面，获取用户openId，昵称等信息" value="snsapi_userinfo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="temp.remarks"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="editStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi'

export default {
  name: 'EditAct',
  props: {
    // 编辑状态
    editStatus: {
      type: String,
      default: 'create'
    },
    // 原始数据，更新时传递
    formData: {
      type: Object
    }
  },
  data () {
    return {
      temp: null,
      // 创建活动，起始时间时间显示，大于预热时间
      beginTimeOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.temp.advanceTime).getTime() - 8.64e7
        }
      },
      // 创建活动，结束时间时间显示，大于起始时间
      endTimeOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.temp.beginTime).getTime() - 8.64e7
        }
      },
      // 创建活动，失效时间时间显示，大于结束时间
      expiredTimeOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.temp.endTime).getTime() - 8.64e7
        }
      },
      // 活动编辑时选中开展地区是否是全国
      districtAll: true
    }
  },
  computed: {
    // 活动类型
    actTypeList () {
      return this.$store.getters['baseData/actTypeList']
    },
    // 卷烟列表
    tobaList () {
      return this.$store.getters['baseData/tobaList']
    },
    // 省市
    areaTree () {
      return this.$store.getters['baseData/areaTreeData']
    }
  },
  created () {
    this.editStatus === 'create' ? this.initCreate() : this.initUpdate()
  },
  methods: {
    resetTemp () {
      this.temp = {
        id: '',
        name: '',
        advanceTime: '',
        beginTime: '',
        location: 0,
        endTime: '',
        expiredTime: '',
        scope: 'snsapi_userinfo',
        tobaId: [],
        districtCode: [],
        districtType: 2,
        type: [],
        target: '02',
        tagId: '',
        status: 1,
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
      this.districtAll = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新初始化
    initUpdate () {
      this.temp = Object.assign({}, this.formData)
      this.temp.tobaId = this.stringToJson(this.temp.tobaId)
      this.temp.districtCode = this.stringToJson(this.temp.districtCode)
      this.temp.type = this.stringToJson(this.temp.type)
      this.districtAll = this.temp.districtCode.indexOf('000000') >= 0
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增活动请求
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 活动区域转字符串
          let tempOption = Object.assign({}, this.temp)
          tempOption.districtCode = this.jsonToString(this.districtAll ? ['000000'] : this.temp.districtCode)
          tempOption.tobaId = this.jsonToString(this.temp.tobaId)
          tempOption.tagId = null
          tempOption.type = this.jsonToString(this.temp.type)
          // 添加活动code: USELESS
          if (!tempOption.code) {
            tempOption['code'] = 'USELESS'
          }
          ActConfigApi.save(tempOption).then(res => {
            this.$message.success('新增活动成功')
            this.closeDialog(true)
          })
        }
      })
    },
    // 更新活动请求
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempOption = Object.assign({}, this.temp)
          tempOption.districtCode = this.jsonToString(this.districtAll ? ['000000'] : this.temp.districtCode)
          tempOption.tobaId = this.jsonToString(this.temp.tobaId)
          tempOption.tagId = null
          tempOption.type = this.jsonToString(this.temp.type)
          ActConfigApi.update(tempOption).then(() => {
            this.$message.success('更新成功')
            this.closeDialog(true)
          })
        }
      })
    },
    // json数据转换
    stringToJson (val, def = []) {
      if (val && typeof (val) === 'string') {
        return JSON.parse(val)
      }
      return def
    },
    jsonToString (val, def = null) {
      if (val) {
        if (val instanceof Array && val.length === 0) {
          return def
        }
        return JSON.stringify(val)
      }
      return def
    }
  },
  watch: {
    editStatus (newVal) {
      newVal === 'create' ? this.initCreate() : this.initUpdate()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
