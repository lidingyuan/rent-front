<template>
  <ZlCard
    title="新闻中心"
    :ratio="1"
    more-label="查看全部"
  >
    <ScrollBox class="news-center">
      <div
        v-for="(news,index) in newsList"
        :key="index"
        class="news"
      >
        <div class="news-title">
          {{ news.msg }}
        </div>
        <div class="news-date">
          {{ news.date }}
        </div>
      </div>
    </ScrollBox>
  </ZlCard>
</template>

<script>
import ZlCard from '@/core/components/ZlCard'
export default {
  name: 'NewsCenter',
  components: { ZlCard },
  data () {
    return {
      newsList: []
    }
  },
  created () {
    this.newsList.length = 20
    this.newsList.fill({
      msg: '这是一条新闻中心内容标题这是一条新闻中心内容标题这是一条新闻中心内容标题这是一条新闻中心内容标题',
      date: '2021-03-02'
    })
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.news-center{
  height: 300px;
  .news{
    display: flex;
    width: 100%;
    line-height: 2em;
    overflow: hidden;
    color: #666666;
    .news-title{
      width: 0;
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow : ellipsis
    }
  }
}
</style>
