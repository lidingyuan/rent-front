<template>
  <el-date-picker v-model="exCheckDate2" type="datetimerange" :picker-options="pickerOptions" class="datePickers"
    value-format="yyyy-MM-dd HH:mm:ss" @change="changeDatePicker(exCheckDate2)" :editable="false"
    size='small' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
  </el-date-picker>
</template>
<script>
export default {
  props: {
    value: {
      type: [Array],
      required: true
    },
    nowNum: {
      type: Number,
      default: 0
    },
    exCheckDate: {
      type: Array
    }
  },
  data () {
    return {
      exCheckDate2: [],
      minDate: '',
      maxDate: '',
      pickerOptions: {
        onPick: ({
          maxDate,
          minDate
        }) => {
          this.maxDate = maxDate
          this.minDate = minDate
        }
      }
    }
  },
  mounted () {
    this.getPassYearFormatDate()
  },
  methods: {
    /* 获取过去时间，并传值给现在时间 */
    getPassYearFormatDate () {
      var nowDate = new Date()
      var date = new Date(nowDate)
      // 这里修改天数，一年设置365，一个月设置30
      date.setDate(date.getDate() - 30)
      var seperator1 = '-'
      // var seperator2 = ':'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var formatDate = year + seperator1 + month + seperator1 + strDate + ' 00:00:00'
      this.getNowFormatDate(formatDate)
    },
    /* 获取现在时间，并接受过去时间的值 */
    getNowFormatDate (formatDate) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      // 修改时间
      var nowStrDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (nowStrDate >= 0 && nowStrDate <= 9) {
        nowStrDate = '0' + nowStrDate
      }
      var nowData = year + seperator1 + month + seperator1 + nowStrDate + ' 23:59:59'
      this.exCheckDate2 = [formatDate, nowData]
      this.$emit('changeDate', this.exCheckDate2)
    },
    changeDatePicker () {
      if (!this.exCheckDate2) {
        this.minDate = ''
        this.maxDate = ''
        return
      }
      this.$emit('input', this.exCheckDate2)
      this.$emit('change', this.exCheckDate2)
    }
  },
  watch: {
    exCheckDate2 (newVal, oldVal) {
      if (newVal === null || newVal === '') {
        this.$emit('changeDate', [])
      }
    },
    exCheckDate (newVal, oldVal) {
      this.exCheckDate2 = []
    }
  }
}
</script>
