<template>
  <el-dialog
    title="样式修改"
    :visible.sync="formVisible"
    width="50%"
  >
    <div class="style-form">
      <x-form v-show="!cssEditForm" :key="key" ref="xForm" v-model="data" :config="config">
        <template #background>
          <img-upload ref="img-upload" v-model="data.background" @submitFun="submitFun"></img-upload>
        </template>
      </x-form>
      <el-form v-if="cssEditForm">
        <el-form-item label="css">
          <el-input type="textarea" v-model="cssCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="cssSubmit">完成</el-button>
          <el-button @click="cssEditForm = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import * as objectUtil from '@/utils/objects'
import ImgUpload from './StyleImgUpload'
export default {
  name: 'StyleForm',
  components: { ImgUpload },
  props: {
    formData: {
      type: Object
    },
    formConfig: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: 0,
      formVisible: false,
      data: {},
      config: {},
      funList: [],
      key: 0,
      defaultData: {},
      cssEditForm: false,
      cssCode: ''
    }
  },
  computed: {
  },
  watch: {
    formData: {
      handler () {
        this.data = { ...this.defaultData, ...this.formData }
        this.funList = []
      },
      immediate: true
    },
    formConfig: {
      handler (val) {
        // 使用key 强行重载组件，防止config不正确导致x-from保持卡死状态
        this.key++
        // 默认参数赋值
        this.defaultData = val.formData
        this.data = { ...this.defaultData, ...this.formData }
        this.config = this.initConfig({ ...val })
      },
      immediate: true
    },
    formVisible (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', val)
      }
    },
    value (val) {
      if (val !== this.formVisible) {
        this.formVisible = val
      }
    }
  },
  created () {
    this.formVisible = this.value
  },
  methods: {
    // 将带有this.开头的字符串替换为this下的数据或方法
    initConfig (config) {
      Object.keys(config).forEach(key => {
        const value = config[key]
        if (objectUtil.isObject(value) || objectUtil.isArray(value)) {
          this.initConfig(value)
        }
        // 将带有this.开头的字符串替换为当前this下的内容
        if (objectUtil.isString(value) && value.substr(0, 5) === 'this.') {
          if (this[value.substr(5)]) {
            config[key] = this[value.substr(5)]
          } else {
            console.info('不存在' + value)
          }
        }
      })
      return config
    },
    transformCss (data) {
      return Object.keys(data).reduce((accumulator, key) => {
        return accumulator + key + ': ' + data[key] + ';'
      }, '')
    },
    submitFun (fun) {
      this.funList.push(fun)
    },
    save () {
      const promiseList = this.funList.map(fun => {
        return fun()
      })
      Promise.all(promiseList).then(() => {
        const cssStr = this.transformCss(this.data)
        this.$emit('updateFormData', this.data)
        this.$emit('postMessage', cssStr, 'setStyle')
        this.formVisible = false
      })
    },
    cancle () {
      this.formVisible = false
    },
    cssEdit () {
      // css编辑器模式
      this.cssEditForm = true
    },
    cssSubmit () {
      this.$refs['img-upload'] && this.$refs['img-upload'].clear()
      const cssMap = this.stringToObject(this.cssCode)
      this.$emit('updateFormData', cssMap)
      this.$emit('postMessage', this.cssCode, 'setStyle')
      this.formVisible = false
    },
    stringToObject (str) {
      const map = {}
      str.split(';').forEach(cssItem => {
        const keyValue = cssItem.split(':')
        if (keyValue.length === 2) {
          map[keyValue[0].trim()] = keyValue[1].trim()
        }
      })
      return map
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
