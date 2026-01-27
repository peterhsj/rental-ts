<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12" md="6" sm="8">
        <v-icon color="grey-lighten-1" size="120">
          mdi-alert-circle-outline
        </v-icon>

        <h1 class="text-h2 font-weight-bold mt-4 mb-2">
          404
        </h1>

        <p class="text-h5 mb-4">
          找不到頁面
        </p>

        <p class="text-body-1 text-grey mb-6">
          抱歉，您訪問的頁面不存在或已被移除。
        </p>

        <v-btn
          color="primary"
          prepend-icon="mdi-home"
          size="large"
          to="/"
        >
          返回首頁
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// 404 Not Found Page
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style>
