<template>
  <el-row>
    <el-col :span="24">
      <el-form-item label="操作约束">
        <el-select v-model="typeId" placeholder="请选择约束" @change="handleChangeRule">
          <el-option v-for="item in ruleTypeList" :key="item.id" :value="item.id" :label="item.name" ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="约束配置" v-if="typeId !== ''">
        <component :is="componentName" :ref="componentName" :param="ruleParam" :phaseId="phaseId"
          :ruleParamExample="ruleParamExample" v-on:update:param="handleUpdate"></component>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import * as ActRuleSourceApi from '@/api/activityInfo/ActRuleSourceApi.js'
import Deciders from './components'

// const DEFAULT_COMPONENT_NAME = 'DefaultBlankDecider'
const DEFAULT_COMPONENT_NAME = 'DefaultDecider'

export default {
  name: 'RuleTypeSelect',
  components: { ...Deciders },
  props: {
    // 环节ID
    phaseId: {
      type: String,
      default: ''
    },
    // 环节类型，1常规normal，2抽奖lucky，3可见visible
    phaseType: {
      type: String,
      default: 'normal'
      // validator: function (value) {
      //   return ['normal', 'lucky', 'visible'].indexOf(value.toLowerCase()) !== -1
      // }
    },
    ruleValue: {
      type: Object,
      default: () => {
        return {
          typeId: '',
          ruleParam: ''
        }
      }
    }
  },
  data () {
    return {
      // 当前组件名
      componentName: '',
      // 约束类型列表
      ruleTypeList: [],
      // ---
      typeId: '',
      ruleParam: undefined,
      componentNameList: [],
      // 配置样例
      ruleParamExample: ''
    }
  },
  created () {
    this.componentNameList = Object.keys(Deciders)
    // 查询约束处理器列表
    this.getActRuleTypeList()
    this.typeId = this.ruleValue.typeId
    this.ruleParam = this.ruleValue.ruleParam ? JSON.parse(this.ruleValue.ruleParam) : undefined
  },
  methods: {
    // 获取约束处理器列表
    getActRuleTypeList () {
      ActRuleSourceApi.list().then(res => {
        let dataList = []
        if (this.phaseType.toLowerCase() === 'visible') { // 可见约束，不包含抽奖
          dataList = res.data.filter(item => {
            return item.name.indexOf('[抽奖]') !== 0 && item.position === 1
          })
        } else if (this.phaseType.toLowerCase() === 'lucky') { // 抽奖约束，不包含可见
          dataList = res.data.filter(item => {
            return item.name.indexOf('[可见]') !== 0
          })
        } else { // 通用约束，不包含抽奖和可见约束
          dataList = res.data.filter(item => {
            return item.name.indexOf('[可见]') !== 0 && item.name.indexOf('[抽奖]') !== 0
          })
        }
        this.ruleTypeList = dataList
      }).then(() => {
        this.handleChangeRule(this.typeId, true)
      })
    },
    // ---
    // 切换约束类型
    async handleChangeRule (value, init) {
      this.componentName = ''
      let ruleType = this.ruleTypeList.find(item => item.id === value)
      if (ruleType && ruleType.beanName) {
        this.ruleParamExample = ruleType.paramExample
        // 判断，是否有对应的表单
        const tempName = this.capitalize(ruleType.beanName)
        if (this.componentNameList.indexOf(tempName) >= 0) {
          this.componentName = tempName
        } else {
          this.componentName = DEFAULT_COMPONENT_NAME
        }
      }
      // 切换约束，清空配置的参数，解决不同约束的参数类型不一样，报错
      if (!init) this.ruleParam = null
      this.handleUpdate()
    },
    handleUpdate (value) {
      let temp = null
      if (value) {
        if (typeof value === 'string') {
          temp = value
        } else {
          temp = JSON.stringify(value)
        }
      }
      let ruleValue = { typeId: this.typeId, ruleParam: temp }
      this.$emit('update:ruleValue', ruleValue)
    },
    // ---私有方法
    capitalize (text) {
      if (!text || text.length < 1) {
        return text
      }
      return text[0].toUpperCase() + text.slice(1)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
