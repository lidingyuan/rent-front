<template>
  <el-dialog
    class="project-price"
    :visible.sync="projectPriceVisible"
  >
    <el-table
      ref="table"
      size="mini"
      :data="dataList"
      border
      stripe
    >
      <el-table-column
        v-for="column in columns"
        :key="column.field"
        :prop="column.field"
        :label="column.title"
        :type="column.type"
        :fixed="column.fixed"
        :width="column.width"
        :sortable="column.sortable"
        :show-overflow-tooltip="column['show-overflow-tooltip']"
      >
        <template
          v-if="column.field === 'price'"
          #default="{row}"
        >
          <el-input
            v-model="row.price"
            type="number"
          />
        </template>
        <template
          v-else-if="column.field === 'transWeightFactor'"
          #default="{row}"
        >
          <el-input
            v-model="row.transWeightFactor"
            type="number"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="save">
      保存
    </el-button>
  </el-dialog>
</template>

<script>
import baseData from '@/core/service/baseDataService'
export default {
  name: 'ProjectPrice',
  props: {
    visible: Boolean,
    priceList: Array
  },
  data () {
    return {
      dataList: [],
      materialTypeList: [],
      projectPriceVisible: false,
      columns: [
        {
          field: 'materialTypeName',
          title: '材料名',
          width: 80
        },
        {
          field: 'price',
          title: '元/日/吨',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'transWeightFactor',
          title: '单位转吨系数',
          width: 100,
          'show-overflow-tooltip': true
        }
      ]
    }
  },
  watch: {
    visible (val) {
      this.projectPriceVisible = val
    },
    projectPriceVisible (val) {
      this.$emit('update:visible', val)
    },
    priceList () {
      this.dataList = baseData.materialTypeList.filter(item => item.priceRule === 0).map(type => {
        const item = this.priceList.find(item => type.id === item.materialTypeId) || {}
        return {
          materialTypeId: type.id,
          materialTypeName: type.materialTypeName,
          price: 0,
          transWeightFactor: type.transWeightFactor,
          ...item
        }
      })
    }
  },
  created () {
    this.dataList = baseData.materialTypeList.filter(item => item.priceRule === 0).map(item => {
      return {
        materialTypeId: item.id,
        materialTypeName: item.materialTypeName,
        price: 0,
        transWeightFactor: item.transWeightFactor
      }
    })
  },
  methods: {
    save () {
      this.$emit('update:priceList', this.dataList.map(item => {
        const obj = {
          materialTypeId: item.materialTypeId,
          price: Number(item.price),
          transWeightFactor: Number(item.transWeightFactor)
        }
        if (item.projectId) {
          obj.projectId = item.projectId
        }
        return obj
      }))
      this.projectPriceVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
