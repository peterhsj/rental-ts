<script lang="ts" setup>
  import { ref, watch } from 'vue'
  // Props
  const props = defineProps({
    messageDialog: {
      type: Boolean,
      default: false,
    },
    messageTitle: {
      type: String,
      default: '提示',
    },
    message: {
      type: String,
      default: '',
    },
    isConfirmBtn: {
      type: Boolean,
      default: false,
    },
  })

  const show = ref<boolean>(props.messageDialog)
  watch(
    (): boolean => props.messageDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    (): boolean => show.value,
    newVal => {
      emit('update:messageDialog', newVal)
    },
  )

  const emit = defineEmits(['update:messageDialog', 'prompt-confirm', 'on-close'])

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  function promptConfirm (): void {
    emit('prompt-confirm')
    show.value = false
  }
</script>
<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      max-width="400"
      min-width="300"
    >
      <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
        {{ props.messageTitle }}
      </v-card-title>
      <v-card-text class="d-flex align-center">
        <span class="mr-4">
          <v-icon class="my-4" color="amber-lighten-1" icon="fa:fas fa-exclamation-triangle" size="60" />
        </span>
        <div v-html="message" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="blue-darken-3"
          variant="outlined"
          @click="onClose"
        >
          離開
        </v-btn>

        <v-btn
          v-if="isConfirmBtn"
          color="light-green-darken-2"
          variant="flat"
          @click="promptConfirm"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
