<template>
  <div class="dashboard-page">
    <el-tabs type="border-card" v-model="activeName">
      <!-- <el-tab-pane lazy name="BASE">
        <span slot="label"><i class="el-icon-open"></i> 基础信息</span>
        <div class="tab-component">
        </div>
      </el-tab-pane> -->

      <el-tab-pane lazy name="ACT">
        <span slot="label"><i class="el-icon-tickets"></i>活动管理</span>
        <div class="tab-component">
          <div class="menu-title">活动新增/编辑</div>
          <div class="menu-explain">依照表单内容进行填写即可</div>
          <div class="menu-title">活动规则配置</div>
          <div class="menu-explain">目前活动用到的此菜单的比较少，目前仅<i class="txt-success">山东的扫码抽奖</i>类活动，<i class="txt-success">山东集盒</i>类活动是必配置的</div>
          <div class="menu-title">活动素材</div>
          <div class="menu-explain">管理活动中用到的一些素材，目前活动中使用到此菜单的较少，例如<i class="txt-success">活动页面中需要展示banner轮播图</i></div>
          <div class="menu-title">活动环节管理</div>
          <div class="menu-explain">
            <p>在环节管理页面，我们可以看到该活动下当前配置的<span class="txt-bold">所有的环节</span>，环节的执行顺序</p>
            <p>目前活动管理平台支持的环节类型：<span class="txt-primary txt-bold">问卷，抽奖</span>，具备对应的管理页面；
              其他的我们称之为<span class="txt-primary txt-bold">自定义环节类型</span>，也不具备对应的管理页面</p>
            <p>只有自定义环节才需要在环节管理页面<span class="txt-danger txt-bold">手动新增</span>，对于活动平台支持的环节类型，在对应的管理页面上进行新增后，
              会<span class="txt-danger txt-bold">自动创建</span>一条对应的环节数据，而无需手动新增。
            </p>
            <p>环节之间是<span class="txt-warning txt-bold">串行关系</span>，即一个环节执行完后方可进入下一个环节，暂不支持并行环节；每个环节仅属于一个活动</p>
            <p>环节执行依靠环节列表中的排序，数值小的在前，进入活动后优先执行，所以环节列表从上往下应该和需求中活动流程一致</p>
          </div>
          <div class="menu-title">活动参与约束</div>
          <div class="menu-explain">
            <p>打开活动参与约束列表页面，配置活动参与的条件，例如需要是公众号注册会员才可参加，则需要此页面添加注册会员约束</p>
            <p>如果配置，代表该活动无参与条件限制</p>
          </div>
          <div class="menu-title">活动可见约束</div>
          <div class="menu-explain">
            <p>前提：公众号有个菜单名称为'<i class="txt-primary">我的活动</i>'(类似此功能的菜单)，里面展示了一系列的活动</p>
            <p>
              打开活动可见约束列表页面，配置活动可见的条件，例如需要是公众号注册会员才可看见，则需要此页面添加注册会员约束，
              加上注册会员约束后，非注册会员进入'我的活动'是看不到该活动的
            </p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane lazy name="PAPER">
        <span slot="label"><i class="el-icon-document-checked"></i>问卷管理</span>
        <div class="tab-component">
          <div class="menu-title">新增/编辑</div>
          <div class="menu-explain">
            <p>新增状态下，选中了某个活动，完成了问卷新增，编辑时是不允许修改关联的活动的；
              如果需要更改关联的活动，可通过删除该问卷，重新创建一个问卷实现
            </p>
            <p>开始时间-结束时间：问卷的起始时间，原则上应在活动起始时间范围之内</p>
            <p>
              筛选题目：
              <br><span class="switch-label">开启</span>-输入筛选个数n，表示从已配置的题库中<span class="txt-danger txt-bold">随机筛选</span>n个题目展示
              <br>&emsp;&emsp;<i class="txt-warning txt-bold">不支持指定筛选，如果需要，则只能前端开发人员配合实现</i>
            </p>
            <p>完整提交：
              <br><span class="switch-label">开启</span>-用户填写的问卷需要<span class="txt-danger txt-bold">每道题都填写</span>，才能提交
              <br><span class="switch-label">关闭</span>-用户填写的问卷可<span class="txt-danger txt-bold">部分题目不填写</span>，也可提交</p>
            <p>
              自动校验：
              <br><span class="switch-label">开启</span>-用户提交问卷后校验用户每道题的回答准确性，配置的题目<span class="txt-danger txt-bold">需要设置正确答案</span>，适用于区分用户回答正确与否的情况；
              <br><span class="switch-label">关闭</span>-用户提交问卷后，不校验用户回答准确性，题目也无需维护正确答案；
              <br><i class="txt-warning txt-bold">&emsp;&emsp;校验范围：目前不支持回答一个题目校验一次，仅支持用户点击提交问卷后，整体性校验</i>
            </p>
            <p>
              应用场景：
              <br><span class="switch-label">一次性问卷</span>-用户仅有一次问卷回答机会；
              <br><span class="switch-label">随机可重复回答</span>-不限用户回答次数，在问卷开展期间，用户在任何时候都可以回答问卷，不管是否回答过；
              <br><span class="switch-label">条件可重复回答</span>-不限用户回答次数，但是有一定的条件限制(此条件由前端开发人员在进行开发时控制，暂不支持在活动管理平台中设置)，
              <i class="txt-primary">例如：在问卷开展期间，每天有一次问卷回答机会</i>
            </p>
            <p>
              更新回答：
              <br><span class="switch-label">开启</span>-用户在第一次提交之后，再次提交，提交的回答数据会<span class="txt-danger">覆盖之前回答数据</span>，使用情况较少；
              <br><span class="switch-label">关闭</span>-用户在第一次提交之后，再次提交，数据库中会<span class="txt-danger">产生一条新的回答记录</span>，而不会覆盖之前回答数据
            </p>
          </div>
          <div class="menu-title">题库管理</div>
          <div class="menu-explain">
            <p>打开该问卷的题库管理页面，对问卷中的题目进行管理</p>
            <p>状态：默认启用，停用状态的题目不会再展示给用户；所以若该题目不在使用，可设置为停用状态</p>
            <p>
              题目：序号部分的请不要维护，仅维护文字部分包括标点符号即可；
              <i class="txt-primary">例如设计稿上第一道题显示的效果是：'1.您的性别是?(单选)'，则维护数据是'您的性别是?'即可,序号部分和题目类型由前端开发人员实现</i>
            </p>
            <p>参考答案：
              非必须填写，若问卷配置<span class="txt-danger">自动校验</span>，则该项是<span class="txt-danger">必须填写</span>的
              <i class="txt-warning">关于多选自动校验：多选，漏选，错选或者不选均视为和正确答案不匹配</i>
            </p>
            <p>
              选项-自由回答：开启-该选项是可输入的
            </p>
          </div>
          <div class="menu-title">参与约束管理</div>
          <div class="menu-explain">
            <p>打开该环节参与约束列表页面，配置环节参与的条件，例如需要是公众号注册会员才可参加，则需要此页面添加注册会员约束</p>
            <p>如果配置，代表该环节无参与条件限制</p>
            <p>
              但是如果活动配置了相关活动参与约束，则通过活动参与约束校验的用户才能进入该环节；
              例如活动配置注册会员约束，问卷没有配置约束，则注册会员用户才能进入活动，到达问卷页面
            </p>
          </div>
          <div class="menu-title">常见问题排查</div>
          <div class="menu-explain">建设中，敬请期待...</div>
        </div>
      </el-tab-pane>

      <el-tab-pane lazy name="LUCKY">
        <span slot="label"><i class="el-icon-present"></i>抽奖管理</span>
        <div class="tab-component">
           <div class="menu-title">新增/编辑</div>
          <div class="menu-explain">
            <p>新增状态下，选中了某个活动，完成了抽奖新增，编辑时是不允许修改关联的活动的；
              如果需要更改关联的活动，可通过删除该抽奖，重新创建一个抽奖实现
            </p>
            <p>开始时间-结束时间：问卷的起始时间，原则上应在活动起始时间方范围之内</p>
            <p>
              奖池结余处理：延续至下期-上期奖池若有剩余，将会补充到本期进行的奖池
            </p>
          </div>
          <div class="menu-title">奖项管理</div>
          <div class="menu-explain">
            <p>
              物资数量：
               <br>&emsp;&emsp;表示该奖项中所含奖品的个数，一般实物奖品是1，积分一般会大于1；
               <br>&emsp;&emsp;<i class="txt-primary">例如：该奖项是500积分，则物资数据应该配置500</i>
            </p>
            <p>默认奖项：一个抽奖<span class="txt-danger">仅能存在一个</span>默认奖项，所以在奖项配置完后请检查默认设置情况</p>
            <p>是否启用：不启用(停用)的奖项将不会出现在抽奖转盘(或者其他抽奖展现形式中)，中奖率和奖池中也不会包含它</p>
            <p>奖项序号：
              <br>&emsp;&emsp;奖品在转盘上的位置，仅在抽奖形式为转盘，九宫格等形式时需配置，砸金蛋则无需配置
              <br>&emsp;&emsp;转盘：从12点钟位置顺时针排列
              <br>&emsp;&emsp;九宫格：从左上角位置顺时针排列
            </p>
            <p>
              奖项图片：
              <br>&emsp;&emsp;转盘，九宫格类似的抽奖形式需要配置，砸金蛋类似则不需要配，
              <br>&emsp;&emsp;配置情况下图片类型选择<span class="txt-danger">ICON</span>，图片需要在素材管理中提前维护好
              <br>&emsp;&emsp;<span class="txt-bold">转盘：图片要求：含一整个扇形及扇形中的内容，及奖品图片在内，奖品名称也在内</span>
            </p>
            <p>
              物资图片和奖项图片使用区别：
              <br>&emsp;&emsp;物资图片和某个抽奖无关，和物资有关，在<span class="txt-success">'基础信息-物资管理-素材管理'</span>配置；
              奖项图片和具体的某个抽奖有关，在<span class="txt-success">'抽奖管理-奖项管理-奖项图片'</span>配置；
              <i class="txt-primary">例如：抽奖转盘上的奖品无法使用物资图片，我们可以配置奖项图片来实现，最常见使用场景是积分作为奖品时，一般都需要配置奖品图片</i>
              <br>&emsp;&emsp;在页面展示中，前端页面展示使用的图片情况如下(并不保证所有场景的都是按照以下要求实现的)，也建议按照下述使用情况来进行相关素材配置：
                a：<span class="txt-bold">转盘、九宫格或者其他抽奖形式页面上图片</span>：优先取奖品图片，若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>；
                否则取<i class="txt-danger">类型为ICON的第一张</i>，若都未取到，则往物资图片中用同等方式取图片，在物资图片中，
                若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>，否则取<i class="txt-danger">类型为ICON的第一张</i>，
                若都未取到，视为未找到图片，页面上对应的呈现奖项图片的位置将空着的；
                b：<span class="txt-bold">抽奖结果弹窗奖品图片</span>：优先取物资图片，若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>；
                否则取<i class="txt-danger">类型为POSTER的第一张</i>，若都未取到，则往奖项图片中用同等方式取图片，在奖项图片中，
                若配置的图片素材仅有一个，<i class="txt-danger">则取唯一这个</i>，否则取<i class="txt-danger">类型为POSTER的第一张</i>，
                若都未取到，视为未找到图片，页面弹窗上对应的呈现奖项图片的位置将空着的；
                c：<span class="txt-bold">抽奖记录列表奖品图片小图标</span>：取图片方式和弹窗上奖品图片一样，不同的是图片类型是ICON，而不是POSTER
            </p>
          </div>
          <div class="menu-title">奖池中奖率(在奖项管理页面)</div>
          <div class="menu-explain">
          </div>
          <div class="menu-title">参与约束管理</div>
          <div class="menu-explain">
            <p>打开该环节参与约束列表页面，配置环节参与的条件，例如需要是公众号注册会员才可参加，则需要此页面添加注册会员约束</p>
            <p>如果配置，代表该环节无参与条件限制</p>
            <p>
              但是如果活动配置了相关活动参与约束，则通过活动参与约束校验的用户才能进入该环节；
              例如活动配置注册会员约束，问卷没有配置约束，则注册会员用户才能进入活动，到达抽奖页面
            </p>
            <p>
              <span class="txt-danger">抽奖必须配置的参与约束</span>
              <br>&emsp; [通用][前置]同步HTTP请求约束，<span class="txt-danger">所有的抽奖</span>都需要添加此约束
              <br>&emsp; [抽奖]中奖次数约束，<span class="txt-danger">限制用户中奖次数</span>都需要添加此约束
              <br>&emsp; [通用]二维码校验约束，<span class="txt-danger">通过扫码后进入的抽奖</span>都需要添加此约束
              <br>&emsp; [通用]中奖时间约束，<span class="txt-danger">限制用户中奖时间</span>都需要添加此约束
              <br>&emsp; 其他约束，视情况添加
            </p>
          </div>
          <div class="menu-title">常见问题排查</div>
          <div class="menu-explain">建设中，敬请期待...</div>
        </div>
      </el-tab-pane>

      <el-tab-pane lazy name="CODE">
        <span slot="label"><i class="el-icon-s-tools"></i>关于开发</span>
        <div class="tab-component">
          <div class="menu-title">抽奖-转盘绘制</div>
          <div class="menu-explain">
            持续更新中
          </div>
          <div class="menu-title">扫码抽奖</div>
          <div class="menu-explain">
            <p>可在活动管理平台直接创建扫码抽奖，以及维护奖项，中奖率，活动参与约束及抽奖环节参与约束</p>
            <p>在活动管理平台上，活动管理首页，进入该活动的活动规则信息配置页面，添加活动规则，地址信息提示</p>
            <div style="color:red">以下说明仅对的山东扫码抽奖有效</div>
            <p>
              oss上传扫码抽奖中使用到的图片：
              <ul>
                <li>在扫码抽奖图片存放目录新建一个文件夹，文件名称是该活动id</li>
                <li>在该活动id文件夹下，再新建以卷烟id为文件名的文件夹</li>
                <li>上传该活动该卷烟抽奖页面用到的转盘背景图，指针图片</li>
              </ul>
            </p>
            <p>
              扫码样式
              <br>
              <ul>
                <li>
                  样式文件夹路径：<span class="block-code">public/css</span>。所有卷烟的样式文件都应该在此文件夹中，区分条包。
                </li>
                <li>支持更改的内容：验证成功页面样式、验真失败页面样式</li>
                <li>新建样式文件：在<span class="block-code">public/css</span>路径下新建一已卷烟Id为文件名的文件夹，
                  在此文件夹下，新建一个css文件，文件名称：scan-style，
                  文件内容复制其他卷烟Id文件夹中scan-style.css内容，然后再修改文件中对应的内容</li>
                <li>新增一个扫码抽奖，若页面结构和已使用的一致，则前端无需重新开发，但是需要检查css样式文件夹是否有卷烟皮肤</li>
              </ul>
            </p>
            <p>
              抽奖样式<br>
              <ul>
                <li>配置文件路径：<span class="block-code">views/ActLucky/components/plate2toba.json</span></li>
                <li>
                  支持的更改的内容：
                  抽奖页面<span class="txt-primary">背景、标题、活动规则背景、活动规则页面底部按钮背景</span>，
                </li>
                <li>新增一条配置：直接在上述配置配置文件plate2toba.json追加一条数据，
                  格式和其他其他卷烟id数据一致</li>
                <li>
                  在上述的配置文件中，配置的抽奖样式和卷烟id相关，和活动id无关。
                  所有开展活动的卷烟，都应该能在上述配置文件plate2toba.json中找到对应的配置
                </li>
              </ul>
            </p>
            <p>
              转盘配置<br>
              <ul>
                <li>配置文件路径：<span class="block-code">assets/js/plateConfig.js</span></li>
                <li>
                  支持更改的内容：转盘扇形的背景色，转盘底部是否需要显示小人图
                </li>
                <li>
                  新增配置：
                  plateConfig.js中的<span class="block-code">plateGridColor</span>变量追加一条数据，数据格式和文件中其他数据格式保持一致；
                  文件内容也有写相关注释，可参考
                </li>
                <li>
                  每条配置的数据，和活动id卷烟id都相关，可使用actId-tobaId搜索，例如活动id是'a123'，卷烟id是't789'，则搜索条件是：a123-t789
                </li>
              </ul>
            </p>
          </div>

          <div class="menu-title">集盒</div>
          <div class="menu-explain">
            <p>活动管理平台暂不支持集盒活动具体配置</p>
            <p>在活动管理平台上，活动管理首页，进入该活动的活动规则信息配置页面，添加集盒活动规则</p>
            <p>
              前端：新增一个集盒活动，前端无需重新开发(如果页面结构不一致则需要重新开发，并且兼容目前已有的，所以尽可能页面结构保持一致)，中奖率和奖池中也不会包含它
              但是需要检查css样式文件(assets/css目录)，目前的样式和卷烟相关，每个卷烟都有对应的皮肤；circle-color-style.css设置了进度条颜色，
              public.css设置了背景图，字体颜色等，每个样式文件都要搜索一遍该卷烟id，如果没有，则需要按照两个样式文件内容，添加该卷烟皮肤样式
            </p>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'dashboard',
  props: {},
  data () {
    return {
      activeName: 'CODE'
    }
  }
}
</script>

<style lang='scss' scoped>
.dashboard-page{
  height: 100%;
}
.tab-component{
  width: 100%;
  overflow: auto;
  height: calc(100vh - 170px - 2rem);
  counter-reset: section;
}
.tab-component .menu-title::before {
  counter-increment: section;
  content: counter(section) ". ";
}
.tab-component .menu-title {
  font-weight: bold;
  color: #027EFE;
  line-height: 40px;
}
.tab-component .menu-explain {
  padding-left: 2em;
  padding-bottom: 10px;
  line-height: 28px;
  counter-reset: subsection;
  p {
    margin: 0;
    padding: 0;
  }
}
.tab-component .menu-explain p::before {
  counter-increment: subsection;
  content: counter(section) ". " counter(subsection) " ";
}
</style>
