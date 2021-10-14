<template>
  <div class="out_box">
    <div class="home_box">
      <div class="top_box">
        <div class="left_title">活动监控</div>
        <div>活动累计开展：<span class="first_color">{{totalActiveCnt}}</span>场 <span class="is_pending">当前进行：<span class="second_color">{{processingCnt}}</span>场</span></div>
        <div>积分商城兑换订单累计：<span class="first_color">{{totalOrderCnt}}</span>单<span class="is_pending">近30日累计：<span class="third_color">{{monthOrderCnt}}</span>单</span></div>
        <div class="title_box">
          <el-select v-model="selectValue" size="mini" placeholder="请选择" @change='selectMap'>
            <el-option
            v-for="item in actDistrictCnt"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker
            size="mini"
            v-model="timeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format='yyyy-MM-dd HH:mm:ss'
            @change='changeDate'
          >
          </el-date-picker>
        </div>
      </div>
      <div class="inner_box">
          <!-- 左边部分 -->
        <div class="public_height left_out_box">
          <div class="title">
              活动总计
          </div>
          <div class="top_pie_box">
            <div class="two_img_box">
              <div class="first_box"></div>
              <div class="second_box"></div>
            </div>
            <div class="right_list_box">
              <div class="module_title_box">
                  活动名称
              </div>
              <div class="active_data_box" v-if='swiperDataList.length>0'>
                <swiper :options="swiperOption" ref="mySwiper">
                  <swiper-slide  v-for='(item,index) of swiperDataList' :key="'swiper'+index">{{item.name}}</swiper-slide>
                </swiper>
              </div>
            </div>
          </div>
          <div class="center_slider_box">
              <header class="title">活动场次统计(单位/次)</header>
              <div class="public_demo">
                  <div class="left_demo">
                      <div class="box_square"></div>进行中
                  </div>
                  <div class="right_demo">
                      <div class="box_square"></div>已结束
                  </div>
              </div>
              <div class="content_time_list_box">
                <ul class="time_inner">
                  <li class="time_item" v-for="(item,index) of timesDataList" :key='"time"+index'>
                      <div class="left_name">{{item.name}}</div>
                      <div class="right_box">
                          <div class="is_pending" :style='{width:item.leftWidth}' :class="{'have_space':1}">{{item.overCnt}}</div>
                          <div class="is_end" :style='{width:item.rightWidth}' v-if='1'>{{item.processingCnt}}</div>
                      </div>
                  </li>
                </ul>
              </div>
          </div>
          <div class="bottom_histogram_box">
            <scanInfo v-if='showSmokeInfo' :publicParams='publicParams'></scanInfo>
          </div>
          </div>
          <!-- 中间的部分 -->
          <div class="public_height center_out_box" >
              <div class="top_map_box">
                  <ul class="word_box">
                      <li><div>本月活动累计：<span>{{monthCnt}}</span>场</div></li>
                      <li><div>本月泰山币累计发放：<span>{{monthPlusPoint}}万</span></div></li>
                      <li><div>本日活动累计：<span>{{todayCnt}}</span>场</div></li>
                      <li><div>本日泰山币累计发放：<span>{{todayPlusPoint}}万</span></div></li>
                  </ul>
                  <div class="map_content" ref='topMapBox'></div>
              </div>
              <div class="center_word_out"></div>
              <div class="bottom_table_box">
                  <div class="title_word">重点规格扫码情况</div>
                  <div class="table_content_box">
                      <div class="table_item table_item_title">
                          <div :class="['public_row','row_'+index]" v-for="(item,index) of tableTitle" :key='"title"+index'>{{item}}</div>
                      </div>
                      <ul class="public_table_box">
                          <li class="table_item" v-for="(item,index) of tableData" :key="'item'+index">
                            <div :class="['public_row','row_0']">{{index+1}}</div>
                            <div :class="['public_row','row_1']">{{item.tobaName}}</div>
                            <div :class="['public_row','row_2']">{{item.scanCntDay}}</div>
                            <div :class="['public_row','row_3']">{{item.scanYoyWeek}}</div>
                            <div :class="['public_row','row_4']">{{item.scanRateWeek}}</div>
                            <div :class="['public_row','row_6']">{{item.scanCntMonth}}</div>
                            <div :class="['public_row','row_7']">{{item.scanYoyMonth}}</div>
                            <div :class="['public_row','row_8']">{{item.scanRateMonth}}</div>
                          </li>
                      </ul>
                  </div>
                  <div class="line_echarts_box">
                    <smokeActiveInfo :publicParams='publicParams' v-if='showSmokeInfo'></smokeActiveInfo>
                  </div>
              </div>
          </div>
          <!-- 右边的部分 -->
          <div class="public_height right_out_box">
            <div class="public_title">泰山家园</div>
            <div class="user_change">
              <div class="user_core_info">
                <div class="title">会员数</div>
                <div class="all_user_info">
                  <div class="new_user" :style="{right:addPercent+'%'}">{{registAddNum }}人</div>{{registCntNum}}人
                </div>
                <div class="all_user_info word_box">
                  <div class="new_user" :style="{right:addPercent+'%'}"><span>近30日新增</span></div><span>累计会员</span>
                </div>
                <div class="title">泰山币</div>
                <div class="all_user_info all_core_info">
                  <div class="new_user new_core" :style="{right:noUsePercent+'%'}">{{unusedPointNum}}</div>{{totalPlusPointNum}}
                </div>
                <div class="all_user_info word_box">
                  <div class="new_user new_core" :style="{right:addPercent+'%'}"><span>待使用</span></div><span>累计发放</span>
                </div>
              </div>
              <div class="user_change_line">
                <vipChange :timeParams='timeParams' v-if='timeParams'></vipChange>
              </div>
            </div>
              <!-- <div class="public_title">抽奖类数据详情</div> -->
              <div class="prize_change">
                <div class="title_box">
                  <el-select v-model="activeId" size="mini" placeholder="请选择" @change='selectActiveId'>
                    <el-option
                    v-for="item in activeDataList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="top_prize_num">
                  <prizeNum  :activeId='activeId' v-if='activeId'></prizeNum>
                </div>
                <div class="time"><span>开始时间：{{beginTime}}</span><span>结束时间：{{endTime}}</span></div>
                <div class="bottom_prize_pencent_num">
                  <prizePercent  :activeId='activeId' v-if='activeId'></prizePercent>
                </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import prizeNum from './prizeNum.vue'
