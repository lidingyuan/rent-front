<template>
  <el-dialog
    :visible.sync="orderDetailVisible"
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    <div style="display:flex;">
      <el-table
        size="mini"
        :data="dataList"
        height="60vh"
        border
        stripe
      >
        <el-table-column
          prop="name"
          label="名称"
        >
          <template #default="{row}">
            <el-select
              v-model="row.materialCode"
              :class="{repeat:dataMap[row.materialCode]}"
              filterable
              :filter-method="filterMethod"
              placeholder="请选择"
              default-first-option
              @change="change"
            >
              <el-option
                v-for="item in materialList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
            <div
              v-if="dataMap[row.materialCode]"
              class="repeat-tip"
            >
              材料重复
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
        >
          <template #default="{row}">
            <el-input-number
              v-model="row.num"
              :controls="false"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
        />
      </el-table>
      <el-table
        size="mini"
        :data="dataTypeList"
        height="60vh"
        border
        stripe
      >
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="num"
          label="数量"
        />
        <el-table-column
          prop="unit"
          label="单位"
        />
      </el-table>
    </div>

    <el-button
      @click="save"
    >
      保存
    </el-button>
  </el-dialog>
</template>

<script>
import * as OrderApi from '@/api/OrderApi.js'
import baseData from '@/core/service/baseDataService'
export default {
  name: 'OrderDetail',
  props: {
    visible: Boolean,
    data: Array,
    orderId: [Number, String]
  },
  data () {
    return {
      orderDetailVisible: false,
      materialList: [],
      form: {},
      dataList: [{ materialCode: null, num: null }],
      dataMap: {},
      typeMap: {}
    }
  },
  computed: {
    dataTypeList () {
      const typeMap = {}
      this.dataList.forEach(item => {
        const m = baseData.materialList.find(m => m.code === item.materialCode)
        if (!m) {
          return
        }
        if (!typeMap[m.typeId]) {
          typeMap[m.typeId] = {
            name: this.typeMap[m.typeId].materialTypeName,
            unit: this.typeMap[m.typeId].unit,
            num: 0
          }
        }
        typeMap[m.typeId].num += item.num * m.factor
      })
      return Object.values(typeMap)
    }
  },
  watch: {
    visible () {
      this.orderDetailVisible = this.visible
    },
    dataList () {
      this.materialList = baseData.materialList
    },
    orderDetailVisible (val) {
      this.$emit('update:visible', val)
    },
    orderId () {
      if (this.orderId) {
        OrderApi.detailList({ orderId: this.orderId }).then(res => {
          this.dataList = res.data
        })
      }
    }
  },
  created () {
    const typeMap = {}
    baseData.materialTypeList.forEach(item => {
      typeMap[item.id] = item
    })
    this.typeMap = typeMap
    this.materialList = baseData.materialList
    this.orderDetailVisible = this.visible
  },
  methods: {
    save () {
      this.$emit('update:data', this.dataList.filter(item => item.materialCode && item.num))
      this.$emit('update:visible', false)
    },
    filterMethod (key) {
      if (!key) {
        this.materialList = baseData.materialList
        return
      }
      this.materialList = baseData.materialList.filter(item => item.key.includes(key))
    },
    change (code) {
      this.dataMap = {}
      this.dataList.forEach(item => {
        if (this.dataMap[item.materialCode] === false) {
          this.dataMap[item.materialCode] = true
        }
        if (this.dataMap[item.materialCode] === undefined) {
          this.dataMap[item.materialCode] = false
        }
      })
      const item = this.dataList[this.dataList.length - 1] || {}
      if (item.materialCode) {
        this.dataList.push({
          materialCode: null,
          num: null
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.repeat{
  border: 1px solid #F56C6C;
  border-radius: 5px;
}
.repeat-tip{
  color: #F56C6C;
}
</style>
