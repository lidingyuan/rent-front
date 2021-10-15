<template>
  <div
    class="input-box"
    @click="focus"
  >
    <div
      class="border"
      :class="{active}"
    >
      <div
        v-if="iconClass"
        class="input-icon"
        :class="iconClass"
      />
      <input
        ref="input"
        v-model="inputVal"
        :type="type"
        :placeholder="placeholder"
        @blur="active = false"
      >
    </div>
    <div
      v-if="type === 'verify'"
      class="verify"
    >
      <slot name="verify" />
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    icon: {
      type: String
    },
    placeholder: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number]
    }
  },
  data () {
    return {
      //
      active: false,
      inputVal: ''
    }
  },
  computed: {
    iconClass () {
      return this.icon ? [this.icon] : ''
    },
    inputType () {
      // 特殊this.type返回typeMap对应值，不然返回this.type本身
      const typeMap = {
        verify: 'text'
      }
      return typeMap[this.type] || this.type
    }
  },
  watch: {
    value: {
      handler () {
        this.inputVal = this.value
      },
      immediate: true
    },
    inputVal () {
      this.$emit('input', this.inputVal)
    }
  },
  created () {
    //
  },
  methods: {
    //
    focus () {
      this.active = true
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang='scss' scoped>
.input-box{
  background: #FFFFFF;
  display: flex;
  align-items: center;
  cursor: text;
  .border{
    width: 340px;
    height: 40px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #DDDDDD;
    &.active{
      border: 1px solid #3385FF;
    }
  }
  .input-icon{
    margin: 8px;
    width: 14px;
    height: 14px;
  }
  .username{
    background: url('~@/assets/img/login-username.png') no-repeat 0/100%;
  }
  .password{
    background: url('~@/assets/img/login-password.png') no-repeat 0/100%;
  }
  input{
    width: 0;
    flex-grow: 1;
    flex-shrink: 1;
    border: none;
    outline:none;
    background: transparent;
  }
  .verify{
    width: 158px;
    height: 40px;
    margin-left: 24px;
    flex-shrink: 0;
    text-align: right;
  }
}
</style>
