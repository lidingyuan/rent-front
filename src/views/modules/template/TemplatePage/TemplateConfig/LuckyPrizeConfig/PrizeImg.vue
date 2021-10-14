<template>
  <div class="">
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
  </div>
</template>

<script>
import * as ActMaterialMappingApi from '@/api/material/ActMaterialMappingApi.js'
import MaterialSelectBox from './MaterialSelectBox'
export default {
  name: '',
  components: { MaterialSelectBox },
  props: {
    prizeRow: Object
  },
  data () {
    return {
      //
      dialogStatus: 'create',
      dialogFormVisible: false,
      // 素材选择，选中的素材
      selectedMaterial: {
        id: '',
        url: '',
        type: ''
      },
      dialogImageVisible: false,
      dialogImageUrl: '',
      temp: {
        id: '',
        sourceType: 'PRIZE',
        sourceId: this.prizeRow.id,
        materialId: '',
        type: '',
        url: '',
        orderTag: 1,
        remarks: ''
      }
    }
  },
  watch: {
    'selectedMaterial.id' (newVal, oldVal) {
      this.temp.materialId = newVal
      this.temp.type = this.selectedMaterial.type
      this.temp.url = this.selectedMaterial.url
    },
    prizeRow () {
      this.temp.sourceId = this.prizeRow.id
      this.handleSearch()
    }
  },
  created () {
    //
  },
  methods: {
    // ---查询列表
    handleSearch () {
      ActMaterialMappingApi.listBySourceId('PRIZE', this.prizeRow.id).then(res => {
        const dataList = res.data
        if (dataList.length) {
          this.temp = Object.assign({}, dataList[0])
          this.selectedMaterial = {
            id: dataList[0].materialId,
            url: dataList[0].url,
            type: dataList[0].type
          }
          this.dialogStatus = 'update'
        }
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
            this.$emit('refreshIframe')
          })
        }
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
            this.$emit('refreshIframe')
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
