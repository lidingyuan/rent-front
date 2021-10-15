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
