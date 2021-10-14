<!--
  日期控件，增加了最大日期与最小日期扩展。
  月份格式：201810
  周格式：201844
  日格式：2018-12-20

  示例：
  <date-picker v-model="yearMonth" minValue=“201701” maxValue=“201810” type="month" placeholder="选择月" style="width:150px;" />
-->

<template>
  <el-date-picker
    v-model="date"
    :type="type"
    :format="format"
    :picker-options="pickerOptions"
    v-bind="$attrs"
    value-format="yyyy-MM-dd"
    @change="onChange" ></el-date-picker>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DatePicker',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值
    value: String,
    // 最大值
    maxValue: String,
    // 最小值
    minValue: String,
    // month or week
    type: {
      type: String,
      default: 'date',
      validator: (value) => {
        return ['month', 'week', 'date'].indexOf(value) !== -1
      }
    }
  },
  data () {
    var that = this
    return {
      date: new Date(),
      pickerOptions: {
        disabledDate (date) {
          return (that.maxDate && date <= that.maxDate) || (that.minDate && date >= that.minDate)
        }
      }
    }
  },
  computed: {
    maxDate () {
      return this.getDate(this.maxValue)
    },
    minDate () {
      return this.getDate(this.minValue)
    },
    labelFormat () {
      return { month: 'yyyy 年 MM 月', week: 'yyyy 年 WW 周', date: 'YYYY-MM-DD' }[this.type]
    },
    modelFormat () {
      return { month: 'YYYYMM', week: 'GGGGWW', date: 'YYYY-MM-DD' }[this.type]
    }
  },
  watch: {
    value (val) {
      this.date = this.getDate(val) || new Date()
    }
  },
  created () {
    // 设置初始值
    this.date = this.getDate(this.value) || new Date()
  },
  methods: {
    // 根据字符串（如201810， 201844），返回Date类型
    getDate (value) {
      if (!value) {
        return null
      }
      return moment(value, this.format).toDate()
    },
    onChange (newDate) {
      const val = moment(newDate).format(this.modelFormat)
      this.$emit('change', val)
    }
  }
}
</script>

<style>

</style>
