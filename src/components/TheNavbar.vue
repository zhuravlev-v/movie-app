<template>
  <nav class="navbar">
    <div class="navbar__inner">
      <NavbarItem v-for="(path, index) of routesPath" :link="path" :icon="routesIcon[index]" :key="index" />
    </div>
  </nav>
</template>

<script>
import { defineComponent, ref, toRefs, toRef, reactive } from 'vue'
import NavbarItem from '@/components/NavbarItem.vue';
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TheNavbar',
  components: { NavbarItem },
  props: {},
  setup(props, context) {
    // const whiteList = ['home', 'search', 'credit', 'account']
    const whiteList = ['home', 'search']
    const router = useRouter()
    // TODO: refactor this declaration
    const routesPath = reactive(router.getRoutes().map(route => {
      if (whiteList.includes(route.name)) return route.path
    }).filter(route => route !== undefined))
    const routesIcon = [
      'icon-home.svg',
      'icon-loupe.svg',
      'icon-credit.svg',
      'icon-account.svg',
    ]

    return {
      routesPath,
      routesIcon
    }
  }
})

</script>

<style lang='scss' scoped>
.navbar {
  flex-shrink: 0;
  flex-basis: 68px;
  position: relative;

  @media (max-width: 1024px) {
    background-color: $color-black;
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    height: 68px;
    width: 100%;
  }

  &__inner {
    position: fixed;
    height: 100%;
    width: 68px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 1024px) {
      position: static;
      flex-direction: row;
      width: 100%;
    }
  }
}

p {
  color: #fff;
  font-size: 25px;
}
</style>