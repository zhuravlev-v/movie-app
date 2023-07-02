<template>
  <div class="video" @click="open">
    <img class="video-poster" :src="`https://img.youtube.com/vi/${video.key}/0.jpg`" alt="">
  </div>
</template>

<script setup>
import { useModal } from 'vue-final-modal'
import ModalsConfirm from '@/components/ModalsConfirm.vue'

const props = defineProps({
  video: { type: Object, required: true }
})

const { open, close } = useModal({
  component: ModalsConfirm,
  attrs: {
    videoKey: props.video.key,
    onConfirm() {
      close()
    },
  },
  // slots: {
  //   default: '<p>The content of the modal</p>',
  // },
})
</script>

<style lang='scss' scoped>
.video {
  box-shadow: 0px 0px 42px rgba(22, 22, 22, 0.16);
  background-color: #000000;
  position: relative;
  width: 435px;
  aspect-ratio: 1/1;
  border-radius: 20px;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 350px;
  }

  @media (max-width: 768px) {
    width: 290px;
  }

  &:hover {
    &::after {
      transform: translate(-50%, -50%) scale(1.4);
    }
  }

  &::before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, rgba(22, 22, 22, 0.1136) 58.22%, rgba(33, 33, 33, 0.71) 100%);
  }

  &::after {
    content: ' ';
    display: block;
    width: 72px;
    height: 72px;
    background-image: url('@/assets/images/icon-play-btn.svg');
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease-in;
  }
}

.video-poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>