<template>
  <div class="home" ref="home">
    <MoviePreview v-if="nowPlaying?.results[movieId]" :movie="nowPlaying?.results[movieId]" />
    <div class="home__sliders" v-if="popularMovies && topRated">
      <MovieSlider v-if="topRated" :title="'Top rated'" :movieList="topRated" />
      <MovieSlider v-if="popularMovies" :title="popularMoviesTitle" :movieList="popularMovies" />
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch } from 'vue'
import { useFetch } from '@/service/fetch'
import { useTabsStore } from '@/stores/tabs'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'
import { generateRandomNumber } from '@/service/generateRandomNumber'
import { shuffleArray } from '@/utils/shuffleArray'
import { setBackground } from '@/utils/setBackground'
import MovieSlider from '@/components/MovieSlider.vue'
import MoviePreview from '@/components/MoviePreview.vue'

let home = ref(null)
let nowPlaying = ref(null)
let nowPlayingError = ref(null)
let popularMovies = ref(null)
let popularMoviesError = ref(null)
let topRated = ref(null)
let topRatedError = ref(null)
const movieId = ref(generateRandomNumber(0, 19))
const { currentTab } = toRefs(useTabsStore())

const popularMoviesTitle = computed(() => {
  switch (currentTab.value) {
    case 0:
      return 'Popular';
    case 1:
      return 'Popular TV show';
    case 2:
      return 'Popular Movie';
    default:
      return '';
      break;
  }
})

// TODO: every time when switch tabs initData fetches data again. Need to be cached
const initData = async () => {
  if (currentTab.value === 0) {
    const { data: popularTVseries, error: popularTVseriesError } = await useFetch('/tv/popular');
    const { data: topRatedTVseries, error: topRatedTVseriesError } = await useFetch('/tv/top_rated');
    const { data: nowPlayingTVseries, error: nowPlayingTVseriesError } = await useFetch('/tv/on_the_air');

    const { data: popularFilms, error: popularFilmsError } = await useFetch('/movie/popular');
    const { data: topRatedFilms, error: topRatedFilmsError } = await useFetch('/movie/top_rated');
    const { data: nowPlayingFilms, error: nowPlayingFilmsError } = await useFetch('/movie/now_playing');

    // COMMENT: shuffleArray mutates original arrays?
    const allPopular = shuffleArray([...popularTVseries.results, ...popularFilms.results])
    const allTopRated = shuffleArray([...topRatedTVseries.results, ...topRatedFilms.results])
    const allNowPlaying = shuffleArray([...nowPlayingTVseries.results, ...nowPlayingFilms.results])

    popularMovies.value = {}
    popularMovies.value.results = new Array(20).fill(null)

    popularMovies.value.results.forEach((item, index, array) => {
      array[index] = allPopular[index]
    });

    topRated.value = {}
    topRated.value.results = new Array(20).fill(null)

    topRated.value.results.forEach((item, index, array) => {
      array[index] = allTopRated[index]
    });

    nowPlaying.value = {}
    nowPlaying.value.results = new Array(20).fill(null)

    nowPlaying.value.results.forEach((item, index, array) => {
      array[index] = allNowPlaying[index]
    });

  }
  else if (currentTab.value === 1) {
    ({ data: popularMovies.value, error: popularMoviesError.value } = await useFetch('/tv/popular'));
    ({ data: topRated.value, error: topRatedError.value } = await useFetch('/tv/top_rated'));
    ({ data: nowPlaying.value, error: nowPlayingError.value } = await useFetch('/tv/on_the_air'));
  }
  else if (currentTab.value === 2) {
    ({ data: popularMovies.value, error: popularMoviesError.value } = await useFetch('/movie/popular'));
    ({ data: topRated.value, error: topRatedError.value } = await useFetch('/movie/top_rated'));
    ({ data: nowPlaying.value, error: nowPlayingError.value } = await useFetch('/movie/now_playing'));
  }

  const posterUrl = getMoviePosterUrl(nowPlaying?.value?.results[movieId.value]?.backdrop_path)
  setBackground(home.value, posterUrl)
}

onMounted(async () => {
  await initData()
})

watch(currentTab, async () => {
  await initData()
})
</script>

<style lang='scss' scoped>
.home {
  position: relative;
  padding: 80px 0px 60px 70px;
  background: var(--background);
  background-size: cover;
  background-repeat: no-repeat;

  @media (max-width: 1024px) {
    padding: 40px 0 40px 32px;
  }

  @media (max-width: 768px) {
    padding: 40px 0 40px 16px;
  }

  &__sliders {
    // padding: 85px 0px 60px;
    margin-top: 85px;

    &>* {
      &:not(:last-child) {
        margin-bottom: 35px;
      }
    }
  }

  &__background-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>