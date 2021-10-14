<template>
  <div class="template-page">
    <div class="head">
      <div class="name">活动开发</div>
      <div>
        <el-button type="primary" size="medium" @click="saveStyle">保存</el-button>
        <el-popover
          placement="bottom"
          width="250"
          v-model="visible">
          <img id="actQrcode" class="qrcode-img" style="height: 200px; width: 200px;" alt="活动链接加载失败" />
          <el-button slot="reference" type="primary" size="medium" style="margin:0 20px;" @click="preview">预览</el-button>
        </el-popover>
        <el-button type="primary" size="medium" @click="publish">发布</el-button>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <page-list @activeUrlChange="activeUrlChange"></page-list>
      </div>
      <div class="center">
        <iframe id="iframe" ref="iframe" :src="appendIframeUrl" height="640" width="360"></iframe>
      </div>
      <div class="right">
        <template-config @setPhaseMap="setPhaseMap" @setEntryUrl="setEntryUrl" @refreshIframe="refreshIframe"></template-config>
      </div>
    </div>
    <!-- 弹窗 -->
    <css-style-form
      v-model="formVisible"
      :formData="formData"
      :formConfig="formConfig"
      @postMessage="postMessage"
      @updateFormData="updateFormData"
    ></css-style-form>
  </div>
</template>

<script>
import QRCdoe from 'qrcode'
import * as ActTemplateApi from '@/api/template/ActTemplateApi'
import * as ActTemplateComponentApi from '@/api/template/ActTemplateComponentApi.js'
import * as ActTemplateConfigApi from '@/api/template/ActTemplateConfigApi'

import PageList from './PageList'
import CssStyleForm from './StyleForm'
import TemplateConfig from './TemplateConfig'
export default {
  name: '',
  components: { PageList, CssStyleForm, TemplateConfig },
  props: {},
  data () {
    return {
      templateId: this.$route.query.templateId,
      actId: this.$route.query.actId,
      phaseTypeMap: null,
      iframeUrl: '',
      entryUrl: '',
      formVisible: false,
      templateNodeId: '',
      // 总样式信息
      templateFormData: {},
      componentMap: {},
      visible: false
    }
  },
  computed: {
    formData () {
      return this.templateFormData[this.templateNodeId] || {}
    },
    formConfig () {
      return this.componentMap[this.templateNodeId] || { item: [] }
    },
    appendIframeUrl () {
      if (this.iframeUrl && this.phaseTypeMap) {
        let iframeUrl = this.iframeUrl
        iframeUrl = iframeUrl + '?mode=setup&actId=' + this.$route.query.actId
        Object.keys(this.phaseTypeMap).forEach(key => {
          if (this.iframeUrl.includes('phaseType=' + key)) {
            iframeUrl = iframeUrl + '&phaseId=' + this.phaseTypeMap[key]
          }
        })
        return iframeUrl
      }
      return ''
    }
  },
  created () {
    this.getFormData()
    window.addEventListener('message', this.receiveMessage, false)
  },
  mounted () {
  },
  methods: {
    getFormData () {
      // 暂时去除本地缓存
      // const json = localStorage.getItem('formData' + ':' + this.actId + ':' + this.templateId)
      // this.templateFormData = JSON.parse(json) || {}
      // 后台获取数据
      ActTemplateConfigApi.detail(this.actId).then(res => {
        this.templateFormData = JSON.parse(res.data.style) || {}
      })
      ActTemplateComponentApi.listByTemplateId(this.templateId).then(res => {
        const map = {}
        res.data.forEach(comp => {
          try {
            map[comp.name] = JSON.parse(comp.formInfo) || {}
          } catch (error) {
            map[comp.name] = {}
          }
        })
        this.componentMap = map
      })
    },
    updateFormData (data) {
      this.templateFormData = {
        ...this.templateFormData,
        [this.templateNodeId]: {
          ...data
        }
      }
      // localStorage.setItem('formData' + ':' + this.actId + ':' + this.templateId, JSON.stringify(this.templateFormData))
    },
    publish () {
      ActTemplateApi.publish(this.actId).then(res => {
        this.$message('发布成功')
      })
    },
    receiveMessage (e) {
      // 校验源
      if (e.origin.includes(window.location.host)) {
        const { id, type, data } = e.data
        this.templateNodeId = id
        // 点击事件
        if (type === 'click') {
          this.formVisible = true
        }
        // 拖拽事件
        if (type === 'move') {
          this.updateFormData(data)
        }
      }
    },
    postMessage (data, type) {
      this.$refs.iframe.contentWindow.postMessage({
        id: this.templateNodeId,
        type,
        data
      }, process.env.VUE_APP_TEMPLATE_ORIGIN)
    },
    activeUrlChange (url) {
      this.iframeUrl = url
    },
    saveStyle () {
      // 保存样式
      ActTemplateConfigApi.update({
        id: this.actId,
        templateId: this.templateId,
        style: JSON.stringify(this.templateFormData)
      }).then(res => {
        this.$message('保存成功')
      })
    },
    preview () {
      const opts = {
        errorCorrectionLevel: 'M',
        margin: 1,
        type: 'image/jpeg'
      }
      let entryUrl = this.entryUrl + '&mode=preview&actId=' + this.$route.query.actId
      entryUrl = encodeURIComponent(entryUrl)
      const url = window.location.protocol + '//' + window.location.hostname + '/service/weixin/mp/access/anyRedirect?goto=' + entryUrl
      console.log('预览url:' + url)

      QRCdoe.toDataURL(url, opts, (err, url) => {
        if (err) throw err
        let img = document.getElementById('actQrcode')
        img.src = url
      })
    },
    setPhaseMap (phaseTypeMap) {
      this.phaseTypeMap = phaseTypeMap
    },
    setEntryUrl (entryUrl) {
      this.entryUrl = entryUrl
    },
    refreshIframe () {
      const iframeUrl = this.iframeUrl
      this.iframeUrl = ''
      setTimeout(() => {
        this.iframeUrl = iframeUrl
      }, 500)
    }
  },
  beforeDestroy () {
    window.removeEventListener('message', this.receiveMessage)
  }
}
</script>

<style lang='scss' scoped>
.template-page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
.head{
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  .name{
    font-size: 24px;
    font-weight: bold;
  }
}
.body{
  height: 0;
  flex-grow: 1;
  display: flex;
  .left{
    flex-shrink: 0;
    width: 200px;
    .divider{
      width: 40px;
      height: 1px;
      margin: 0 auto;
      background: #ddd;
    }
  }
  .center{
    width: 480px;
    flex-grow: 1;
    flex-shrink: 0;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right{
    flex-shrink: 1;
    width: 1000px;
  }
}
#iframe {
  border: none;
  background: #fff;
}
</style>
