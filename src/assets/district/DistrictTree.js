import ProvinceList from './ProvinceList'
import CityList from './CityList'
import CountyList from './CountyList'

const DistrictTree = []
// 遍历顺序
let i = 0
let j = 0
for (let item of ProvinceList) {
  let province = Object.assign({ level: 'province' }, item)
  province['children'] = []

  let provTag = province.value.substr(0, 2)
  for (let n = CityList.length; i < n; i++) {
    if (CityList[i].value.substr(0, 2) !== provTag) {
      break
    }

    let city = Object.assign({ level: 'city' }, CityList[i])
    city['chindren'] = []
    province['children'].push(city)

    let cityTag = city.value.substr(2, 2)
    for (let m = CountyList.length; j < m; j++) {
      if (CountyList[j].value.substr(0, 2) !== cityTag) {
        break
      }

      let county = Object.assign({ level: 'county' }, CityList[j])
      city['children'].push(county)
    }
  }

  DistrictTree.push(province)
}

export default DistrictTree
