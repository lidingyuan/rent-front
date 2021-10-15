<template>
  <ZlCard
    title="消息中心"
    :ratio="1"
    direction="column"
    more-label="查看全部"
  >
    <div class="msg-center">
      <div class="item">
        <div class="icon yujing" />
        <div class="text">
          <div class="title">
            预警
          </div>
          <div class="num">
            <span>3</span>个
          </div>
        </div>
      </div>
      <div class="item">
        <div class="icon tongzhi" />
        <div class="text">
          <div class="title">
            通知
          </div>
          <div class="num">
            <span>11</span>个
          </div>
        </div>
      </div>
      <div class="item">
        <div class="icon gonggao" />
        <div class="text">
          <div class="title">
            公告
          </div>
          <div class="num">
            <span>24</span>个
          </div>
        </div>
      </div>
    </div>
  </ZlCard>
</template>

<script>
import ZlCard from '@/core/components/ZlCard'
export default {
  name: 'MsgCenter',
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
.msg-center{
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
      &.yujing{
        background:url('~@/assets/img/home/yujing.png') no-repeat center;
      }
      &.tongzhi{
        background:url('~@/assets/img/home/tongzhi.png') no-repeat center;
      }
      &.gonggao{
        background:url('~@/assets/img/home/gonggao.png') no-repeat center;
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
