<template>
  <div ref="rootElement" class="movie-page">
    <section class="movie-page__info">
      <RouterLink class="btn-prev" :to="btnPrev.to">
        <span>{{ btnPrev.name }}</span>
      </RouterLink>
      <div class="preview" ref="preview" v-if="movie">
        <div class="preview__inner">
          <MovieInfoBase :movie="movie" :actors="actorsHidden" :seasonIndex="seasonIndex" />
          <div :class="['preview__bottom', { preview__bottom_mb: movie.seasons.length > 3 }]">
            <div class="preview__genres">
              <h3 v-if="movie.seasons.length < 4" class="preview__genres-title">
                <span v-for="(season, index) of movie.seasons" @click="setSeason(index)">{{ season.name }}</span>
              </h3>
              <Multiselect v-else v-model="seasonIndex"
                :options="movie.seasons.reduce((options, season, index, array) => options = [...options, { value: index, label: season.name }], [])" />
              <span class="genres" v-for="genre of movie.genres">{{ genre.name }}</span>
            </div>
            <div class="preview__episodes">
              <p class="preview__episodes-count">{{ movie.seasons[seasonIndex].episode_count }}</p>
              <p class="preview__episodes-text">Episodes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="movie-page__video">
      <VideoSlider :movieID="$route.params.id" type="tv" />
    </section>
  </div>
</template>

<script setup>
import VideoSlider from '@/components/VideoSlider.vue'
import Multiselect from '@vueform/multiselect'
import MovieInfoBase from '@/components/MovieInfoBase.vue'
import '@vueform/multiselect/themes/default.css'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/service/fetch'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'
import { convertImages } from '@/service/convertImages'
import { setBackground } from '@/utils/setBackground'
import { parseDate } from '@/utils/parseDate'

let rootElement = ref(null)
const route = useRoute()
const router = useRouter()
let movie = ref(null)
let movieError = ref(null)
let credits = ref(null)
let creditsError = ref(null)
let actors = ref([])
let actorsHidden = computed(() => {
  const array = [...actors.value].splice(0, 3)
  return array
})
let btnPrev = reactive({
  to: '/',
  name: 'Home'
})
const seasonIndex = ref(0)
const setSeason = (index) => {
  seasonIndex.value = index
}
const overview = computed(() => {
  if (movie) {
    return movie.value.seasons[seasonIndex.value].overview === '' ? movie.value.overview : movie.value.seasons[seasonIndex.value].overview
  }
  else {
    return ''
  }
})

if (router.prevRoute.name && router.prevRoute.path) {
  btnPrev.to = router.prevRoute.path
  btnPrev.name = router.prevRoute.name
}


onMounted(async () => {
  ({ data: movie.value, error: movieError.value } = await useFetch(`/tv/${route.params.id}`));
  ({ data: credits.value, error: creditsError.value } = await useFetch(`/tv/${route.params.id}/credits`));

  if (movie?.value) {
    movie.value.release_date_parsed = parseDate(movie.value.first_air_date, 'full')
    const posterUrl = movie.value.backdrop_path ? getMoviePosterUrl(movie.value.backdrop_path) : getMoviePosterUrl(movie.value.poster_path)
    setBackground(rootElement.value, posterUrl)
  }
  if (credits?.value) {
    actors.value = credits.value.cast.map(actor => actor.original_name)
  }

  convertImages(rootElement.value, '[data-convertable]')
})

</script>

<style lang='scss' scoped>
.movie-page {
  background: var(--background);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;

  @media (max-width: 1350px) {
    flex-direction: column;
  }

  &__info {
    padding-top: 40px;
    width: 60%;
    display: flex;
    flex-direction: column;

    @media (max-width: 1350px) {
      width: 100%;
    }
  }

  &__video {
    width: 40%;

    @media (max-width: 1350px) {
      width: 100%;
      padding-bottom: 40px;
    }
  }
}

.btn-prev {
  color: #FFFFFF;
  display: block;
  margin-right: auto;
  margin-bottom: 85px;
  width: max-content;
  padding-left: 32px;

  @media (max-width: 1350px) {
    margin-bottom: 40px;
  }

  &:hover {
    &::before {
      transform: translateX(3px);
    }
  }

  &::before {
    content: ' ';
    background-image: url('@/assets/images/icon-arrow.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 8px;
    height: 12px;
    margin-right: 15px;
    transition: transform 0.15s ease-out;
  }
}

.preview {
  text-align: start;
  color: #FFFFFF;
  max-width: 635px;
  padding: 0px 0px 40px 85px;
  flex-grow: 1;
  display: flex;

  @media (max-width: 1350px) {
    max-width: 100%;
    padding: 0 32px 40px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 40px;
  }

  & .tabs {
    margin-bottom: 55px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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

  &__bottom {
    font-family: 'Staatliches';
    display: flex;
    gap: 20px;
    justify-content: space-between;
    // margin-top: 50px;
    margin-top: auto;

    &_mb {
      margin-bottom: 50px;
    }
  }

  &__genres {
    flex-grow: 1;
  }

  &__genres-title {
    font-weight: 400;
    font-size: 49px;
    // line-height: 61px;
    letter-spacing: -0.035em;

    display: flex;
    flex-wrap: wrap;
    column-gap: 25px;
    row-gap: 0px;

    & span {
      cursor: pointer;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__episodes {}

  &__episodes-count {
    font-weight: 400;
    font-size: 49px;
    line-height: 1.24em;
    text-align: right;
    letter-spacing: -0.01em;

  }

  &__episodes-text {
    font-weight: 400;
    font-size: 22px;
    line-height: 1.27em;
    text-align: right;
    letter-spacing: -0.015em;
    color: rgba($color: #FFFFFF, $alpha: 0.22);
  }
}

.genres {
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
  letter-spacing: -0.015em;
  opacity: 0.22;

  &:not(:last-child) {
    &::after {
      content: ' / ';
    }
  }
}

.multiselect.is-active {
  box-shadow: unset;
}

.multiselect {
  color: #ffffff;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ms-border-color, #d1d5db);
  border-radius: 0;

  @media (max-width: 1350px) {
    width: 100%;
    max-width: 500px;
    margin: 0 auto 0 0;
  }

  @media (max-width: 768px) {
    max-width: 320px;
  }

  @media (max-width: 500px) {
    max-width: 200px;
  }

  &:deep() {
    & .multiselect-wrapper {
      @media (max-width: 1350px) {
        justify-content: flex-start;
      }
    }

    & .multiselect-single-label {
      padding-left: 0;
      font-size: 49px;

      @media (max-width: 1350px) {
        position: static;
      }

      @media (max-width: 768px) {
        padding-right: 10px;
      }
    }

    & .multiselect-option {
      color: #000000;
    }

    & .multiselect-option.is-selected {
      background-color: #d1d5db;
    }

    & .multiselect-dropdown {
      max-height: 100px;
    }

    & .multiselect-clear {
      display: none;
    }
  }
}
</style>