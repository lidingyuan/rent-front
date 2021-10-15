<template>
  <div
    :style="style"
  >
    <el-card
      class="zl-card"
      style="margin:12px;widht:calc(100% - 24px);height:calc(100% - 24px);"
      :body-style="{padding:'16px',height:'calc(100% - 32px)'}"
    >
      <div class="header">
        <div class="tag" />
        <div class="name">
          {{ title }}
        </div>

        <el-button
          type="text"
          class="more"
        >
          {{ moreLabel }}<i class="el-icon-arrow-right el-icon--right" />
        </el-button>
      </div>
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ZlCard',
  props: {
    title: String,
    ratio: Number,
    direction: {
      type: String,
      default: 'row'
    },
    moreLabel: {
      type: String,
      default: '更多'
    }
  },
  data () {
    return {

    }
  },
  computed: {
    style () {
      const map = {
        row: 'width',
        column: 'height'
      }
      const style = { 'flex-grow': this.ratio }
      style[map[this.direction]] = this.ratio + 'px'
      return style
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.zl-card{
  border-radius: 8px;
}
.header{
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .tag{
    width: 4px;
    height: 18px;
    border-radius: 2px;
    margin-right: 4px;
  }
  .name{
    font-weight: bold;
    flex-grow: 1;
  }
  .more{
    color: #999999;
  }
}

</style>
