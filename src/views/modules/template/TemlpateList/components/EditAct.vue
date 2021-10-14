<template>
  <div>
    <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
      <el-form-item label="活动名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
        <el-input v-model="temp.name"></el-input>
      </el-form-item>
      <el-row>
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
      </el-row>
      <el-form-item label="活动类型" prop="type" :rules="[{required:true, message:'必须字段'}]">
        <el-select v-model="temp.type" multiple collapse-tags style="width:100%">
          <el-option v-for="item in actTypeList" :key="item.id" :value="item.code" :label="`${item.name}(code编码值: ${item.code})`"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="createData">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as ActTemplateApi from '@/api/template/ActTemplateApi'

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
    },
    templateId: {
      type: String
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
        location: 1,
        endTime: '',
        expiredTime: '',
        scope: 'snsapi_userinfo',
        tobaId: [],
        districtCode: [],
        districtType: 2,
        type: [],
        target: '02',
        tagId: '',
        status: 0,
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
          tempOption.templateId = this.templateId
          tempOption.advanceTime = tempOption.beginTime
          tempOption.expiredTime = tempOption.endTime
          // 添加活动code: USELESS
          if (!tempOption.code) {
            tempOption['code'] = 'USELESS'
          }
          ActTemplateApi.saveWithTemplate(tempOption).then(res => {
            this.$message.success('新增活动成功')
            this.closeDialog(true)
            const { href } = this.$router.resolve({
              name: 'templatePage',
              query: { templateId: this.templateId, actId: res.data }
            })
            window.open(href, '_blank')
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
