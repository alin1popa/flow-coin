<template>
  <div class="place-order">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <div v-if=true>
      <input type="number" name="ratio" v-model="ratio"/>
      <input type="number" name="amount" v-model="amount"/>
      <input type="checkbox" name="type" v-model="type"/>

      {{ disclaimerText }}
      <button name="submit" value="submit" v-bind:disabled="!isLoading" v-on:click="submitOrder()">{{ isLoading ? 'Place Order' : 'Pending...'}}</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { ContractService } from '@/services/ContractService';
import { StateManager } from '@/services/StateManager';
import { Request } from '@/models/Request';
import { RequestType } from '../constants/RequestType';

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

enum VIEW_ORDER_TYPE {
  BUY = 1,
  SELL = 0
}

export default class PlaceOrder extends Vue {
  private ratio: number = 1;
  private amount: number = 1;
  private type: VIEW_ORDER_TYPE = VIEW_ORDER_TYPE.BUY;
  private isLoading: boolean = false;

  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get disclaimerText(): string {
    return `I want to ${this.type === VIEW_ORDER_TYPE.BUY ? 'buy' : 'sell'} ${this.amount} of FC at ${this.ratio} ethers each`
  }

  get balance(): number {
    return ContractService.GetBalance();
  }

  public submitOrder() {
    this.isLoading = true;

    const request = new Request(
      this.type === VIEW_ORDER_TYPE.BUY ? OrderType.BUY : OrderType.SELL,
      RequestType.REGULAR,
      this.amount,
      this.ratio
    );

    ContractService.PlaceOrderRequest(request);
    this.isLoading = false; // TODO this should be a .then()
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
