<template>
  <div class="prize_pencent">
      <div class="prize_pencent_inner">

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
  props: ['activeId'],
  components: {
  },
  watch: {
    activeId () {
      this.getPrizePencent()
    }
  },
  mounted () {
    this.getPrizePencent()
  },
  methods: {
    // 获取奖品数量变化时序图
    getPrizePencent () {
      homeApi.getPrizePencent({ actId: this.activeId }).then(res => {
        if (res.code !== 0 || res.value === null) {
          this.setPrizePencent('.prize_pencent_inner', '中奖率', [])
          return
        }
        this.setPrizePencent('.prize_pencent_inner', '中奖率', res.value.sort((a, b) => {
          return a.rank - b.rank
        }))
      })
    },
    // 奖品数量变化时序图
    setPrizePencent (box, title, dataList) {
      let myChart = ECharts.init(document.querySelector(box))
      let option = {
        color: ['#FF7E7E', '#60D0FF', '#FFC44C'],
        title: {
          text: title,
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 14
          },
          padding: [0, 0, 0, 0]
        },
        tooltip: {
          transitionDuration: 0,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            fontSize: 10
          }
        },
        legend: {
          left: 'center',
          show: false
        },
        grid: {
          top: 55,
          left: 10,
          right: 10,
          bottom: 5,
          // height: 125,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          data: dataList.map(res => res.name)
        },
        yAxis: { type: 'value', name: '%' },
        dataZoom: {
          show: false,
          type: 'slider',
          orient: 'horizontal',
          backgroundColor: 'rgba(0, 255, 255, 0.3)', // 组件的背景颜色
          fillerColor: 'rgba(0, 255, 255, 0.9)', // 选中范围的填充颜色。
          borderColor: 'white', // 边框颜色。
          width: 70, // 组件高度
          height: 14,
          top: 5, // 左边的距离
          right: 10, // 右边的距离
          zoomLock: false, // 只能移动窗口，不能缩放窗口
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          startValue: 0
          // endValue: 5
        },
        series: [
          {
            name: '中奖率%',
            type: 'bar',
            barWidth: 12,
            data: dataList.map(res => (res.chance * 100).toFixed(2))
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.prize_pencent{
    height: 100%;
    .prize_pencent_inner{
        height: 100%;
    }
}
</style>
