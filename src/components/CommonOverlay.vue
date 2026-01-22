<script lang="ts" setup>
  const props = defineProps({
    overlay: {
      type: Boolean,
      default: false,
    },
  })
</script>

<template>
  <v-overlay class="align-center justify-center" :model-value="props.overlay" transition="fade-transition">
    <v-progress-circular
      v-if="props.overlay"
      color="teal-darken-2"
      indeterminate
      size="60"
      width="8"
    />
  </v-overlay>
</template>
