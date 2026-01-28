<template>
  <div id="checkin" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__header bg-orange-lighten-5" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}/images/profile.svg`" size="30" />
        <span class="ml-3 text-subtitle-1 font-weight-bold text-grey-darken-3">
          {{ props.memberInfo?.vendor_name }}
          [ {{ props.memberInfo?.acc_name }} ]
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-form ref="searchFormRef">
          <v-row class="flex-0-1" dense>
            <v-col cols="12">
              <p class="mt-1 mb-2 text-h6 text-blue-darken-3 text-center text-md-left">
                折抵記錄查詢
              </p>
            </v-col>
            <v-col cols="12" md="4">
              <v-date-input
                v-model="searchForm.start_time"
                append-inner-icon="fa:far fa-calendar-alt"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                :display-format="formatDate"
                placeholder="起：2026-01-01"
                prepend-icon=""
                required
                :rules="rules.startDateRule"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-date-input
                v-model="searchForm.end_time"
                append-inner-icon="fa:far fa-calendar-alt"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                :display-format="formatDate"
                placeholder="迄：2026-01-01"
                prepend-icon=""
                required
                :rules="rules.endDateRule"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <div class="d-flex justify-end w-100">
                <v-btn
                  class="px-8 w-75 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="blue-darken-2"
                  height="40"
                  variant="flat"
                  @click.prevent="onSearch"
                >
                  查詢
                </v-btn>
                <div class="w-25 w-sm-auto text-center">
                  <v-btn
                    class="px-2"
                    color="blue-darken-2"
                    height="40"
                    variant="text"
                  >
                    <v-img
                      alt="icon"
                      cover
                      height="30"
                      :src="`${BaseUrl}/images/ktorrent.svg`"
                      width="35"
                    />
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <v-container v-if="carList.length > 0" class="px-0 py-1">
          <v-row no-gutters>
            <v-col cols="12">
              <div class="mt-3 ga-2 d-flex justify-md-end flex-nowrap">
                <v-btn
                  class="my-2 px-8 text-h6 font-weight-regular text-white flex-1-1 flex-md-0-0"
                  color="grey-lighten-1"
                  height="40"
                  variant="flat"
                  @click="onCloseForm"
                >
                  全部
                </v-btn>
                <v-btn
                  class="my-2 px-8 text-h6 font-weight-regular text-white flex-1-1 flex-md-0-0"
                  color="grey-lighten-1"
                  height="40"
                  variant="flat"
                  @click="onCloseForm"
                >
                  折抵
                </v-btn>
                <v-btn
                  class="my-2 px-8 text-h6 font-weight-regular text-white flex-1-1 flex-md-0-0"
                  color="grey-lighten-1"
                  height="40"
                  variant="flat"
                  @click="onCloseForm"
                >
                  儲值
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card
          v-if="carList.length > 0"
          class="bg-white flex-grow-1 overflow-y-auto"
          variant="flat"
        >
          <v-list>
            <!-- 帳號列表 -->
            <v-list-item
              v-for="car in carList"
              :key="car.id"
              class="pa-0 border"
            >
              <div class="d-flex justify-space-between w-100">
                <v-row class="align-center flex-grow-1" no-gutters>
                  <v-col cols="4" md="3">
                    <div class="pl-4 pt-2 mt-2 mr-1 rounded-te-xl bg-blue-darken-3 text-subtitle-1" style="height: 40px;">
                      {{ car.plate }}
                    </div>
                  </v-col>
                  <v-col class="pl-2 text-no-wrap" cols="3" md="4">
                    {{ car.amount ? car.amount : '-' }} 小時
                  </v-col>
                  <v-col class="pl-2 text-subtitle-1 text-grey-darken-2" cols="5" md="5">
                    <div class="d-flex flex-column flex-md-row flex-lg-row justify-start" style="line-height: 1.4;">
                      <div class="text-body-2 text-no-wrap w-100 w-md-50">{{ car.discount_time }}</div>
                      <div class="text-body-2 text-no-wrap w-100 w-md-50">{{ car.name }} {{ car.account }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
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
  import { isAfter, isBefore } from 'date-fns'
  import { ref } from 'vue'
  import api from '@/api'
  import PromptDialog from '@/components/PromptDialog.vue'
  import { formatDate } from '@/utils/date.ts'

  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data: T
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
      vendor_name: string
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

  // searchForm
  const searchFormRef = ref<any>()
  interface SearchForm {
    start_time: string
    end_time: string
  }
  const searchForm = ref<SearchForm>({
    start_time: '',
    end_time: '',
  })

  interface Rules {
    startDateRule: Array<(v: any) => boolean | string>
    endDateRule: Array<(v: any) => boolean | string>
  }
  const rules = ref<Rules>({
    startDateRule: [
      v => !!v || '請選擇起始日期',
      v => {
        if (!v || !searchForm.value.end_time) return true

        const start = new Date(v)
        const end = new Date(searchForm.value.end_time)
        if (!start || !end) return true
        return !isAfter(start, end) || '起始日期不能晚於結束日期'
      },
    ],
    endDateRule: [
      v => !!v || '請選擇結束日期',
      v => {
        if (!v || !searchForm.value.start_time) return true

        const start = new Date(searchForm.value.start_time)
        const end = new Date(v)
        if (!start || !end) return true
        return !isBefore(end, start) || '結束日期不能早於起始日期'
      },
    ],
  })

  interface CarRecord {
    id: number
    plate: string
    amount: number
    discount_time: string
    name: string
    account: string
  }
  const carList = ref<CarRecord[]>([])

  // 商店折抵查詢
  async function onSearch (): Promise<void> {
    const { valid } = await searchFormRef.value.validate()
    // 檢核欄位
    if (!valid) return
    const { start_time, end_time } = searchForm.value
    const payload = {
      vendorId: props.memberInfo?.vendorId,
      start_time: formatDate(start_time),
      end_time: formatDate(end_time),
    }

    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/select_store?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        if (data.length === 0) {
          messageTitle.value = '訊息通知'
          message.value = `查無折抵記錄，請更改查詢條件後再試。`
          isConfirmBtn.value = false
          messageDialog.value = true
          carList.value = []
          return
        }
        carList.value = data
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

  // memberList.value = memberListRef.value

  // 正常狀況下
  // const newParking = {
  //   id: `p${String(parkingList.value.length + 1).padStart(2, '0')}`,
  //   carNumber: carNumber,
  //   startDate: formatDate(startDate),
  //   endDate: formatDate(endDate)
  // }
  // console.log('送出表單', newParking)
  // parkingList.value.push(newParking)
  // searchFormRef.value.reset()

  // 重複登記狀況下
  // messageDialog.value = true
  // messageTitle.value = '無法登記'
  // message.value = `本車號已登記，須先刪除原本登記日期後才能再次申請。`
  // isConfirmBtn.value = false
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
