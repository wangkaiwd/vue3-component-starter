<template>
  <div class="w-icon">

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { iconProps } from './prop';

export default defineComponent({
  name: 'WIcon',
  props: iconProps,
  setup () {
    return {};
  },
});
</script>

<style lang="less" scoped>
.w-icon {

}
</style>
