<template>
  <div id="search" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center bg-orange-lighten-5 rental__header" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>
      <v-form ref="parkingFormRef" class="h-100" @submit.prevent="onSendForm">
        <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
          <v-row class="flex-0-1" dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="parkingForm.phone"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                :placeholder="props.activeTab.value === 'parking' ? '請輸入手機號碼' : '請輸入登記手機號碼'"
                required
                :rules="rules.phoneRules"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="parkingForm.license_plate"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                :placeholder="props.activeTab.value === 'parking' ? '請輸入車號' : '請輸入已登記車號'"
                required
                :rules="rules.carRules"
                variant="outlined"
                @input="parkingForm.license_plate = parkingForm.license_plate.toUpperCase()"
              />
            </v-col>
            <v-col class="py-0" cols="12">
              <p class="text-subtitle-1 font-weight-bold">驗證碼</p>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="parkingForm.captcha"
                autocomplete="off"
                color="blue-darken-2"
                density="compact"
                placeholder="請輸入驗證碼"
                required
                :rules="rules.captchaRules"
                variant="outlined"
                @input="parkingForm.captcha = parkingForm.captcha.toUpperCase()"
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
                  {{ props.activeTab.value === 'parking' ? '登記' : '查詢' }}
                </v-btn>
                <v-btn
                  class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                  color="blue-darken-3"
                  height="40"
                  variant="flat"
                  @click="onCloseForm"
                >
                  離開
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
  import type { TabItem } from '@/utils/site.ts'
  import { reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  // Props
  interface Props {
    activeTab?: TabItem
    formData?: {
      ischeck: number
      phone: string
      license_plate: string
      captcha: string
    }
  }
  const props = withDefaults(defineProps<Props>(), {
    activeTab: () => ({} as TabItem),
    formData: () => ({
      ischeck: 0,
      phone: '',
      license_plate: '',
      captcha: '',
    }),
  })
  // Emits
  const emits = defineEmits<{
    'update:formData': [typeof props.formData]
    'close-form': []
    'send-form': []
  }>()
  const BaseUrl = import.meta.env.VITE_BASE_URL

  const parkingFormRef = ref<InstanceType<typeof VForm> | null>(null)
  const parkingForm = reactive(props.formData)
  type Rules = {
    phoneRules: Array<(v: string) => boolean | string>
    carRules: Array<(v: string) => boolean | string>
    captchaRules: Array<(v: string) => boolean | string>
  }
  const rules = ref<Rules>({
    phoneRules: [
      v => !!v || '手機號碼為必填',
      v => /^\d{10}$/.test(v) || '請輸入有效的手機號碼',
    ],
    carRules: [
      v => !!v || '車號為必填',
      v => /^[A-Z0-9]+-[A-Z0-9]+$/.test(v) || '請輸入有效的車號 ( 需包含 - 符號 )',
    ],
    captchaRules: [
      v => !!v || '驗證碼為必填',
      v => v === captchaCode.value || '請輸入有效的驗證碼',
    ],
  })

  watch(
    () => props.formData,
    newVal => {
      Object.assign(parkingForm, newVal)
    },
    { deep: true },
  )

  watch(
    () => parkingForm,
    newVal => {
      emits('update:formData', newVal)
    },
    { deep: true },
  )

  // 接收 Captcha 組件傳來的驗證碼
  const captchaCode = ref('')
  function setCaptchaCode (code: string): void {
    captchaCode.value = code
  }

  // 送出表單
  async function onSendForm () {
    const { valid } = await parkingFormRef.value?.validate() ?? { valid: false }
    // 檢核欄位
    if (!valid) return
    emits('send-form')
  }

  // 關閉表單
  function onCloseForm () {
    emits('close-form')
  }

  // 重置表單
  function initForm () {
    parkingFormRef.value?.reset()
  }

  defineExpose({
    initForm,
  })
</script>
