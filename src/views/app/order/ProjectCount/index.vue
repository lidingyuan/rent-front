<template>
  <ZlQueryContainer
    ref="tableWrapper"
    title="列表"
    :table-data="dataList"
    :columns="columns"
  >
    <template #queryParam>
      项目：
      <el-select
        v-model="queryParam.projectId"
        clearable
        size="small"
        placeholder="请选择"
      >
        <el-option
          v-for="project in projectList"
          :key="project.id"
          :label="project.name"
          :value="project.id"
        />
      </el-select>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        查询
      </el-button>
    </template>

    <!-- 列表 -->
    <el-table
      ref="table"
      size="mini"
      :data="dataList"
      height="100%"
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
      />
    </el-table>
  </ZlQueryContainer>
</template>

<script>
import * as OrderApi from '@/api/OrderApi.js'
import { mapGetters } from 'vuex'
import baseData from '@/core/service/baseDataService'
export default {
  name: 'ProjectCount',
  data () {
    return {
      queryParam: {},
      dataList: [],
      columns: [
        {
          field: 'name',
          title: '材料',
          width: 100,
          'show-overflow-tooltip': true
        },
        {
          field: 'num',
          title: '数量',
          width: 100,
          'show-overflow-tooltip': true
        }
      ]
    }
  },
  computed: {
    ...mapGetters('project', ['projectList'])
  },
  methods: {
    handleSearch () {
      OrderApi.projectCount(this.queryParam).then(res => {
        this.dataList = res.data.map(item => {
          return {
            ...item,
            name: baseData.materialList.find(m => m.code === item.materialCode)?.name
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
