<template>
  <div class="result-page">
    <div class="page">
      <div class="results-page" ref="checkBg" :style="checkBgStyle">
        <div class="inner-box">
          <div class="header" ref="checkTitle" :style="checkTitleStyle"></div>
          <div class="first-verify-time">首次验真时间为：xxxx年xx月xx日xx时xx分</div>
          <div class="btn-act" ref="checkLuckEntry" :style="checkLuckEntryStyle">
            {{'点击进入抽奖'}}
          </div>
          <div class="main">
            <div class="toba-box">
              <div class="icon-result">
                <!-- 首次验真 || 未激活的码 -->
                <div class="img-result-succ" v-show="isFirst" ref="checkReal" :style="checkRealStyle"></div>
                <!-- 非首次验真 -->
                <div class="img-result-fail" v-show="!isFirst" ref="checkFail" :style="checkFailStyle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form">
      <el-form label-width="160px" :model="formData" inline>
        <el-row>
          <el-form-item label="整体背景">
            <img-upload name="checkBg" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
          <el-form-item label="标题背景">
            <img-upload name="checkTitle" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="验真提示背景">
            <img-upload name="checkLuckEntry" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
          <el-form-item label="验真提示字体颜色">
            <el-color-picker v-model="formData.checkLuckEntryColor"></el-color-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="切换验真结果">
            <el-switch
              v-model="isFirst"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="验真成功图片">
            <img-upload name="checkReal" @onRemove="onRemove" @onChange="onChange"></img-upload>
          </el-form-item>
          <el-form-item label="验真失败图片">
            <img-upload name="checkFail" @onRemove="onRemove" @onChange="onChange"></img-upload>
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
        checkBg: null,
        checkTitle: null,
        checkLuckEntry: null,
        checkReal: null,
        checkFail: null
      },
      formData: {
        checkLuckEntryColor: '',
        checkBg: '',
        checkTitle: '',
        checkLuckEntry: '',
        checkReal: '',
        checkFail: ''
      }
    }
  },
  computed: {
    checkBgStyle () {
      const style = {}
      if (this.fileData.checkBg) {
        style['background-image'] = `url(${this.fileData.checkBg.url})`
      }
      return style
    },
    checkTitleStyle () {
      const style = {}
      if (this.fileData.checkTitle) {
        style['background-image'] = `url(${this.fileData.checkTitle.url})`
      }
      return style
    },
    checkLuckEntryStyle () {
      const style = {}
      if (this.fileData.checkLuckEntry) {
        style['background-image'] = `url(${this.fileData.checkLuckEntry.url})`
      }
      if (this.formData.checkLuckEntryColor) {
        style.color = this.formData.checkLuckEntryColor
      }
      return style
    },
    checkRealStyle () {
      const style = {}
      if (this.fileData.checkReal) {
        style['background-image'] = `url(${this.fileData.checkReal.url})`
      }
      return style
    },
    checkFailStyle () {
      const style = {}
      if (this.fileData.checkFail) {
        style['background-image'] = `url(${this.fileData.checkFail.url})`
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
      this.formData.checkBg = getComputedStyle(this.$refs.checkBg).backgroundImage.split('"')[1]
      this.formData.checkTitle = getComputedStyle(this.$refs.checkTitle).backgroundImage.split('"')[1]
      this.formData.checkLuckEntry = getComputedStyle(this.$refs.checkLuckEntry).backgroundImage.split('"')[1]
      this.formData.checkReal = getComputedStyle(this.$refs.checkReal).backgroundImage.split('"')[1]
      this.formData.checkFail = getComputedStyle(this.$refs.checkFail).backgroundImage.split('"')[1]
      this.formData.checkLuckEntryColor = getComputedStyle(this.$refs.checkLuckEntry).color
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
.result-page{
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
.results-page {
  position: relative;
  width: 375px;
  height: 812px;
  overflow: hidden;
  /* 注:弹窗背景 */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-color: #fff;
  text-align: center;
}
.results-page .inner-box {
  position: relative;
  padding-top: calc(7px / 100 * 812);
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.results-page .header {
  position: relative;
  margin: auto;
  width: calc(96px / 100 * 375);
  height: calc(24px / 100 * 375);
  z-index: 9;
  /* 注:卷烟标题 */
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 100% auto;
}
.results-page .btn-act {
  position: relative;
  margin: calc(4px / 100 * 812) auto 0;
  padding-right: calc(7px / 100 * 375);
  width: calc(51.6px / 100 * 375);
  height: calc(10.4px / 100 * 375);
  /* 注:点击进入抽奖按钮背景 */
  background-size: 100% 100%;
  color: #ffffff;
  line-height: calc(10.4px / 100 * 375);
}
.results-page .main {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
}
.results-page .main .icon-result {
  position: relative;
  margin: auto;
  width: calc(38.4px / 100 * 375);
  height: calc(38.4px / 100 * 375);
  overflow: hidden;
}
.results-page .main .icon-result .img-result-fail {
  /* 注:非首次标志，一般不变 */
  background-image: url('https://sdzy-scan.oss-cn-qingdao.aliyuncs.com/b62346e0247911ea8ba47cd30ae40e32/check_fail.png');
  background-size: 100%;
  width: 100%;
  height: 100%;
}
.results-page .main .icon-result .img-result-succ {
  /* 注:首次标志，一般不变 */
  background-image: url('https://sdzy-scan.oss-cn-qingdao.aliyuncs.com/b62346e0247911ea8ba47cd30ae40e32/check_real.png');
  background-size: 100%;
  width: 100%;
  height: 100%;
}
.results-page .main .result-tip {
  position: absolute;
  left: 0;
  bottom: calc(3px / 100 * 375);
  width: 100%;
  height: calc(4px / 100 * 375);
  line-height: calc(4px / 100 * 375);
  font-size: calc(3px / 100 * 375);
}

.first-verify-time{
  font-size:14px;
}
</style>
