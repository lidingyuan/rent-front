<template>
  <div class="prize_num">
      <div class="prize_num_inner">

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
      this.getPrizeSend()
    }
  },
  mounted () {
    this.getPrizeSend()
  },
  methods: {
    getPrizeSend () {
      homeApi.getPrizeSend({ actId: this.activeId }).then(res => {
        if (res.code !== 0 || res.value === null) {
          this.setPrizeSend('.prize_num_inner', '奖项和奖品数量', [])
          return
        }
        this.prizeNumList = res.value
        this.setPrizeSend('.prize_num_inner', '奖项和奖品数量', res.value.sort((a, b) => {
          return a.rank - b.rank
        }))
      })
    },
    setPrizeSend (box, title, dataList) {
      this.echartMap = ECharts.init(document.querySelector(box))
      let option = {
        color: ['#FF7E7E', '#60D0FF', '#FFC44C'],
        title: {
          text: title,
          left: 10,
          top: 0,
          textStyle: {
            fontSize: 14
          },
          padding: [0, 0, 0, 0]
        },
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0,
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
          top: 35,
          left: 0,
          right: 10,
          bottom: 0,
          // height: 125,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          data: dataList.map(res => res.name)
        },
        yAxis: { type: 'value' },
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
          showDataShadow: true, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          startValue: 0
          // end: 100
        },
        series: [
          {
            name: '奖品总数',
            type: 'bar',
            barWidth: 12,
            data: dataList.map(res => res.planNum)
          },
          {
            name: '发放数量',
            type: 'bar',
            barWidth: 12,
            data: dataList.map(res => {
              return res.winCnt
            })
          }
        ]
      }
      this.echartMap.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.prize_num{
    height: 100%;
    .prize_num_inner{
        height: 100%;
    }
}
</style>
