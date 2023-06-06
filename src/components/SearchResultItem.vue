<template>
  <RouterLink to="/" @click.prevent="onClick(movie)" class="block">
    <div class="block__img">
      <img :src="getMoviePoster(item.poster_path)" loading="lazy" alt="">
    </div>
    <h3 class="block__title">
      {{ item.type === 'movie' ? item.title : item.name }}
      <span class="block__title-year">({{ releaseDate }})</span>
    </h3>
    <p class="block__desc">{{ overviewClipped }}</p>
    <p class="block__year">{{ releaseDate }}</p>
  </RouterLink>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMoviePosterUrl } from '@/service/getMoviePosterUrl'
import { parseDate } from '@/utils/parseDate'

export default defineComponent({
  name: 'SearchResultItem',
  components: {},
  props: {
    item: { type: Object, required: true }
  },
  setup(props, context) {
    const MAX_OVERVIEW_CHARS = 180

    const router = useRouter()

    const onClick = () => {
      if (props.item.type === 'movie') {
        router.push(`movie/${props.item.id}`)
      }
      else {
        router.push(`series/${props.item.id}`)
      }
    }

    const getMoviePoster = (url) => {
      return url === null ? new URL('@/assets/images/search-item-placeholder.jpeg', import.meta.url).href : getMoviePosterUrl(url, 'w342')
    }

    const releaseDate = computed(() => {
      if (props.item.type === 'movie') {
        return parseDate(props.item.release_date, 'year')
      }
      else {
        return parseDate(props.item.first_air_date, 'year')
      }
    })

    const overviewClipped = computed(() => {
      return props.item.overview.length <= MAX_OVERVIEW_CHARS ?
        props.item.overview :
        props.item.overview.split('').splice(0, MAX_OVERVIEW_CHARS).join('') + '…'
    })

    return {
      onClick,
      getMoviePoster,
      releaseDate,
      overviewClipped
    }
  }
})
</script>

<style lang='scss' scoped>
.block {
  display: grid;
  grid-template-columns: 156px 1fr 100px;
  column-gap: 25px;
  padding: 20px;
  transition: color 0.1s ease;
  max-width: 1125px;

  &:hover {
    color: rgba($color: #FFFFFF, $alpha: 0.22);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-content: center;
    gap: 15px;
  }

  &__img {
    width: 156px;
    height: 156px;
    border-radius: 19px;
    position: relative;
    grid-row: 1/3;
    align-self: center;

    @media (max-width: 768px) {
      justify-self: center;
      grid-row: 2/3;
      grid-column: 1/2;
    }

    &::after {
      content: ' ';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(22, 22, 22, 0.16) 59.12%, #212121 100%);
      border-radius: inherit;
    }

    & img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
    }
  }

  &__title {}

  &__title-year {
    display: none;

    @media (max-width: 768px) {
      display: inline-block;
    }
  }

  &__desc {
    grid-column: 2/3;
    grid-row: 2/3;

    @media (max-width: 768px) {
      grid-column: 1/2;
      grid-row: 3/4;
    }
  }

  &__year {
    padding-top: 30%;
    // align-self: center;
    grid-column: 3/4;
    grid-row: 1/3;

    @media (max-width: 768px) {
      grid-row: 1/2;
      grid-column: 2/3;
      padding: 0;
      display: none;
    }
  }
}
</style>