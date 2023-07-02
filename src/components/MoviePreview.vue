<template>
  <div class="preview" ref="preview">
    <AppTabs />
    <div class="preview__inner">
      <h1 class="preview__title">{{ title }}</h1>
      <div class="preview__row">
        <p class="preview__rating">
          <img class="preview__star" src="@/assets/images/icon-star.svg" alt="" data-convertable>
          <span>{{ movie.vote_average }}/10</span>
        </p>
        <span class="preview__year">{{ releaseDate }}</span>
      </div>
      <p class="preview__description">{{ movie.overview }}</p>
      <div class="preview__row preview__btns">
        <button class="btn-watch">
          <img src="@/assets/images/icon-play.svg" alt="" data-convertable>
          <span>Watch</span>
        </button>
        <button class="btn-base">
          <img src="@/assets/images/icon-play.svg" alt="" data-convertable>
          <span>Trailer</span>
        </button>
        <button class="btn-base">
          <img src="@/assets/images/icon-play.svg" alt="" data-convertable>
          <span>Add List</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import AppTabs from '@/components/AppTabs.vue'
import { convertImages } from '@/service/convertImages'
import { parseDate } from '@/utils/parseDate'

const props = defineProps({
  movie: { type: Object, required: true }
})

const preview = ref(null)
const isMovie = computed(() => !!props.movie.release_date)
const title = computed(() => {
  if (isMovie.value) {
    return props.movie.title
  }
  else {
    return props.movie.name
  }
})
const releaseDate = computed(() => {
  if (isMovie.value) {
    return parseDate(props.movie.release_date, 'year')
  }
  else {
    return parseDate(props.movie.first_air_date, 'year')
  }
})

onMounted(() => {
  convertImages(preview.value, '[data-convertable]')
})
</script>

<style lang='scss' scoped>
.preview {
  text-align: start;
  color: #FFFFFF;
  max-width: 635px;

  @media (max-width: 1024px) {
    padding-right: 32px;
  }

  @media (max-width: 768px) {
    padding-right: 16px;
  }

  & .tabs {
    margin-bottom: 55px;
  }

  &__inner {}

  &__title {
    font-family: 'Staatliches';
    font-style: normal;
    font-weight: 400;
    font-size: 112px;
    line-height: 90%;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    text-transform: uppercase;
    margin-bottom: 35px;

    @media (max-width: 1024px) {
      font-size: 80px;
    }

    @media (max-width: 768px) {
      font-size: 65px;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 35px 0px 20px;
  }

  &__rating {

    &:deep {

      & svg,
      img {
        vertical-align: top;
        margin-right: 5px;

        & path {
          fill: gold;
        }
      }
    }
  }

  &__star {}

  &__year {
    display: inline-block;
    padding: 3px 7px;
    background: rgba(255, 255, 255, 0.31);
    border-radius: 4px;
  }

  &__description {
    font-family: 'Public Sans';
    font-weight: 400;
    font-size: 20px;
    line-height: 132%;
    letter-spacing: -0.01em;
    opacity: 0.82;
  }

  &__btns {
    @media (max-width: 400px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.btn-watch {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  gap: 4px;
  background: linear-gradient(0deg, #FFE24B, #FFE24B), linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.0128) 100%);
  border-radius: 4px;
  margin-right: auto;
}

.btn-base {}
</style>