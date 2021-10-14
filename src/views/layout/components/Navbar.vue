<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="handleChangePassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" width="420px" :close-on-click-modal="false" :show-close="!forceChangePassword" >
      <el-alert v-if="forceChangePassword" title="您的密码已过期，请先修改密码！" type="error" effect="dark" :closable="false" center style="line-height: 1.5; margin-bottom: 20px;"></el-alert>
      <el-form :model="passwordForm" status-icon :rules="passwordFormRules" ref="passwordForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off" placeholder="输入当前账户密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off" placeholder="包含大小写字母、数字、特殊字符"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input type="password" v-model="passwordForm.newPassword2" autocomplete="off" placeholder="包含大小写字母、数字、特殊字符"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doChangePassword()">保存</el-button>
      </div>
    </el-dialog>

  </el-menu>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import { mapGetters } from 'vuex'

import * as UserApi from '@/api/system/user.js'
import MD5 from 'crypto-js/md5'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.passwordForm.oldPassword) {
        callback(new Error('新密码不能与原密码一致!'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      dialogPasswordVisible: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      passwordFormRules: {
        oldPassword: [
          { required: true, trigger: 'change' }
        ],
        newPassword: [
          { required: true, pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/, message: '密码中必须包含大写字母、小写字母、数字、特殊字符，至少8个字符', trigger: 'change' },
          { required: true, validator: validatePassword, trigger: 'change' }
        ],
        newPassword2: [
          { required: true, validator: validatePassword2, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('app', ['sidebar']),
    ...mapGetters('user', ['name', 'avatar', 'forceChangePassword'])
  },
  mounted () {
    this.dialogPasswordVisible = this.forceChangePassword
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/ToggleSideBar')
    },
    logout () {
      this.$store.dispatch('user/Logout').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // -----
    handleChangePassword () {
      this.resetPasswordForm()
      this.dialogPasswordVisible = true
    },
    doChangePassword () {
      let oldPassword = MD5(this.passwordForm.oldPassword).toString()
      let newPassword = MD5(this.passwordForm.newPassword).toString()
      let newPassword2 = MD5(this.passwordForm.newPassword2).toString()
      if (newPassword !== newPassword2) {
        this.$alert('两次密码不一致')
        return
      }
      UserApi.changePassword(oldPassword, newPassword).then(res => {
        this.handleSearch()
        this.dialogPasswordVisible = false
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetPasswordForm () {
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  transition: width .28s;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
