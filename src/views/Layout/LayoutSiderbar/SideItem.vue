<template>
  <div>
    <div
      v-transition:active="$route.path === menu.path"
      class="layout-item"
    >
      <div
        v-transition:active="$route.path === menu.path"
        class="layout-child-name"
        @click="menuClick(menu)"
      >
        <div
          class="icon"
          :style="{'margin-right':1*level+'em',background: menu.meta.icon?`url('${require(`@/assets/img/siderbar/${menu.meta.icon}.png`)}') no-repeat center/100%`:''}"
        />
        <div style="flex-grow:1;">
          {{ menu.name }}
        </div>
        <div
          v-transition:flip="visibleMap[menu.path]"
          class="item-expand"
        >
          <div
            v-if="menu.children"
            class="icon"
            :style="{background: `url('${require(`@/assets/img/siderbar/expand.png`)}') no-repeat center/100%`}"
          />
        </div>
      </div>
    </div>
    <div
      v-if="menu.children"
      v-transition:height="visibleMap[menu.path]"
    >
      <div
        v-for="child in menu.children"
        :key="child.path"
      >
        <SideItem
          :level="level+1"
          :menu="child"
          @openPage="openPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideItem',
  props: {
    menu: {
      type: Object,
      default: () => { return {} }
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      visibleMap: {}
    }
  },
  created () {

  },
  methods: {
    menuClick (item) {
      if (!item.children || !item.children.length) {
        this.$emit('openPage', item)
      } else {
        this.$set(this.visibleMap, item.path, !this.visibleMap[item.path])
      }
    },
    openPage (item) {
      this.$emit('openPage', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-child-item{
  width: 240px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon{
    width: 1em;
    height: 1em;
    margin: 0 1em;
  }
  .layout-name{
    width: 0;
    flex-grow: 1;
  }
  .layout-child-name{
    width: 0;
    height: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .item-expand{
    transform: rotateZ(-90deg);
    &.flip{
      transform: rotateZ(0deg);
    }
  }
}
</style>
