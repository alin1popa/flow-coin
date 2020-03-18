<template>
  <div class="orderbook">
    <div class="orderbook__list">
      <div class="orderbook__item orderbook__item--sell" v-for="order in sellOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ order.address }} </span>
        <span class="orderbook__item__type">sells</span> 
        <span class="orderbook__item__quantity">{{ order.quantity }} FC</span>
        <span class="orderbook__item__rate">{{ displayRate(order.rate) }} ETH/FC</span>
      </div>
    </div>

    <div class="orderbook__list">
      <div class="orderbook__item orderbook__item--buy" v-for="order in buyOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ order.address }} </span>
        <span class="orderbook__item__type">buys</span> 
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
  height: calc(100% - 40px);
}

.orderbook__list {
  height: calc(50% - 10px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.orderbook__list:first-of-type {
  margin-bottom: 10px;
}

.orderbook__item span {
  display: inline-block;
  font-weight: bold;
}

.orderbook__item {
  padding-top: 3px;
  padding-bottom: 3px;
}

.orderbook__item--buy span {
  color: #41D8E8;
}

.orderbook__item--sell span {
  color: #47FFAE;
}

.orderbook__item:nth-of-type(2n+1) {
  background-color: #3A3A3A;
}

.orderbook__item__address {
  width: 35%;
}

.orderbook__item__type {
  width: 15%;
}

.orderbook__item--buy .orderbook__item__type {
  background-color: #41D8E8;
  color: #313132;
  border-radius: 3px;
}

.orderbook__item--sell .orderbook__item__type {
  background-color: #47FFAE;
  color: #313132;
  border-radius: 3px;
}

.orderbook__item__quantity {
  width: 10%;
}

.orderbook__item__rate {
  width: 25%;
}
</style>
