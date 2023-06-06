<template>
  <div class="movie-slider">
    <div class="movie-slider__swiper">
      <swiper @swiper="onSwiper" :slides-per-view="'auto'" :space-between="50" :centeredSlides="false" :modules="modules"
        :mousewheel="true" :initialSlide="0" :breakpoints="options.breakpoints" direction="horizontal">
        <swiper-slide v-for="video of videos">
          <VideoBlock :video="video" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from "swiper";
import VideoBlock from '@/components/VideoBlock.vue'
import { useFetch } from '@/service/fetch'
import 'swiper/scss';
import 'swiper/css/mousewheel';

export default defineComponent({
  name: 'VideoSlider',
  components: {
    Swiper,
    SwiperSlide,
    VideoBlock
  },
  props: {
    movieID: { type: String, required: true },
    type: { type: String, required: false, default: 'movie' }
  },
  setup(props, context) {
    // const swiperInstance = ref(null)

    const onSwiper = (swiper) => {
      // TODO: set initialSlide = last slide 
      // swiperInstance.value = swiper
      // swiperInstance.value.params.initialSlide
    };

    const SLIDES_MAX = 10
    let videosData = ref(null)
    let videosDataError = ref(null)
    let videos = ref([])
    const options = ref({
      breakpoints: {
        1350: {
          direction: "vertical",
          centeredSlides: true,
        }
      }
    })

    onMounted(async () => {
      ({ data: videosData.value, error: videosDataError.value } = await useFetch(`/${props.type}/${props.movieID}/videos`));

      if (videosData?.value?.results?.length > SLIDES_MAX) {
        videos.value = videosData.value.results.splice(0, SLIDES_MAX)
      }
      else {
        videos.value = videosData.value.results
      }

    })

    return {
      onSwiper,
      modules: [Mousewheel],
      videos,
      // videosDataError
      options
    }
  }
})
</script>

<style lang='scss' scoped>
.movie-slider {
  max-height: 100vh;
  height: 100%;

  &__swiper {
    max-width: 100%;
    height: 100%;
  }

  & .swiper {
    max-height: 100vh;
    height: 100%;
    // padding-bottom: 300px;

    @media (max-width: 1024px) {
      padding-left: 32px;
    }

    @media (max-width: 768px) {
      padding-left: 16px;
    }
  }

  & .swiper-wrapper {
    // @media (max-width: 1024px) {
    //   padding-left: 32px;
    // }

    // @media (max-width: 768px) {
    //   padding-left: 16px;
    // }
  }

  & .swiper-slide {
    width: max-content;
    height: max-content;
    color: black;
    border-radius: 10px;
    user-select: none;

    // &:first-child {
    //   @media (max-width: 1024px) {
    //     margin-left: 32px;
    //   }
    //   @media (max-width: 768px) {
    //     margin-left: 16px;
    //   }
    // }

    &:last-child {
      margin-right: 50px;
    }
  }
}
</style>