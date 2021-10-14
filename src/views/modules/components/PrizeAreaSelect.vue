<template>
  <!-- 全国·省份·城市选择(只在新增时调用，修改不能操作) -->
  <div>
    <!-- 不可编辑时，不显示此切换框 -->
    <el-radio-group v-if="editable" v-model="districtType" @change="handleChangeType()">
      <el-radio :label="0">全国</el-radio>
      <el-radio :label="1">省份</el-radio>
      <el-radio :label="2">城市</el-radio>
    </el-radio-group>
    <!-- 全国回显 -->
    <div v-if="districtType === 0 && !editable">全国</div>
    <!-- 省份选择 -->
    <div v-if="districtType === 1">
      <el-select size="small" :disabled="!editable" v-model="provCode" placeholder="请选择省份"
        :multiple="multiple" @change="handleChangeCode" style="width: 100%;">
        <el-option v-for="item in provList" :key="item.provCode" :label="item.provName" :value="item.provCode"></el-option>
      </el-select>
    </div>
    <!-- 城市选择 -->
    <div v-if="districtType === 2">
      <el-cascader :disabled="!editable" v-model="cityCode" :options="areaTree" clearable collapse-tags filterable @change="handleChangeCode"
        size="small" :props="{emitPath: false, multiple: multiple}" style="width: 100%;" placeholder="请选择城市"></el-cascader>
    </div>
    <i class="txt-red" v-if="districtType !== 0">类型为省份或城市，但是未选择具体的区域，默认保存为全国</i>
  </div>
</template>

<script>

export default {
  name: 'index',
  props: {
    // 是否多选，默认false
    multiple: {
      type: Boolean,
      default: false
    },
    // 区域code
    code: {
      type: String,
      default: ''
    },
    // 状态
    status: {
      type: String,
      default: 'create'
    }
  },
  data () {
    return {
      // 地区类型：0-全国，1-省份，2-城市
      districtType: 0,
      provCode: null,
      cityCode: null,
      districtCode: '',
      areaTreeData: []
    }
  },
  computed: {
    areaTree () {
      return this.$store.getters['baseData/areaTreeData']
    },
    provList () {
      return this.$store.getters['baseData/provList']
    },
    // 是否可以编辑
    editable () {
      if (this.status === 'create') return true
      return false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.status !== 'create') {
        if (this.code === '000000') {
          this.districtType = 0
        } else {
          const firstCode = this.multiple ? this.code[0] : this.code
          let index = this.provList.findIndex(item => item.provCode === firstCode)
          if (index > -1) {
            this.districtType = 1
            this.provCode = this.multiple ? this.code.split(',') : this.code
          } else {
            this.cityCode = this.multiple ? this.code.split(',') : this.code
            this.districtType = 2
          }
        }
      } else {
        if (this.multiple) {
          this.provCode = []
          this.cityCode = []
        } else {
          this.provCode = ''
          this.cityCode = ''
        }
      }
    },
    // 选择类型
    handleChangeCode (value) {
      this.$emit('update:code', this.multiple ? value.join(',') : value)
    },
    handleChangeType () {
      // 全国
      if (this.districtType === 0) {
        this.$emit('update:code', '000000')
        return
      }
      // 省份
      if (this.districtType === 1) {
        this.$emit('update:code', this.provCode.join(','))
        return
      }
      // 地市
      if (this.districtType === 2) {
        this.$emit('update:code', this.cityCode.join(','))
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
