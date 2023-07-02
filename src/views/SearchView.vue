<template>
  <div class="search">
    <section class="search-block">
      <div class="search__input-block">
        <input :value="input" @input="onInputChange" @keydown.enter="onInputEnter" :placeholder="inputPlaceholder"
          type="text" class="search__input">
        <div class="search__keyboard">
          <theVirtualKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input" />
        </div>
      </div>
      <div class="search__select">
        <button @click="toggleMoviesOrTV('all')" :class="['selector', { active: moviesOrTV === 'all' }]"
          id="all">
          All
        </button>
        <button @click="toggleMoviesOrTV('tv')" :class="['selector', { active: moviesOrTV === 'tv' }]" id="tv">
          TV Shows
        </button>
        <button @click="toggleMoviesOrTV('movies')" :class="['selector', { active: moviesOrTV === 'movies' }]"
          id="movie">
          Movies
        </button>
        <button v-for="genre of genres" @click="toggleGenre(genre)" :id="genre.id"
          :class="['selector selector_active-white', { active: selectedGenres[genre.type].find(selectedGenre => selectedGenre.id === genre.id) }]">
          {{ genre.name }}
        </button>
      </div>
    </section>
    <section class="search-results">
      <SearchResultSlider v-show="searchResults.length > 0" :results="searchResults" />
      <p v-show="searchResults.length === 0" class="search-results__note">Movies/Shows not found...</p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, toRef, toRefs, reactive } from 'vue'
import { useFetch } from '@/service/fetch'
import theVirtualKeyboard from '@/components/theVirtualKeyboard.vue'
import SearchResultSlider from '@/components/SearchResultSlider.vue'

const selectedGenres = ref({
  tv: reactive([]),
  movies: reactive([]),
})
const searchResults = ref([])
let isQueryChanged = true
let moviesOrTV = ref('all')
const tvGenres = ref([])
const tvGenresError = ref(null)
const moviesGenres = ref([])
const moviesGenresError = ref(null)
const genres = computed(() => {
  if (moviesOrTV.value === 'all') {
    if (!(tvGenres?.value?.genres && moviesGenres?.value?.genres)) {
      return []
    }
    else {
      return [...tvGenres.value.genres, ...moviesGenres.value.genres]
    }
  }
  else if (moviesOrTV.value === 'tv') {
    if (!tvGenres?.value?.genres) {
      return []
    }
    else {
      return [...tvGenres.value.genres]
    }
  }
  else if (moviesOrTV.value === 'movies') {
    if (!moviesGenres?.value?.genres) {
      return []
    }
    else {
      return [...moviesGenres.value.genres]
    }
  }
})
const inputPlaceholder = ref('search')

const onResize = () => {
  if (window.innerWidth >= 768) {
    inputPlaceholder.value = 'search'
  }
  else {
    inputPlaceholder.value = 'press enter to search'
  }
}

const toggleMoviesOrTV = (id) => {
  moviesOrTV.value = id
}

const toggleGenre = (genre) => {
  const selectedIndex = selectedGenres.value[genre.type].findIndex(selectedGenre => selectedGenre.id === genre.id)

  if (selectedIndex > -1) {
    selectedGenres.value[genre.type].splice(selectedIndex, 1)
  }
  else {
    selectedGenres.value[genre.type].push(genre)
  }
}

const fetchGenres = async (genresName) => {
  if (genresName === 'all') {
    ({ data: tvGenres.value, error: tvGenresError.value } = await useFetch('/genre/tv/list?language=en'));
    ({ data: moviesGenres.value, error: moviesGenresError.value } = await useFetch('/genre/movie/list?language=en'));

    tvGenres.value.genres.forEach(genre => genre.type = 'tv')
    moviesGenres.value.genres.forEach(genre => genre.type = 'movies')
  }
  else if (genresName === 'tv') {
    ({ data: tvGenres.value, error: tvGenresError.value } = await useFetch('/genre/tv/list?language=en'));
  }
  else if (genresName === 'movies') {
    ({ data: moviesGenres.value, error: moviesGenresError.value } = await useFetch('/genre/movie/list?language=en'));
  }
}

