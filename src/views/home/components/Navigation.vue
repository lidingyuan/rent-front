<template>
  <div class="navigation">
    <div class="head">
      <div>
        <div style="font-size:16px;">
          Nicholas，欢迎登录本系统！
        </div>
        <div style="font-size:12px;">
          上次登录时间：2021年05月17日13
        </div>
      </div>
      <div
        class="bottom"
        style="font-size:14px;"
      >
        <div>福建省  厦门市</div>
        <div>2021/01/13</div>
      </div>
    </div>
    <div class="title-row">
      <div class="title">
        快速导航
      </div>
      <div class="more">
        编辑
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.navigation{
  display: flex;
  flex-direction: column;
  width: 0;
  flex-grow: 1;
  border-radius: 8px;
  margin: 12px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  overflow: hidden;
  .head{
    line-height: 1.5em;
    height: 112px;
    color: #fff;
    background: linear-gradient(353deg, #33B5FF 0%, #3385FF 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 16px;
    .bottom{
      display: flex;
      justify-content: space-between;
    }
  }
  .title-row{
    padding: 0 16px;
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    .title{
      font-weight: bold;
      color: #303133;
    }
    .more{
      color: #999999;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
