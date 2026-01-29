<template>
  <div id="search" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__bg--light-blue rental__header" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-form ref="searchFormRef" @submit.prevent="searchHandler">
          <v-row class="flex-0-1" dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchForm.phone"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入登記手機號碼"
                :rules="rules.phoneRules"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchForm.license_plate"
                autocomplete="off"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                hide-details="auto"
                placeholder="請輸入車號"
                :rules="rules.carRules"
                variant="outlined"
                @input="searchForm.license_plate = searchForm.license_plate.toUpperCase()"
              />
            </v-col>
            <v-col cols="12">
              <p class="text-subtitle-2 text-red-darken-1">
                輸入其中之一即可。
              </p>
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
                  查詢
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <v-card v-if="parkingList.length > 0" class="mt-5 pa-2 rounded-lg bordered border-md bg-white flex-grow-1 overflow-y-auto" variant="outlined">
          <v-list>
            <v-list-item
              v-for="(parking, index) in parkingList"
              :key="index"
              class="py-2"
            >
              <div class="d-flex flex-column w-100">
                <v-row class="align-center" no-gutters>
                  <v-col class="rental__text--h4 font-weight-bold" cols="12" md="4">
                    <span class="text-grey-darken-1">登記來源</span>
                    <span class="ml-3 text-amber-darken-3">
                      {{ parking.reserve_type === '2' ? '臨櫃' : '自助' }}
                    </span>
                  </v-col>
                  <v-col class="rental__text--h4 font-weight-bold" cols="12" md="4">
                    <span class="text-grey-darken-1">登記帳號</span>
                    <span class="ml-3 text-amber-darken-3">
                      {{ parking.reserve_acc }}
                    </span>
                  </v-col>
                  <v-col class="rental__text--h4 font-weight-bold d-flex flex-nowrap" cols="12" md="4">
                    <div class="text-grey-darken-1 text-no-wrap">登記日期</div>
                    <div class="ml-3 text-amber-darken-3">
                      {{ parking.reserve_date }}
                    </div>
                  </v-col>
                </v-row>
                <v-row class="align-center mt-3" no-gutters>
                  <v-col class="rental__text--h4 font-weight-bold" cols="12" md="4">
                    <span class="text-grey-darken-1">車　　號</span>
                    <span class="ml-3 text-amber-darken-3">
                      {{ parking.license_plate }}
                    </span>
                  </v-col>
                  <v-col class="rental__text--h4 font-weight-bold" cols="12" md="4">
                    <span class="text-grey-darken-1">起　　日</span>
                    <span class="ml-3 text-amber-darken-3">
                      {{ parking.reserve_start_date }}
                    </span>
                  </v-col>
                  <v-col class="rental__text--h4 font-weight-bold" cols="12" md="4">
                    <span class="text-grey-darken-1">迄　　日</span>
                    <span class="ml-3 text-amber-darken-3">
                      {{ parking.reserve_end_date }}
                    </span>
                  </v-col>
                </v-row>
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
                @click="onCloseForm"
              >
                回選單
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
  import { ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import api from '@/api'

  // Props
  interface Props {
    activeTab?: TabItem
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
  interface SearchForm {
    phone: string
    license_plate: string
  }
  const searchForm = ref<SearchForm>({
    phone: '',
    license_plate: '',
  })
  const searchFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface Rules {
    phoneRules: Array<(v: string) => boolean | string>
    carRules: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    phoneRules: [
      v => !v || /^\d{10}$/.test(v) || '請輸入有效的手機號碼',
    ],
    carRules: [
      v => !v || /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )',
    ],
  })

  // parking list
  interface ParkingItem {
    id: number
    reserve_type: string
    reserve_acc: string
    reserve_date: string
    license_plate: string
    reserve_start_date: string
    reserve_end_date: string
  }
  const parkingList = ref<ParkingItem[]>([])

  // 查詢表單
  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T
  }
  async function searchHandler (): Promise<void> {
    const { valid } = await searchFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return
    const { phone, license_plate } = searchForm.value

    if (phone === '' && license_plate === '') {
      messageDialog.value = true
      messageTitle.value = '無法登記'
      message.value = `請輸入登記手機號碼或登記車號`
      isConfirmBtn.value = false
      return
    }
    const payload = { phone, license_plate }

    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/select_counter?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        parkingList.value = data
        searchFormRef.value?.reset()
      } else {
        messageDialog.value = true
        messageTitle.value = '訊息'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
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
