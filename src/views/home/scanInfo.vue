<template>
  <div class="line_echarts_out">
      <div class="line_echarts_inner">

      </div>
  </div>
</template>
<script>
import * as homeApi from '@/api/home/index.js'
import ECharts from 'echarts'
export default {
  data () {
    return {
      prizeNumList: [],
      echartMap: null
    }
  },
  props: ['publicParams'],
  components: {
  },
  watch: {
    activeId () {
      this.getSmokeScanInfo()
    }
  },
  mounted () {
    this.getSmokeScanInfo()
  },
  methods: {
    getSmokeScanInfo () {
      homeApi.getSmokeScanInfo({ ...this.publicParams }).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.setHistogramBox('.bottom_histogram_box', '活动扫码人数统计(单位/人)', res.value.sort((a, b) => {
          return a.scanCnt - b.scanCnt
        }))
      })
    },

    // 卷烟规格活动扫码人数统计
    setHistogramBox (box, title, dataList) {
      let myChart = ECharts.init(document.querySelector(box))
      let length = 0
      if (dataList.length > 8) {
        length = 100 - (800 / dataList.length).toFixed(0)
      }
      let color = ['#DAA3FF', '#FF94C1', '#75B1FF', '#FCAD3D', '#FF8A8A', '#FF94C1']
      let option = {
        color: ['#56D9B2', '#FF625B', '#60D0FF', '#FFC44C'],
        title: {
          text: title,
          left: 10,
          textStyle: {
            fontSize: 14
          },
          padding: [5, 0, 0, 0]
        },
        tooltip: {
          transitionDuration: 0,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: false
        },
        grid: {
          left: 0,
          right: 40,
          top: 28,
          bottom: 0,
          // height: 135,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          position: 'top',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: dataList.map(res => res.name)
        },
        dataZoom: {
          show: true,
          type: 'slider',
          orient: 'vertical',
          backgroundColor: 'rgba(0, 255, 255, 0.3)', // 组件的背景颜色
          fillerColor: 'rgba(0, 255, 255, 0.9)', // 选中范围的填充颜色。
          borderColor: 'white', // 边框颜色。
          width: 20, // 组件高度
          top: '40%', // 左边的距离
          bottom: 0, // 右边的距离
          right: 0, // 右边的距离
          zoomLock: true, // 只能移动窗口，不能缩放窗口
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          start: length,
          end: 100
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: function (param) {
                return color[param.dataIndex % 6] || '#5470c6'
              }
            },
            data: dataList.map(res => res.scanCnt)
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.line_echarts_out{
    height: 100%;
    .line_echarts_inner{
        height: 100%;
    }
}
</style>
