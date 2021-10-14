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
      this.getScanDrawCntInfo()
    }
  },
  mounted () {
    this.getScanDrawCntInfo()
  },
  methods: {
    //   获取卷烟开展活动情况
    getScanDrawCntInfo () {
      homeApi.getScanDrawCntInfo(this.publicParams).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        if (res.code === 0 && res.value && res.value.length > 0) {
          this.setActiveNum('.line_echarts_inner', '卷烟开展活动情况', res.value)
        }
      })
    },
    // 卷烟开展活动情况
    setActiveNum (box, title, dataList) {
      let myChart = ECharts.init(document.querySelector(box))
      let option = {
        color: ['rgba(96, 208, 255, 1)', '#60D0FF', '#FFC44C'],
        title: {
          text: title,
          left: 10,
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
          }
        },
        legend: {
          show: true,
          data: ['总扫码量', '扫码抽奖次数']
        },
        grid: {
          top: 50,
          left: 0,
          right: 10,
          bottom: 0,
          // height: 120,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          data: dataList.map(res => res.yearMonth)
        },
        yAxis: [
          {
            type: 'value',
            name: '总扫码量',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万'
            }
          },
          {
            type: 'value',
            name: '扫码抽奖次数',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万'
            }
          }
        ],
        dataZoom: {
          show: false,
          type: 'slider',
          orient: 'horizontal',
          backgroundColor: 'rgba(0, 255, 255, 0.3)', // 组件的背景颜色
          fillerColor: 'rgba(0, 255, 255, 0.9)', // 选中范围的填充颜色。
          borderColor: 'white', // 边框颜色。
          width: 100, // 组件高度
          height: 15,
          top: 0, // 左边的距离
          right: 0, // 右边的距离
          zoomLock: false, // 只能移动窗口，不能缩放窗口
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          startValue: 0
        },
        series: [
          {
            name: '总扫码量',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: new ECharts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#FFAF48' },
                  { offset: 1, color: '#FE6B26' }
                ] // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
              ),
              barBorderRadius: [ 50, 50, 0, 0 ]
            },
            data: dataList.map(res => {
              let num = (res.scanCnt / 10000).toFixed(0)
              return num
            })
          },
          {
            name: '扫码抽奖次数',
            type: 'line',
            yAxisIndex: 1,
            data: dataList.map(res => {
              let num = (res.drawCnt / 10000).toFixed(0)
              return num
            })
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
