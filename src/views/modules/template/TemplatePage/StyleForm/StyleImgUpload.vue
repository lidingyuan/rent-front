<template>
  <div>
    <el-upload ref="fileUpload" :action="'/'" :show-file-list="true" :class="{hideUpload:uploadedFlag}"
      :on-remove="handleRemoveFile" :on-change="handleAddFile"
      :auto-upload="false" :accept="'.png,.jpeg,.jpg,.gif'">
      <el-button size="small" type="primary">点击上传</el-button>
      <span style="font-size: .8em"> 5M，支持bmp/png/jpeg/jpg/gif格式</span>
    </el-upload>
    <div class="el-upload__tip" v-if="uploadTips">
      <span style="color: red; font-size:.9em;">{{uploadTips}}</span><br>
    </div>
  </div>
</template>

<script>
import * as ActMaterialApi from '@/api/material/ActMaterialApi.js'
export default {
  name: 'StyleImgUpload',
  data () {
    return {
      //
      uploadedFlag: false,
      uploadTips: '',
      temp: {
        actId: this.$route.query.actId,
        type: 'POSTER',
        srcName: '',
        file: null,
        orderTag: 1,
        remarks: ''
      }
    }
  },
  created () {
    //
  },
  methods: {
    //
    clear () {
      this.$refs.fileUpload.clearFiles()
    },
    handleRemoveFile (file, fileList) {
      this.uploadedFlag = false
      this.temp.file = null
    },
    handleAddFile (file, fileList) {
      this.uploadedFlag = true
      this.uploadTips = ''
      this.temp.file = null

      // 1. 校验文件大小，和音频长度
      if (file.size > 5 * 1024 * 1024) {
        this.uploadedFlag = false
        this.$refs.fileUpload.clearFiles()
        this.uploadTips = '文件太大，请重新上传'
      } else {
        this.uploadTips = ''
        this.temp.file = file.raw
        this.$emit('submitFun', this.createData)
      }
    },
    createData () {
      return new Promise((resolve) => {
        ActMaterialApi.save(this.temp).then(res => {
          this.$emit('input', 'url(' + res.data.url + ') no-repeat center center/100% 100%')
          resolve()
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
