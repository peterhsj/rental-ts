<template>
  <div id="changePassword" class="h-100">
    <!-- 修改子帳號及密碼 - 首頁 -->
    <v-card v-if="currentPage === 'home'" class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__bg--light-orange rental__header" @click="onClose">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <div class="flex-grow-1">
          <v-row class="my-8">
            <v-col class="text-center" cols="12" md="6">
              <v-btn
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular w-ms-100"
                color="light-green-darken-2"
                height="40"
                style="min-width:170px;"
                variant="flat"
                @click="changePwd"
              >
                修改密碼
              </v-btn>
            </v-col>
            <v-col v-if="props.userInfo.identity === '1'" class="text-center" cols="12" md="6">
              <v-btn
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular rental__bg--brown"
                height="40"
                style="min-width:170px;"
                variant="flat"
                @click="setSubAccount"
              >
                子帳號管理
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row class="flex-0-1" no-gutters>
          <v-col cols="12">
            <div class="mt-3 d-flex flex-wrap justify-end w-100">
              <v-btn
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="onClose"
              >
                回選單
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- 修改密碼 -->
    <v-card v-if="currentPage === 'changePwd'" class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__bg--light-green rental__header" @click="backHome">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          修改密碼
        </span>
      </div>
      <v-form ref="cpFormRef" class="h-100" @submit.prevent="onSendChangePwd">
        <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
          <v-row class="flex-0-1" dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="cpForm.orgPassword"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入原密碼"
                required
                :rules="rules.orgPasswordRules"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="cpForm.password"
                :append-inner-icon="isShowPassword ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入新密碼"
                required
                :rules="rules.passwordRules"
                :type="isShowPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isShowPassword = !isShowPassword"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="cpForm.password2"
                :append-inner-icon="isShowPassword2 ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="再次輸入新密碼"
                required
                :rules="rules.passwordRules2"
                :type="isShowPassword2 ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isShowPassword2 = !isShowPassword2"
              />
            </v-col>
            <v-col cols="12">
              <p class="text-subtitle-2 text-red-darken-1">
                僅英文及數字共 8 碼，不可輸入特殊符號。
              </p>
            </v-col>
          </v-row>
          <v-row class="flex-0-1" no-gutters>
            <v-col class="mt-4" cols="12">
              <div class="d-flex ga-2 flex-wrap justify-end w-100">
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="orange-darken-2"
                  height="40"
                  type="submit"
                  variant="flat"
                >
                  設定
                </v-btn>
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="blue-darken-3"
                  height="40"
                  variant="flat"
                  @click="backHome"
                >
                  回選單
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <!-- 子帳號設定 列表-->
    <v-card v-if="currentPage === 'subAccount'" class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__bg--light-orange rental__header" @click="backHome">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          子帳號設定
        </span>
      </div>
      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-card class="bg-white flex-grow-1 overflow-y-auto" variant="flat">
          <v-list>
            <!-- 帳號列表 -->
            <v-list-item
              v-for="(member, index) in memberList"
              :key="index"
              class="pa-0 border"
            >
              <div class="d-flex justify-space-between w-100">
                <v-row class="align-end flex-grow-1" no-gutters>
                  <v-col md="4">
                    <div class="pl-4 pt-2 mt-2 mr-2 rounded-te-xl bg-blue-darken-3 text-subtitle-1" style="height: 40px;">
                      {{ member.account }}
                    </div>
                  </v-col>
                  <v-col class="pl-2 text-subtitle-1 text-grey-darken-2" md="8">
                    <div class="pb-md-2 d-flex flex-column flex-md-row flex-lg-row justify-space-around" style="line-height: 1.4;">
                      <div class="text-nowrap flex-grow-1 w-100 w-md-50 w-lg-50">
                        {{ member.enableTime }}
                      </div>
                      <div class="text-nowrap flex-grow-1 w-100 w-md-50 w-lg-50">
                        {{ member.disableTime }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <div class="px-2 d-flex align-center">
                  <v-btn
                    color="orange-darken-2"
                    density="comfortable"
                    :disabled="member.deleteTime !== '0'"
                    variant="flat"
                    width="110px"
                    @click="edit(member)"
                  >
                    {{ member.deleteTime === '0' ? '修改 / 刪除' : '已停用' }}
                  </v-btn>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
        <v-row class="flex-0-1" no-gutters>
          <v-col class="mt-4" cols="12">
            <div class="d-flex flex-row ga-2 justify-end w-100">
              <v-btn
                class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="backHome"
              >
                回選單
              </v-btn>
              <v-btn
                class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                color="light-green-darken-2"
                height="40"
                type="submit"
                variant="flat"
                @click="add"
              >
                新增
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- 子帳號新增 -->
    <v-card
      v-if="currentPage === 'add'"
      class="rounded-lg bordered border-md bg-white h-100"
      variant="outlined"
    >
      <div
        class="px-4 py-3 d-flex align-center rental__bg--light-orange rental__header rental__bg--light-green"
        @click="backSubAccount"
      >
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          子帳號新增
        </span>
      </div>
      <v-form ref="saFormRef" class="h-100" @submit.prevent="saveSubAccount">
        <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
          <div class="pa-1 flex-grow-1 overflow-y-auto">
            <v-row class="flex-0-1" dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.acc_name"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="請輸入使用者姓名"
                  required
                  :rules="saRules.accNameRules"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row class="flex-0-1" dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.account"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="請輸入帳號名稱(英文及數字)"
                  required
                  :rules="saRules.accountRules"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.password"
                  :append-inner-icon="isShowPassword ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="請輸入新密碼"
                  required
                  :rules="saRules.passwordRules"
                  :type="isShowPassword ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="isShowPassword = !isShowPassword"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.password2"
                  :append-inner-icon="isShowPassword2 ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="再次輸入新密碼"
                  required
                  :rules="saRules.passwordRules2"
                  :type="isShowPassword2 ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="isShowPassword2 = !isShowPassword2"
                />
              </v-col>
              <v-col cols="12">
                <p class="text-subtitle-2 text-red-darken-1">
                  密碼僅英文及數字共 8 碼，不可輸入特殊符號。
                </p>
              </v-col>
              <v-col cols="12">
                <p class="mt-6 mb-2 text-h6 text-blue-darken-3 text-center text-md-left">
                  子帳號使用期限
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <v-date-input
                  v-model="saForm.enableTime"
                  append-inner-icon="fa:far fa-calendar-alt"
                  bg-color="white"
                  color="blue-darken-2"
                  density="compact"
                  :display-format="formatDate"
                  :min="new Date()"
                  placeholder="起：2026-01-01"
                  prepend-icon=""
                  required
                  :rules="saRules.enableTimeRule"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-date-input
                  v-model="saForm.disableTime"
                  append-inner-icon="fa:far fa-calendar-alt"
                  bg-color="white"
                  color="blue-darken-2"
                  density="compact"
                  :display-format="formatDate"
                  :min="new Date()"
                  placeholder="迄：2026-01-01"
                  prepend-icon=""
                  required
                  :rules="saRules.disableTimeRule"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </div>
          <v-row class="flex-0-1" no-gutters>
            <v-col class="mt-4" cols="12">
              <div class="pl-2 d-flex flex-row ga-2 justify-end w-100">
                <v-btn
                  class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                  color="blue-darken-3"
                  height="40"
                  variant="flat"
                  @click="backSubAccount"
                >
                  回選單
                </v-btn>
                <v-btn
                  class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                  color="light-green-darken-2"
                  height="40"
                  type="submit"
                  variant="flat"
                >
                  設定
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <!-- 子帳號修改 / 刪除 -->
    <v-card
      v-if="currentPage === 'edit'"
      class="rounded-lg bordered border-md bg-white h-100"
      variant="outlined"
    >
      <div
        class="px-4 py-3 d-flex align-center rental__bg--light-orange rental__header rental__bg--light-orange"
        @click="backSubAccount"
      >
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          子帳號修改
        </span>
      </div>
      <v-form ref="saFormRef" class="h-100" @submit.prevent="editSubAccount">
        <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
          <div class="pa-1 flex-grow-1 overflow-y-auto">
            <v-row class="flex-0-1" dense>
              <v-col cols="12" md="4">
                <div class="mb-2 text-subtitle-1 text-center bg-grey-lighten-3 py-2 custom-height">
                  {{ saForm.account }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.password"
                  :append-inner-icon="isShowPassword ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="請輸入重置新密碼"
                  :rules="saRules.editPasswordRules"
                  :type="isShowPassword ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="isShowPassword = !isShowPassword"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="saForm.password2"
                  :append-inner-icon="isShowPassword2 ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                  autocomplete="off"
                  color="blue-darken-2"
                  density="compact"
                  placeholder="再次輸入重置新密碼"
                  :rules="saRules.editPasswordRules2"
                  :type="isShowPassword2 ? 'text' : 'password'"
                  variant="outlined"
                  @click:append-inner="isShowPassword2 = !isShowPassword2"
                />
              </v-col>
              <v-col cols="12">
                <p class="text-subtitle-2 text-red-darken-1">
                  密碼僅英文及數字共 8 碼，不可輸入特殊符號。
                </p>
              </v-col>
              <v-col cols="12">
                <p class="mt-6 mb-2 text-h6 text-blue-darken-3 text-center text-md-left">
                  子帳號使用期限
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <v-date-input
                  v-model="saForm.enableTime"
                  append-inner-icon="fa:far fa-calendar-alt"
                  bg-color="white"
                  color="blue-darken-2"
                  density="compact"
                  :display-format="formatDate"
                  placeholder="起：2026-01-01"
                  prepend-icon=""
                  required
                  :rules="saRules.enableTimeRule"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-date-input
                  v-model="saForm.disableTime"
                  append-inner-icon="fa:far fa-calendar-alt"
                  bg-color="white"
                  color="blue-darken-2"
                  density="compact"
                  :display-format="formatDate"
                  placeholder="迄：2026-01-01"
                  prepend-icon=""
                  required
                  :rules="saRules.disableTimeRule"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </div>
          <v-row class="flex-0-1" no-gutters>
            <v-col class="mt-4" cols="12">
              <div class="pl-2 d-flex flex-row ga-2 justify-end w-100">
                <v-btn
                  class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                  color="red-darken-1"
                  height="40"
                  variant="flat"
                  @click="delAccount"
                >
                  刪除
                </v-btn>
                <v-btn
                  class="my-2 px-8 w-50 w-md-auto rounded-lg text-h6 font-weight-regular"
                  color="light-green-darken-2"
                  height="40"
                  type="submit"
                  variant="flat"
                >
                  設定
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
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
  import { VForm } from 'vuetify/components'
  import api from '@/api/index.ts'
  import { formatDate } from '@/utils/date.ts'

  const BaseUrl = import.meta.env.VITE_BASE_URL

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const messageType = ref<string>('')

  // Props
  interface MemberInfo {
    userId: number
    identity: string
    acc_name: string
    account: string
    vendorId: number
    parkId: number
    unitId: number
    forTest: string
    vendor_name: string
    store_type: number
    remainPoints: number
    slipStyle: number
    slipHour: string
    createTime: string
    deleteTime: string
    note: string
    enableTime: string
    disableTime: string
  }
  interface Props {
    activeTab?: TabItem
    userInfo?: MemberInfo
  }
  const props = withDefaults(defineProps<Props>(), {
    activeTab: () => ({} as TabItem),
    userInfo: () => ({} as MemberInfo),
  })
  const emits = defineEmits<{
    'on-close': []
  }>()
  const currentPage = ref<string>('home')
  const loading = ref<boolean>(false)

  function changePwd (): void {
    currentPage.value = 'changePwd'
  }

  // 變更密碼
  const cpFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface CpForm {
    orgPassword: string
    password: string
    password2: string
  }
  const cpForm = ref<CpForm>({
    orgPassword: '',
    password: '',
    password2: '',
  })

  interface Rules {
    orgPasswordRules: Array<(v: string) => boolean | string>
    passwordRules: Array<(v: string) => boolean | string>
    passwordRules2: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    orgPasswordRules: [
      v => !!v || '原密碼為必填',
    ],
    passwordRules: [
      v => !!v || '新密碼為必填',
      v => /^[a-zA-Z0-9]{8}$/.test(v) || '請輸入有效的新密碼',
    ],
    passwordRules2: [
      v => !!v || '再次輸入新密碼為必填',
      v => v === cpForm.value.password || '兩次輸入的新密碼不一致',
    ],
  })

  // 變更密碼
  interface ApiResponse<T = any> {
    returnCode: number
    message: string
    data?: T

  }
  async function onSendChangePwd (): Promise<void> {
    const { valid } = await cpFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return

    const payload = {
      userId: props.userInfo.userId,
      password: cpForm.value.password,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/update_user?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
        backHome()
      } else {
        if (returnCode === -1) {
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

  function backHome (): void {
    currentPage.value = 'home'
  }

  async function setSubAccount (): Promise<void> {
    currentPage.value = 'subAccount'
    await fetchMemberList()
  }

  // 子帳號設定
  interface MemberList {
    account: string
    disableTime: string
    enableTime: string
    userId: number
    deleteTime: string
  }
  const memberList = ref<MemberList[]>([])
  const saFormRef = ref<InstanceType<typeof VForm> | null>(null)
  interface SaForm {
    acc_name: string
    account: string
    password: string
    password2: string
    enableTime: string
    disableTime: string
    userId?: number
  }
  const saForm = ref<SaForm>({
    acc_name: '',
    account: '',
    password: '',
    password2: '',
    enableTime: '',
    disableTime: '',
  })
  const isShowPassword = ref<boolean>(false)
  const isShowPassword2 = ref<boolean>(false)

  interface SaRules {
    accNameRules: Array<(v: string) => boolean | string>
    accountRules: Array<(v: string) => boolean | string>
    passwordRules: Array<(v: string) => boolean | string>
    passwordRules2: Array<(v: string) => boolean | string>
    editPasswordRules: Array<(v: string) => boolean | string>
    editPasswordRules2: Array<(v: string) => boolean | string>
    enableTimeRule: Array<(v: string) => boolean | string>
    disableTimeRule: Array<(v: string) => boolean | string>
  }
  const saRules = ref<SaRules>({
    accNameRules: [
      v => !!v || '使用者姓名為必填',
    ],
    accountRules: [
      v => !!v || '帳號為必填',
    // v => /^[a-zA-Z0-9]{8}$/.test(v) || '請輸入有效的帳號'
    ],
    passwordRules: [
      v => !!v || '密碼為必填',
      v => /^[a-zA-Z0-9]{8}$/.test(v) || '請輸入有效的密碼',
    ],
    passwordRules2: [
      v => !!v || '再次輸入密碼為必填',
      v => v === saForm.value.password || '兩次輸入的密碼不一致',
    ],
    editPasswordRules: [
      v => !v || /^[a-zA-Z0-9]{8}$/.test(v) || '請輸入有效的密碼',
    ],
    editPasswordRules2: [
      v => !v || v === saForm.value.password || '兩次輸入的重置新密碼不一致',
    ],
    enableTimeRule: [
      v => !!v || '請選擇起始日期',
      v => {
        if (!v || !saForm.value.disableTime) return true

        const start = new Date(v)
        const end = new Date(saForm.value.disableTime)
        if (!start || !end) return true
        return !isAfter(start, end) || '起始日期不能晚於結束日期'
      },
    ],
    disableTimeRule: [
      v => !!v || '請選擇結束日期',
      v => {
        if (!v || !saForm.value.enableTime) return true

        const start = new Date(saForm.value.enableTime)
        const end = new Date(v)
        if (!start || !end) return true
        return !isBefore(end, start) || '結束日期不能早於起始日期'
      },
    ],
  })

  // 修改 / 刪除子帳號按鈕
  interface Member {
    account: string
    disableTime: string
    enableTime: string
    userId: number
  }
  function edit (member: Member) {
    currentPage.value = 'edit'
    const { account, disableTime, enableTime, userId } = member
    saForm.value = {
      ...saForm.value,
      account,
      enableTime,
      disableTime,
      userId,
    }
  // console.log('修改 / 刪除子帳號', saForm.value)
  }

  // 新增子帳號按鈕
  function add (): void {
    currentPage.value = 'add'
    saForm.value = {
      acc_name: '',
      account: '',
      password: '',
      password2: '',
      enableTime: '',
      disableTime: '',
    }
  }

  // 刪除子帳號
  function delAccount (): void {
    const { account } = saForm.value
    messageTitle.value = '訊息通知'
    message.value = `子帳號 [ ${account} ] 刪除後將無法復原，確定要刪除嗎？`
    isConfirmBtn.value = true
    messageDialog.value = true
    messageType.value = 'deleteSubAccount'
  }
  async function deleteSubAccount (): Promise<void> {
    const { valid } = await saFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return

    const { userId } = saForm.value
    const payload = {
      userId: userId,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/delete_Ch_user?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        messageTitle.value = '訊息通知'
        message.value = `${returnMsg}`
        isConfirmBtn.value = false
        messageDialog.value = true
        await fetchMemberList()
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

  // 取得子帳號列表
  async function fetchMemberList (): Promise<void> {
    backSubAccount()
    const payload = {
      vendorId: props.userInfo.vendorId,
    }
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/select_user?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      if (returnCode === 0) {
        memberList.value = data
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

  // 編輯 儲存子帳號
  async function editSubAccount (): Promise<void> {
    const { valid } = await saFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return

    const { userId, password, enableTime, disableTime } = saForm.value
    const payload = {
      userId: userId,
      password,
      enableTime: formatDate(enableTime),
      disableTime: formatDate(disableTime),
    }
    console.log('儲存子帳號', payload)
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/update_Ch_user?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        await fetchMemberList()
        saFormRef.value?.reset()
        backSubAccount()
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

  // 新增 儲存子帳號
  async function saveSubAccount (): Promise<void> {
    const { valid } = await saFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return

    const { acc_name, account, password, enableTime, disableTime } = saForm.value
    const payload = {
      vendorId: props.userInfo.vendorId,
      identity: '0',
      acc_name,
      account,
      password,
      enableTime: formatDate(enableTime),
      disableTime: formatDate(disableTime),
    }
    // console.log('儲存子帳號', payload)
    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/create_user?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { returnCode, message: returnMsg } = res
      if (returnCode === 0) {
        await fetchMemberList()
        saFormRef.value?.reset()
        backSubAccount()
      } else if (returnCode === 999) {
        messageTitle.value = '訊息通知'
        message.value = `帳號已註冊，請重新設定。`
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

  // 確認 message
  function messageConfirm (): void {
    if (messageType.value === 'deleteSubAccount') {
      deleteSubAccount()
      messageType.value = ''
      return
    }
    messageDialog.value = false
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 回到子帳號列表
  function backSubAccount (): void {
    currentPage.value = 'subAccount'
  }

  // 離開此頁面
  function onClose (): void {
    emits('on-close')
  }
</script>
<style lang="scss" scoped>
.custom-height {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 960px) {
  .custom-height {
    height: 40px;
  }
}
</style>
