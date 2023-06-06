<template>
  <swiper 
    @swiper="onSwiper" 
    :slides-per-view="'auto'" 
    :space-between="8" 
    :modules="modules" 
    :mousewheel="true"
    :initialSlide="0" 
    direction="vertical" 
    class="slider"
  >
    <swiper-slide v-for="result of results">
      <SearchResultItem :item="result" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from "swiper";
import 'swiper/scss';
import 'swiper/css/mousewheel';
import SearchResultItem from '@/components/SearchResultItem.vue'

export default defineComponent({
  name: 'SearchResultSlider',
  components: {
    Swiper,
    SwiperSlide,
    SearchResultItem
  },
  props: {
    results: { type: Array, required: true }
  },
  setup(props, context) {

    const onSwiper = (swiper) => {
      // TODO: set initialSlide = last slide 
      // swiperInstance.value = swiper
      // swiperInstance.value.params.initialSlide
    };

    return {
      modules: [Mousewheel],
      onSwiper
    }
  }
})
</script>

<style lang='scss' scoped>
.slider {
  max-height: 100%;

  @media (max-width: 1350px) {
    height: 500px;
  }

  // @media (max-width: 768px) {
  //   max-width: 400px;
  // }

  & .swiper-slide {
    @media (max-width: 1350px) {
      height: max-content;
    }
  }
}
</style>