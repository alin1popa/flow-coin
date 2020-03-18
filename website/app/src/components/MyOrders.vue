<template>
  <div class="myorders">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <div class="myorders__list">
      <div class="myorders__item" v-for="order in myorders" v-bind:key="order.id" v-bind:class="{'myorders__item--buy': (order.type === 'buy'), 'myorders__item--sell': (order.type === 'sell')}">
        <span class="myorders__item__type">{{ order.type === "buy" ? "BUY" : "SELL" }}</span> 
        <span class="myorders__item__quantity">{{ order.quantity }} FC</span>
        <span class="myorders__item__rate">@ {{ order.rate }} ETH/FC</span>
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

  public actionClicked(order: Order) {
    ContractService.RetractOrder(order);
  }
}
</script>

<style scoped>
.myorders {
  color: #313132;
  height: calc(100% - 40px);
}

.myorders__list {
}

.myorders__item {
  /* border-bottom: 1px solid black; */
  padding-top: 3px;
  padding-bottom: 3px;
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

.myorders__item--buy .myorders__item__type {
  background-color: #41D8E8;
  color: #313132;
  border-radius: 3px;
}

.myorders__item--sell .myorders__item__type {
  background-color: #47FFAE;
  color: #313132;
  border-radius: 3px;
}

.myorders__item span {
  display: inline-block;
  font-weight: bold;
}

.myorders__item__address {
  /* color: #41D8E8; */
  width: 35%;
}

.myorders__item__type {
  /* background-color: #47FFAE; */
  width: 15%;
}

.myorders__item__quantity {
  /* color: #41D8E8; */
  width: 10%;
}

.myorders__item__rate {
  /* color: #47FFAE; */
  width: 25%;
}

.myorders__item__action {
  width: 15%;
}

.myorders__item button {
  background: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

</style>
