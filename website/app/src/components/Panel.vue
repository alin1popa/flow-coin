<template>
  <div class="panel" :style="style">
    <div class="panel__wrapper">
    <h1>{{ title }}</h1>
    <span class="panel__content">
      <slot>Content</slot>
    </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Panel extends Vue {
  @Prop() private color!: string;
  @Prop() private title!: string;
  get style() {
    return `background-color: ${this.color}`;
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 0;
  height: 40px;
  color: #41D8E8;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
}
.panel {
  height: 100%;
  min-height: 300px;
  padding: 10px;
}
.panel__wrapper {
  height: calc(100% - 30px);
  border: 1px solid #B63DFF;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 5px;
}
.panel__content {
}
</style>
