<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">欢迎您登录</h3>
      <el-form-item prop="username">
        <span class="svg-container"><svg-icon icon-class="user" /></span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"><svg-icon icon-class="password" /></span>
        <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="密码" />
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MD5 from 'crypto-js/md5'

const defautlCheckImageUrl = process.env.VUE_APP_BASE_API + '/captcha/image'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      // if (value.length < 5) {
      //   callback(new Error('用户名不能少于5位'))
      // } else {
      //   callback()
      // }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateCheckCode = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        checkcode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        checkcode: [{ required: true, trigger: 'blur', validator: validateCheckCode }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      checkImageUrl: defautlCheckImageUrl
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {

  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let md5password = MD5(this.loginForm.password).toString().substring(2, 22)
          let params = {
            username: this.loginForm.username,
            password: md5password,
            checkcode: this.loginForm.checkcode
          }
          this.$store.dispatch('user/Login', params).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch((e) => {
            this.loading = false
            this.refreshCheckcode()
            this.loginForm.checkcode = ''
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCheckcode () {
      this.checkImageUrl = defautlCheckImageUrl + '?_=' + (+new Date())
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
$input_height: 47px;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: $input_height;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .check-image {
    text-align: right;

    img {
      height: $input_height;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    position: absolute;
    left: 50%;
    margin-top: 120px;
    padding: 35px 35px 15px 35px;
    width: 520px;
    max-width: 100%;
    transform: translateX(-50%);
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .svg-container {
    display: inline-block;
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    color: $dark_gray;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
