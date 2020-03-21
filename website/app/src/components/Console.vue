<template>
  <div class="console">
    <div class="console__item" v-for="log in logs" v-bind:key="log.id">
      {{ log.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { StateManager, ILog } from '@/services/StateManager';

@Component<MyOrders>({
  mounted() {
    const x = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    x.then(() => {
      // this.$set(this.cs, 'val', 'duuuude');
      this.state.val = 'duuuuuuude';
    });
  },
})
export default class MyOrders extends Vue {
  private state = StateManager.GetInstance().GetState();

  get logs(): ILog[] {
    return this.state.logs;
  }
}
</script>

<style scoped>
.console {
  font-family: 'Courier New', Courier, monospace;
  text-align: left;
  font-size: 12px;
  color: #5498FF;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.console__item {
  padding-left: 20px;
  word-wrap: break-word;
}

</style>
