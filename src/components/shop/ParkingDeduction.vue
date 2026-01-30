<template>
  <div id="parkingDeduction" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__header bg-orange-lighten-5" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}/images/profile.svg`" size="30" />
        <span class="ml-3 text-subtitle-1 font-weight-bold text-grey-darken-3">
          {{ props.memberInfo?.vendor_name }}
          [ {{ props.memberInfo?.acc_name }} ]
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column" style="height: calc(100% - 64px);">
        <div class="flex-grow-1 overflow-hidden overflow-y-auto">
          <div class="d-flex justify-center my-8">
            <v-avatar color="blue-darken-3" size="170">
              <span v-if="storeInfo?.remainPoints === -1">
                <v-icon class="" icon="fa:fas fa-infinity" size="80" />
              </span>
              <span v-else class="text-h3">{{ storeInfo?.remainPoints }}</span>
            </v-avatar>
          </div>
          <v-form ref="searchFormRef">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="searchForm.license_plate"
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
          <v-card
            v-if="carInfo && carInfo.license_plate"
            class="pa-2 rounded-lg bg-blue-darken-3 text-center"
            variant="flat"
          >
            <p>入場資訊</p>
            <p class="py-2 text-h6 font-weight-bold">
              {{ carInfo.license_plate }}
            </p>
            <p>{{ carInfo.arrival_time }}</p>
          </v-card>
          <!-- 繳費資訊 -->
          <v-card
            v-if="carInfo && carInfo.license_plate"
            class="mt-5 pa-2 d-flex flex-column align-center rounded-lg bordered border-md bg-white"
            variant="outlined"
          >
            <p class="my-4 text-h6">應繳金額</p>
            <p class="my-1">
              <span class="mr-1">NT$</span>
              <span class="text-h3 font-weight-bold">
                {{ carInfo.paymentAmount }}
              </span>
            </p>
            <p class="my-4 text-h6">
              {{ storeInfo?.slipStyle === 20 ? '當次折抵' : '折抵時數' }}
            </p>
            <div class="ma-4 d-flex align-center justify-space-around w-100">
              <template v-if="storeInfo?.slipStyle === 18 || storeInfo?.slipStyle === 19">
                <v-btn
                  v-for="(hourItem, index) in slipHours"
                  :key="index"
                  class="my-2 mx-1 px-4 text-none rounded-pill"
                  :color="selectedHour === hourItem ? 'blue-lighten-1' : 'blue-darken-3'"
                  :disabled="!canDeduction || (storeInfo?.remainPoints !== undefined && storeInfo?.remainPoints < 1)"
                  height="40"
                  type="button"
                  variant="flat"
                  @click="selectedHours(hourItem)"
                >
                  {{ hourItem }} hr
                </v-btn>
              </template>
              <v-btn
                v-if="storeInfo?.slipStyle === 19 || storeInfo?.slipStyle === 20"
                class="my-2 mx-1 px-4 text-none rounded-pill"
                :color="selectedHour === 24 ? 'blue-lighten-1' : 'blue-darken-3'"
                :disabled="!canDeduction"
                height="40"
                type="button"
                variant="flat"
                @click="selectedHours(24)"
              >
                24 hr
              </v-btn>
            </div>

            <div class="mt-3 d-flex flex-wrap justify-center w-100">
              <v-btn
                v-if="canDeduction || (storeInfo?.remainPoints !== undefined && storeInfo?.remainPoints > 0)"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="red-darken-1"
                height="40"
                variant="flat"
                @click="onDeduction"
              >
                折抵
              </v-btn>
              <v-btn
                v-else
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="onCloseForm"
              >
                回上一頁
              </v-btn>
            </div>

            <!-- 明細 -->
            <v-card
              v-if="discountList.length > 0"
              class="my-2 pa-3 rounded-lg bg-grey-lighten-4 w-100"
              variant="flat"
            >
              <v-row dense>
                <template v-for="(item, index) in discountList" :key="index">
                  <v-col class="text-grey-darken-1" cols="8">
                    {{ item.vendor_name }}
                  </v-col>
                  <v-col class="text-grey-darken-1" cols="4">
                    {{ item.amount }}
                    {{ item.store_type === 1 || item.store_type === 5 ? 'hr' : 'NT$' }}
                  </v-col>
                </template>
              </v-row>
            </v-card>
          </v-card>
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
  </div>
