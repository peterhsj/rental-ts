<template>
  <div id="banquet" class="d-flex flex-column bg-grey-lighten-4 h-100">
    <!-- 查詢 -->
    <v-container id="search" class="rental rental__wrapper h-100" style="max-width: 600px;">
      <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
        <div class="px-4 py-3 d-flex align-center bg-orange-lighten-5">
          <v-avatar :image="`${BaseUrl}/images/check.svg`" size="40" />
          <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
            折抵 松鶴會館
          </span>
        </div>
        <v-container class="pb-2 d-flex flex-column flex-grow-1 overflow-y-auto" style="height: calc(100% - 64px);">
          <div class="h-100">
            <v-form ref="searchFormRef" class="pt-4 py-1">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="searchForm.carNumber"
                    autocomplete="off"
                    bg-color="white"
                    class="pr-0"
                    color="blue-darken-2"
                    density="compact"
                    placeholder="請輸入車號"
                    required
                    :rules="rules.carRules"
                    variant="outlined"
                    @input="searchForm.carNumber = searchForm.carNumber.toUpperCase()"
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
            <div v-if="parkingList.length > 0">
              <v-card
                class="pa-2 rounded-lg bg-blue-darken-3 text-center"
                variant="flat"
              >
                <p class="py-2 text-h6 font-weight-regular">入場資訊</p>
                <p class="py-2 text-h5 font-weight-bold">AXN-1234</p>
                <p>2025-10-01 12:30:29</p>
              </v-card>
              <!-- 繳費資訊 -->
              <div class="mt-5 d-flex flex-column align-center justify-center">
                <p class="my-4 text-h6">應繳金額</p>
                <p class="my-1">
                  <span class="mr-1">NT$</span>
                  <span class="text-h3 font-weight-bold">150</span>
                </p>
              </div>
              <div class="mt-3 d-flex flex-wrap justify-center w-100">
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular text-white"
                  color="light-green-darken-2"
                  :disabled="!canDeduction"
                  height="60"
                  min-width="200"
                  variant="flat"
                  @click="onDeduction"
                >
                  折抵 2 小時
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
                class="my-5 pa-3 rounded-lg bg-grey-lighten-4 w-100"
                variant="flat"
              >
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
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'

  const BaseUrl = import.meta.env.VITE_BASE_URL
  const router = useRouter()

  const isMobile = ref<boolean>(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  // carNumber 查詢
  const searchFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface SearchForm {
    carNumber: string
  }
  const searchForm = ref<SearchForm>({
    carNumber: '',
  })

  interface Rules {
    carRules: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    carRules: [
      v => !!v || '車號為必填',
      // v => /^[A-Z]{1}[0-9A-Z]{3,4}$/.test(v) || '請輸入有效的車號'
    ],
  })

  const canDeduction = ref<boolean>(true)
  const canPayment = ref<boolean>(true)

  // parking list
  interface ParkingInfo {
    id: string
    phoneNumber: string
    carNumber: string
    startDate: string
    endDate: string
  }
  const parkingList = ref<ParkingInfo[]>([])

  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
  }

  // 查詢表單
  async function searchCarNumber (): Promise<void> {
    console.log('送出表單', searchForm.value.carNumber)
    const { valid } = await searchFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return;
    const { carNumber } = searchForm.value

    parkingList.value = [{
      id: 'p01',
      phoneNumber: '',
      carNumber: 'ABC-1234',
      startDate: '2025-10-01 12:30:29',
      endDate: '2025-10-01',
    }]

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

  function onDeduction (): void {
    messageDialog.value = true
    messageTitle.value = '折抵成功'
    message.value = `AXN-1234 已成功折抵 2 小時，感謝您的使用！`
    isConfirmBtn.value = true
  }

  function onlinePayment (): void {
    router.push('/Customer')
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
    // isInfo.value = true
    // infoStatus.value = 'success'
    // initForm()
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
