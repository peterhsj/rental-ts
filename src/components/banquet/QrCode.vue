<template>
  <div id="checkin" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__header rental__bg--light-orange" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <span>
          <v-img
            alt="icon"
            cover
            height="30"
            :src="`${BaseUrl}${props.activeTab.icon}`"
            width="35"
          />
        </span>
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ currentStatus === 'showList' ||　currentStatus === 'showQRCode' ? props.activeTab.title : '產出 QRCode' }}
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <!-- 登記列表 -->
        <v-card v-if="currentStatus === 'showList'" class="mt-5 pa-2 rounded-lg flex-grow-1 overflow-y-auto" variant="flat">
          <v-row v-if="qrCodeList.length > 0">
            <v-col
              v-for="item in qrCodeList"
              :key="item.id"
              cols="12"
              md="3"
              sm="6"
            >
              <v-card
                class="pa-2 rounded-lg bg-light-green-darken-1 text-white mb-4 d-flex flex-row align-center"
                :class="{'opacity-50': item.disabled}"
                :disabled="item.disabled"
                link
                variant="flat"
                @click="openQrCode(item)"
              >
                <div class="mx-4">
                  <v-img
                    alt="icon"
                    cover
                    height="30"
                    :src="`${BaseUrl}/images/qrcode.svg`"
                    width="35"
                  />
                </div>
                <div class="my-2">
                  <p class="py-1 text-h6 font-weight-regular">
                    {{ item.startDate }}
                  </p>
                  <p class="text-h6 font-weight-regular">
                    {{ item.title }}
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- 顯示 QRCode -->
        <v-card v-if="currentStatus === 'showQRCode'" class="mt-5 pa-2 rounded-lg flex-grow-1 overflow-y-auto" variant="flat">
          <!-- <div> -->
          <div class="ma-6 d-flex flex-column align-center justify-center">
            <span>
              <v-img
                alt="icon"
                color="black"
                cover
                height="200"
                :src="`${BaseUrl}/images/qrcode.svg`"
                width="200"
              />
            </span>
            <div class="my-6 d-flex flex-column align-center justify-center">
              <p class="py-6 text-h5 font-weight-bold">
                王林府喜宴
              </p>
              <p class="text-h5 font-weight-bold">
                有效日期
              </p>
              <p class="text-h5 font-weight-regular">
                2025-10-01 23:30
              </p>
              <p class="py-6 text-h5 font-weight-bold">
                折抵小時數 3
              </p>
            </div>
          </div>
          <!-- </div> -->
        </v-card>

        <!-- 產出 QRCode -->
        <v-card v-if="currentStatus === 'addQrCode'" class="mt-5 pa-2 rounded-lg flex-grow-1 overflow-y-auto" variant="flat">
          <v-form ref="qrCodeFormRef">
            <v-row class="flex-0-1" dense>
              <v-col cols="12">
                <p class="mt-1 mb-2 text-h6 text-grey-darken-1">
                  宴會名稱：
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="qrCodeForm.banquet_name"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="請輸入宴會名稱"
                  required
                  :rules="rules.nameRules"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <p class="mt-1 mb-2 text-h6 text-grey-darken-1">
                  有效日期及時間：
                </p>
              </v-col>
              <v-col class="d-flex flex-no-wrap align-center" cols="12" md="4">
                <v-date-input
                  v-model="qrCodeForm.banquet_start"
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
              <v-col class="d-flex flex-no-wrap align-center" cols="12" md="4">
                <v-row dense>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.startHour"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="hours"
                      placeholder="時"
                      required
                      :rules="[!!qrCodeForm.startHour || '請選擇時']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <span class="text-h5">:</span>
                  </v-col>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.startMinute"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="minutes"
                      placeholder="分"
                      required
                      :rules="[!!qrCodeForm.startMinute || '請選擇分']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <span class="text-h5">:</span>
                  </v-col>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.startSecond"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="seconds"
                      placeholder="秒"
                      required
                      :rules="[!!qrCodeForm.startSecond || '請選擇秒']"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="flex-0-1" dense>
              <v-col cols="12" md="4">
                <v-date-input
                  v-model="qrCodeForm.banquet_end"
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
              <v-col class="d-flex flex-no-wrap align-center" cols="12" md="4">
                <v-row dense>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.endHour"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="hours"
                      placeholder="時"
                      required
                      :rules="[!!qrCodeForm.endHour || '請選擇時']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <span class="text-h5">:</span>
                  </v-col>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.endMinute"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="minutes"
                      placeholder="分"
                      required
                      :rules="[!!qrCodeForm.endMinute || '請選擇分']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <span class="text-h5">:</span>
                  </v-col>
                  <v-col class="flex-grow-1" cols="auto">
                    <v-select
                      v-model="qrCodeForm.endSecond"
                      bg-color="white"
                      color="blue-darken-2"
                      density="compact"
                      :items="seconds"
                      placeholder="秒"
                      required
                      :rules="[!!qrCodeForm.endSecond || '請選擇秒']"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="flex-0-1" dense>
              <v-col cols="12" md="4">
                <v-select
                  v-model="qrCodeForm.count"
                  bg-color="white"
                  color="blue-darken-2"
                  density="compact"
                  item-title="title"
                  item-value="value"
                  :items="countList"
                  placeholder="請選擇時間"
                  required
                  :rules="rules.countRule"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <v-row class="flex-0-1" no-gutters>
          <v-col cols="12">
            <div class="mt-3 d-flex flex-wrap justify-end w-100">
              <v-btn
                v-if="currentStatus === 'showList'"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="setQrCode"
              >
                新增折抵 QRCode
              </v-btn>
              <v-btn
                v-if="currentStatus === 'showQRCode'"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="currentStatus = 'showList'"
              >
                回選單
              </v-btn>
              <v-btn
                v-if="currentStatus === 'addQrCode'"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click.prevent="addQrCodeConfirm"
              >
                產出 QRCode
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
<script setup>
  import { isAfter, isBefore } from 'date-fns'
  import { onMounted, ref } from 'vue'
  import api from '@/api'
  import PromptDialog from '@/components/PromptDialog.vue'
  import { formatDate } from '@/utils/date'

  // Props
  const props = defineProps({
    activeTab: {
      type: Object,
      default: () => ({}),
    },
    vendorId: {
      type: Number,
      required: true,
    },
  })
  const emits = defineEmits(['close-form'])
  const BaseUrl = import.meta.env.VITE_API_DOMAIN

  const loading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref(false)
  const messageTitle = ref('')
  const message = ref('')
  const isConfirmBtn = ref(false)

  const currentStatus = ref('')
  // QrCode 列表
  const qrCodeList = ref([])

  // qrCodeForm
  const qrCodeFormRef = ref()
  const qrCodeForm = ref({
    banquet_name: '',
    banquet_start: '',
    startHour: null,
    startMinute: null,
    startSecond: '00',
    banquet_end: '',
    endHour: null,
    endMinute: null,
    endSecond: '00',
    count: null,
  })
  const rules = ref({
    nameRules: [
      v => !!v || '請輸入宴會名稱',
    ],
    countRule: [
      v => !!v || '請選擇折抵時間',
    ],
    startDateRule: [
      v => !!v || '請選擇起始日期',
      v => {
        if (!v || !qrCodeForm.value.banquet_end) return true

        const start = new Date(v)
        const end = new Date(qrCodeForm.value.banquet_end)
        if (!start || !end) return true
        return !isAfter(start, end) || '起始日期不能晚於結束日期'
      },
    ],
    endDateRule: [
      v => !!v || '請選擇結束日期',
      v => {
        if (!v || !qrCodeForm.value.banquet_start) return true

        const start = new Date(qrCodeForm.value.banquet_start)
        const end = new Date(v)
        if (!start || !end) return true
        return !isBefore(end, start) || '結束日期不能早於起始日期'
      },
    ],
  })

  const countList = ref([
    { id: 'p01', value: 1, title: '1 小時' },
    { id: 'p02', value: 2, title: '2 小時' },
    { id: 'p01', value: 3, title: '3 小時' },
  ])
  // 時間選項
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

  // Fake qrCode list
  // const qrCodeListRef = ref([
  //   { id: 'p01', disabled: false, startDate: '2025-10-01', title: '王林府喜宴' },
  //   { id: 'p02', disabled: false, startDate: '2025-10-01', title: 'AIT 餐會' },
  //   { id: 'p01', disabled: true, startDate: '2025-10-01', title: 'YMCA 餐會' },
  //   { id: 'p02', disabled: false, startDate: '2025-10-01', title: '林王府喜宴' },
  // ])
  const currentItem = ref({})

  async function fetchQrCodeList () {
    const payload = {
      vendorId: props.vendorId,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/select_qr?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        console.log('data', data)
        qrCodeList.value = data[0]
      } else {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
      }
      currentStatus.value = 'showList'
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await fetchQrCodeList()
  })

  // 開啟 Qr Code 視窗
  function openQrCode (qrCode) {
    currentItem.value = qrCode
    currentStatus.value = 'showQRCode'
    console.log('currentItem', currentItem.value)
  }

  // 新增 QrCode
  function setQrCode () {
    currentStatus.value = 'addQrCode'
  }

  // 送出新增表單
  async function addQrCodeConfirm () {
    const { valid } = await qrCodeFormRef.value.validate()
    // 檢核欄位
    if (!valid) return
    const {
      banquet_name,
      banquet_start,
      startHour,
      startMinute,
      startSecond,
      banquet_end,
      endHour,
      endMinute,
      endSecond,
      count,
    } = qrCodeForm.value

    const startDateTime = `${formatDate(banquet_start)} ${startHour}:${startMinute}:${startSecond}`
    const endDateTime = `${formatDate(banquet_end)} ${endHour}:${endMinute}:${endSecond}`

    console.log('送出表單', qrCodeForm.value, startDateTime, endDateTime)
    const payload = {
      vendorId: props.vendorId,
      banquet_name,
      banquet_start: startDateTime,
      banquet_end: endDateTime,
      count,
    }
    console.log('payload', payload)
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/create_qr?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        console.log('data', data)
        await fetchQrCodeList()
        currentStatus.value = 'showQRCode'
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
  function onCloseForm () {
    emits('close-form')
  }

  // 確認 message
  function messageConfirm () {
    messageDialog.value = false
  }
  // 離開 message
  function messageClose () {
    messageDialog.value = false
  }
</script>
<style scoped lang="scss">
.time-picker-small {
  transform: scale(0.5);
  transform-origin: top left;
  :deep(.v-picker__body) {
    display: none;
  }
}
.time-picker-small :deep(.v-picker__body) {
  font-size: 1.2rem;
}
</style>
