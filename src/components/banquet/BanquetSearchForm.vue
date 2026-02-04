<template>
  <div id="search" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__header bg-orange-lighten-5" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column" style="height: calc(100% - 64px);">
        <v-form ref="searchFormRef">
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
        <div v-if="parkingList" class="mt-3">
          <!-- 入場資訊 -->
          <v-card
            class="px-2 py-5 rounded-lg bg-blue-darken-3 text-center"
            variant="flat"
          >
            <p>入場資訊</p>
            <p class="py-2 text-h6 font-weight-bold">
              {{ parkingList.license_plate }}
            </p>
            <p>{{ parkingList.arrival_time }}</p>
          </v-card>
          <!-- 繳費資訊 -->
          <v-card
            class="mt-5 pa-2 d-flex flex-column align-center bg-white"
            variant="flat"
          >
            <p class="my-4 text-h6">應繳金額</p>
            <p class="my-1">
              <span class="mr-1">NT$</span>
              <span class="text-h3 font-weight-bold">{{ parkingList.paymentAmount }}</span>
            </p>
            <!-- <p class="my-4 text-h6">折抵時數 / 當次折抵</p>
            <div class="ma-4 d-flex align-center justify-space-around w-100">
              <v-btn
                type="button"
                color="blue-darken-3"
                variant="flat"
                class="ma-2 px-4 text-none rounded-pill"
                height="40"
                :disabled="!canDeduction"
                @click="selectedHours(1)"
              >
                1 hr
              </v-btn>
              <v-btn
                type="button"
                color="blue-darken-3"
                variant="flat"
                class="ma-2 px-4 text-none rounded-pill"
                height="40"
                :disabled="!canDeduction"
                @click="selectedHours(2)"
              >
                2 hr
              </v-btn>
              <v-btn
                type="button"
                color="blue-darken-3"
                variant="flat"
                class="ma-2 px-4 text-none rounded-pill"
                height="40"
                :disabled="!canDeduction"
                @click="selectedHours(3)"
              >
                3 hr
              </v-btn>
            </div> -->

            <!-- <div class="mt-3 d-flex flex-wrap justify-center w-100">
              <v-btn
                v-if="canDeduction"
                color="red-darken-1"
                variant="flat"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                height="40"
                @click="onDeduction"
              >
                折抵
              </v-btn>
              <v-btn
                v-else
                color="blue-darken-3"
                variant="flat"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                height="40"
                @click="onCloseForm"
              >
                回上一頁
              </v-btn>
            </div> -->

            <!-- 明細 -->
            <v-card
              v-if="discountList.length > 0"
              class="mt-7 mb-2 pa-3 rounded-lg bg-grey-lighten-4 w-100"
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
  import { ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import api from '@/api'

  // Props
  interface Props {
    activeTab?: TabItem
  }
  const props = withDefaults(defineProps<Props>(), {
    activeTab: Object as () => TabItem,
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

  // carNumber 查詢
  const searchFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface SearchForm {
    license_plate: string
  }
  const searchForm = ref<SearchForm>({
    license_plate: '',
  })

  interface Rules {
    carRules: Array<(v: string) => string | boolean>
  }
  const rules = ref<Rules>({
    carRules: [
      v => !!v || '車號為必填',
      v => !/[-]/.test(v) || '車號不需輸入 - 符號',
      // v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )'
    ],
  })
  const loading = ref<boolean>(false)

  interface ParkingInfo {
    arrival_time: string // 入場時間
    license_plate: string // 車號
    paymentAmount: number // 應付金額
    ischeck: number // 是否已折抵 0: 可折抵 | 1: 已進行折抵，不能再折抵 | 2: 已達折抵上限，不能再折抵
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
    // 重設資料
    parkingList.value = null
    discountList.value = []

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
        if (data.ischeck !== 0) {
          messageTitle.value = '訊息通知'
          message.value = data.ischeck === 1 ? `${license_plate} 已進行住宿折抵，無法再折抵` : `${license_plate} 折抵已到達上限，無法再折抵`
          isConfirmBtn.value = false
          messageDialog.value = true
        }
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
  function selectedHours (hours: number): void {
    console.log('選擇折抵時數', hours)
  }

  // 折抵停車時數
  function onDeduction (): void {
    console.log('選擇折抵時數')
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
