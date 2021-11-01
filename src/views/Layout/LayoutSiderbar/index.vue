<template>
  <div
    v-transition:active="active"
    class="layout-siderbar"
    @transitionend="transitionend"
  >
    <ScrollBox class="item-list">
      <div
        v-for="menu in sortMenuList"
        :key="menu.path"
      >
        <div
          v-transition:active="$route.path === menu.path"
          class="layout-item"
          @click="menuClick(menu)"
        >
          <div
            class="icon"
            :style="{background: `url('${require(`@/assets/img/siderbar/${menu.meta.icon || 'Workbench'}.png`)}') no-repeat center/100%`}"
          />
          <div class="layout-name">
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
        <div
          v-if="menu.children"
          v-transition:height="visibleMap[menu.path]"
        >
          <div
            v-for="child in menu.children"
            :key="child.path"
            v-transition:active="$route.path === child.path"
          >
            <SideItem
              :menu="child"
              @openPage="openPage"
            />
          </div>
        </div>
      </div>
    </ScrollBox>
    <div
      class="siderbar-switch"
      @click="siderbarSwitch()"
    >
      <div v-transition:flip="active">
        <div
          class="icon"
          :style="{background: `url('${require(`@/assets/img/siderbar/siderbar-expand.png`)}') no-repeat center/100%`}"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SideItem from './SideItem'
export default {
  name: 'LayoutSiderbar',
  components: { SideItem },
  props: {
    menuList: Array
  },
  data () {
    return {
      active: true,
      visibleMap: {}
    }
  },
  computed: {
    sortMenuList () {
      return [...this.menuList].sort((a, b) => a.meta.orderTag - b.meta.orderTag)
    }
  },
  methods: {
    menuClick (item) {
      this.siderbarSwitch(true)
      if (!item.children || !item.children.length) {
        this.$emit('openPage', item)
      } else {
        this.$set(this.visibleMap, item.path, !this.visibleMap[item.path])
      }
    },
    openPage (item) {
      this.$emit('openPage', item)
    },
    siderbarSwitch (target) {
      if (target === undefined) {
        this.active = !this.active
      } else {
        this.active = !!target
      }
    }
  },
  debounces: {
    transitionend (finish) {
      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)
      finish(300)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-siderbar{
  height: 100%;
  width: 52px;
  display: flex;
  flex-direction: column;
  &.active{
    width: 240px;
  }
  .item-list{
    height: 0;
    flex-grow: 1;
    overflow-x: hidden;
    .layout-item{
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      height: 52px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-left: transparent 4px solid;
      .layout-name{
        width: 0;
        flex-grow: 1;
      }
      .item-expand{
        transform: rotateZ(-90deg);
        &.flip{
          transform: rotateZ(0deg);
        }
      }
    }
  }
  .siderbar-switch{
    cursor: pointer;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    .flip{
      transform: rotateY(180deg);
    }
  }
  .icon{
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    margin: 0 1em;
  }
}
</style>
