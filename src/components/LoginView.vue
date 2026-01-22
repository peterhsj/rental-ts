<script setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '@/api'
  import Captcha from '@/components/Captcha.vue'
  import CommonOverlay from '@/components/CommonOverlay.vue'
  import PromptDialog from '@/components/PromptDialog.vue'

  const BaseUrl = import.meta.env.VITE_API_DOMAIN

  const route = useRoute()
  const router = useRouter()

  // Prompt Message Dialog
  const messageDialog = ref(false)
  const messageTitle = ref('')
  const message = ref('')
  const isConfirmBtn = ref(false)

  const headers = ref({
    CounterLogin: {
      title: '住宿車輛登記 - 登入',
      bgColor: 'bg-grey-lighten-2',
      icon: '/images/bed.svg',
    },
    ShopLogin: {
      title: '商店消費折抵 - 登入',
      bgColor: 'bg-orange-lighten-5',
      icon: '/images/shoppingCart.svg',
    },
    BanquetLogin: {
      title: '宴會廳消費折抵 - 登入',
      bgColor: 'rental__bg--light-orange',
      icon: '/images/scanner.svg',
    },
  })
  const loading = ref(false)
  const currentPath = ref('')
  const loginFormRef = ref()
  const loginForm = ref({
    account: '',
    password: '',
    captcha: '',
  })
  const rules = ref({
    accountRules: [
      v => !!v || '帳號為必填',
    // v => /^[a-zA-Z0-9_]{4,20}$/.test(v) || '請輸入有效的帳號'
    ],
    passwordRules: [
      v => !!v || '密碼為必填',
    // v => /^[a-zA-Z0-9_]{6,20}$/.test(v) || '請輸入有效的密碼'
    ],
    captchaRules: [
      v => !!v || '驗證碼為必填',
      v => v === captchaCode.value || '請輸入有效的驗證碼',
    ],
  })
  const isShowPassword = ref(false)

  watch(
    () => route.path,
    newPath => {
      currentPath.value = newPath.slice(1)
    },
    { immediate: true },
  )

  // 接收 Captcha 組件傳來的驗證碼
  const captchaCode = ref('')
  function setCaptchaCode (code) {
    captchaCode.value = code
  }

  // 送出表單
  async function onSendForm () {
    const { valid } = await loginFormRef.value.validate()
    // 檢核欄位
    if (!valid) return
    const { account, password } = loginForm.value
    const payload = {
      account,
      password,
    }

    // 送出表單
    loading.value = true
    const apiUrl = '/member/grand_hotel/login?bQz0fX8f=4ApR34x2wb2CVTNUfsq3'
    try {
      const res = await api.post(apiUrl, payload)
      const { returnCode, message: returnMsg, data } = res
      // console.log('data', returnCode, returnMsg, data)

      if (returnCode === 0) {
        // 登入成功
        // 儲存 data 到 cookie
        // document.cookie = `memberInfo=${JSON.stringify(data)}; path=/; max-age=${60 * 60 * 24}`
        // 儲存 data 到 sessionStorage
        localStorage.setItem('memberInfo', JSON.stringify(data))

        // 跳轉頁面
        if (currentPath.value === 'CounterLogin') {
          router.push('/Counter')
          return
        }
        if (currentPath.value === 'ShopLogin') {
          router.push('/Shop')
          return
        }
        if (currentPath.value === 'BanquetLogin') {
          router.push('/Banquet')
          return
        }
      } else {
        messageTitle.value = '登入失敗'
        message.value = `<span class="text-body-2">${returnMsg}</span>`
        isConfirmBtn.value = false
        messageDialog.value = true
        return
      }
    } catch (error) {
      console.log({ err: error })
    } finally {
      loading.value = false
    }
  }

  // 離開 message
  function messageClose () {
    messageDialog.value = false
  }
</script>

<template>
  <div id="login" class="pa-5 mx-auto h-100 rental rental__wrapper">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center" :class="headers[currentPath].bgColor">
        <span>
          <v-img
            alt="icon"
            cover
            height="40"
            :src="`${BaseUrl}${headers[currentPath].icon}`"
            width="45"
          />
        </span>
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ headers[currentPath].title }}
        </span>
      </div>
      <v-form ref="loginFormRef" class="h-100" @submit.prevent="onSendForm">
        <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
          <v-row class="flex-0-1" dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="loginForm.account"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入帳號"
                required
                :rules="rules.accountRules"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="loginForm.password"
                :append-inner-icon="isShowPassword ? 'fa:far fa-eye-slash' : 'fa:far fa-eye'"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入密碼"
                required
                :rules="rules.passwordRules"
                :type="isShowPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isShowPassword = !isShowPassword"
              />
            </v-col>
            <v-col class="py-0" cols="12">
              <p class="text-subtitle-1 font-weight-bold">驗證碼</p>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="loginForm.captcha"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入驗證碼"
                required
                :rules="rules.captchaRules"
                variant="outlined"
                @input="loginForm.captcha = loginForm.captcha.toUpperCase()"
              >
                <template #append>
                  <div style="width:120px;height:40px;">
                    <Captcha @set-captcha-code="setCaptchaCode" />
                  </div>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <p class="text-subtitle-2 text-red-darken-1">
                注意：<br>
                更換車號請重新操作，入場當日無法更換登記車號。
              </p>
            </v-col>
          </v-row>
          <v-row class="flex-0-1" no-gutters>
            <v-col class="mt-4" cols="12">
              <div class="d-flex ga-2 flex-wrap justify-end w-100">
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="light-green-darken-2"
                  height="40"
                  type="submit"
                  variant="flat"
                >
                  登入
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <!-- 共用元件 -->
    <CommonOverlay :overlay="loading" />
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-title="messageTitle"
      @on-close="messageClose"
    />
  </div>
</template>
