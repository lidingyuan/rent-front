<template>
  <table-wrapper :filterable="false" :excel="false" :expand="false" height="600px">
    <div slot="title">模板消息</div>
    <template slot="operates">
      <el-select size="small" v-model="temp.templateId" @change="handleTemplateChange" >
        <el-option v-for="item in dataList" :key="item.id" :value="item.id" :label="item.title"></el-option>
      </el-select>
      <el-button v-if="$auth('weixin:mp:template:sync')" size="small" type="primary" icon="el-icon-refresh" @click="handleSyncTemplate">同步模板</el-button>
    </template>

    <el-form label-width="100px" label-position="right" size="medium" :model="temp" ref="dataForm" style="width:90%;" status-icon >
      <el-form-item label="模板内容" prop="content" style="white-space:pre">
        <span>{{template['content']}}</span>
      </el-form-item>

      <el-form-item label="可用点位符">
        卷烟名称：<el-tag>#{#actScanBO.actTobacco.name}</el-tag> <br>
        条盒、小盒：<el-tag>#{#actScanBO.actTobacco.type=='02?'条盒':'小盒'}</el-tag> <br>
        用户奖励积分数量：<el-tag>#{#actTuikeBO.rewardsPoint}</el-tag> <br>
        邀请人奖励积分数量：<el-tag>#{#actTuikeBO.inviterPoint}</el-tag> <br>
        关注的人奖励积分数量：<el-tag>#{#actTuikeBO.followPoint}</el-tag> <br>
        当前日期时间：<el-tag>#{T(com.zoomlgd.common.util.DateUtil).nowString()}</el-tag> <br>
      </el-form-item>

      <el-form-item label="跳转链接" prop="url">
        <el-input v-model="temp.url" placeholder="用户点击模板消息跳转的链接地址" @change="handleInputChange"></el-input>
      </el-form-item>

      <el-form-item v-for="field in fields" :key="field" :label="field" :prop="'VALUE_' + field">
        <template>
          <el-col :span="24" >
            <el-input type="textarea" :rows="2" v-model="temp['VALUE_' + field]" placeholder="字段值" @change="handleInputChange"></el-input>
          </el-col>
          <el-col :span="5" :offset="1" v-if="false">
            <el-color-picker v-model="temp['COLOR_' + field]" @change="handleInputChange"></el-color-picker>
          </el-col>
        </template>
      </el-form-item>

    </el-form>
  </table-wrapper>
</template>

<script>
import * as TemplateApi from '@/api/wxmp/template.js'
import TableWrapper from '@/components/TableWrapper'

const REG_EXP = /(?<=\{\{)\s*\w*(?=\.DATA\s*}})/gi
const FIELD_KEY_VALUE = 'VALUE_'
const FIELD_KEY_COLOR = 'COLOR_'

export default {
  name: 'TemplateMessageBox',
  components: { TableWrapper },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值，paramConfig
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // ---数据
      dataList: [],
      template: {},
      temp: {
        templateId: '',
        url: '',
        content: {}
      }
    }
  },
  computed: {
    fields () {
      if (!this.template.content) {
        return []
      } else {
        return this.template.content.match(REG_EXP)
      }
    }
  },
  created () {
    this.handleListTemplate()
  },
  methods: {
    // ---模板群发
    handleListTemplate () {
      TemplateApi.list().then(res => {
        this.dataList = res.data
        if (!this.value.templateId) {
          this.template = this.dataList[0]
          this.temp = { templateId: this.template.id, url: '' }
        } else {
          this.template = this.dataList.find(item => item.id === this.value.templateId)
          this.temp = { templateId: this.value.templateId, url: this.value.url }
        }
        this.$nextTick(() => {
          if (this.value.content) {
            for (let field of this.fields) {
              if (this.value.content[field]) {
                this.$set(this.temp, FIELD_KEY_VALUE + field, this.value.content[field].value)
                this.$set(this.temp, FIELD_KEY_COLOR + field, this.value.content[field].color)
              }
            }
          }
        })
      })
    },
    // 同步模板
    handleSyncTemplate () {
      TemplateApi.sync().then(res => {
        this.handleListTemplate()
        this.$message.success('同步成功')
      })
    },
    handleTemplateChange () {
      this.template = this.dataList.find(item => item.id === this.temp.templateId)
      this.resetTemp()
    },
    resetTemp () {
      this.temp = { templateId: this.temp.templateId, url: '', content: {} }
      this.$emit('change', this.temp)
      for (let field of this.fields) {
        this.$set(this.temp, FIELD_KEY_VALUE + field, '')
        this.$set(this.temp, FIELD_KEY_COLOR + field, '')
      }
    },
    // --------------
    // 输入框值改变
    handleInputChange (value) {
      let val = {
        templateId: this.temp.templateId,
        url: this.temp.url,
        content: {}
      }
      for (let field of this.fields) {
        if (this.temp[FIELD_KEY_VALUE + field]) {
          val.content[field] = { value: this.temp[FIELD_KEY_VALUE + field], color: this.temp[FIELD_KEY_COLOR + field] }
        }
      }
      this.$emit('change', val)
    },
    // 表单验证
    async handleValidate () {
      let valid = await this.$refs['dataForm'].validate()
      return valid
    }
  }
}
</script>

<style>

</style>
