<template>
  <v-row class="mt-3" dense>
    <v-col
      v-for="tab in props.tabList"
      :key="tab.value"
      class="mt-2"
      cols="12"
      md="4"
    >
      <v-card
        bg-color="white"
        class="pa-4 d-flex align-center justify-space-between rounded-lg"
        elevation="4"
        link
        max-width="100%"
        variant="elevated"
        @click="setActiveTab(tab)"
      >
        <div class="mx-2 d-flex align-center">
          <v-avatar :image="`${BaseUrl}${tab.icon}`" size="50" />
          <div class="ml-3 d-block">
            <div class="pt-1 text-h6 text-blue-grey-darken-4">
              {{ tab.title }}
            </div>
            <span class="text-subtitle-1 text-blue-grey-darken-1">
              {{ tab.subTitle }}
            </span>
          </div>
        </div>
        <template v-if="tab.value !== 'logout'">
          <v-icon class="mr-2" color="indigo-darken-1" icon="fa:fas fa-chevron-right" size="24" />
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { TabItem } from '@/utils/site.ts'

  interface Props {
    tabList?: TabItem[]
  }
  const props = withDefaults(defineProps<Props>(), {
    tabList: () => [],
  })

  const emits = defineEmits<{ 'set-active-tab': [tab: TabItem] }>()

  const BaseUrl = import.meta.env.VITE_BASE_URL

  // 臨櫃登記選單切換
  function setActiveTab (tab: TabItem): void {
    emits('set-active-tab', tab)
  }
</script>
