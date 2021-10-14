<template>
  <div class="act-tobacco-skin">
    <link rel='stylesheet' :href="cssUrl" />
    <div class="page-select">
      <el-select v-model="page" placeholder="请选择">
        <el-option
          v-for="item in pageList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <scan-page :tobaId="tobaId" v-show="page === 'ScanPage'" @changeData="changeData" @submit="submit"></scan-page>
    <result-page :tobaId="tobaId" v-show="page === 'ResultPage'" @changeData="changeData" @submit="submit"></result-page>
    <error-page :tobaId="tobaId" v-show="page === 'ErrorPage'" @changeData="changeData" @submit="submit"></error-page>
  </div>
</template>

<script>
import ScanPage from './page/ScanPage'
import ResultPage from './page/ResultPage'
import ErrorPage from './page/ErrorPage'
import * as ossApi from '@/api/oss/OssSignature'
import createCss from './component/createCss'
import axios from 'axios'
export default {
  name: '',
  components: { ScanPage, ResultPage, ErrorPage },
  data () {
    return {
      cssfileName: 'scan-style.css',
      page: 'ScanPage',
      pageList: [
        {
          label: '扫码页面',
          value: 'ScanPage'
        },
        {
          label: '验真页面',
          value: 'ResultPage'
        },
        {
          label: '验证失败页面',
          value: 'ErrorPage'
        }
      ],
      tobaId: '',
      cssUrl: '',
      fileData: {},
      formData: {}
    }
  },
  computed: {
  },
  created () {
    this.tobaId = this.$route.query.sourceId
    this.cssUrl = this.$route.query.cssUrl
    if (!this.tobaId) {
      this.$message('卷烟信息丢失，请重新进入此页面')
    }
  },
  methods: {
    //
    changeData (name, data) {
      this[name] = { ...this[name], ...data }
    },
    submit () {
      const timestamp = Date.now()
      const promiseList = []
      Object.keys(this.fileData).forEach(fileName => {
        if (this.fileData[fileName]) {
          const nameArr = this.fileData[fileName].name.split('.')
          this.fileData[fileName].name = fileName + '.' + timestamp + '.' + nameArr[nameArr.length - 1]
          promiseList.push(
            this.uploadFile(this.fileData[fileName].raw, this.tobaId).then(url => {
              this.formData[fileName] = url
            })
          )
        }
      })
      Promise.all(promiseList).then(() => {
        const cssFile = createCss(this.formData, this.cssfileName)
        this.uploadFile(cssFile, this.tobaId).then(res => {
          this.$message({ message: '提交成功，皮肤以更改', type: 'success' })
        })
      })
    },
    async uploadFile (file, tobaId) {
      const { data } = await ossApi.signature()
      const formData = new FormData()
      // 目前用于区分测试和正式的oss目录为卷烟cssurl中data.dir后第一级目录名
      const dir = this.cssUrl.split(data.dir).reverse()[0].split('/')[0]
      const key = `${data.dir}${dir}/${tobaId}/${file.name}`
      const host = data.host.replace('http://', 'https://')
      formData.append('key', key)
      formData.append('OSSAccessKeyId', data.accessid)
      formData.append('policy', data.policy)
      formData.append('callback', data.callback)
      formData.append('success_action_status', '200')
      formData.append('signature', data.signature)
      formData.append('file', file)
      const { status } = await axios({
        url: host,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30 * 1000,
        method: 'POST',
        data: formData
      })
      if (status === 200) {
        return Promise.resolve(host + '/' + key)
      } else {
        return Promise.reject(new Error('上传失败'))
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.act-tobacco-skin{
  .page-select{
    position: absolute;
    z-index: 1;
  }
}
</style>
