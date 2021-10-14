<!-- 素材选择列表表头 -->
<template>
  <table-wrapper :filterable="false" :excel="false" :expand="false" height="360px">
    <div slot="title">素材列表</div>
    <template slot="operates">
      <el-select size="mini" v-model="searchType" @change="handleSearch(1)">
        <el-option v-for="item in mediaTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-input size="mini" placeholder="输入素材名称筛选" v-model="searchText" style="width:200px;" />
      <el-button size="mini" type="primary" icon="el-icon-search" @click="handleSearch(1)">查询</el-button>
      <el-button size="mini" type="success" icon="el-icon-circle-plus" @click="handleAddMaterial">新增素材</el-button>
    </template>

    <section class="media-container">
      <el-card v-for="item in dataList" :key="item.id" class="media-item" :style="mediaItemStyle" :body-style="{ padding: '0px' }">
        <template v-if="item.type === 'ICON' || item.type === 'THUMB' || item.type === 'POSTER'">
          <div class="media-item-body" @click="handleMediaClick(item)">
            <el-image :src="item.url" fit="contain" ></el-image>
          </div>
        </template>
        <template v-if="item.type === 'voice'">
          <div class="media-item-body" @click="handleMediaClick(item)">
            <svg-icon icon-class="video"></svg-icon>
          </div>
        </template>
        <template v-if="item.type === 'video'">
          <div class="media-item-body" @click="handleMediaClick(item)">
            <svg-icon icon-class="voice"></svg-icon>
          </div>
        </template>
        <div class="media-item-footer">
          <span class="meida-item-title" :title="item.srcName">{{item.srcName}}</span>
          <span class="media-item-time">{{item.modTime}}</span>
        </div>
        <el-button class="media-item-button" size="mini" type="success" @click="handleSelect(item)">选择</el-button>
        <i :class="{'media-item-checked': value.id === item.id}" class="el-icon-circle-check"></i>
      </el-card>
    </section>

    <!-- 标签列表页码 -->
    <template slot="footer">
      <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
        layout="total, prev, pager, next, jumper" >
      </el-pagination>
    </template>
  </table-wrapper>

</template>

<script>
import * as ActMaterialApi from '@/api/material/ActMaterialApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'TagSelectBox',
  components: { TableWrapper },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      searchType: this.value.type || 'ICON',
      searchText: '',
      // ---数据
      mediaTypes: [
        { label: '图标-ICON', value: 'ICON' },
        { label: '缩略图-THUMB', value: 'THUMB' },
        { label: '海报-POSTER', value: 'POSTER' },
        { label: '语音-VOICE', value: 'VOICE' },
        { label: '视频-VIDEO', value: 'VIDEO' }
      ],
      dataList: [],
      mediaItemStyle: {}
    }
  },
  created () {
    this.handleSearch()
  },
  watch: {
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
      this.doSearch()
    },
    doSearch () {
      let options = Object.assign({ type: this.searchType, srcName: this.searchText }, this.page)
      ActMaterialApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // -------
    handleSelect (row) {
      let val = {
        id: row.id,
        url: row.url,
        type: row.type
      }
      this.$emit('change', val)
    },
    // ---新增素材
    handleAddMaterial () {
      this.$router.push({ name: 'ActMaterial', query: {} })
    },
    // 查看素材。暂无使用
    handleMediaClick () {}
  }
}
</script>

<style lang="scss" scoped>
$card_width: 170px;
$card_height: 242px;

.media-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .media-item {
    position: relative;
    margin: 10px;
    width: $card_width;
    height: $card_height;
    .media-item-body {
      display: block;
      width: $card_width;
      height: $card_width;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
      }
      > svg {
        margin: 25%;
        width: 50%;
        height: 50%;
        cursor: pointer;
      }
    }
    .media-item-footer {
      padding: 0 8px;
      width: 100%;
      height: $card_height - $card_width;
      .meida-item-title{
        overflow: hidden;
        width: 100%;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .media-item-time {
        display: block;
        font-size: 13px;
        color: #999;
      }
    }
    .media-item-button {
      display: none;
      position: absolute;
      left: 0;
      bottom: 3px;
      width: 100%;
    }
    &:hover {
      .media-item-button {
        display: block !important;
      }
    }
    .media-item-checked {
      position: absolute;
      top: $card_width;
      right: 3px;
      font-size: 24px;
      color: green;
    }
  }
}
.show_img_size{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
</style>
