<template>
  <div class="template-config">
    <el-tabs class="tab" v-model="activeName">
      <el-tab-pane label="基础配置" name="base-config">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.LUCKY" label="抽奖配置" name="lucky-config">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.LUCKY" label="奖项配置" name="lucky-prize-config">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.LUCKY" label="活动参与规则" name="lucky-rule">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.LUCKY" label="奖品领取规则" name="lucky-address-rule">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.PAPER" label="问卷配置" name="act-paper-config">
      </el-tab-pane>
      <el-tab-pane v-if="phaseTypeMap.PAPER" label="问卷题库配置" name="act-paper-question-config">
      </el-tab-pane>
    </el-tabs>
    <div class="right-config">
      <base-config v-show="activeName === 'base-config'"></base-config>
      <lucky-config v-if="phaseTypeMap.LUCKY" :phaseId="phaseTypeMap.LUCKY" v-show="activeName === 'lucky-config'">
      </lucky-config>
      <lucky-prize-config v-if="phaseTypeMap.LUCKY" :phaseId="phaseTypeMap.LUCKY" @refreshIframe="refreshIframe" v-show="activeName === 'lucky-prize-config'">
      </lucky-prize-config>
      <lucky-rule v-if="phaseTypeMap.LUCKY" @refreshIframe="refreshIframe" v-show="activeName === 'lucky-rule'">
      </lucky-rule>
      <lucky-address-rule v-if="phaseTypeMap.LUCKY" @refreshIframe="refreshIframe" v-show="activeName === 'lucky-address-rule'">
      </lucky-address-rule>
      <act-paper-config v-if="phaseTypeMap.PAPER" @refreshIframe="refreshIframe" v-show="activeName === 'act-paper-config'">
      </act-paper-config>
      <act-paper-question-config v-if="phaseTypeMap.PAPER" :phaseId="phaseTypeMap.PAPER" @refreshIframe="refreshIframe" v-show="activeName === 'act-paper-question-config'">
      </act-paper-question-config>
    </div>
  </div>
</template>

<script>
import BaseConfig from './BaseConfig'
import LuckyConfig from './LuckyConfig'
import LuckyPrizeConfig from './LuckyPrizeConfig'
import luckyRule from './luckyRule'
import luckyAddressRule from './luckyAddressRule'
import ActPaperConfig from './ActPaperConfig'
import ActPaperQuestionConfig from './ActPaperQuestionConfig'

import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi'
export default {
  name: 'TemplateConfig',
  components: { BaseConfig, LuckyConfig, LuckyPrizeConfig, luckyRule, luckyAddressRule, ActPaperConfig, ActPaperQuestionConfig },
  data () {
    return {
      //
      activeName: 'base-config',
      phaseTypeMap: {
        LUCKY: '',
        PAPER: ''
      }
    }
  },
  created () {
    //
    ActPhaseApi.list({ actId: this.$route.query.actId }).then(res => {
      res.data.forEach(phase => {
        this.phaseTypeMap[phase.phaseType] = phase.phaseId
      })
      this.$emit('setPhaseMap', this.phaseTypeMap)
      this.$emit('setEntryUrl', res.data[0].entryUrl + '?phaseId=' + res.data[0].phaseId)
    })
  },
  methods: {
    //
    refreshIframe () {
      this.$emit('refreshIframe')
    }
  }
}
</script>

<style lang='scss' scoped>
.template-config{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tab{
    padding: 30px 30px 0 30px;
  }
  .right-config{
    padding: 0 30px;
    height: 0;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
