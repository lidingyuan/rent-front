<template>
  <div class="err-page">
    <div class="page">
      <div class="error-page" ref="errorBg" :style="errorBgStyle">
        <div class="bg-error"></div>
        <div class="tip-box">
          验证失败提示语
        </div>
        <div class="btn-redirect">关闭</div>
      </div>
    </div>
    <div class="form">
      <el-form label-width="160px" :model="formData" inline>
        <el-row>
          <el-form-item label="整体背景">
            <img-upload name="errorBg" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
        </el-row>
        <el-form-item style="margin-left: 160px;">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ImgUpload from '../component/ImgUpload'
export default {
  name: '',
  components: { ImgUpload },
  props: {
    tobaId: {
      type: String
    }
  },
  data () {
    return {
      //
      isFirst: true,
      cssUrl: '',
      fileData: {
        errorBg: null
      },
      formData: {
        errorBg: ''
      }
    }
  },
  computed: {
    errorBgStyle () {
      const style = {}
      if (this.fileData.errorBg) {
        style['background-image'] = `url(${this.fileData.errorBg.url})`
      }
      return style
    }
  },
  watch: {
    formData: {
      handler: function (val) {
        this.$emit('changeData', 'formData', val)
      },
      deep: true
    },
    fileData: {
      handler: function (val) {
        this.$emit('changeData', 'fileData', val)
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.loadLocalStyle()
    }, 1000)
  },
  methods: {
    //
    loadLocalStyle () {
      this.formData.errorBg = getComputedStyle(this.$refs.errorBg).backgroundImage.split('"')[1]
    },
    onRemove (file, name) {
      this.fileData[name] = null
      this.formData[name] = ''
    },
    onChange (file, name) {
      this.fileData[name] = file
    },
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang='scss' scoped>
.err-page{
  display: flex;
  .page{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .form{
    padding: 10px 0;
    width: 50%;
    background: #fff;
  }
}
.error-page {
  position: relative;
  width: 375px;
  height: 812px;
  padding-top: calc(20px / 100 * 812);
  overflow: hidden;
  /* 住:弹窗背景 */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-color: #fff;
}
.error-page .bg-error {
  position: relative;
  width: calc(54.5px / 100 * 375);
  height: calc(37.1px / 100 * 375);
  margin: auto;
  background: url('https://sdzy-scan.oss-cn-qingdao.aliyuncs.com/check_false.png');
  background-size: 100% 100%;
}
.error-page .tip-box {
  position: relative;
  margin-top: calc(8px / 100 * 375);
  font-size: calc(4.5px / 100 * 375);
  line-height: calc(8px / 100 * 375);
  letter-spacing: calc(1px / 100 * 375);
  text-align: center;
}
.error-page .btn-redirect {
  position: relative;
  margin: calc(20px / 100 * 812) auto 0;
  width: calc(85px / 100 * 375);
  padding-left: calc(5px / 100 * 375);
  background: #db2c2c;
  font-size: calc(5px / 100 * 375);
  color: white;
  line-height: calc(10px / 100 * 375);
  text-align: center;
  letter-spacing: calc(5px / 100 * 375);
}
</style>
