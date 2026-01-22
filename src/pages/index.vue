<template>
  <v-container class="home__container">
    <div class="home__content">
      <h1 class="home__title">停車管理折抵服務平台</h1>

      <div class="home__menu--grid">
        <v-card
          v-for="item in menuItems"
          :key="item.value"
          class="home__menu--card"
          color="amber-lighten-4"
          elevation="2"
          hover
          :to="item.path"
        >
          <v-card-text class="text-center pa-6">
            <v-img
              :alt="item.text"
              class="mx-auto mb-4"
              max-width="40"
              :src="`${BaseUrl}${item.icon}`"
            />
            <div class="home__menu--text">{{ item.text }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  const BaseUrl = import.meta.env.VITE_BASE_URL
  const menuItems = [
    {
      value: 'parking',
      text: '住宿車輛自助登記',
      path: '/Parking',
      icon: '/images/car.svg',
    },
    {
      value: 'counter',
      text: '住宿車輛臨櫃登記',
      path: '/CounterLogin',
      icon: '/images/bed.svg',
    },
    {
      value: 'shop',
      text: '商店折抵',
      path: '/ShopLogin',
      icon: '/images/shoppingCart.svg',
    },
    {
      value: 'banquet',
      text: '宴會廳自助折抵',
      path: '/BanquetLogin',
      icon: '/images/scanner.svg',
    },
    {
      value: 'customer',
      text: '客戶手機操作',
      path: '/Customer',
      icon: '/images/scanner.svg',
    },
  ]
</script>

<style lang="scss" scoped>
.home {
  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  &__content {
    width: 100%;
    max-width: 920px;
  }
  &__title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #333;
  }
  &__menu {
    &--grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    &--card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
      }
    }
    &--text {
      font-size: 1.1rem;
      font-weight: 500;
      color: #555;
    }
  }
}
</style>
