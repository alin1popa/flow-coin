<template>
  <div class="component">
    This is the order book
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Orderbook extends Vue {}
</script>

<style scoped>
.component {
  color: black;
  background-color: navajowhite;
  height: calc(100% - 40px);
}
</style>
