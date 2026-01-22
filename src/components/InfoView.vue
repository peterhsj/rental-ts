<script lang="ts" setup>
  const BaseUrl = import.meta.env.VITE_BASE_URL
  const props = defineProps({
    info: {
      type: String,
      default: '',
    },
    infoStatus: {
      type: String,
      default: 'success', // 'success' or 'error'
    },
  })

  const emits = defineEmits(['info-close', 're-write'])

  function onInfoClose (): void {
    emits('info-close')
  }
  function onReWrite (): void {
    emits('re-write')
  }
</script>

<template>
  <v-container class="rental rental__wrapper flex-grow-1">
    <v-card class="mb-5 pt-5 d-flex flex-column justify-space-between rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="d-flex flex-column align-center justify-center">
        <span class="my-4">
          <v-img
            alt="icon image"
            cover
            height="100%"
            :src="props.infoStatus === 'success' ? `${BaseUrl}/images/check.svg` : `${BaseUrl}/images/warning.svg`"
            width="120px"
          />
        </span>
        <div class="d-flex flex-column align-center justify-center pa-6" v-html="props.info" />
      </div>
      <v-container class="py-2">
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex ga-2 flex-wrap justify-center w-100">
              <v-btn
                v-if="props.infoStatus !== 'error'"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="blue-darken-3"
                height="40"
                variant="flat"
                @click="onInfoClose"
              >
                離開
              </v-btn>
              <v-btn
                v-if="props.infoStatus === 'error'"
                class="my-2 px-8 w-100 w-sm-auto rounded-lg text-h6 font-weight-regular"
                color="orange-darken-3"
                height="40"
                variant="flat"
                @click="onReWrite"
              >
                重新輸入
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
