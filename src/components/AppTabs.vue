<template>
  <div class="tabs">
    <button 
      v-for="(tab, index) of tabs" class="tab"
      @click="setTab(index)"
      :class="{ 'current': index === currentTab }"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { useTabsStore } from '@/stores/tabs'

const { tabs, currentTab, setTab } = toRefs(useTabsStore())
</script>

<style lang='scss' scoped>
.tabs {}

.tab {
  font-family: 'Staatliches';
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 50px;
  letter-spacing: -0.035em;
  color: #FFFFFF;
  mix-blend-mode: normal;
  opacity: 0.19;

  &:not(:last-child) {
    margin-right: 23px;
  }

  &.current {
    opacity: 1;
  }
}
</style>