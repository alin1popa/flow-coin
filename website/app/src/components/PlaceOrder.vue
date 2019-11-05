<template>
  <div class="place-order">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <div v-if=true>
      <input type="number" name="ratio"/>
      <input type="number" name="amount"/>
      <input type="radio" name="type" value="buy"/>
      <input type="radio" name="type" value="sell"/>

      <button name="submit" value="submit">Place {{ balance }} Order</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { ContractService } from '@/services/ContractService';
import { StateManager } from '@/services/StateManager';

@Component<PlaceOrder>({
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
export default class PlaceOrder extends Vue {
  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get balance(): number {
    return ContractService.GetBalance();
  }

  public actionClicked(order: Order) {
    alert(JSON.stringify(order));
  }
}
</script>

<style scoped>
.place-order {
  color: black;
  background-color: navajowhite;
  height: calc(100% - 40px);
}

</style>
