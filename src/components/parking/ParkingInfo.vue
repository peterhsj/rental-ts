<template>
  <div id="parkingInfo" class="h-100">
    <v-card class="rounded-lg bordered border-md bg-white h-100" variant="outlined">
      <div class="px-4 py-3 d-flex align-center bg-orange-lighten-5 rental__header" @click="onCloseForm">
        <v-icon class="mr-2" color="grey-darken-1" icon="fa:fas fa-chevron-left" size="20" />
        <v-avatar :image="`${BaseUrl}${props.activeTab.icon}`" size="40" />
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-2">
          {{ props.activeTab.title }}
        </span>
      </div>

      <v-container class="pb-2 d-flex flex-column justify-space-between" style="height: calc(100% - 64px);">
        <v-row class="flex-0-1" dense>
          <v-col cols="12" md="6">
            ParkingInfo
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script setup>
  const BaseUrl = import.meta.env.VITE_BASE_URL

  // Props
  const props = defineProps({
    activeTab: {
      type: Object,
      default: () => ({}),
    },
  })
  const emits = defineEmits(['close-form'])

  // 關閉表單
  function onCloseForm () {
    emits('close-form')
  }
</script>
