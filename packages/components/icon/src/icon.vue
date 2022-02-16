<template>
  <i class="w-icon" :style="style">
  </i>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { iconProps } from './prop';

export default defineComponent({
  name: 'WIcon',
  props: iconProps,
  setup (props) {
    const style = computed(() => {
      const result: Partial<CSSStyleDeclaration> = {};
      const { color, size } = props;
      if (props.size) {result.fontSize = size + 'px';}
      if (props.color) {result.color = color;}
      return result;
    });
    return {
      style
    };
  },
});
</script>
