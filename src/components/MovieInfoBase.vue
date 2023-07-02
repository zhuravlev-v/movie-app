<template>
  <div class="info">
    <h1 class="info__title">{{ movieNormalized.title }}</h1>
    <div class="info__row">
      <span class="info__year">{{ movieNormalized.release_date_parsed }}</span>
      <div class="info__rating">
        <span class="info__rating-vote">{{ movieNormalized.vote_average.toFixed(1) }}</span>
        <img class="info__star" src="@/assets/images/icon-star.svg" alt="" data-convertable>
      </div>
      <span v-if="movie.seasons" class="info__total-seasons">Season {{ movie.seasons.length }}</span>
    </div>
    <p class="info__description">{{ movieNormalized.overview }}</p>
    <div class="info__actors" v-if="actors.length > 0">
      <span class="actor" v-for="actor of actors">{{ actor }}</span>
      <i class="actor">…</i>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRefs } from 'vue'

const props = defineProps({
  movie: { type: Object, required: true },
  actors: { type: Array, required: true },
  seasonIndex: { type: [Number, undefined], required: false }
})

const { movie, actors, seasonIndex } = toRefs(props)

const movieNormalized = computed(() => {
  return {
    title: movie.value.title ?? movie.value.name,
    release_date_parsed: movie.value.release_date_parsed,
    vote_average: movie.value.vote_average,
    release_date_parsed: movie.value.release_date_parsed ?? null,
    seasons: movie.value.seasons ?? null,
    overview: getOverview(),
  }
})

const getOverview = () => {
  if (seasonIndex.value) {
    return movie.value.seasons[seasonIndex.value].overview === ''
      ? movie.value.overview
      : movie.value.seasons[seasonIndex.value].overview
  }
  else {
    return movie.value.overview
  }
}

</script>

<style lang='scss' scoped>
.info {
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
    margin: 0px 0px 20px;
  }

  &__rating {
    display: flex;
    align-items: center;

    &:deep {

      & svg,
      img {
        vertical-align: top;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        vertical-align: super;
        margin-left: 7px;

        & path {
          fill: gold;
        }
      }
    }
  }

  &__rating-vote {
    font-weight: 400;
    font-size: 16px;
    // line-height: 61px;
    letter-spacing: 0.02em;
  }

  &__star {}

  &__year {
    display: inline-block;
    padding: 3px 7px;
    background: rgba(255, 255, 255, 0.31);
    border-radius: 4px;
  }

  &__total-seasons {
    // font-family: 'Public Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    letter-spacing: -0.01em;
    color: rgba($color: #FFFFFF, $alpha: 0.51);
  }

  &__description {
    font-family: 'Public Sans';
    font-weight: 400;
    font-size: 20px;
    line-height: 132%;
    letter-spacing: -0.01em;
    opacity: 0.69;
  }

  &__actors {
    margin: 75px 0 30px;
  }
}
.actor {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.01em;

  &:not(:last-of-type) {
    &::after {
      content: ', ';
    }
  }
}
</style>