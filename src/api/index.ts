import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 擴展 Axios 實例類型，使返回值為 response.data
declare module 'axios' {
  export interface AxiosInstance {
    request: <T = any, R = T>(config: InternalAxiosRequestConfig) => Promise<R>
    get: <T = any, R = T>(url: string, config?: InternalAxiosRequestConfig) => Promise<R>
    delete: <T = any, R = T>(url: string, config?: InternalAxiosRequestConfig) => Promise<R>
    head: <T = any, R = T>(url: string, config?: InternalAxiosRequestConfig) => Promise<R>
    options: <T = any, R = T>(url: string, config?: InternalAxiosRequestConfig) => Promise<R>
    post: <T = any, R = T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => Promise<R>
    put: <T = any, R = T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => Promise<R>
    patch: <T = any, R = T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => Promise<R>
  }
}

const api: AxiosInstance = axios.create({
  baseURL: 'https://rental.mitwit-cre.com.tw',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截：帶上 Token 等
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 回應攔截：統一錯誤處理
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    console.error('請求失敗：', error)
    return Promise.reject(error)
  },
)

export default api
