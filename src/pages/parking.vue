<template>
  <div id="parkingView" class="d-flex flex-column bg-grey-lighten-4 h-100">
    <!-- PC永遠顯示，Mobile選擇後才隱藏 -->
    <v-container v-show="(!isMobile || !isEdit) && !isInfo" class="pb-1 rental rental__wrapper">
      <v-card class="pa-2" elevation="4" variant="elevated">
        <v-img
          alt="Parking Image"
          color="surface-variant"
          cover
          height="200"
          :src="`${BaseUrl}/images/hotel_01.png`"
          width="100%"
        >
          <h1 class="ml-6 mt-4 text-h5 font-weight-bold">住宿車輛登記</h1>
        </v-img>
      </v-card>
      <!-- 停車選單 -->
      <TabList
        v-if="!isEdit && !isInfo"
        :tab-list="parkingList"
        @set-active-tab="setActiveTab"
      />
    </v-container>
    <!-- 登記 -->
    <v-container v-if="isEdit && activeTab?.value === 'parking'" id="parking" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <SearchForm
        ref="searchFormRef"
        v-model:form-data="parkingForm"
        :active-tab="activeTab"
        @close-form="closeParkingForm"
        @send-form="sendParkingForm"
      />
    </v-container>
    <!-- 查詢 -->
    <v-container v-if="isEdit && activeTab?.value === 'search'" id="search" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <SearchForm
        ref="searchFormRef"
        v-model:form-data="parkingForm"
        :active-tab="activeTab"
        @close-form="closeParkingForm"
        @send-form="sendSearchForm"
      />
    </v-container>
    <!-- 訊息 -->
    <infoView
      v-if="isInfo"
      :info="info"
      :info-status="infoStatus"
      @info-close="infoClose"
      @re-write="reWrite"
    />
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
    <!-- 共用元件 -->
    <CommonOverlay :overlay="loading" />
  </div>
