<template>
  <div class="movie-slider">
    <h2 class="movie-slider__title" v-if="title">{{ title }}</h2>
    <div class="movie-slider__swiper" v-if="movieList?.results.length > 0">
      <swiper :slides-per-view="'auto'" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide v-for="movie of movieList.results">
          <RouterLink @click.prevent="onClick(movie)" to="/" target="_blank" rel="noopener noreferrer" class="movie-slider__slide-link">
            <img :src="getMoviePoster(movie.poster_path)" alt="" class="movie-slider__slide-img">
          </RouterLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted, toRefs } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
// import { useFetch } from '@/service/fetch'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'

export default defineComponent({
  name: 'MovieSlider',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    // genre: { type: Object, required: true },
    movieList: { type: Object, required: true },
    title: { type: String, required: true },
  },
  setup(props, context) {
    const onSwiper = (swiper) => {
      // console.log(swiper);
    };
    const onSlideChange = () => {
      // console.log('slide change');
    };

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

    // onMounted(async () => {
    //   const genreId = genre.value.id;
    //   ({ data: movieList.value, error: movieListError.value } = await useFetch(`/discover/movie?with_genres=${genreId}`));
    // })

    return {
      onSwiper,
      onSlideChange,
      onClick,
    }
  },
  // TODO: delete option API methods
  methods: {
    // getMoviePoster(posterPath: string) {
    //   const BASE_URL = 'https://image.tmdb.org/t/p/original'
    //   return BASE_URL + posterPath
    // }
    getMoviePoster(posterPath) {
      return getMoviePosterUrl(posterPath, 'w780')
    }
  }
})
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