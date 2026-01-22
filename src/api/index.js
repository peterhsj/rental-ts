import axios from 'axios'
// import qs from 'qs'

const api = axios.create({
  baseURL: 'https://rental.mitwit-cre.com.tw',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 若常要送 x-www-form-urlencoded，可以做一個輔助方法
/**
 * repeat: a=1&a=2
 * brackets: a[]=1&a[]=2
 * indices: a[0]=1&a[1]=2
 * comma: a=1,2
 */
// export function toForm(data, opts) {
//   return qs.stringify(data, {
//     arrayFormat: 'brackets', // 'brackets' | 'indices' | 'repeat' | 'comma'
//     allowDots: false,
//     encodeValuesOnly: true,
//     ...opts
//   })
// }

// 請求攔截：帶上 Token 等
api.interceptors.request.use(
  config => {
    // console.log('發送請求：', config)
    return config
  },
  error => Promise.reject(error),
)

// 回應攔截：統一錯誤處理
api.interceptors.response.use(
  response => {
    // console.log('響應數據：', response.data)
    return response.data
  },
  error => {
    console.error('請求失敗：', error)
    return Promise.reject(error)
  },
)

// // Vue 插件：注入到 this.$api / 組件的全域屬性
// export default {
//   install(app) {
//     app.config.globalProperties.$api = api
//   }
// }

export default api
