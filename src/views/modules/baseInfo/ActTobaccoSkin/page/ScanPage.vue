<template>
  <div class="scan-page">
    <div class="page">
      <div class="scan-container active" ref="proBanner" :style="proBannerStyle">
        <div class="verify-cover">
          <div class="verify-content active" ref="toastBg" :style="toastBgStyle">
            <h2 class="input-label">输入4位验证码：</h2>
            <div class="input-box">
              <div class="input-num" v-for="(num, index) in ['','','','']" :key="index" >
                <span>{{num}}</span>
              </div>
            </div>
            <h3 class="agreement">
              <div class="agreement-uncheck"><div class="agreement-check"></div></div>
              <span class="agreement-span">我已阅读并同意防伪验证须知</span>
            </h3>
            <div class="input-tips" ref="tip" :style="tipStyle">
              <div class="input-tips-title">防伪验证须知</div>
              <div class="input-tips-content">
                <p>1.您可以在产品包装内侧找到4位数字验证码。</p>
                <p>2.点击上方输入框，依次输入4位数字验证码。</p>
                <p>3.提交后平台将为您跳转验证结果页面。</p>
              </div>
            </div>
            <div class="submit-btn" ref="btnBg" :style="btnBgStyle">提交</div>
          </div>
        </div>
      </div>
    </div>
    <div class="form">
      <el-form label-width="160px" :model="formData" inline>
        <el-row>
          <el-form-item label="背景图片">
            <img-upload name="proBanner" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="弹窗图片">
            <img-upload name="toastBg" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="提示字体颜色">
            <el-color-picker v-model="formData.tipColor"></el-color-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="按钮图片">
            <img-upload name="btnBg" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
          <el-form-item label="按钮字体颜色">
            <el-color-picker v-model="formData.btnColor"></el-color-picker>
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
      fileData: {
        proBanner: null,
        toastBg: null,
        btnBg: null
      },
      formData: {
        proBanner: '',
        toastBg: '',
        tipColor: '',
        btnBg: '',
        btnColor: ''
      }
    }
  },
  computed: {
    proBannerStyle () {
      if (this.fileData.proBanner) {
        return { 'background-image': `url(${this.fileData.proBanner.url})` }
      }
      return {}
    },
    toastBgStyle () {
      if (this.fileData.toastBg) {
        return { 'background-image': `url(${this.fileData.toastBg.url})` }
      }
      return {}
    },
    btnBgStyle () {
      const style = {}
      if (this.fileData.btnBg) {
        style['background-image'] = `url(${this.fileData.btnBg.url})`
      }
      if (this.formData.btnColor) {
        style.color = this.formData.btnColor
      }
      return style
    },
    tipStyle () {
      const style = {}
      if (this.formData.tipColor) {
        style.color = this.formData.tipColor
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
      this.formData.proBanner = getComputedStyle(this.$refs.proBanner).backgroundImage.split('"')[1]
      this.formData.toastBg = getComputedStyle(this.$refs.toastBg).backgroundImage.split('"')[1]
      this.formData.btnBg = getComputedStyle(this.$refs.btnBg).backgroundImage.split('"')[1]
      this.formData.btnColor = getComputedStyle(this.$refs.btnBg).color
      this.formData.tipColor = getComputedStyle(this.$refs.tip).color
    },
    onRemove (file, name) {
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
.scan-page{
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
.scan-container {
  box-sizing: border-box;
  position: relative;
  width: 375px;
  height: 812px;
  *{
    margin: 0;
    padding: 0;
  }
}
.scan-container .verify-cover {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.scan-container .verify-cover .verify-content {
  position: relative;
  margin: calc(20px / 100 * 812) auto 0;
  padding-top: calc(12px / 100 * 375);
  width: calc(85px / 100 * 375);
  height: calc(108px / 100 * 375);
  font-size: calc(3.7px / 100 * 375);
  text-align: left;
  transition: all .6s;
  letter-spacing: 1px;
}
.scan-container .verify-cover .verify-content.active {
  transform: translateY(calc(-10px / 100 * 812));
}
.scan-container .verify-cover .verify-content .input-label {
  padding-left: calc(10.5px / 100 * 375);
  font-size: calc(3.5px / 100 * 375);
  font-weight: bold;
  text-align: left;
  line-height: 1.8rem;
  color: #250a05;
}
.scan-container .verify-cover .verify-content .input-box {
  margin: auto;
  padding: calc(1.3px / 100 * 375);
  width: 77%;
  height: calc(12px / 100 * 375);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.scan-container .verify-cover .verify-content .input-box .input-num {
  display: inline-block;
  width: 2.5rem;
  height: 2.2rem;
  margin: 0 0.2rem;
  font-size: 1.5rem;
  line-height: 2rem;
  text-align: center;
  vertical-align: top;
  border-radius: 0.4rem;
  border: calc(0.5px / 100 * 375) dashed rgb(0, 0, 0);
}
.scan-container .verify-cover .verify-content .agreement {
  display: flex;
  margin: calc(3px / 100 * 375) auto 0 auto;
  padding-left: calc(10.5px / 100 * 375);
  justify-content: flex-start;
  color: #250a05;
  font-size: calc(3.3px / 100 * 375);
  font-weight: 400;
}
.scan-container .verify-cover .verify-content .agreement .agreement-uncheck,
.scan-container .verify-cover .verify-content .agreement .agreement-check {
  width: calc(5.1px / 100 * 375);
  height: calc(4.2px / 100 * 375);
  background-size: 100% 100%;
  background-position: center center;
}
.scan-container .verify-cover .verify-content .agreement .agreement-uncheck {
  background-image: url('https://sdzy-scan.oss-cn-qingdao.aliyuncs.com/check.png');
}
.scan-container .verify-cover .verify-content .agreement .agreement-check {
  background-image: url('https://sdzy-scan.oss-cn-qingdao.aliyuncs.com/checked.png');
}
.scan-container .verify-cover .verify-content .agreement .agreement-span {
  margin-left: calc(1px / 100 * 375);
  height: calc(5px / 100 * 375);
  line-height: calc(5px / 100 * 375);
}
.scan-container .verify-cover .verify-content .input-tips {
  margin: calc(13px / 100 * 375) auto 0;
  width: 95%;
}
.scan-container .verify-cover .verify-content .input-tips .input-tips-title {
  width: 100%;
  text-align: center;
  letter-spacing: 1px;
  font-weight: bold;
  font-size: calc(3.8px / 100 * 375);
}
.scan-container .verify-cover .verify-content .input-tips .input-tips-content {
  margin: calc(3px / 100 * 375) 0 0 calc(2px / 100 * 375);
  font-size: calc(3.2px / 100 * 375);
  line-height: calc(6px / 100 * 375);
  letter-spacing: 0.5px;
}
.scan-container .verify-cover .verify-content .submit-btn {
  margin: calc(5px / 100 * 375)  auto 0;
  padding-left: calc(1.5px / 100 * 375);
  width: 8.9rem;
  height: 2.3rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1rem;
  text-align: center;
  line-height: 2.25rem;
}
</style>
