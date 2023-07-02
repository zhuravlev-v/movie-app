<template>
  <div class="navbar-item">
    <RouterLink :to="link" class="navbar-item__link">
      <img :src="getIconUrl(icon)" ref="image" class="navbar-item__image" :alt="link">
    </RouterLink>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import convertImages from '../utils/convertImages';

const props = defineProps({
  link: { type: String, required: true },
  icon: { type: String, required: true }
})

const image = ref(null)

const getIconUrl = (name) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href
}

onMounted(() => {
  convertImages(image.value)
})
</script>

<style lang='scss' scoped>
.navbar-item {
  width: 100%;
  height: 18.5%;

  @media (max-width: 1024px) {
    height: 100%;
  }

  &__link {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

:deep() {
  .navbar-item {

    &__image {
      opacity: 0.14;

      & path {
        stroke: #FFFFFF;
        fill: #FFFFFF;
      }
    }

    &__link {}

    &__link.router-link-active {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.0748) 50.85%, rgba(255, 255, 255, 0) 100%);

      & .navbar-item__image {
        opacity: 1;

        & path {
          stroke: #FFE24B;
          fill: #FFE24B;
        }
      }
    }
  }
}
</style>