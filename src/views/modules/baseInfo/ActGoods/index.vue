<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">物资列表</div>
      <template slot="operates">
        <el-input size="small" placeholder="请输入物资名称" v-model="goodsName" clearable style="width:260px"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:basics:goods:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="name" width="200" label="物资名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materials" width="80" label="物资图片">
          <template slot-scope="scoped">
            <img-preview :imgArr="scoped.row.materials"></img-preview>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="80" label="物资类型" :formatter="formatGoodsType" align="center"></el-table-column>
        <el-table-column prop="price" width="80" label="价格" sortable align="right"></el-table-column>
        <el-table-column prop="specs" width="100" label="物资规格" align="right"></el-table-column>
        <el-table-column prop="unit" width="80" label="物资单位" align="center"></el-table-column>
        <el-table-column prop="description" width="200" label="详细描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:basics:goods:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:basics:goods:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:basics:material_mapping:get')" icon="el-icon-picture-outline" divided @click.native="handleMaterial(scope.row)" >管理素材</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <el-form class="form" size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物资名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资类型" prop="type" :rules="[{required:true, message:'必须字段'}]">
              <el-select v-model="temp.type">
                <el-option v-for="item in goodsTypeList" :key="item.value"
                  :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price" :rules="[{required:true, message:'必须字段'}]">
              <el-input-number v-model.number="temp.price" :min="0" :precision="2" :step="0.1"></el-input-number>
              元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资规格" prop="specs" :rules="[{required:true, message:'必须字段'}]">
              <el-input-number v-model="temp.specs" :min="1"></el-input-number>
              最小单位
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资单位" prop="unit" :rules="[{required:true, message:'必须字段'}]">
              <el-select v-model="temp.unit" filterable allow-create>
                <el-option value="分" label="分"></el-option>
                <el-option value="个" label="个"></el-option>
                <el-option value="盒" label="盒"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序码" prop="orderTag" >
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物资描述" prop="description" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import * as ActGoodsApi from '@/api/baseInfo/ActGoodsApi.js'
import TableWrapper from '@/components/TableWrapper'
import ImgPreview from '@/views/modules/components/ImgPreview'

export default {
  name: 'ActGoods',
  components: { TableWrapper, ImgPreview },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      goodsName: '',
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        name: '',
        type: '03',
        price: 0,
        specs: 1,
        unit: '',
        description: '',
        orderTag: 1,
        remarks: ''
      },
      goodsId: ''
    }
  },
  computed: {
    goodsTypeList () {
      return this.$store.getters['baseData/goodsTypeList']
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
      let options = Object.assign({}, this.page, { name: this.goodsName })
      ActGoodsApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // ---编辑
    handleCreate () {
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
          ActGoodsApi.save(this.temp).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
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
          ActGoodsApi.update(tempData).then(() => {
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
        ActGoodsApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        name: '',
        type: '03',
        price: 0,
        specs: 1,
        unit: '',
        description: '',
        orderTag: 1,
        remarks: ''
      }
    },
    // 格式输出物资类型
    formatGoodsType (row, col, cellValue) {
      if (!cellValue) return ''
      const type = this.goodsTypeList.find(type => type.value === cellValue)
      return type.label
    },
    // 素材管理
    handleMaterial (row) {
      const message = '当该物资被作为某个抽奖环节的奖品时，' +
        '该物资关联的ICON类型的第一张图片会被作为转盘上的图片使用,' +
        '该物资关联的POSTER类型的第一张图片会被作为奖品详情页面的图片使用'
      this.$alert(message, '物资关联的图片说明', {
        callback: () => {
          this.$router.push({ name: 'ActMaterialMapping', query: { sourceId: row.id, sourceType: 'GOODS', sourceName: row.name } })
        }
      })
    }
  }
}
</script>
