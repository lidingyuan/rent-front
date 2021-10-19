import Vue from 'vue'
const ZlQueryContainer = () => import(/* webpackChunkName: "pubComp" */ './ZlQueryContainer')
const ZlTag = () => import(/* webpackChunkName: "pubComp" */ './ZlTag')
const ScrollBox = () => import(/* webpackChunkName: "pubComp" */ './ScrollBox')
const FollowMenu = () => import(/* webpackChunkName: "pubComp" */ './FollowMenu')
const DateRangePicker = () => import(/* webpackChunkName: "pubComp" */ './DateRangePicker')
const components = {
  ZlQueryContainer,
  ZlTag,
  ScrollBox,
  FollowMenu,
  DateRangePicker
}
Object.keys(components).forEach(key => Vue.component(key, components[key]))
