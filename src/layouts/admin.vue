<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon />
    <v-toolbar-title>管理後台</v-toolbar-title>
    <v-spacer />
    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item link prepend-icon="mdi-view-dashboard" title="儀表板" />
      <v-list-item prepend-icon="mdi-account-group" title="用戶管理" />
      <v-list-item prepend-icon="mdi-cog" title="系統設定" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
  //
</script>
