export interface TabItem {
  value: string
  title: string
  subTitle: string
  icon: string
}

const parkingList: TabItem[] = [
  {
    value: 'parking',
    title: '登記',
    subTitle: '車號登記',
    icon: '/images/car.svg',
  },
  {
    value: 'search',
    title: '查詢',
    subTitle: '登記查詢',
    icon: '/images/magnifyingglass.svg',
  },
  {
    value: 'parkingInfo',
    title: '停車資訊',
    subTitle: '停車場位置與相關規範',
    icon: '/images/megaphone.svg',
  },
]

const counterList: TabItem[] = [
  {
    value: 'counterCheckIn',
    title: '臨櫃登記',
    subTitle: '由櫃台登記車號',
    icon: '/images/car.svg',
  },
  {
    value: 'selfCheckIn',
    title: '自助登記',
    subTitle: '房客自行登記車號',
    icon: '/images/calendar.svg',
  },
  {
    value: 'search',
    title: '查詢',
    subTitle: '登記查詢',
    icon: '/images/magnifyingglass.svg',
  },
  {
    value: 'logout',
    title: '登出',
    subTitle: '帳號登出',
    icon: '/images/running.svg',
  },
  {
    value: 'changePassword',
    title: '修改密碼及子帳號',
    subTitle: '修改登入密碼與子帳號管理',
    icon: '/images/key.svg',
  },
]

const shopList: TabItem[] = [
  {
    value: 'parkingDeduction',
    title: '停車折抵',
    subTitle: '輸入車號折抵小時數',
    icon: '/images/car.svg',
  },
  {
    value: 'search',
    title: '查詢',
    subTitle: '登記查詢',
    icon: '/images/magnifyingglass.svg',
  },
  {
    value: 'logout',
    title: '登出',
    subTitle: '帳號登出',
    icon: '/images/running.svg',
  },
  {
    value: 'changePassword',
    title: '修改密碼及子帳號',
    subTitle: '修改登入密碼與子帳號管理',
    icon: '/images/key.svg',
  },
]

const banquetList: TabItem[] = [
  {
    value: 'qrCode',
    title: '折抵 QRCode',
    subTitle: '自助輸入車號折抵 QRCode',
    icon: '/images/scanner.svg',
  },
  {
    value: 'search',
    title: '查詢',
    subTitle: '登記查詢',
    icon: '/images/magnifyingglass.svg',
  },
  {
    value: 'logout',
    title: '登出',
    subTitle: '帳號登出',
    icon: '/images/running.svg',
  },
  {
    value: 'changePassword',
    title: '修改密碼及子帳號',
    subTitle: '修改登入密碼與子帳號管理',
    icon: '/images/key.svg',
  },
]

export { banquetList, counterList, parkingList, shopList }
