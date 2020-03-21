<template>
  <div class="myorders">
    <div class="myorders__list">
      <div class="myorders__item" v-for="order in myorders" v-bind:key="order.id" v-bind:class="{'myorders__item--buy': (order.type === 'buy'), 'myorders__item--sell': (order.type === 'sell')}">
        <span class="myorders__item__type"><span class="myorders__item__typelabel">{{ order.type === "buy" ? "buy" : "sell" }}</span></span> 
        <span class="myorders__item__quantity"><span class="myorders__item__number">{{ displayQuantity(order.quantity) }}</span><span class="myorders__item__unit">FC</span></span>
        <span class="myorders__item__rate"><span class="myorders__item__number">{{ displayRate(order.rate) }} </span><span class="myorders__item__unit">{{ rateUnit(order.rate) }} / FC</span></span>
        <span class="myorders__item__action"><button v-on:click="actionClicked(order)">Retract</button></span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { ContractService } from '@/services/ContractService';
import { StateManager } from '@/services/StateManager';
import { utils } from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as Helper from '@/helpers/Utils';

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
  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get balance(): number {
    return ContractService.GetBalance();
  }

  get myorders(): Order[] {
    return ContractService.GetActiveOrders(this.state);
  }

  public rateUnit(rate: BigNumber) {
    return Helper.Utils.ComputeOptimalPriceUnit(rate);
  }

  public displayQuantity(quantity: BigNumber) {
    return Helper.Utils.FormatFCCountForDisplay(quantity);
  }

  public displayRate(rate: BigNumber) {
    return utils.formatUnits(rate, this.rateUnit(rate));
  }

  public actionClicked(order: Order) {
    ContractService.RetractOrder(order);
  }
}
</script>

<style scoped>
.myorders {
  color: #313132;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.myorders__list {
}

.myorders__item {
  /* border-bottom: 1px solid black; */
  padding-top: 5px;
  padding-bottom: 3px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.myorders__item:nth-of-type(2n+1) {
  background-color: #3A3A3A;
}

.myorders__item--buy span {
  color: #41D8E8;
}

.myorders__item--sell span {
  color: #47FFAE;
}

.myorders__item--buy .myorders__item__typelabel {
  background-color: #41D8E8;
  color: #313132;
  border-radius: 3px;

  width: 50px;
  display: inline-block;
}

.myorders__item--sell .myorders__item__typelabel {
  background-color: #47FFAE;
  color: #313132;
  border-radius: 3px;

  width: 50px;
  display: inline-block;
}

.myorders__item span {
  display: inline-block;
  font-weight: bold;
}

.myorders__item__type {
  /* background-color: #47FFAE; */
  width: 25%;
}

.myorders__item__quantity {
  /* color: #41D8E8; */
  width: 15%;
}

.myorders__item__rate {
  /* color: #47FFAE; */
  width: 25%;
}

.myorders__item__action {
  width: 35%;
}

.myorders__item button {
  background: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.myorders__item__unit {
  font-size: 11px;
}

.myorders__item__number {
  display: block;
  width: 100%;
}

</style>
