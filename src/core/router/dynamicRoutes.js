
const Layout = () => import(/* webpackChunkName: "layout" */ '@/views/Layout')

const files = require.context('@/views/app', true, /^((?!components).)+\.vue$/, 'sync')
const components = {}
files.keys().forEach(key => {
  const component = files(key).default || files(key)
  components[component.name] = component
})

export function getDynamicRoutes (menus) {
  return filterRoute(menus)
}

function filterRoute (data) {
  const map = {}
  const routes = []
  data.forEach(item => {
    const data = {
      path: item.url,
      name: item.name,
      meta: {
        isLeaf: true, menuId: item.id, icon: item.icon, id: item.id, idPath: item.idPath, orderTag: item.orderTag
      }
    }
    if (components[item.component]) {
      data.component = components[item.component]
    }
    if (item.redirect) {
      data.redirect = item.redirect
    }
    map[item.id] = data
  })
  data.forEach(item => {
    const route = map[item.id]
    if (!item.pid || !map[item.pid]) {
      routes.push(route)
      route.isApp = true
      route.component = Layout
    } else {
      if (!map[item.pid].children) {
        map[item.pid].children = []
      }
      map[item.pid].children.push(route)
      map[item.pid].meta.isLeaf = false
    }
  })
  return routes
}
