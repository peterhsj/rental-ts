<template>
  <div id="banquet" class="d-flex flex-column bg-grey-lighten-4 h-100">
    <!-- 查詢 -->
    <v-container id="search" class="rental rental__wrapper h-100" style="max-width: 600px;">
      <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
        <div class="px-4 py-3 d-flex align-center bg-orange-lighten-5">
          <v-avatar :image="`${BaseUrl}/images/check.svg`" size="40" />
          <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
            {{ decodedParams.vn }}
          </span>
        </div>
        <v-container class="pb-2 d-flex flex-column flex-grow-1 overflow-y-auto" style="height: calc(100% - 64px);">
          <div class="h-100">
            <v-form ref="searchFormRef" class="pt-4 py-1">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model.trim="searchForm.license_plate"
                    autocomplete="off"
                    bg-color="white"
                    class="pr-0"
                    color="blue-darken-2"
                    density="compact"
                    placeholder="請輸入車號"
                    required
                    :rules="rules.carRules"
                    variant="outlined"
                    @input="searchForm.license_plate = searchForm.license_plate.toUpperCase()"
                  >
                    <template #append-inner>
                      <v-btn
                        class="mr-n3 px-3"
                        color="blue-darken-3"
                        height="40"
                        type="button"
                        variant="flat"
                        @click="searchCarNumber"
                      >
                        查詢
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <!-- 入場資訊 -->
            <div v-if="parkingList">
              <v-card
                class="py-5 px-2 rounded-lg bg-blue-darken-3 text-center"
                variant="flat"
              >
                <p class="py-2 text-h6 font-weight-regular">入場資訊</p>
                <p class="py-2 text-h5 font-weight-bold">
                  {{ parkingList.license_plate }}
                </p>
                <p>{{ parkingList.arrival_time }}</p>
              </v-card>
              <!-- 繳費資訊 -->
              <div class="mt-5 d-flex flex-column align-center justify-center">
                <p class="my-4 text-h6">應繳金額</p>
                <p class="my-1">
                  <span class="mr-1">NT$</span>
                  <span class="text-h3 font-weight-bold">{{ parkingList.paymentAmount }}</span>
                </p>
              </div>
              <div class="mt-3 d-flex flex-wrap justify-center w-100">
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular text-white"
                  color="light-green-darken-2"
                  :disabled="parkingList.ischeck === 1"
                  height="60"
                  min-width="200"
                  variant="flat"
                  @click="onDeduction"
                >
                  折抵 {{ decodedParams.c }} 小時
                </v-btn>
              </div>
              <div class="mt-3 d-flex flex-wrap justify-center w-100">
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="orange-darken-2"
                  :disabled="!canPayment"
                  height="60"
                  min-width="200"
                  variant="flat"
                  @click="onlinePayment"
                >
                  線上繳費
                </v-btn>
              </div>
              <!-- 明細 -->
              <v-card
                v-if="discountList.length > 0"
                class="my-5 pa-3 rounded-lg bg-grey-lighten-4 w-100"
                variant="flat"
              >
                <v-row dense>
                  <template v-for="(item, index) in discountList" :key="index">
                    <v-col class="text-grey-darken-1" cols="8">
                      {{ item.vendor_name }}
                    </v-col>
                    <v-col class="text-grey-darken-1" cols="4">
                      {{ item.store_type === 2 ? '$' : '' }}
                      {{ item.amount }}
                      {{ item.store_type === 1 || item.store_type === 5 ? 'hr' : '' }}
                    </v-col>
                  </template>
                </v-row>
              </v-card>
            </div>
          </div>
        </v-container>
      </v-card>
      <!-- Prompt Dialog -->
      <PromptDialog
        v-model="messageDialog"
        :is-confirm-btn="isConfirmBtn"
        :message="message"
        :message-title="messageTitle"
        @on-close="messageClose"
        @prompt-confirm="messageConfirm"
      />
    </v-container>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import api from '@/api'

  const BaseUrl = import.meta.env.VITE_BASE_URL
  const router = useRouter()
  const route = useRoute()
  const isMobile = ref<boolean>(false)

  // 取得 URL 查詢參數
  interface QueryParams {
    c?: string // Base64 編碼的參數
    v?: string // Base64 編碼的參數
    vn?: string // Base64 編碼的參數 (venue name)
  }

  // 解碼 Base64
  function decodeBase64 (str: string): string {
    try {
      const text = atob(str)
      const bytes = Uint8Array.from(text, c => c.codePointAt(0) ?? 0)
      return new TextDecoder().decode(bytes)
    } catch (error) {
      console.error('Base64 解碼錯誤:', error)
      return str
    }
  }

  // 取得並解碼查詢參數
  const queryParams = ref<QueryParams>({})
  const decodedParams = ref<{
    c?: number
    v?: number
    vn?: string
  }>({})

  function getQueryParams (): void {
    queryParams.value = {
      c: route.query.c as string, // 時數
      v: route.query.v as string, // 商家
      vn: route.query.vn as string, // 商家名稱
    }

    // 解碼參數
    if (queryParams.value.c) {
      decodedParams.value.c = Number(decodeBase64(queryParams.value.c))
    }
    if (queryParams.value.v) {
      decodedParams.value.v = Number(decodeBase64(queryParams.value.v))
    }
    if (queryParams.value.vn) {
      decodedParams.value.vn = decodeBase64(queryParams.value.vn)
    }

    // console.log('原始參數:', queryParams.value)
    // console.log('解碼後參數:', decodedParams.value)
  }

  const loading = ref<boolean>(false)
  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  // 車號查詢
  const searchFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface SearchForm {
    license_plate: string
  }
  const searchForm = ref<SearchForm>({
    license_plate: '',
  })

  interface Rules {
    carRules: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    carRules: [
      v => !!v || '車號為必填',
      v => !/[-]/.test(v) || '車號不需輸入 - 符號',
      // v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )'
    ],
  })

  // const canDeduction = ref<boolean>(true)
  const canPayment = ref<boolean>(true)

  // parking list
  interface ParkingInfo {
    arrival_time: string // 入場時間
    license_plate: string // 車號
    paymentAmount: number // 應付金額
    ischeck: number // 是否已折抵 0 | 1
  }
  const parkingList = ref<ParkingInfo | null>(null)

  interface DiscountInfo {
    vendor_name: string
    amount: number
    store_type: number
  }
  const discountList = ref<DiscountInfo[]>([])

  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
    discount?: T
  }

  // 入場資訊查詢
  async function searchCarNumber (): Promise<void> {
    const { valid } = await searchFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return
    const { license_plate } = searchForm.value

    const payload = {
      license_plate,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/car_in_park_sel?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg, data, discount } = res
      if (returnCode === 0) {
        parkingList.value = data
        discountList.value = discount
        // searchFormRef.value?.reset()
      } else {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
      }
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }

    // 折抵已經超過上限
    // messageDialog.value = true
    // messageTitle.value = '折抵已經超過上限'
    // message.value = `AXN-1234 已當次折抵過，已無法再進行折抵。`
    // isConfirmBtn.value = false
  }

  // 停車折抵
  async function onDeduction (): Promise<void> {
    const payload = {
      license_plate: parkingList.value?.license_plate,
      count: decodedParams.value.c,
      vendorId: decodedParams.value.v,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/register_qr?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      console.log({ res })
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
      } else {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
      }
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }

    // messageDialog.value = true
    // messageTitle.value = '折抵成功'
    // message.value = `AXN-1234 已成功折抵 2 小時，感謝您的使用！`
    // isConfirmBtn.value = true
  }

  // 線上繳費
  function onlinePayment (): void {
    router.push('/Customer')
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 偵測手持裝置
  function checkIsMobile (): void {
    isMobile.value = window.innerWidth <= 960
  }

  onMounted((): void => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    getQueryParams() // 取得 URL 參數
  })

  onUnmounted((): void => {
    window.removeEventListener('resize', checkIsMobile)
  })
</script>

<style lang="scss" scoped>
  :deep(.text-h6) {
    line-height: 1;
  }
</style>
