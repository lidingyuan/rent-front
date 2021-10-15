<template>
  <div class="picker">
    <label
      class="picker-title"
      :class="labelClass"
    >{{ label }}</label>
    <el-popover
      v-model="showPopover"
      placement="bottom"
      trigger="click"
    >
      <el-tabs
        v-model="dateType"
        class="picker-tabs"
        type="card"
      >
        <el-tab-pane
          v-for="type in showTypeList"
          :key="type"
          :label="dataLabel[type]"
          :name="type"
        >
          <date-range
            v-model="dataStore[type]"
            :type="type"
            :no-tq="noTq"
            :no-range="noRange"
          />
          <div :style="{textAlign:'center',margin:'0 30px'}">
            <el-button
              :style="{width:'200px'}"
              type="success"
              size="mini"
              @click="submit(type)"
            >
              确定
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-button
        slot="reference"
        :style="{width: width,overflow:'hidden'}"
        size="mini"
      >
        {{ showStr }}
      </el-button>
    </el-popover>
  </div>
</template>

<script>

// import * as LastDateService from '@/core/service/LastDateService.js'
import DateRange from './DateRange'
import * as DateUtil from '@/core/utils/DateUtil'
export default {
  name: '',
  components: { DateRange },
  props: {
    // 需要展示的选择日期类型
    showTypeList: {
      type: Array,
      default: () => ['YEAR', 'MONTH', 'WEEK', 'DATE']
    },
    // 不需要同期
    noTq: {
      type: Boolean,
      default: false
    },
    // 不需要时间段，使用begin字段
    noRange: {
      type: Boolean,
      default: false
    },
    // 例：{type:'WEEK',begin:202001,end:202022,beginTq:202001,endTq:202022}
    value: {
      type: Object,
      default: null
    },
    // 选择框宽度
    width: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '查询日期：'
    },
    // 标签样式
    labelClass: {
      type: String
    },
    endDateType: {
      default: 'no1',
      type: String
    }
  },
  data () {
    return {
      //
      showPopover: false,
      dateType: this.showTypeList[this.showTypeList.length - 1],
      showStr: '',
      showPicker: false,
      daterange: [],
      baseDate: null,
      pickerOptions: {},
      dataLabel: {
        DATE: '按日查询',
        WEEK: '按周查询',
        MONTH: '按月查询',
        YEAR: '按年查询'
      },
      dataStore: {
        DATE: {
          begin: null,
          end: null,
          beginTq: null,
          endTq: null
        },
        WEEK: {
          begin: null,
          end: null,
          beginTq: null,
          endTq: null
        },
        MONTH: {
          begin: null,
          end: null,
          beginTq: null,
          endTq: null
        },
        YEAR: {
          begin: null,
          end: null,
          beginTq: null,
          endTq: null
        }
      }

    }
  },
  created () {
    this.initDate()
  },
  methods: {
    initDate () {
      // 传入了默认日期，则使用默认日期作为初始值
      const lastDate = DateUtil.format(new Date()).substr(0, 10)
      let end = new Date(lastDate.replace(/-/g, '/'))
      let start = new Date(lastDate.replace(/-/g, '/'))
      start.setMonth(0)
      start.setDate(1)
      this.dataStore.DATE.end = end
      this.dataStore.DATE.begin = this.noRange ? end : start
      this.dataStore.WEEK.end = end
      this.dataStore.WEEK.begin = this.noRange ? end : DateUtil.getWeekMonday(end.getFullYear() * 100 + 1)
      this.dataStore.MONTH.end = end
      this.dataStore.MONTH.begin = this.noRange ? end : start
      this.dataStore.YEAR.end = end
      this.dataStore.YEAR.begin = this.noRange ? end : start
      const lastDateTq = DateUtil.getDateTq(lastDate)
      end = new Date(lastDateTq.replace(/-/g, '/'))
      start = new Date(lastDateTq.replace(/-/g, '/'))
      start.setMonth(0)
      start.setDate(1)
      this.dataStore.DATE.endTq = end
      this.dataStore.DATE.beginTq = this.noRange ? end : start
      const endWeekDateTq = DateUtil.getWeekMonday(DateUtil.getWeekTq(Number(DateUtil.getYearWeek(this.dataStore.WEEK.end))))
      const startWeekDateTq = DateUtil.getWeekMonday(endWeekDateTq.getFullYear() * 100 + 1)
      this.dataStore.WEEK.endTq = endWeekDateTq
      this.dataStore.WEEK.beginTq = this.noRange ? endWeekDateTq : startWeekDateTq
      this.dataStore.MONTH.endTq = end
      this.dataStore.MONTH.beginTq = this.noRange ? end : start
      this.dataStore.YEAR.endTq = end
      this.dataStore.YEAR.beginTq = this.noRange ? end : start
      if (this.value && Object.keys(this.value).length > 0) {
        let begin = this.value.begin
        let end = this.noRange ? this.value.begin : this.value.end
        let beginTq = this.noTq ? this.value.begin : this.value.beginTq
        let endTq = this.noTq ? this.value.end : this.value.endTq
        if (this.value.type === 'DATE') {
          begin = new Date(begin.replace(/-/g, '/'))
          end = new Date(end.replace(/-/g, '/'))
          beginTq = new Date(beginTq.replace(/-/g, '/'))
          endTq = new Date(endTq.replace(/-/g, '/'))
        }
        if (this.value.type === 'WEEK') {
          begin = DateUtil.getWeekMonday(Number(begin))
          end = DateUtil.getWeekMonday(Number(end))
          beginTq = DateUtil.getWeekMonday(Number(beginTq))
          endTq = DateUtil.getWeekMonday(Number(endTq))
        }
        if (this.value.type === 'MONTH') {
          begin = new Date(parseInt(begin / 100) + '/' + (begin % 100) + '/01')
          end = new Date(parseInt(end / 100) + '/' + (end % 100) + '/01')
          beginTq = new Date(parseInt(beginTq / 100) + '/' + (beginTq % 100) + '/01')
          endTq = new Date(parseInt(endTq / 100) + '/' + (endTq % 100) + '/01')
        }
        if (this.value.type === 'YEAR') {
          begin = new Date(begin + '/01/01')
          end = new Date(end + '/01/01')
          beginTq = new Date(beginTq + '/01/01')
          endTq = new Date(endTq + '/01/01')
        }
        this.dataStore[this.value.type].begin = begin
        this.dataStore[this.value.type].end = end
        this.dataStore[this.value.type].beginTq = beginTq
        this.dataStore[this.value.type].endTq = endTq
        this.dateType = this.value.type
      }
      this.submit(this.dateType)
    },
    submit (type) {
      let begin = null
      let end = null
      let beginTq = null
      let endTq = null
      if (type === 'DATE') {
        begin = DateUtil.format(this.dataStore.DATE.begin.getTime()).substr(0, 10)
        end = DateUtil.format(this.dataStore.DATE.end.getTime()).substr(0, 10)
        beginTq = DateUtil.format(this.dataStore.DATE.beginTq.getTime()).substr(0, 10)
        endTq = DateUtil.format(this.dataStore.DATE.endTq.getTime()).substr(0, 10)
      }
      if (type === 'WEEK') {
        begin = DateUtil.getYearWeek(this.dataStore.WEEK.begin)
        end = DateUtil.getYearWeek(this.dataStore.WEEK.end)
        beginTq = DateUtil.getYearWeek(this.dataStore.WEEK.beginTq)
        endTq = DateUtil.getYearWeek(this.dataStore.WEEK.endTq)
      }
      if (type === 'MONTH') {
        begin = this.dataStore.MONTH.begin.getFullYear() * 100 + this.dataStore.MONTH.begin.getMonth() + 1
        end = this.dataStore.MONTH.end.getFullYear() * 100 + this.dataStore.MONTH.end.getMonth() + 1
        beginTq = this.dataStore.MONTH.beginTq.getFullYear() * 100 + this.dataStore.MONTH.beginTq.getMonth() + 1
        endTq = this.dataStore.MONTH.endTq.getFullYear() * 100 + this.dataStore.MONTH.endTq.getMonth() + 1
      }
      if (type === 'YEAR') {
        begin = this.dataStore.YEAR.begin.getFullYear()
        end = this.dataStore.YEAR.end.getFullYear()
        beginTq = this.dataStore.YEAR.beginTq.getFullYear()
        endTq = this.dataStore.YEAR.endTq.getFullYear()
      }
      const submitData = {
        type: type.toUpperCase(),
        begin,
        end,
        beginTq,
        endTq
      }
      let showStr = begin + (this.noRange ? '' : '~' + end)
      // 有同期加同期
      if (!this.noTq) {
        submitData.beginTq = beginTq
        submitData.endTq = endTq
        showStr = showStr + '　对比　' + beginTq + (this.noRange ? '' : '~' + endTq)
      }
      this.$emit('input', submitData)
      this.showStr = showStr
      this.showPopover = false
    }
  }
}
</script>
