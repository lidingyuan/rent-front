<template>
  <ZlCard
    title="待办事项"
    :ratio="1"
    direction="column"
    more-label="查看全部"
  >
    <div class="to-do-detail">
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          label="待办任务"
          name="first"
        />
        <el-tab-pane
          label="在办申请"
          name="second"
        />
        <el-tab-pane
          label="已办任务"
          name="third"
        />
        <el-tab-pane
          label="已办申请"
          name="fourth"
        />
      </el-tabs>
      <ScrollBox class="detail">
        <div class="block-flex">
          <div
            v-for="(todo,i) in todoList"
            :key="i"
            class="block"
          >
            <div class="title">
              {{ todo.title }}
            </div>
            <div class="info">
              <div>
                {{ todo.type }}
              </div>
              <div>
                {{ todo.person }}
              </div>
            </div>
            <div class="bottom">
              <div class="time">
                {{ todo.date }}
              </div>
              <div class="more">
                查看详情
                <i class="el-icon-arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </ScrollBox>
    </div>
  </ZlCard>
</template>

<script>
import ZlCard from '@/core/components/ZlCard'
export default {
  name: 'ToDoDetail',
  components: { ZlCard },
  data () {
    return {
      activeName: 'first',
      todoList: []
    }
  },
  created () {
    this.todoList.length = 20
    this.todoList.fill({
      title: '待办事项标题内容',
      type: '待办任务类型',
      person: '任务提交人',
      date: '2021-03-02'
    })
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.to-do-detail{
  display: flex;
  flex-direction: column;
  height: calc(100% - 41px);
  .detail{
    height: 0;
    flex-grow: 1;
    .block-flex{
      display: flex;
      flex-wrap: wrap;
    }
    .block{
      width: 330px;
      height: 124px;
      border: 1px solid #EEEEEE;
      margin: 16px;
      padding: 16px;
      .title{
        font-size: 16px;
        font-weight: bold;
      }
      .info{
        height: 76px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 14px;
        color: #666666;
      }
      .bottom{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #999999;
      }
    }
  }
}
</style>
