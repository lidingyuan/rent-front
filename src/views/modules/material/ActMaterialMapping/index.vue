<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">{{sourceName}}-素材列表</div>
      <template slot="operates">
        <el-button size="small" type="primary" icon="el-icon-info" @click="handleShowPrizeExpalinDialog">使用说明</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        <el-button v-if="$auth('activity:basics:material_mapping:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sourceType" width="120" label="源类型" align="center"></el-table-column>
        <el-table-column prop="sourceId" width="200" label="源ID" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="materialId" width="200" label="素材ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="url" width="80" label="图片预览" >
          <template slot-scope="scope">
            <el-popover placement="left" trigger="click" width="430">
              <el-image style="width:400px;height:400px" :src="scope.row.url" fit="contain"></el-image>
              <el-image slot="reference" style="width:50px;height:50px" :src="scope.row.url" fit="cover"></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="80" label="素材类型" align="center"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:basics:material_mapping:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:basics:material_mapping:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :modal="true" width="960px">
      <el-form size="small" label-width="100px" ref="dataForm" :model="temp">
        <el-row>
          <el-col :span="12">
            <el-form-item label="源ID" prop="sourceId" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.sourceId" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源类型" prop="sourceType" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.sourceType" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="素材选择">
              素材ID：<el-input v-model="temp.materialId" readonly style="width:300px;" />
              <material-select-box v-model="selectedMaterial" v-if="dialogFormVisible"></material-select-box>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序码" prop="orderTag" :rules="[{required:true, message:'必须字段'}]">
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="temp.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>

      <el-dialog :visible.sync="dialogImageVisible" :modal="false">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

    </el-dialog>

    <!-- 奖项图片说明弹窗 -->
    <el-dialog v-if="dialogPrizeImgVisible" :visible.sync="dialogPrizeImgVisible" :close-on-click-modal="true" class="dialog-explain" width="768px">
      <div class="explain-title">物资图片和奖项图片使用说明</div>
      <div>
        <div class="p-line">
          <div class="line-title txt-primary">两者区别：</div>
          <div class="line-explain">
            <span class="line-label txt-primary">物资图片</span>，和某个抽奖无关，和物资有关，在<span class="txt-success">'基础信息-物资管理-素材管理'</span>配置；
            <br><span class="line-label txt-primary">奖项图片</span>，和具体的某个抽奖中的某个奖项 有关，在<span class="txt-success">'抽奖管理-奖项管理-奖项图片'</span>配置；
            <br>例如：在抽奖中设置奖项a，关联了某个物资G，奖项b也关联物资G，则a与b奖项的物资图片是一样的，但是可以设置各自奖项图片，a有a的奖项图片，b有b的奖项图片;
            <span class="txt-danger">在奖项奖品是积分或者其他虚拟物资情况下，一般都需要维护奖项图片，虚拟物资是无法设置物资图片的</span>
          </div>
        </div>
        <div class="p-line">
          <div class="line-title txt-primary">页面使用情况：</div>
          <el-alert type="error" :closable="false">并不保证所有场景的都是按照以下要求实现的，但建议按照下述使用情况来进行相关素材配置</el-alert>
          <div class="line-explain">
            <div>
              <span class="line-label txt-primary">转盘、九宫格或者其他抽奖形式页面上图片</span>：
              <br>&emsp;&emsp;<span class="txt-danger">优先取奖项图片</span>，若奖品图片配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>；
              否则取<i class="txt-danger">类型为ICON的第一张</i>
              <br>&emsp;&emsp;<span class="txt-danger">其次取物资图片</span>，若物资图片配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>；
              否则取<i class="txt-danger">类型为ICON的第一张</i>
              <br>&emsp;&emsp;若都未取到，视为未找到图片，页面上对应的呈现奖项图片的位置将空着的；
            </div>
            <div>
              <span class="line-label txt-primary">抽奖结果弹窗奖品图片</span>：
              <br>&emsp;&emsp;<span class="txt-danger">优先取物资图片</span>，若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>；
              否则取<i class="txt-danger">类型为POSTER的第一张</i>
              <br>&emsp;&emsp;<span class="txt-danger">其次取奖项图片</span>，
              若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>，否则取<i class="txt-danger">类型为POSTER的第一张</i>，
              若都未取到，视为未找到图片，页面弹窗上对应的呈现奖项图片的位置将空着的；
              <br>&emsp;&emsp;<span class="line-label txt-primary">抽奖记录列表奖品图片小图标</span>：取图片方式和弹窗上奖品图片一样，不同的是图片类型是ICON，而不是POSTER
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as ActMaterialMappingApi from '@/api/material/ActMaterialMappingApi.js'

import TableWrapper from '@/components/TableWrapper'
import MaterialSelectBox from './MaterialSelectBox'

export default {
  name: 'ActMaterialMapping',
  components: { TableWrapper, MaterialSelectBox },
  data () {
    return {
      sourceType: '',
      sourceId: '',
      sourceName: '',
      // ---查询条件
      // ---数据
      dataList: [],
      // 说明窗口
      dialogPrizeImgVisible: false,
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        sourceType: this.sourceType,
        sourceId: this.sourceId,
        materialId: '',
        type: '',
        url: '',
        orderTag: 1,
        remarks: ''
      },
      // 素材选择，选中的素材
      selectedMaterial: {
        id: '',
        url: '',
        type: ''
      },
      dialogImageVisible: false,
      dialogImageUrl: '',
      mediaTypes: [
        { label: '图标-ICON', value: 'ICON' },
        { label: '缩略图-THUMB', value: 'THUMB' },
        { label: '海报-POSTER', value: 'POSTER' },
        { label: '语音-VOICE', value: 'VOICE' },
        { label: '视频-VIDEO', value: 'VIDEO' }
      ]
    }
  },
  created () {
    // 路由参数
    if (this.$route.query.sourceId) {
      this.sourceId = this.$route.query.sourceId
      this.sourceType = this.$route.query.sourceType
      this.sourceName = this.$route.query.sourceName
      this.handleSearch()
    } else {
      this.$message.error('缺少路由参数：sourceId')
    }
  },
  methods: {
    // ---查询列表
    handleSearch () {
      ActMaterialMappingApi.listBySourceId(this.sourceType, this.sourceId).then(res => {
        this.dataList = res.data
      })
    },
    // ---编辑
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    createData () {
      if (!this.selectedMaterial.id) {
        this.$message.warning('请选择素材')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActMaterialMappingApi.save(tempData).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      // 给temp的material赋值
      this.selectedMaterial = {
        id: row.materialId,
        url: row.url,
        type: row.type
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
          const tempData = Object.assign({}, this.temp)
          ActMaterialMappingApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActMaterialMappingApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        sourceType: this.sourceType,
        sourceId: this.sourceId,
        materialId: '',
        type: '',
        url: '',
        orderTag: 1,
        remarks: ''
      }
      this.selectedMaterial = {
        id: '',
        url: '',
        type: ''
      }
    },
    // ---
    // 显示奖品图片设置弹出
    handleShowPrizeExpalinDialog () {
      this.dialogPrizeImgVisible = true
    }
  },
  watch: {
    'selectedMaterial.id' (newVal, oldVal) {
      this.temp.materialId = newVal
      this.temp.type = this.selectedMaterial.type
      this.temp.url = this.selectedMaterial.url
    }
  }
}
</script>

<style lang="scss">
.hideUpload .el-upload {
  display: none;
}
</style>
