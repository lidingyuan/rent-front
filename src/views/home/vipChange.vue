<template>
  <div class="user_change_line_out">
      <div class="user_change_line_inner">

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
  props: ['timeParams'],
  components: {
  },
  watch: {
    timeParams () {
      this.getVipNumUserInfo()
    }
  },
  mounted () {
    this.getVipNumUserInfo()
  },
  methods: {
    // 获取新消费者会员数量
    getVipNumUserInfo () {
      homeApi.getVipNumUserInfo(this.timeParams).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.setUserVipNum('.user_change_line', '新消费者会员变化情况', res.value)
      })
    },
    // 新消费者会员变化情况
    setUserVipNum (box, title, dataList) {
      let myChart = ECharts.init(document.querySelector(box))
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
          top: 15,
          left: 'center',
          show: true,
          itemWidth: 15,
          itemHeight: 12,
          textStyle: {
            fontSize: 11
          },
          data: [
            { name: '新消费者会员' }, { name: '新消费者会员增速' }
          ]
        },
        grid: {
          top: 50,
          left: 0,
          right: 10,
          bottom: 0,
          // height: 110,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          data: dataList.map(res => res.registMonth)
        },
        yAxis: [
          {
            type: 'value',
            name: '人',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 万人'
            }
          },
          {
            type: 'value',
            name: '%',
            min: 0,
            max: 150,
            interval: 30,
            axisLabel: {
              formatter: '{value} '
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
          width: 70, // 组件高度
          height: 14,
          top: 5, // 左边的距离
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
            name: '新消费者会员',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: new ECharts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#60C5FF' },
                  { offset: 1, color: '#428AF5' }
                ] // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
              ),
              barBorderRadius: [ 50, 50, 0, 0 ]
            },
            data: dataList.map(res => { return (res.registAdd / 10000).toFixed(0) })
          },
          {
            name: '新消费者会员增速',
            type: 'line',
            yAxisIndex: 1,
            data: dataList.map(res => {
              return (res.registYoy * 100).toFixed(0)
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
.user_change_line_out{
    height: 100%;
    .user_change_line_inner{
        height: 100%;
    }
}
</style>
