<template>
  <div class="movie-slider">
    <h2 class="movie-slider__title" v-if="title">{{ title }}</h2>
    <div class="movie-slider__swiper" v-if="movieList?.results.length > 0">
      <swiper :slides-per-view="'auto'" :space-between="50">
        <swiper-slide v-for="movie of movieList.results">
          <RouterLink 
            @click.prevent="onClick(movie)"
            to="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="movie-slider__slide-link">
            <img 
              class="movie-slider__slide-img" 
              :src="getMoviePosterUrl(movie.poster_path, 'w780')" 
              :alt="movie.title ?? movie.name">
          </RouterLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'

const props = defineProps({
  movieList: { type: Object, required: true },
  title: { type: String, required: true },
})

const router = useRouter()

const onClick = (movie) => {
  const isMovie = !!movie.release_date
  if (isMovie) {
    router.push(`movie/${movie.id}`)
  }
  else {
    router.push(`series/${movie.id}`)
  }
}

</script>

<style lang='scss' scoped>
.movie-slider {
  &__title {
    color: #FFFFFF;
    // font-family: 'Public Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.18em;
    letter-spacing: 0.015em;
    text-align: start;
    margin-bottom: 15px;
    position: relative;
  }

  &__swiper {
    max-width: 100%;
  }

  & .swiper-slide {
    width: 278px;
    aspect-ratio: 2/3;
    color: black;
    border-radius: 10px;
    user-select: none;

    @media (max-width: 768px) {
      width: 250px;
    }

    &:last-child {
      margin-right: 50px;
    }
  }

  &__slide-link {
    border-radius: inherit;
  }

  &__slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    border-radius: inherit;
  }

}
</style>