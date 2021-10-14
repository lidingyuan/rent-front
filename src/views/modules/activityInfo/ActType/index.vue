<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">活动类型列表</div>
      <template slot="operates">
        <!-- 活动选择组件 -->
        <act-select :actId.sync="actId" :actName.sync="actName"></act-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:activity:type:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table v-loading="loading" ref="table" :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" width="80" label="编码"></el-table-column>
        <el-table-column prop="name" width="150" label="名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="300" label="备注" ></el-table-column>
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:activity:type:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:activity:type:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer" v-if="false">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
        <el-form-item label="编码" prop="code" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="轮播图" prop="config.banner">
          <!-- 素材选择 -->
          <el-popover placement="top-end" width="750">
            <material-select-box v-model="material"></material-select-box>
            <el-button size="small" slot="reference" type="primary">从素材库中选择</el-button>
          </el-popover>
          <!-- 素材显示 -->
          <ul class="showMaterial">
            <li v-for="(item, index) in temp.config.banner" :key="index" style="width:200px;height:100%;float:left;list-style:none;">
              <el-card :body-style="{ padding: '0px' }">
                <el-image style="width:200px;height:120px" :src="temp.config.banner[index]" ></el-image>
                <div style="display:flex;justify-content: space-around;padding:0 30px 10px">
                  <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleOptionDelete(temp.config.banner, item)"></el-button>
                  <el-button type="primary" size="mini" icon="el-icon-arrow-left" circle title="左移" @click="handleOptionMoveUp(temp.config.banner, item)"></el-button>
                  <el-button type="primary" size="mini" icon="el-icon-arrow-right" circle title="右移" @click="handleOptionMoveDown(temp.config.banner, item)"></el-button>
                </div>
              </el-card>
            </li>
          </ul>
          <i>提交前请检查是否有重复的图片，如果图片不能重复，请手动删除重复的图片</i>
        </el-form-item>
        <el-form-item label="排序码" prop="orderTag" >
          <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="temp.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ActTypeApi from '@/api/activityInfo/ActTypeApi.js'
import TableWrapper from '@/components/TableWrapper'
import ActSelect from '@/views/modules/components/ActSelect'
import MaterialSelectBox from '@/views/modules/material/ActMaterialMapping/MaterialSelectBox'

export default {
  name: 'ActType',
  components: { TableWrapper, ActSelect, MaterialSelectBox },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        code: '',
        name: '',
        config: {
          banner: ''
        },
        orderTag: 1,
        remarks: ''
      },
      // 查询的活动id
      actId: '',
      actName: '',
      // 新增表单中的banner数据，用户界面操作的数组
      bannerArr: [],
      // 素材选择则框选中的素材。
      material: {
        id: '',
        url: '',
        type: 'POSTER'
      },
      loading: true
    }
  },
  created () {
    this.handleSearch()
  },
  methods: {
    // ---查询列表
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
      ActTypeApi.list(this.actId).then(res => {
        this.dataList = res.data
        this.loading = false
      })
    },
    // ---编辑
    handleCreate () {
      this.material = {
        id: '',
        url: '',
        type: 'POSTER'
      }
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 配置内容转JSON字符串
          let tempData = Object.assign({}, this.temp)
          if (tempData.config.banner.length === 0) {
            delete tempData['config']
          } else {
            tempData.config = JSON.stringify(this.temp.config)
          }
          ActTypeApi.save(tempData).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.material = {
        id: '',
        url: '',
        type: 'POSTER'
      }
      this.temp = Object.assign({}, row)
      if (this.temp.config) {
        this.temp.config = JSON.parse(row.config)
        this.temp.config['banner'] = this.temp.config.banner || []
      } else {
        this.temp.config = {
          banner: []
        }
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 配置内容转JSON字符串
          let tempData = Object.assign({}, this.temp)
          if (tempData.config.banner.length === 0) {
            delete tempData['config']
          } else {
            tempData.config = JSON.stringify(this.temp.config)
          }
          ActTypeApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此活动类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActTypeApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        code: '',
        name: '',
        config: {
          banner: []
        },
        orderTag: 1,
        remarks: ''
      }
    },
    handleOptionMoveUp (arr, row) {
      let idx = arr.indexOf(row)
      if (idx > 0) {
        this.$set(arr, idx, arr[idx - 1])
        this.$set(arr, idx - 1, row)
      }
    },
    handleOptionMoveDown (arr, row) {
      let idx = arr.indexOf(row)
      if (idx < arr.length - 1) {
        this.$set(arr, idx, arr[idx + 1])
        this.$set(arr, idx + 1, row)
      }
    },
    handleOptionDelete (arr, row) {
      let idx = arr.indexOf(row)
      arr.splice(idx, 1)
    }
  },
  watch: {
    // 监听选择素材变化
    'material.id' (newVal, oldVal) {
      if (newVal !== '') {
        // 判断已选的素材Url和列表中的bannerUrl是否重复，重复则不进行添加
        let bannerArr = Object.assign({}, this.temp.config.banner)
        let length = bannerArr.length
        let isRepeat = false
        for (let i = 0; i < length; i++) {
          if (bannerArr[i] === this.material.url) {
            this.$message.info('当前选择图片已经存在于banner中，请不要重复选择！')
            isRepeat = true
            break
          }
        }

        // 如果没有重复则添加
        if (!isRepeat) {
          this.temp.config.banner.push(this.material.url)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img{
  width: 100px;
  height: 100px;
  margin-right: 15px;
  margin-top: 15px;
}
.banner{
  width: 570px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  // width: 450px;
}
.input-new-tag {
  width: 450px;
  margin-top: 5px;
  vertical-align: bottom;
}
.pop_no_data{
  height: 100px;
  width: 400px;
  line-height: 100px;
  text-align: center;
}
.showMaterial{
  border: 1px solid gray;
  width: 100%;
  height: 180px;
  // display: flex;
  overflow-x: auto;
  padding: 0;
}
</style>
