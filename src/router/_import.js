// 导入所有界面的路径
export default file => () => import('@/views/modules' + file + '/index.vue')
