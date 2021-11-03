<template functional>
  <div
    zl-tag
    class="zl-tag"
    :class="[data.staticClass,...data.class]"
    :style="data.staticStyle"
    @click="listeners.click"
    @contextmenu="(event)=>{
      if(listeners.contextmenu){
        event.preventDefault()
        listeners.contextmenu(event)
      }
    }"
  >
    <slot />
    <div
      class="close-icon"
      @click.stop="listeners.close"
    >
      ×
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zl-tag{
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #666666;
  background: #FFFFFF;
  user-select: none;
  transition: all 0.5s;
  &:hover{
    .close-icon{
      visibility: visible;
    }
  }
  .close-icon{
    visibility: hidden;
    margin-left: 8px;
  }
}
</style>
