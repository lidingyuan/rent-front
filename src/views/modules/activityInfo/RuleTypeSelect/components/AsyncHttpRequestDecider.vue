<template>
  <!-- 同步请求约束 -->
  <el-row>
    <el-col :span="24">
      <span>说明：请求地址、请求数据，可以使用动态参数</span><br/>
      <span>例如：http://weixin-act-scan/qrcode/isFirst?qrcode=#{#actBaseBO.sourceId}&userId=#{#actBaseBO.userId}</span>
    </el-col>
    <el-col :span="24">
      <el-form-item label="请求地址" label-width="80">
        <el-input v-model="url" placeholder="请求地址" @input="handleChange"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="请求方法" label-width="80">
        <el-select size="small" v-model="method" placeholder="请求方法" @change="handleChange">
          <el-option label="GET" value="GET" ></el-option>
          <el-option label="POST" value="POST" ></el-option>
          <el-option label="PUT" value="PUT" ></el-option>
          <el-option label="DELETE" value="DELETE" ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="请求头" label-width="80">
        <el-button type="success" size="mini" icon="el-icon-circle-plus" @click="handleConfigAdd">添加一行</el-button>
        <el-table border stripe size="mini" :data="headers" height="150" style="width: 100%;">
          <el-table-column prop="key" label="键" align="left" class-name="small-padding">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.key" @input="handleChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值" align="left" width="350" class-name="small-padding">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.value" @input="handleChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="60" class-name="small-padding">
            <template slot-scope="scope">
              <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleConfigDelete(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="请求数据" label-width="80">
        <el-input type="textarea" :rows="3" v-model="body" placeholder="请求数据，HTTP body部分" @input="handleChange"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HttpRequestDecider',
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      url: '',
      method: 'GET',
      headers: [],
      body: ''
    }
  },
  created () {
    const temp = this.param || this.emptyParam()
    this.url = temp.url
    this.method = temp.method
    this.headers = []
    for (let i in temp.headers) {
      this.headers.push({ key: i, value: temp.headers[i] })
    }
    this.body = temp.body
  },
  methods: {
    emptyParam () {
      return {
        url: '',
        method: 'GET',
        headers: {},
        body: ''
      }
    },
    // 添加一行
    handleConfigAdd () {
      this.headers.push({ key: '', value: '' })
    },
    handleConfigDelete (index) {
      this.headers.splice(index, 1)
      this.handleChange()
    },
    // ---
    handleChange (val) {
      let headers = {}
      for (let i of this.headers) {
        headers[i.key] = i.value
      }
      let data = { url: this.url, method: this.method, headers: headers, body: this.body }
      this.$emit('update:param', data)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
