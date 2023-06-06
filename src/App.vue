<template>
  <div class="app-inner">
    <TheNavbar />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <keep-alive :include="['HomeView', 'SearchView']">
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </main>
    <ModalsContainer />
  </div>
</template>

<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { ModalsContainer } from 'vue-final-modal'
</script>

<style lang='scss' scoped>
.app-inner {
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    padding-bottom: 68px;
  }
}

.main {
  flex-grow: 1;
  width: calc(100% - 68px);
  
  @media (max-width: 1024px) {
    width: 100%;
  }

  &>* {
    // min-height: 100%;
    min-height: 100vh;
  }
}
</style>