</template>
<script lang="ts" setup>
  import type { TabItem } from '@/utils/site.ts'

  import { onMounted, onUnmounted, ref } from 'vue'
  import api from '@/api'
  import CommonOverlay from '@/components/CommonOverlay.vue'
  import InfoView from '@/components/InfoView.vue'
  import SearchForm from '@/components/parking/SearchForm.vue'
  import PromptDialog from '@/components/PromptDialog.vue'
  import TabList from '@/components/TabList.vue'
  import { parkingList } from '@/utils/site.ts'

  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
  }

  interface ParkingData {
    license_plate: string
    reserve_start_date: string
    reserve_end_date: string
  }

  interface ParkingForm {
    ischeck: number
    phone: string
    license_plate: string
    captcha: string
  }

  const BaseUrl = import.meta.env.VITE_BASE_URL
  const loading = ref<boolean>(false)
  const activeTab = ref<TabItem | null>(null)
  const isEdit = ref<boolean>(false)
  const isMobile = ref<boolean>(false)
  /**
   * 搜尋表單的模板引用
   *
   * 用於獲取搜尋表單組件的實例，可以通過此引用訪問表單的方法和屬性，
   * 例如表單驗證、重置表單等操作。
   *
   * @type {Ref<ComponentPublicInstance | undefined>}
   */
  const searchFormRef = ref<InstanceType<typeof SearchForm>>()

  // parking
  const parkingForm = ref<ParkingForm>({
    ischeck: 0,
    phone: '',
    license_plate: '',
    captcha: '',
  })

  // Info View
  const isInfo = ref(false)
  const info = ref('')
  const infoStatus = ref('')

  // Prompt Message Dialog
  const messageDialog = ref(false)
  const messageTitle = ref('')
  const message = ref('')
  const isConfirmBtn = ref(false)

  // 停車選單切換
  function setActiveTab (tab: TabItem): void {
    if (tab.value === 'parkingInfo') {
      window.open('https://www.grand-hotel.org/TW/official/about-traffic.aspx?gh=TP', '_blank')
      return
    }
    activeTab.value = tab
    isEdit.value = true
  }

  // 登記停車
  async function sendParkingForm (): Promise<void> {
    const { ischeck, phone, license_plate } = parkingForm.value
    const payload = {
      ischeck,
      phone,
      license_plate,
    }

    loading.value = true
    const apiUrl = '/member/grand_hotel/register_cus?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res

      if (returnCode === 0) {
        // 登記成功後查詢資料
        sendSearchForm()
      } else {
        // 查無登記資訊
        if (returnCode === -1) {
          info.value = `<p class="my-2 text-h4 text-grey-darken-1 font-weight-bold">
            查無登記資訊
          </p>
          <p class="mt-4 mb-7 text-h5 text-amber-darken-3 font-weight-bold text-center">
            請重新確認登記手機號碼或再次輸入
          </p>
          <p class="mt-7 mb-0 text-h5 text-grey-darken-1 text-center">
            另可聯繫飯店客服<br>
            02-1234567
          </p>`
          isEdit.value = false
          isInfo.value = true
          infoStatus.value = 'error'
          searchFormRef.value?.initForm()
        } else if (returnCode === 3) {
          // 登記手機號碼已有申請車輛
          messageTitle.value = '登記手機號碼已有申請車輛'
          message.value = `${returnMsg}`
          isConfirmBtn.value = true
          messageDialog.value = true
        } else {
          // 其他錯誤
          messageTitle.value = '訊息通知'
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

  // 查詢停車登記
  async function sendSearchForm () {
    const { phone, license_plate } = parkingForm.value
    const payload = {
      phone,
      license_plate,
    }

    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/select_cus?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse<ParkingData[]>>(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      console.log('message', returnMsg)

      if (returnCode === 0) {
        // 成功
        const parkingData = data![0]!
        const { license_plate, reserve_start_date, reserve_end_date } = parkingData
        // 提交 - 已完成登記
        isEdit.value = false
        isInfo.value = true
        infoStatus.value = 'success'
        info.value = `<p class="text-h4 text-grey-darken-1 font-weight-bold my-2">
          已完成登記
        </p>
        <p class="rental__text--h45 text-grey-darken-1 font-weight-bold mt-3">
          車號
        </p>
        <p class="text-h5 text-amber-darken-3 font-weight-bold my-0">
          ${license_plate}
        </p>
        <p class="rental__text--h45 text-grey-darken-1 font-weight-bold mt-4">
          停放日期
        </p>
        <p class="text-h5 text-amber-darken-3 font-weight-bold my-0">
          ${reserve_start_date} ~ ${reserve_end_date}
        </p>`
        searchFormRef.value?.initForm()
      } else {
        // 查無登記資訊
        if (returnCode === -1) {
          info.value = `<p class="my-2 text-h4 text-grey-darken-1 font-weight-bold">
            查無登記資訊
          </p>
          <p class="mt-4 mb-7 text-h5 text-amber-darken-3 font-weight-bold text-center">
            請重新確認登記手機號碼或再次輸入
          </p>
          <p class="mt-7 mb-0 text-h5 text-grey-darken-1 text-center">
            另可聯繫飯店客服<br>
            02-1234567
          </p>`
          isEdit.value = false
          isInfo.value = true
          infoStatus.value = 'error'
          searchFormRef.value?.initForm()
        }
        // 登記手機號碼已有申請車輛
        if (returnCode === 3) {
          messageTitle.value = '登記手機號碼已有申請車輛'
          message.value = `<p>此電話已經申請車號 ${license_plate}，確認是否要覆蓋原有車號？</p>`
          isConfirmBtn.value = true
          messageDialog.value = true
        }
      }
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }
  }

  // 關閉停車輸入表單
  function closeParkingForm (): void {
    activeTab.value = null
    searchFormRef.value?.initForm()
    isEdit.value = false
  }

  // 重新輸入按鈕
  function reWrite (): void {
    isInfo.value = false
    isEdit.value = true
  }

  // 離開訊息按鈕
  function infoClose (): void {
    isInfo.value = false
    isEdit.value = false
    activeTab.value = null
    parkingForm.value = {
      ischeck: 0,
      phone: '',
      license_plate: '',
      captcha: '',
    }
  }

  // 確認 message
  function messageConfirm (): void {
    parkingForm.value.ischeck = 1
    sendParkingForm()
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
