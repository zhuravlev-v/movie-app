<template>
  <div ref="rootElement" class="movie-page">
    <section class="movie-page__info">
      <RouterLink class="btn-prev" :to="btnPrev.to">
        <span>{{ btnPrev.name }}</span>
      </RouterLink>
      <div class="preview" ref="preview" v-if="movie">
        <div class="preview__inner">
          <MovieInfoBase :movie="movie" :actors="actorsHidden" />
          <div class="preview__bottom">
            <div class="preview__genres">
              <h3 class="preview__genres-title">movie</h3>
              <span class="genres" v-for="genre of movie.genres">{{ genre.name }}</span>
            </div>
            <div class="preview__rating">
              <span class="preview__rating-vote">{{ movie.vote_average.toFixed(1) }}</span>
              <img class="preview__star" src="@/assets/images/icon-star.svg" alt="" data-convertable>
              <p class="preview__rating-title">Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="movie-page__video">
      <VideoSlider :movieID="$route.params.id" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import VideoSlider from '@/components/VideoSlider.vue'
import MovieInfoBase from '@/components/MovieInfoBase.vue'
import { useFetch } from '@/service/fetch'
import { useRoute, useRouter } from 'vue-router'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'
import { setBackground } from '@/utils/setBackground'
import { parseDate } from '@/utils/parseDate'
import { convertImages } from '@/service/convertImages'

let rootElement = ref(null)
let movie = ref(null)
let movieError = ref(null)
let credits = ref(null)
let creditsError = ref(null)
let actors = ref([])
let actorsHidden = computed(() => {
  const array = [...actors.value].splice(0, 3)
  return array
})

const route = useRoute()
const router = useRouter()
let btnPrev = reactive({
  to: '/',
  name: 'Home'
})

if (router.prevRoute.name && router.prevRoute.path) {
  btnPrev.to = router.prevRoute.path
  btnPrev.name = router.prevRoute.name
}

onMounted(async () => {
  ({ data: movie.value, error: movieError.value } = await useFetch(`/movie/${route.params.id}`));
  ({ data: credits.value, error: creditsError.value } = await useFetch(`/movie/${route.params.id}/credits`));

  if (movie?.value) {
    movie.value.release_date_parsed = parseDate(movie.value.release_date, 'full')
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
  @media (max-width: 768px) {
    padding-left: 16px;
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

    &:deep {

      & svg,
      img {
        vertical-align: top;
        margin-right: 5px;
        width: 28px;
        height: 28px;
        vertical-align: super;
        margin-left: 7px;

        & path {
          fill: gold;
        }
      }
    }
  }

  &__rating-title {
    font-weight: 400;
    font-size: 22px;
    // line-height: 28px;
    text-align: right;
    letter-spacing: -0.015em;
    opacity: 0.22;
  }

  &__rating-vote {
    font-weight: 400;
    font-size: 49px;
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

  &__actors-btn {
    color: inherit;
    display: block;
    margin-top: 10px;
  }

  &__bottom {
    font-family: 'Staatliches';
    display: flex;
    justify-content: space-between;
    // margin-top: 50px;
    margin-top: auto;
  }

  &__genres {}

  &__genres-title {
    font-weight: 400;
    font-size: 49px;
    line-height: 61px;
    letter-spacing: -0.035em;
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
</style>