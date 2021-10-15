<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,body,#app{
  height: 100%;
  margin: 0;
  padding: 0;
  .el-dialog{
    border-radius: 11px;
    .el-dialog__header{
      position: relative;
      &::after{
        position: absolute;
        content: "";
        width: 97%;
        height: 1px;
        background: #CDCDCD;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .el-dialog__title{
        font-weight: 700;
        line-height: 18px;
        padding-left: 14px;
        position: relative;
        &::before {
          content: '';
          width: 4px;
          border-radius: 2px;
          height: 18px;
          background: #58B4FF;
          position: absolute;
          left: 0;
          bottom: 0;
          top: 0;
          margin: auto;
        }
      }
    }
  }
}
</style>
