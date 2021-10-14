<template>
  <!-- 约束说明弹窗 -->
  <div class="page">
    <el-button type="success" size="small" icon="el-icon-document" @click="dialogExplain = true">约束设置参考</el-button>

    <!-- 说明弹窗 -->
    <el-dialog :visible.sync="dialogExplain" append-to-body class="dialog-explain" :close-on-click-modal="false" width="768px">
      <div style="height: 60vh;overflow: auto;">
        <div class="explain-title">约束使用说明</div>
        <div class="p-line">
          <div class="line-title txt-bold">三种参与约束区别</div>
          <div class="line-explain">
            <span class="txt-primary txt-bold">活动可见约束：</span>
            <br>&emsp;&emsp;控制活动在某个活动列表中在是否可见，若不配置，则对所有用户可见；
            <br>&emsp;&emsp;<span class="txt-success">例如：公众号中有个'我的活动'列表，展示用户可以参与的活动，活动a要求仅上海地区的零售户用户才能在活动列表看见活动a，
              则需要配置活动可见约束有：注册零售户约束，区域约束地区选择上海
            </span>
            <br>
            <span class="txt-primary txt-bold">活动参与约束：</span>
            <br>&emsp;&emsp;控制活动的参与条件，若不配置，则所有的用户都可以进入活动页面；
            <br>&emsp;&emsp;<span class="txt-success">例如：活动a要求注册的消费者会员才可参与，则需要在活动参与约束中配置添加注册会员约束，注册成为会员的用户才能进入活动页面，
              未注册的会员在点击活动链接后将会告知其'活动仅限注册会员参加，您暂无参与权限'(类似的提示性话语)
            </span>
            <br>
            <span class="txt-primary txt-bold">环节参与约束：</span>
            <br>&emsp;&emsp;控制与参与具体某个环节（例如某个问卷，某个抽奖）条件，优先级次于活动参与约束，
            通过了活动参与约束校验再进行环节参与约束校验；
            <br>&emsp;&emsp;<span class="txt-success">例如：活动a，未设置任何参与约束，有问卷和抽奖两个环节，问卷是所有用户均可参与，提交问卷(仅有一次机会)后即可抽奖，
              抽奖只有注册的消费者才能参加，则需要抽奖环节上添加一个注册会员的参与约束，注册会员用户可以顺利答完问卷抽奖，非注册会员则在答完问卷后进入抽奖页面后告知其
              '仅限注册会员参加，您暂无参与权限'(类似的提示性话语)
            </span>
          </div>
          <div class="p-line">
            <div class="line-title txt-bold">约束释义</div>
            <div class="line-explain">
              [通用]活动区域约束：
              areaType可选：retailer|user|gps，areaLevel可选：1|2|3，分别代表省、市、县
              在可见性约束中，代表配置区域内的用户可见；
              在活动参与约束中，代表配置区域内的用户可进入活动；
              在环节参与约束中，代表配置区域内的用户可参与该环节；
              不配置表示无区域限制
              <br>[可见]完全隐藏约束：
              仅在活动可见性约束配置时可选择，配置后活动在活动列表中不可见（补充待完善）
              <br>[通用]时间约束
              （补充待完善）
              <br>[通用]注册用户约束
              添加该约束后，代表只有注册成为公众号会员的用户才能活动可见/进入活动/参与环节；
              不配置表示非注册用户也可活动可见/进入活动/参与环节
              <br>[通用]关注用户约束：
              添加该约束后，代表只有关注用户才能活动可见/进入活动/参与环节；
              不配置表示非关注用户也可活动可见/进入活动/参与环节
              <br>[通用]标签约束：
              添加该约束后，并选择了相关标签后，代表被打上该标签的用户才能活动可见/进入活动/参与环节；
              支持多个标签
              <br>[通用][前置]同步HTTP请求约束：
              前置约束，调用接口需要返回布尔值
              <br>[抽奖]抽奖次数约束：
              支持纬度：天、周、月、整个生命周期
              <br>[抽奖]中奖次数约束：
              prizeId设置成_all代表限制所有奖项累计中奖次数，设置具体某个奖项ID，则仅限制该奖项
              <br>[抽奖]中奖时间约束：
              prizeId设置具体的奖项ID，例子表示这个奖项每天上午8点到12点，整点的时候才允许中
              <br>[抽奖]奖池约束：
              prizeId指定具体奖项的ID，areaType支持：retailer|gps
              <br>[通用][后置]同步HTTP请求约束：
              后置约束，调用接口需要返回布尔值
              <br>[通用][回调]异步HTTP请求约束：
              不关心回调执行结果，记录调用失败日志
              <br>[通用][回调]同步HTTP请求约束：
              回调约束，不关心回调执行结果，不记录日志
              <br>[通用]二维码校验约束：
              前置约束
              <br>[抽奖]抽奖类型约束
            </div>
          </div>
          <div class="p-line">
            <div class="line-title txt-bold">抽奖活动(或环节)必配约束</div>
            <div class="line-explain">
              [通用][前置]同步HTTP请求约束，<span class="txt-danger">所有的抽奖</span>都需要添加此约束，若不添加，则不会出奖
              <br>[抽奖]中奖次数约束，<span class="txt-danger">限制用户中奖次数</span>都需要添加此约束
              <br>[通用]二维码校验约束，<span class="txt-danger">通过扫码后进入的抽奖</span>都需要添加此约束
              <br>[通用]中奖时间约束，<span class="txt-danger">限制用户中奖时间</span>都需要添加此约束
              <br> 其他约束，视情况添加
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'RuleExplainDialog',
  data () {
    return {
      dialogExplain: false
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