</template>
<script setup lang="ts">
  import type { TabItem } from '@/utils/site.ts'
  import { onMounted, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import api from '@/api'

  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
    discount?: T
  }

  // Props
  interface Props {
    activeTab?: TabItem
    memberInfo?: {
      userId?: number
      identity?: string
      acc_name: string
      account?: string
      vendorId: number
      parkId?: number
      unitId?: number
      forTest?: string
      vendor_name: string
      store_type: number
      remainPoints?: number
      slipStyle: number
      slipHour: string
      createTime?: string
      deleteTime?: string
      note?: string
      enableTime?: string
      disableTime?: string
    }
  }
  const props = withDefaults(defineProps<Props>(), {
    activeTab: () => ({} as TabItem),
  })
  const emits = defineEmits<{
    'close-form': []
  }>()
  const BaseUrl = import.meta.env.VITE_BASE_URL

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const loading = ref<boolean>(false)
  const canDeduction = ref<boolean>(false)

  // carNumber 查詢
  const searchFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface SearchForm {
    license_plate: string
  }
  const searchForm = ref<SearchForm>({
    license_plate: '',
  })

  interface CarInfo {
    license_plate?: string
    arrival_time?: string
    paymentAmount?: number
    ischeck?: number
  }
  const carInfo = ref<CarInfo | null>(null)

  interface DiscountItem {
    vendor_name: string
    amount: number
    store_type: number
  }
  const discountList = ref<DiscountItem[]>([])

  interface Rules {
    carRules: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    carRules: [
      v => !!v || '車號為必填',
    // v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )'
    ],
  })

  // 折抵商店資訊
  interface StoreInfo {
    vendorId?: string
    store_type?: number
    remainPoints?: number
    slipStyle?: number
    slipHour?: string
  }
  const storeInfo = ref<StoreInfo | null>(null)
  const slipHours = ref<number[]>([])
  const selectedHour = ref<number | null>(null)

  // 取得折抵剩餘時數
  async function getStore (): Promise<void> {
    if (!props.memberInfo?.vendorId) return

    const payload = {
      id: props.memberInfo.vendorId,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/get_store?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        storeInfo.value = data[0]
        slipHours.value = data[0].slipHour.split(',').map(Number)
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
  }

  onMounted(async () => {
    await getStore()
  })

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
        carInfo.value = data
        discountList.value = discount
        canDeduction.value = data.ischeck === 0
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

  // parkingList.value = [{
  //   id: 'p01',
  //   phoneNumber: '',
  //   carNumber: 'ABC-1234',
  //   startDate: '2025-10-01 12:30:29',
  //    endDate: '2025-10-01'
  // }]

  // 正常狀況下
  // const newParking = {
  //   id: `p${String(parkingList.value.length + 1).padStart(2, '0')}`,
  //   carNumber: carNumber,
  //   startDate: formatDate(startDate),
  //   endDate: formatDate(endDate)
  // }
  // console.log('送出表單', newParking)
  // parkingList.value.push(newParking)
  // checkinFormRef.value.reset()

  // 折抵已經超過上限
  // messageDialog.value = true
  // messageTitle.value = '折抵已經超過上限'
  // message.value = `AXN-1234 已當次折抵過，已無法再進行折抵。`
  // isConfirmBtn.value = false
  }

  // 選擇折抵時數
  function selectedHours (hour: number): void {
    // console.log('選擇折抵時數', hour)
    selectedHour.value = hour
  }

  // 商店折抵登記
  async function onDeduction (): Promise<void> {
    // 檢核欄位
    if (!selectedHour.value) {
      messageTitle.value = '訊息通知'
      message.value = '請選擇折抵時數'
      isConfirmBtn.value = false
      messageDialog.value = true
      return
    }

    const payload = {
      vendorId: storeInfo.value?.vendorId,
      store_type: storeInfo.value?.store_type,
      license_plate: searchForm.value.license_plate,
      count: selectedHour.value,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/register_store?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        // 初始化資料
        await getStore()
        searchFormRef.value?.reset()
        carInfo.value = {}
        discountList.value = []
        selectedHour.value = null
        canDeduction.value = false
        // 通知訊息
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
  }

  // 關閉表單
  function onCloseForm (): void {
    emits('close-form')
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
