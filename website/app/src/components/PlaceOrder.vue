<template>
  <div class="place-order">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <input type="checkbox" name="type" v-model="isMarketPrice"/>

    <span>{{ orderTitle }}</span>
    <div>
      <div v-if=!isMarketPrice>
        <input type="number" name="ratio" v-model="ratio"/>
      </div>
      <input type="number" name="amount" v-model="amount"/>
      <input type="checkbox" name="type" v-model="isBuyOrder"/>

      {{ disclaimerText }}
      <button name="submit" value="submit" v-bind:disabled="isLoading" v-on:click="submitOrder()">{{ !isLoading ? 'Place Order' : 'Pending...'}}</button>
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
import { parseEther, bigNumberify } from 'ethers/utils';

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
  private ratio: number = 1;
  private amount: number = 1;
  private isBuyOrder: boolean = true;
  private isMarketPrice: boolean = false;
  private isLoading: boolean = false;

  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get orderTitle(): string {
    if (!this.isMarketPrice) {
      return 'Place fixed price order';
    } else {
      return 'Place market price order';
    }
  }

  get disclaimerText(): string {
    if (!this.isMarketPrice) {
      return `I want to ${
        this.isBuyOrder ? 'buy' : 'sell'
        } ${this.amount} of FC at ${this.ratio} ethers each`;
    } else {
      return `I want to ${
        this.isBuyOrder ? 'buy' : 'sell'
        } ${this.amount} of FC at the best current market price`;
    }
  }

  get balance(): number {
    return ContractService.GetBalance();
  }

  public submitOrder() {
    this.isLoading = true;

    const request = new Request(
      this.isBuyOrder ? OrderType.BUY : OrderType.SELL,
      this.isMarketPrice ? RequestType.MARKET : RequestType.REGULAR,
      bigNumberify(this.amount.toString()),
      parseEther(this.ratio.toString()),
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
