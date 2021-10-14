export const phaseRuleList = [
  {
    'id': '1321064646108446721',
    'orderTag': null,
    'remarks': null,
    'name': '[抽奖]抽奖类型约束',
    'beanName': 'luckyTypeDecider',
    'paramExample': '["POINT_LUCKY"]',
    'position': 1
  },
  {
    'id': '1241984252974678019',
    'orderTag': 2,
    'remarks': '可见类约束使用，不需要配置约束内容',
    'name': '[可见]完全隐藏约束',
    'beanName': 'pseudoDecider',
    'paramExample': null,
    'position': 1
  },
  {
    'id': '1241984252974678020',
    'orderTag': 3,
    'remarks': 'cron表达式',
    'name': '[通用]时间约束',
    'beanName': 'timeDecider',
    'paramExample': '{"cron": "* * 10 ? * 2,4"}',
    'position': 1
  },
  {
    'id': '1241984252974678021',
    'orderTag': 4,
    'remarks': '不需要配置约束内容',
    'name': '[通用]注册用户约束',
    'beanName': 'registerDecider',
    'paramExample': null,
    'position': 1
  },
  {
    'id': '1241984252974678022',
    'orderTag': 5,
    'remarks': '不需要配置约束内容',
    'name': '[通用]关注用户约束',
    'beanName': 'subscribeDecider',
    'paramExample': null,
    'position': 1
  },
  {
    'id': '1241984252974678023',
    'orderTag': 6,
    'remarks': '标签ID数组',
    'name': '[通用]标签约束',
    'beanName': 'tagDecider',
    'paramExample': '["1217349712879759361"]',
    'position': 1
  },
  {
    'id': '1241984252974678024',
    'orderTag': 7,
    'remarks': '前置约束，调用接口需要返回布尔值',
    'name': '[通用][前置]同步HTTP请求约束',
    'beanName': 'httpRequestDecider',
    'paramExample': '{"url": "服务地址", "body": "", "method": "get", "headers": {"Content-Type": "application/json;charset=UTF-8"}}',
    'position': 1
  },
  {
    'id': '1241984252974678032',
    'orderTag': 7,
    'remarks': '前置约束',
    'name': '[通用]二维码校验约束',
    'beanName': 'qrcodeVerifyDecider',
    'paramExample': null,
    'position': 1
  },
  {
    'id': '1241984252974678025',
    'orderTag': 8,
    'remarks': '支持纬度：天、周、月、整个生命周期',
    'name': '[抽奖]抽奖次数约束',
    'beanName': 'luckyDrawCountDecider',
    'paramExample': '{"day": 1, "week": 7, "month": 31, "fullLife": 100}',
    'position': 1
  },
  {
    'id': '1241984252974678026',
    'orderTag': 9,
    'remarks': 'prizeId设置成_all代表限制所有奖项累计中奖次数，设置具体某个奖项ID，则仅限制该奖项',
    'name': '[抽奖]中奖次数约束',
    'beanName': 'luckyHitCountDecider',
    'paramExample': '[{"day": 1, "week": 7, "month": 31, "prizeId": "_all", "fullLife": 100}]',
    'position': 2
  },
  {
    'id': '1241984252974678027',
    'orderTag': 10,
    'remarks': 'prizeId设置具体的奖项ID，例子表示这个奖项每天上午8点到12点，整点的时候才允许中',
    'name': '[抽奖]中奖时间约束',
    'beanName': 'luckyHitTimeDecider',
    'paramExample': '[{"cron": "0 0 8-12 * * ?", "prizeId": "1217361272134119426"}]',
    'position': 2
  },
  {
    'id': '1241984252974678029',
    'orderTag': 12,
    'remarks': '后置约束，调用接口需要返回布尔值',
    'name': '[通用][后置]同步HTTP请求约束',
    'beanName': 'httpRequestDecider',
    'paramExample': '{"url": "服务地址", "body": "", "method": "get", "headers": {"Content-Type": "application/json;charset=UTF-8"}}',
    'position': 2
  },
  {
    'id': '1241984252974678030',
    'orderTag': 13,
    'remarks': '不关心回调执行结果，记录调用失败日志',
    'name': '[通用][回调]异步HTTP请求约束',
    'beanName': 'asyncHttpRequestDecider',
    'paramExample': '{"url": "服务地址", "body": "", "method": "get", "headers": {"Content-Type": "application/json;charset=UTF-8"}}',
    'position': 3
  },
  {
    'id': '1241984252974678031',
    'orderTag': 14,
    'remarks': '回调约束，不关心回调执行结果，不记录日志',
    'name': '[通用][回调]同步HTTP请求约束',
    'beanName': 'httpRequestDecider',
    'paramExample': '{"url": "服务地址", "body": "", "method": "get", "headers": {"Content-Type": "application/json;charset=UTF-8"}}',
    'position': 3
  }
]

export const phaseRuleConstants = {
  luckyType: 'luckyTypeDecider',
  pseudo: 'pseudoDecider',
  time: 'timeDecider',
  register: 'registerDecider',
  subscribe: 'subscribeDecider',
  tag: 'tagDecider',
  qrcodeVerify: 'qrcodeVerifyDecider',
  luckyDrawCount: 'luckyDrawCountDecider',
  luckyHitCount: 'luckyHitCountDecider',
  luckyHitTime: 'luckyHitTimeDecider',
  httpRequest: 'httpRequestDecider',
  asyncHttpRequest: 'asyncHttpRequestDecider'
  // httpRequest: 'httpRequestDecider'
}

// 根据beanName返回该约束
export function getPhaseRuleByBeanName (beanName) {
  if (!beanName) {
    console.error('请输入beanName')
    return ''
  }
  const obj = phaseRuleList.find(item => item.beanName === beanName)
  if (!obj) {
    console.error('beanName传入有误，找不到该约束')
    return ''
  }
  return obj
}
