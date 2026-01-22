<script setup>
  import { ref } from 'vue'
  import api from '@/api'
  import PromptDialog from '@/components/PromptDialog.vue'

  // Props
  const props = defineProps({
    activeTab: {
      type: Object,
      default: () => ({}),
    },
  })
  const emits = defineEmits(['closeForm'])
  const BaseUrl = import.meta.env.VITE_API_DOMAIN

  // Prompt Message Dialog
  const messageDialog = ref(false)
  const messageTitle = ref('')
  const message = ref('')
  const isConfirmBtn = ref(false)

  // carNumber 查詢
  const formRef = ref()
  const form = ref({
    carNumber: '',
  })
  const rules = ref({
    carRules: [
      v => !!v || '車號為必填',
      v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )',
    ],
  })
  const loading = ref(false)
  const canDeduction = ref(false)
  const parkingList = ref([])

  // 送出表單
  async function searchCarNumber () {
    console.log('送出表單', form.value.carNumber)
    const { valid } = await formRef.value.validate()
    // 檢核欄位
    if (!valid) return
    const { license_plate } = form.value

    const payload = {
      license_plate,
    }
    console.log('payload', payload)
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/car_in_park_sel?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        console.log('data', data)
      // storeInfo.value = data[0]
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
  function selectedHours (hours) {
    console.log('選擇折抵時數', hours)
  }

  // 折抵停車時數
  function onDeduction () {
    console.log('選擇折抵時數')
  }

  // 關閉表單
  function onCloseForm () {
    emits('closeForm')
  }

  // 確認 message
  function messageConfirm () {
    messageDialog.value = false
    delParkingConfirm()
  }
  // 離開 message
  function messageClose () {
    messageDialog.value = false
  }
</script>

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
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.license_plate"
                autocomplete="off"
                bg-color="white"
                class="pr-0"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入車號"
                required
                :rules="rules.carRules"
                variant="outlined"
                @input="form.license_plate = form.license_plate.toUpperCase()"
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
          v-if="parkingList.length > 0"
          class="pa-2 rounded-lg bg-blue-darken-3 text-center"
          variant="flat"
        >
          <p>入場資訊</p>
          <p class="py-2 text-h6 font-weight-bold">AXN-1234</p>
          <p>2025-10-01 12:30:29</p>
        </v-card>
        <!-- 繳費資訊 -->
        <v-card
          v-if="parkingList.length > 0"
          class="mt-5 pa-2 d-flex flex-column align-center rounded-lg bordered border-md bg-white"
          variant="outlined"
        >
          <p class="my-4 text-h6">應繳金額</p>
          <p class="my-1">
            <span class="mr-1">NT$</span>
            <span class="text-h3 font-weight-bold">150</span>
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
          <v-card class="my-2 pa-3 rounded-lg bg-grey-lighten-4 w-100" variant="flat">
            <v-row dense>
              <v-col class="text-grey-darken-1" cols="8">
                花園咖啡廳
              </v-col>
              <v-col class="text-grey-darken-1" cols="4">
                2 hr
              </v-col>
              <v-col class="text-grey-darken-1" cols="8">
                民歌西餐廳
              </v-col>
              <v-col class="text-grey-darken-1" cols="4">
                2 hr
              </v-col>
            </v-row>
          </v-card>
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
