<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">活动列表</div>
      <template slot="operates">
        <el-input size="small" v-show="lockStatus" v-model="searchKey.searchText" placeholder="粉丝手机号或OPENID" style="width: 300px"></el-input>
        <el-select size="small" v-model="lockStatus" placeholder="锁定状态" style="width: 150px;">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="已锁定" :value="0"></el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" align="center"></el-table-column>
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column label="粉丝昵称" width="160" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-avatar middle :size="30" style="vertical-align:bottom; margin-right:10px;" :src="scope.row.headImgUrl"></el-avatar>
            <span class="nickname">{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="100"/>
        <el-table-column prop="openId" label="OPENID" width="280" :show-overflow-tooltip="true"/>
        <!-- <el-table-column prop="sex" label="性别" width="80">
          <span slot-scope="scope">
            <span style="display:inline-block;width:30px">{{scope.row.sex | sexFilter}}</span>
            <svg-icon :icon-class="scope.row.sex | sexIconFilter" style="transform:scale(1.5)"></svg-icon>
          </span>
        </el-table-column> -->
        <!-- <el-table-column label="粉丝地域" width="160">
          <span slot-scope="scope">{{ `${scope.row.country ? scope.row.country : '暂无' }·${scope.row.province ? scope.row.province : ''}·${scope.row.city ? scope.row.city : ''}`}}</span>
        </el-table-column> -->
        <!-- <el-table-column prop="subscribeScene" label="关注来源" width="120">
          <template slot-scope="scope">{{scope.row.subscribeScene | checkSubscribeSceneFilter}}</template>
        </el-table-column> -->
        <!-- <el-table-column sortable label="关注时长" width="100" prop="subscribeTime">
          <template slot-scope="scope">{{scope.row.subscribeTime | secondsToDayFilter}}</template>
        </el-table-column> -->
        <!-- <el-table-column sortable prop="interactTimes" label="互动次数" width="100"/> -->
        <!-- <el-table-column sortable prop="lastTime" label="最近一次互动时间" width="160" >
          <template slot-scope="scope">
            <span v-if="scope.row.lastTime">{{ scope.row.lastTime | secondsFormatFilter }}</span>
            <span v-else>无互动</span>
          </template>
        </el-table-column> -->
        <el-table-column sortable label="是否锁定" width="100" prop="lock">
          <template slot-scope="scope">{{scope.row.lock | lockFilter}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="160"/>
        <el-table-column label="操作" align="center" fixed="right">
           <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('scan:lock:user:del') && scope.row.lock" icon="el-icon-edit" @click.native="handleUnLock(scope.row)" style="color:#409EFF;">解锁</el-dropdown-item>
                <el-dropdown-item v-if="$auth('scan:lock:user:add') && !scope.row.lock" icon="el-icon-edit" @click.native="handleLock(scope.row)" style="color:#409EFF;">锁定</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination v-show="lockStatus" @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>
  </div>
</template>

<script>
import * as ScanApi from '@/api/scan/ScanApi.js'
import TableWrapper from '@/components/TableWrapper'
export default {
  name: 'ScanRule',
  components: { TableWrapper },
  data () {
    return {
      //
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      lockStatus: 0,
      // 查询条件
      searchKey: {
        searchText: ''
      },
      // ---数据
      userList: [],
      lockMap: {}
    }
  },
  computed: {
    dataList () {
      const dataList = this.userList.map((user) => {
        user.lock = !!this.lockMap[user.id]
        return user
      })
      console.log(dataList)
      return dataList
    }
  },
  filters: {
    checkSubscribeSceneFilter (subscribeScene) {
      let tmp = ''
      switch (subscribeScene) {
        case 'ADD_SCENE_SEARCH':
          tmp = '公众号搜索'
          break
        case 'ADD_SCENE_ACCOUNT_MIGRATION':
          tmp = '公众号迁移'
          break
        case 'ADD_SCENE_PROFILE_CARD':
          tmp = '名片分享'
          break
        case 'ADD_SCENE_QR_CODE':
          tmp = '扫描二维码'
          break
        case 'ADD_SCENE_PROFILE_LINK':
          tmp = '图文页内名称点击'
          break
        case 'ADD_SCENE_PROFILE_ITEM':
          tmp = '图文页右上角菜单'
          break
        case 'ADD_SCENE_PAID':
          tmp = '支付后关注'
          break
        default:
          tmp = '其他'
          break
      }
      return tmp
    },
    lockFilter (lock) {
      return lock ? '是' : '否'
    }
  },
  created () {
    this.handleSearch()
  },
  methods: {
    //
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    doSearch () {
      let options = { ...this.page, ...this.searchKey }
      this.getLockList().then(res => {
        this.lockStatus ? this.userListByPage(options) : this.lockUserList(options)
      })
    },
    getLockList () {
      return ScanApi.lockUserList({
        current: 1,
        total: 0,
        size: 100000
      }).then(res => {
        res.data.records.forEach(item => {
          this.lockMap[item.id] = true
        })
      })
    },
    lockUserList () {
      const list = Object.keys(this.lockMap)
      ScanApi.userListByIds(list).then(res => {
        this.userList = res.data
      })
    },
    userListByPage (options) {
      ScanApi.userListByPage(options).then(res => {
        this.userList = res.data.records
        this.$objects.copyProperties(res.data, this.page)
      })
    },
    handleUnLock (row) {
      ScanApi.unlock({ userId: row.id }).then(res => {
        delete this.lockMap[row.id]
        this.$message('解锁成功')
        this.handleSearch()
      })
    },
    handleLock (row) {
      ScanApi.lock({ userId: row.id }).then(res => {
        this.lockMap[row.id] = true
        this.$message('锁定成功')
        this.handleSearch()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
