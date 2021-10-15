<template>
  <div class="date-range">
    本期：
    <template v-if="!noRange">
      <el-date-picker
        v-model="begin"
        :style="{width:'150px',margin:'10px 0'}"
        size="mini"
        :clearable="false"
        :picker-options="{firstDayOfWeek:1}"
        :format="format[type]"
        :type="type.toLowerCase()"
        placeholder="选择日期"
      />
      -
    </template>
    <el-date-picker
      v-model="end"
      :style="{width:'150px',margin:'10px 0'}"
      size="mini"
      :clearable="false"
      :picker-options="{firstDayOfWeek:1}"
      :format="format[type]"
      :type="type.toLowerCase()"
      placeholder="选择日期"
    />
    <br>
    <template v-if="!noTq">
      同期：
      <template v-if="!noRange">
        <el-date-picker
          v-model="beginTq"
          :style="{width:'150px',margin:'10px 0'}"
          size="mini"
          :clearable="false"
          :picker-options="{firstDayOfWeek:1}"
          :format="format[type]"
          :type="type.toLowerCase()"
          placeholder="选择日期"
        />
        -
      </template>
      <el-date-picker
        v-model="endTq"
        :style="{width:'150px',margin:'10px 0'}"
        size="mini"
        :clearable="false"
        :picker-options="{firstDayOfWeek:1}"
        :format="format[type]"
        :type="type.toLowerCase()"
        placeholder="选择日期"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    type: {
      type: String,
      default: 'DATE'
    },
    noTq: {
      type: Boolean,
      default: false
    },
    noRange: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      //
      begin: null,
      end: null,
      beginTq: null,
      endTq: null,
      format: {
        DATE: 'yyyy-MM-dd',
        WEEK: 'yyyy 第 WW 周',
        MONTH: 'yyyy 第 MM 月',
        YEAR: 'yyyy 年'
      }
    }
  },
  watch: {
    begin () {
      this.submit()
    },
    end () {
      this.submit()
    },
    beginTq () {
      this.submit()
    },
    endTq () {
      this.submit()
    }
  },
  created () {
    //
    this.begin = this.value.begin
    this.end = this.value.end
    this.beginTq = this.value.beginTq
    this.endTq = this.value.endTq
  },
  methods: {
    //
    submit () {
      this.$emit('input', {
        begin: this.noRange ? this.end : this.begin,
        end: this.end,
        beginTq: this.noRange ? this.endTq : this.beginTq,
        endTq: this.endTq
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
