<template>
  <ZlCard
    title="待办事项"
    :ratio="1"
    direction="column"
    more-label="查看全部"
  >
    <div class="to-do">
      <div class="item">
        <div class="icon daibanrenwu" />
        <div class="text">
          <div class="title">
            待办任务
          </div>
          <div class="num">
            <span>27</span>个
          </div>
        </div>
      </div>
      <div class="item">
        <div class="icon zaibanshenqing" />
        <div class="text">
          <div class="title">
            在办申请
          </div>
          <div class="num">
            <span>27</span>个
          </div>
        </div>
      </div>
      <div class="item">
        <div class="icon yibanrenwu" />
        <div class="text">
          <div class="title">
            已办任务
          </div>
          <div class="num">
            <span>27</span>个
          </div>
        </div>
      </div>
    </div>
  </ZlCard>
</template>

<script>
import ZlCard from '@/core/components/ZlCard'
export default {
  name: 'ToDo',
  components: { ZlCard },
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
.to-do{
  height:100px;
  display: flex;
  justify-content: space-around;
  .item{
    display: flex;
    align-items: center;
    .icon{
      width: 52px;
      height: 52px;
      margin-right: 16px;
      &.daibanrenwu{
        background:url('~@/assets/img/home/daibanrenwu.png') no-repeat center;
      }
      &.yibanrenwu{
        background:url('~@/assets/img/home/yibanrenwu.png') no-repeat center;
      }
      &.zaibanshenqing{
        background:url('~@/assets/img/home/zaibanshenqing.png') no-repeat center;
      }
    }
    .title{
      color: #666666;
    }
    span{
      font-size: 32px;
      font-weight: bold;
    }
  }
}
</style>
