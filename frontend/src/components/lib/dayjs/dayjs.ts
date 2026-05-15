import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import 'dayjs/locale/ja'

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.locale('ja')

export default dayjs
