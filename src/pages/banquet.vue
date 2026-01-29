<template>
  <div id="banquet" class="d-flex flex-column bg-grey-lighten-4 h-100">
    <!-- PC永遠顯示，Mobile選擇後才隱藏 -->
    <v-container v-show="!isMobile || !isEdit" class="pb-1 rental rental__wrapper">
      <v-card class="pa-2" elevation="4" variant="elevated">
        <v-img
          alt="Banquet Image"
          color="surface-variant"
          cover
          height="200"
          :src="`${BaseUrl}/images/hotel_01.png`"
          width="100%"
        >
          <h1 class="ml-6 mt-4 text-h5 font-weight-bold">宴會廳自助折抵</h1>
        </v-img>
        <div class="pt-2 d-flex align-center">
          <v-avatar :image="`${BaseUrl}/images/profile.svg`" size="30" />
          <span class="ml-3 text-subtitle-1 font-weight-bold text-grey-darken-3">
            {{ memberInfo && memberInfo.vendor_name }}
            {{ memberInfo && memberInfo.acc_name }}
            您好！
          </span>
        </div>
      </v-card>
      <!-- 臨櫃選單 -->
      <TabList
        v-if="!isEdit"
        :tab-list="banquetList"
        @set-active-tab="setActiveTab"
      />
    </v-container>
    <!-- 折抵 qrCode -->
    <v-container v-if="activeTab?.value === 'qrCode' && memberInfo" id="qrCode" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <QrCode
        :active-tab="activeTab"
        :vendor-id="memberInfo.vendorId"
        @close-form="closeParkingDeduction"
      />
    </v-container>
    <!-- 查詢 -->
    <v-container v-if="activeTab?.value === 'search'" id="search" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <BanquetSearchForm
        :active-tab="activeTab"
        @close-form="closeParkingDeduction"
      />
    </v-container>
    <!-- 登出 -->
    <v-container v-if="activeTab?.value === 'logout'" id="logout" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <Logout
        :active-tab="activeTab"
        @on-login="login"
      />
    </v-container>
    <!-- 修改密碼及子帳號 -->
    <v-container v-if="activeTab?.value === 'changePassword' && memberInfo" id="changePassword" class="rental rental__wrapper flex-grow-1 overflow-y-hidden">
      <ChangePassword
        :active-tab="activeTab"
        :user-info="memberInfo"
        @on-close="onClose"
      />
    </v-container>
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
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { banquetList } from '@/utils/site.ts'

  interface MemberInfo {
    userId: number
    identity: string
    acc_name: string
    account: string
    // userphone: string
    // useraddress: string
    vendorId: number
    parkId: number
    unitId: number
    forTest: string
    vendor_name: string
    // name: string
    // phone: string
    // address: string
    // tax: string
    // mail: string
    // vendorTitle: string
    store_type: number
    remainPoints: number
    slipStyle: number
    // openDateFree: number
    // slipCode: string
    slipHour: string
    createTime: string
    deleteTime: string
    note: string
    enableTime: string
    disableTime: string
  }

  const BaseUrl = import.meta.env.VITE_BASE_URL
  const router = useRouter()
  const memberInfo = ref<MemberInfo | null>(null)

  const activeTab = ref<TabItem | null>(null)
  const isEdit = ref<boolean>(false)
  const isMobile = ref<boolean>(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  // 商店消費停車折抵選單切換
  function setActiveTab (tab: TabItem): void {
    activeTab.value = tab
    isEdit.value = true

    if (tab.value === 'logout') {
      // 清除 localStorage
      localStorage.removeItem('memberInfo')
      memberInfo.value = null
    }
  }

  // 回到停車折抵主畫面
  function closeParkingDeduction () {
    activeTab.value = null
    isEdit.value = false
  }

  // 登入
  function login (): void {
    activeTab.value = null
    isEdit.value = false
    router.push('/banquetLogin')
  }

  // 離開
  function onClose (): void {
    activeTab.value = null
    isEdit.value = false
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

  // 檢查 localStorage 並 取得 memberInfo 值
  function init (): void {
    const memberStorage = localStorage.getItem('memberInfo')
    if (memberStorage) {
      memberInfo.value = JSON.parse(memberStorage)
    } else {
      router.push('/banquetLogin')
    }
  }

  onMounted((): void => {
    init()
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  })

  onUnmounted((): void => {
    window.removeEventListener('resize', checkIsMobile)
  })
</script>

<style scoped lang="scss">
  :deep(.text-h6) {
    line-height: 1;
  }
</style>
