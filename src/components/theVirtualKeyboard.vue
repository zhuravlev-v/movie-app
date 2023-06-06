<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import Keyboard from "simple-keyboard"
import "simple-keyboard/build/css/index.css"

export default defineComponent({
  name: 'theVirtualKeyboard',
  components: {},
  emits: ['onChange', 'onKeyPress'],
  props: {
    keyboardClass: { type: String, default: "simple-keyboard" },
    input: { type: String }
  },
  setup(props, { emit }) {
    let keyboard = ref(null)

    function onChange(input) {
      emit("onChange", input);
    }

    function onKeyPress(button) {
      emit("onKeyPress", button);
      // If you want to handle the shift and caps lock buttons
      if (button === "{shift}" || button === "{lock}") handleShift();
    }

    function handleShift() {
      let currentLayout = keyboard.value.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      keyboard.value.setOptions({
        layoutName: shiftToggle
      });
    }

    watch(() => props.input, (input) => {
      keyboard.value.setInput(input);
    })

    onMounted(() => {
      keyboard.value = new Keyboard(props.keyboardClass, {
        onChange,
        onKeyPress,
      })
    })

    return {
      keyboard
    }
  }
})
</script>

<style lang='scss' scoped>
:global(.hg-theme-default .hg-button) {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.0056) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
:global(.hg-theme-default .hg-button.hg-activeButton) {
  background: unset;
  opacity: 0.8;
}

.simple-keyboard {
  color: #FFFFFF;
  background-color: transparent;

  &:deep() {}
}
</style>
