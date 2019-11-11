<template>
  <div class="orderbook">
    <div class="orderbook__list">
      <div class="orderbook__item" v-for="order in orderbook" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ order.address }} </span>
        <span class="orderbook__item__type">{{ order.type + "s" }}</span> 
        <span class="orderbook__item__quantity">{{ order.quantity }} FC</span>
        <span class="orderbook__item__rate">{{ displayRate(order.rate) }} ETH/FC</span>
        <span class="orderbook__item__action"><button v-on:click="actionClicked(order)">Action</button></span>
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

  get orderbook(): Order[] {
    return ContractService.GetOrderbook(this.state);
  }

  public displayRate(rate: BigNumber) {
    return utils.formatUnits(rate, 'ether');
  }

  public actionClicked(order: Order) {
    alert(JSON.stringify(order));
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