import scanInfo from './scanInfo.vue'
import vipChange from './vipChange.vue'
import prizePercent from './prizePercent.vue'
import smokeActiveInfo from './smokeActiveInfo.vue'
import ECharts from 'echarts'
import china from 'echarts/map/json/china'
import * as homeApi from '@/api/home/index.js'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/grid'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  data () {
    return {
      swiperOption: {
        autoplay: {
          delay: 1000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        loop: true,
        slidesPerView: 10,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        direction: 'vertical'
      },
      publicParams: {
        'beginDate': '2020-10-01 00:00:00',
        'endDate': '2021-01-24 00:00:00',
        'provCode': '000000'
      },
      activeDataList: [],
      swiperDataList: [],
      timesDataList: [
      ],
      tableTitle: [
        '序号', '卷烟规格', '日扫码量', '周环比%', '周扫码率', '月扫码量', '月环比%', '月扫码率'
      ],
      tableData: [],
      echartMap: null,
      registCnt: 0,
      registAdd: 0,
      registAddNum: 0,
      unusedPoint: 0,
      unusedPointNum: 0,
      totalPlusPoint: 0,
      totalPlusPointNum: 0,
      registCntNum: 0,
      activeId: '',
      beginTime: '',
      endTime: '',
      selectValue: '000000',
      actDistrictCnt: [{ name: '全国', id: '000000' }],
      totalOrderCnt: 0,
      monthOrderCnt: 0,
      processingCnt: 0,
      totalActiveCnt: 0,
      timeValue: [new Date('2020-01-01'), new Date()],
      todayCnt: 0,
      monthCnt: 0,
      monthPlusPoint: '',
      todayPlusPoint: '',
      showSwiper: !false,
      prizeNumList: [],
      timeParams: null,
      showSmokeInfo: false
    }
  },
  computed: {
    addPercent: function () {
      let percent = ((this.registCnt - this.registAdd) / this.registCnt * 100).toFixed(0)
      percent = percent > 78 ? 78 : percent
      return percent
    },
    noUsePercent: function () {
      let percent = ((this.totalPlusPoint - this.unusedPoint) / this.totalPlusPoint * 100).toFixed(0)
      percent = percent > 78 ? 78 : percent
      return percent
    }
  },
  components: {
    swiper,
    swiperSlide,
    prizeNum,
    prizePercent,
    smokeActiveInfo,
    vipChange,
    scanInfo
  },
  mounted () {
    this.changeDate([this.getTime(new Date('2020-01-01')), this.getTime(new Date())])
  },
  methods: {
    getTime (date) {
      let time = new Date(date)
      let month = time.getMonth() > 8 ? time.getMonth() + 2 : '0' + (time.getMonth() + 1)
      let day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
      let hours = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
      let minitues = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
      let seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
      let dateTime = `${time.getFullYear()}-${month}-${day} ${hours}:${minitues}:${seconds}`
      return dateTime
    },
    init () {
      this.getActiveInfo(this.publicParams)
      // this.getSmokeScanInfo()
      this.getDayWeekMonthScanInfo()
      this.getVipNumUserInfo()
      this.getVipUserNum()
      this.getIntegralNum()
      this.getOrderNum()
      this.showSmokeInfo = true
      // Promise.all[fn1,fn2,fn3,fn4,fn5,fn6,fn7]
    },
    selectActiveId (value) {
      this.activeId = value
      this.activeDataList.forEach(res => {
        if (res.id === value) {
          this.beginTime = res.beginTime.split(' ')[0]
          this.endTime = res.endTime.split(' ')[0]
        }
      })
    },
    selectMap (data) {
      this.mapInfo = data
      this.$set(this.publicParams, 'provCode', data)
      this.init()
    },
    changeDate (date) {
      this.beginTime = date[0].split(' ')[0]
      this.endTime = date[1].split(' ')[0]
      this.$set(this.publicParams, 'beginDate', date[0])
      this.$set(this.publicParams, 'endDate', date[1])
      this.init()
    },
    getActiveInfo (data) {
      homeApi.getActiveInfo(data).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.totalActiveCnt = res.value.actCnt.totalCnt
        this.processingCnt = res.value.actCnt.processingCnt
        this.todayCnt = res.value.actCnt.todayCnt
        this.monthCnt = res.value.actCnt.monthCnt
        if (res.value.actList != null && res.value.actList.length) {
          this.activeId = res.value.actList[0].id
          this.beginTime = res.value.actList[0].beginTime.split(' ')[0]
          this.endTime = res.value.actList[0].endTime.split(' ')[0]
          this.activeDataList = res.value.actList.filter(res => {
            return JSON.parse(res.type)[0] === '03'
          })
          this.swiperDataList = [...res.value.actList]
        }
        this.setBuniessInfo('.first_box', '活动类别', [
          { value: res.value.actTypeCnt.tuikeCnt, name: '推客' },
          { value: res.value.actTypeCnt.scanCnt, name: '扫码' },
          { value: res.value.actTypeCnt.collectCnt, name: '采集' },
          { value: res.value.actTypeCnt.othersCnt, name: '其他' }
        ])

        this.setBuniessInfo('.second_box', '进行中活动类型', [
          { value: res.value.actTypeProcessingCnt.tuikeCnt, name: '推客' },
          { value: res.value.actTypeProcessingCnt.scanCnt, name: '扫码' },
          { value: res.value.actTypeProcessingCnt.collectCnt, name: '采集' },
          { value: res.value.actTypeProcessingCnt.othersCnt, name: '其他' }
        ])
        if (res.value.actTobaccoCnt && res.value.actTobaccoCnt.length) {
          this.setTimeDataList(res.value.actTobaccoCnt)
        }
        if (res.value.actDistrictCnt instanceof Array) {
          this.actDistrictCnt = [{ name: '全国', id: '000000' }, ...this.setMapData(res.value.actDistrictCnt)]
          this.setMapInfo('.top_map_box', '活动开展情况一览', this.setMapData(res.value.actDistrictCnt))
          console.log(this.actDistrictCnt)
        }
      })
    },
    getDayWeekMonthScanInfo () {
      homeApi.getDayWeekMonthScanInfo({ ...this.publicParams }).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.tableData = res.value.map(reschild => {
          reschild.scanYoyWeek = this.setNumToFixed(reschild.scanYoyWeek)
          reschild.scanRateWeek = this.setNumToFixed(reschild.scanRateWeek)
          reschild.scanYoyMonth = this.setNumToFixed(reschild.scanYoyMonth)
          reschild.scanRateMonth = this.setNumToFixed(reschild.scanRateMonth)
          return reschild
        })
      })
    },
    setNumToFixed (data) {
      if (typeof (data) === 'number') {
        return data.toFixed(2)
      } else {
        return data
      }
    },
    // 获取新消费者会员数量
    getVipNumUserInfo () {
      let beginList = this.beginTime.split('-')
      let endList = this.endTime.split('-')
      let beginMonth = `${beginList[0]}${beginList[1]}`
      let endMonth = `${endList[0]}${endList[1]}`
      this.timeParams = { 'beginMonth': beginMonth, 'endMonth': endMonth }
    },
    // 30天和会员总数
    getVipUserNum () {
      homeApi.getVipUserNum({}).then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.registAdd = res.value.registAdd
        this.registAddNum = this.toThousands(res.value.registAdd)
        this.registCntNum = this.toThousands(res.value.registCnt)
        this.registCnt = res.value.registCnt
      })
    },
    toThousands (num) {
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    // 获取积分
    getIntegralNum () {
      homeApi.getIntegralNum().then(res => {
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.unusedPoint = res.value.unusedPoint
        this.unusedPointNum = this.toThousands(res.value.unusedPoint)
        this.totalPlusPointNum = this.toThousands(res.value.totalPlusPoint)
        this.totalPlusPoint = res.value.totalPlusPoint
        this.monthPlusPoint = (res.value.monthPlusPoint / 10000).toFixed(0)
        this.todayPlusPoint = (res.value.todayPlusPoint / 10000).toFixed(0)
      })
    },
    // 获得订单数量
    getOrderNum () {
      homeApi.getOrderNum({}).then(res => {
        console.log(res)
        if (res.code !== 0 || res.value === null) {
          return
        }
        this.totalOrderCnt = res.value.totalCnt
        this.monthOrderCnt = res.value.monthCnt
      })
    },
    // 设置场次的百分比
    setTimeDataList (data) {
      this.timesDataList = data.map(res => {
        let all = res.overCnt + res.processingCnt
        res.all = res.overCnt + res.processingCnt
        let left = (res.overCnt / all * 100).toFixed(0)
        let right = (res.processingCnt / all * 100).toFixed(0)
        if (left < 10) {
          left = 10
          right = 90
        } else if (left > 90) {
          left = 90
          right = 10
        }
        res.leftWidth = left + '%'
        res.rightWidth = right + '%'
        return res
      })
    },
    // 活动类别
    // 进行中活动类型
    setBuniessInfo (box, title, datalist) {
      let myChart = ECharts.init(document.querySelector(box))
      let option = {
        color: ['#56D9B2', '#FF625B', '#60D0FF', '#FFC44C'],
        title: {
          text: title,
          left: 10,
          textStyle: {
            fontSize: 14
          },
          padding: [10, 0, 0, 0]
        },
        tooltip: {
          trigger: 'item',
          transitionDuration: 0
        },
        legend: {
          orient: 'vertical',
          left: 5,
          bottom: 5,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            lineHeight: 5,
            fontSize: 10
          },
          itemGap: 5,
          data: datalist.map(res => {
            return res.name
          }),
          icon: 'circle'
        },
        series: [
          {
            type: 'pie',
            startAngle: 0,
            radius: ['0%', '55%'],
            avoidLabelOverlap: true,
            label: {
              fontSize: 11,
              align: 'left',
              show: true
            },
            left: 30,
            labelLine: {
              length: 5,
              length2: 10
            },
            data: datalist
          }
        ]
      }
      myChart.setOption(option)
    },
    // 活动开展情况一览
    setMapInfo (className, title, datalist) {
      this.echartMap = ECharts.init(this.$refs.topMapBox)
      ECharts.registerMap('china', china)
      let option = {
        title: {
          text: title,
          left: 10,
          textStyle: {
            fontSize: 14
          },
          padding: [8, 0, 0, 0]
        },
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: 80,
          inRange: {
            color: ['#FFF7E5', '#FFEECC', '#FFDB92', '#FFC44C']
          },
          seriesIndex: 0,
          splitNumber: 4,
          itemHeight: 10,
          calculable: false
        },
        // geo:{},
        tooltip: {
          transitionDuration: 0,
          show: true,
          type: 'piecewise',
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderColor: 'rgba(255, 174, 92, 1)',
          borderWidth: '0.5px',
          textStyle: {
            color: '#000'
          },
          formatter: function (res) {
            if (res.data !== undefined) {
              return res.name + '累计开展' + ':' + res.value + '场'
            } else {
              return res.name + ':' + 0
            }
          }
        },
        datasetIndex: 1,
        series: [
          {
            name: '省级',
            roam: false,
            type: 'map',
            map: 'china',
            mapType: 'china',
            nameProperty: 'name',
            data: datalist
          }
        ]
      }
      this.echartMap.setOption(option)
    },
    // 设置地图参数
    setMapData (data) {
      const dataList = data.map((res, index) => {
        return { name: res.provName.replace(/内蒙古自治区/g, '内蒙古').replace(/新疆维吾尔自治区/g, '新疆').replace(/西藏自治区/g, '西藏').replace(/宁夏回族自治区/g, '宁夏').replace(/广西壮族自治区/g, '广西').replace(/省|市|区/g, ''),
          id: res.provCode,
          value: [res.cnt || 0, res.cnt || 0, res.cnt || 0] }
      })
      return dataList
    }
    // arraySearch (name) {
    //   for (let pin in pinyin) {
    //     if (pinyin[pin].indexOf(name) !== -1) {
    //       return pin
    //     }
    //   }
    //   return false
    // }
  }
}
</script>
<style lang="scss" scoped>
*{
  list-style: none;
  padding: 0;
  margin: 0;
}
::-webkit-scrollbar {
  width: 2px;
  height: 10px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(179, 39, 39, 0);
    border-radius: 5px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(148, 133, 133, 0.8);
    -webkit-box-shadow: inset 0 0 0px #ccc;
}
.out_box{
  overflow: auto;
  width: calc(100% - 0px);
  height: calc(100vh - 90px - 2rem);
}
.home_box{
  background: #fff;
  width: 100%;
  height: 100%;
  min-width:1225px;
  min-height: 800px;
  padding: 10px;
  box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
  border-radius: 6px;
  display: flex;
  flex-direction:column;
  .top_box{
    padding: 4px 4px  4px ;
    line-height: 26px;
    box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    .left_title{
      font-weight: 600;
      font-size: 14px;
    }
    .is_pending{
      padding-left: 30px;
    }
    .title_box{
      .el-select{
        width: 90px;
        margin-right: 10px;
      }
      .el-date-editor{
        width: 350px;
      }
      flex-shrink: 0;
      width: 450px;
    }
    .first_color{
      color: #616478;
      font-weight: bold;
    }
    .second_color{
      font-weight: bold;
      color: #60D0FF;
    }
    .third_color{
      font-weight: bold;
      color: #FFC44C;
    }
    }
    .inner_box{
      flex-grow: 1;
      display: flex;
      .public_height{
         height: 100%;
         flex-grow: 1;
      }
      .left_out_box{
        width: 240px;
      }
      .center_out_box{
        width: 375px;
        margin-left: 10px;
      }
      .right_out_box{
        width: 210px;
        margin-left: 10px;
      }
    }
    .left_out_box{
      display: flex;
      flex-direction: column;
      .title{
        height: 20px;
        font-size: 14px;
        font-weight: 600;
      }
        .top_pie_box{
            flex-grow: 1;
            height: 296px;
            margin-bottom: 2%;
            display: flex;
            .two_img_box{
                height: 100%;
                float: left;
                width: 135px;
                padding-right: 10px;
                flex-grow: 2;
                .first_box{
                    width: 100%;
                    height: 48%;
                    margin-bottom: 4%;
                    background: #fff;
                    box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
                    border-radius: 6px;
                }
                .second_box{
                    width: 100%;
                    height: 48%;
                    background: #fff;
                    box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
                    border-radius: 6px;
                }
            }
            .right_list_box{
                height: 100%;
                width: 110px;
                float: right;
                flex-grow: 1;
                background: #fff;
                box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                .module_title_box{
                    height: 30px;
                    line-height: 30px;
                    padding-left: 10px;
                    font-size: 14px;
                    font-weight: 600;
                }
                .active_data_box{
                  // flex-grow: 1;
                  padding-left: 10px;
                  overflow: hidden;
                  font-size: 12px;
                  height: calc(100% - 30px);
                  .swiper-container{
                    width: 100%;
                    height: 100%;
                    .swiper-wrapper{
                      width: 100%;
                      height: 100%;
                      .swiper-slide{

                        // line-height: 40px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      }
                    }
                  }
                  .active_item{
                    height: 24px;
                    font-size: 14px;
                    line-height: 24px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
            }
        }
        .center_slider_box{
            flex-grow: 1;
            height: 130px;
            margin-bottom: 2%;
            background: #FFFFFF;
            box-shadow: 0px 0px 10px 0px rgba(31, 32, 41, 0.1);
            border-radius: 5px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            .title{
                font-size: 14px;
                line-height: 20px;
                font-weight: 600;
            }
            .public_demo{
                display: flex;
                justify-content: center;
                line-height: 20px;
                height: 20px;
                .left_demo{
                    font-size: 12px;
                    margin-right: 20px;
                    .box_square{
                        float: left;
                        width: 10px;
                        height: 10px;
                        background: #60D0FF;
                        margin-right: 6px;
                        margin-top: 4px;
                    }
                }
                .right_demo{
                    font-size: 12px;
                    .box_square{
                        float: left;
                        width: 10px;
                        height: 10px;
                        background: #FFDC94;
                        margin-right: 6px;
                        margin-top: 4px;
                    }

                }
            }
            .content_time_list_box{
                flex-grow: 1;
                overflow: auto;
                .time_inner{

                    .time_item{
                        display: flex;
                        .left_name{
                            width: 90px;
                            line-height: 14px;
                            font-size: 12px;
                            padding-right: 4px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        .right_box{
                            right:100px;
                            margin-bottom: 4px;
                            flex-grow: 1;
                            display: flex;
                            font-size: 12px;
                            text-align: center;
                            color: #fff;
                            line-height: 14px;
                            .have_space{
                                margin-right: 4px;
                            }
                            .is_pending{
                                background: #60D0FF;
                                border-radius: 10px;

                            }
                            .is_end{
                                background: rgba(255, 196, 76, 0.6);
                                border-radius: 10px;
                            }
                        }
                    }
                }
            }
        }
        .bottom_histogram_box{
            flex-grow: 1;
            height: 135px;
            background: #FFFFFF;
            box-shadow: 0px 0px 10px 0px rgba(31, 32, 41, 0.1);
            border-radius: 5px;
            padding: 10px;
            .title{
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
    .center_out_box{
        display: flex;
        flex-direction: column;
        .top_map_box{
            height: 250px;
            flex-grow: 1;
            position: relative;
            .word_box{
                position: absolute;
                // width: 160px;
                height: 100px;
                right: 10px;
                top: 60%;
                z-index: 1;
                transform: translateY(-50%);
                font-size: 12px;
                li{
                    height: 20px;
                    line-height: 20px;
                    div {
                        // transform: scale(0.8);
                    }
                }
            }
            .map_content{
                width: 90%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        .center_word_out{
            height: 20px;
            flex-grow: 0;
        }
        .bottom_table_box{
            ::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background: rgba(255, 221, 153, 1);
                -webkit-box-shadow: inset 0 0 3px #ccc;
            }
            padding: 10px;
            height: 280px;
            flex-grow: 1;
            box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            .title_word{
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
            }
            .table_content_box{
                height: 120px;
                flex-grow: 1;
                border: 1px solid #FFC44C;
                border-radius: 2px;
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
                .public_table_box{
                    line-height: 20px;
                    overflow-y: auto;
                    flex-grow: 1;
                }
                .table_item{
                    height: 20px;
                    font-size: 12px;
                    display: flex;
                    padding: 0 10px;
                    border-bottom: 1px dashed  #FFC44C;
                    .public_row{
                        text-align: center;
                        width: 30px;
                        flex-grow: 2;
                    }
                    .row_0{
                        width: 20px;
                        flex-grow: 1;
                    }
                    .row_1{
                        text-align: left;
                        width: 60px;
                        flex-grow: 2;
                        overflow: hidden;
                    }
                }
                .table_item_title{
                    height: 24px;
                    line-height: 24px;
                    border-bottom: 1px solid  #FFC44C;
                }
            }
            .line_echarts_box{
                height: 145px;
                flex-grow: 1;
            }
        }
    }
    .right_out_box{
        display: flex;
        flex-direction: column;
        .public_title{
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .user_change{
            flex-grow: 1;
            height: 250px;
            margin-bottom: 10px;
            box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            padding: 10px;
            .user_core_info{
                padding: 0px 10px 5px;
                margin-bottom: 5px;
                .title{
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                }
                .all_user_info{
                    padding-right: 10px;
                    height: 16px;
                    line-height: 16px;
                    text-align: right;
                    color: #fff;
                    font-size: 12px;
                    background: #99C5FF;
                    border-radius: 10px;
                    position: relative;
                    .new_user{
                        padding-right: 8px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background: linear-gradient(-90deg, #4C9AFF, #99C5FF);
                        border-radius: 10px;
                    }
                }

                .all_core_info{
                    background: #FFCC66;
                    .new_core{
                        background: linear-gradient(-90deg, #FFAA00, #FFCC66);
                    }
                }
                .word_box{
                    background: #fff;
                    color: #666;
                    font-size: 10px;
                    height: 18px;
                    margin-top: 5px;
                    span{
                        display: inline-block;
                        transform: scale(0.8);
                    }
                    .new_user{
                        border-radius: 0px;
                        padding: 0;
                        background: #fff;
                        color: #666;
                        border-right: 1px solid #4D9AFF;
                    }
                    .new_core{
                        border-right: 1px solid #FFAA01;
                    }
                }
            }
            .user_change_line{
                flex-grow: 1;
                .title{
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                }
            }
        }
        .prize_change{
            flex-grow: 1;
            height: 300px;
            box-shadow: 0px 0px 20px 0px rgba(31, 32, 41, 0.1);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            .title_box{
                padding-top: 5px;
                height: 35px;
            }
            .top_prize_num{
                height: 100px;
                flex-grow: 1;
            }
            .time{
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                text-align: center;
                color: #60D0FF;
                span{
                    padding-right: 20px;
                }
            }
            .bottom_prize_pencent_num{
                height:100px;
                flex-grow: 1;
            }
        }
    }
}
.right_out_box .el-select{
    float: right;
}
.el-select-dropdown__item{
    padding: 0 20px;
}

</style>
