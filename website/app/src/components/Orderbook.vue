<template>
  <div class="orderbook">
    <div class="orderbook__list">
      <div class="orderbook__item orderbook__item--sell" v-for="order in sellOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ displayAddress(order.address) }} </span>
        <span class="orderbook__item__type"><span class="orderbook__item__typelabel">sells</span></span> 
        <span class="orderbook__item__quantity"><span class="orderbook__item__number">{{ displayQuantity(order.quantity) }}</span><span class="orderbook__item__unit">FC</span></span>
        <span class="orderbook__item__rate"><span class="orderbook__item__number">{{ displayRate(order.rate) }} </span><span class="orderbook__item__unit">{{ rateUnit(order.rate) }} / FC</span></span>
      </div>
    </div>

    <div class="orderbook__list">
      <div class="orderbook__item orderbook__item--buy" v-for="order in buyOrders" v-bind:key="order.id">
        <span class="orderbook__item__address">{{ displayAddress(order.address) }} </span>
        <span class="orderbook__item__type"><span class="orderbook__item__typelabel">buys</span></span> 
        <span class="orderbook__item__quantity"><span class="orderbook__item__number">{{ displayQuantity(order.quantity) }}</span><span class="orderbook__item__unit">FC</span></span>
        <span class="orderbook__item__rate"><span class="orderbook__item__number">{{ displayRate(order.rate) }} </span><span class="orderbook__item__unit">{{ rateUnit(order.rate) }} / FC</span></span>
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
import * as Helper from '@/helpers/Utils'; 
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

  public rateUnit(rate: BigNumber) {
    return Helper.Utils.ComputeOptimalPriceUnit(rate);
  }

  public displayQuantity(quantity: BigNumber) {
    return Helper.Utils.FormatFCCountForDisplay(quantity);
  }

  public displayRate(rate: BigNumber) {
    return utils.formatUnits(rate, this.rateUnit(rate));
  }

  public displayAddress(address: string) {
    return Helper.Utils.FormatAddressForDisplay(address);
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
  padding-top: 5px;
  padding-bottom: 3px;

  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 25%;
}

.orderbook__item__type {
  width: 25%;
  position:relative;
  left: 10px;
}

.orderbook__item--buy .orderbook__item__typelabel {
  background-color: #41D8E8;
  color: #313132;
  border-radius: 3px;

  width: 50px;
  display: inline-block;
}

.orderbook__item--sell .orderbook__item__typelabel {
  background-color: #47FFAE;
  color: #313132;
  border-radius: 3px;

  width: 50px;
  display: inline-block;
}

.orderbook__item__quantity {
  width: 25%;
}

.orderbook__item__rate {
  width: 25%;
}

.orderbook__item__unit {
  font-size: 11px;
}

.orderbook__item__number {
  display: block;
  width: 100%;
}
</style>
