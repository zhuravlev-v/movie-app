<template>
  <div class="results">
    <div class="result-wrapper" v-for="result of results">
      <SearchResultItem :item="result" />
    </div>
  </div>
</template>

<script setup>
import SearchResultItem from '@/components/SearchResultItem.vue'

const props = defineProps({
  results: { type: Array, required: true }
})
</script>

<style lang='scss' scoped>
.results {
  overflow: auto;

  max-height: 100%;

  @media (max-width: 1350px) {
    height: 500px;
  }
}
</style>