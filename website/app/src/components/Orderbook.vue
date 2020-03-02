<template>
  <div class="orderbook">
    <div class="orderbook__list">
      <div class="orderbook__item" v-for="order in buyOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ order.address }} </span>
        <span class="orderbook__item__type">buys</span> 
        <span class="orderbook__item__quantity">{{ order.quantity }} FC</span>
        <span class="orderbook__item__rate">{{ displayRate(order.rate) }} ETH/FC</span>
      </div>
    </div>

    <div class="orderbook__list">
      <div class="orderbook__item" v-for="order in sellOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ order.address }} </span>
        <span class="orderbook__item__type">sells</span> 
        <span class="orderbook__item__quantity">{{ order.quantity }} FC</span>
        <span class="orderbook__item__rate">{{ displayRate(order.rate) }} ETH/FC</span>
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
import { BigNumber } from 'ethers/utils';
import { utils } from 'ethers';

@Component
export default class Orderbook extends Vue {
  private state = StateManager.GetInstance().GetState();

  get buyOrders(): Order[] {
     const orderbook = ContractService.GetOrderbook(this.state);
     return orderbook.buyOrders;
  }

  get sellOrders(): Order[] {
    const orderbook = ContractService.GetOrderbook(this.state);
    return orderbook.sellOrders;
  }

  public displayRate(rate: BigNumber) {
    return utils.formatUnits(rate, 'ether');
  }
}
</script>

<style scoped>
.orderbook {
  color: black;
  background-color: navajowhite;
  height: calc(100% - 40px);
}

.orderbook__list {
  background-color: lightblue;
  border: 1px solid black;
  height: calc(50% - 10px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.orderbook__list:first-of-type {
  margin-bottom: 10px;
}

.orderbook__item span {
  display: inline-block;
}

.orderbook__item__address {
  background-color: limegreen;
  width: 35%;
}

.orderbook__item__type {
  background-color: rebeccapurple;
  width: 15%;
}

.orderbook__item__quantity {
  background-color: olive;
  width: 10%;
}

.orderbook__item__rate {
  background-color: orchid;
  width: 25%;
}

.orderbook__item__action {
  background-color: teal;
  width: 15%;
}
</style>
