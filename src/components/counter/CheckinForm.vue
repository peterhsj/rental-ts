<template>
  <div id="checkin" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__header bg-orange-lighten-5" @click="emits('close-form')">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-form ref="checkinFormRef" @submit.prevent="addParking">
          <v-row class="flex-0-1" dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="checkinForm.license_plate"
                autocomplete="off"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入車號"
                required
                :rules="rules.carRules"
                variant="outlined"
                @input="checkinForm.license_plate = checkinForm.license_plate.toUpperCase()"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-date-input
                v-model="checkinForm.reserve_start_date"
                append-inner-icon="fa:far fa-calendar-alt"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                :display-format="formatDate"
                :min="new Date()"
                placeholder="起：2026-01-01"
                prepend-icon=""
                required
                :rules="rules.startDateRule"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-date-input
                v-model="checkinForm.reserve_end_date"
                append-inner-icon="fa:far fa-calendar-alt"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                :display-format="formatDate"
                :min="new Date()"
                placeholder="迄：2026-01-01"
                prepend-icon=""
                required
                :rules="rules.endDateRule"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <div class="d-flex flex-wrap justify-end w-100">
                <v-btn
                  class="px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="light-green-darken-2"
                  height="40"
                  type="submit"
                  variant="flat"
                >
                  登記
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <!---- 登記列表 ---->
        <v-card v-if="parkingList.length > 0" class="mt-5 pa-2 rounded-lg bordered border-md bg-white flex-grow-1 overflow-y-auto" variant="outlined">
          <v-list>
            <v-list-item
              v-for="parking in parkingList"
              :key="parking.license_plate"
              class="py-2"
            >
              <div class="d-flex justify-space-between w-100">
                <v-row class="align-center flex-grow-1" no-gutters>
                  <v-col class="text-h5 font-weight-bold text-grey-darken-1" cols="12" md="4">
                    {{ parking.license_plate }}
                  </v-col>
                  <v-col class="text-subtitle-1 text-blue-darken-3" cols="12" md="4">
                    {{ parking.reserve_start_date }}
                  </v-col>
                  <v-col class="text-subtitle-1 text-blue-darken-3" cols="12" md="4">
                    {{ parking.reserve_end_date }}
                  </v-col>
                </v-row>
                <div>
                  <v-btn
                    class="text-red-darken-1"
                    density="comfortable"
                    icon="fa:fas fa-times-circle"
                    variant="flat"
                    @click="delParking(parking)"
                  />
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
        <v-row class="flex-0-1" no-gutters>
          <v-col cols="12">
            <div class="mt-3 d-flex flex-wrap justify-end w-100">
              <v-btn
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="saveForm"
              >
                完成離開
              </v-btn>
            </div>
          </v-col>
        </v-row>
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
  import api from '@/api/index.ts'
  import PromptDialog from '@/components/PromptDialog.vue'
  import { formatDate } from '@/utils/date.ts'

  // Props
  const props = defineProps({
    activeTab: {
      type: Object as () => TabItem,
      default: () => ({}),
    },
    userID: {
      type: Number,
      default: 0,
    },
  })
  const emits = defineEmits(['close-form'])
  const BaseUrl = import.meta.env.VITE_BASE_URL

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const loading = ref<boolean>(false)
  // checkin
  interface CheckinForm {
    id?: number
    license_plate: string
    reserve_start_date: string
    reserve_end_date: string
    note: string
  }
  const checkinForm = ref<CheckinForm>({
    license_plate: '',
    reserve_start_date: '',
    reserve_end_date: '',
    note: '',
  })
  const checkinFormRef = ref()
  const delItem = ref<CheckinForm | null>(null)
  interface Rules {
    carRules: Array<(v: any) => boolean | string>
    startDateRule: Array<(v: any) => boolean | string>
    endDateRule: Array<(v: any) => boolean | string>
  }
  const rules = ref<Rules>({
    carRules: [
      v => !!v || '車號為必填',
      v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )',
    ],
    startDateRule: [
      v => !!v || '請選擇起始日期',
      v => {
        if (!v || !checkinForm.value.reserve_end_date) return true

        const start = new Date(v)
        const end = new Date(checkinForm.value.reserve_end_date)
        if (!start || !end) return true
        return !isAfter(start, end) || '起始日期不能晚於結束日期'
      },
    ],
    endDateRule: [
      v => !!v || '請選擇結束日期',
      v => {
        if (!v || !checkinForm.value.reserve_start_date) return true
        const start = new Date(checkinForm.value.reserve_start_date)
        const end = new Date(v)
        if (!start || !end) return true
        return !isBefore(end, start) || '結束日期不能早於起始日期'
      },
    ],
  })
  interface Payload {
    license_plate: string
    reserve_start_date: string
    reserve_end_date: string
    note: string
  }
  const parkingList = ref<Payload[]>([])

  // 送出表單
  async function addParking (): Promise<void> {
    const { valid } = await checkinFormRef.value.validate()
    // 檢核欄位
    if (!valid) return
    const { license_plate, reserve_start_date, reserve_end_date, note } = checkinForm.value

    const payload = {
      license_plate,
      reserve_start_date: formatDate(reserve_start_date),
      reserve_end_date: formatDate(reserve_end_date),
      note,
    }

    // 檢查重複登記
    if (parkingList.value.length > 0) {
      const isDuplicate = parkingList.value.find(p => p.license_plate === license_plate)
      if (isDuplicate) {
        messageDialog.value = true
        messageTitle.value = '無法登記'
        message.value = `本車號已登記，須先刪除原本登記日期後才能再次申請。`
        isConfirmBtn.value = false
        return
      }
    }
    parkingList.value.push(payload)
    checkinFormRef.value.reset()
  }

  // 刪除登記車號
  function delParking (item: CheckinForm): void {
    delItem.value = item
    messageDialog.value = true
    messageTitle.value = '刪除登記車號'
    message.value = `確認刪除 ${item.license_plate} 申請車號？`
    isConfirmBtn.value = true
  }

  // 刪除登記車號確認
  function delParkingConfirm (): void {
    const { license_plate } = delItem.value || {}
    if (license_plate) {
      const index = parkingList.value.findIndex(p => p.license_plate === license_plate)
      if (index !== -1) {
        parkingList.value.splice(index, 1)
      }
    }
  }

  // 關閉表單
  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
  }
  async function saveForm (): Promise<void> {
    const payload = {
      userId: props.userID,
      reserve: parkingList.value,
    }

    if (parkingList.value.length === 0) {
      emits('close-form')
      return
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/register_counter?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        emits('close-form')
      } else {
        // 此車號已登記
        if (returnCode === -1) {
          messageTitle.value = '無法登記'
          message.value = `${returnMsg}`
          isConfirmBtn.value = false
          messageDialog.value = true
        }
      }
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
    delParkingConfirm()
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
