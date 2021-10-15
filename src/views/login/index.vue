<template>
  <div class="login">
    <div class="login-background">
      <div class="login-title" />
    </div>
    <div class="login-side">
      <div class="login-logo" />
      <div class="login-form">
        <input-box
          v-model="loginForm.username"
          icon="username"
          placeholder="请输入您的账号"
          @keyup.enter.native="handleLogin"
        />
        <input-box
          v-model="loginForm.password"
          icon="password"
          type="password"
          placeholder="请输入您的密码"
          @keyup.enter.native="handleLogin"
        />
        <el-button
          type="primary"
          class="login-submit"
          @click="handleLogin"
        >
          登录
        </el-button>
        <div
          class="login-record"
          @click="changeRecord"
        >
          <div
            class="login-record-icon"
            :class="{record:record}"
          >
            ✔
          </div>
          记住账号密码
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MD5 from 'crypto-js/md5'
import InputBox from '../Login/InputBox.vue'
export default {
  name: '',
  components: { InputBox },
  data () {
    return {
      //
      record: false,
      loginForm: {
        username: '',
        password: ''
      },
      md5password: ''
    }
  },
  watch: {
    'loginForm.password' () {
      this.md5password = ''
    }
  },
  created () {
    //
    const params = JSON.parse(localStorage.getItem('login') || '{}')
    this.loginForm.username = params.username
    this.loginForm.password = params.password
    setTimeout(() => {
      this.md5password = params.password
    }, 0)
    if (params.username) {
      this.record = true
    }
  },
  methods: {
    //
    changeRecord () {
      this.record = !this.record
    },
    handleLogin () {
      this.loading = true
      const md5password = this.md5password || MD5(this.loginForm.password).toString()
      const params = {
        username: this.loginForm.username,
        password: md5password
      }
      this.$store.dispatch('user/Login', params).then(() => {
        if (this.record) {
          localStorage.setItem('login', JSON.stringify(params))
        }
        this.loading = false
        this.$router.push({ path: this.$route.query.redirect || '/' }).catch(() => { })
      }).catch((e) => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.login-background {
  width: 0;
  height: 100%;
  flex-grow: 1;
  background: url("~@/assets/img/login-v2/login-background.png") no-repeat 0/100%
    100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 372px;
  padding: 0 36px;
  margin-top: 125px;
  box-sizing: border-box;
  background: #ffffff;
  color: #666666;
  font-size: 18px;
  > div {
    margin: 24px 0;
  }
  .login-submit {
    width: 300px;
    height: 40px;
    margin: 0 auto;
    font-size: 14px;
  }
  .login-record {
    margin: 8px 0 0 0;
    display: flex;
    align-items: center;
    color: #666666;
    font-size: 12px;
    cursor: pointer;
    .login-record-icon {
      display: inline-flex;
      width: 12px;
      height: 12px;
      margin: 0 3px;
      border: 1px solid #dddddd;
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      &.record {
        background: #3385ff;
        border: 1px solid #3385ff;
      }
    }
  }
}
</style>
