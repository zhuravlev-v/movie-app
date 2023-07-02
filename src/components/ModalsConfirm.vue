<template>
  <VueFinalModal class="confirm-modal" content-class="confirm-modal-content" overlay-transition="vfm-fade"
    content-transition="vfm-fade">
    <!-- <slot /> -->
    <div class="confirm-modal__content">
      <iframe class="confirm-modal__video" :src="`https://www.youtube.com/embed/${videoKey}`" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    </div>
    <button class="confirm-modal__close-btn" @click="emit('confirm')">
      <img class="confirm-modal__close-btn-img" src="@/assets/images/icon-close.svg" alt="">
    </button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  videoKey?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  /* padding: 1rem;
  background: #fff; */
  border-radius: 0.5rem;
}

.confirm-modal-content>*+* {
  margin: 0.5rem 0;
}

.confirm-modal-content h1 {
  font-size: 1.375rem;
}

.confirm-modal-content button {
  margin: 0.25rem 0 0 auto;
  padding: 0 8px;
  /* border: 1px solid; */
  border-radius: 0.5rem;
}

.dark .confirm-modal-content {
  background: #000;
}

.vfm__content {
  position: relative;
  width: 85%;
  max-height: 95%;
  aspect-ratio: 16/9;
}

.confirm-modal__content {
  width: 100%;
  height: 100%;
}

.confirm-modal__video {
  width: 100%;
  height: 100%;
}

.confirm-modal__close-btn {
  /* border: none; */
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
}

.confirm-modal__close-btn-img {}
</style>