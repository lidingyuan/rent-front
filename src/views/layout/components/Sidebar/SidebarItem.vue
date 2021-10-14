<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper">

    <template v-if="hasOneShowingChild(item.children, item) && (!onlyChild.children || onlyChild.noShowingChildren) && !item.alwaysShow">
      <app-link :to="onlyChild.path">
        <el-menu-item :index="onlyChild.path" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyChild.meta" :icon="onlyChild.meta.icon || item.meta.icon" :title="onlyChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children.filter(item => !item.hidden)">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu" />
        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/strings.js'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: {
    Item,
    AppLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onlyChild: null
    }
  },
  methods: {
    hasOneShowingChild (children, parent) {
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        this.onlyChild = showingChildren[0]
        return true
      }

      // Show parent if there is no child router to display
      if (showingChildren.length === 0) {
        this.onlyChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink (routePath) {
      return isExternal(routePath)
    }
  }
}
</script>
