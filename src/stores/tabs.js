import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref([
    'all', 'tv show', 'movie'
  ])
  const currentTab = ref(2)
  // const doubleCount = computed(() => count.value * 2)
  function setTab(id) {
    currentTab.value = id
  }

  return {
    tabs,
    currentTab,
    setTab,
  }
})
