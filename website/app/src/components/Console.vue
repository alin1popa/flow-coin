<template>
  <div class="console" id="console">
    <div class="console__item" v-for="log in logs" v-bind:key="log.id">
      <span class="console__datetime">{{ log.time }}:</span> {{ log.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { StateManager, ILog } from '@/services/StateManager';
import * as Helper from '@/helpers/Utils';

@Component<MyOrders>({
  mounted() {
    Helper.Utils.scrollToBottom('console');
  },
  updated() {
    Helper.Utils.scrollToBottom('console');
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

.console__datetime {
  font-weight: bold;
  color: rgb(41, 189, 125);
}

</style>
