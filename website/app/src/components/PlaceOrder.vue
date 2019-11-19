<template>
  <div class="place-order">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <input type="checkbox" name="type" v-model="priceType"/>

    <span>{{ orderTitle }}</span>
    <div>
      <div v-if=priceType>
        <input type="number" name="ratio" v-model="ratio"/>
      </div>
      <input type="number" name="amount" v-model="amount"/>
      <input type="checkbox" name="type" v-model="orderType"/>

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

enum ViewOrderType {
  SELL = 0,
  BUY = 1,
}

enum ViewPriceType {
  FIXED = 0,
  MARKET = 1,
}

function mapViewOrderTypeToOrderType(type: ViewOrderType) {
  return type === ViewOrderType.BUY ? OrderType.BUY : OrderType.SELL;
}

function mapViewPriceTypeToRequestType(type: ViewPriceType) {
  return type === ViewPriceType.FIXED ? RequestType.REGULAR : RequestType.MARKET;
}

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
  private orderType: ViewOrderType = ViewOrderType.BUY;
  private priceType: ViewPriceType = ViewPriceType.FIXED;
  private isLoading: boolean = false;

  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get orderTitle(): string {
    if (this.priceType === ViewPriceType.FIXED) {
      return "Place fixed price order";
    }
    else {
      return "Place market price order";
    }
  }

  get disclaimerText(): string {
    if (this.priceType === ViewPriceType.FIXED) {
      return `I want to ${
        this.orderType === ViewOrderType.BUY ? 'buy' : 'sell'
        } ${this.amount} of FC at ${this.ratio} ethers each`;
    }
    else {
      return `I want to ${
        this.orderType === ViewOrderType.BUY ? 'buy' : 'sell'
        } ${this.amount} of FC at the best current market price`;
    }
  }

  get balance(): number {
    return ContractService.GetBalance();
  }

  public submitOrder() {
    this.isLoading = true;

    const request = new Request(
      mapViewOrderTypeToOrderType(this.orderType),
      mapViewPriceTypeToRequestType(this.priceType),
      this.amount,
      this.ratio,
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