const fetchResults = async () => {
  if (!isQueryChanged) return

  const BASE_PATH_TV_DISCOVER = '/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc'
  const BASE_PATH_MOVIES_DISCOVER = '/discover/movie?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc'
  const BASE_PATH_TV_SEARCH = '/search/tv?include_adult=false&language=en-US&page=1&query='
  const BASE_PATH_MOVIES_SEARCH = '/search/movie?include_adult=false&language=en-US&page=1&query='
  const query = input.value.trim()
  let tvResult = []
  let moviesResult = []

  if (query === '') {
    if (moviesOrTV.value === 'all') {
      // fetch TV shows with ID genres or without
      // TODO: doubling 1
      if (selectedGenres.value.tv.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_TV_DISCOVER);
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      else {
        const selectedTvIds = selectedGenres.value.tv.map(genre => genre.id).join('%2C')
        const { data, error } = await useFetch(BASE_PATH_TV_DISCOVER + '&with_genres=' + selectedTvIds);
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      // fetch movies with ID genres or without
      // TODO: doubling 2
      if (selectedGenres.value.movies.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_DISCOVER);
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      else {
        const selectedMoviesIds = selectedGenres.value.movies.map(genre => genre.id).join('%2C')
        const { data, error } = await useFetch(BASE_PATH_MOVIES_DISCOVER + '&with_genres=' + selectedMoviesIds);
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      searchResults.value = [...tvResult, ...moviesResult]
    }
    else if (moviesOrTV.value === 'tv') {
      // TODO: doubling 1
      if (selectedGenres.value.tv.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_TV_DISCOVER);
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      else {
        const selectedTvIds = selectedGenres.value.tv.map(genre => genre.id).join('%2C')
        const { data, error } = await useFetch(BASE_PATH_TV_DISCOVER + '&with_genres=' + selectedTvIds);
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      searchResults.value = [...tvResult]
    }
    else if (moviesOrTV.value === 'movies') {
      // TODO: doubling 2
      if (selectedGenres.value.movies.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_DISCOVER);
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      else {
        const selectedMoviesIds = selectedGenres.value.movies.map(genre => genre.id).join('%2C')
        const { data, error } = await useFetch(BASE_PATH_MOVIES_DISCOVER + '&with_genres=' + selectedMoviesIds);
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      searchResults.value = [...moviesResult]
    }
  }
  else { // fetch with query param
    if (moviesOrTV.value === 'all') {
      // fetch TV shows with query and ID genres or without
      if (selectedGenres.value.tv.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_TV_SEARCH + encodeURI(query));
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      else {
        const { data, error } = await useFetch(BASE_PATH_TV_SEARCH + encodeURI(query));
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
        tvResult = tvResult.filter(resultItem => {
          const genresIntersection = selectedGenres.value.tv.filter(genre => resultItem.genre_ids.includes(genre.id));
          return genresIntersection.length > 0
        })
      }
      // fetch movies with query and ID genres or without
      if (selectedGenres.value.movies.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_SEARCH + encodeURI(query));
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      else {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_SEARCH + encodeURI(query));
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
        moviesResult = moviesResult.filter(resultItem => {
          const genresIntersection = selectedGenres.value.movies.filter(genre => resultItem.genre_ids.includes(genre.id));
          return genresIntersection.length > 0
        })
      }
      searchResults.value = [...tvResult, ...moviesResult]
    }
    else if (moviesOrTV.value === 'tv') {
      // fetch TV shows with query and ID genres or without
      if (selectedGenres.value.tv.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_TV_SEARCH + encodeURI(query));
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
      }
      else {
        const { data, error } = await useFetch(BASE_PATH_TV_SEARCH + encodeURI(query));
        tvResult = data.results.map(item => ({ ...item, type: 'tv' }))
        tvResult = tvResult.filter(resultItem => {
          const genresIntersection = selectedGenres.value.tv.filter(genre => resultItem.genre_ids.includes(genre.id));
          return genresIntersection.length > 0
        })
      }
      searchResults.value = [...tvResult]
    }
    else if (moviesOrTV.value === 'movies') {
      // fetch movies with query and ID genres or without
      if (selectedGenres.value.movies.length === 0) {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_SEARCH + encodeURI(query));
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
      }
      else {
        const { data, error } = await useFetch(BASE_PATH_MOVIES_SEARCH + encodeURI(query));
        moviesResult = data.results.map(item => ({ ...item, type: 'movie' }))
        moviesResult = moviesResult.filter(resultItem => {
          const genresIntersection = selectedGenres.value.movies.filter(genre => resultItem.genre_ids.includes(genre.id));
          return genresIntersection.length > 0
        })
      }
      searchResults.value = [...moviesResult]
    }
  }
}

const input = ref('')

const onInputEnter = () => {
  onKeyPress('{enter}')
}

const onKeyPress = (button) => {
  // console.log("button", button)
  if (button === '{enter}') fetchResults()
}

const onChange = (value) => {
  input.value = value
}

const onInputChange = (event) => {
  input.value = event.target.value
}

onMounted(async () => {
  fetchGenres(moviesOrTV.value)
  onResize()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style lang='scss' scoped>
.search {
  color: #FFFFFF;
  padding: 85px 30px 0px 110px;
  display: flex;
  gap: 105px;
  height: 100vh;
  box-sizing: border-box;

  @media (max-width: 1350px) {
    gap: 50px;
    flex-direction: column;
    padding: 65px 32px 40px 32px;
    height: unset;
  }

  // /* width */
  ::-webkit-scrollbar {
    width: 10px;
    border-radius: 10px;
  }

  // /* Track */
  ::-webkit-scrollbar-track {
    background: rgba($color: #FFFFFF, $alpha: 0.22);
    border-radius: 10px;
  }

  // /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #fddd3d;
    border-radius: 10px;
  }

  &__input-block {
    @media (max-width: 1350px) {
      max-width: 530px;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.search-block {
  width: 100%;
  max-width: 420px;
  max-height: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 1350px) {
    flex-direction: row;
    justify-content: space-between;
    max-width: unset;
    max-height: 450px;
    gap: 25px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    max-height: unset;
    align-items: center;
  }
}

.search__input {
  box-sizing: border-box;
  width: 100%;
  padding: 14px 10px;
  margin-bottom: 40px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: 0.22);
  font-weight: 700;
  font-size: 40px;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  caret-color: #FFE24B;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 0;
  }

  &::placeholder {}
}

.search__keyboard {
  @media (max-width: 768px) {
    display: none;
  }
}

.search__select {
  padding: 10px 5px 0px 5px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
  overflow-y: auto;

  @media (max-width: 1350px) {
    width: 100%;
    max-width: 530px;
    padding: 10px 16px 0px 5px;
  }

  @media (max-width: 1024px) {
    max-height: 450px;
  }

  @media (max-width: 768px) {
    margin-top: 0;
  }
}

.selector {
  color: inherit;
  width: 100%;
  max-width: 340px;
  padding: 13px 20px;
  font-size: 20px;
  letter-spacing: -0.01em;
  text-align: start;
  border-radius: 5px;

  &.active {
    // border: 1px solid #FFE24B;
    outline: 1px solid #FFE24B;
  }

  &_active-white {
    &.active {
      outline: 1px solid #FFFFFF;
    }
  }
}

.search-results {
  flex-grow: 1;

  @media (max-width: 1350px) {
    max-height: 600px;
  }

  @media (max-width: 768px) {
    // max-width: 400px;
    margin: 0 auto;
  }

  &__note {
    padding-top: 14px;
    font-size: 40px;
    font-weight: 700;
  }
}
</style>