<template>
  <div id="parkingInfo" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center rental__bg--light-blue">
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>

      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-row class="flex-grow-1" dense>
          <v-col cols="12">
            <div class="d-flex flex-column align-center justify-center">
              <span class="my-10 pt-5">
                <v-img
                  alt="icon image"
                  cover
                  height="100%"
                  :src="`${BaseUrl}/images/check.svg`"
                  width="120px"
                />
              </span>
              <div class="text-center text-h4 text-grey-darken-1 font-weight-bold my-2">
                已成功登出
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="flex-0-1" no-gutters>
          <v-col cols="12">
            <div class="mt-3 d-flex flex-wrap justify-end w-100">
              <v-btn
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="light-green-darken-2"
                height="40"
                variant="flat"
                @click="emits('on-login')"
              >
                登入
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { TabItem } from '@/utils/site.ts'
  const BaseUrl = import.meta.env.VITE_BASE_URL

  // Props
  const props = defineProps({
    activeTab: {
      type: Object as () => TabItem,
      default: () => ({}),
    },
  })

  const emits = defineEmits(['on-login'])
</script>
