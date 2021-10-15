import Vue from 'vue'
import ZlQueryContainer from './ZlQueryContainer'
import ZlTag from './ZlTag'
import ScrollBox from './ScrollBox'
import FollowMenu from './FollowMenu'
import MarketPicker from './MarketPicker'
import ProductPicker from './ProductPicker'
import TobaccoPicker from './TobaccoPicker'
import DateRangePicker from './DateRangePicker'
const components = {
  ZlQueryContainer,
  ZlTag,
  ScrollBox,
  FollowMenu,
  MarketPicker,
  ProductPicker,
  TobaccoPicker,
  DateRangePicker
}
Object.keys(components).forEach(key => Vue.component(key, components[key]))
