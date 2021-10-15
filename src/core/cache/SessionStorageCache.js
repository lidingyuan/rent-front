/**
 * SessionStorageCache
 *
 * eg: cache.set('foo', 'bar', new Date().getTime() + 3000)
 *
 * @author zzj
 * @since 2020-03-16
 */

// 缓存引擎
var engine = require('store/src/store-engine')

var storages = [
  require('store/storages/sessionStorage')
]
var plugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]

export const SessionStorageCache = engine.createStore(storages, plugins)

export default SessionStorageCache
